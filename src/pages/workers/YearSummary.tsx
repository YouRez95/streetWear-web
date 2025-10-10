import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useYearRecords } from "@/hooks/useWorkers";
import { useYearStore } from "@/store/workerStore";
import { ArrowUpRight } from "lucide-react";
import { useEffect } from "react";

type YearSummaryProps = {
  setTotalYear: React.Dispatch<React.SetStateAction<string | null>>;
  setNextYear: React.Dispatch<React.SetStateAction<string>>;
  setPrevYear: React.Dispatch<React.SetStateAction<string>>;
};

export default function YearSummary({
  setTotalYear,
  setNextYear,
  setPrevYear,
}: YearSummaryProps) {
  const { workplaceId, year } = useYearStore();
  const { data, isPending, isError } = useYearRecords(year, workplaceId);

  useEffect(() => {
    if (data && data.records) {
      const total = data.records.reduce(
        (acc, month) => acc + month.totalAmount,
        0
      );
      setTotalYear(total.toFixed(0));
      setNextYear(data.nextYear?.toString() || "");
      setPrevYear(data.prevYear?.toString() || "");
    } else {
      setTotalYear(null);
    }
  }, [data]);

  if (!year || workplaceId === "") {
    return (
      <div className="text-center text-gray-500">
        Veuillez sélectionner une année et un lieu de travail.
      </div>
    );
  }

  if (isPending) {
    return <div className="text-center my-10">Loading...</div>;
  }

  if (isError) {
    return <div>Error loading data.</div>;
  }

  if (data.status === "failed") {
    return (
      <div className="text-center text-red-500">
        Erreur : {data.message || "Something wrong"}
      </div>
    );
  }

  if (data && data.records && data.records.length === 0) {
    return (
      <div className="text-center text-gray-500">
        Aucun enregistrement trouvé pour cette année.
      </div>
    );
  }

  const dataMonths = data.records ? data.records : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {dataMonths.map((month) => (
        <CardMonth key={month.name} month={month} />
      ))}
    </div>
  );
}

type Month = {
  name: string;
  weeks: {
    weekText: string;
    totalAmount: number;
  }[];
  totalAmount: number;
};

export function CardMonth({ month }: { month: Month }) {
  return (
    <Card className="w-full max-w-sm shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between py-0">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-indigo-400 text-white p-4 rounded-t-lg">
        <CardTitle className="text-lg md:text-xl font-semibold flex items-center gap-2">
          {month.name}
          <ArrowUpRight className="w-4 h-4" />
        </CardTitle>
      </CardHeader>

      <CardContent className="p-2 flex-1">
        <div className="flex flex-col gap-1">
          {month.weeks.map((week, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <span className=" text-gray-700">{week.weekText}</span>
              <span className="font-medium text-gray-900">
                {week.totalAmount.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 border-t">
        <span className="font-medium text-gray-500">Total du mois:</span>
        <span className="text-lg font-bold text-gray-900">
          {month.totalAmount.toFixed(0)}
        </span>
      </CardFooter>
    </Card>
  );
}
