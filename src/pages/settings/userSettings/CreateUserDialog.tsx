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
import { cn, validateUserForm } from "@/lib/utils";
import { Upload, User, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

const initialFormData = {
  name: "",
  email: "",
  role: "admin",
  phone: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export function CreateUserDialog() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const createUserMutation = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setFormData(initialFormData);
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

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg w-full"
            onClick={() => setOpen(true)}
          >
            <span>+</span>
            Ajouter un utilisateur
          </Button>
        </DialogTrigger>
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          <div className="">
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
              <User className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
              <p className="text-2xl font-bagel">Créer un utilisateur</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Créer un nouvel utilisateur et leur assigner un rôle.
            </DialogDescription>
          </DialogHeader>

          <UserForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            imagePreview={imagePreview}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            isMobile={isMobile}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg w-full"
          onClick={() => setOpen(true)}
        >
          <span>+</span>
          Ajouter un utilisateur
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <User className="w-10 h-10 border bg-primary/10 p-2 rounded-lg text-primary" />
            <p className="text-2xl font-bagel">Créer un utilisateur</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Créer un nouvel utilisateur et leur assigner un rôle.
          </DialogDescription>
        </DialogHeader>
        <UserForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          imagePreview={imagePreview}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          isMobile={isMobile}
        />
      </DialogContent>
    </Dialog>
  );
}

function UserForm({
  formData,
  setFormData,
  error,
  imagePreview,
  handleSubmit,
  handleChange,
  handleImageChange,
  isMobile,
}: {
  formData: typeof initialFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof initialFormData>>;
  error: string | null;
  imagePreview: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="createUserForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Informations de base & Photo */}
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="md:flex-1 flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <h1 className="text-base font-semibold">Informations de base</h1>

            <div className="flex gap-2 flex-col md:flex-row">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="name" className="text-base font-medium">
                  Nom (*)
                </Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Entrez le nom"
                  className="border border-background/50 text-base placeholder:text-background/50"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="email" className="text-base font-medium">
                  Email (*)
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Entrez l'email"
                  className="border border-background/50 text-base placeholder:text-background/50"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-2 flex-row">
              <div className="flex flex-col gap-2 flex-2">
                <Label htmlFor="phone" className="text-base font-medium">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Entrez le téléphone"
                  className="border border-background/50 text-base placeholder:text-background/50"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="role" className="text-base font-medium">
                  Rôle
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="border border-background/50 text-base data-[placeholder]:text-background/50">
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
            </div>

            <div className="flex flex-col gap-2">
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

          <div className="md:flex-1 flex flex-col h-[200px] md:h-auto md:max-h-[350px]">
            <Label
              htmlFor="userImage"
              className="text-base flex flex-col gap-4 h-full p-2 bg-muted-foreground rounded-lg overflow-hidden"
            >
              <span className="font-semibold">Photo de profil</span>
              <div className="flex items-center gap-2 cursor-pointer justify-center flex-1 rounded-lg overflow-hidden">
                {!imagePreview && <Upload className="w-5 h-5" />}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Aperçu du profil"
                    className="object-cover w-full h-full rounded-lg"
                  />
                )}
              </div>
            </Label>
            <Input
              id="userImage"
              name="userImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Sécurité */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <h1 className="text-base font-semibold">Sécurité</h1>
          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="password" className="text-base font-medium">
                Mot de passe (*)
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Entrez le mot de passe"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label
                htmlFor="confirmPassword"
                className="text-base font-medium"
              >
                Confirmer le mot de passe (*)
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirmer le mot de passe"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.confirmPassword}
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
            form="createUserForm"
            className={cn(
              "flex-1 text-base",
              isMobile
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            Créer l'utilisateur
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
