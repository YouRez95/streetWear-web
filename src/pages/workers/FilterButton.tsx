import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useWorkerStore } from "@/store/workerStore";
import { FunnelPlus, MapPin, Users } from "lucide-react";

export default function FilterButton() {
  const { currentViewInWeekly, setCurrentViewInWeekly } = useWorkerStore();

  const handleViewChange = (view: "workers" | "workplaces") => {
    setCurrentViewInWeekly(view);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center">
          <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border border-background/50 rounded-md p-2 hover:bg-background/10 hover:text-background/90 transition-all duration-200 hover:border-background/70" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[200px] p-4 mr-5 shadow-lg">
        <div className="text-base font-semibold mb-2 text-background">
          Affichage des tableaux
        </div>
        <div className="border-b border-background/20 mb-4" />

        <div className="flex flex-col gap-4">
          {/* Workers View Option */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-background group-hover:text-secondary" />
              <Label
                htmlFor="workers"
                className="text-sm font-medium cursor-pointer select-none group-hover:text-secondary transition-colors"
              >
                Par employés
              </Label>
            </div>
            <Switch
              id="workers"
              checked={currentViewInWeekly === "workers"}
              onCheckedChange={() => handleViewChange("workers")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          {/* Workplaces View Option */}
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-background group-hover:text-secondary" />
              <Label
                htmlFor="workplaces"
                className="text-sm font-medium cursor-pointer select-none group-hover:text-secondary transition-colors"
              >
                Par ateliers
              </Label>
            </div>
            <Switch
              id="workplaces"
              checked={currentViewInWeekly === "workplaces"}
              onCheckedChange={() => handleViewChange("workplaces")}
              className="data-[state=checked]:bg-primary"
            />
          </div>
        </div>

        {/* Optional: Show current selection */}
        <div className="mt-4 pt-3 border-t border-background/20">
          <div className="text-xs text-background/70">
            Affichage actuel:{" "}
            <span className="font-medium text-background/90">
              {currentViewInWeekly === "workers" ? "Employés" : "Ateliers"}
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
