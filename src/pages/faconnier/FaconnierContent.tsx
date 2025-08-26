import { useActiveFaconniers } from "@/hooks/useFaconnier";
import { useUserStore } from "@/store/userStore";
import FaconnierContentHeader from "./FaconnierContentHeader";
import FaconnierTable from "./FaconnierTable";

type FaconnierContentProps = {
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

export default function FaconnierContent({
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
}: FaconnierContentProps) {
  const { selectedFaconnierId, selectedBonId } = useUserStore();
  const { data: activeFaconniers } = useActiveFaconniers(openBon, closedBon);
  const selectedFaconnier = (activeFaconniers?.faconniers ?? []).find(
    (faconnier) => faconnier.id === selectedFaconnierId
  );
  const bons = selectedFaconnier?.BonsFaconnier || [];
  const selectedBon = selectedFaconnier?.BonsFaconnier.find(
    (bon) => bon.id === selectedBonId
  );

  return (
    <div>
      <div className="flex justify-between items-center min-h-[50px]">
        <FaconnierContentHeader
          openBon={openBon}
          setOpenBon={setOpenBon}
          closedBon={closedBon}
          setClosedBon={setClosedBon}
          setSearch={setSearch}
          search={search}
          activeFaconniers={activeFaconniers}
          bons={bons}
          selectedFaconnier={selectedFaconnier}
          selectedBon={selectedBon}
        />
      </div>
      <FaconnierTable
        search={search}
        page={page}
        setTotalPages={setTotalPages}
        limit={limit}
        date={date}
        setDate={setDate}
        selectedFaconnier={selectedFaconnier}
        selectedBon={selectedBon}
      />
    </div>
  );
}
