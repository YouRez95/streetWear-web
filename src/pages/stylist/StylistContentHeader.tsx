import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { useCreateAvanceStylist } from "@/hooks/useStylist";
import { downloadExcelBon } from "@/services/bons";
import { useUserStore } from "@/store/userStore";
import {
  Download,
  FunnelPlus,
  HandCoins,
  Lock,
  SearchIcon,
  Trash,
  Unlock,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddAvanceDialog from "../faconnier/AddAvanceDialog";
import { CloseBonStylistDialog } from "./CloseBonStylistDialog";
import { DeleteBonStylistDialog } from "./DeleteBonStylistDialog";
import { OpenBonStylistDialog } from "./OpenBonStylistDialog";
import type { GetActiveStylistsResponse } from "@/types/models";

interface StylistContentHeaderProps {
  openBon: boolean;
  setOpenBon: (open: boolean) => void;
  closedBon: boolean;
  setClosedBon: (closed: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  activeStylists?: GetActiveStylistsResponse;
  bons: GetActiveStylistsResponse["stylists"][0]["BonsStyleTrait"];
  selectedStylist?: GetActiveStylistsResponse["stylists"][0];
  selectedBon?: GetActiveStylistsResponse["stylists"][0]["BonsStyleTrait"][0];
}

export default function StylistContentHeader({
  openBon,
  setOpenBon,
  closedBon,
  setClosedBon,
  search,
  setSearch,
  activeStylists,
  bons,
  selectedStylist,
  selectedBon,
}: StylistContentHeaderProps) {
  const {
    selectedStylistId,
    selectedStylistBonId,
    setSelectedStylistId,
    setSelectedStylistBonId,
  } = useUserStore();
  const [openAvanceDialog, setOpenAvanceDialog] = useState(false);
  const [openCloseBonDialog, setOpenCloseBonDialog] = useState(false);
  const [openOpenBonDialog, setOpenOpenBonDialog] = useState(false);
  const [openDeleteBonDialog, setOpenDeleteBonDialog] = useState(false);

  useEffect(() => {
    if (!activeStylists) return;
    if (
      activeStylists.stylists &&
      activeStylists.stylists.length > 0 &&
      !activeStylists.stylists.some((s) => s.id === selectedStylistId)
    ) {
      setSelectedStylistId(activeStylists.stylists[0].id);
    }
  }, [activeStylists, selectedStylistId]);

  // Only update if selectedBonId is not in the current bons
  useEffect(() => {
    if (
      bons.length > 0 &&
      !bons.some((bon) => bon.id === selectedStylistBonId)
    ) {
      setSelectedStylistBonId(bons[0].id);
    } else if (bons.length === 0 && selectedStylistBonId !== "") {
      setSelectedStylistBonId("");
    }
  }, [selectedStylistBonId, bons]);

  const handleOpenAvanceDialog = () => {
    if (!selectedStylistId || !selectedStylistBonId) {
      toast({
        title: "Please select a stylist and a bon to add an avance",
        variant: "destructive",
      });
      return;
    }
    setOpenAvanceDialog(true);
  };

  return (
    <div className="flex justify-between items-center mb-10 w-full">
      <div className="flex gap-4 items-center">
        {/* Stylist Dropdown */}
        <Select
          value={selectedStylistId}
          onValueChange={(val) => setSelectedStylistId(val)}
        >
          <SelectTrigger className="w-[200px] border-background/50 border rounded-md p-3 data-[placeholder]:text-background">
            <SelectValue placeholder="Select Stylist" />
          </SelectTrigger>
          <SelectContent className="">
            {(activeStylists?.stylists ?? []).map((stylist) => (
              <SelectItem key={stylist.id} value={stylist.id}>
                {stylist.name} ({stylist.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bons Dropdown */}
        <Select
          value={selectedStylistBonId || ""}
          onValueChange={(val) => setSelectedStylistBonId(val)}
        >
          <SelectTrigger className="w-[200px] border-background/50 border rounded-md p-3 data-[placeholder]:text-background">
            <SelectValue placeholder="Select Bon" className="" />
          </SelectTrigger>
          <SelectContent>
            {bons.map((bon) => (
              <SelectItem key={bon.id} value={bon.id}>
                Bon #{bon.bon_number}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Bon Status */}
        {selectedBon && (
          <div className="text-sm font-semibold bg-yellow-300 p-2 rounded-md">
            {selectedBon?.bonStatus === "OPEN" && "Bon ouvert"}
            {selectedBon?.bonStatus === "CLOSED" && "Bon fermé"}
          </div>
        )}
        {/* Download Bon */}
        {selectedBon && (
          <Button
            variant="ghost"
            className="font-semibold flex items-center gap-2 border border-background/50 rounded-md"
            onClick={() => downloadExcelBon(selectedStylistBonId, "stylist")}
          >
            <Download className="w-4 h-4 mb-1" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Delete Bon */}
        {selectedStylist && selectedBon && (
          <Button
            variant="destructive"
            className="bg-destructive text-foreground font-semibold flex items-center gap-2"
            onClick={() => setOpenDeleteBonDialog(true)}
          >
            <Trash className="w-4 h-4 mb-1" />
            Supprimer le bon
          </Button>
        )}
        {/* Close Bon and Open Bon */}
        {selectedBon?.bonStatus === "OPEN" && (
          <Button
            onClick={() => setOpenCloseBonDialog(true)}
            disabled={!selectedBon}
            aria-label="Close selected bon"
            className="bg-secondary text-foreground hover:bg-secondary/90 font-semibold flex items-center gap-2"
          >
            <Lock className="w-4 h-4 mb-1" />
            Fermer le bon
          </Button>
        )}
        {selectedBon?.bonStatus === "CLOSED" && (
          <Button
            onClick={() => setOpenOpenBonDialog(true)}
            disabled={!selectedBon}
            aria-label="Open selected bon"
            className="bg-secondary text-foreground hover:bg-secondary/90 font-semibold flex items-center gap-2"
          >
            <Unlock className="w-4 h-4 mb-1" />
            Ouvrir le bon
          </Button>
        )}
        {/* Add Avance */}
        {selectedStylist && selectedBon && (
          <Button
            onClick={handleOpenAvanceDialog}
            className="bg-primary text-foreground hover:bg-primary/90 font-semibold flex items-center gap-2"
          >
            <HandCoins className="w-4 h-4 mb-1" />
            Add Avance
          </Button>
        )}
        {/* Search */}
        <div className="min-w-[300px] relative">
          <div className="absolute left-2 top-[50%] translate-y-[-50%]">
            <SearchIcon className="text-background/50" />
          </div>
          <Input
            className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
            placeholder="Rechercher un produit"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {/* Filter Bons */}
        <Popover>
          <PopoverTrigger>
            <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border border-background/50 rounded-md p-2 hover:bg-background/10 transition" />
          </PopoverTrigger>

          <PopoverContent className="w-[150px] p-4 mr-5">
            <div className="text-base font-semibold mb-2">Filter Bons</div>
            <div className="border-b border-background/20 mb-3" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="open" className="text-sm font-medium">
                  Actifs
                </Label>
                <Switch
                  className=""
                  id="open"
                  checked={openBon}
                  onCheckedChange={(checked) => {
                    if (!checked && !closedBon) return;
                    setOpenBon(checked);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="closed" className="text-sm font-medium">
                  Fermés
                </Label>
                <Switch
                  id="closed"
                  checked={closedBon}
                  onCheckedChange={(checked) => {
                    if (!checked && !openBon) return;
                    setClosedBon(checked);
                  }}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <AddAvanceDialog
        open={openAvanceDialog}
        setOpen={setOpenAvanceDialog}
        selectedId={selectedStylistId}
        selectedBonId={selectedStylistBonId}
        useCreateAvanceHook={useCreateAvanceStylist}
        type="stylist"
      />

      {/* Only show CloseBonDialog if bon is OPEN */}
      {selectedBon?.bonStatus === "OPEN" && (
        <CloseBonStylistDialog
          open={openCloseBonDialog}
          setOpen={setOpenCloseBonDialog}
          selectedStylistId={selectedStylistId}
          selectedBonId={selectedStylistBonId}
          setSelectedBonId={setSelectedStylistBonId}
        />
      )}

      {/* Only show OpenBonDialog if bon is CLOSED */}
      {selectedBon?.bonStatus === "CLOSED" && (
        <OpenBonStylistDialog
          open={openOpenBonDialog}
          setOpen={setOpenOpenBonDialog}
          selectedStylistId={selectedStylistId}
          selectedBonId={selectedStylistBonId}
          setSelectedBonId={setSelectedStylistBonId}
        />
      )}

      {openDeleteBonDialog && (
        <DeleteBonStylistDialog
          open={openDeleteBonDialog}
          setOpen={setOpenDeleteBonDialog}
          bonNumber={selectedBon?.bon_number || 0}
          bonId={selectedStylistBonId}
        />
      )}
    </div>
  );
}
