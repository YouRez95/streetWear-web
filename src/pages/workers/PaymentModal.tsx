import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUpdateWeekRecordPayment } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { Check, Undo2 } from "lucide-react";

type PaymentModalProps = {
  open: boolean;
  recordId: string | null;
  reste: number | null;
  workerName: string | null;
  type: "pay" | "undo";
  onClose: () => void;
};

export const PaymentModal = ({
  open,
  recordId,
  reste,
  type,
  onClose,
  workerName,
}: PaymentModalProps) => {
  const { weekName, weekId, workplaceId } = useWorkerStore();
  const { mutate: updateWeekrecordMutation, isPending } =
    useUpdateWeekRecordPayment();

  const handlePayment = () => {
    // Logic to handle payment or undo payment
    console.log(
      `${
        type === "pay" ? "Paying" : "Undoing payment for"
      } record ID: ${recordId}`
    );
    if (recordId) {
      const recordData = {
        recordId,
        type,
      };
      updateWeekrecordMutation(
        { recordData, weekId, workplaceId },
        {
          onSuccess: () => {
            console.log("Payment status updated successfully");
          },
          onError: (error) => {
            console.error("Error updating payment status:", error);
          },
        }
      );
    }
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-foreground">
        <DialogHeader>
          <DialogTitle>
            {type === "pay" ? "Confirmer le paiement" : "Annuler le paiement"}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription className="sr-only">
          {type === "pay"
            ? "Veuillez confirmer que vous souhaitez marquer cette semaine comme payée pour l'employé."
            : "Veuillez confirmer que vous souhaitez annuler ce paiement pour cette semaine."}
        </DialogDescription>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-background/35">Employé:</span>
              <span className="font-medium">{workerName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-background/35">Semaine:</span>
              <span className="font-medium">{weekName}</span>
            </div>

            {type === "pay" && (
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-sm text-background/35">
                  Montant à payer:
                </span>
                <span className="font-bold text-lg text-green-600">
                  {reste?.toFixed(0)} dh
                </span>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                {type === "pay"
                  ? "⚠️ Cette action marque l'employé comme payé pour cette semaine"
                  : "⚠️ Êtes-vous sûr d'annuler ce paiement ?"}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" className="border" onClick={onClose}>
            {type === "pay" ? "Annuler" : "Non"}
          </Button>
          <Button
            disabled={isPending}
            variant={type === "pay" ? "default" : "destructive"}
            onClick={() => {
              handlePayment();
              onClose();
            }}
            className={type === "pay" ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {type === "pay" ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Confirmer
              </>
            ) : (
              <>
                <Undo2 className="h-4 w-4 mr-2" />
                Oui, annuler
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
