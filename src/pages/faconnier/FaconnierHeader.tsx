import { useFaconnierSummary } from "@/hooks/useFaconnier";
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

// type FaconnierHeaderProps = {
//   selectedFaconnierId: string
//   selectedBonId: string
// }

export default function FaconnierHeader() {
  const { selectedFaconnierId, selectedBonId } = useUserStore();
  const { data: dataSummary } = useFaconnierSummary(
    selectedFaconnierId,
    selectedBonId
  );
  const stats: Stat[] = [
    {
      key: "totalQuantitySent",
      label: "Articles envoyés",
      value: dataSummary?.summary?.totalQuantitySent || 0,
    },
    {
      key: "totalQuantityReturned",
      label: "Articles retournés",
      value: dataSummary?.summary?.totalQuantityReturned || 0,
    },
    {
      key: "totalQuantityRestants",
      label: "Articles restantes",
      value:
        (dataSummary?.summary?.totalQuantitySent || 0) -
        (dataSummary?.summary?.totalQuantityReturned || 0),
    },
    {
      key: "totalValueSent",
      label: "Montant total à payer",
      value: dataSummary?.summary?.totalValueSent || 0,
    },
    {
      key: "totalAdvances",
      label: "Total des avances",
      value: dataSummary?.summary?.totalAdvances || 0,
    },
    {
      key: "totalAvancesRestantes",
      label: "Total des avances restantes",
      value:
        (dataSummary?.summary?.totalValueSent || 0) -
        (dataSummary?.summary?.totalAdvances || 0),
    },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 w-full">
      {stats.map((stat) => {
        return (
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
                <p className="text-2xl font-semibold font-bagel">
                  {stat.value}{" "}
                  {stat.key === "totalQuantitySent" ||
                  stat.key === "totalQuantityReturned" ||
                  stat.key === "totalQuantityRestants"
                    ? "pcs"
                    : "dhs"}
                </p>
                {/* {stat.key !== 'totalQuantitySent' && stat.key !== 'totalValueSent' && (
                  <div
                    className={cn(
                      'flex items-center gap-1 p-1 px-3 mt-2 rounded-full text-sm font-medium'
                    )}
                  >
                    {stat.key === 'totalAdvances' && (
                      <span className="bg-primary text-white font-bold px-2 rounded-xl">
                        {stat.reste} dhs
                      </span>
                    )}
                    {stat.key === 'totalQuantityReturned' && <span> {stat.reste} pcs</span>}
                  </div>
                )} */}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
