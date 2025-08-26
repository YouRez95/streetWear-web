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
import { useCreateStylist } from "@/hooks/useStylist";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";

import { useState } from "react";

type CreateStylistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type StylistType = "طباع" | "طراز";

export function CreateStylistDialog({
  open,
  onOpenChange,
}: CreateStylistDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options: StylistType[] = ["طباع", "طراز"];
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    type: options[0],
    active: true,
  });
  const createStylistMutation = useCreateStylist();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, type } = formData;
    if (!name) {
      setError("Le nom est requis");
      return;
    }

    if (!type) {
      setError("Le type est requis");
      return;
    }

    //console.log('Create stylist payload', formData)

    // Call the API to create a new stylist
    createStylistMutation.mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setFormData({
            name: "",
            phone: "",
            address: "",
            type: options[0],
            active: true,
          });
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Créer un nouveau styliste</DialogTitle>
          <DialogDescription className="text-background/80">
            Créer un nouveau styliste en remplissant les informations
            ci-dessous.
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
          <Button type="submit" className="text-base" onClick={handleSubmit}>
            Créer un styliste
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
