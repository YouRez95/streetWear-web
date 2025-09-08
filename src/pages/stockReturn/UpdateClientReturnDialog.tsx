import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateClientReturnStock } from "@/hooks/useReturnStock";
import type { GetReturnStockResponse } from "@/types/models";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [newQuantity, setNewQuantity] = useState(stockReturn.quantity);
  const [error, setError] = useState("");
  const updateClientReturnStockMutation = useUpdateClientReturnStock();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setNewQuantity(stockReturn.quantity);
      setError("");
    }
  }, [stockReturn, open]);

  const closeDialog = () => {
    setOpen(false);
    setNewQuantity(stockReturn.quantity);
    setError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setNewQuantity(isNaN(value) ? 0 : value);
    if (error) setError("");
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
          if (data.status === "failed") return;
          closeDialog();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "min-w-[500px] max-w-[600px]"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Close Button on Mobile */}
        {isMobile && (
          <div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        )}

        <DialogHeader className="flex flex-col gap-3 pb-4 pt-5 md:pt-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Pencil
                className={cn(
                  "w-10 h-10 p-2 rounded-lg",
                  isMobile
                    ? "bg-primary text-foreground"
                    : "bg-background text-foreground"
                )}
              />
              <p
                className={cn("font-bagel", isMobile ? "text-xl" : "text-2xl")}
              >
                Modifier le retour
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-left">
            Modifiez la quantité retournée. L&apos;ancienne quantité était{" "}
            <b>{stockReturn.quantity}</b>.
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 px-2 md:px-0">
          <UpdateClientReturnForm
            newQuantity={newQuantity}
            error={error}
            handleChange={handleChange}
            isMobile={isMobile}
          />
        </div>

        {/* Sticky Footer */}
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
              className={cn(
                "flex-1 text-base",
                isMobile
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              )}
              onClick={handleConfirm}
            >
              Confirmer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UpdateClientReturnForm({
  newQuantity,
  handleChange,
}: {
  newQuantity: number;
  error: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}) {
  return (
    <div className="space-y-6 mb-5 md:mb-0">
      <div className="space-y-2">
        <Label
          htmlFor="quantity"
          className="text-base font-medium text-background"
        >
          Nouvelle quantité
        </Label>
        <Input
          id="quantity"
          name="quantity"
          className="border-background/30 hover:border-background/50 focus:border-primary/50 bg-foreground text-background p-3 rounded-lg transition-colors"
          type="number"
          min="0"
          value={newQuantity}
          onChange={handleChange}
          placeholder="Entrez la quantité"
        />
      </div>
    </div>
  );
}
