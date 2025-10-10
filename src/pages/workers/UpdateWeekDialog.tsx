import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateWeek } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { formatWeekDisplay, parseWeekNameToDate } from "@/lib/utils";
import { Calendar, CalendarCog, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

type UpdateWeekDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const toUTCDateString = (date: Date) =>
  new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  ).toISOString();

export default function UpdateWeekDialog({
  open,
  setOpen,
}: UpdateWeekDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { workplaceId, weekId, weekName, setWeekName } = useWorkerStore();
  const [error, setError] = useState<string | null>(null);
  const [selectedStartDate, setSelectedStartDate] = useState<
    Date | undefined
  >();
  const { mutate: updateWeekMutation, isPending } = useUpdateWeek();

  // Generate 6 consecutive days
  const generateSelectedDays = (startDate: Date) =>
    Array.from({ length: 6 }, (_, i) => {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      return day;
    });

  const selectedDays = selectedStartDate
    ? generateSelectedDays(selectedStartDate)
    : [];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedStartDate(date);
    setError(null);
  };

  const handleSubmit = () => {
    if (!selectedStartDate) {
      setError("Veuillez sélectionner une date de début");
      return;
    }

    if (selectedStartDate.getDay() !== 1) {
      setError("La date de début doit être un lundi");
      return;
    }

    setError(null);
    updateWeekMutation(
      { weekId, weekStart: toUTCDateString(selectedStartDate), workplaceId },
      {
        onSuccess: (data) => {
          if (data.status === "success") {
            setSelectedStartDate(undefined);
            setOpen(false);

            if (data.week?.weekStart && data.week?.weekEnd) {
              const start = new Date(data.week.weekStart);
              const end = new Date(data.week.weekEnd);
              setWeekName(formatWeekDisplay(start, end));
            }
          }
        },
      }
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedStartDate(undefined);
      setError(null);
    }
    setOpen(isOpen);
  };

  useEffect(() => {
    if (open && weekName) {
      const startDate = parseWeekNameToDate(weekName);
      if (startDate) setSelectedStartDate(startDate);
    }
  }, [open, weekName]);

  // 📱 Mobile layout
  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>
            <CalendarCog className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:flex">Modifier une semaine</span>
          </Button>
        </DialogTrigger>

        <DialogContent className="[&>button]:hidden bg-foreground flex flex-col h-full max-w-full overflow-y-auto">
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

          <DialogHeader className="flex flex-col gap-2 mb-2">
            <DialogTitle className="text-primary flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              <p className="text-2xl font-bagel">Modifier une semaine</p>
            </DialogTitle>
            <DialogDescription className="text-background/80 text-left">
              Choisissez une nouvelle date de début. Les 6 jours suivants seront
              mis à jour automatiquement.
            </DialogDescription>
          </DialogHeader>

          <WeekForm
            error={error}
            selectedStartDate={selectedStartDate}
            selectedDays={selectedDays}
            handleDateSelect={handleDateSelect}
            handleSubmit={handleSubmit}
            isPending={isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }

  // 💻 Desktop layout
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="w-4 h-4 lg:mr-2" />
          <span className="hidden lg:flex">Modifier une semaine</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-foreground min-w-[700px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" />
            <p className="text-2xl font-bagel">Modifier une semaine</p>
          </DialogTitle>
          <DialogDescription className="text-background/80">
            Choisissez une nouvelle date de début. Les 6 jours suivants seront
            générés automatiquement.
          </DialogDescription>
        </DialogHeader>

        <WeekForm
          error={error}
          selectedStartDate={selectedStartDate}
          selectedDays={selectedDays}
          handleDateSelect={handleDateSelect}
          handleSubmit={handleSubmit}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}

function WeekForm({
  error,
  selectedStartDate,
  selectedDays,
  handleDateSelect,
  handleSubmit,
  isPending,
}: {
  error: string | null;
  selectedStartDate: Date | undefined;
  selectedDays: Date[];
  handleDateSelect: (date: Date | undefined) => void;
  handleSubmit: () => void;
  isPending: boolean;
}) {
  return (
    <div className="flex flex-col gap-6 pb-6">
      {/* Calendar */}
      <div className="bg-muted-foreground p-4 flex justify-center rounded-lg">
        <CalendarComponent
          mode="single"
          selected={selectedStartDate}
          onSelect={handleDateSelect}
          modifiers={{
            selected: selectedDays,
          }}
          modifiersStyles={{
            selected: {
              backgroundColor: "hsl(var(--primary))",
              color: "hsl(var(--primary-foreground))",
            },
          }}
          className="bg-foreground"
        />
      </div>

      {/* Selected Days Info */}
      {selectedStartDate && (
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <h4 className="font-medium mb-2">Nouvelle période (6 jours):</h4>
          <div className="text-sm space-y-1">
            <p>
              <strong>Du:</strong> {formatDate(selectedDays[0])}
            </p>
            <p>
              <strong>Au:</strong> {formatDate(selectedDays[5])}
            </p>
            <div className="mt-2">
              <p className="font-medium mb-1">Jours inclus:</p>
              <div className="flex flex-wrap gap-1">
                {selectedDays.map((day, i) => (
                  <span
                    key={i}
                    className="bg-primary/20 px-2 py-1 rounded text-xs"
                  >
                    {day.toLocaleDateString("fr-FR", {
                      weekday: "short",
                      day: "numeric",
                    })}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
          <p className="text-destructive text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t border-background/10">
        <DialogClose asChild>
          <Button
            variant="ghost"
            className="border border-background/20 hover:bg-background/5"
            disabled={isPending}
          >
            Annuler
          </Button>
        </DialogClose>
        <Button
          onClick={handleSubmit}
          className="min-w-[120px]"
          disabled={!selectedStartDate || isPending}
        >
          {isPending ? "Mise à jour..." : "Mettre à jour"}
        </Button>
      </div>
    </div>
  );
}
