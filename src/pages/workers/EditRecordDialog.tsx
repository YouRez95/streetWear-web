import { DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useUpdateWeekRecord } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { useState } from "react";
import { type WorkerRecordEdit } from "./WorkersTable";
import { useMediaQuery } from "@uidotdev/usehooks";
import { X } from "lucide-react";

// Shared day names and type to preserve literal types across components
const DAY_NAMES = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
] as const;
type DayKey = (typeof DAY_NAMES)[number];

type EditRecordDialogProps = {
  editingRecord: WorkerRecordEdit;
  setEditingRecord: React.Dispatch<
    React.SetStateAction<WorkerRecordEdit | null>
  >;
};

export default function EditRecordDialog({
  editingRecord,
  setEditingRecord,
}: EditRecordDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { weekId, workplaceId } = useWorkerStore();
  const { mutate: updateWeekrecordMutation, isPending } = useUpdateWeekRecord();
  const [errorMsg, setErrorMsg] = useState("");
  const days = DAY_NAMES;
  type SuppDayKey = `${DayKey}Supp`;
  type NumericRecordKey = DayKey | SuppDayKey | "avance";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // List of required keys (hours & overtime + avance)
    const requiredKeys: readonly NumericRecordKey[] = [
      "lundi",
      "lundiSupp",
      "mardi",
      "mardiSupp",
      "mercredi",
      "mercrediSupp",
      "jeudi",
      "jeudiSupp",
      "vendredi",
      "vendrediSupp",
      "samedi",
      "samediSupp",
      "avance",
    ] as const;

    // Find any missing key
    const missingKeys = requiredKeys.filter(
      (key) => editingRecord[key as keyof WorkerRecordEdit] === undefined
    );
    if (missingKeys.length > 0) {
      setErrorMsg(
        `Veuillez entrer une valeur pour : ${missingKeys
          .map((k) => {
            if (k === "avance") return "avance";
            return k.replace("Supp", " sup.");
          })
          .join(", ")} ou mettre 0 si aucun horaire / avance`
      );
      return;
    }
    console.log("Submitting record:", editingRecord);
    setErrorMsg("");
    updateWeekrecordMutation(
      { recordData: editingRecord, weekId, workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setEditingRecord(null);
          }
        },
      }
    );
  };

  if (isMobile) {
    return (
      <Dialog
        open={!!editingRecord}
        onOpenChange={() => setEditingRecord(null)}
      >
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          <div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={() => setEditingRecord(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader>
            <DialogTitle>Modifier {editingRecord?.name}</DialogTitle>
            <DialogDescription className="text-sm text-background/70 text-left">
              Mettre à jour les heures travaillées pour chaque jour
            </DialogDescription>
          </DialogHeader>

          <EditRecordForm
            editingRecord={editingRecord}
            setEditingRecord={setEditingRecord}
            days={days}
            errorMsg={errorMsg}
            isPending={isPending}
            handleSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Dialog on desktop
  return (
    <Dialog open={!!editingRecord} onOpenChange={() => setEditingRecord(null)}>
      <DialogContent className="bg-foreground">
        <DialogHeader>
          <DialogTitle>Modifier {editingRecord?.name}</DialogTitle>
          <DialogDescription className="text-sm text-background/70">
            Mettre à jour les heures travaillées pour chaque jour
          </DialogDescription>
        </DialogHeader>

        <EditRecordForm
          editingRecord={editingRecord}
          setEditingRecord={setEditingRecord}
          days={days}
          errorMsg={errorMsg}
          isPending={isPending}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditRecordForm({
  editingRecord,
  setEditingRecord,
  days,
  errorMsg,
  isPending,
  handleSubmit,
}: {
  editingRecord: WorkerRecordEdit;
  setEditingRecord: React.Dispatch<
    React.SetStateAction<WorkerRecordEdit | null>
  >;
  days: readonly DayKey[];
  errorMsg: string;
  isPending: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form onSubmit={handleSubmit} className="space-y-6 mb-5">
        {/* Days section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4 pl-24">
            <span className="flex-1 text-xs font-medium uppercase tracking-wide text-background/60">
              Heures normales
            </span>
            <span className="flex-1 text-xs font-medium uppercase tracking-wide text-background/60">
              Heures sup.
            </span>
          </div>

          {days.map((day: DayKey) => (
            <div
              key={day}
              // className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
              className="flex items-center gap-4"
            >
              <label className="w-24 font-medium capitalize text-background/90">
                {day}
              </label>
              <div className="flex gap-2 w-full">
                <Input
                  type="number"
                  className="flex-1 border-background/35"
                  min={0}
                  step="any"
                  value={editingRecord?.[day]?.toString() ?? ""}
                  onChange={(e) =>
                    setEditingRecord((prev) =>
                      prev
                        ? {
                            ...prev,
                            [day]:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }
                        : prev
                    )
                  }
                />
                <Input
                  type="number"
                  className="flex-1 border-background/35"
                  min={0}
                  step="any"
                  value={
                    editingRecord?.[
                      `${day}Supp` as keyof WorkerRecordEdit
                    ]?.toString() ?? ""
                  }
                  onChange={(e) =>
                    setEditingRecord((prev) =>
                      prev
                        ? {
                            ...prev,
                            [`${day}Supp` as keyof WorkerRecordEdit]:
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value),
                          }
                        : prev
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Avance section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <label className="w-24 font-medium text-background/90 ">Avance</label>
          <div className="w-full">
            <Input
              type="number"
              className="flex-1 border-background/35 placeholder:text-background/35"
              placeholder="Montant de l'avance"
              min={0}
              value={editingRecord?.avance?.toString() ?? ""}
              onChange={(e) =>
                setEditingRecord((prev: any) => ({
                  ...prev,
                  avance:
                    e.target.value === "" ? undefined : Number(e.target.value),
                }))
              }
            />
          </div>
        </div>

        {/* Description section */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <label className="w-24 font-medium text-background/90">
            Description
          </label>
          <div className="w-full">
            <textarea
              className="w-full p-2 border border-background/35 rounded-md text-background placeholder:text-background/40"
              placeholder="Ajouter une description ou des notes..."
              value={editingRecord?.description ?? ""}
              onChange={(e) =>
                setEditingRecord((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev
                )
              }
              rows={3}
            />
          </div>
        </div>
      </form>

      <div>
        {errorMsg && (
          <p className="text-sm text-destructive mb-4">{errorMsg}</p>
        )}
        <div className="flex justify-end gap-2 pt-4 border-t border-background/20">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="border border-background/50"
              onClick={() => setEditingRecord(null)}
              disabled={isPending}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isPending} onClick={handleSubmit}>
            {isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </div>
  );
}
