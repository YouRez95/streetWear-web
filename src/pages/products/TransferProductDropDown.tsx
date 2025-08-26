import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Product } from "@/types/models";
import clientsIcon from "@/assets/icons/client-icon.svg";
import producersIcon from "@/assets/icons/producer-icon-1.svg";
import stylistIcon from "@/assets/icons/stylists-icon.svg";
import { TrendingUpDown } from "lucide-react";
import { useState } from "react";
type TransferProductDropDownProps = {
  product: Product;
  setSelectedProduct: (product: any) => void;
  setSelectedTransferTo: (
    transferTo: "faconnier" | "client" | "stylist" | null
  ) => void;
  setOpenTransferDialogFaconnier: (open: boolean) => void;
  setOpenTransferDialogClient: (open: boolean) => void;
  setOpenTransferDialogStylist: (open: boolean) => void;
};

export default function TransferProductDropDown({
  setSelectedProduct,
  setSelectedTransferTo,
  setOpenTransferDialogFaconnier,
  setOpenTransferDialogClient,
  setOpenTransferDialogStylist,
  product,
}: TransferProductDropDownProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <TrendingUpDown className="w-7 h-7 cursor-pointer text-secondary/70 border border-secondary/50 rounded-md p-1" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-base font-semibold flex items-center justify-center">
          Transférer un produit
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-base flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
            setSelectedTransferTo("stylist");
            setOpenTransferDialogStylist(true);
            setOpen(false);
          }}
        >
          <p className="text-base">Stylist</p>
          <img
            src={stylistIcon}
            alt="Stylist"
            className="w-4 h-4 mr-2 "
            style={{ filter: "invert(1) brightness(0)" }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
            setSelectedTransferTo("faconnier");
            setOpenTransferDialogFaconnier(true);
            setOpen(false);
          }}
        >
          <p className="text-base">Faconnier</p>
          <img
            src={producersIcon}
            alt="Faconnier"
            className="w-4 h-4 mr-2 "
            style={{ filter: "invert(1) brightness(0)" }}
          />
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-base flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedProduct(product);
            setSelectedTransferTo("client");
            setOpenTransferDialogClient(true);
            setOpen(false);
          }}
        >
          <p className="text-base">Client</p>
          <img
            src={clientsIcon}
            alt="Client"
            className="w-4 h-4 mr-2 "
            style={{ filter: "invert(1) brightness(0)" }}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
