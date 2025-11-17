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
import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useActiveClients,
  useBonsClientPassager,
  useCreateBonClient,
  useCreateBonClientPassager,
} from "@/hooks/useClients";
import { useCreateOrderClientFromReturnStock } from "@/hooks/useReturnStock";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import {
  Calculator,
  Calendar,
  PlusIcon,
  RotateCcw,
  Tag,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import type { GetActiveClientsResponse, ReturnStock } from "@/types/models";
import SearchableDropdown from "../products/SearchableDropDown";

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
  passagerName: string | null;
  clientType: "regular" | "passager";
};

export default function TranferReturnStockToClient({
  product,
  open,
  setOpen,
}: TransferProductClientDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { mutate: createBonClient } = useCreateBonClient();
  const { mutate: createBonClientForPassager } = useCreateBonClientPassager();
  const { activeSeason } = useUserStore();
  const [error, setError] = useState<string | null>(null);
  const [selectClient, setSelectClient] = useState<SelectedClient>();
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null);
  const { data: activeClients } = useActiveClients();
  const { data: bonClientPassager } = useBonsClientPassager();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBonNumberOpen, setIsBonNumberOpen] = useState(false);
  const [bonsForPassager, setBonsForPassager] = useState<number[]>([]);
  const [formData, setFormData] = useState<FormData>({
    clientId: null,
    transferQuantity: product.stockInfo.availableForTransfer,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
    clientType: "regular",
    passagerName: null,
  });
  const { mutate: createOrderClient } = useCreateOrderClientFromReturnStock();

  useEffect(() => {
    if (bonClientPassager && bonClientPassager.bons) {
      const bonNumbers = bonClientPassager.bons.map((bon) => bon.bon_number);
      setBonsForPassager(bonNumbers);
      setSelectBonNumber(bonNumbers[0]);
    }
  }, [bonClientPassager]);
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        clientId: null,
        transferQuantity: product.stockInfo.availableForTransfer,
        priceByUnit: 0,
        bon_number: null,
        date: new Date().toISOString(),
        clientType: "regular",
        passagerName: null,
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
      clientType: "regular",
      passagerName: null,
    });
    setError(null);
    setSelectClient(undefined);
    setSelectBonNumber(null);
  };

  const handleClientTypeChange = (type: "regular" | "passager") => {
    setFormData((prevData) => ({
      ...prevData,
      clientType: type,
      clientId: type === "regular" ? prevData.clientId : null,
      passagerName: type === "passager" ? prevData.passagerName : null,
      bon_number: null,
    }));
    setSelectClient(undefined);
    setSelectBonNumber(null);
    setError(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = () => {
    if (formData.clientType === "regular" && !formData.clientId) {
      setError("Veuillez sélectionner un client");
      return;
    }

    if (formData.clientType === "passager" && !formData.passagerName?.trim()) {
      setError("Veuillez entrer le nom du client passager");
      return;
    }

    if (formData.transferQuantity > product.stockInfo.availableForTransfer) {
      if (product.stockInfo.availableForTransfer === 0) {
        setError("Aucune unité disponible pour ce produit");
      } else {
        setError(
          "Vous ne pouvez transférer que " +
            product.stockInfo.availableForTransfer +
            " unités"
        );
      }
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

    const orderData = {
      clientId: formData.clientType === "regular" ? formData.clientId : null,
      passagerName:
        formData.clientType === "passager" ? formData.passagerName : null,
      productId: product.id,
      transferQuantity: Number(formData.transferQuantity),
      priceByUnit: Number(formData.priceByUnit),
      bon_number: Number(formData.bon_number),
      date: formData.date,
    };
    createOrderClient(orderData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        closeDialog();
      },
    });
  };

  // Add Bon Number
  const handleAddBonNumber = () => {
    if (activeSeason && formData.clientType === "regular" && selectClient?.id) {
      createBonClient(selectClient.id, {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setSelectClient((prevClient) => {
            if (!prevClient) return prevClient;
            return {
              ...prevClient,
              BonsClients: [
                {
                  bon_number: data.bon?.bon_number as number,
                  id: data.bon?.id as string,
                  bonStatus: "OPEN",
                },
                ...prevClient.BonsClients,
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
    } else {
      createBonClientForPassager(undefined, {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          setBonsForPassager((prevBons) => [
            data.bon?.bon_number as number,
            ...prevBons,
          ]);
          setSelectBonNumber(data.bon?.bon_number as number);
          setFormData((prevData) => ({
            ...prevData,
            bon_number: data.bon?.bon_number as number,
          }));
        },
      });
    }
  };

  const totalPrice = formData.transferQuantity * formData.priceByUnit;
  const availableQuantity = product.stockInfo.availableForTransfer;

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

        <DialogHeader className="space-y-4 pb-4 border-b">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="p-2 bg-primary rounded-lg">
              <RotateCcw className="w-6 h-6 text-white" />
            </div>
            Transférer le Stock de Retour
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-base">
            Transférer "{product.name}" depuis le stock de retour à un client.
            Stock disponible:{" "}
            <span className="font-semibold text-secondary">
              {availableQuantity} unités
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Form Content */}
        <div className="flex-1 px-2 md:px-0">
          <FormContent
            availableQuantity={availableQuantity}
            bonsForPassager={bonsForPassager}
            totalPrice={totalPrice}
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
            handleClientTypeChange={handleClientTypeChange}
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
  handleClientTypeChange: (type: "regular" | "passager") => void;
  availableQuantity: number;
  totalPrice: number;
  bonsForPassager: number[];
};

const FormContent = ({
  availableQuantity,
  isBonNumberOpen,
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
  handleClientTypeChange,
  totalPrice,
  bonsForPassager,
}: FormContentProps) => {
  return (
    <div>
      {/* Product Summary */}
      <div className="bg-background/5 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">
              Référence: {product.reference}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Stock de retour disponible</p>
            <p className="text-lg font-bold text-secondary">
              {availableQuantity} unités
            </p>
          </div>
        </div>
      </div>

      {/* Client Type Selection */}
      <div className="mb-6">
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Type de client
        </Label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={formData.clientType === "regular" ? "default" : "ghost"}
            className={`flex items-center gap-2 flex-1 ${
              formData.clientType === "regular"
                ? "bg-primary "
                : "border border-background/35"
            }`}
            onClick={() => handleClientTypeChange("regular")}
          >
            <User className="w-4 h-4" />
            Client Régulier
          </Button>
          <Button
            type="button"
            variant={formData.clientType === "passager" ? "default" : "ghost"}
            className={`flex items-center gap-2 flex-1 ${
              formData.clientType === "passager"
                ? "bg-primary"
                : "border border-background/35"
            }`}
            onClick={() => handleClientTypeChange("passager")}
          >
            <UserPlus className="w-4 h-4" />
            Client Passager
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Client Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="client-select"
              className="text-sm font-medium text-gray-700"
            >
              {formData.clientType === "regular"
                ? "Sélectionner un client"
                : "Nom du client"}
            </Label>
            {formData.clientType === "regular" ? (
              <SearchableDropdown
                items={activeClients?.clients || []}
                selectedItem={selectClient}
                onSelect={(client) => {
                  setSelectClient(client);
                  const firstBonNumber =
                    client.BonsClients[0]?.bon_number || null;
                  setSelectBonNumber(firstBonNumber);
                  setFormData((prevData) => ({
                    ...prevData,
                    clientId: client.id,
                    bon_number: firstBonNumber,
                  }));
                }}
                placeholder="Choisir un client"
                displayValue={(client) => client.name}
                searchFields={["name"]}
              />
            ) : (
              <Input
                name="passagerName"
                placeholder="Entrez le nom complet du client"
                value={formData.passagerName || ""}
                onChange={handleFormChange}
                className="w-full placeholder:text-background/50"
              />
            )}
          </div>

          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4" />
              Date de transfert
            </Label>
            <DatePicker setFormData={setFormData} />
          </div>
        </div>

        {/* Quantity and Pricing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="transfer-quantity"
              className="text-sm font-medium text-gray-700"
            >
              Quantité
            </Label>
            <Input
              name="transferQuantity"
              id="transfer-quantity"
              type="number"
              min="1"
              max={availableQuantity}
              value={formData.transferQuantity}
              onChange={handleFormChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Max: {availableQuantity} unités
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="price-by-unit"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              Prix unitaire
            </Label>
            <Input
              name="priceByUnit"
              id="price-by-unit"
              type="number"
              step="0.01"
              min="0"
              value={formData.priceByUnit}
              onChange={handleFormChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="total-price"
              className="text-sm font-medium text-gray-700 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Total
            </Label>
            <Input
              name="totalPrice"
              id="total-price"
              type="number"
              readOnly
              value={totalPrice}
              className="w-full bg-gray-50 font-semibold"
            />
            <p className="text-xs text-gray-500">Calcul automatique</p>
          </div>
        </div>

        {/* Bon Number Section */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">
            Numéro de bon
          </Label>
          <div className="flex gap-3">
            {formData.clientType === "regular" && selectClient ? (
              <>
                <SearchableDropdown
                  items={selectClient.BonsClients}
                  selectedItem={selectClient.BonsClients.find(
                    (b) => b.bon_number === selectBonNumber
                  )}
                  onSelect={(bon) => {
                    setSelectBonNumber(bon.bon_number);
                    setFormData((prevData) => ({
                      ...prevData,
                      bon_number: bon.bon_number,
                    }));
                  }}
                  placeholder="Sélectionner un bon"
                  displayValue={(bon) => `Bon #${bon.bon_number}`}
                  searchFields={["bon_number"]}
                  className="flex-1"
                />
                <Button onClick={handleAddBonNumber} className="shrink-0">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <p className="text-white font-medium">Nouveau bon</p>
                </Button>
              </>
            ) : formData.clientType === "passager" ? (
              <>
                <div className="flex gap-2 relative flex-1">
                  <button
                    type="button"
                    onClick={() => setIsBonNumberOpen(!isBonNumberOpen)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm flex justify-between items-center bg-white hover:bg-gray-50"
                  >
                    {selectBonNumber
                      ? `Bon #${selectBonNumber}`
                      : "Sélectionner un bon"}
                    <PlusIcon className="h-4 w-4" />
                  </button>
                  {isBonNumberOpen && (
                    <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-md mt-1 z-50 max-h-48 overflow-y-auto shadow-lg">
                      {bonsForPassager.length === 0 ? (
                        <div className="p-3 text-gray-500 text-sm">
                          Aucun bon disponible
                        </div>
                      ) : (
                        bonsForPassager.map((bon) => (
                          <div
                            key={bon}
                            className="p-3 hover:bg-gray-50 cursor-pointer text-sm border-b last:border-b-0"
                            onClick={() => {
                              setSelectBonNumber(bon);
                              setIsBonNumberOpen(false);
                              setFormData((prevData) => ({
                                ...prevData,
                                bon_number: bon,
                              }));
                            }}
                          >
                            Bon #{bon}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
                <Button onClick={handleAddBonNumber} className="shrink-0">
                  <PlusIcon className="w-4 h-4 mr-2" />
                  <p className="text-white font-medium">Nouveau bon</p>
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
