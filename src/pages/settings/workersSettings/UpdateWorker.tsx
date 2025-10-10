import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateWorker } from "@/hooks/useWorkers";
import { cn } from "@/lib/utils";
import { UserCog, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import WorkplaceSelect from "./WorkplaceSelect";
import type { GetWorkersResponse } from "@/types/models";

type UpdateWorkerDialogProps = {
  worker: GetWorkersResponse | null;
  open: boolean;
  closeDialog: () => void;
};

export function UpdateWorkerDialog({
  worker,
  open,
  closeDialog,
}: UpdateWorkerDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const updateWorkerMutation = useUpdateWorker();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    salaireHebdomadaire: "",
    workplaceId: "",
  });

  // Initialize form with worker data when dialog opens
  useEffect(() => {
    if (worker && open) {
      setFormData({
        id: worker.id,
        name: worker.name || "",
        phone: worker.phone || "",
        salaireHebdomadaire: worker.salaireHebdomadaire
          ? String(worker.salaireHebdomadaire)
          : "",
        workplaceId: worker.workplace.id || "",
      });
      setError(null);
    }
  }, [worker, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWorkplaceChange = (id: string) => {
    if (error) setError(null);
    setFormData({ ...formData, workplaceId: id });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      setError("Le nom est requis");
      return;
    }

    if (
      !formData.salaireHebdomadaire ||
      Number(formData.salaireHebdomadaire) <= 0
    ) {
      setError("Le salaire hebdomadaire est requis et doit être supérieur à 0");
      return;
    }

    if (!formData.workplaceId) {
      setError("Le lieu de travail est requis");
      return;
    }

    const workerData = {
      ...formData,
      salaireHebdomadaire: Number(formData.salaireHebdomadaire),
    };

    updateWorkerMutation.mutate(workerData, {
      onSuccess: (data) => {
        if (data.status === "failed") return;
        closeDialog();
      },
      onError: (error) => {
        setError(
          error.message ||
            "Une erreur est survenue lors de la mise à jour de l'employé"
        );
      },
    });
  };

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          <div className="">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={closeDialog}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <UserCog className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
              <p className="text-2xl font-bagel">Mettre à jour l'employé</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Modifier les informations de l'employé ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <WorkerForm
            formData={formData}
            error={error}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleWorkplaceChange={handleWorkplaceChange}
            isMobile={isMobile}
            isPending={updateWorkerMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Dialog on desktop
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
            <p className="text-2xl font-bagel">Mettre à jour l'employé</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Modifier les informations de l'employé ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <WorkerForm
          formData={formData}
          error={error}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleWorkplaceChange={handleWorkplaceChange}
          isMobile={isMobile}
          isPending={updateWorkerMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

function WorkerForm({
  formData,
  error,
  handleSubmit,
  handleChange,
  handleWorkplaceChange,
  isMobile,
  isPending,
}: {
  formData: {
    id: string;
    name: string;
    phone: string;
    salaireHebdomadaire: string;
    workplaceId: string;
  };
  error: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleWorkplaceChange: (id: string) => void;
  isMobile: boolean;
  isPending: boolean;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="updateWorkerForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Informations de base */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          {/* <h1 className="text-base font-semibold">Informations de base</h1> */}

          <div className="flex gap-2 flex-col">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="name" className="text-base font-medium">
                Nom (*)
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Entrez le nom de l'employé"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="phone" className="text-base font-medium">
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Entrez le téléphone"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="salaireHebdomadaire"
                className="text-base font-medium"
              >
                Salaire hebdomadaire (*)
              </Label>
              <Input
                id="salaireHebdomadaire"
                name="salaireHebdomadaire"
                type="number"
                required
                placeholder="Entrez le salaire hebdomadaire"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.salaireHebdomadaire}
                onChange={handleChange}
              />
            </div>

            {/* Workplace Select */}
            <div className="flex flex-col gap-2">
              <WorkplaceSelect
                handleWorkplaceChange={handleWorkplaceChange}
                workPlaceId={formData.workplaceId}
              />
            </div>
          </div>
        </div>
      </form>

      <DialogFooter className="flex flex-col gap-3 pt-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 w-full">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <DialogClose asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex-1 border text-base",
                isMobile
                  ? "border-background/50 text-background"
                  : "border-background/30"
              )}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="updateWorkerForm"
            disabled={isPending}
            className={cn(
              "flex-1 text-base",
              isMobile
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            {isPending ? "Mise à jour..." : "Mettre à jour l'employé"}
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
