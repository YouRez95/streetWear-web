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
import { Check, ChevronDown, User, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type CreateStylistDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type StylistType = "طباع" | "طراز";

const initialFormData = {
  name: "",
  phone: "",
  address: "",
  type: "طباع" as StylistType,
  active: true,
};

export function CreateStylistDialog({
  open,
  onOpenChange,
}: CreateStylistDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const createStylistMutation = useCreateStylist();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    createStylistMutation.mutate(
      { ...formData },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setFormData(initialFormData);
          onOpenChange(false);
        },
      }
    );
  };

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
          <div className="">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
          <DialogHeader className="flex flex-col gap-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <User className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
              <p className="text-2xl font-bagel">Créer un styliste</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Créer un nouveau styliste en remplissant les informations
              ci-dessous.
            </DialogDescription>
          </DialogHeader>

          <StylistForm
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

  // 💻 Dialog on desktop
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <User className="w-10 h-10 border bg-primary/10 p-2 rounded-lg" />
            <p className="text-2xl font-bagel">Créer un styliste</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Créer un nouveau styliste en remplissant les informations
            ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <StylistForm
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

function StylistForm({
  formData,
  setFormData,
  error,
  handleSubmit,
  handleChange,
  isMobile,
}: {
  formData: typeof initialFormData;
  setFormData: React.Dispatch<React.SetStateAction<typeof initialFormData>>;
  error: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const options: StylistType[] = ["طباع", "طراز"];

  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="createStylistForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Informations de base */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
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
                placeholder="Entrez le nom du styliste"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2 flex-1">
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
          </div>

          <div className="flex gap-2 flex-col md:flex-row">
            <div className="flex flex-col gap-2 flex-1">
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

            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="type" className="text-base font-medium">
                Type de styliste (*)
              </Label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border border-background/50 text-base flex justify-between items-center p-2 rounded-md  hover:bg-background/10"
                >
                  {formData.type || "Choisir le type de styliste"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50 shadow-lg">
                    {options.map((option) => (
                      <div
                        key={option}
                        className={cn(
                          "p-2 hover:bg-background/10 cursor-pointer m-1 rounded-md flex items-center justify-between text-base"
                        )}
                        onClick={() => {
                          setFormData({ ...formData, type: option });
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
            form="createStylistForm"
            className={cn(
              "flex-1 text-base",
              isMobile
                ? "bg-primary text-primary-foreground"
                : "bg-background text-foreground"
            )}
          >
            Créer le styliste
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
