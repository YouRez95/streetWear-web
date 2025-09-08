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
import productLogo from "@/assets/icons/products-icon.svg";
import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useActiveClients, useCreateBonClient } from "@/hooks/useClients";
import { useCreateOrderClientFromReturnStock } from "@/hooks/useReturnStock";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { ChevronDown, PlusIcon, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Badge } from "@/components/ui/badge";
import type { GetActiveClientsResponse, ReturnStock } from "@/types/models";

type TransferProductClientDialogProps = {
  product: ReturnStock;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SelectedClient = GetActiveClientsResponse["clients"][0];

type FormData = {
  clientId: string | null;
  transferQuantity: number;
  priceByUnit: number;
  bon_number: number | null;
  date: string | null;
};

export default function TranferReturnStockToClient({
  product,
  open,
  setOpen,
}: TransferProductClientDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { mutate: createBonClient } = useCreateBonClient();
  const { activeSeason } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [selectClient, setSelectClient] = useState<SelectedClient>();
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null);
  const { data: activeClients } = useActiveClients();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBonNumberOpen, setIsBonNumberOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    clientId: null,
    transferQuantity: product.stockInfo.availableForTransfer,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
  });
  const { mutate: createOrderClient } = useCreateOrderClientFromReturnStock();

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        clientId: null,
        transferQuantity: product.stockInfo.availableForTransfer,
        priceByUnit: 0,
        bon_number: null,
        date: new Date().toISOString(),
      });
      setError(null);
      setSelectClient(undefined);
      setSelectBonNumber(null);
    }
  }, [open, product]);

  const closeDialog = () => {
    setOpen(false);
    setFormData({
      clientId: null,
      transferQuantity: product.stockInfo.availableForTransfer,
      priceByUnit: 0,
      bon_number: null,
      date: new Date().toISOString(),
    });
    setError(null);
    setSelectClient(undefined);
    setSelectBonNumber(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = () => {
    if (!formData.clientId) return setError("Veuillez sélectionner un client");
    if (formData.transferQuantity > product.stockInfo.availableForTransfer) {
      if (product.stockInfo.availableForTransfer === 0) {
        return setError("Aucune unité disponible pour ce produit");
      } else {
        return setError(
          `Vous ne pouvez transférer que ${product.stockInfo.availableForTransfer} unités`
        );
      }
    }
    if (formData.priceByUnit <= 0)
      return setError("Le prix par unité doit être supérieur à 0");
    if (formData.transferQuantity <= 0)
      return setError("La quantité doit être supérieure à 0");
    if (!formData.bon_number)
      return setError("Veuillez sélectionner un numéro de bon");
    if (!formData.date) return setError("Veuillez sélectionner une date");

    setError(null);

    createOrderClient(
      {
        clientId: formData.clientId,
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
    if (activeSeason && selectClient?.id) {
      createBonClient(selectClient.id, {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          setSelectClient((prev) =>
            prev
              ? {
                  ...prev,
                  BonsClients: [
                    {
                      bon_number: data.bon?.bon_number as number,
                      id: data.bon?.id as string,
                      bonStatus: "OPEN",
                    },
                    ...prev.BonsClients,
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
            Transférer ce produit au client.
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 px-2 md:px-0">
          <FormContent
            activeClients={activeClients}
            formData={formData}
            handleFormChange={handleFormChange}
            isBonNumberOpen={isBonNumberOpen}
            isDropdownOpen={isDropdownOpen}
            selectBonNumber={selectBonNumber}
            selectClient={selectClient}
            setFormData={setFormData}
            setIsBonNumberOpen={setIsBonNumberOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            setSelectBonNumber={setSelectBonNumber}
            setSelectClient={setSelectClient}
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

// FormContent Component
type FormContentProps = {
  selectClient: SelectedClient | undefined;
  setSelectClient: React.Dispatch<
    React.SetStateAction<SelectedClient | undefined>
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
  activeClients: GetActiveClientsResponse | undefined;
  handleAddBonNumber: () => void;
  product: ReturnStock;
};

const FormContent = ({
  setIsDropdownOpen,
  isBonNumberOpen,
  isDropdownOpen,
  selectClient,
  activeClients,
  setSelectClient,
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
      {/* First row: Client Selection & Quantity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select Client */}
        <div className="space-y-2">
          <Label
            htmlFor="client-select"
            className="text-base font-medium text-background"
          >
            Client
          </Label>
          <div className="relative">
            <button
              type="button"
              id="client-select"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-background/30 hover:border-background/50 text-sm flex justify-between items-center p-3 rounded-lg bg-foreground text-background transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {selectClient ? (
                <span className="truncate">{selectClient.name}</span>
              ) : (
                <span className="text-background/70">
                  Sélectionner un client
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
                {activeClients?.clients.length === 0 ? (
                  <div className="p-3 text-background/70 text-sm">
                    Aucun client trouvé
                  </div>
                ) : (
                  activeClients?.clients.map((client) => (
                    <div
                      key={client.id}
                      className="p-3 hover:bg-background/10 cursor-pointer text-sm border-b border-background/10 last:border-b-0 transition-colors"
                      onClick={() => {
                        setSelectClient(client);
                        setIsDropdownOpen(false);
                        const firstBonNumber =
                          client.BonsClients[0]?.bon_number || null;
                        setSelectBonNumber(firstBonNumber);
                        setFormData((prevData) => ({
                          ...prevData,
                          clientId: client.id,
                          bon_number: firstBonNumber,
                        }));
                      }}
                    >
                      <span>{client.name}</span>
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
              max={product.stockInfo.availableForTransfer}
              value={formData.transferQuantity}
              onChange={handleFormChange}
              placeholder="Quantité à transférer"
            />
            <span className="absolute -bottom-5 left-0 text-xs text-background/60">
              Max: {product.stockInfo.availableForTransfer} unités
            </span>
          </div>
        </div>
      </div>

      {/* Second row: Price & Total & Date */}
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
      {selectClient && (
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
              {isBonNumberOpen && selectClient && (
                <div className="absolute bottom-full md:top-full left-0 w-full bg-foreground border border-background/30 rounded-lg mt-1 z-50 max-h-[200px] h-fit overflow-y-auto shadow-lg">
                  {selectClient?.BonsClients.length === 0 ? (
                    <div className="p-3 text-background/70 text-sm">
                      Aucun numéro de bon trouvé
                    </div>
                  ) : (
                    selectClient?.BonsClients.map((bon) => (
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
