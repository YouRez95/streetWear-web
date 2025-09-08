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
import {
  useFaconnierSummary,
  useToggleBonFaconnier,
} from "@/hooks/useFaconnier";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Lock, X } from "lucide-react";

type CloseBonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFaconnierId: string;
  selectedBonId: string;
  setSelectedBonId: (bonId: string) => void;
};

export function CloseBonDialog({
  open,
  setOpen,
  selectedFaconnierId,
  selectedBonId,
  setSelectedBonId,
}: CloseBonDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { data: dataSummary } = useFaconnierSummary(
    selectedFaconnierId,
    selectedBonId
  );
  const { mutate: toggleBonFaconnier, isPending } = useToggleBonFaconnier();

  // This function's logic is specific to Faconnier and remains unchanged.
  function showMessage() {
    if (
      dataSummary?.summary?.totalQuantitySent !== undefined &&
      dataSummary?.summary?.totalQuantityReturned !== undefined &&
      dataSummary.summary.totalQuantitySent >
        dataSummary.summary.totalQuantityReturned
    ) {
      return (
        <p className="text-destructive text-left">
          Ce bon n&apos;est pas complet. Êtes-vous sûr de vouloir le fermer ?
        </p>
      );
    }
    if (
      dataSummary?.summary?.totalValueSent !== undefined &&
      dataSummary?.summary?.totalAdvances !== undefined &&
      dataSummary.summary.totalValueSent > dataSummary.summary.totalAdvances
    ) {
      return (
        <p className="text-destructive text-left">
          Ce bon n&apos;est pas complet. Êtes-vous sûr de vouloir le fermer ?
        </p>
      );
    }
    return (
      <p className="text-green-500 text-left">
        Le bon est complet. Vous pouvez le fermer.
      </p>
    );
  }

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  function closeDialog() {
    setOpen(false);
    setCode("");
    setError("");
  }

  function handleCloseBon() {
    if (!code) {
      setError("Le code est requis");
      return;
    }
    if (code.toUpperCase() !== "FERMER") {
      setError("Le code est incorrect");
      return;
    }
    setError("");

    toggleBonFaconnier(
      { bonId: selectedBonId, openBon: false, closeBon: true },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          setSelectedBonId("");
          closeDialog();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "sm:max-w-[525px]"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Mobile Close Button */}
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

        <DialogHeader className="flex flex-col pt-5 md:pt-0">
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
            <p className="text-2xl font-bagel">Fermer le bon</p>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-base text-left">
            Pour fermer le bon, veuillez entrer le code <b>"Fermer"</b>.
          </DialogDescription>
          {showMessage()}
        </DialogHeader>

        {/* Form Content */}
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
                placeholder="Tapez Fermer"
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
              onClick={handleCloseBon}
              disabled={isPending}
            >
              Fermer le bon
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
