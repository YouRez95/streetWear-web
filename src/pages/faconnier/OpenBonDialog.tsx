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
import { useToggleBonFaconnier } from "@/hooks/useFaconnier"; // Changed hook
import { cn } from "@/lib/utils";
import { LockOpen, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type OpenBonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFaconnierId: string; // Kept in type for parent component compatibility
  selectedBonId: string;
  setSelectedBonId: (bonId: string) => void;
};

export function OpenBonDialog({
  open,
  setOpen,
  selectedBonId,
  setSelectedBonId,
}: OpenBonDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  // Use the correct mutation hook for Faconnier
  const { mutate: toggleBonFaconnier, isPending } = useToggleBonFaconnier();

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  function closeDialog() {
    setOpen(false);
    setCode("");
    setError("");
  }

  function handleOpenBon() {
    if (!code) {
      setError("Le code est requis");
      return;
    }
    if (code.toUpperCase() !== "OUVRIR") {
      setError("Le code est incorrect");
      return;
    }
    setError("");

    toggleBonFaconnier(
      { bonId: selectedBonId, openBon: true, closeBon: false },
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
            <LockOpen className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
            <p className="text-2xl font-bagel">Ouvrir le bon</p>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-base text-left">
            Pour ouvrir le bon, veuillez entrer le code <b>"Ouvrir"</b>.
          </DialogDescription>
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
                className="border-background/30 placeholder:text-background/30 hover:border-background/50 focus:border-green-500/50 bg-foreground text-background p-3 rounded-lg transition-colors"
                placeholder="Tapez Ouvrir"
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
              variant="default"
              className="flex-1 text-base"
              onClick={handleOpenBon}
              disabled={isPending}
            >
              Ouvrir
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
