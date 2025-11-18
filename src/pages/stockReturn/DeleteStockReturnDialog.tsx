import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteClientReturnStock } from "@/hooks/useReturnStock";
import { formatDateToDDMMYYYY, cn } from "@/lib/utils";
import type { GetReturnStockResponse } from "@/types/models";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Trash2, X } from "lucide-react";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    if (error) setError("");
  }

  function handleDeleteReturn() {
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
        resetForm();
      },
    });
  }

  const resetForm = () => {
    setCode("");
    setError("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={resetForm}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "min-w-[600px] max-w-[700px]"
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
              <Trash2 className="w-10 h-10 bg-destructive p-2 rounded-lg text-foreground" />
              <p
                className={cn(
                  "font-bagel text-destructive",
                  isMobile ? "text-xl" : "text-2xl"
                )}
              >
                Supprimer un retour
              </p>
            </div>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-left">
            Êtes-vous sûr de vouloir supprimer ce retour effectué par{" "}
            <strong>
              {stockReturn.client
                ? stockReturn.client.name
                : stockReturn.passagerName}
            </strong>{" "}
            le{" "}
            <strong>{formatDateToDDMMYYYY(new Date(stockReturn.date))}</strong>
            ?
            <br />
            <br />
            <strong>Détails :</strong>
            <br />- Bon N° : {stockReturn.bonNumber}
            <br />- Quantité retournée : {stockReturn.quantity} pièces
            <br />
            <br />
            <strong>Conséquence :</strong> Cette action est irréversible. La
            quantité sera supprimée de l'historique et réaffectée au client.
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 px-2 md:px-0">
          <div className="space-y-6 mb-5 md:mb-0">
            <div className="space-y-3">
              <Label
                htmlFor="code"
                className="text-base font-medium text-background block"
              >
                Pour confirmer, tapez "Supprimer" dans le champ ci-dessous
              </Label>
              <Input
                id="code"
                name="code"
                value={code}
                onChange={handleChangeCode}
                className="border-background/30 placeholder:text-background/30 hover:border-background/50 focus:border-destructive/50 bg-foreground text-background p-3 rounded-lg transition-colors"
                placeholder="Tapez Supprimer"
              />
            </div>
          </div>
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
              variant="destructive"
              className="flex-1 text-base"
              onClick={handleDeleteReturn}
              disabled={deleteStockReturnMutation.isPending}
            >
              Supprimer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
