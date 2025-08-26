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
import { ChevronDown, PlusIcon } from "lucide-react";
import { useState } from "react";

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

export default function TransferProductFaconnierDialog({
  product,
  open,
  setOpen,
}: TransferProductStylistDialogProps) {
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
    bon_number: selectBonNumber,
    date: new Date().toISOString(),
  });
  const { mutate: createOrderStylist } = useCreateOrderStylist();

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
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTransfer = () => {
    // Add the product id to the form data
    if (!formData.stylistId) {
      setError("Veuillez sélectionner un stylist");
      return;
    }
    if (formData.transferQuantity > product.ProductStatus.raw_in_stock) {
      setError(
        "Vous ne pouvez transférer que " +
          product.ProductStatus.raw_in_stock +
          " unités"
      );
      return;
    }
    if (formData.priceByUnit <= 0) {
      setError("Le prix par unité doit être supérieur à 0");
      return;
    }
    if (formData.transferQuantity <= 0) {
      setError("La quantité de transfert doit être supérieure à 0");
      return;
    }

    if (!formData.bon_number) {
      setError("Please select a bon number");
      return;
    }
    setError(null);

    //console.log('form data to stylist', formData)

    createOrderStylist(
      {
        stylistId: formData.stylistId,
        productId: product.id,
        transferQuantity: Number(formData.transferQuantity),
        priceByUnit: Number(formData.priceByUnit),
        bon_number: Number(formData.bon_number),
        date: formData.date,
      },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          closeDialog();
        },
      }
    );
  };

  // Add Bon Number
  const handleAddBonNumber = () => {
    if (activeSeason && selectStylist?.id) {
      createBonStylist(selectStylist.id, {
        onSuccess: (data) => {
          if (data.status === "failed") {
            //console.log('data on create bon', data)
            return;
          }
          setSelectStylist((prevStylist) => {
            if (!prevStylist) return prevStylist;
            return {
              ...prevStylist,
              BonsStyleTrait: [
                {
                  bon_number: data.bon?.bon_number as number,
                  id: data.bon?.id as string,
                  bonStatus: "OPEN",
                },
                ...prevStylist.BonsStyleTrait,
              ],
            };
          });
          setSelectBonNumber(data.bon?.bon_number as number);
          setFormData((prevData) => ({
            ...prevData,
            bon_number: data.bon?.bon_number as number,
          }));
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent
        className="bg-foreground min-w-[700px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <img
              src={productLogo}
              alt="product-logo"
              className="w-10 h-10 bg-background p-2 rounded-lg"
            />
            <p className="text-2xl font-bagel">Transférer un produit</p>
            <Badge
              variant="outline"
              className="bg-background text-foreground mt-1"
            >
              {product.name}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Transférer ce produit au stylist.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex items-center gap-4">
          {/* Select Faconnier */}
          <div className="flex gap-2 w-1/2 items-center">
            <Label htmlFor="stylist-select" className="text-base">
              Stylist:
            </Label>
            <div className="relative w-[200px]">
              <button
                type="button"
                id="stylist-select"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border border-background/50 text-[14px] flex justify-between items-center p-2 rounded-md bg-foreground text-background"
              >
                {selectStylist ? (
                  <div>
                    {selectStylist?.name}
                    <Badge
                      variant="outline"
                      className="bg-background text-foreground mt-1"
                    >
                      {selectStylist?.type}
                    </Badge>
                  </div>
                ) : (
                  "Sélectionner un stylist"
                )}
                <ChevronDown />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50 max-h-[200px] overflow-y-auto">
                  {activeStylists?.stylists.length === 0 && (
                    <div className="p-2 text-background/70">
                      Aucun stylist trouvé
                    </div>
                  )}
                  {activeStylists?.stylists.map((stylist) => (
                    <div
                      key={stylist.id}
                      className="p-2 hover:bg-background/10 cursor-pointer text-sm"
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
                      {stylist.name} ({stylist.type})
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          {/* Transfer Quantity */}
          <div className="flex items-center gap-2 w-1/2">
            <Label
              htmlFor="transfer-quantity"
              className="text-background text-base whitespace-nowrap"
            >
              Quantité:
            </Label>
            {/* <div className="relative w-full"> */}
            <Input
              name="transferQuantity"
              id="transfer-quantity"
              className="border-background/50"
              type="number"
              value={formData.transferQuantity}
              onChange={handleFormChange}
            />
            {/* <span className="absolute top-full left-0 text-destructive text-sm">
                you can only transfer {product.ProductStatus.raw_in_stock} units
              </span> */}
            {/* </div> */}
          </div>
        </div>

        <div className="flex items-center gap-4 py-4 relative">
          {/* Price By Unit */}
          <div className="flex gap-2 w-1/2 items-center">
            <Label
              htmlFor="price-by-unit"
              className="text-background text-base whitespace-nowrap"
            >
              Prix par unité:
            </Label>
            <Input
              name="priceByUnit"
              id="price-by-unit"
              className="border-background/50"
              type="number"
              value={formData.priceByUnit}
              onChange={handleFormChange}
            />
          </div>
          {/* Total Price */}
          <div className="flex items-center gap-2 w-1/2">
            <Label
              htmlFor="total-price"
              className="text-background text-base whitespace-nowrap"
            >
              Total:
            </Label>
            <Input
              name="totalPrice"
              id="total-price"
              className="border-background/50"
              type="number"
              readOnly
              value={formData.transferQuantity * formData.priceByUnit}
            />
          </div>
          <DatePicker setFormData={setFormData} />
        </div>
        {/* Bon Number */}
        <div className="flex gap-2 items-center">
          {selectStylist && (
            <>
              <div className="flex gap-2 relative w-full">
                <button
                  type="button"
                  id="bon-number-select"
                  onClick={() => setIsBonNumberOpen(!isBonNumberOpen)}
                  className="w-full border border-background/50 text-[14px] flex justify-between items-center p-2 rounded-md bg-foreground text-background"
                >
                  {selectBonNumber
                    ? `bon #${selectBonNumber}`
                    : "Sélectionner un numéro de bon"}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isBonNumberOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isBonNumberOpen && (
                  <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50 max-h-[200px] overflow-y-auto">
                    {selectStylist?.BonsStyleTrait.length === 0 && (
                      <div className="p-2 text-background/70">
                        Aucun numéro de bon trouvé
                      </div>
                    )}
                    {selectStylist?.BonsStyleTrait.map((bon) => (
                      <div
                        key={bon.bon_number}
                        className="p-2 hover:bg-background/10 cursor-pointer text-sm"
                        onClick={() => {
                          setSelectBonNumber(bon.bon_number);
                          setIsBonNumberOpen(false);
                          setFormData((prevData) => ({
                            ...prevData,
                            bon_number: bon.bon_number,
                          }));
                        }}
                      >
                        bon #{bon.bon_number}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <Button onClick={handleAddBonNumber}>
                <PlusIcon />
                <p>Ajouter un numéro de bon</p>
              </Button>
            </>
          )}
        </div>

        <DialogFooter
          className={cn(
            "flex items-center gap-2 ",
            error
              ? "justify-between sm:justify-between"
              : "justify-end sm:justify-end"
          )}
        >
          {error && <p className="text-destructive text-sm">{error}</p>}
          <div className="flex gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border text-base">
                Annuler
              </Button>
            </DialogClose>
            <Button
              className="bg-background text-foreground text-base"
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
