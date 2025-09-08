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
import { useToggleSeason } from "@/hooks/useSeason";
import { useMediaQuery } from "@uidotdev/usehooks";
import { X, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ToggleSeasonDialogProps = {
  seasonId: string;
  seasonName: string;
  open: boolean;
  closeDialog: () => void;
  isClosed: boolean;
};

export function ToggleSeasonDialog({
  seasonId,
  seasonName,
  open,
  closeDialog,
  isClosed,
}: ToggleSeasonDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const toggleSeasonMutation = useToggleSeason();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const expectedCode = isClosed ? "Ouvrir" : "Fermer";

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  const handleCloseDialog = () => {
    closeDialog();
    setCode("");
    setError("");
  };

  async function handleToggleSeason() {
    if (!code.trim()) {
      setError("Le code est requis");
      return;
    }
    if (code.toUpperCase() !== expectedCode.toUpperCase()) {
      setError("Le code est incorrect");
      return;
    }
    setError("");

    toggleSeasonMutation.mutate(seasonId, {
      onSuccess: (data) => {
        if (data.status === "failed") return;
        handleCloseDialog();
      },
      onError: () =>
        setError("Une erreur est survenue lors du changement de la saison"),
    });
  }

  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "sm:max-w-[525px]"
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
          <DialogTitle
            className={cn(
              "text-left mb-2 flex items-center gap-3 font-semibold",
              isClosed ? "text-green-600" : "text-destructive",
              "text-xl"
            )}
          >
            {/* <RefreshCw
              className={cn(
                "w-10 h-10 p-2 rounded-lg text-foreground",
                isClosed ? "bg-green-600" : "bg-destructive"
              )}
            /> */}
            {expectedCode === "Fermer" && (
              <Lock className="w-10 h-10 p-2 rounded-lg text-foreground bg-destructive" />
            )}
            {expectedCode === "Ouvrir" && (
              <Unlock className="w-10 h-10 p-2 rounded-lg text-foreground bg-green-600" />
            )}
            {expectedCode} la saison: <Badge>{seasonName}</Badge>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-base text-left">
            Pour {expectedCode.toLowerCase()} cette saison, veuillez entrer le
            code <span className="font-semibold">"{expectedCode}"</span>.
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
                Confirmation
              </Label>
              <Input
                id="code"
                value={code}
                onChange={handleChangeCode}
                placeholder={`Tapez ${expectedCode}`}
                className="border-background/30 placeholder:text-background/30 hover:border-background/50 focus:border-primary/50 bg-foreground text-background p-3 rounded-lg transition-colors"
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
              onClick={handleToggleSeason}
              className={cn(
                "flex-1 text-base",
                isClosed ? "bg-green-600 hover:bg-green-700" : "bg-destructive"
              )}
            >
              {isClosed ? "Ouvrir la saison" : "Fermer la saison"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
