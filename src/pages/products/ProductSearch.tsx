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
    <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-5">
      <div className="w-full md:w-fit md:min-w-[300px] relative">
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

      <div className="flex items-center gap-2 w-full md:w-fit">
        <Button
          onClick={() => setOpenCreateProductDialog(true)}
          className="flex-1"
        >
          <PlusIcon />
          Créer un produit
        </Button>

        <Button
          variant="secondary"
          className="text-foreground flex-1 truncate"
          onClick={() => setOpenTransferMultipleProductsToClient(true)}
        >
          <Shirt className="shrink-0" />

          <span className="ml-2 truncate">Transférer plusieurs produits</span>
        </Button>
      </div>

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
