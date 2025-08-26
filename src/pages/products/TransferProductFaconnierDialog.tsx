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
import type { GetActiveFaconniersResponse, Product } from "@/types/models";
import productLogo from "@/assets/icons/products-icon.svg";
import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useActiveFaconniers,
  useCreateBonFaconnier,
  useCreateOrderFaconnier,
} from "@/hooks/useFaconnier";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { ChevronDown, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

type TransferProductFaconnierDialogProps = {
  product: Product;
  transferTo: "faconnier" | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SelectedFaconnier = GetActiveFaconniersResponse["faconniers"][0];

type FormData = {
  faconnierId: string | null;
  transferQuantity: number;
  priceByUnit: number;
  bon_number: number | null;
  date: string | null;
};

export default function TransferProductFaconnierDialog({
  product,
  open,
  setOpen,
}: TransferProductFaconnierDialogProps) {
  const { mutate: createBonFaconnier } = useCreateBonFaconnier();
  const { activeSeason } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [selectFaconnier, setSelectFaconnier] = useState<SelectedFaconnier>();
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null);
  const { data: activeFaconniers } = useActiveFaconniers();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBonNumberOpen, setIsBonNumberOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    faconnierId: null,
    transferQuantity: product.ProductStatus.raw_in_stock,
    priceByUnit: 0,
    bon_number: selectBonNumber,
    date: new Date().toISOString(),
  });
  const { mutate: createOrderFaconnier } = useCreateOrderFaconnier();

  // Add this effect to reset formData when dialog opens or product changes
  useEffect(() => {
    if (open) {
      setFormData({
        faconnierId: null,
        transferQuantity: product.ProductStatus.raw_in_stock,
        priceByUnit: 0,
        bon_number: null,
        date: new Date().toISOString(),
      });
      setError(null);
      setSelectFaconnier(undefined);
      setSelectBonNumber(null);
    }
  }, [open, product]);

  const closeDialog = () => {
    setOpen(false);
    setFormData({
      faconnierId: null,
      transferQuantity: product.ProductStatus.raw_in_stock,
      priceByUnit: 0,
      bon_number: null,
      date: new Date().toISOString(),
    });
    setError(null);
    setSelectFaconnier(undefined);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleTransfer = () => {
    // Add the product id to the form data
    if (!formData.faconnierId) {
      setError("Veuillez sélectionner un faconnier");
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
      setError("Veuillez sélectionner un numéro de bon");
      return;
    }

    if (!formData.date) {
      setError("Veuillez sélectionner une date");
      return;
    }
    setError(null);
    //console.log('formData', formData)
    // Call createOrderFaconnier mutation
    createOrderFaconnier(
      {
        faconnierId: formData.faconnierId,
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
    if (activeSeason && selectFaconnier?.id) {
      createBonFaconnier(selectFaconnier.id, {
        onSuccess: (data) => {
          if (data.status === "failed") {
            //console.log('data on create bon', data)
            return;
          }
          setSelectFaconnier((prevFaconnier) => {
            if (!prevFaconnier) return prevFaconnier;
            return {
              ...prevFaconnier,
              BonsFaconnier: [
                {
                  bon_number: data.bon?.bon_number as number,
                  id: data.bon?.id as string,
                  bonStatus: "OPEN",
                },
                ...prevFaconnier.BonsFaconnier,
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
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Transférer ce produit au faconnier.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 flex items-center gap-4">
          {/* Select Faconnier */}
          <div className="flex gap-2 w-1/2 items-center">
            <Label htmlFor="faconnier-select" className="text-base">
              Faconnier:
            </Label>
            <div className="relative w-[200px]">
              <button
                type="button"
                id="faconnier-select"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full border border-background/50 text-[14px] flex justify-between items-center p-2 rounded-md bg-foreground text-background"
              >
                {selectFaconnier?.name || "Sélectionner un faconnier"}
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50 max-h-[200px] overflow-y-auto">
                  {activeFaconniers?.faconniers.length === 0 && (
                    <div className="p-2 text-background/70">
                      Aucun faconnier trouvé
                    </div>
                  )}
                  {activeFaconniers?.faconniers.map((faconnier) => (
                    <div
                      key={faconnier.id}
                      className="p-2 hover:bg-background/10 cursor-pointer text-sm"
                      onClick={() => {
                        setSelectFaconnier(faconnier);
                        setIsDropdownOpen(false);
                        const firstBonNumber =
                          faconnier.BonsFaconnier[0]?.bon_number || null;
                        setSelectBonNumber(firstBonNumber);
                        setFormData((prevData) => ({
                          ...prevData,
                          faconnierId: faconnier.id,
                          bon_number: firstBonNumber,
                        }));
                      }}
                    >
                      {faconnier.name}
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
          </div>
        </div>

        <div className="flex items-center gap-4 py-4 relative ">
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
          {/* Date */}
          <DatePicker setFormData={setFormData} />
        </div>
        {/* Bon Number */}
        <div className="flex gap-2 items-center">
          {selectFaconnier && (
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
                    {selectFaconnier?.BonsFaconnier.length === 0 && (
                      <div className="p-2 text-background/70">
                        Aucun numéro de bon trouvé
                      </div>
                    )}
                    {selectFaconnier?.BonsFaconnier.map((bon) => (
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
              Transfer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
