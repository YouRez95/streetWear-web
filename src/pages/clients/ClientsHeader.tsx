import { useClientSummary } from "@/hooks/useClients";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { CreditCard, List, Send, Undo2, Wallet, Wallet2 } from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  totalQuantitySent: <Send className="w-6 h-6 text-muted-foreground" />,
  totalQuantityReturned: <Undo2 className="w-6 h-6 text-muted-foreground" />,
  totalValueSent: <Wallet className="w-6 h-6 text-muted-foreground" />,
  totalAdvances: <CreditCard className="w-6 h-6 text-muted-foreground" />,
  totalAvancesRestantes: <Wallet2 className="w-6 h-6 text-muted-foreground" />,
  totalOrderItems: <List className="w-6 h-6 text-muted-foreground" />,
};

type Stat = {
  key:
    | "totalQuantitySent"
    | "totalQuantityReturned"
    | "totalValueSent"
    | "totalAdvances"
    | "totalAvancesRestantes"
    | "totalOrderItems";
  label: string;
  value: string | number;
  percentage?: number;
};

export default function ClientsHeader() {
  const { selectedClientId, selectedClientBonId } = useUserStore();
  const { data: dataSummary } = useClientSummary(
    selectedClientId,
    selectedClientBonId
  );

  const totalValue = dataSummary?.summary?.totalValueSent || 0;
  const totalAdvances = dataSummary?.summary?.totalAdvances || 0;
  const remaining = totalValue - totalAdvances;

  const stats: Stat[] = [
    {
      key: "totalOrderItems",
      label: "Nombre de commandes",
      value: dataSummary?.summary?.totalOrderItems || 0,
    },
    {
      key: "totalQuantitySent",
      label: "Articles envoyés",
      value: dataSummary?.summary?.totalQuantitySent || 0,
    },
    {
      key: "totalQuantityReturned",
      label: "Articles retournés",
      value: dataSummary?.summary?.totalQuantityReturned || 0,
      percentage:
        ((dataSummary?.summary?.totalQuantityReturned || 0) /
          (dataSummary?.summary?.totalQuantitySent || 1)) *
        100,
    },
    {
      key: "totalValueSent",
      label: "Montant à régler",
      value: totalValue,
    },
    {
      key: "totalAdvances",
      label: "Avances versées",
      value: totalAdvances,
      percentage: (totalAdvances / (totalValue || 1)) * 100,
    },
    {
      key: "totalAvancesRestantes",
      label: "Montant restant",
      value: remaining,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 w-full">
      {stats.map((stat) => {
        const suffix =
          stat.key === "totalQuantitySent" ||
          stat.key === "totalQuantityReturned"
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
