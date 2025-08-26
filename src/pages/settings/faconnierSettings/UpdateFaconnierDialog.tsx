import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUpdateFaconnier } from "@/hooks/useFaconnier";
import { removeEmptyValues } from "@/lib/utils";
import { useEffect, useState } from "react";
import type { FaconnierData } from "@/types/models";

type UpdateFaconnierDialogProps = {
  faconnier: FaconnierData;
  open: boolean;
  closeDialog: () => void;
};

export function UpdateFaconnierDialog({
  faconnier,
  open,
  closeDialog,
}: UpdateFaconnierDialogProps) {
  //console.log('UpdateFaconnierDialog', faconnier, open)
  const updateFaconnierMutation = useUpdateFaconnier();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    phone: "",
    address: "",
    active: true,
  });

  // Initialize form with faconnier data when opened
  useEffect(() => {
    if (faconnier && open) {
      setFormData({
        id: faconnier.id,
        name: faconnier.name || "",
        phone: faconnier.phone || "",
        address: faconnier.address || "",
        active: faconnier.active ? true : false,
      });
    }
  }, [faconnier, open]);

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

    const faconnierData = removeEmptyValues(formData);
    //console.log('Updating faconnier with data:', faconnierData)
    updateFaconnierMutation.mutate(faconnierData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        closeDialog();
      },
      onError: (error) => {
        setError(
          error.message ||
            "Une erreur est survenue lors de la mise à jour du faconnier"
        );
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Mettre à jour le faconnier</DialogTitle>
          <DialogDescription className="text-background/80">
            Mettre à jour les informations du faconnier.
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

          {/* Image Upload */}

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
            Mettre à jour le faconnier
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
