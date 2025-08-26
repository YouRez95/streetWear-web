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
import { useDeleteClientReturnStock } from "@/hooks/useReturnStock";
import { formatDateToDDMMYYYY } from "@/lib/utils";
import type { GetReturnStockResponse } from "@/types/models";
import { useState } from "react";

type DeleteStockReturnDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  stockReturn: GetReturnStockResponse["products"][0]["stockInfo"]["returns"][0];
};

export function DeleteStockReturnDialog({
  open,
  setOpen,
  stockReturn,
}: DeleteStockReturnDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const deleteStockReturnMutation = useDeleteClientReturnStock();

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  async function handleDeleteProduct() {
    if (!code) {
      setError("Le code est requis");
      return;
    }

    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }
    setError("");

    deleteStockReturnMutation.mutate(stockReturn.id, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          setError(
            data.message ||
              "Une erreur est survenue lors de la suppression du retour"
          );
          return;
        }
        setCode("");
        setOpen(false);
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[700px] bg-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl">Supprimer un retour</DialogTitle>
          <DialogDescription className="text-background text-base space-y-2">
            Êtes-vous sûr de vouloir supprimer ce retour effectué par{" "}
            <strong>{stockReturn.client.name}</strong> le{" "}
            <strong>{formatDateToDDMMYYYY(new Date(stockReturn.date))}</strong>{" "}
            ?<br />
            <br />
            <strong>Détails :</strong>
            <br />- Bon N° : {stockReturn.bonNumber}
            <br />- Quantité retournée : {stockReturn.quantity} pièces
            <br />
            <br />
            <strong>Conséquence :</strong> Cette action est irréversible. La
            quantité retournée sera supprimée de l’historique et réaffectée
            comme disponible chez le client.
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
              className="col-span-3 border placeholder:text-background/25 placeholder:text-sm "
              placeholder="Tapez 'supprimer' pour confirmer"
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
            onClick={handleDeleteProduct}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
