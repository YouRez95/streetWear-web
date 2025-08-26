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
import { useToggleBonClient } from "@/hooks/useClients";
import { cn } from "@/lib/utils";
import { useState } from "react";

type OpenBonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedBonId: string;
  setSelectedBonId: (bonId: string) => void;
};

export const OpenBonDialog = ({
  open,
  setOpen,
  selectedBonId,
  setSelectedBonId,
}: OpenBonDialogProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { mutate: toggleBonClient } = useToggleBonClient();

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
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
    toggleBonClient(
      { bonId: selectedBonId, openBon: true, closeBon: false },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setSelectedBonId("");
          setCode("");
          setError("");
          setOpen(false);
        },
      }
    );
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setCode("");
        setError("");
        setOpen(false);
      }}
    >
      <DialogContent className="bg-foreground rounded-xl p-5 shadow-sm border space-y-3">
        <DialogHeader>
          <DialogTitle className="text-xl">Ouvrir le bon</DialogTitle>
          <DialogDescription className="text-background text-base">
            Pour ouvrir le bon, veuillez entrer le code "Ouvrir".
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4 ">
          <Label htmlFor="code" className="text-left text-base">
            Code
          </Label>
          <Input
            id="code"
            value={code}
            onChange={handleChangeCode}
            className="col-span-3 border-background/50"
          />
        </div>

        <DialogFooter
          className={cn(
            "flex items-center",
            error
              ? "justify-between sm:justify-between"
              : "justify-end sm:justify-end"
          )}
        >
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/50">
                Fermer
              </Button>
            </DialogClose>
            <Button variant={"destructive"} onClick={handleOpenBon}>
              Ouvrir le bon
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
