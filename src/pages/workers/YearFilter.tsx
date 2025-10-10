import { useYearStore } from "@/store/workerStore";
import SelectWorkplaceFilter from "./SelectWorkplaceFilter";
import SelectYearFilter from "./SelectYearFilter";

export const YearFilter = ({ totalYear }: { totalYear: string | null }) => {
  const { setWorkplaceId, workplaceId, year, setYear } = useYearStore();

  const handleChangeWorkplaceFilter = (value: string) => {
    setWorkplaceId(value);
  };

  const handleChangeYear = (value: string) => {
    setYear(value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 ">
      {/* Total for the whole year */}
      <div className="flex flex-col gap-1">
        <span className="text-sm text-gray-500">Total pour l'année</span>
        <span className="text-2xl font-bold text-gray-800">
          {totalYear} DHS
        </span>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mt-4 md:mt-0 items-center">
        <div className="w-full md:w-auto">
          <SelectWorkplaceFilter
            value={workplaceId}
            onValueChange={handleChangeWorkplaceFilter}
          />
        </div>

        <div className="w-full md:w-auto">
          <SelectYearFilter
            value={year ? year : undefined}
            onValueChange={handleChangeYear}
          />
        </div>
      </div>
    </div>
  );
};
