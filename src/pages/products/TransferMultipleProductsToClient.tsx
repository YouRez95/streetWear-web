import defaultProductImage from "@/assets/placeholder-image/default-product.webp";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DatePicker from "@/components/datePicker";
// import {
//   useActiveClients,
//   useCreateBonClient,
//   useCreateMultipleOrdersClient
// } from '@/hooks/useClients'
import { useProducts } from "@/hooks/useProduct";
import { useUserStore } from "@/store/userStore";
import { getImageUrl } from "@/lib/utils";
import { useDebounce } from "@uidotdev/usehooks";
import { ChevronDown, PlusIcon, SearchIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import type {
  GetActiveClientsResponse,
  GetProductsResponse,
} from "@/types/models";
import {
  useActiveClients,
  useCreateBonClient,
  useCreateMultipleOrdersClient,
} from "@/hooks/useClients";

type SelectedClient = GetActiveClientsResponse["clients"][0];

type CreateProductDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

type ProductToTransferType = {
  id: string;
  name: string;
  productImage: string | undefined;
  reference: string;
  quantity: number;
  quantityReady: number;
  unitPrice: number;
};

export default function TransferMultipleProductsToClient({
  open,
  setOpen,
}: CreateProductDialogProps) {
  const { activeSeason } = useUserStore();

  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [limit] = useState(5);
  const debouncedSearch = useDebounce(search, 300);
  const [transferDate, setTransferDate] = useState({
    date: new Date().toISOString(),
  });

  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [bonDropdownOpen, setBonDropdownOpen] = useState(false);

  const [selectedClient, setSelectedClient] = useState<SelectedClient>();
  const [selectedBonNumber, setSelectedBonNumber] = useState<number | null>(
    null
  );

  const [productsToTransfer, setProductsToTransfer] = useState<
    ProductToTransferType[]
  >([]);

  const { data: clientsData } = useActiveClients();
  const { data: productsData, isLoading: loadingProducts } = useProducts(
    page,
    limit,
    debouncedSearch
  );
  const { mutate: createBonClient } = useCreateBonClient();
  const { mutate: createMultipleOrdersClient } =
    useCreateMultipleOrdersClient();

  const handleResetDialog = () => {
    setOpen(false);
    setSearch("");
    setSelectedClient(undefined);
    setSelectedBonNumber(null);
    setProductsToTransfer([]);
    setClientDropdownOpen(false);
    setBonDropdownOpen(false);
  };

  const handleAddBonNumber = () => {
    if (!activeSeason || !selectedClient?.id) return;

    createBonClient(selectedClient.id, {
      onSuccess: (data) => {
        if (data.status === "failed") return;

        setSelectedClient((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            BonsClients: [
              {
                bon_number: data.bon?.bon_number as number,
                id: data.bon?.id as string,
                bonStatus: "OPEN",
              },
              ...prev.BonsClients,
            ],
          };
        });

        setSelectedBonNumber(data.bon?.bon_number ?? null);
      },
    });
  };

  const toggleProductToTransfer = (
    product: GetProductsResponse["products"][0]
  ) => {
    setProductsToTransfer((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          reference: product.reference,
          productImage: product.productImage,
          quantityReady: product.ProductStatus.quantity_ready,
          quantity: product.ProductStatus.quantity_ready,
          unitPrice: 0,
        },
      ];
    });
  };

  const updateUnitPrice = (index: number, price: number) => {
    setProductsToTransfer((prev) => {
      const updated = [...prev];
      updated[index].unitPrice = Math.max(0, price);
      return updated;
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    setProductsToTransfer((prev) => {
      const updated = [...prev];
      updated[index].quantity = Math.min(
        Math.max(1, quantity),
        updated[index].quantityReady
      );
      return updated;
    });
  };

  const handleSubmitTransfer = () => {
    if (
      !selectedClient ||
      !selectedBonNumber ||
      productsToTransfer.length === 0
    )
      return;

    // 👇 This is where you would trigger the backend transfer mutation
    const payloadData = {
      clientId: selectedClient.id,
      bonNumber: selectedBonNumber,
      date: transferDate.date,
      products: productsToTransfer.map((p) => ({
        productId: p.id,
        productName: p.name,
        quantitySent: p.quantity,
        priceByUnit: p.unitPrice,
      })),
    };

    createMultipleOrdersClient(payloadData, {
      onSuccess: (data) => {
        if (data.status === "failed") {
          return;
        }
        handleResetDialog();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleResetDialog}>
      <DialogContent className="max-w-3xl bg-foreground overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Transfer Multiple Products</DialogTitle>
          <DialogDescription className="text-sm text-background/60">
            Select a client and a bon number, then search and choose the
            products to transfer.
          </DialogDescription>
        </DialogHeader>

        {/* CLIENT SELECTION */}
        <div className="flex justify-between items-center gap-4 mb-4">
          <div className="flex items-center flex-1 gap-2">
            <Label className="text-sm">Client</Label>
            <div className="relative flex-1">
              <button
                onClick={() => setClientDropdownOpen((open) => !open)}
                className="w-full text-left border border-background/30 p-2 rounded-md bg-foreground flex justify-between items-center text-sm"
              >
                {selectedClient?.name || "Select client"}
                <ChevronDown
                  className={`h-4 w-4 ${
                    clientDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {clientDropdownOpen && (
                <div className="absolute z-50 w-full bg-foreground border mt-1 rounded shadow max-h-60 overflow-y-auto">
                  {clientsData?.clients?.map((client) => (
                    <div
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setSelectedBonNumber(
                          client.BonsClients[0]?.bon_number ?? null
                        );
                        setClientDropdownOpen(false);
                      }}
                      className="p-2 hover:bg-background/10 cursor-pointer text-sm"
                    >
                      {client.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DatePicker setFormData={setTransferDate} />
        </div>

        {/* BON SELECTION */}
        {selectedClient && (
          <div className="flex items-center gap-3">
            <div className="relative w-full">
              <button
                onClick={() => setBonDropdownOpen((open) => !open)}
                className="w-full text-left border border-background/30 p-2 rounded-md bg-foreground flex justify-between items-center text-sm"
              >
                {selectedBonNumber
                  ? `Bon #${selectedBonNumber}`
                  : "Select bon number"}
                <ChevronDown
                  className={`h-4 w-4 ${bonDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {bonDropdownOpen && (
                <div className="absolute z-50 w-full bg-foreground border mt-1 rounded shadow max-h-60 overflow-y-auto">
                  {selectedClient.BonsClients.map((bon) => (
                    <div
                      key={bon.bon_number}
                      onClick={() => {
                        setSelectedBonNumber(bon.bon_number);
                        setBonDropdownOpen(false);
                      }}
                      className="p-2 hover:bg-background/10 cursor-pointer text-sm"
                    >
                      Bon #{bon.bon_number}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="text-foreground font-semibold"
              onClick={handleAddBonNumber}
              variant="outline"
              size="sm"
            >
              <PlusIcon className="w-4 h-4 mr-1" />
              New Bon
            </Button>
          </div>
        )}

        {/* SEARCH BAR */}
        {selectedClient && (
          <div className="relative mt-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-background/40" />
            <Input
              placeholder="Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 placeholder:text-background/40 text-background rounded-lg"
            />
          </div>
        )}

        {/* PRODUCT SEARCH RESULTS */}
        {loadingProducts ? (
          <p className="text-sm text-background/50 mt-2">Loading products...</p>
        ) : (
          <div className="divide-y mt-2 border border-background/10 rounded overflow-hidden">
            {productsData?.products?.length === 0 ? (
              <p className="text-sm text-background/50 p-4">
                No products found.
              </p>
            ) : (
              productsData?.products
                ?.filter(
                  (product) => product.ProductStatus.quantity_ready !== 0
                )
                .map((product) => {
                  const isSelected = productsToTransfer.some(
                    (p) => p.id === product.id
                  );
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleProductToTransfer(product)}
                      className={`flex justify-between items-center p-3 cursor-pointer transition-colors ${
                        isSelected ? "bg-background/5" : "hover:bg-background/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={getImageUrl(product.productImage, "product")}
                          alt={product.name}
                          onError={(e) => {
                            const target = e.currentTarget;
                            target.src = defaultProductImage;
                          }}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-background/50">
                            Ref: {product.reference}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm">
                        Ready: {product.ProductStatus.quantity_ready}
                      </p>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* SELECTED PRODUCTS LIST */}
        {productsToTransfer.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-sm">Products to Transfer</h3>
            {productsToTransfer.map((product, idx) => (
              <div
                key={product.id}
                className="flex items-center justify-between border border-background/10 rounded-md p-2"
              >
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-background/50">
                    Ref: {product.reference}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={1}
                      max={product.quantityReady}
                      value={product.quantity}
                      onChange={(e) =>
                        updateQuantity(idx, parseInt(e.target.value) || 1)
                      }
                      className="w-20"
                    />
                    <span className="text-xs text-background/40">
                      / {product.quantityReady}
                    </span>
                  </div>

                  {/* Unit Price */}
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      value={product.unitPrice}
                      onChange={(e) =>
                        updateUnitPrice(idx, parseFloat(e.target.value) || 0)
                      }
                      className="w-24"
                      placeholder="Price"
                    />
                    <span className="text-xs text-background/40">per unit</span>
                  </div>

                  {/* Remove button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      setProductsToTransfer((prev) =>
                        prev.filter((p) => p.id !== product.id)
                      )
                    }
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* FINAL SUBMIT */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSubmitTransfer}
            disabled={
              !selectedClient ||
              !selectedBonNumber ||
              !transferDate.date ||
              productsToTransfer.length === 0 ||
              productsToTransfer.some(
                (p) => p.quantity <= 0 || p.unitPrice <= 0
              )
            }
          >
            Confirm Transfer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
