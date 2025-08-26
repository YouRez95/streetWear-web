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
import { Badge } from "@/components/ui/badge";
import { useDeleteStylist } from "@/hooks/useStylist";
import { useState } from "react";

type DeleteStylistDialogProps = {
  stylistId: string;
  stylistName: string;
  open: boolean;
  closeDialog: () => void;
};

export function DeleteStylistDialog({
  stylistId,
  stylistName,
  open,
  closeDialog,
}: DeleteStylistDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const deleteStylistMutation = useDeleteStylist();

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  async function handleDeleteUser() {
    if (!code) {
      setError("Le code est requis");
      return;
    }

    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }
    setError("");
    //console.log('Deleting stylist with ID:', stylistId)
    // Delete stylist mutation
    deleteStylistMutation.mutate(stylistId, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        closeDialog();
      },
    });
  }
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[525px] bg-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            Supprimer le styliste:
            <Badge variant="default" className="ml-2 text-base">
              {stylistName}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-background text-base">
            Êtes-vous sûr de vouloir supprimer ce styliste ? Cette action ne
            peut être annulée.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right text-base">
              Code
            </Label>
            <Input
              id="code"
              value={code}
              onChange={handleChangeCode}
              className="col-span-3"
            />
            {error && (
              <p className="text-destructive text-sm col-span-4 text-right">
                {error}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="border-[2px] text-base"
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={"destructive"}
            className="text-base"
            onClick={() => handleDeleteUser()}
          >
            Supprimer le styliste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
