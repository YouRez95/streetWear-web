import { PaginationComponent } from "@/components/pagination";
import { useState } from "react";
import { DeleteProductDialog } from "./DeleteProductDialog";
import ProductSearch from "./ProductSearch";
import ProductsHeader from "./ProductsHeader";
import ProductsTable from "./ProductsTable";
import TransferProductClientDialog from "./TransferProductClientDialog";
import TransferProductFaconnierDialog from "./TransferProductFaconnierDialog";
import TransferProductStylistDialog from "./TransferProductStylistDialog";
import UpdateProductDialog from "./UpdateProductDialog";
import ViewProductSheet from "./ViewProductSheet";
import type { Product } from "@/types/models";

export default function Products() {
  const [openSheet, setOpenSheet] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(200);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedTransferTo, setSelectedTransferTo] = useState<
    "faconnier" | "client" | "stylist" | null
  >(null);
  const [openTransferDialogFaconnier, setOpenTransferDialogFaconnier] =
    useState(false);
  const [openTransferDialogClient, setOpenTransferDialogClient] =
    useState(false);
  const [openTransferDialogStylist, setOpenTransferDialogStylist] =
    useState(false);
  const [date, setDate] = useState<"asc" | "desc">("asc");
  return (
    <div className="min-h-screen w-full flex flex-col gap-4">
      <ProductsHeader />

      <div className="flex-1 rounded-xl bg-foreground shadow-sm border flex flex-col pb-20">
        <div className="flex-1">
          {/* This is the scrollable content area */}
          <div className="h-full p-4">
            <ProductSearch setSearch={setSearch} search={search} />
            <ProductsTable
              setOpenSheet={setOpenSheet}
              search={search}
              page={page}
              setTotalPages={setTotalPages}
              limit={limit}
              date={date}
              setDate={setDate}
              setOpenEditDialog={setOpenEditDialog}
              setOpenDeleteDialog={setOpenDeleteDialog}
              setSelectedProduct={setSelectedProduct}
              setSelectedTransferTo={setSelectedTransferTo}
              setOpenTransferDialogFaconnier={setOpenTransferDialogFaconnier}
              setOpenTransferDialogClient={setOpenTransferDialogClient}
              setOpenTransferDialogStylist={setOpenTransferDialogStylist}
            />
            {selectedProduct && (
              <ViewProductSheet
                product={selectedProduct}
                openSheet={openSheet}
                setOpenSheet={setOpenSheet}
              />
            )}
            {selectedProduct && (
              <UpdateProductDialog
                product={selectedProduct}
                open={openEditDialog}
                setOpen={setOpenEditDialog}
              />
            )}

            {selectedProduct && (
              <DeleteProductDialog
                product={selectedProduct}
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
              />
            )}

            {selectedProduct && selectedTransferTo === "faconnier" && (
              <TransferProductFaconnierDialog
                product={selectedProduct}
                transferTo={selectedTransferTo}
                open={openTransferDialogFaconnier}
                setOpen={setOpenTransferDialogFaconnier}
              />
            )}

            {selectedProduct && selectedTransferTo === "client" && (
              <TransferProductClientDialog
                product={selectedProduct}
                transferTo={selectedTransferTo}
                open={openTransferDialogClient}
                setOpen={setOpenTransferDialogClient}
              />
            )}

            {selectedProduct && selectedTransferTo === "stylist" && (
              <TransferProductStylistDialog
                product={selectedProduct}
                transferTo={selectedTransferTo}
                open={openTransferDialogStylist}
                setOpen={setOpenTransferDialogStylist}
              />
            )}
          </div>
        </div>

        {/* Sticky pagination bar at the bottom */}
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-muted-foreground">
          <PaginationComponent
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            limit={limit}
            setLimit={setLimit}
          />
        </div>
      </div>
    </div>
  );
}
