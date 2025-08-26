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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUpdateUser } from "@/hooks/useUsers";
import { getImageUrl, removeEmptyValues, validateUserForm } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { UserData } from "@/types/models";

type UpdateUserDialogProps = {
  user: UserData;
  open: boolean;
  closeDialog: () => void;
};

export function UpdateUserDialog({
  user,
  open,
  closeDialog,
}: UpdateUserDialogProps) {
  const updateUserMutation = useUpdateUser();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    role: "admin",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // Initialize form with user data when opened
  useEffect(() => {
    if (user && open) {
      setFormData({
        id: user.id,
        name: user.name || "",
        email: user.email || "",
        role: user.role || "admin",
        phone: user.phone || "",
        address: user.address || "",
        password: "",
        confirmPassword: "",
      });

      // Set image preview if user has an image
      if (user.imageUrl) {
        setImageUrl(user.imageUrl);
      }
      setImagePreview(null);
    }
  }, [user, open]);

  // const handleChange = () => {}
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errorMessage = validateUserForm({
      ...formData,
      skipPasswordValidation: true,
    });
    if (errorMessage) {
      setError(errorMessage);
      return;
    }
    const buffer = image ? await image.arrayBuffer() : null;

    const userPayload = {
      ...formData,
      image: buffer,
      fileName: image?.name || null,
    };

    const { confirmPassword, ...userData } = removeEmptyValues(userPayload);
    updateUserMutation.mutate(userData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        // setImage(null)
        // setImagePreview(null)
        closeDialog();
      },
      onError: (error) => {
        setError(error.message || "An error occurred while updating user");
      },
    });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview if exists
      setImageUrl(null);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur</DialogTitle>
          <DialogDescription className="text-background/80">
            Modifier les informations et les rôles de l'utilisateur. Laissez les
            champs de mot de passe vides pour conserver le mot de passe actuel.
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
          {/* Email */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-left text-base">
              Email (*)
            </Label>
            <Input
              id="email"
              type="email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>
          {/* Role */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-left text-base">
              Rôle
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <SelectTrigger className="col-span-3 w-full data-[placeholder]:text-background border-background/35">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-background/50">
                    Rôles
                  </SelectLabel>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super admin">Super Admin</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {/* Password */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-left text-base">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Laisser vide pour conserver le mot de passe actuel"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* ConfirmPassword */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-left text-base">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer le nouveau mot de passe"
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
          <div className="">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="update-image" className="text-left text-base">
                Photo de profil
              </Label>
              <Input
                className="col-span-3 placeholder:text-background/35 text-background border-background/35 hidden"
                id="update-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Label
                htmlFor="update-image"
                className="cursor-pointer flex items-center gap-3 justify-center col-span-3 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 text-base"
              >
                <Upload className="w-5 h-5" />
                {imageUrl ? "Changer l'image" : "Uploader une image"}
              </Label>
            </div>
            {imagePreview && (
              <div className="flex justify-center mt-6 mb-2">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
            {imageUrl && (
              <div className="flex justify-center mt-6 mb-2">
                <img
                  src={getImageUrl(imageUrl)}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
            )}
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
            Modifier l'utilisateur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
