import { useGetSummaryReturnStock } from "@/hooks/useReturnStock";
import { cn } from "@/lib/utils";
import {
  PackageCheck,
  PackageOpen,
  PackageSearch,
  PackageX,
  UserCheck2,
} from "lucide-react";
import { type JSX } from "react";

const iconMap: Record<string, JSX.Element> = {
  total: <PackageCheck className="w-6 h-6 text-muted-foreground" />,
  available: <PackageOpen className="w-6 h-6 text-muted-foreground" />,
  used: <PackageX className="w-6 h-6 text-muted-foreground" />,
  clients: <UserCheck2 className="w-6 h-6 text-muted-foreground" />,
  topProduct: <PackageSearch className="w-6 h-6 text-muted-foreground" />,
};

type Stat = {
  key: "total" | "available" | "used" | "clients" | "topProduct";
  label: string;
  value: string | number;
  percentage?: number;
};

export default function ReturnStockHeader() {
  const { data } = useGetSummaryReturnStock();
  const initialData = {
    totalReturned: 0,
    available: 0,
    used: 0,
    clientCount: 0,
    topProduct: "Unknown - 0 pcs",
  };
  if (data?.summary) {
    const { total, available, used, clientCount, topProduct } = data.summary;
    initialData.totalReturned = total || 0;
    initialData.available = available || 0;
    initialData.used = used || 0;
    initialData.clientCount = clientCount || 0;
    initialData.topProduct = topProduct || "Unknown - 0 pcs";
  }

  const { totalReturned, available, used, clientCount, topProduct } =
    initialData;

  const stats: Stat[] = [
    {
      key: "total",
      label: "Total articles retournés",
      value: `${totalReturned} pcs`,
    },
    {
      key: "available",
      label: "Quantité disponible",
      value: `${available} pcs`,
      percentage: (available / totalReturned) * 100 || 0,
    },
    {
      key: "used",
      label: "Quantité utilisée",
      value: `${used} pcs`,
      percentage: (used / totalReturned) * 100 || 0,
    },
    {
      key: "clients",
      label: "Clients ayant retourné",
      value: `${clientCount} clients`,
    },
    {
      key: "topProduct",
      label: "Produit le plus retourné",
      value: topProduct,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {stats.map((stat) => (
        <div
          key={stat.key}
          className="flex items-center gap-4 bg-foreground rounded-xl p-5 shadow-sm border min-h-24"
        >
          <div className="p-3 bg-secondary rounded-full">
            {iconMap[stat.key]}
          </div>
          <div className="flex flex-col gap-0">
            <p className="text-base text-primary/90">{stat.label}</p>
            <div className="flex items-center gap-4">
              <p className="text-2xl font-semibold font-bagel">{stat.value}</p>
              {stat.percentage !== undefined && (
                <div
                  className={cn(
                    "flex items-center gap-1 p-1 px-3 rounded-full text-sm font-medium",
                    stat.percentage > 0
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
      ))}
    </div>
  );
}
