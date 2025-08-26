import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateClientReturnStock } from "@/hooks/useReturnStock";
import type { GetReturnStockResponse } from "@/types/models";
import { useEffect, useState } from "react";

type UpdateClientReturnDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  stockReturn: GetReturnStockResponse["products"][0]["stockInfo"]["returns"][0];
};

export default function UpdateClientReturnDialog({
  open,
  setOpen,
  stockReturn,
}: UpdateClientReturnDialogProps) {
  const [newQuantity, setNewQuantity] = useState(stockReturn.quantity);
  const [error, setError] = useState<string | null>(null);
  const updateClientReturnStockMutation = useUpdateClientReturnStock();

  useEffect(() => {
    setNewQuantity(stockReturn.quantity);
    setError(null);
  }, [stockReturn, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNewQuantity(isNaN(value) ? 0 : value);
  };

  const handleConfirm = () => {
    if (newQuantity < 0) {
      setError("La quantité ne peut pas être négative.");
      return;
    }

    updateClientReturnStockMutation.mutate(
      { newQuantity, clientReturnId: stockReturn.id },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setError(null);
          setOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-foreground">
        <DialogHeader>
          <DialogTitle className="text-xl">Modifier le retour</DialogTitle>
          <DialogDescription className="text-background text-base">
            Modifiez la quantité retournée. L'ancienne quantité était{" "}
            <b>{stockReturn.quantity}</b>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right text-base">
              Nouvelle quantité
            </Label>
            <Input
              id="quantity"
              type="number"
              min={0}
              value={newQuantity}
              onChange={handleChange}
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
          <Button
            variant="ghost"
            className="border-[2px] text-base"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button
            variant="default"
            className="text-base"
            onClick={handleConfirm}
          >
            Confirmer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
