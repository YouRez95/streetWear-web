import { PaginationComponent } from "@/components/pagination";
import { useState } from "react";
import ClientsContent from "./ClientsContent";
import ClientsHeader from "./ClientsHeader";

export default function Clients() {
  const [openBon, setOpenBon] = useState(true);
  const [closedBon, setClosedBon] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(20);
  const [date, setDate] = useState<"asc" | "desc">("asc");

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden gap-4">
      <ClientsHeader />

      <div className="flex-1 overflow-hidden rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1 overflow-auto">
          {/* This is the scrollable content area */}
          <div className="min-h-full p-4">
            <ClientsContent
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
