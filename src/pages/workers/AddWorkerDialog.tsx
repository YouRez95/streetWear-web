import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCreateWeekRecord } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { LucideUserPlus2, X } from "lucide-react";
import { useState } from "react";
import SelectWorkerFilter from "./SelectWorkerFilter";
import { useMediaQuery } from "@uidotdev/usehooks";

export default function AddWorkerDialog() {
  const { weekId, workplaceId } = useWorkerStore();
  const { mutate: createWeekRecordMutation, isPending } = useCreateWeekRecord();
  const [workerId, setWorkerId] = useState("");
  const [open, setOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleSave = () => {
    if (!workerId) return;
    createWeekRecordMutation(
      { weekId, workplaceId, workerId },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setOpen(false);
            setWorkerId("");
          }
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setWorkerId("");
    }
    setOpen(isOpen);
  };

  // 📱 Mobile layout — fullscreen
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            <LucideUserPlus2 className="w-6 h-6 text-foreground" />
            <span className="hidden lg:flex text-foreground font-medium">
              Ajouter un nouvel employé
            </span>
          </Button>
        </DialogTrigger>

        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          {/* Close button */}
          <div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>

          {/* Header */}
          <DialogHeader className="flex flex-col gap-2 mb-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <LucideUserPlus2 className="w-6 h-6" />
              <p className="text-2xl font-bagel">Ajouter un employé</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Sélectionnez un employé à ajouter à la semaine actuelle.
            </DialogDescription>
          </DialogHeader>

          <WorkerForm
            workerId={workerId}
            setWorkerId={setWorkerId}
            handleSave={handleSave}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Desktop layout — centered modal
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <LucideUserPlus2 className="w-6 h-6 text-foreground" />
          <span className="hidden lg:flex text-foreground font-medium">
            Ajouter un nouvel employé
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-foreground max-w-md">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <LucideUserPlus2 className="w-6 h-6 text-primary" />
            <p className="text-2xl font-bagel">Ajouter un employé</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Sélectionnez un employé pour l’ajouter à cette semaine.
          </DialogDescription>
        </DialogHeader>

        <WorkerForm
          workerId={workerId}
          setWorkerId={setWorkerId}
          handleSave={handleSave}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

function WorkerForm({
  workerId,
  setWorkerId,
  handleSave,
  isPending,
}: {
  workerId: string;
  setWorkerId: (id: string) => void;
  handleSave: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Worker Selector */}
      <div className="mt-2">
        <SelectWorkerFilter value={workerId} onValueChange={setWorkerId} />
      </div>

      {/* Footer actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-background/10">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="border border-background/20 hover:bg-background/5"
          >
            Annuler
          </Button>
        </DialogClose>
        <Button
          type="button"
          onClick={handleSave}
          disabled={!workerId || isPending}
          className="min-w-[120px]"
        >
          {isPending ? "Enregistrement…" : "Ajouter"}
        </Button>
      </div>
    </div>
  );
}
