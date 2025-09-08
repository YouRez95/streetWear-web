import DatePicker from "@/components/datePicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateAvanceClient } from "@/hooks/useClients";
import { useCreateAvanceFaconnier } from "@/hooks/useFaconnier";
import { useCreateAvanceStylist } from "@/hooks/useStylist";
import { HandCoins, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { cn } from "@/lib/utils";

type AvanceDataType = {
  amount: number;
  method: string;
  description: string;
  createdAt: string;
};

type AddAvanceDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedId: string;
  selectedBonId: string;
  useCreateAvanceHook: () =>
    | ReturnType<typeof useCreateAvanceFaconnier>
    | ReturnType<typeof useCreateAvanceStylist>
    | ReturnType<typeof useCreateAvanceClient>;
  type: "faconnier" | "stylist" | "client";
};

const options = ["cash", "bank", "cheque"];
const paymentMethodMap: Record<string, string> = {
  cash: "Espèces",
  cheque: "Chèque",
  bank: "Virement bancaire",
};

export default function AddAvanceDialog({
  open,
  setOpen,
  selectedId,
  selectedBonId,
  useCreateAvanceHook,
  type,
}: AddAvanceDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { mutate: createAvance } = useCreateAvanceHook();
  const [avanceData, setAvanceData] = useState<AvanceDataType>({
    amount: 0,
    method: "cash",
    description: "",
    createdAt: new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAvanceData({ ...avanceData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = () => {
    if (avanceData.amount <= 0 || !avanceData.amount) {
      setError("Le montant de l'avance est requis");
      return;
    }

    if (!avanceData.method) {
      setError("La méthode de paiement est requise");
      return;
    }

    setError(null);

    createAvance(
      {
        stylistId: type === "stylist" ? selectedId : undefined,
        faconnierId: type === "faconnier" ? selectedId : undefined,
        clientId: type === "client" ? selectedId : undefined,
        bonId: selectedBonId,
        amount: Number(avanceData.amount),
        method: avanceData.method,
        description: avanceData.description,
        createdAt: avanceData.createdAt,
      },
      {
        onSuccess: (data) => {
          if (data.status === "failed") return;
          resetForm();
          setOpen(false);
        },
        onError: () => setError("Échec de l'ajout de l'avance. Réessayez."),
      }
    );
  };

  const resetForm = () => {
    setAvanceData({
      amount: 0,
      method: "cash",
      description: "",
      createdAt: new Date().toISOString(),
    });
    setError(null);
    setIsDropdownOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogContent
        className={cn(
          "bg-foreground flex flex-col",
          isMobile
            ? "h-full max-w-full overflow-y-auto [&>button]:hidden"
            : "min-w-[700px]"
        )}
      >
        {/* Close Button on Mobile */}
        {isMobile && (
          <div>
            <DialogClose asChild>
              <Button
                variant="ghost"
                className="absolute top-4 right-4 border border-background/50 rounded-full w-9 h-9 flex items-center justify-center bg-primary/10"
                onClick={() => setOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
        )}

        {/* Header */}
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2 text-primary">
            <HandCoins className="w-10 h-10 bg-background p-2 rounded-lg text-foreground" />
            <p className="text-2xl font-bagel">Ajouter une avance</p>
          </DialogTitle>
          <DialogDescription className="text-background/80 text-left">
            Cette avance sera ajoutée au bon sélectionné.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <AvanceForm
          avanceData={avanceData}
          setAvanceData={setAvanceData}
          error={error}
          setError={setError}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}

function AvanceForm({
  avanceData,
  setAvanceData,
  error,
  setError,
  isDropdownOpen,
  setIsDropdownOpen,
  handleChange,
  handleSubmit,
}: {
  avanceData: AvanceDataType;
  setAvanceData: React.Dispatch<React.SetStateAction<any>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  isDropdownOpen: boolean;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col justify-between gap-5 pb-5 md:pb-0">
      <form
        id="addAvanceForm"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        {/* Amount & Method */}
        <div className="flex gap-4 flex-col md:flex-row">
          <div className="flex flex-col flex-1 gap-2 bg-muted-foreground p-2 rounded-lg">
            <Label htmlFor="avance-amount" className="text-base font-semibold">
              Montant
            </Label>
            <Input
              type="number"
              id="avance-amount"
              name="amount"
              placeholder="Montant de l'avance"
              value={avanceData.amount || ""}
              onChange={handleChange}
              className="border border-background/50 text-base placeholder:text-background/50"
            />
          </div>

          <div className="flex flex-col flex-1 gap-2 bg-muted-foreground p-2 rounded-lg relative">
            <Label htmlFor="avance-method" className="text-base font-semibold">
              Méthode
            </Label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full border border-background/50 text-base flex justify-between items-center p-2 rounded-md"
            >
              {paymentMethodMap[avanceData.method] ||
                "Sélectionner une méthode"}
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50">
                {options.map((option) => (
                  <div
                    key={option}
                    className="p-2 hover:bg-background/10 cursor-pointer"
                    onClick={() => {
                      setAvanceData({ ...avanceData, method: option });
                      setIsDropdownOpen(false);
                      setError(null);
                    }}
                  >
                    {paymentMethodMap[option] || option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <Label htmlFor="avance-date" className="text-base font-semibold">
            Date
          </Label>
          <DatePicker
            setFormData={setAvanceData}
            date={avanceData.createdAt}
            label="createdAt"
            className="w-full"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 bg-muted-foreground p-2 rounded-lg">
          <Label
            htmlFor="avance-description"
            className="text-base font-semibold"
          >
            Description
          </Label>
          <Textarea
            id="avance-description"
            name="description"
            placeholder="Description"
            value={avanceData.description || ""}
            onChange={handleChange}
            className="border border-background/50 text-base placeholder:text-background/50 resize-none"
          />
        </div>
      </form>

      {/* Footer */}
      <div className="flex flex-col gap-2">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20">
            {error}
          </div>
        )}
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost" className="border border-background/50">
              Annuler
            </Button>
          </DialogClose>
          <Button type="submit" form="addAvanceForm">
            Ajouter l&apos;avance
          </Button>
        </div>
      </div>
    </div>
  );
}
