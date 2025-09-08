import { LoadingSuspense } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { useUserStore } from "@/store/userStore";
import { FunnelPlus, SearchIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { CreateStylistDialog } from "./CreateStylistDialog";
import { TableStylists } from "./TableStylists";
import { cn } from "@/lib/utils";

export default function TabStylists() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeStylist, setTypeStylist] = useState<string[]>(["طباعة", "طرازة"]);
  const [openCreateStylistDialog, setOpenCreateStylistDialog] = useState(false);
  const { userData } = useUserStore();

  // Helper to handle switch changes
  const handleTypeChange = (type: string, checked: boolean) => {
    setTypeStylist((prev) => {
      if (checked) {
        if (!prev.includes(type)) {
          return [...prev, type];
        }
        return prev;
      } else {
        if (prev.length === 2) {
          return prev.filter((t) => t !== type);
        } else {
          const otherType = type === "طباعة" ? "طرازة" : "طباعة";
          return [otherType];
        }
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start px-7 pt-7">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Stylists</h1>
          <p className="">Gérez vos stylistes</p>
        </div>
        <div
          className={cn(
            "flex md:items-center flex-col md:flex-row gap-2 w-full md:w-auto",
            userData?.role !== "super admin" && "flex-row"
          )}
        >
          <div className="w-full md:min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <SearchIcon className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Rechercher un stylist"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dialog for creating Stylist */}
          <div className="flex items-center gap-3">
            {userData?.role === "super admin" && (
              <>
                <Button
                  className="font-bagel text-base flex items-center justify-center pb-3 rounded-lg flex-1"
                  onClick={() => setOpenCreateStylistDialog(true)}
                >
                  <span>+</span>
                  Ajouter un stylist
                </Button>
                <CreateStylistDialog
                  open={openCreateStylistDialog}
                  onOpenChange={setOpenCreateStylistDialog}
                />
              </>
            )}
            <Popover>
              <PopoverTrigger>
                <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border border-background/50 rounded-md p-2 hover:bg-background/10 transition" />
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-4 mr-5">
                <div className="text-base font-semibold mb-2">
                  Filter Stylist
                </div>
                <div className="border-b border-background/20 mb-3" />
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Switch
                      id="طباعة"
                      checked={typeStylist.includes("طباعة")}
                      onCheckedChange={(checked) =>
                        handleTypeChange("طباعة", checked)
                      }
                      disabled={false}
                    />
                    <Label htmlFor="طباعة" className="text-sm font-medium">
                      طباعة
                    </Label>
                  </div>
                  <div className="flex items-center justify-between">
                    <Switch
                      id="طرازة"
                      checked={typeStylist.includes("طرازة")}
                      onCheckedChange={(checked) =>
                        handleTypeChange("طرازة", checked)
                      }
                      disabled={false}
                    />
                    <Label htmlFor="طرازة" className="text-sm font-medium">
                      طرازة
                    </Label>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          {/* <TableFaconniers searchTerm={searchTerm} /> */}
          <TableStylists searchTerm={searchTerm} types={typeStylist} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </div>
  );
}
