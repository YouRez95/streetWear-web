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
import { useUpdateClient } from "@/hooks/useClients";
import { removeEmptyValues, cn } from "@/lib/utils";
import { User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import type { ClientData } from "@/types/models";

type UpdateClientDialogProps = {
  client: ClientData;
  open: boolean;
  closeDialog: () => void;
};

const initialFormData = {
  id: "",
  name: "",
  phone: "",
  address: "",
  active: true,
};

export function UpdateClientDialog({
  client,
  open,
  closeDialog,
}: UpdateClientDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const updateClientMutation = useUpdateClient();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);

  // Initialize form with client data when opened
  useEffect(() => {
    if (client && open) {
      setFormData({
        id: client.id,
        name: client.name || "",
        phone: client.phone || "",
        address: client.address || "",
        active: client.active ? true : false,
      });
    }
  }, [client, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloseDialog = () => {
    closeDialog();
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.name.trim() === "") {
      setError("Le nom est requis");
      return;
    }

    const clientData = removeEmptyValues(formData);
    updateClientMutation.mutate(clientData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        handleCloseDialog();
      },
      onError: (error) => {
        setError(
          error.message ||
            "Une erreur est survenue lors de la mise à jour du client"
        );
      },
    });
  };

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleCloseDialog}>
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          <div className="">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={handleCloseDialog}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <User className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
              <p className="text-2xl truncate font-bagel">
                Mettre à jour le client
              </p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Mettre à jour les informations du client.
            </DialogDescription>
          </DialogHeader>

          <ClientForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isMobile={isMobile}
            isUpdate={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Dialog on desktop
  return (
    <Dialog open={open} onOpenChange={handleCloseDialog}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <User className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
            <p className="text-2xl font-bagel">Mettre à jour le client</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Mettre à jour les informations du client.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isMobile={isMobile}
          isUpdate={true}
        />
      </DialogContent>
    </Dialog>
  );
}

function ClientForm({
  formData,
  error,
  handleSubmit,
  handleChange,
  isMobile,
}: {
  formData: typeof initialFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof initialFormData>>;
  error: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
  isUpdate?: boolean;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="updateClientForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Informations de base */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <h1 className="text-base font-semibold">Informations de base</h1>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="name" className="text-base font-medium">
                Nom (*)
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Entrez le nom du client"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="phone" className="text-base font-medium">
                Téléphone
              </Label>
              <Input
                id="phone"
                name="phone"
                placeholder="Entrez le téléphone"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="address" className="text-base font-medium">
                Adresse
              </Label>
              <Input
                id="address"
                name="address"
                placeholder="Entrez l'adresse"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            {/* Empty div to maintain grid alignment */}
            <div className="flex-1"></div>
          </div>
        </div>
      </form>

      <DialogFooter className="flex flex-col gap-3 pt-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 w-full">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <DialogClose asChild>
            <Button
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
            type="submit"
            form="updateClientForm"
            className={cn(
              "flex-1 text-base",
              isMobile
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            Mettre à jour le client
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
