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

  // Only update if selectedBonId is not in the current bons
  useEffect(() => {
    if (bons.length > 0 && !bons.some((bon) => bon.id === selectedBonId)) {
      setSelectedBonId(bons[0].id);
    } else if (bons.length === 0 && selectedBonId !== "") {
      setSelectedBonId("");
    }
  }, [selectedFaconnierId, bons]);

  const handleOpenAvanceDialog = () => {
    if (!selectedFaconnierId || !selectedBonId) {
      toast({
        title: "Please select a faconnier and a bon to add an avance",
        variant: "destructive",
      });
      return;
    }
    setOpenAvanceDialog(true);
  };

  return (
    <div className="flex justify-between items-center mb-10 w-full">
      <div className="flex gap-4 items-center">
        {/* Faconnier Dropdown */}
        <Select
          value={selectedFaconnierId}
          onValueChange={(val) => setSelectedFaconnierId(val)}
        >
          <SelectTrigger className="w-[200px] border-background/50 border rounded-md p-3 data-[placeholder]:text-background">
            <SelectValue placeholder="Select Faconnier" />
          </SelectTrigger>
          <SelectContent className="">
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
            onClick={() => downloadExcelBon(selectedBonId, "faconnier")}
          >
            <Download className="w-4 h-4 mb-1" />
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Delete Bon */}
        {selectedFaconnier && selectedBon && (
          <Button
            variant="destructive"
            className="bg-destructive text-foreground font-semibold flex items-center gap-2"
            onClick={() => setOpenDeleteBonDialog(true)}
          >
            <Trash className="w-4 h-4 mb-1" />
            Supprimer ce bon
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
            Fermer ce bon
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
        {selectedFaconnier && selectedBon && (
          <Button
            onClick={handleOpenAvanceDialog}
            className="bg-primary text-foreground hover:bg-primary/90 font-semibold flex items-center gap-2"
          >
            <HandCoins className="w-4 h-4 mb-1" />
            Ajouter une avance
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
        selectedId={selectedFaconnierId}
        selectedBonId={selectedBonId}
        useCreateAvanceHook={useCreateAvanceFaconnier}
        type="faconnier"
      />

      {/* Only show CloseBonDialog if bon is OPEN */}
      {selectedBon?.bonStatus === "OPEN" && (
        <CloseBonDialog
          open={openCloseBonDialog}
          setOpen={setOpenCloseBonDialog}
          selectedFaconnierId={selectedFaconnierId}
          selectedBonId={selectedBonId}
          setSelectedBonId={setSelectedBonId}
        />
      )}

      {/* Only show OpenBonDialog if bon is CLOSED */}
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
