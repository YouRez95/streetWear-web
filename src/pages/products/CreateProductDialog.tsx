import productLogo from "@/assets/icons/products-icon.svg";
import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateProduct } from "@/hooks/useProduct";
import { validateProductForm } from "@/lib/utils";
import type { CreateProductInput } from "@/types/models";
import { Ruler, Scale, Upload, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type CreateProductDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const initialFormData: CreateProductInput = {
  name: "",
  description: "",
  reference: "",
  totalQty: 0,
  productImage: null,
  fileName: null,
  createdAt: new Date().toISOString(),
  poids: 0,
  metrage: 0,
};

export default function CreateProductDialog({
  open,
  setOpen,
}: CreateProductDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const createProductMutation = useCreateProduct();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    if (error) setError(null);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errorMessage = validateProductForm(formData);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    const buffer = image ? await image.arrayBuffer() : null;
    const productPayload = {
      ...formData,
      productImage: buffer,
      fileName: image?.name || null,
    };

    // Call the create product mutation
    createProductMutation.mutate(
      { productData: productPayload },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setFormData(initialFormData);
          setImage(null);
          setImagePreview(null);
          setOpen(false);
        },
      }
    );
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
              <img
                src={productLogo}
                alt="logo-produit"
                className="w-10 h-10 border bg-primary/10 p-2 rounded-lg"
              />
              <p className="text-2xl font-bagel">Créer un produit</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Ce produit sera ajouté à votre saison active.
            </DialogDescription>
          </DialogHeader>

          <ProductForm
            formData={formData}
            setFormData={setFormData}
            error={error}
            imagePreview={imagePreview}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Dialog on desktop
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <img
              src={productLogo}
              alt="logo-produit"
              className="w-10 h-10 border bg-primary/10 p-2 rounded-lg"
            />
            <p className="text-2xl font-bagel">Créer un produit</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Ce produit sera ajouté à votre saison active.
          </DialogDescription>
        </DialogHeader>
        <ProductForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          imagePreview={imagePreview}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProductForm({
  formData,
  setFormData,
  error,
  imagePreview,
  handleSubmit,
  handleChange,
  handleImageChange,
}: {
  formData: CreateProductInput;
  setFormData: React.Dispatch<React.SetStateAction<CreateProductInput>>;
  error: string | null;
  imagePreview: string | null;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="createProductForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Référence du produit */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <Label htmlFor="reference" className="text-base font-semibold">
            Référence du produit
          </Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Entrez la référence du produit"
            className="border border-background/50 text-base placeholder:text-background/50"
          />
        </div>

        {/* Informations & Image */}
        <div className="flex gap-2 flex-col md:flex-row">
          <div className="md:flex-1 flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <h1 className="text-base font-semibold">Informations du produit</h1>
            <div className="flex gap-2 flex-col md:flex-row">
              <div className="flex flex-col gap-2 flex-1">
                <Label htmlFor="name" className="text-base font-medium">
                  Nom
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Entrez le nom du produit"
                  className="border border-background/50 text-base placeholder:text-background/50"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="date" className="text-base font-medium">
                  Date
                </Label>
                <DatePicker
                  className="w-full"
                  setFormData={setFormData}
                  date={formData.createdAt}
                  label="createdAt"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Entrez la description du produit"
                className="border border-background/50 text-base placeholder:text-background/50 flex-1"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="md:flex-1 flex flex-col h-[200px] md:h-auto md:max-h-[350px]">
            <Label
              htmlFor="productImage"
              className="text-base flex flex-col gap-4 h-full p-2 bg-muted-foreground rounded-lg overflow-hidden"
            >
              <span className="font-semibold">Image du produit</span>
              <div className="flex items-center gap-2 cursor-pointer justify-center flex-1 rounded-lg overflow-hidden">
                {!imagePreview && <Upload className="w-5 h-5" />}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Aperçu du produit"
                    className="object-cover w-full h-full max-h-"
                  />
                )}
              </div>
            </Label>
            <Input
              id="productImage"
              name="productImage"
              type="file"
              placeholder="Choisir une image"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Stock & Type */}
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <Label htmlFor="totalQty" className="text-base font-semibold">
              Quantité
            </Label>
            <Input
              id="totalQty"
              name="totalQty"
              placeholder="Entrez le quantité du produit"
              type="number"
              className="border border-background/50 text-base placeholder:text-background/50"
              value={formData.totalQty}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <Label
              htmlFor="poids"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Scale className="w-4 h-4" />
              Poids (kg)
            </Label>
            <Input
              id="poids"
              name="poids"
              placeholder="Poids en kilogrammes"
              type="number"
              step="0.01"
              min="0"
              className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
              value={formData.poids || ""}
              onChange={handleChange}
            />
            <p className="text-xs text-background/60">
              Optionnel - laissez vide si non applicable
            </p>
          </div>

          <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <Label
              htmlFor="metrage"
              className="text-base font-semibold flex items-center gap-2"
            >
              <Ruler className="w-4 h-4" />
              Métrage (m)
            </Label>
            <Input
              id="metrage"
              name="metrage"
              placeholder="Longueur en mètres"
              type="number"
              step="0.01"
              min="0"
              className="border border-background/50 text-[14px] md:text-[14px] placeholder:text-background/50"
              value={formData.metrage || ""}
              onChange={handleChange}
            />
            <p className="text-xs text-background/60">
              Optionnel - laissez vide si non applicable
            </p>
          </div>
        </div>
      </form>
      <div className="">
        <div className="text-base text-destructive">
          {error && <p className="text-destructive">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost" className="border border-background/50">
              Annuler
            </Button>
          </DialogClose>

          <Button type="submit" className="w-fit" form="createProductForm">
            Créer le produit
          </Button>
        </div>
      </div>
    </div>
  );
}
