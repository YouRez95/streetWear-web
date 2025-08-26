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
import { useToggleSeason } from "@/hooks/useSeason";
import { useState } from "react";

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
  const expectedCode = isClosed ? "Ouvrir" : "Fermer";

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  async function handleToggleSeason() {
    if (!code) {
      setError("Le code est requis");
      return;
    }
    if (code.toUpperCase() !== expectedCode.toUpperCase()) {
      setError("Le code est incorrect");
      return;
    }
    setError("");
    //console.log(`${expectedCode} season with ID:`, seasonId)
    // Toggle the season
    toggleSeasonMutation.mutate(seasonId, {
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
          <DialogTitle className="text-xl">
            {expectedCode} la saison: {seasonName}
          </DialogTitle>
          <DialogDescription className="text-background text-base">
            Pour {expectedCode.toLowerCase()} la saison, veuillez entrer le code
            "{expectedCode}".
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
            onClick={() => handleToggleSeason()}
          >
            {isClosed ? "Ouvrir la saison" : "Fermer la saison"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
