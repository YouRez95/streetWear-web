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
import { useUpdateWorkplace } from "@/hooks/useWorkers";
import { cn } from "@/lib/utils";
import { Briefcase, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import type { WorkPlace } from "@/types/models";

type UpdateWorkplaceDialogProps = {
  workplace: WorkPlace;
  open: boolean;
  closeDialog: () => void;
};

export function UpdateWorkplace({
  workplace,
  open,
  closeDialog,
}: UpdateWorkplaceDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const updateWorkplaceMutation = useUpdateWorkplace();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    address: "",
  });

  // Initialize form with workplace data when opened
  useEffect(() => {
    if (workplace && open) {
      setFormData({
        id: workplace.id,
        name: workplace.name || "",
        address: workplace.address || "",
      });
      setError(null);
    }
  }, [workplace, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.name.trim() === "") {
      setError("Le nom est requis");
      return;
    }

    updateWorkplaceMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        closeDialog();
      },
    });
  };

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          <div className="">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={closeDialog}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <Briefcase className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
              <p className="text-2xl font-bagel">Mettre à jour l'atelier</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Modifiez les informations de l'atelier ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <WorkplaceForm
            formData={formData}
            error={error}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isMobile={isMobile}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Dialog on desktop
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
            <p className="text-2xl font-bagel">Mettre à jour l'atelier</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Modifiez les informations de l'atelier ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <WorkplaceForm
          formData={formData}
          error={error}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
}

function WorkplaceForm({
  formData,
  error,
  handleSubmit,
  handleChange,
  isMobile,
}: {
  formData: { id: string; name: string; address: string };
  error: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="updateWorkplaceForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Informations de base */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          {/* <h1 className="text-base font-semibold">Informations de base</h1> */}

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="name" className="text-base font-medium">
                Nom (*)
              </Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Entrez le nom de l'atelier"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

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
            form="updateWorkplaceForm"
            className={cn(
              "flex-1 text-base",
              isMobile
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            Mettre à jour l'atelier
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
