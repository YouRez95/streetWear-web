import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeleteAvanceClient } from "@/hooks/useClients";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Trash2 } from "lucide-react";

type OpenDeleteAvanceDialog = {
  open: boolean;
  avanceId: string;
  amount: number;
};

type DeleteAvanceClientDialogProps = {
  openDeleteAvanceDialog: OpenDeleteAvanceDialog;
  onClose: (open: OpenDeleteAvanceDialog) => void;
  clientId: string;
  bonId: string;
};

export const DeleteAvanceClientDialog = ({
  openDeleteAvanceDialog,
  onClose,
  clientId,
  bonId,
}: DeleteAvanceClientDialogProps) => {
  const { avanceId, amount } = openDeleteAvanceDialog;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { mutate: deleteAvanceClient } = useDeleteAvanceClient();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const resetForm = () => {
    setCode("");
    setError("");
  };

  const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError("");
  };

  const handleDeleteAvance = () => {
    if (!code) {
      setError("Le code est requis");
      return;
    }
    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }
    setError("");

    deleteAvanceClient(
      { avanceId, clientId, bonId },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          resetForm();
          onClose({ open: false, avanceId: "", amount: 0 });
        },
      }
    );
  };

  if (isMobile) {
    // 📱 Drawer on mobile
    return (
      <Drawer
        open={openDeleteAvanceDialog.open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetForm();
          onClose({ open: false, avanceId: "", amount: 0 });
        }}
      >
        <DrawerContent className="bg-foreground rounded-t-2xl flex flex-col max-h-[90vh]">
          <DrawerHeader className="flex flex-col gap-2">
            <DrawerTitle className="text-primary flex items-center gap-2">
              <Trash2 className="w-10 h-10 bg-destructive p-2 rounded-lg text-foreground" />
              <p className="text-2xl text-destructive font-bagel">
                Supprimer l'avance: {amount}
              </p>
            </DrawerTitle>
            <DrawerDescription className="text-background/80 text-sm text-left">
              Êtes-vous sûr de vouloir supprimer cette avance ? Cette action ne
              peut être annulée.
            </DrawerDescription>
          </DrawerHeader>

          {/* Scrollable form */}
          <div className="flex-1 overflow-y-auto px-4">
            <DeleteAvanceForm
              code={code}
              error={error}
              handleChangeCode={handleChangeCode}
              handleDeleteAvance={handleDeleteAvance}
              isMobile={isMobile}
            />
          </div>

          {/* Sticky footer */}
          <div className="p-4 border-t border-background/20 flex flex-col justify-between items-end gap-2 bg-foreground">
            {error && <p className="text-destructive">{error}</p>}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                className="border border-background/50"
                onClick={() =>
                  onClose({ open: false, avanceId: "", amount: 0 })
                }
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteAvance}>
                Supprimer
              </Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // 💻 Dialog on desktop
  return (
    <Dialog
      open={openDeleteAvanceDialog.open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onClose({ open: false, avanceId: "", amount: 0 });
      }}
    >
      <DialogContent className="bg-foreground rounded-xl p-5 shadow-sm border space-y-3">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
            <p className="text-2xl font-bagel">Supprimer l'avance: {amount}</p>
          </DialogTitle>
          <DialogDescription className="text-background text-base">
            Êtes-vous sûr de vouloir supprimer cette avance ? Cette action ne
            peut être annulée.
          </DialogDescription>
        </DialogHeader>

        <DeleteAvanceForm
          code={code}
          error={error}
          handleChangeCode={handleChangeCode}
          handleDeleteAvance={handleDeleteAvance}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
};

function DeleteAvanceForm({
  code,
  error,
  handleChangeCode,
  handleDeleteAvance,
  isMobile,
}: {
  code: string;
  error: string;
  handleChangeCode: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDeleteAvance: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 mb-5 md:mb-0">
      <div className="flex items-center gap-4 flex-col md:flex-row">
        <Label htmlFor="code" className="text-left text-base w-full md:w-auto">
          Code
        </Label>
        <Input
          id="code"
          value={code}
          onChange={handleChangeCode}
          className="border-background/50 w-full placeholder:text-background/50"
          placeholder="Entrez Supprimer"
        />
      </div>

      {!isMobile && (
        <div className="flex justify-between items-center my-2">
          <p className="text-destructive">{error}</p>
          <div className={cn("flex items-center gap-2")}>
            <Button variant="ghost" className="border border-background/50">
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteAvance}>
              Supprimer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
