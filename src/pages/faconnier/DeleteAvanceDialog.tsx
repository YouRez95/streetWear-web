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
import { useDeleteAvanceFaconnier } from "@/hooks/useFaconnier";
import { cn } from "@/lib/utils";
import { useState } from "react";
type OpenDeleteAvanceDialog = {
  open: boolean;
  avanceId: string;
  amount: number;
};

type DeleteAvanceDialogProps = {
  openDeleteAvanceDialog: OpenDeleteAvanceDialog;
  onClose: (open: OpenDeleteAvanceDialog) => void;
  faconnierId: string;
  bonId: string;
};

export const DeleteAvanceDialog = ({
  openDeleteAvanceDialog,
  onClose,
  faconnierId,
  bonId,
}: DeleteAvanceDialogProps) => {
  const { avanceId, amount } = openDeleteAvanceDialog;
  const { mutate: deleteAvanceFaconnier } = useDeleteAvanceFaconnier();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  async function handleDeleteAvance() {
    if (!code) {
      setError("Le code est requis");
      return;
    }

    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }
    setError("");
    //console.log('delete avance', avanceId, faconnierId, bonId, amount)
    deleteAvanceFaconnier(
      { avanceId, faconnierId, bonId },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          onClose({ open: false, avanceId: "", amount: 0 });
          setCode("");
          setError("");
        },
      }
    );
  }

  return (
    <Dialog
      open={openDeleteAvanceDialog.open}
      onOpenChange={() => {
        setCode("");
        setError("");
        onClose({ open: false, avanceId: "", amount: 0 });
      }}
    >
      <DialogContent className="bg-foreground rounded-xl p-5 shadow-sm border space-y-3">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Supprimer l'avance: {amount}
          </DialogTitle>
          <DialogDescription className="text-background text-base">
            Êtes-vous sûr de vouloir supprimer cette avance ? Cette action ne
            peut être annulée.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 ">
          <Label htmlFor="code" className="text-left text-base">
            Code
          </Label>
          <Input
            id="code"
            value={code}
            onChange={handleChangeCode}
            className="col-span-3 border-background/50"
          />
        </div>

        <DialogFooter
          className={cn(
            "flex items-center",
            error
              ? "justify-between sm:justify-between"
              : "justify-end sm:justify-end"
          )}
        >
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/50">
                Annuler
              </Button>
            </DialogClose>
            <Button variant={"destructive"} onClick={handleDeleteAvance}>
              Supprimer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
