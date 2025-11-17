import { useActiveClientsAndPassager } from "@/hooks/useClients";
import { useUserStore } from "@/store/userStore";
import ClientsContentHeader from "./ClientsContentHeader";
import ClientsTable from "./ClientsTable";

type ClientsContentProps = {
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

export default function ClientsContent({
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
}: ClientsContentProps) {
  const { selectedClientId, selectedClientBonId } = useUserStore();
  const { data: activeClients } = useActiveClientsAndPassager(
    openBon,
    closedBon
  );
  const selectedClient = (activeClients?.clients ?? []).find(
    (client) => client.id === selectedClientId
  );
  const bons = selectedClient?.BonsClients || [];
  const selectedBon = selectedClient?.BonsClients.find(
    (bon) => bon.id === selectedClientBonId
  );
  return (
    <div>
      <div className="flex justify-between items-center min-h-[50px]">
        <ClientsContentHeader
          openBon={openBon}
          setOpenBon={setOpenBon}
          closedBon={closedBon}
          setClosedBon={setClosedBon}
          setSearch={setSearch}
          search={search}
          activeClients={activeClients}
          bons={bons}
          selectedClient={selectedClient}
          selectedBon={selectedBon}
        />
      </div>
      <ClientsTable
        search={search}
        page={page}
        setTotalPages={setTotalPages}
        limit={limit}
        date={date}
        setDate={setDate}
        selectedClient={selectedClient}
        selectedBon={selectedBon}
      />
    </div>
  );
}
