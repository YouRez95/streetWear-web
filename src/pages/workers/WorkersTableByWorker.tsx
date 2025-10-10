import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useWorkerRecords } from "@/hooks/useWorkers";
import {
  Check,
  Clock,
  Coins,
  HandCoins,
  Info,
  Pencil,
  Trash,
  Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteRecordDialog } from "./DeleteRecordDialog";
import EditRecordDialog from "./EditRecordDialog";
import { PaymentModal } from "./PaymentModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type WorkerRecordEdit = {
  id: string;
  name: string;
  lundi: number;
  lundiSupp: number;
  mardi: number;
  mardiSupp: number;
  mercredi: number;
  mercrediSupp: number;
  jeudi: number;
  jeudiSupp: number;
  vendredi: number;
  vendrediSupp: number;
  samedi: number;
  samediSupp: number;
  description: string | null;
  avance: number;
};

type WorkerRecordsTableProps = {
  workerId: string;
  page: number;
  setTotalPages: (totalPages: number) => void;
  limit: number;
};

export const WorkerRecordsTable = ({
  workerId,
  page,
  limit,
  setTotalPages,
}: WorkerRecordsTableProps) => {
  const { data, isPending, isError } = useWorkerRecords(page, limit, workerId);
  const [editingRecord, setEditingRecord] = useState<WorkerRecordEdit | null>(
    null
  );
  const [deleteRecordId, setDeleteRecordId] = useState<string | null>(null);
  const [deleteRecordName, setDeleteRecordName] = useState<string | null>(null);

  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    recordId: string | null;
    reste: number | null;
    type: "pay" | "undo";
    workerName: string | null;
  }>({
    open: false,
    recordId: null,
    reste: null,
    workerName: null,
    type: "pay",
  });

  useEffect(() => {
    if (data && data.pagination) {
      setTotalPages(data.pagination.totalPages);
    }
  }, [data]);

  if (!workerId) {
    return (
      <div className="text-background/50 text-center my-10">
        Veuillez sélectionner un employé
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="p-4 text-sm flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        Chargement des données...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-sm text-red-500 flex items-center gap-2">
        <span>❌</span>
        Erreur lors du chargement des données
      </div>
    );
  }

  const { records } = data;

  // Calculate values for a record
  const calculateRecordValues = (rec: any) => {
    const dailyRate = rec.salaireHebdomadaire / 6;
    const hourlyRate = dailyRate / 9.5;
    const extraHours =
      rec.lundiSupp +
      rec.mardiSupp +
      rec.mercrediSupp +
      rec.jeudiSupp +
      rec.vendrediSupp +
      rec.samediSupp;
    const normalHours =
      rec.lundi +
      rec.mardi +
      rec.mercredi +
      rec.jeudi +
      rec.vendredi +
      rec.samedi;
    const totalHours = normalHours + extraHours;
    const totalSalaire = totalHours * hourlyRate;
    const reste = totalSalaire - rec.avance;

    return {
      dailyRate,
      hourlyRate,
      extraHours,
      normalHours,
      totalHours,
      totalSalaire,
      reste,
    };
  };

  return (
    <>
      <div className="hidden md:block overflow-auto rounded-lg border border-background/35">
        <Table className="w-full border-collapse text-base">
          <TableHeader>
            <TableRow className="border border-background/35 divide-x divide-background/35">
              <TableHead className="text-background/65 min-w-[160px]">
                Semaine
              </TableHead>
              <TableHead className="text-background/65 min-w-[120px]">
                Atelier
              </TableHead>
              <TableHead className="text-background/65 min-w-[80px]">
                Salaire
              </TableHead>
              <TableHead className="text-background/65 min-w-[70px]">
                S. jour
              </TableHead>
              <TableHead className="text-background/65 min-w-[70px]">
                S. heure
              </TableHead>
              <TableHead colSpan={6} className="p-0 min-w-[300px]">
                <div className="flex flex-col w-full">
                  <div className="border-b border-background/35 text-center text-background/65 py-2 px-4">
                    Les Jours
                  </div>
                  <div className="grid grid-cols-6 divide-x divide-background/35">
                    {["Lu", "Ma", "Me", "Je", "Ve", "Sa"].map((d) => (
                      <div
                        key={d}
                        className="text-center text-background/65 py-2 px-2 min-w-[50px]"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                </div>
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[70px]">
                H. supp
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[80px]">
                T. heures
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[90px]">
                T. Salaire
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[80px]">
                Avance
              </TableHead>
              <TableHead className="text-background/65 text-center min-w-[80px]">
                Reste
              </TableHead>
              <TableHead className="text-background/65 text-right w-24">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={17}
                  className="text-center p-4 text-background/65"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>📭</span>
                    <span>Aucun enregistrement trouvé</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              records.map((rec) => {
                const dailyRate = rec.salaireHebdomadaire / 6;
                const hourlyRate = dailyRate / 9.5;
                const extraHours =
                  rec.lundiSupp +
                  rec.mardiSupp +
                  rec.mercrediSupp +
                  rec.jeudiSupp +
                  rec.vendrediSupp +
                  rec.samediSupp;
                const normalHours =
                  rec.lundi +
                  rec.mardi +
                  rec.mercredi +
                  rec.jeudi +
                  rec.vendredi +
                  rec.samedi;
                const totalHours = normalHours + extraHours;
                const totalSalaire = totalHours * hourlyRate;
                const reste = totalSalaire - rec.avance;

                return (
                  <TableRow
                    key={rec.id}
                    className={`border border-background/35 divide-x divide-background/35 hover:bg-background/5 transition-colors ${
                      rec.isPaid ? "" : "bg-destructive/15"
                    }`}
                  >
                    <TableCell className="font-medium text-sm">
                      {rec.displayText}
                    </TableCell>
                    <TableCell className="font-medium">
                      {rec.workplace.name}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {rec.salaireHebdomadaire} dh
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {dailyRate.toFixed(0)} dh
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {hourlyRate.toFixed(0)} dh
                    </TableCell>

                    {[
                      rec.lundi,
                      rec.mardi,
                      rec.mercredi,
                      rec.jeudi,
                      rec.vendredi,
                      rec.samedi,
                    ].map((v, i) => (
                      <TableCell
                        key={i}
                        className="text-center py-3 px-2 min-w-[50px]"
                      >
                        <span className="inline-block min-w-[30px] font-mono">
                          {v}
                        </span>
                      </TableCell>
                    ))}

                    <TableCell className="text-center font-semibold font-mono text-amber-600">
                      {extraHours}
                    </TableCell>
                    <TableCell className="text-center font-semibold font-mono">
                      {totalHours}
                    </TableCell>
                    <TableCell className="text-right font-semibold font-mono">
                      {totalSalaire.toFixed(0)} dh
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {rec.avance} dh
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {rec.isPaid ? "0.00" : reste.toFixed(0)} dh
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex justify-end gap-1">
                        {/* Edit Record Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border text-secondary hover:text-secondary border-secondary/40 hover:bg-secondary/10 p-2 rounded-lg"
                          onClick={() =>
                            setEditingRecord({
                              avance: rec.avance,
                              name: rec.worker.name,
                              id: rec.id,
                              jeudi: rec.jeudi,
                              jeudiSupp: rec.jeudiSupp,
                              lundi: rec.lundi,
                              lundiSupp: rec.lundiSupp,
                              mardiSupp: rec.mardiSupp,
                              mercrediSupp: rec.mercrediSupp,
                              vendrediSupp: rec.vendrediSupp,
                              samediSupp: rec.samediSupp,
                              mardi: rec.mardi,
                              mercredi: rec.mercredi,
                              samedi: rec.samedi,
                              vendredi: rec.vendredi,
                              description: rec.description,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        {/* Delete Record Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="border text-red-500 hover:text-red-500 border-red-500/40 hover:bg-red-500/10 p-2 rounded-lg"
                          onClick={() => {
                            setDeleteRecordId(rec.id);
                            setDeleteRecordName(rec.worker.name);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        {/* Payement button */}

                        {reste > 0 && (
                          <>
                            {!rec.isPaid ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="border text-red-500 hover:text-red-500 border-red-500/40 hover:bg-red-500/10 p-2 rounded-lg"
                                onClick={() =>
                                  setPaymentModal({
                                    open: true,
                                    recordId: rec.id,
                                    reste: reste,
                                    workerName: rec.worker.name,
                                    type: "pay",
                                  })
                                }
                              >
                                <HandCoins className="h-4 w-4" />
                              </Button>
                            ) : (
                              <div className="relative group">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="border text-green-600 border-green-500/40 bg-green-500/10 p-2 rounded-lg transition-all duration-200 group-hover:opacity-0"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="absolute inset-0 border text-orange-500 hover:text-orange-500 border-orange-500/40 hover:bg-orange-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200"
                                  onClick={() =>
                                    setPaymentModal({
                                      open: true,
                                      recordId: rec.id,
                                      reste: reste,
                                      workerName: rec.worker.name,
                                      type: "undo",
                                    })
                                  }
                                >
                                  <Undo2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </>
                        )}

                        {/* Info Hover Card - only show if description exists */}
                        {rec.description && (
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="p-2 border border-secondary/80 text-secondary cursor-pointer hover:text-secondary hover:bg-secondary/10 rounded-md">
                                <Info className="w-4 h-4" />
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="text-left mr-4 text-sm font-normal">
                              {rec.description}
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ✅ Mobile cards */}
      <div className="space-y-4 block md:hidden">
        {records.length === 0 && (
          <div className="text-center p-8 text-background/65 border border-background/20 rounded-lg">
            Aucun enregistrement trouvé.
          </div>
        )}
        {records.map((rec) => {
          const { extraHours, totalHours, totalSalaire, reste } =
            calculateRecordValues(rec);

          return (
            <div
              key={rec.id}
              className={`border rounded-lg overflow-hidden ${
                rec.isPaid
                  ? "border-background/20"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              {/* Header */}
              <div className="bg-muted-foreground p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-background">
                    {rec.worker.name}
                  </h3>
                  <p className="text-sm text-background/70">
                    Salaire: {rec.salaireHebdomadaire} dh/semaine
                  </p>
                </div>
                {rec.isPaid && (
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    Payé
                  </span>
                )}
                {!rec.isPaid && reste > 0 && (
                  <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                    Non payé
                  </span>
                )}
              </div>

              {/* Days Grid */}
              <div className="p-4 bg-background/5">
                <p className="text-xs font-medium text-background/60 mb-2 uppercase tracking-wide">
                  Heures travaillées
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { day: "Lun", hours: rec.lundi, supp: rec.lundiSupp },
                    { day: "Mar", hours: rec.mardi, supp: rec.mardiSupp },
                    {
                      day: "Mer",
                      hours: rec.mercredi,
                      supp: rec.mercrediSupp,
                    },
                    { day: "Jeu", hours: rec.jeudi, supp: rec.jeudiSupp },
                    {
                      day: "Ven",
                      hours: rec.vendredi,
                      supp: rec.vendrediSupp,
                    },
                    { day: "Sam", hours: rec.samedi, supp: rec.samediSupp },
                  ].map(({ day, hours, supp }) => (
                    <div
                      key={day}
                      className="bg-background/10 border border-background/20 rounded p-2 text-center"
                    >
                      <div className="text-xs text-background/60 font-medium">
                        {day}
                      </div>
                      <div className="text-sm font-semibold text-background">
                        {hours}h
                        {supp > 0 && (
                          <span className="text-xs text-orange-600">
                            {" "}
                            +{supp}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Stats */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-blue-600 font-medium">
                      Total heures
                    </span>
                  </div>
                  <p className="text-lg font-bold text-blue-900">
                    {totalHours}h
                  </p>
                  {extraHours > 0 && (
                    <p className="text-xs text-blue-600">
                      +{extraHours}h supp.
                    </p>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">
                      Salaire total
                    </span>
                  </div>
                  <p className="text-lg font-bold text-green-900">
                    {totalSalaire.toFixed(0)} dh
                  </p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <HandCoins className="w-4 h-4 text-orange-600" />
                    <span className="text-xs text-orange-600 font-medium">
                      Avance
                    </span>
                  </div>
                  <p className="text-lg font-bold text-orange-900">
                    {rec.avance} dh
                  </p>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Coins className="w-4 h-4 text-purple-600" />
                    <span className="text-xs text-purple-600 font-medium">
                      Reste
                    </span>
                  </div>
                  <p className="text-lg font-bold text-purple-900">
                    {rec.isPaid ? "0" : reste.toFixed(0)} dh
                  </p>
                </div>
              </div>

              {/* Description */}
              {rec.description && (
                <div className="px-4 pb-4">
                  <div className="bg-background/10 border border-background/20 rounded p-3">
                    <p className="text-xs font-medium text-background/60 mb-1">
                      Note
                    </p>
                    <p className="text-sm text-background/80">
                      {rec.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="p-4 bg-muted-foreground/50 border-t border-background/20 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 border text-secondary hover:text-secondary border-secondary/40 hover:bg-secondary/10"
                  onClick={() =>
                    setEditingRecord({
                      avance: rec.avance,
                      name: rec.worker.name,
                      id: rec.id,
                      jeudi: rec.jeudi,
                      jeudiSupp: rec.jeudiSupp,
                      lundi: rec.lundi,
                      lundiSupp: rec.lundiSupp,
                      mardiSupp: rec.mardiSupp,
                      mercrediSupp: rec.mercrediSupp,
                      vendrediSupp: rec.vendrediSupp,
                      samediSupp: rec.samediSupp,
                      mardi: rec.mardi,
                      mercredi: rec.mercredi,
                      samedi: rec.samedi,
                      vendredi: rec.vendredi,
                      description: rec.description,
                    })
                  }
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Modifier
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 border text-red-500 hover:text-red-500 border-red-500/40 hover:bg-red-500/10"
                  onClick={() => {
                    setDeleteRecordId(rec.id);
                    setDeleteRecordName(rec.worker.name);
                  }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Supprimer
                </Button>

                {reste > 0 && (
                  <>
                    {!rec.isPaid ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border text-green-600 hover:text-green-600 border-green-500/40 hover:bg-green-500/10"
                        onClick={() =>
                          setPaymentModal({
                            open: true,
                            recordId: rec.id,
                            reste: reste,
                            workerName: rec.worker.name,
                            type: "pay",
                          })
                        }
                      >
                        <HandCoins className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="border text-orange-500 hover:text-orange-500 border-orange-500/40 hover:bg-orange-500/10"
                        onClick={() =>
                          setPaymentModal({
                            open: true,
                            recordId: rec.id,
                            reste: reste,
                            workerName: rec.worker.name,
                            type: "undo",
                          })
                        }
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editingRecord && (
        <EditRecordDialog
          editingRecord={editingRecord}
          setEditingRecord={setEditingRecord}
        />
      )}

      {deleteRecordId && deleteRecordName && (
        <DeleteRecordDialog
          recordName={deleteRecordName}
          setRecordName={setDeleteRecordName}
          recordId={deleteRecordId}
          setRecordId={setDeleteRecordId}
        />
      )}

      <PaymentModal
        open={paymentModal.open}
        recordId={paymentModal.recordId}
        reste={paymentModal.reste}
        type={paymentModal.type}
        workerName={paymentModal.workerName}
        onClose={() =>
          setPaymentModal({
            open: false,
            workerName: null,
            recordId: null,
            reste: null,
            type: "pay",
          })
        }
      />
    </>
  );
};
