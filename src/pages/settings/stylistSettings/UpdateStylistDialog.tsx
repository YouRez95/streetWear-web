import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateStylist } from "@/hooks/useStylist";
import { cn } from "@/lib/utils";
import { removeEmptyValues } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { StylistData } from "@/types/models";
import type { StylistType } from "./CreateStylistDialog";

type UpdateStylistDialogProps = {
  stylist: StylistData;
  open: boolean;
  closeDialog: () => void;
};

export function UpdateStylistDialog({
  stylist,
  open,
  closeDialog,
}: UpdateStylistDialogProps) {
  //console.log('UpdateStylistDialog', stylist, open)
  const updateStylistMutation = useUpdateStylist();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options: StylistType[] = ["طباع", "طراز"];
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    type: "" as StylistType,
  });

  // Initialize form with faconnier data when opened
  useEffect(() => {
    if (stylist && open) {
      setFormData({
        id: stylist.id,
        name: stylist.name || "",
        phone: stylist.phone || "",
        address: stylist.address || "",
        type: stylist.type,
      });
    }
  }, [stylist, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() === "") {
      setError("Le nom est requis");
      return;
    }

    if (formData.type.trim() === "") {
      setError("Le type est requis");
      return;
    }

    const stylistData = removeEmptyValues(formData);
    //console.log('Updating stylist with data:', stylistData)
    updateStylistMutation.mutate(stylistData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        closeDialog();
      },
      onError: (error) => {
        setError(
          error.message ||
            "Une erreur est survenue lors de la mise à jour du styliste"
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Mettre à jour le styliste</DialogTitle>
          <DialogDescription className="text-background/80">
            Mettre à jour les informations du styliste.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Name */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left text-base">
              Nom (*)
            </Label>
            <Input
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nom"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>
          {/* Phone */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-left text-base">
              Téléphone
            </Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Téléphone"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Address */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-left text-base">
              Adresse
            </Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Adresse"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-left text-base">
              Type de styliste (*)
            </Label>
            <div className="relative col-span-3">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border border-background/50 text-[14px] flex justify-between items-center p-2 rounded-md"
              >
                {formData.type || "Choisir le type de styliste"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50">
                  {options.map((option) => (
                    <div
                      key={option}
                      className={cn(
                        "p-2 hover:bg-background/10 cursor-pointer m-1 rounded-md flex items-center justify-between"
                      )}
                      onClick={() => {
                        setFormData({ ...formData, type: option as any });
                        setIsDropdownOpen(false);
                      }}
                    >
                      {option}
                      {formData.type === option && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
          <Button
            type="submit"
            className="text-base"
            onClick={handleSubmit}
            // disabled={updateUserMutation.isLoading}
          >
            {/* {updateUserMutation.isLoading ? 'Updating...' : 'Update User'} */}
            Mettre à jour le styliste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
