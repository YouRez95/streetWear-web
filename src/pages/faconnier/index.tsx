import { PaginationComponent } from "@/components/pagination";
import { useState } from "react";
import FaconnierContent from "./FaconnierContent";
import FaconnierHeader from "./FaconnierHeader";

export default function Producer() {
  const [openBon, setOpenBon] = useState(true);
  const [closedBon, setClosedBon] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(20);
  const [date, setDate] = useState<"asc" | "desc">("asc");

  return (
    <div className="h-screen w-full flex flex-col gap-4">
      {/* <ProductsHeader /> */}
      <FaconnierHeader />

      <div className="flex-1 rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4 mb-10">
            <FaconnierContent
              openBon={openBon}
              setOpenBon={setOpenBon}
              closedBon={closedBon}
              setClosedBon={setClosedBon}
              search={search}
              setSearch={setSearch}
              page={page}
              setTotalPages={setTotalPages}
              limit={limit}
              date={date}
              setDate={setDate}
            />
          </div>
        </div>

        {/* Sticky pagination bar at the bottom */}
        <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto flex justify-center items-center">
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
