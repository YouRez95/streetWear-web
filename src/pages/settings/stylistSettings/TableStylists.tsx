import { PaginationComponent } from "@/components/pagination";
import { useStylists } from "@/hooks/useStylist";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { DeleteStylistDialog } from "./DeleteStylistDialog";
import LazyTableStylists from "./LazyTableStylists";
import { UpdateStylistDialog } from "./UpdateStylistDialog";
import type { StylistData } from "@/types/models";

type TableStylistsProps = {
  searchTerm: string;
  types: string[];
};

export const TableStylists = ({ searchTerm, types }: TableStylistsProps) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedStylist, setSelectedStylist] = useState<StylistData | null>(
    null
  );
  const [dialogType, setDialogType] = useState<"update" | "delete" | null>(
    null
  );
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [open, setOpen] = useState(false);

  const {
    data: stylistsResponse,
    isLoading,
    isError,
    error,
  } = useStylists(types, page, limit, debouncedSearchTerm);

  useEffect(() => {
    if (stylistsResponse?.totalPages) {
      setTotalPages(stylistsResponse.totalPages);
    }
  }, [stylistsResponse]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const openDialog = (stylist: StylistData, type: "update" | "delete") => {
    setSelectedStylist(stylist);
    setDialogType(type);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedStylist(null);
    setDialogType(null);
  };

  if (isLoading) return <p className="text-background/50">Loading...</p>;

  if (isError || stylistsResponse?.status === "failed")
    return (
      <p className="text-background/50">
        Erreur lors de la récupération des stylists
      </p>
    );

  return (
    <>
      {!isLoading &&
        !error &&
        stylistsResponse &&
        stylistsResponse.stylists.length === 0 && (
          <p className="text-background/50">Aucun stylist trouvé</p>
        )}

      {!isLoading &&
        !error &&
        stylistsResponse &&
        stylistsResponse.stylists.length > 0 && (
          <div className="p-7 w-full h-full">
            <LazyTableStylists
              stylists={stylistsResponse.stylists}
              openDialog={openDialog}
            />
          </div>
        )}
      {open && selectedStylist && dialogType === "update" && (
        <UpdateStylistDialog
          open={open}
          closeDialog={closeDialog}
          stylist={selectedStylist}
        />
      )}
      {open && selectedStylist && dialogType === "delete" && (
        <DeleteStylistDialog
          open={open}
          closeDialog={closeDialog}
          stylistId={selectedStylist.id}
          stylistName={selectedStylist.name}
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
};
