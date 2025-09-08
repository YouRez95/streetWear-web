import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { formatDateToDDMMYYYY } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type DatePickerProps = {
  setFormData: (data: any) => void;
  date?: string;
  label?: string;
  className?: string;
  calendarClassName?: string;
};

export default function DatePicker({
  setFormData,
  date,
  label = "date",
  className,
  calendarClassName,
}: DatePickerProps) {
  const [selected, setSelected] = useState<Date | undefined>(
    date ? new Date(date) : new Date()
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant={"ghost"}
        className={cn(
          "w-[240px] pl-3 text-left font-normal border border-background/50",
          className
        )}
        onClick={() => setOpen((prev) => !prev)}
      >
        {selected ? formatDateToDDMMYYYY(selected) : "Choisir une date"}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
      {open && (
        <Calendar
          className={cn(
            "absolute bottom-full md:top-full mt-1 left-0 bg-foreground border z-[100] shadow-md",
            calendarClassName
          )}
          classNames={{}}
          mode="single"
          selected={selected}
          onSelect={(date) => {
            //console.log('date', date)
            setSelected(date);
            setFormData((prevData: any) => ({
              ...prevData,
              [label]: date?.toISOString(),
            }));
          }}
        />
      )}
    </div>
  );
}
