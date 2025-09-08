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
import { useUpdateOrderStylist } from "@/hooks/useStylist";
import { Edit, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

type OpenEditDialog = {
  open: boolean;
  orderId: string;
  quantity_sent: number;
  price_by_unit: number;
  date: string;
};

type EditOrderStylistDialogProps = {
  openEditDialog: OpenEditDialog;
  onClose: (open: OpenEditDialog) => void;
  stylistId: string;
  bonId: string;
};

const initialFormData = {
  quantity_sent: 0,
  price_by_unit: 0,
  date: new Date().toISOString(),
};

export function EditOrderStylistDialog({
  openEditDialog,
  onClose,
  stylistId,
  bonId,
}: EditOrderStylistDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const { open, orderId, quantity_sent, price_by_unit, date } = openEditDialog;
  const { mutate: updateOrderStylist, isPending } = useUpdateOrderStylist();
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (open) {
      setFormData({
        quantity_sent,
        price_by_unit,
        date,
      });
    }
  }, [open, bonId, stylistId]);

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

    if (!formData.date) {
      setError("Veuillez entrer une date");
      return;
    }

    if (formData.price_by_unit <= 0) {
      setError("Le prix par unité doit être supérieur à 0");
      return;
    }

    setError(null);
    updateOrderStylist(
      { bonId, stylistId, orderId, formData },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          onClose({
            open: false,
            orderId: "",
            quantity_sent: 0,
            price_by_unit: 0,
            date: "",
          });
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

        <EditOrderForm
          formData={formData}
          setFormData={setFormData}
          error={error}
          handleFormChange={handleFormChange}
          handleEditOrder={handleEditOrder}
          isMobile={isMobile}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

function EditOrderForm({
  formData,
  setFormData,
  error,
  handleFormChange,
  handleEditOrder,
  isMobile,
  isPending,
}: {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
  handleFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditOrder: () => void;
  isMobile: boolean;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col justify-between mb-10 md:mb-0 flex-1">
      <div className="flex flex-col gap-6 mb-5">
        {/* Quantity sent and price per unit */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label
              htmlFor="quantity-sent"
              className="w-full md:flex-1 text-left"
            >
              Quantité envoyée:
            </Label>
            <Input
              id="quantity-sent"
              name="quantity_sent"
              type="number"
              className="border-background/50 w-full md:flex-1"
              value={formData.quantity_sent || ""}
              onChange={handleFormChange}
            />
          </div>

          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label
              htmlFor="price-by-unit"
              className="w-full md:flex-1 text-left"
            >
              Prix par unité:
            </Label>
            <Input
              id="price-by-unit"
              name="price_by_unit"
              type="number"
              className="border-background/50 w-full md:flex-1"
              value={formData.price_by_unit || ""}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Total price and date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label htmlFor="total-price" className="w-full md:flex-1 text-left">
              Total:
            </Label>
            <Input
              id="total-price"
              name="total_price"
              type="number"
              className="border-background/50 w-full md:flex-1"
              readOnly
              value={formData.quantity_sent * formData.price_by_unit}
            />
          </div>

          <div className="flex items-center gap-2 flex-col md:flex-row">
            <Label htmlFor="date" className="w-full md:flex-1 text-left">
              Date:
            </Label>
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
