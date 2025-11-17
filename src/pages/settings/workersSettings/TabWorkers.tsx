import { LoadingSuspense } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, Search, X } from "lucide-react";
import { Suspense, useState } from "react";
import { CreateWorkerDialog } from "./CreateWorkerDialog";
import TableWorker from "./TableWorkers";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function TabWorkers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [active, setActive] = useState<string[]>(["Actif"]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleTypeChange = (type: string, checked: boolean) => {
    setActive((prev) => {
      if (checked) {
        if (!prev.includes(type)) {
          return [...prev, type];
        }
        return prev;
      } else {
        if (prev.length === 2) {
          return prev.filter((t) => t !== type);
        } else {
          const otherType = type === "Actif" ? "Inactif" : "Actif";
          return [otherType];
        }
      }
    });
  };

  const activeFiltersCount = active.length;

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-slate-100/50">
      {/* Modern Mobile Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
        <div className="px-4 py-4 space-y-4">
          {/* Title Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Employés
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">Gérer vos équipes</p>
            </div>

            {/* Quick Add Button - Mobile Optimized */}
            <CreateWorkerDialog />
          </div>

          {/* Search and Filter Row */}
          <div className="flex gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                className="w-full pl-10 pr-4 h-11 bg-slate-50/50 border-slate-200 rounded-xl placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:border-blue-500 transition-all"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Button - Mobile Drawer */}
            <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DrawerTrigger asChild>
                <Button
                  variant="ghost"
                  size="default"
                  className="relative h-11 px-4 rounded-xl border"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="max-h-[85vh] bg-primary-foreground">
                <DrawerHeader className="text-left border-b border-slate-200 pb-4">
                  <DrawerTitle className="text-xl font-bold text-primary">
                    Filtres
                  </DrawerTitle>
                  <DrawerDescription className="text-sm text-primary/50">
                    Filtrer les employés par statut
                  </DrawerDescription>
                </DrawerHeader>

                <div className="px-4 py-6 space-y-4">
                  {/* Filter Options */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <Label
                          htmlFor="Actif"
                          className="text-base font-medium text-slate-900 cursor-pointer"
                        >
                          Actif
                        </Label>
                      </div>
                      <Switch
                        id="Actif"
                        checked={active.includes("Actif")}
                        onCheckedChange={(checked) =>
                          handleTypeChange("Actif", checked)
                        }
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                        <Label
                          htmlFor="Inactif"
                          className="text-base font-medium text-slate-900 cursor-pointer"
                        >
                          Inactif
                        </Label>
                      </div>
                      <Switch
                        id="Inactif"
                        checked={active.includes("Inactif")}
                        onCheckedChange={(checked) =>
                          handleTypeChange("Inactif", checked)
                        }
                        className="data-[state=checked]:bg-blue-600"
                      />
                    </div>
                  </div>

                  {/* Active Filters Summary */}
                  {/* {activeFiltersCount > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">
                        Filtres actifs:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {active.map((filter) => (
                          <Badge
                            key={filter}
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-100 px-3 py-1"
                          >
                            {filter}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>

                <DrawerFooter className="border-t border-slate-200 pt-4 flex flex-row">
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full flex-1 h-12 border rounded-xl"
                    >
                      Annuler
                    </Button>
                  </DrawerClose>
                  <Button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full h-12 flex-1"
                  >
                    Appliquer les filtres
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {/* Active Filters Pills - Show on mobile when search is not focused */}
          {activeFiltersCount > 0 && activeFiltersCount < 2 && !searchTerm && (
            <div className="flex items-center gap-2 animate-in slide-in-from-top-2">
              <span className="text-xs text-slate-500 font-medium">
                Filtres:
              </span>
              <div className="flex flex-wrap gap-2">
                {active.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-xs"
                  >
                    {filter}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Suspense
          fallback={
            <div className="flex-1 flex items-center justify-center">
              <LoadingSuspense />
            </div>
          }
        >
          <TableWorker searchTerm={searchTerm} active={active} />
        </Suspense>
      </div>
    </div>
  );
}
