import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateOrderStylist } from "@/hooks/useStylist";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
  const [error, setError] = useState<string | null>(null);
  const { open, orderId, quantity_sent, price_by_unit, date } = openEditDialog;
  // const [newQuantityReturned, setNewQuantityReturned] = useState<number | null>(null)
  const { mutate: updateOrderStylist } = useUpdateOrderStylist();
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (open) {
      setFormData({
        quantity_sent: quantity_sent,
        price_by_unit: price_by_unit,
        date: date,
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

    // const finalData = {
    //   orderId,
    //   stylistId,
    //   bonId,
    //   formData: formData
    // }

    setError(null);
    //console.log('finalData from edit order stylist dialog', finalData)
    updateOrderStylist(
      {
        bonId,
        stylistId,
        orderId,
        formData,
      },
      {
        onSuccess: (data) => {
          if (data.status === "failed") {
            return;
          }
          onClose({
            open: false,
            orderId: "",
            quantity_sent: 0,
            price_by_unit: 0,
            date: "",
          });
          setError(null);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setFormData(initialFormData);
        setError(null);
        onClose({
          open: false,
          orderId: "",
          quantity_sent: 0,
          price_by_unit: 0,
          date: "",
        });
      }}
    >
      <DialogContent className="max-w-2xl bg-foreground rounded-xl p-5 shadow-sm border">
        <DialogHeader>
          <DialogTitle>Modifier la commande</DialogTitle>
          <DialogDescription className="text-sm text-background/80">
            Modifier votre commande
          </DialogDescription>
        </DialogHeader>

        {/* Quantity sent and price by unit */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="quantity-sent"
              className="text-background text-base whitespace-nowrap flex-1"
            >
              Quantité envoyée:
            </Label>
            <Input
              name="quantity_sent"
              id="quantity-sent"
              className="border-background/50 flex-1"
              type="number"
              value={formData.quantity_sent || ""}
              onChange={handleFormChange}
            />
          </div>

          <div className="flex gap-2 items-center">
            <Label
              htmlFor="price-by-unit"
              className="text-background text-base whitespace-nowrap flex-1"
            >
              Prix par unité:
            </Label>
            <Input
              name="price_by_unit"
              id="price-by-unit"
              className="border-background/50 flex-1"
              type="number"
              value={formData.price_by_unit || ""}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Total price and date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="total-price"
              className="text-background text-base whitespace-nowrap flex-1"
            >
              Total:
            </Label>
            <Input
              name="total_price"
              id="total-price"
              className="border-background/50 flex-1"
              type="number"
              readOnly
              value={formData.quantity_sent * formData.price_by_unit}
            />
          </div>
          {/* Date */}
          <div className="flex items-center gap-2">
            <Label
              htmlFor="date"
              className="text-background text-base whitespace-nowrap flex-1"
            >
              Date:
            </Label>
            <div className="flex-1 w-full">
              <DatePicker setFormData={setFormData} date={date} />
            </div>
          </div>
        </div>

        <DialogFooter
          className={cn(
            "flex items-center",
            error
              ? "justify-between sm:justify-between"
              : "justify-end sm:justify-end"
          )}
        >
          {error && <p className="text-red-500">{error}</p>}
          <div className="flex items-center gap-2">
            <DialogClose asChild>
              <Button variant="ghost" className="border border-background/50">
                Annuler
              </Button>
            </DialogClose>
            <Button onClick={handleEditOrder}>Modifier la commande</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
