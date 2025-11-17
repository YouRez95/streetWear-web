import { PaginationComponent } from "@/components/pagination";
import { useWorkers } from "@/hooks/useWorkers";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { DeleteWorkerDialog } from "./DeleteWorkerDialog";
import LazyTableWorkers from "./LazyTableWorkers";
import { UpdateWorkerDialog } from "./UpdateWorker";
import type { GetWorkersResponse } from "@/types/models";
// import { DeleteWorkplaceDialog } from './DeleteWorkplaceDialog'
// import LazyTableWorkplaces from './LazyTableWorkplaces'
// import { UpdateWorkplace } from './UpdateWorkplace'

type TableWorkerProps = {
  searchTerm: string;
  active: string[];
};

export default function TableWorker({ searchTerm, active }: TableWorkerProps) {
  const [selectedWorker, setSelectedWorker] =
    useState<GetWorkersResponse | null>(null);
  const [dialogType, setDialogType] = useState<"update" | "delete" | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const {
    data: workersResponse,
    isLoading,
    error,
  } = useWorkers(active, page, limit, debouncedSearchTerm);

  useEffect(() => {
    if (workersResponse?.totalPages) {
      setTotalPages(workersResponse.totalPages);
    }
  }, [workersResponse]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const openDialog = (
    worker: GetWorkersResponse,
    type: "update" | "delete"
  ) => {
    setSelectedWorker(worker);
    setDialogType(type);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedWorker(null);
    setDialogType(null);
  };

  return (
    <>
      {isLoading && <p className="text-background/50">Loading...</p>}

      {error && <p className="text-background/50">Error fetching users</p>}
      {!isLoading &&
        !error &&
        workersResponse &&
        workersResponse.workers.length === 0 && (
          <p className="text-background/50">Aucuns employés trouvés</p>
        )}

      {!isLoading &&
        !error &&
        workersResponse &&
        workersResponse.workers.length > 0 && (
          <div className="p-7 w-full h-full">
            <LazyTableWorkers
              openDialog={openDialog}
              workers={workersResponse.workers}
            />
          </div>
        )}

      {open && selectedWorker && dialogType === "update" && (
        <UpdateWorkerDialog
          worker={selectedWorker}
          open={open}
          closeDialog={closeDialog}
        />
      )}

      {open && selectedWorker && dialogType === "delete" && (
        <DeleteWorkerDialog
          workerId={selectedWorker.id}
          workerName={selectedWorker.name}
          open={open}
          closeDialog={closeDialog}
        />
      )}
      <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto w-full">
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </>
  );
}
