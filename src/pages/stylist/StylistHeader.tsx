import { useStylistSummary } from "@/hooks/useStylist";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import {
  CreditCard,
  HandCoins,
  List,
  Send,
  Wallet,
  Wallet2,
} from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-6 h-6 text-muted-foreground" />,
  totalOrderItems: <List className="w-6 h-6 text-muted-foreground" />,
  totalValueSent: <Wallet className="w-6 h-6 text-muted-foreground" />,
  totalAdvances: <HandCoins className="w-6 h-6 text-muted-foreground" />,
  totalAvancesRestantes: <Wallet2 className="w-6 h-6 text-muted-foreground" />,
  totalPaid: <CreditCard className="w-6 h-6 text-muted-foreground" />,
};

type Stat = {
  key:
    | "totalOrderItems"
    | "totalQuantitySent"
    | "totalValueSent"
    | "totalAdvances"
    | "totalAvancesRestantes"
    | "totalPaid";
  label: string;
  value: string | number;
  percentage?: number;
};

export default function StylistHeader() {
  const { selectedStylistId, selectedStylistBonId } = useUserStore();
  const { data: dataSummary } = useStylistSummary(
    selectedStylistId,
    selectedStylistBonId
  );

  const totalValue = dataSummary?.summary?.totalValueSent || 0;
  const totalAdvances = dataSummary?.summary?.totalAdvances || 0;
  const remaining = totalValue - totalAdvances;
  const percentPaid = (totalAdvances / totalValue) * 100 || 0;

  const stats: Stat[] = [
    {
      key: "totalOrderItems",
      label: "Nombre de commandes",
      value: dataSummary?.summary?.totalOrderItems || 0,
    },
    {
      key: "totalQuantitySent",
      label: "Quantité envoyée",
      value: dataSummary?.summary?.totalQuantitySent || 0,
    },
    {
      key: "totalValueSent",
      label: "Montant total",
      value: totalValue,
    },
    {
      key: "totalPaid",
      label: "Montant payé",
      value: totalAdvances,
      percentage: percentPaid,
    },
    {
      key: "totalAvancesRestantes",
      label: "Montant restant",
      value: remaining,
    },
    {
      key: "totalAdvances",
      label: "Avances reçues",
      value: totalAdvances,
      percentage: percentPaid,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full">
      {stats.map((stat) => {
        // const isMoney =
        //   stat.key === 'totalValueSent' ||
        //   stat.key === 'totalPaid' ||
        //   stat.key === 'totalAvancesRestantes' ||
        //   stat.key === 'totalAdvances'

        const suffix =
          stat.key === "totalQuantitySent"
            ? "pcs"
            : stat.key === "totalOrderItems"
            ? "commandes"
            : "Dhs";

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
                {stat.percentage !== undefined && (
                  <div
                    className={cn(
                      "sm:flex items-center gap-1 p-1 px-3 mt-2 rounded-full text-sm font-medium hidden",
                      stat.percentage > 99.99
                        ? "bg-secondary/10 text-secondary"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    <span>{stat.percentage.toFixed(1)}%</span>
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
