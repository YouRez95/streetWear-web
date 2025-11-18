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
import { useDeleteReturnStock } from "@/hooks/useReturnStock";
import type { ReturnStock } from "@/types/models";
import { AlertCircle, AlertTriangle, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

type DeleteReturnStockProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  returnStock: ReturnStock;
};

export function DeleteReturnStock({
  open,
  setOpen,
  returnStock,
}: DeleteReturnStockProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { mutate: deleteReturnStockMutation, isPending } =
    useDeleteReturnStock();

  const handleChangeCode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCode(e.target.value);
      setError("");
    },
    []
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!code) {
      setError("Le code est requis");
      return;
    }

    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }
    setError("");

    deleteReturnStockMutation(returnStock.stockInfo.returnStockId, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          if (
            data.message ===
            "You cannot delete a return with quantity available"
          ) {
            setError(
              "Vous ne pouvez pas supprimer un retour avec une quantité disponible. Veuillez d'abord ajuster la quantité à zéro."
            );
          } else {
            setError(data.message);
          }
          return;
        }
        setCode("");
        setError("");
        setOpen(false);
      },
      onError: (err: any) => {
        setError(err.message || "Une erreur est survenue");
      },
    });
  }, [
    code,
    deleteReturnStockMutation,
    returnStock.stockInfo.returnStockId,
    setOpen,
  ]);

  const handleClose = useCallback(() => {
    setCode("");
    setError("");
    setOpen(false);
  }, [setOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !isPending && code) {
        e.preventDefault();
        handleDeleteProduct();
      }
    },
    [handleDeleteProduct, isPending, code]
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="w-[95vw] max-w-lg md:max-w-[600px] bg-white dark:bg-slate-900 rounded-2xl p-0 shadow-xl border-0 overflow-hidden mx-auto"
        onKeyDown={handleKeyDown}
      >
        {/* Danger Header with gradient - Mobile optimized */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-4 sm:px-6 sm:py-5">
          <DialogHeader className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg flex-shrink-0">
                <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-semibold text-white">
                Supprimer un retour
              </DialogTitle>
            </div>
            <DialogDescription className="text-red-100 text-sm sm:text-base leading-relaxed">
              Cette action est irréversible et supprimera définitivement ce
              retour
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content - Mobile optimized spacing */}
        <div className="px-4 py-4 sm:px-6 sm:py-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Warning Alert */}
          <Alert className="bg-red-50 border-red-200 [&>svg]:text-red-400">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-background/40 flex-shrink-0 mt-0.5" />
            <AlertDescription className="text-red-800 dark:text-red-200 ml-2 text-sm sm:text-base">
              <strong className="font-semibold">Attention :</strong> La
              suppression de ce retour est permanente. Toutes les données
              associées seront définitivement perdues.
            </AlertDescription>
          </Alert>

          {/* Return Stock Info - Mobile optimized */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Détails du retour à supprimer
            </h4>
            {/* <div className="space-y-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <p className="break-all">
                <span className="font-medium">ID:</span> {returnStock.stockInfo.returnStockId}
              </p>
              {returnStock.product && (
                <p>
                  <span className="font-medium">Produit:</span> {returnStock.product.name}
                </p>
              )}
              {returnStock.quantity && (
                <p>
                  <span className="font-medium">Quantité:</span> {returnStock.quantity}
                </p>
              )}
              {returnStock.createdAt && (
                <p>
                  <span className="font-medium">Date:</span> {new Date(returnStock.createdAt).toLocaleDateString()}
                </p>
              )}
            </div> */}
          </div>

          {/* Confirmation Input - Mobile optimized */}
          <div className="space-y-2 sm:space-y-3">
            <Label
              htmlFor="code"
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              Confirmation requise
            </Label>
            <Input
              id="code"
              value={code}
              onChange={handleChangeCode}
              className="border-gray-300 dark:border-gray-600 focus:border-red-500 focus:ring-red-500 h-11 text-base font-medium placeholder:text-background/50"
              placeholder="Tapez 'SUPPRIMER' pour confirmer"
              autoComplete="off"
              disabled={isPending}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Pour confirmer, veuillez taper{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                SUPPRIMER
              </span>{" "}
              en majuscules
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <AlertDescription className="text-sm pt-0.5">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Footer - Mobile optimized layout */}
        <DialogFooter className="bg-gray-50 dark:bg-slate-800 px-4 py-4 sm:px-6 sm:py-4 flex flex-col-reverse sm:flex-row gap-3 sm:gap-2 sm:justify-end border-t border-gray-200 dark:border-gray-700">
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 h-11 px-4 sm:px-6 font-medium transition-colors flex-1 sm:flex-none order-2 sm:order-1"
              disabled={isPending}
            >
              Annuler
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            className="h-11 px-4 sm:px-8 font-semibold shadow-sm transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none order-1 sm:order-2 min-w-[120px] sm:min-w-[140px]"
            onClick={handleDeleteProduct}
            disabled={isPending || !code}
          >
            {isPending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="sm:inline">Suppression...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                <span>Supprimer</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
