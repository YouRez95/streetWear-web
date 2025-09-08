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
import { removeEmptyValues, cn } from "@/lib/utils";
import type { SeasonData } from "@/types/models";
import { useEffect, useState } from "react";
import { X, Edit } from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";

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
  const isMobile = useMediaQuery("(max-width: 768px)");

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

  const handleCloseDialog = () => {
    closeDialog();
    setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (formData.name.trim() === "") {
      setError("Le nom est requis");
      return;
    }

    const seasonData = removeEmptyValues(formData);
    updateSeasonMutation.mutate(
      { ...seasonData, isClosed: false },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          handleCloseDialog();
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
    <Dialog
      open={open}
      onOpenChange={(isOpen) => !isOpen && handleCloseDialog()}
    >
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col text-base",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "sm:max-w-[750px]"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Close button on Mobile */}
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

        {/* Header */}
        <DialogHeader className="flex flex-col gap-3 pb-4 pt-5 md:pt-0">
          <DialogTitle className="text-left mb-2 flex items-center gap-3 font-semibold text-xl">
            <Edit className="w-10 h-10 bg-primary p-2 rounded-lg text-foreground" />
            Mettre à jour la saison
          </DialogTitle>
          <DialogDescription className="text-background/80 text-base text-left">
            Modifiez les informations de la saison ci-dessous.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 px-2 md:px-0 flex flex-col gap-4"
        >
          {/* Nom */}
          <div className="flex flex-col gap-1">
            <Label htmlFor="name" className="text-left text-base">
              Nom de la saison (*)
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom de la saison"
              className="placeholder:text-background/35 border-background/35 text-base"
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
              className="placeholder:text-background/35 border-background/35 text-base"
            />
          </div>
        </form>

        {/* Footer */}
        <DialogFooter className="flex flex-col gap-3 pt-4">
          {/* Error */}
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 w-full">
              {error}
            </div>
          )}
          <div className="flex gap-3 w-full">
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
              type="submit"
              className="flex-1 text-base"
              onClick={handleSubmit}
            >
              Mettre à jour la saison
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
