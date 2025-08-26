import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, Shirt } from "lucide-react";
import { useState } from "react";
import CreateProductDialog from "./CreateProductDialog";
import TransferMultipleProductsToClient from "./TransferMultipleProductsToClient";

type ProductSearchProps = {
  setSearch: (search: string) => void;
  search: string;
};

export default function ProductSearch({
  setSearch,
  search,
}: ProductSearchProps) {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [
    openTransferMultipleProductsToClient,
    setOpenTransferMultipleProductsToClient,
  ] = useState(false);
  return (
    <div className="flex justify-end items-center gap-2 mb-5">
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

      <Button onClick={() => setOpenCreateProductDialog(true)}>
        <PlusIcon />
        Créer un produit
      </Button>

      <Button
        variant={"secondary"}
        className="text-foreground"
        onClick={() => setOpenTransferMultipleProductsToClient(true)}
      >
        <Shirt />
        Transferer plusieurs produits
      </Button>

      <CreateProductDialog
        open={openCreateProductDialog}
        setOpen={setOpenCreateProductDialog}
      />

      <TransferMultipleProductsToClient
        open={openTransferMultipleProductsToClient}
        setOpen={setOpenTransferMultipleProductsToClient}
      />
    </div>
  );
}
