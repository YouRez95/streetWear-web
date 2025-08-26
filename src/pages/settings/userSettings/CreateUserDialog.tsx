import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useCreateUser } from "@/hooks/useUsers";
import { validateUserForm } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useState } from "react";
export function CreateUserDialog() {
  const [open, setOpen] = useState(false);
  const createUserMutation = useCreateUser();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateUserForm(formData);
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

    createUserMutation.mutate(userPayload, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        setFormData({
          name: "",
          email: "",
          role: "admin",
          phone: "",
          address: "",
          password: "",
          confirmPassword: "",
        });
        setImage(null);
        setImagePreview(null);
        setOpen(false);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg"
          onClick={() => setOpen(true)}
        >
          <span>+</span>
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[750px] bg-foreground text-base">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
          <DialogDescription className="text-background/80">
            Créer un nouvel utilisateur et leur assigner un rôle. Vous pouvez
            également ajouter une photo de profil.
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
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value })
              }
            >
              <Label htmlFor="role" className="text-left text-base">
                Rôle
              </Label>
              <SelectTrigger className=" col-span-3 w-full data-[placeholder]:text-background border-background/35">
                <SelectValue placeholder="Sélectionner un rôle" className="" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="text-background/50">
                    Roles
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
              Mot de passe (*)
            </Label>
            <Input
              id="password"
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              className="col-span-3 placeholder:text-background/35 border-background/35 text-base"
            />
          </div>

          {/* ConfirmPassword */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmPassword" className="text-left text-base">
              Confirmer le mot de passe (*)
            </Label>
            <Input
              id="confirmPassword"
              required
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer le mot de passe"
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
              <Label htmlFor="image" className="text-left text-base">
                Photo de profil
              </Label>
              <Input
                className="col-span-3 placeholder:text-background/35 text-background border-background/35 hidden"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              <Label
                htmlFor="image"
                className="cursor-pointer flex items-center gap-3 justify-center col-span-3 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 text-base"
              >
                <Upload className="w-5 h-5" />
                Uploader une image
              </Label>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover mb-2 m-auto my-6"
              />
            )}
          </div>

          <div className="text-base text-destructive">
            {error && <p className="text-destructive">{error}</p>}
          </div>
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
              Ajouter l'utilisateur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
