import { PaginationComponent } from "@/components/pagination";
import { useWorkPlaces } from "@/hooks/useWorkers";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { DeleteWorkplaceDialog } from "./DeleteWorkplaceDialog";
import LazyTableWorkplaces from "./LazyTableWorkplaces";
import { UpdateWorkplace } from "./UpdateWorkplace";
import type { WorkPlace } from "@/types/models";

type TableWorkPlaceProps = {
  searchTerm: string;
};

export default function TableWorkPlace({ searchTerm }: TableWorkPlaceProps) {
  const [selectedWorkplace, setSelectedWorkplace] = useState<WorkPlace | null>(
    null
  );
  const [dialogType, setDialogType] = useState<"update" | "delete" | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const {
    data: workPlacesResponse,
    isLoading,
    error,
  } = useWorkPlaces(page, limit, debouncedSearchTerm);

  useEffect(() => {
    if (workPlacesResponse?.totalPages) {
      setTotalPages(workPlacesResponse.totalPages);
    }
  }, [workPlacesResponse]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const openDialog = (workPlace: WorkPlace, type: "update" | "delete") => {
    setSelectedWorkplace(workPlace);
    setDialogType(type);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedWorkplace(null);
    setDialogType(null);
  };

  return (
    <>
      {isLoading && <p className="text-background/50">Loading...</p>}

      {error && <p className="text-background/50">Error fetching users</p>}
      {!isLoading &&
        !error &&
        workPlacesResponse &&
        workPlacesResponse.workplaces.length === 0 && (
          <p className="text-background/50">Aucuns ateliers trouvés</p>
        )}

      {!isLoading &&
        !error &&
        workPlacesResponse &&
        workPlacesResponse.workplaces.length > 0 && (
          <div className="p-7 w-full h-full">
            <LazyTableWorkplaces
              openDialog={openDialog}
              workplaces={workPlacesResponse.workplaces}
            />
          </div>
        )}

      {open && selectedWorkplace && dialogType === "update" && (
        <UpdateWorkplace
          workplace={selectedWorkplace}
          open={open}
          closeDialog={closeDialog}
        />
      )}

      {open && selectedWorkplace && dialogType === "delete" && (
        <DeleteWorkplaceDialog
          workplaceId={selectedWorkplace.id}
          workplaceName={selectedWorkplace.name}
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
