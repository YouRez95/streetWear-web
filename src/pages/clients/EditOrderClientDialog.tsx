import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateOrderClient } from "@/hooks/useClients";
import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

type OpenEditDialog = {
  open: boolean;
  orderId: string;
  quantity_returned: number;
  quantity_sent: number;
  price_by_unit: number;
  date: string;
};

type EditOrderClientDialogProps = {
  openEditDialog: OpenEditDialog;
  onClose: (open: OpenEditDialog) => void;
  clientId: string;
  bonId: string;
};

const initialFormData = {
  quantity_sent: 0,
  newQuantityReturned: 0,
  price_by_unit: 0,
  date: new Date().toISOString(),
};

export function EditOrderClientDialog({
  openEditDialog,
  onClose,
  clientId,
  bonId,
}: EditOrderClientDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const {
    open,
    orderId,
    quantity_returned,
    quantity_sent,
    price_by_unit,
    date,
  } = openEditDialog;
  const { mutate: updateOrderClient, isPending } = useUpdateOrderClient();
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (open) {
      setFormData({
        quantity_sent,
        newQuantityReturned: 0,
        price_by_unit,
        date,
      });
    }
  }, [open, bonId, clientId]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleEditOrder = () => {
    if (formData.quantity_sent <= 0) {
      setError("La quantité envoyée doit être supérieure à 0");
      return;
    }
    if (formData.newQuantityReturned > formData.quantity_sent) {
      setError(
        "La quantité retournée ne peut être supérieure à la quantité envoyée"
      );
      return;
    }
    if (!formData.date) {
      setError("Veuillez entrer une date");
      return;
    }
    if (formData.price_by_unit <= 0) {
      setError("Le prix par unité doit être supérieur à 0");
      return;
    }

    setError(null);
    updateOrderClient(
      { bonId, clientId, orderId, formData },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          resetForm();
        },
      }
    );
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setError(null);
    onClose({
      open: false,
      orderId: "",
      quantity_returned: 0,
      quantity_sent: 0,
      price_by_unit: 0,
      date: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={resetForm}>
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "min-w-[700px] max-w-[800px]"
        )}
      >
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

        <DialogHeader className="mb-5">
          <DialogTitle className="flex items-center gap-2">
            <Edit className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
            <p className="text-2xl font-bagel">Modifier la commande</p>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-sm text-left">
            Modifier votre commande
          </DialogDescription>
        </DialogHeader>

        <EditClientOrderForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          handleFormChange={handleFormChange}
          handleEditOrder={handleEditOrder}
          quantity_returned={quantity_returned}
          isMobile={isMobile}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditClientOrderForm({
  formData,
  setFormData,
  error,
  handleFormChange,
  handleEditOrder,
  quantity_returned,
  isMobile,
  isPending,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditOrder: () => void;
  quantity_returned: number;
  isMobile: boolean;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col justify-between mb-10 md:mb-0 flex-1">
      <div className="flex flex-col gap-6 mb-5">
        {/* Quantity sent + price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label className="w-full md:flex-1 text-left">
              Quantité envoyée:
            </Label>
            <Input
              name="quantity_sent"
              type="number"
              value={formData.quantity_sent || ""}
              onChange={handleFormChange}
              disabled={quantity_returned > 0}
              className="border-background/50 w-full md:flex-1"
            />
          </div>
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label className="w-full md:flex-1 text-left">
              Prix par unité:
            </Label>
            <Input
              name="price_by_unit"
              type="number"
              value={formData.price_by_unit || ""}
              onChange={handleFormChange}
              className="border-background/50 w-full md:flex-1"
            />
          </div>
        </div>

        {/* Total + date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label className="w-full md:flex-1 text-left">Total:</Label>
            <Input
              type="number"
              readOnly
              value={formData.quantity_sent * formData.price_by_unit}
              className="border-background/50 w-full md:flex-1"
            />
          </div>
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label className="w-full md:flex-1 text-left">Date:</Label>
            <div className="w-full md:flex-1">
              <DatePicker
                setFormData={setFormData}
                date={formData.date}
                className="w-full"
                calendarClassName="md:!top-auto"
              />
            </div>
          </div>
        </div>

        {/* Returned quantity */}
        {quantity_returned < formData.quantity_sent && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Quantité retournée:</Label>
              <Input
                type="number"
                name="newQuantityReturned"
                value={formData.newQuantityReturned || ""}
                onChange={handleFormChange}
              />
              <span className="text-sm text-background/80">
                Cette quantité sera ajoutée à la quantité retournée précédente.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Total quantité retournée:</Label>
              <Input
                type="number"
                readOnly
                className="bg-muted"
                value={quantity_returned + formData.newQuantityReturned}
              />
            </div>
          </div>
        )}
      </div>

      <DialogFooter className="flex flex-col gap-3 pt-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 w-full">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <DialogClose asChild>
            <Button
              type="button"
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
            type="button"
            className="flex-1 text-base"
            onClick={handleEditOrder}
            disabled={isPending}
          >
            Modifier la commande
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
