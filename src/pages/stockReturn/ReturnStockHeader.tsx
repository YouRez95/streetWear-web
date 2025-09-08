import { Progress } from "@/components/ui/progress";
import { useGetSummaryReturnStock } from "@/hooks/useReturnStock";

import {
  PackageCheck,
  PackageOpen,
  PackageSearch,
  PackageX,
  UserCheck2,
} from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  total: <PackageCheck className="w-5 h-5 text-muted-foreground" />,
  available: <PackageOpen className="w-5 h-5 text-muted-foreground" />,
  used: <PackageX className="w-5 h-5 text-muted-foreground" />,
  clients: <UserCheck2 className="w-5 h-5 text-muted-foreground" />,
  topProduct: <PackageSearch className="w-5 h-5 text-muted-foreground" />,
};

type Stat = {
  key: "total" | "available" | "used" | "clients" | "topProduct";
  label: string;
  value: number | string;
  subValue?: number | string;
  subLabel?: string;
  percentage?: number;
};

export default function ReturnStockHeader() {
  const { data, isLoading } = useGetSummaryReturnStock();

  const totalReturned = data?.summary?.total || 0;
  const available = data?.summary?.available || 0;
  const used = data?.summary?.used || 0;
  const clientCount = data?.summary?.clientCount || 0;
  const topProduct = data?.summary?.topProduct || "Unknown - 0 pcs";

  const stats: Stat[] = [
    {
      key: "total",
      label: "Total articles retournés",
      value: totalReturned,
      subValue: totalReturned,
      subLabel: "Total pièces",
    },
    {
      key: "available",
      label: "Quantité disponible",
      value: available,
      percentage: totalReturned ? (available / totalReturned) * 100 : 0,
    },
    {
      key: "used",
      label: "Quantité utilisée",
      value: used,
      percentage: totalReturned ? (used / totalReturned) * 100 : 0,
    },
    {
      key: "clients",
      label: "Clients ayant retourné",
      value: clientCount,
    },
    {
      key: "topProduct",
      label: "Produit le plus retourné",
      value: topProduct,
    },
  ];

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full">
      {stats.map((stat, index) => (
        <div
          key={stat.key}
          className={`flex flex-col gap-2 bg-foreground rounded-lg p-3 shadow-sm border ${
            index === stats.length - 1
              ? "col-span-2 lg:col-span-2 xl:col-span-1"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 bg-secondary rounded-full flex-shrink-0">
              {iconMap[stat.key]}
            </div>
            <div className="flex flex-col leading-none truncate">
              <p className="text-base font-medium text-background truncate">
                {stat.label}
              </p>
              <p className="text-lg font-semibold font-bagel leading-snug truncate">
                {typeof stat.value === "number"
                  ? stat.value.toLocaleString()
                  : stat.value}
                {stat.key !== "topProduct" && " pcs"}
              </p>
              {stat.subValue !== undefined && stat.subLabel && (
                <p className="text-sm text-background truncate">
                  {stat.subLabel}:{" "}
                  {typeof stat.subValue === "number"
                    ? stat.subValue.toLocaleString()
                    : stat.subValue}{" "}
                  pcs
                </p>
              )}
            </div>
          </div>

          {stat.percentage !== undefined && (
            <div className="space-y-1">
              <Progress value={stat.percentage} className="h-1" />
              <p className="text-[10px] text-background text-right">
                {stat.percentage.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
