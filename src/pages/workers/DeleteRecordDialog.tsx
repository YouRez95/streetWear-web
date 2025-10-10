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
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteWeekRecord } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { AlertTriangle, Clock, Trash2, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type DeleteRecordDialogProps = {
  recordId: string;
  setRecordId: React.Dispatch<React.SetStateAction<string | null>>;
  recordName: string;
  setRecordName: React.Dispatch<React.SetStateAction<string | null>>;
};

const REQUIRED_CODE = "SUPPRIMER";

export function DeleteRecordDialog({
  recordId,
  setRecordId,
  recordName,
  setRecordName,
}: DeleteRecordDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { weekId, workplaceId } = useWorkerStore();
  const [confirmationCode, setConfirmationCode] = useState("");
  const [error, setError] = useState("");
  const { mutate: deleteWeekRecordMutation, isPending } = useDeleteWeekRecord();

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    setConfirmationCode(value);
    if (error) setError("");
  }

  function handleClose() {
    setRecordId(null);
    setRecordName(null);
    setConfirmationCode("");
    setError("");
  }

  async function handleConfirmDeletion() {
    if (!confirmationCode.trim()) {
      setError("Veuillez saisir le code de confirmation");
      return;
    }

    if (confirmationCode !== REQUIRED_CODE) {
      setError(
        'Code de confirmation incorrect. Tapez "SUPPRIMER" pour confirmer.'
      );
      return;
    }

    setError("");

    deleteWeekRecordMutation(
      { recordId, weekId, workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            handleClose();
          }
        },
        onError: () => {
          setError(
            "Une erreur est survenue lors de la suppression. Veuillez réessayer."
          );
        },
      }
    );
  }

  // 📱 Mobile Layout (Full Screen)
  if (isMobile) {
    return (
      <Dialog open={!!recordId} onOpenChange={handleClose}>
        <DialogContent className="[&>button]:hidden bg-foreground text-background flex flex-col h-full max-w-full overflow-y-auto rounded-none p-6">
          {/* Close button */}
          <div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={handleClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>

          {/* Header */}
          <DialogHeader className="space-y-4 mt-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
              <Trash2 className="w-8 h-8 text-red-600" />
            </div>

            <DialogTitle className="text-2xl font-bold text-center text-background">
              Supprimer l'enregistrement
            </DialogTitle>

            <DialogDescription className="text-center text-background/80 text-base leading-relaxed">
              Vous êtes sur le point de supprimer définitivement cet
              enregistrement d'heures de travail.
              {recordName && (
                <span className="block mt-2 font-medium text-background">
                  Enregistrement : {recordName}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Alert */}
          <Alert className="bg-red-50 border-red-200 mt-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-800 font-medium">
              <strong>Attention :</strong> Cette action est irréversible. Toutes
              les données associées à cet enregistrement seront perdues
              définitivement.
            </AlertDescription>
          </Alert>

          {/* Form */}
          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label
                htmlFor="confirmation-code"
                className="text-sm font-medium"
              >
                Pour confirmer, tapez{" "}
                <span className="font-bold text-red-600">{REQUIRED_CODE}</span>{" "}
                ci-dessous :
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
            </div>

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
          <DialogFooter className="gap-3 pt-6 mt-auto">
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="flex-1 h-11 text-base font-medium border-2 border-background/20 hover:bg-background/5"
                disabled={isPending}
              >
                <Clock className="w-4 h-4 mr-2" />
                Annuler
              </Button>
            </DialogClose>

            <Button
              type="button"
              variant="destructive"
              className="flex-1 h-11 text-base font-medium bg-red-600 hover:bg-red-700 disabled:bg-red-300"
              onClick={handleConfirmDeletion}
              disabled={isPending || confirmationCode !== REQUIRED_CODE}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isPending ? "Suppression..." : "Supprimer définitivement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Desktop Layout (Centered modal)
  return (
    <Dialog open={!!recordId} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[540px] bg-foreground text-background border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>

          <DialogTitle className="text-2xl font-bold text-center">
            Supprimer l'enregistrement
          </DialogTitle>

          <DialogDescription className="text-center text-background/80 text-base leading-relaxed">
            Vous êtes sur le point de supprimer définitivement cet
            enregistrement d'heures de travail.
            {recordName && (
              <span className="block mt-2 font-medium text-background">
                Enregistrement : {recordName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-red-50 border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            <strong>Attention :</strong> Cette action est irréversible. Toutes
            les données associées à cet enregistrement seront perdues
            définitivement.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="confirmation-code"
              className="text-base font-medium"
            >
              Pour confirmer, tapez
              <span className="text-red-600">{REQUIRED_CODE}</span> ci-dessous :
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
          </div>

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
              className="flex-1 h-11 text-base font-medium border-2 hover:bg-background/5"
              disabled={isPending}
            >
              <Clock className="w-4 h-4 mr-2" />
              Annuler
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            className="flex-1 h-11 text-base font-medium bg-red-600 hover:bg-red-700 disabled:bg-red-300"
            onClick={handleConfirmDeletion}
            disabled={isPending || confirmationCode !== REQUIRED_CODE}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isPending ? "Suppression..." : "Supprimer définitivement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
