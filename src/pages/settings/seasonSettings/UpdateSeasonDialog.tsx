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
import { useUpdateSeason } from "@/hooks/useSeason";
import { removeEmptyValues } from "@/lib/utils";
import type { SeasonData } from "@/types/models";
import { useEffect, useState } from "react";

type UpdateSeasonDialogProps = {
  season: SeasonData;
  open: boolean;
  closeDialog: () => void;
};

export default function UpdateSeasonDialog({
  season,
  open,
  closeDialog,
}: UpdateSeasonDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const updateSeasonMutation = useUpdateSeason();
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (season && open) {
      setFormData({
        id: season.id,
        name: season.name || "",
        description: season.description || "",
      });
    }
  }, [season, open]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === "") {
      setError("Le nom est requis");
      return;
    }

    const seasonData = removeEmptyValues(formData);
    updateSeasonMutation.mutate(
      { ...seasonData, isClosed: false },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          closeDialog();
        },
        onError: (error) => {
          setError(
            error.message ||
              "Une erreur est survenue lors de la mise à jour de la saison"
          );
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Mettre à jour la saison</DialogTitle>
          <DialogDescription className="text-background/80">
            Mettre à jour les informations de la saison.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name" className="text-left text-base">
              Nom de la saison (*)
            </Label>
            <Input
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom de la saison"
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
            Mettre à jour la saison
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
