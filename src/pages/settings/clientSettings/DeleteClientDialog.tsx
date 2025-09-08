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
import { useDeleteClient } from "@/hooks/useClients";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Trash2, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type DeleteClientDialogProps = {
  clientId: string;
  clientName: string;
  open: boolean;
  closeDialog: () => void;
};

export function DeleteClientDialog({
  clientId,
  clientName,
  open,
  closeDialog,
}: DeleteClientDialogProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const deleteClientMutation = useDeleteClient();
  const isMobile = useMediaQuery("(max-width: 768px)");

  function handleChangeCode(e: React.ChangeEvent<HTMLInputElement>) {
    setCode(e.target.value);
    setError("");
  }

  const handleCloseDialog = () => {
    closeDialog();
    setCode("");
    setError("");
  };

  async function handleDeleteClient() {
    if (!code) {
      setError("Le code est requis");
      return;
    }

    if (code.toUpperCase() !== "SUPPRIMER") {
      setError("Le code est incorrect");
      return;
    }

    setError("");

    deleteClientMutation.mutate(clientId, {
      onSuccess: (data) => {
        if (data.status === "failed") return;
        handleCloseDialog();
      },
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
              "text-destructive text-left mb-2 flex items-center gap-3 font-semibold",
              isMobile ? "text-xl" : "text-xl"
            )}
          >
            <Trash2 className="w-10 h-10 bg-destructive p-2 rounded-lg text-foreground" />
            Supprimer le client: <Badge>{clientName}</Badge>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-base text-left">
            Êtes-vous sûr de vouloir supprimer ce client ? Cette action est
            irréversible.
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
                Pour confirmer, tapez "Supprimer" dans le champ ci-dessous
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
              onClick={handleDeleteClient}
            >
              Supprimer le client
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
