import { useFaconnierSummary } from "@/hooks/useFaconnier";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import {
  CreditCard,
  PackageMinus,
  Send,
  Undo2,
  Wallet,
  Wallet2,
} from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-6 h-6 text-muted-foreground" />,
  totalQuantityReturned: <Undo2 className="w-6 h-6 text-muted-foreground" />,
  totalValueSent: <Wallet className="w-6 h-6 text-muted-foreground" />,
  totalAdvances: <CreditCard className="w-6 h-6 text-muted-foreground" />,
  totalQuantityRestants: (
    <PackageMinus className="w-6 h-6 text-muted-foreground" />
  ),
  totalAvancesRestantes: <Wallet2 className="w-6 h-6 text-muted-foreground" />,
};

type Stat = {
  key:
    | "totalQuantitySent"
    | "totalQuantityReturned"
    | "totalValueSent"
    | "totalAdvances"
    | "totalQuantityRestants"
    | "totalAvancesRestantes";
  label: string;
  value: string | number;
};

export default function FaconnierHeader() {
  const { selectedFaconnierId, selectedBonId } = useUserStore();
  const { data: dataSummary } = useFaconnierSummary(
    selectedFaconnierId,
    selectedBonId
  );

  const totalSent = dataSummary?.summary?.totalQuantitySent || 0;
  const totalReturned = dataSummary?.summary?.totalQuantityReturned || 0;
  const totalRestants = totalSent - totalReturned;

  const totalValue = dataSummary?.summary?.totalValueSent || 0;
  const totalAdvances = dataSummary?.summary?.totalAdvances || 0;
  const remainingValue = totalValue - totalAdvances;
  const percentPaid = (totalAdvances / totalValue) * 100 || 0;

  const stats: Stat[] = [
    {
      key: "totalQuantitySent",
      label: "Articles envoyés",
      value: totalSent,
    },
    {
      key: "totalQuantityReturned",
      label: "Articles retournés",
      value: totalReturned,
    },
    {
      key: "totalQuantityRestants",
      label: "Articles restants",
      value: totalRestants,
    },
    {
      key: "totalValueSent",
      label: "Montant total à payer",
      value: totalValue,
    },
    {
      key: "totalAdvances",
      label: "Total des avances",
      value: totalAdvances,
    },
    {
      key: "totalAvancesRestantes",
      label: "Total des avances restantes",
      value: remainingValue,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full">
      {stats.map((stat) => {
        const suffix =
          stat.key === "totalQuantitySent" ||
          stat.key === "totalQuantityReturned" ||
          stat.key === "totalQuantityRestants"
            ? "pcs"
            : "Dhs";

        const showPercentage =
          stat.key === "totalAdvances" || stat.key === "totalAvancesRestantes";

        return (
          <div
            key={stat.key}
            className="flex items-center gap-2 md:gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24"
          >
            <div className="p-3 scale-75 md:scale-100 bg-secondary rounded-full">
              {iconMap[stat.key]}
            </div>
            <div className="flex flex-col gap-0">
              <p className="text-sm md:text-base text-primary/90">
                {stat.label}
              </p>
              <div className="flex items-center gap-4">
                <p className="text-base md:text-2xl font-semibold font-bagel truncate">
                  {stat.value} {suffix}
                </p>

                {showPercentage && (
                  <div
                    className={cn(
                      "sm:flex items-center gap-1 p-1 px-3 mt-2 rounded-full text-sm font-medium hidden",
                      percentPaid > 99.99
                        ? "bg-secondary/10 text-secondary"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    <span>{percentPaid.toFixed(1)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
