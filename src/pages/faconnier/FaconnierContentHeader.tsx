"use client";

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
import { useCreateAvanceFaconnier } from "@/hooks/useFaconnier";
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
import AddAvanceDialog from "./AddAvanceDialog";
import { CloseBonDialog } from "./CloseBonDialog";
import { DeleteBonDialog } from "./DeleteBonDialog";
import { OpenBonDialog } from "./OpenBonDialog";
import type { GetActiveFaconniersResponse } from "@/types/models";

interface FaconnierContentHeaderProps {
  openBon: boolean;
  setOpenBon: (open: boolean) => void;
  closedBon: boolean;
  setClosedBon: (closed: boolean) => void;
  setSearch: (search: string) => void;
  search: string;
  activeFaconniers?: GetActiveFaconniersResponse;
  bons: GetActiveFaconniersResponse["faconniers"][0]["BonsFaconnier"];
  selectedFaconnier?: GetActiveFaconniersResponse["faconniers"][0];
  selectedBon?: GetActiveFaconniersResponse["faconniers"][0]["BonsFaconnier"][0];
}

export default function FaconnierContentHeader({
  openBon,
  setOpenBon,
  closedBon,
  setClosedBon,
  setSearch,
  search,
  activeFaconniers,
  bons,
  selectedFaconnier,
  selectedBon,
}: FaconnierContentHeaderProps) {
  const {
    selectedFaconnierId,
    selectedBonId,
    setSelectedFaconnierId,
    setSelectedBonId,
  } = useUserStore();
  const [openAvanceDialog, setOpenAvanceDialog] = useState(false);
  const [openCloseBonDialog, setOpenCloseBonDialog] = useState(false);
  const [openOpenBonDialog, setOpenOpenBonDialog] = useState(false);
  const [openDeleteBonDialog, setOpenDeleteBonDialog] = useState(false);

  useEffect(() => {
    if (!activeFaconniers) return;
    if (
      activeFaconniers.faconniers &&
      activeFaconniers.faconniers.length > 0 &&
      !activeFaconniers.faconniers.some((f) => f.id === selectedFaconnierId)
    ) {
      setSelectedFaconnierId(activeFaconniers.faconniers[0].id);
    }
  }, [activeFaconniers, selectedFaconnierId]);

  useEffect(() => {
    if (bons.length > 0 && !bons.some((bon) => bon.id === selectedBonId)) {
      setSelectedBonId(bons[0].id);
    } else if (bons.length === 0 && selectedBonId !== "") {
      setSelectedBonId("");
    }
  }, [selectedBonId, bons]);

  const handleOpenAvanceDialog = () => {
    if (!selectedFaconnierId || !selectedBonId) {
      toast({
        title:
          "Veuillez sélectionner un façonnier et un bon avant d’ajouter une avance",
        variant: "destructive",
      });
      return;
    }
    setOpenAvanceDialog(true);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:flex-wrap lg:justify-between lg:items-center gap-4 md:gap-6 mb-10 w-full">
      {/* Left Section (Selectors) */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
        {/* Faconnier Dropdown */}
        <Select
          value={selectedFaconnierId}
          onValueChange={(val) => setSelectedFaconnierId(val)}
        >
          <SelectTrigger className="w-full sm:w-[200px] border rounded-md p-3">
            <SelectValue placeholder="Select Faconnier" />
          </SelectTrigger>
          <SelectContent>
            {(activeFaconniers?.faconniers ?? []).map((faconnier) => (
              <SelectItem key={faconnier.id} value={faconnier.id}>
                {faconnier.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bons Dropdown */}
        <Select
          value={selectedBonId || ""}
          onValueChange={(val) => setSelectedBonId(val)}
        >
          <SelectTrigger className="w-full sm:w-[200px] border rounded-md p-3">
            <SelectValue placeholder="Select Bon" />
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
          <div className="text-xs sm:text-sm font-semibold bg-yellow-300 px-3 py-2 rounded-md text-center sm:text-left">
            {selectedBon?.bonStatus === "OPEN" && "Bon ouvert"}
            {selectedBon?.bonStatus === "CLOSED" && "Bon fermé"}
          </div>
        )}
      </div>

      {/* Right Section (Actions, Search, Filters) */}
      <div className="flex gap-3 flex-col sm:flex-row items-end justify-between">
        <div className="flex gap-3 flex-1">
          {/* Delete Bon */}
          {selectedFaconnier && selectedBon && (
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setOpenDeleteBonDialog(true)}
            >
              <Trash className="w-4 h-4" />
              <span className="hidden lg:inline">Supprimer</span>
            </Button>
          )}

          {/* Close/Open Bon */}
          {selectedBon?.bonStatus === "OPEN" && (
            <Button
              onClick={() => setOpenCloseBonDialog(true)}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden lg:inline">Fermer</span>
            </Button>
          )}
          {selectedBon?.bonStatus === "CLOSED" && (
            <Button
              onClick={() => setOpenOpenBonDialog(true)}
              className="flex items-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span className="hidden lg:inline">Ouvrir</span>
            </Button>
          )}

          {/* Add Avance */}
          {selectedFaconnier && selectedBon && (
            <Button
              onClick={handleOpenAvanceDialog}
              className="flex items-center gap-2"
            >
              <HandCoins className="w-4 h-4" />
              <span className="hidden lg:inline">Avance</span>
            </Button>
          )}

          {/* Download Bon */}
          {selectedBon && (
            <Button
              variant="ghost"
              className="flex items-center gap-2 border"
              onClick={() => downloadExcelBon(selectedBonId, "faconnier")}
            >
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Search & Filter (mobile) */}
        <div className="flex gap-4 flex-1 justify-end w-full sm:w-auto lg:hidden">
          <div className="relative w-full sm:w-[250px]">
            <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-background/50 w-4 h-4" />
            <Input
              className="w-full pl-8 rounded-lg text-background/70 placeholder:text-background/30"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger>
              <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border rounded-md p-2 hover:bg-background/10 transition" />
            </PopoverTrigger>
            <PopoverContent className="w-[180px] p-4">
              <div className="text-base font-semibold mb-2">Filtres</div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="open" className="text-sm">
                    Actifs
                  </Label>
                  <Switch
                    id="open"
                    checked={openBon}
                    onCheckedChange={(checked) => {
                      if (!checked && !closedBon) return;
                      setOpenBon(checked);
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="closed" className="text-sm">
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
      </div>

      {/* Search & Filter (desktop) */}
      <div className="lg:flex gap-4 flex-1 justify-end w-full sm:w-auto hidden">
        <div className="relative w-full sm:w-[250px]">
          <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 text-background/50 w-4 h-4" />
          <Input
            className="w-full pl-8 rounded-lg text-background/70 placeholder:text-background/30"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Popover>
          <PopoverTrigger>
            <FunnelPlus className="w-8 h-8 cursor-pointer text-background/70 border rounded-md p-2 hover:bg-background/10 transition" />
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-4">
            <div className="text-base font-semibold mb-2">Filtres</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="open" className="text-sm">
                  Actifs
                </Label>
                <Switch
                  id="open"
                  checked={openBon}
                  onCheckedChange={(checked) => {
                    if (!checked && !closedBon) return;
                    setOpenBon(checked);
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="closed" className="text-sm">
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
        selectedId={selectedFaconnierId}
        selectedBonId={selectedBonId}
        useCreateAvanceHook={useCreateAvanceFaconnier}
        type="faconnier"
      />

      {selectedBon?.bonStatus === "OPEN" && (
        <CloseBonDialog
          open={openCloseBonDialog}
          setOpen={setOpenCloseBonDialog}
          selectedFaconnierId={selectedFaconnierId}
          selectedBonId={selectedBonId}
          setSelectedBonId={setSelectedBonId}
        />
      )}

      {selectedBon?.bonStatus === "CLOSED" && (
        <OpenBonDialog
          open={openOpenBonDialog}
          setOpen={setOpenOpenBonDialog}
          selectedFaconnierId={selectedFaconnierId}
          selectedBonId={selectedBonId}
          setSelectedBonId={setSelectedBonId}
        />
      )}

      {openDeleteBonDialog && (
        <DeleteBonDialog
          open={openDeleteBonDialog}
          setOpen={setOpenDeleteBonDialog}
          bonNumber={selectedBon?.bon_number || 0}
          bonId={selectedBonId}
        />
      )}
    </div>
  );
}
