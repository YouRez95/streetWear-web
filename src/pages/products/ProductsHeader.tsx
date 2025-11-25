import { Progress } from "@/components/ui/progress";
import { useGetAllProductsStatus } from "@/hooks/useProduct";
import {
  PackageCheck,
  PackageOpen,
  PackageSearch,
  PackageX,
  UserCheck2,
} from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  total: <PackageSearch className="w-5 h-5 text-muted-foreground" />,
  stock: <PackageX className="w-5 h-5 text-muted-foreground" />,
  faconnier: <PackageOpen className="w-5 h-5 text-muted-foreground" />,
  ready: <PackageCheck className="w-5 h-5 text-muted-foreground" />,
  client: <UserCheck2 className="w-5 h-5 text-muted-foreground" />,
};

type Stat = {
  key: "total" | "stock" | "faconnier" | "ready" | "client";
  label: string;
  value: number;
  subValue?: number;
  subLabel?: string;
  percentage?: number;
};

export default function ProductsHeader() {
  const { data, isLoading } = useGetAllProductsStatus();

  const totalPcs =
    (data?.totalStatusResult.raw_in_stock || 0) +
    (data?.totalStatusResult.quantity_at_faconnier || 0) +
    (data?.totalStatusResult.quantity_ready || 0) +
    (data?.totalStatusResult.quantity_with_client || 0) +
    (data?.totalStatusResult.quantity_returned_client || 0);

  const stats: Stat[] = [
    {
      key: "total",
      label: "Total des produits",
      value: data?.totalProducts || 0,
      subValue: totalPcs,
      subLabel: "Total des pièces",
    },
    {
      key: "stock",
      label: "En stock (brut)",
      value: data?.totalStatusResult.raw_in_stock || 0,
      percentage:
        ((data?.totalStatusResult.raw_in_stock || 0) / totalPcs) * 100 || 0,
    },
    {
      key: "faconnier",
      label: "Chez le façonnier",
      value: data?.totalStatusResult.quantity_at_faconnier || 0,
      percentage:
        ((data?.totalStatusResult.quantity_at_faconnier || 0) / totalPcs) *
          100 || 0,
    },
    {
      key: "ready",
      label: "Prêt",
      value: data?.totalStatusResult.quantity_ready || 0,
      percentage:
        ((data?.totalStatusResult.quantity_ready || 0) / totalPcs) * 100 || 0,
    },
    {
      key: "client",
      label: "Chez le client",
      value: data?.totalStatusResult.quantity_with_client || 0,
      percentage:
        ((data?.totalStatusResult.quantity_with_client || 0) / totalPcs) *
          100 || 0,
    },
  ];

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 w-full">
      {stats.map((stat, index) => {
        return (
          <div
            key={stat.key}
            className={`flex flex-col gap-2 bg-foreground rounded-lg p-3 shadow-sm border ${
              index === stats.length - 1
                ? "col-span-2 lg:col-span-2 xl:col-span-1"
                : ""
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="p-2 bg-secondary rounded-full">
                {iconMap[stat.key]}
              </div>
              <div className="flex flex-col leading-none">
                <p className="text-base font-medium text-background">
                  {stat.label}
                </p>
                <p className="text-lg font-semibold font-bagel leading-snug">
                  {stat.value.toLocaleString()}{" "}
                  {stat.key === "total" ? "produits" : "pcs"}
                </p>
                {stat.subValue !== undefined && stat.subLabel && (
                  <p className="text-sm text-background">
                    {stat.subLabel}: {stat.subValue.toLocaleString()} pcs
                  </p>
                )}
              </div>
            </div>

            {stat.percentage && (
              <div className="space-y-1">
                <Progress value={stat.percentage} className="h-1" />
                <p className="text-[10px] text-background text-right">
                  {stat.percentage.toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
