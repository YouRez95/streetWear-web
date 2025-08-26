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

type CloseBonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFaconnierId: string;
  selectedBonId: string;
  setSelectedBonId: (bonId: string) => void;
};

export const CloseBonDialog = ({
  open,
  setOpen,
  selectedFaconnierId,
  selectedBonId,
  setSelectedBonId,
}: CloseBonDialogProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const { data: dataSummary } = useFaconnierSummary(
    selectedFaconnierId,
    selectedBonId
  );
  const { mutate: toggleBonFaconnier } = useToggleBonFaconnier();
  function showMessage() {
    if (
      dataSummary?.summary?.totalQuantitySent !== undefined &&
      dataSummary?.summary?.totalQuantityReturned !== undefined &&
      dataSummary?.summary?.totalQuantitySent >
        dataSummary?.summary?.totalQuantityReturned
    ) {
      return (
        <p className="text-red-500">
          Ce bon n'est pas complet. Êtes-vous sûr de vouloir le fermer ?
        </p>
      );
    }

    if (
      dataSummary?.summary?.totalValueSent !== undefined &&
      dataSummary?.summary?.totalAdvances !== undefined &&
      dataSummary?.summary?.totalValueSent > dataSummary?.summary?.totalAdvances
    ) {
      return (
        <p className="text-red-500">
          Ce bon n'est pas complet. Êtes-vous sûr de vouloir le fermer ?
        </p>
      );
    }

    return <p className="">Êtes-vous sûr de vouloir fermer ce bon ?</p>;
  }

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
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
    //console.log('close bon', selectedFaconnierId, selectedBonId)
    toggleBonFaconnier(
      { bonId: selectedBonId, openBon: false, closeBon: true },
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
          <DialogTitle className="text-xl">Fermer le bon</DialogTitle>
          <DialogDescription asChild className="text-background text-base">
            {showMessage()}
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
                Annuler
              </Button>
            </DialogClose>
            <Button variant={"destructive"} onClick={handleCloseBon}>
              Fermer le bon
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
