import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { GetActiveClientsResponse, Product } from "@/types/models";
import productLogo from "@/assets/icons/products-icon.svg";
import DatePicker from "@/components/datePicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useActiveClients,
  useBonsClientPassager,
  useCreateBonClient,
  useCreateBonClientPassager,
  useCreateOrderClient,
} from "@/hooks/useClients";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import {
  ChevronDown,
  PlusIcon,
  X,
  Calendar,
  Tag,
  Calculator,
  User,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { useMediaQuery } from "@uidotdev/usehooks";
import SearchableDropdown from "./SearchableDropDown";

type TransferProductClientDialogProps = {
  product: Product;
  transferTo?: "client" | null;
  open: boolean;
  setOpen: (open: boolean) => void;
};

type SelectedClient = GetActiveClientsResponse["clients"][0];

type FormData = {
  clientId: string | null;
  passagerName: string | null;
  transferQuantity: number;
  priceByUnit: number;
  bon_number: number | null;
  date: string | null;
  clientType: "regular" | "passager";
};

export default function TransferProductClientDialog({
  product,
  open,
  setOpen,
}: TransferProductClientDialogProps) {
  const isMobile = useMediaQuery("(max-width:768px)");
  const { mutate: createBonClient } = useCreateBonClient();
  const { mutate: createBonClientForPassager } = useCreateBonClientPassager();
  const { mutate: createOrderClient } = useCreateOrderClient();
  const { data: activeClients } = useActiveClients();
  const { data: bonClientPassager } = useBonsClientPassager();
  const { activeSeason } = useUserStore();

  const [error, setError] = useState<string | null>(null);
  const [selectClient, setSelectClient] = useState<
    SelectedClient | undefined
  >();
  const [selectBonNumber, setSelectBonNumber] = useState<number | null>(null);
  const [bonsForPassager, setBonsForPassager] = useState<number[]>([]);
  const [isBonNumberOpen, setIsBonNumberOpen] = useState(false);

  // initialize form
  const initialForm: FormData = {
    clientId: null,
    passagerName: null,
    transferQuantity: product?.ProductStatus?.quantity_ready ?? 0,
    priceByUnit: 0,
    bon_number: null,
    date: new Date().toISOString(),
    clientType: "regular",
  };

  const [formData, setFormData] = useState<FormData>(initialForm);

  useEffect(() => {
    if (bonClientPassager?.bons) {
      const bonNumbers = bonClientPassager.bons.map((b: any) => b.bon_number);
      setBonsForPassager(bonNumbers);
      if (bonNumbers.length > 0) setSelectBonNumber(bonNumbers[0]);
    }
  }, [bonClientPassager]);

  // reset when open or product changes
  useEffect(() => {
    if (open) {
      const reset = {
        ...initialForm,
        transferQuantity: product?.ProductStatus?.quantity_ready ?? 0,
        date: new Date().toISOString(),
      };
      setFormData(reset);
      setError(null);
      setSelectClient(undefined);
      setSelectBonNumber(null);
      // setIsDropdownOpen(false)
      setIsBonNumberOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id]);

  const closeDialog = () => {
    setOpen(false);
    setFormData({
      ...initialForm,
      transferQuantity: product?.ProductStatus?.quantity_ready ?? 0,
      date: new Date().toISOString(),
    });
    setError(null);
    setSelectClient(undefined);
    setSelectBonNumber(null);
    // setIsDropdownOpen(false)
    setIsBonNumberOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) setError(null);
    const { name, value, type } = e.target;
    // keep numbers as numbers
    const parsed =
      type === "number" ? (value === "" ? "" : Number(value)) : value;
    setFormData((prev) => ({ ...prev, [name]: parsed }));
  };

  const handleClientTypeChange = (type: "regular" | "passager") => {
    setFormData((prev) => ({
      ...prev,
      clientType: type,
      clientId: type === "regular" ? prev.clientId : null,
      passagerName: type === "passager" ? prev.passagerName : null,
      bon_number: null,
    }));
    setSelectClient(undefined);
    setSelectBonNumber(null);
    setError(null);
  };

  const totalPrice = useMemo(() => {
    const qty = Number(formData.transferQuantity) || 0;
    const price = Number(formData.priceByUnit) || 0;
    return qty * price;
  }, [formData.transferQuantity, formData.priceByUnit]);

  const availableQuantity = product?.ProductStatus?.quantity_ready ?? 0;

  const handleTransfer = () => {
    // validations
    if (formData.clientType === "regular" && !formData.clientId) {
      setError("Veuillez sélectionner un client");
      return;
    }
    if (formData.clientType === "passager" && !formData.passagerName?.trim()) {
      setError("Veuillez entrer le nom du client passager");
      return;
    }
    if ((Number(formData.transferQuantity) || 0) > availableQuantity) {
      if (availableQuantity === 0) {
        setError("Aucune unité disponible pour ce produit");
      } else {
        setError(`Vous ne pouvez transférer que ${availableQuantity} unités`);
      }
      return;
    }
    if ((Number(formData.priceByUnit) || 0) <= 0) {
      setError("Le prix par unité doit être supérieur à 0");
      return;
    }
    if ((Number(formData.transferQuantity) || 0) <= 0) {
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
      onSuccess: (data: any) => {
        if (data?.status === "failed") return;
        closeDialog();
      },
      onError: (err: any) => {
        console.error("createOrder error", err);
        setError("Une erreur est survenue lors de la création de la commande");
      },
    });
  };

  const handleAddBonNumber = () => {
    // two flows: regular client or passager
    if (activeSeason && formData.clientType === "regular" && selectClient?.id) {
      createBonClient(selectClient.id, {
        onSuccess: (data: any) => {
          if (data?.status === "failed") return;
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
        onError: (err: any) => {
          console.error("createBonClient error", err);
          setError("Impossible de créer un nouveau bon");
        },
      });
    } else {
      // create bon for passager
      createBonClientForPassager(undefined, {
        onSuccess: (data: any) => {
          if (data?.status === "failed") return;
          setBonsForPassager((prev) => [
            data.bon?.bon_number as number,
            ...prev,
          ]);
          setSelectBonNumber(data.bon?.bon_number as number);
          setFormData((prev) => ({
            ...prev,
            bon_number: data.bon?.bon_number as number,
          }));
        },
        onError: (err: any) => {
          console.error("createBonClientForPassager error", err);
          setError("Impossible de créer un nouveau bon pour passager");
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && closeDialog()}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "min-w-[700px] max-w-[800px]"
        )}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Mobile close */}
        {isMobile && (
          <div className="absolute top-4 right-4">
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        )}

        <DialogHeader className="space-y-3 pb-4 pt-5 md:pt-0">
          <div className="flex items-center gap-3">
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
          </div>
          <DialogDescription className="text-background/80 text-left">
            Transférer &quot;{product.name}&quot; — stock disponible:{" "}
            <span className="font-semibold text-secondary">
              {availableQuantity} unités
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* Product summary */}
        <div className="bg-background/5 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">
                Référence: {product.reference}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Stock disponible</p>
              <p className="text-lg font-bold text-secondary">
                {availableQuantity} unités
              </p>
            </div>
          </div>
        </div>

        {/* Form content */}
        <div className="flex-1 px-2 md:px-0">
          <div className="space-y-6 mb-5 md:mb-0">
            {/* Client type */}
            <div>
              <Label className="text-sm font-medium text-background mb-3 block">
                Type de client
              </Label>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant={
                    formData.clientType === "regular" ? "default" : "ghost"
                  }
                  className={cn(
                    "flex items-center gap-2 flex-1",
                    formData.clientType === "regular"
                      ? "bg-primary"
                      : "border border-background/35"
                  )}
                  onClick={() => handleClientTypeChange("regular")}
                >
                  <User className="w-4 h-4" />
                  Client Régulier
                </Button>
                <Button
                  type="button"
                  variant={
                    formData.clientType === "passager" ? "default" : "ghost"
                  }
                  className={cn(
                    "flex items-center gap-2 flex-1",
                    formData.clientType === "passager"
                      ? "bg-primary"
                      : "border border-background/35"
                  )}
                  onClick={() => handleClientTypeChange("passager")}
                >
                  <UserPlus className="w-4 h-4" />
                  Client Passager
                </Button>
              </div>
            </div>

            {/* First row: select client / passager & date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="client-select"
                  className="text-sm font-medium text-background"
                >
                  {formData.clientType === "regular"
                    ? "Sélectionner un client"
                    : "Nom du client"}
                </Label>

                {formData.clientType === "regular" ? (
                  <div className="relative">
                    <SearchableDropdown
                      items={activeClients?.clients || []}
                      placeholderInput="Rechercher un client..."
                      selectedItem={selectClient}
                      onSelect={(client: SelectedClient) => {
                        setSelectClient(client);
                        const firstBonNumber =
                          client.BonsClients?.[0]?.bon_number ?? null;
                        setSelectBonNumber(firstBonNumber);
                        setFormData((prev) => ({
                          ...prev,
                          clientId: client.id,
                          bon_number: firstBonNumber,
                        }));
                        // setIsDropdownOpen(false)
                      }}
                      placeholder="Choisir un client"
                      displayValue={(client: SelectedClient) => client.name}
                      searchFields={["name"]}
                      className="w-full"
                    />
                  </div>
                ) : (
                  <Input
                    name="passagerName"
                    placeholder="Entrez le nom complet du client"
                    value={formData.passagerName || ""}
                    onChange={(e) => {
                      handleFormChange(e);
                      // setIsDropdownOpen(false)
                    }}
                    className="w-full placeholder:text-background/50"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-background flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Date de transfert
                </Label>
                <DatePicker
                  setFormData={setFormData}
                  date={formData.date ?? undefined}
                />
              </div>
            </div>

            {/* Quantity / price / total */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="transfer-quantity"
                  className="text-sm font-medium text-background"
                >
                  Quantité
                </Label>
                <div className="relative">
                  <Input
                    name="transferQuantity"
                    id="transfer-quantity"
                    type="number"
                    min={1}
                    max={availableQuantity}
                    value={formData.transferQuantity}
                    onChange={handleFormChange}
                    className="w-full"
                  />
                  <span className="absolute -bottom-5 left-0 text-xs text-background/60">
                    Max: {availableQuantity} unités
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="price-by-unit"
                  className="text-sm font-medium text-background flex items-center gap-2"
                >
                  <Tag className="w-4 h-4" />
                  Prix par unité
                </Label>
                <Input
                  name="priceByUnit"
                  id="price-by-unit"
                  type="number"
                  step="0.01"
                  min={0}
                  value={formData.priceByUnit}
                  onChange={handleFormChange}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="total-price"
                  className="text-sm font-medium text-background flex items-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Total
                </Label>
                <Input
                  name="totalPrice"
                  id="total-price"
                  readOnly
                  value={totalPrice.toFixed(2)}
                  className="w-full bg-gray-50 font-semibold"
                />
                <p className="text-xs text-background/60">Calcul automatique</p>
              </div>
            </div>

            {/* Bon number section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-background">
                Numéro de bon
              </Label>
              <div className="flex gap-3">
                {formData.clientType === "regular" && selectClient ? (
                  <>
                    <SearchableDropdown
                      items={selectClient.BonsClients || []}
                      selectedItem={(selectClient.BonsClients || []).find(
                        (b: any) => b.bon_number === selectBonNumber
                      )}
                      onSelect={(bon: any) => {
                        setSelectBonNumber(bon.bon_number);
                        setFormData((prev) => ({
                          ...prev,
                          bon_number: bon.bon_number,
                        }));
                      }}
                      placeholder="Sélectionner un bon"
                      displayValue={(bon: any) => `Bon #${bon.bon_number}`}
                      searchFields={["bon_number"]}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleAddBonNumber}
                      className="shrink-0 border"
                      variant="ghost"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      <span className="whitespace-nowrap">Nouveau bon</span>
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
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isBonNumberOpen ? "rotate-180" : ""
                          }`}
                        />
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
                                  setFormData((prev) => ({
                                    ...prev,
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

                    <Button
                      onClick={handleAddBonNumber}
                      className="shrink-0 border"
                      variant="ghost"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      <span className="whitespace-nowrap">Nouveau bon</span>
                    </Button>
                  </>
                ) : (
                  <div className="text-sm text-background/70">
                    Sélectionnez d'abord un client
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg my-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Footer actions */}
        <DialogFooter className="flex flex-col gap-3 pt-4">
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
              onClick={handleTransfer}
              className={cn(
                "flex-1 text-base",
                isMobile
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground"
              )}
            >
              Transférer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
