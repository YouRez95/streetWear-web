import { Progress } from "@/components/ui/progress";
import { useSummary } from "@/hooks/useDashboard";
import { Scissors, User2, Users } from "lucide-react";
import { type JSX } from "react";

const CardGroup = ({
  title,
  icon,
  open,
  closed,
  total,
  advances,
  remaining,
}: {
  title: string;
  icon: JSX.Element;
  open: number;
  closed: number;
  total: number;
  advances: number;
  remaining: number;
}) => {
  const advancePercentage = (advances / (total || 1)) * 100;

  return (
    <div className="flex flex-col bg-foreground p-4 rounded-xl border shadow-sm min-w-[250px] w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-lg font-semibold">{title}</p>
        <div className="p-2 bg-secondary rounded-full">{icon}</div>
      </div>

      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-background">Bons ouverts / fermés</span>
        <span className="font-medium">
          {open} / {closed}
        </span>
      </div>

      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-background">Montant total</span>
        <span className="font-medium">{total.toLocaleString()} dhs</span>
      </div>

      <div className="flex items-center justify-between mb-1 text-sm">
        <span className="text-background">Avances versées</span>
        <span className="font-medium">{advances.toLocaleString()} dhs</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-background">Montant restant</span>
        <span className="font-medium">{remaining.toLocaleString()} dhs</span>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs mb-1 text-background">
          <span>Avancement des avances</span>
          <span>{advancePercentage.toFixed(1)}%</span>
        </div>
        <Progress value={advancePercentage} className="h-2" />
      </div>
    </div>
  );
};

export default function DashboardSummaryHeader() {
  const { data } = useSummary();

  if (!data?.summary) return null;

  const { client, faconnier, stylist } = data.summary;

  console.log("Summary data:", data.summary);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full">
      <CardGroup
        title="Clients"
        icon={<Users className="w-5 h-5 text-muted-foreground" />}
        open={client.openBons}
        closed={client.closedBons}
        total={client.totalAmount}
        advances={client.totalAdvances}
        remaining={client.remainingAmount}
      />
      <CardGroup
        title="Façonniers"
        icon={<Scissors className="w-5 h-5 text-muted-foreground" />}
        open={faconnier.openBons}
        closed={faconnier.closedBons}
        total={faconnier.totalAmount}
        advances={faconnier.totalAdvances}
        remaining={faconnier.remainingAmount}
      />
      <CardGroup
        title="Stylistes"
        icon={<User2 className="w-5 h-5 text-muted-foreground" />}
        open={stylist.openBons}
        closed={stylist.closedBons}
        total={stylist.totalAmount}
        advances={stylist.totalAdvances}
        remaining={stylist.remainingAmount}
      />
    </div>
  );
}
