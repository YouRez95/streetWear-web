import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteWeek } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import {
  AlertTriangle,
  Calendar,
  CalendarX,
  Clock,
  Trash,
  X,
} from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type DeleteWeekDialogProps = {
  weekName: string | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const REQUIRED_CODE = "SUPPRIMER";

export function DeleteWeekDialog({
  weekName,
  open,
  setOpen,
}: DeleteWeekDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { weekId, workplaceId, setWeekId } = useWorkerStore();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const { mutate: deleteWeekMutation, isPending } = useDeleteWeek();

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    setConfirmationCode(value);
    if (error) setError("");
  }

  async function handleConfirmDeletion() {
    if (!confirmationCode.trim()) {
      setError("Veuillez saisir le code de confirmation");
      return;
    }

    if (confirmationCode !== REQUIRED_CODE) {
      setError('Code incorrect. Tapez "SUPPRIMER" pour confirmer.');
      return;
    }

    setError("");

    deleteWeekMutation(
      { weekId, workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setOpen(false);
            setConfirmationCode("");
            setWeekId(data.nextWeekId || "");
          }
        },
        onError: () => {
          setError("Une erreur est survenue. Veuillez réessayer.");
        },
      }
    );
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setConfirmationCode("");
      setError("");
    }
    setOpen(isOpen);
  };

  // 📱 Mobile Layout (Full Screen)
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="destructive">
            <Trash className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:flex">Supprimer cette semaine</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="[&>button]:hidden bg-foreground text-background flex flex-col h-full max-w-full overflow-y-auto rounded-none p-6">
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
          <DialogHeader className="space-y-4 mt-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <CalendarX className="w-8 h-8 text-red-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-center text-background">
              Supprimer la semaine
            </DialogTitle>
            <DialogDescription className="text-center text-background/80 text-base">
              Vous êtes sur le point de supprimer définitivement cette semaine
              de travail.
              {weekName && (
                <span className="block mt-2 font-medium text-background">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Semaine : {weekName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Alert */}
          <Alert className="bg-red-50 border-red-200 mt-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium space-y-2">
              <div>
                <strong>ATTENTION - Action irréversible :</strong>
              </div>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Toutes les données de cette semaine seront perdues</li>
                <li>Tous les enregistrements d'heures seront supprimés</li>
                <li>Les statistiques liées ne seront plus disponibles</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Form */}
          <div className="mt-6 space-y-4">
            <Label
              htmlFor="confirmation-code"
              className="text-base font-medium"
            >
              Pour confirmer, tapez{" "}
              <span className="font-bold text-red-600">{REQUIRED_CODE}</span> :
            </Label>
            <Input
              id="confirmation-code"
              value={confirmationCode}
              onChange={handleCodeChange}
              placeholder="Tapez SUPPRIMER pour confirmer"
              className="text-base h-12 border-2 focus:border-red-400 focus:ring-red-200 placeholder:text-background/35"
              disabled={isPending}
              autoComplete="off"
            />

            {error && (
              <Alert className="bg-red-50 border-red-200">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="mt-auto pt-6 flex justify-end gap-3">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="border border-background/20 h-11 text-base"
                disabled={isPending}
              >
                <Clock className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              className="h-11 text-base"
              onClick={handleConfirmDeletion}
              disabled={isPending || confirmationCode !== REQUIRED_CODE}
            >
              <CalendarX className="w-4 h-4 mr-2" />
              {isPending ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Desktop Layout (Centered modal)
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="w-4 h-4 lg:mr-2" />
          <span className="hidden lg:flex">Supprimer cette semaine</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[580px] bg-foreground text-background border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
            <CalendarX className="w-8 h-8 text-red-600" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Supprimer la semaine
          </DialogTitle>
          <DialogDescription className="text-center text-background/80">
            Vous êtes sur le point de supprimer définitivement cette semaine et
            ses enregistrements.
            {weekName && (
              <span className="block mt-2 font-medium">
                <Calendar className="w-4 h-4 inline mr-1" />
                Semaine : {weekName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium space-y-2">
            <div>
              <strong>ATTENTION :</strong> Cette action est irréversible.
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Toutes les données de cette semaine seront perdues</li>
              <li>Les heures et rapports associés seront supprimés</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4 mt-4">
          <Label htmlFor="confirmation-code" className="text-base font-medium">
            Pour confirmer, tapez{" "}
            <span className="font-bold text-red-600">{REQUIRED_CODE}</span> :
          </Label>
          <Input
            id="confirmation-code"
            value={confirmationCode}
            onChange={handleCodeChange}
            placeholder="Tapez SUPPRIMER pour confirmer"
            className="text-base h-12 border-2 focus:border-red-400 focus:ring-red-200 placeholder:text-background/35"
            disabled={isPending}
            autoComplete="off"
          />

          {error && (
            <Alert className="bg-red-50 border-red-200">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-3 pt-6">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="flex-1 h-11 text-base border-2 hover:bg-background/5"
              disabled={isPending}
            >
              <Clock className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="flex-1 h-11 text-base"
            onClick={handleConfirmDeletion}
            disabled={isPending || confirmationCode !== REQUIRED_CODE}
          >
            <CalendarX className="w-4 h-4 mr-2" />
            {isPending ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
