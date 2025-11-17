import { PaginationComponent } from "@/components/pagination";
import { useState } from "react";
import StylistContent from "./StylistContent";
import StylistHeader from "./StylistHeader";

export default function Stylists() {
  const [openBon, setOpenBon] = useState(true);
  const [closedBon, setClosedBon] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(200);
  const [date, setDate] = useState<"asc" | "desc">("asc");

  return (
    <div className="min-h-screen w-full flex flex-col gap-4">
      <StylistHeader />

      <div className="flex-1 rounded-xl bg-foreground shadow-sm border flex flex-col">
        <div className="flex-1">
          {/* This is the scrollable content area */}
          <div className="h-full p-4 mb-10">
            <StylistContent
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
        <div className="fixed bottom-0 left-0 right-0 h-16 bg-muted-foreground">
          {/* <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto flex justify-center items-center"> */}
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
