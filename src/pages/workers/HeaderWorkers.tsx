import { Button } from "@/components/ui/button";
import { useSummaryWorkers } from "@/hooks/useWorkers";
import { useWorkerStore, useYearStore } from "@/store/workerStore";
import { Calendar, DollarSign, Table, TrendingUp, Users } from "lucide-react";

export default function HeaderWorkers({
  totalYear,
}: {
  totalYear: string | null;
}) {
  const { currentView, setCurrentView, weekName, workplaceId, weekId } =
    useWorkerStore();
  const { year, workplaceId: workplaceIdYear } = useYearStore();

  const workplaceActive =
    currentView === "weekly" ? workplaceId : workplaceIdYear;

  const { data, isPending } = useSummaryWorkers({
    weekId,
    workplaceId: workplaceActive,
  });

  const summaryData = data?.summary || {
    totalWorkers: 0,
    inactiveWorkers: 0,
    totalRegularHours: 0,
    totalOvertimeHours: 0,
    totalSpent: 0,
    totalWeeks: 0,
    totalAdvances: 0,
    restApayer: 0,
  };
  const totalWorkers = summaryData.totalWorkers;
  const totalHours =
    summaryData.totalRegularHours + summaryData.totalOvertimeHours;
  const totalSpent = summaryData.totalSpent;
  const totalAdvances = summaryData.totalAdvances;
  const totalRestApayer = summaryData.restApayer;

  return (
    <div className="relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-secondary rounded-xl"></div>
      <div className="absolute inset-0 bg-black/5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full blur-2xl translate-y-36 -translate-x-36"></div>

      <div className="relative px-6 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Title and Stats Section */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl lg:text-4xl font-bold text-white mb-1">
                  Gestion des Travailleurs
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  Gérez et suivez vos équipes efficacement
                </p>
              </div>
            </div>

            {/* Stats Groups */}
            {currentView === "yearly" && (
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4 border border-white/20 shadow-lg flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-emerald-300" />
                <div>
                  <p className="text-xs font-medium text-blue-100">
                    Coût total annuel
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {isPending ? "..." : totalYear}
                  </p>
                </div>
              </div>
            )}
            {currentView === "weekly" && (
              <div className="flex flex-col gap-4 w-full">
                {/* Top 3 main KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Employees */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4 border border-white/20 shadow-lg flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-xs font-medium text-blue-100">
                        Employés
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {isPending ? "..." : totalWorkers}
                      </p>
                    </div>
                  </div>

                  {/* Total Spent */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4 border border-white/20 shadow-lg flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-green-300" />
                    <div>
                      <p className="text-xs font-medium text-blue-100">
                        Coût total
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {isPending ? "..." : `${totalSpent.toFixed(0)} DHS`}
                      </p>
                    </div>
                  </div>

                  {/* Reste à payer */}
                  <div className="bg-white/15 backdrop-blur-md rounded-xl px-5 py-4 border border-white/20 shadow-lg flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="text-xs font-medium text-blue-100">
                        Reste à Payer
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {isPending
                          ? "..."
                          : `${totalRestApayer.toFixed(0)} DHS`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secondary KPIs row */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm">
                    Avances : {totalAdvances.toFixed(0)} DHS
                  </span>

                  <span className="text-white/90 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-sm">
                    Coût après avances :{" "}
                    {(totalSpent - totalAdvances).toFixed(0)} DHS
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>
              <div className="relative flex bg-white/15 backdrop-blur-xl rounded-3xl p-2 border border-white/30 shadow-2xl">
                <Button
                  variant={currentView === "weekly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("weekly")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-500 ${
                    currentView === "weekly"
                      ? "bg-gradient-to-r from-white to-white/95 text-blue-700 shadow-xl scale-105 border border-white/20"
                      : "text-white/90 hover:text-white hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  <Table className="h-4 w-4" />
                  Hebdomadaire
                </Button>
                <Button
                  variant={currentView === "yearly" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentView("yearly")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-semibold transition-all duration-500 ${
                    currentView === "yearly"
                      ? "bg-gradient-to-r from-white to-white/95 text-blue-700 shadow-xl scale-105 border border-white/20"
                      : "text-white/90 hover:text-white hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  Annuel
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Period Indicator */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-pulse shadow-lg"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400/40 rounded-full animate-ping"></div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <p className="text-sm text-white font-semibold">
                {currentView === "weekly"
                  ? `📅 ${
                      weekName ? `${weekName}` : "Sélectionner une semaine"
                    }`
                  : `🗓️ ${year ? year : "Sélectionner une année"}`}
              </p>
            </div>
          </div>

          {/* Enhanced Loading indicator */}
          {isPending && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <div className="relative">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white shadow-lg"></div>
              </div>
              <p className="text-sm text-white font-medium">
                Synchronisation...
              </p>
            </div>
          )}
        </div>

        {/* Additional summary info */}
        {currentView === "weekly" && data?.summary && !isPending && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Heures Totales
              </p>
              <p className="text-sm font-bold text-white">
                {totalHours.toFixed(1)}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Heures Régulières
              </p>
              <p className="text-sm font-bold text-white">
                {summaryData.totalRegularHours || 0}h
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Heures Supplémentaires
              </p>
              <p className="text-sm font-bold text-white">
                {summaryData.totalOvertimeHours || 0}h
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Semaines Travaillées
              </p>
              <p className="text-sm font-bold text-white">
                {summaryData.totalWeeks || 0}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
