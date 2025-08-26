import { useActiveStylists } from "@/hooks/useStylist";
import { useUserStore } from "@/store/userStore";
import StylistContentHeader from "./StylistContentHeader";
import StylistTable from "./StylistTable";

type StylistContentProps = {
  openBon: boolean;
  setOpenBon: (open: boolean) => void;
  closedBon: boolean;
  setClosedBon: (closed: boolean) => void;
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setTotalPages: (totalPages: number) => void;
  limit: number;
  date: "asc" | "desc";
  setDate: (date: "asc" | "desc") => void;
};

export default function StylistContent({
  openBon,
  setOpenBon,
  closedBon,
  setClosedBon,
  search,
  setSearch,
  page,
  setTotalPages,
  limit,
  date,
  setDate,
}: StylistContentProps) {
  const { selectedStylistId, selectedStylistBonId } = useUserStore();
  const { data: activeStylists } = useActiveStylists(openBon, closedBon);
  const selectedStylist = (activeStylists?.stylists ?? []).find(
    (stylist) => stylist.id === selectedStylistId
  );
  const bons = selectedStylist?.BonsStyleTrait || [];
  const selectedBon = selectedStylist?.BonsStyleTrait.find(
    (bon) => bon.id === selectedStylistBonId
  );

  return (
    <div>
      <div className="flex justify-between items-center min-h-[50px]">
        <StylistContentHeader
          openBon={openBon}
          setOpenBon={setOpenBon}
          closedBon={closedBon}
          setClosedBon={setClosedBon}
          setSearch={setSearch}
          search={search}
          activeStylists={activeStylists}
          bons={bons}
          selectedStylist={selectedStylist}
          selectedBon={selectedBon}
        />
      </div>
      <StylistTable
        search={search}
        page={page}
        setTotalPages={setTotalPages}
        limit={limit}
        date={date}
        setDate={setDate}
        selectedStylist={selectedStylist}
        selectedBon={selectedBon}
      />
    </div>
  );
}
