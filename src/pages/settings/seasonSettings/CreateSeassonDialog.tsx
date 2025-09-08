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
import { Textarea } from "@/components/ui/textarea";
import { useCreateSeason } from "@/hooks/useSeason";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { CalendarPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

type CreateSeasonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const initialFormData = {
  name: "",
  description: "",
};

export default function CreateSeasonDialog({
  open,
  setOpen,
}: CreateSeasonDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const createSeasonMutation = useCreateSeason();
  const [formData, setFormData] = useState(initialFormData);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { name } = formData;
    if (!name) {
      setError("Le nom est requis");
      return;
    }

    createSeasonMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data.status === "failed") return;
        setFormData(initialFormData);
        setOpen(false);
      },
    });
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          {/* Mobile close button */}
          <div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>

          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <CalendarPlus className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
              <p className="text-2xl font-bagel">Créer une session</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Créez une nouvelle session en remplissant les informations
              ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <SeasonForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            isMobile={isMobile}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop dialog
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <CalendarPlus className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
            <p className="text-2xl font-bagel">Créer une session</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Créez une nouvelle session en remplissant les informations
            ci-dessous.
          </DialogDescription>
        </DialogHeader>

        <SeasonForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
}

function SeasonForm({
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
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="createSeasonForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <h1 className="text-base font-semibold">
            Informations de la session
          </h1>

          {/* Nom */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-base font-medium">
              Nom de la session (*)
            </Label>
            <Input
              id="name"
              name="name"
              required
              placeholder="Nom de la session"
              className="border border-background/50 text-base placeholder:text-background/50"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="description" className="text-base font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description"
              className="border border-background/50 text-base placeholder:text-background/50"
              value={formData.description}
              onChange={handleChange}
            />
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
            form="createSeasonForm"
            className={cn(
              "flex-1 text-base",
              isMobile
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            Créer la session
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
