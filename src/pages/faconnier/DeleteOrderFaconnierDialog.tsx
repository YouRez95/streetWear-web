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
import { useDeleteOrderFaconnier } from "@/hooks/useFaconnier";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Trash2, X } from "lucide-react";

type OpenDeleteOrderFaconnierDialog = {
  open: boolean;
  orderId: string;
  reference: string;
};

type DeleteOrderFaconnierDialogProps = {
  openDeleteOrderDialog: OpenDeleteOrderFaconnierDialog;
  onClose: (open: OpenDeleteOrderFaconnierDialog) => void;
  faconnierId: string;
  bonId: string;
};

export const DeleteOrderFaconnierDialog = ({
  openDeleteOrderDialog,
  onClose,
  faconnierId,
  bonId,
}: DeleteOrderFaconnierDialogProps) => {
  const { orderId, reference, open } = openDeleteOrderDialog;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { mutate: deleteOrderFaconnier, isPending } = useDeleteOrderFaconnier();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError("");
  };

  const resetForm = () => {
    setCode("");
    setError("");
    onClose({ open: false, orderId: "", reference: "" });
  };

  const handleDeleteOrder = () => {
    if (!code) {
      setError("Le code est requis");
      return;
    }
    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }

    deleteOrderFaconnier(
      { orderId, faconnierId, bonId },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          resetForm();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={resetForm}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "md:max-w-[525px]"
        )}
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

        <DialogHeader className="flex flex-col">
          <DialogTitle className="flex items-center gap-2 text-destructive text-xl">
            <Trash2 className="w-10 h-10 bg-destructive p-2 rounded-lg text-foreground" />
            Supprimer la commande: {reference}
          </DialogTitle>
          <DialogDescription className="text-background/80 text-base text-left">
            Êtes-vous sûr de vouloir supprimer cette commande ? Cette action ne
            peut être annulée.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 px-2 md:px-0">
          <div className="grid gap-4 py-4">
            <div className="space-y-3">
              <Label
                htmlFor="code"
                className="text-base font-medium text-background block"
              >
                Code
              </Label>
              <Input
                id="code"
                value={code}
                onChange={handleChangeCode}
                className="border-background/30 placeholder:text-background/30 hover:border-background/50 focus:border-destructive/50 bg-foreground text-background p-3 rounded-lg transition-colors"
                placeholder="Tapez Supprimer"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-3 pt-4">
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 w-full">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <DialogClose asChild>
              <Button
                type="button"
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
              type="button"
              variant="destructive"
              className="flex-1 text-base"
              onClick={handleDeleteOrder}
              disabled={isPending}
            >
              Supprimer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
