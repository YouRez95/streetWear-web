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

type CreateSeassonDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function CreateSeassonDialog({
  open,
  setOpen,
}: CreateSeassonDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const createSeasonMutation = useCreateSeason();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { name } = formData;
    if (!name) {
      setError("Le nom est requis");
      return;
    }

    // Call the API to create a new season
    createSeasonMutation.mutate(formData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        setFormData({
          name: "",
          description: "",
        });
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle session</DialogTitle>
          <DialogDescription className="text-background/80">
            Créez une nouvelle session en remplissant les informations
            ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Nom */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name" className="text-left text-base">
              Nom de la session (*)
            </Label>
            <Input
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom de la session"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="description" className="text-left text-base">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              placeholder="Description"
              onChange={handleChange}
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          <div className="text-base text-destructive">
            {error && <p className="text-destructive">{error}</p>}
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="text-base mr-2 border-2"
            >
              Annuler
            </Button>
          </DialogClose>
          <Button type="submit" className="text-base" onClick={handleSubmit}>
            Créer la session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
