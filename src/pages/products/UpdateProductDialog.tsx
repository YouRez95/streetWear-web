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
import { useUpdateProduct } from "@/hooks/useProduct";
import { getImageUrl, validateProductForm } from "@/lib/utils";
import { Ruler, Scale, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { CreateProductInput, Product } from "@/types/models";
import { useMediaQuery } from "@uidotdev/usehooks";

type UpdateProductDialogProps = {
  product: Product;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const initialFormData: CreateProductInput & {
  id: string;
} = {
  id: "",
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

export default function UpdateProductDialog({
  product,
  open,
  setOpen,
}: UpdateProductDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const updateProductMutation = useUpdateProduct();

  useEffect(() => {
    if (product && open) {
      setFormData({
        id: product.id,
        name: product.name || "",
        description: product.description || "",
        reference: product.reference || "",
        totalQty: product.totalQty || 0,
        productImage: null,
        fileName: null,
        createdAt: product.createdAt || new Date().toISOString(),
        poids: product.poids || 0,
        metrage: product.metrage || 0,
      });

      if (product.productImage) setImageUrl(product.productImage);
      setImagePreview(null);
    }
  }, [product, open]);

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

    updateProductMutation.mutate(
      { productData: productPayload },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
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
      setImageUrl(null);
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
              <p className="text-2xl font-bagel">Mettre à jour le produit</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Mettre à jour les informations et l'image du produit.
            </DialogDescription>
          </DialogHeader>
          <FormContent
            error={error}
            formData={formData}
            handleChange={handleChange}
            handleImageChange={handleImageChange}
            handleSubmit={handleSubmit}
            imagePreview={imagePreview}
            imageUrl={imageUrl}
            isMobile={isMobile}
            setFormData={setFormData}
            isPending={updateProductMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // Desktop
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
            <p className="text-2xl font-bagel">Mettre à jour le produit</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Mettre à jour les informations et l'image du produit.
          </DialogDescription>
        </DialogHeader>
        <FormContent
          error={error}
          formData={formData}
          handleChange={handleChange}
          handleImageChange={handleImageChange}
          handleSubmit={handleSubmit}
          imagePreview={imagePreview}
          imageUrl={imageUrl}
          isMobile={isMobile}
          setFormData={setFormData}
          isPending={updateProductMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

const FormContent = ({
  error,
  formData,
  handleChange,
  handleImageChange,
  handleSubmit,
  imagePreview,
  imageUrl,
  setFormData,
  isPending,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  formData: CreateProductInput & { id: string };
  setFormData: React.Dispatch<
    React.SetStateAction<CreateProductInput & { id: string }>
  >;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: string | null;
  imageUrl: string | null;
  error: string | null;
  isMobile: boolean;
  isPending: boolean;
}) => {
  return (
    <div className="flex-1 justify-between flex flex-col pb-5 md:pb-0">
      <form
        id="updateProductForm"
        className="flex flex-col gap-2 mb-5"
        onSubmit={handleSubmit}
      >
        {/* Product Reference */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <Label htmlFor="reference" className="text-base font-semibold">
            Référence du produit
          </Label>
          <Input
            id="reference"
            name="reference"
            value={formData.reference}
            onChange={handleChange}
            placeholder="Entrer la référence du produit"
            className="border border-background/50 text-base placeholder:text-background/50"
          />
        </div>

        {/* Product Information & Image */}
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex-1 flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <h1 className="text-base font-semibold">Informations du produit</h1>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-base font-medium">
                Nom
              </Label>
              <Input
                id="name"
                name="name"
                placeholder="Entrer le nom du produit"
                className="border border-background/50 text-base placeholder:text-background/50"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">Date</Label>
              <DatePicker
                className="w-full"
                setFormData={setFormData}
                date={formData.createdAt}
                label="createdAt"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="description" className="text-base">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Entrer la description du produit"
                className="border border-background/50 text-base placeholder:text-background/50 flex-1"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col max-h-[300px]">
            <Label
              htmlFor="productImage"
              className="text-base flex flex-col gap-4 h-full p-2 bg-muted-foreground rounded-lg overflow-hidden"
            >
              <span className="font-semibold">Image du produit</span>
              <div className="flex items-center gap-2 cursor-pointer justify-center flex-1 rounded-lg overflow-hidden">
                {!imagePreview && !imageUrl && <Upload className="w-5 h-5" />}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product Preview"
                    className="object-cover w-full h-full"
                  />
                )}
                {imageUrl && (
                  <img
                    src={getImageUrl(imageUrl)}
                    alt="Product Preview"
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            </Label>
            <Input
              id="productImage"
              name="productImage"
              type="file"
              placeholder="Enter Product Image"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Product Stock */}
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
            <Label htmlFor="totalQty" className="text-base font-semibold">
              Stock
            </Label>
            <Input
              id="totalQty"
              name="totalQty"
              placeholder="Entrer le stock du produit"
              type="number"
              className="border border-background/50 text-base placeholder:text-background/50"
              value={formData.totalQty}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Poids et Métrage */}
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
              value={formData.poids}
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
              value={formData.metrage}
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

          <Button
            type="submit"
            className="w-fit"
            form="updateProductForm"
            disabled={isPending}
          >
            {isPending ? "Mise à jour..." : "Mettre à jour le produit"}
          </Button>
        </div>
      </div>
    </div>
  );
};
