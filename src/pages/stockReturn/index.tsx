import { PaginationComponent } from "@/components/pagination";
import { useState } from "react";
import { DeleteStockReturnDialog } from "./DeleteStockReturnDialog";
import ReturnStockHeader from "./ReturnStockHeader";
import ReturnStockSearch from "./ReturnStockSearch";
import StockReturnTable from "./StockReturnTable";
import UpdateClientReturnDialog from "./UpdateClientReturnDialog";
import type { GetReturnStockResponse } from "@/types/models";

export default function StockReturn() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(20);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedStockReturn, setSelectedStockReturn] = useState<
    GetReturnStockResponse["products"][0]["stockInfo"]["returns"][0] | null
  >(null);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-4">
      <ReturnStockHeader />

      <div className="flex-1 overflow-hidden rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4">
            <ReturnStockSearch setSearch={setSearch} search={search} />
            <StockReturnTable
              search={search}
              page={page}
              setTotalPages={setTotalPages}
              limit={limit}
              setOpenDeleteDialog={setOpenDeleteDialog}
              setSelectedStockReturn={setSelectedStockReturn}
              setOpenEditDialog={setOpenEditDialog}
            />

            {selectedStockReturn && (
              <DeleteStockReturnDialog
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                stockReturn={selectedStockReturn}
              />
            )}

            {selectedStockReturn && (
              <UpdateClientReturnDialog
                open={openEditDialog}
                setOpen={setOpenEditDialog}
                stockReturn={selectedStockReturn}
              />
            )}
          </div>
        </div>

        {/* Sticky pagination bar at the bottom */}
        <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto">
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
