import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { GetActiveStylistsResponse, Product } from "@/types/models";
import productLogo from "@/assets/icons/products-icon.svg";
import DatePicker from "@/components/datePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useActiveStylists,
  useCreateBonStylist,
  useCreateOrderStylist,
} from "@/hooks/useStylist";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { ChevronDown, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type TransferProductStylistDialogProps = {
  product: Product;
  transferTo: "stylist" | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SelectedStylist = GetActiveStylistsResponse["stylists"][0];

type FormData = {
  stylistId: string | null;
  transferQuantity: number;
  priceByUnit: number;
  bon_number: number | null;
  date: string;
};

export default function TransferProductStylistDialog({
  product,
  open,
  setOpen,
}: TransferProductStylistDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { mutate: createBonStylist } = useCreateBonStylist();
  const { activeSeason } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [selectStylist, setSelectStylist] = useState<SelectedStylist>();
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null);
  const { data: activeStylists } = useActiveStylists();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBonNumberOpen, setIsBonNumberOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    stylistId: null,
    transferQuantity: product.ProductStatus.raw_in_stock,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
  });
  const { mutate: createOrderStylist } = useCreateOrderStylist();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        stylistId: null,
        transferQuantity: product.ProductStatus.raw_in_stock,
        priceByUnit: 0,
        bon_number: null,
        date: new Date().toISOString(),
      });
      setError(null);
      setSelectStylist(undefined);
      setSelectBonNumber(null);
    }
  }, [open, product]);

  const closeDialog = () => {
    setOpen(false);
    setFormData({
      stylistId: null,
      transferQuantity: product.ProductStatus.raw_in_stock,
      priceByUnit: 0,
      bon_number: null,
      date: new Date().toISOString(),
    });
    setError(null);
    setSelectStylist(undefined);
    setSelectBonNumber(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = () => {
    if (!formData.stylistId)
      return setError("Veuillez sélectionner un styliste");
    if (formData.transferQuantity > product.ProductStatus.raw_in_stock)
      return setError(
        `Vous ne pouvez transférer que ${product.ProductStatus.raw_in_stock} unités`
      );
    if (formData.priceByUnit <= 0)
      return setError("Le prix par unité doit être supérieur à 0");
    if (formData.transferQuantity <= 0)
      return setError("La quantité doit être supérieure à 0");
    if (!formData.bon_number)
      return setError("Veuillez sélectionner un numéro de bon");
    if (!formData.date) return setError("Veuillez sélectionner une date");

    setError(null);

    createOrderStylist(
      {
        stylistId: formData.stylistId,
        productId: product.id,
        transferQuantity: Number(formData.transferQuantity),
        priceByUnit: Number(formData.priceByUnit),
        bon_number: Number(formData.bon_number),
        date: formData.date,
      },
      { onSuccess: (data) => data.status !== "failed" && closeDialog() }
    );
  };

  // Add Bon Number
  const handleAddBonNumber = () => {
    if (activeSeason && selectStylist?.id) {
      createBonStylist(selectStylist.id, {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          setSelectStylist((prev) =>
            prev
              ? {
                  ...prev,
                  BonsStyleTrait: [
                    {
                      bon_number: data.bon?.bon_number as number,
                      id: data.bon?.id as string,
                      bonStatus: "OPEN",
                    },
                    ...prev.BonsStyleTrait,
                  ],
                }
              : prev
          );
          setSelectBonNumber(data.bon?.bon_number as number);
          setFormData((prev) => ({
            ...prev,
            bon_number: data.bon?.bon_number as number,
          }));
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "min-w-[700px] max-w-[800px]"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Close Button on Mobile */}
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

        <DialogHeader className="flex flex-col gap-3 pb-4 pt-5 md:pt-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img
                src={productLogo}
                alt="logo-produit"
                className="w-10 h-10 border bg-primary/10 p-2 rounded-lg"
              />
              <p
                className={cn("font-bagel", isMobile ? "text-xl" : "text-2xl")}
              >
                Transférer un produit
              </p>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "border-background/20",
                isMobile
                  ? "bg-primary/10 text-primary"
                  : "bg-background/10 text-background"
              )}
            >
              {product.name}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-left">
            Transférer ce produit au styliste.
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 px-2 md:px-0">
          <FormContent
            activeStylists={activeStylists}
            formData={formData}
            handleFormChange={handleFormChange}
            isBonNumberOpen={isBonNumberOpen}
            isDropdownOpen={isDropdownOpen}
            selectBonNumber={selectBonNumber}
            selectStylist={selectStylist}
            setFormData={setFormData}
            setIsBonNumberOpen={setIsBonNumberOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setSelectBonNumber={setSelectBonNumber}
            setSelectStylist={setSelectStylist}
            handleAddBonNumber={handleAddBonNumber}
            product={product}
          />
        </div>

        {/* Sticky Footer */}
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
              className={cn(
                "flex-1 text-base",
                isMobile
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              )}
              onClick={handleTransfer}
            >
              Transférer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type FormContentProps = {
  selectStylist: SelectedStylist | undefined;
  setSelectStylist: React.Dispatch<
    React.SetStateAction<SelectedStylist | undefined>
  >;
  selectBonNumber: number | null;
  setSelectBonNumber: React.Dispatch<React.SetStateAction<number | null>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBonNumberOpen: boolean;
  setIsBonNumberOpen: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  activeStylists: GetActiveStylistsResponse | undefined;
  handleAddBonNumber: () => void;
  product: Product;
};

const FormContent = ({
  setIsDropdownOpen,
  isBonNumberOpen,
  isDropdownOpen,
  selectStylist,
  activeStylists,
  setSelectStylist,
  setFormData,
  selectBonNumber,
  formData,
  setSelectBonNumber,
  handleFormChange,
  setIsBonNumberOpen,
  handleAddBonNumber,
  product,
}: FormContentProps) => {
  return (
    <div className="space-y-6 mb-5 md:mb-0">
      {/* First row: Stylist Selection & Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select Stylist */}
        <div className="space-y-2">
          <Label
            htmlFor="stylist-select"
            className="text-base font-medium text-background"
          >
            Styliste
          </Label>
          <div className="relative">
            <button
              type="button"
              id="stylist-select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-background/30 hover:border-background/50 text-sm flex justify-between items-center p-3 rounded-lg bg-foreground text-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {selectStylist ? (
                <div className="flex items-center gap-2">
                  <span className="truncate">{selectStylist.name}</span>
                  <Badge
                    variant="outline"
                    className="bg-background/10 text-background border-background/20 text-xs"
                  >
                    {selectStylist.type}
                  </Badge>
                </div>
              ) : (
                <span className="text-background/70">
                  Sélectionner un styliste
                </span>
              )}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-foreground border border-background/30 rounded-lg mt-1 z-50 max-h-[200px] overflow-y-auto shadow-lg">
                {activeStylists?.stylists.length === 0 ? (
                  <div className="p-3 text-background/70 text-sm">
                    Aucun styliste trouvé
                  </div>
                ) : (
                  activeStylists?.stylists.map((stylist) => (
                    <div
                      key={stylist.id}
                      className="p-3 hover:bg-background/10 cursor-pointer text-sm border-b border-background/10 last:border-b-0 transition-colors"
                      onClick={() => {
                        setSelectStylist(stylist);
                        setIsDropdownOpen(false);
                        const firstBonNumber =
                          stylist.BonsStyleTrait[0]?.bon_number || null;
                        setSelectBonNumber(firstBonNumber);
                        setFormData((prevData) => ({
                          ...prevData,
                          stylistId: stylist.id,
                          bon_number: firstBonNumber,
                        }));
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{stylist.name}</span>
                        <Badge
                          variant="outline"
                          className="bg-background/10 text-background border-background/20 text-xs"
                        >
                          {stylist.type}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Transfer Quantity */}
        <div className="space-y-2">
          <Label
            htmlFor="transfer-quantity"
            className="text-base font-medium text-background"
          >
            Quantité
          </Label>
          <div className="relative">
            <Input
              name="transferQuantity"
              id="transfer-quantity"
              className="border-background/30 hover:border-background/50 focus:border-primary/50 bg-foreground text-background p-3 rounded-lg transition-colors"
              type="number"
              min="1"
              max={product.ProductStatus.raw_in_stock}
              value={formData.transferQuantity}
              onChange={handleFormChange}
              placeholder="Quantité à transférer"
            />
            <span className="absolute -bottom-5 left-0 text-xs text-background/60">
              Max: {product.ProductStatus.raw_in_stock} unités
            </span>
          </div>
        </div>
      </div>

      {/* Second row: Price & Total */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Price By Unit */}
        <div className="space-y-2">
          <Label
            htmlFor="price-by-unit"
            className="text-base font-medium text-background"
          >
            Prix par unité (DH)
          </Label>
          <Input
            name="priceByUnit"
            id="price-by-unit"
            className="border-background/30 hover:border-background/50 focus:border-primary/50 bg-foreground text-background p-3 rounded-lg transition-colors"
            type="number"
            min="0"
            step="0.01"
            value={formData.priceByUnit}
            onChange={handleFormChange}
            placeholder="0.00"
          />
        </div>

        {/* Total Price */}
        <div className="space-y-2">
          <Label
            htmlFor="total-price"
            className="text-base font-medium text-background"
          >
            Total (DH)
          </Label>
          <Input
            name="totalPrice"
            id="total-price"
            className="border-background/30 bg-background/5 text-background p-3 rounded-lg"
            type="number"
            readOnly
            value={(formData.transferQuantity * formData.priceByUnit).toFixed(
              2
            )}
          />
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="text-base font-medium text-background">Date</Label>
          <DatePicker
            className="w-full border-background/30 hover:border-background/50 focus:border-primary/50 bg-foreground text-background p-3 rounded-lg transition-colors"
            setFormData={setFormData}
            calendarClassName="bottom-full !top-auto md:top-full md:!bottom-auto"
          />
        </div>
      </div>

      {/* Bon Number Section */}
      {selectStylist && (
        <div className="space-y-2">
          <Label className="text-base font-medium text-background">
            Numéro de bon
          </Label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <button
                type="button"
                id="bon-number-select"
                onClick={() => setIsBonNumberOpen(!isBonNumberOpen)}
                className="w-full border border-background/30 hover:border-background/50 text-sm flex justify-between items-center p-3 rounded-lg bg-foreground text-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <span className="truncate">
                  {selectBonNumber
                    ? `Bon #${selectBonNumber}`
                    : "Sélectionner un bon"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isBonNumberOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isBonNumberOpen && selectStylist && (
                <div className="absolute bottom-full md:top-full left-0 w-full bg-foreground border border-background/30 rounded-lg mt-1 z-50 max-h-[200px] h-fit overflow-y-auto shadow-lg">
                  {selectStylist?.BonsStyleTrait.length === 0 ? (
                    <div className="p-3 text-background/70 text-sm">
                      Aucun numéro de bon trouvé
                    </div>
                  ) : (
                    selectStylist?.BonsStyleTrait.map((bon) => (
                      <div
                        key={bon.bon_number}
                        className="p-3 hover:bg-background/10 cursor-pointer text-sm border-b border-background/10 last:border-b-0 transition-colors"
                        onClick={() => {
                          setSelectBonNumber(bon.bon_number);
                          setIsBonNumberOpen(false);
                          setFormData((prevData) => ({
                            ...prevData,
                            bon_number: bon.bon_number,
                          }));
                        }}
                      >
                        Bon #{bon.bon_number}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={handleAddBonNumber}
              className="bg-background/10 hover:bg-background/20 text-background border border-background/30 px-4 py-3 h-full rounded-lg transition-colors"
              variant="ghost"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              <span className="whitespace-nowrap">Nouveau bon</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
