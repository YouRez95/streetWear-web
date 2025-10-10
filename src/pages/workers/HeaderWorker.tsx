import { Button } from "@/components/ui/button";
import { useSummaryWorker } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { Calendar, Clock, DollarSign, Table, Users } from "lucide-react";

export default function HeaderWorkerSummary() {
  const { currentView, setCurrentView, workerId } = useWorkerStore();

  const { data, isPending } = useSummaryWorker(workerId);

  const summaryData = data?.summary || {
    totalOvertimeHours: 0,
    totalRegularHours: 0,
    totalSpent: 0,
    totalWeeks: 0,
    totalAdvances: 0,
    workerName: "",
  };

  const totalHours =
    summaryData.totalRegularHours + summaryData.totalOvertimeHours;

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
                <h1 className="text-2xl lg:text-4xl font-bold text-white mb-1">
                  {summaryData.workerName}
                </h1>
                <p className="text-blue-100 text-sm font-medium">
                  Résumé complet des performances
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-300" />
                  <div>
                    <p className="text-xs font-medium text-blue-100">
                      Semaines travaillées
                    </p>
                    <p className="text-xl font-bold text-white">
                      {isPending ? "..." : summaryData.totalWeeks}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20 shadow-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-300" />
                  <div>
                    <p className="text-xs font-medium text-blue-100">
                      Coût total
                    </p>
                    <p className="text-xl font-bold text-white">
                      {isPending
                        ? "..."
                        : `${summaryData.totalSpent.toFixed(0)} DHS`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle Buttons */}
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

        {/* Enhanced Loading indicator */}
        {workerId && isPending && (
          <div className="mt-6 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 w-fit">
            <div className="relative">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white shadow-lg"></div>
            </div>
            <p className="text-sm text-white font-medium">
              Chargement du résumé...
            </p>
          </div>
        )}

        {/* Summary Details Grid */}
        {!isPending && data?.summary && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-3 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Heures Totales
              </p>
              <p className="text-lg font-bold text-white">
                {totalHours.toFixed(1)}h
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-3 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Heures Régulières
              </p>
              <p className="text-lg font-bold text-white">
                {summaryData.totalRegularHours.toFixed(1)}h
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-3 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Heures Supplémentaires
              </p>
              <p className="text-lg font-bold text-white">
                {summaryData.totalOvertimeHours.toFixed(1)}h
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-3 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Semaines Travaillées
              </p>
              <p className="text-lg font-bold text-white">
                {summaryData.totalWeeks}
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-3 border border-white/20">
              <p className="text-xs text-blue-200 font-medium">
                Avances Totales
              </p>
              <p className="text-lg font-bold text-white">
                {summaryData.totalAdvances.toFixed(0)} DHS
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
