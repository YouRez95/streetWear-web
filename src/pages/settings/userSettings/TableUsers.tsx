import { PaginationComponent } from "@/components/pagination";
import { useUsers } from "@/hooks/useUsers";
import { useDebounce } from "@uidotdev/usehooks";
import { useEffect, useState } from "react";
import { DeleteUserDialog } from "./DeleteUserDialog";
import LazyTableUsers from "./LazyTableUsers";
import { UpdateUserDialog } from "./UpdateUserDialog";
import type { UserData } from "@/types/models";

type TableUsersProps = {
  searchTerm: string;
};

export default function TableUsers({ searchTerm }: TableUsersProps) {
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogType, setDialogType] = useState<"update" | "delete" | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useUsers(page, limit, debouncedSearchTerm);

  useEffect(() => {
    if (usersResponse?.totalPages) {
      setTotalPages(usersResponse.totalPages);
    }
  }, [usersResponse]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  const openDialog = (user: UserData, type: "update" | "delete") => {
    setSelectedUser(user);
    setDialogType(type);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedUser(null);
    setDialogType(null);
  };

  return (
    <>
      {isLoading && <p className="text-background/50">Loading...</p>}

      {error && <p className="text-background/50">Error fetching users</p>}
      {!isLoading &&
        !error &&
        usersResponse &&
        usersResponse.users.length === 0 && (
          <p className="text-background/50">No users found</p>
        )}
      {!isLoading &&
        !error &&
        usersResponse &&
        usersResponse.users.length > 0 && (
          <div className="p-7 w-full h-full">
            <LazyTableUsers
              openDialog={openDialog}
              users={usersResponse.users}
            />
          </div>
        )}
      {open && selectedUser && dialogType === "update" && (
        <UpdateUserDialog
          user={selectedUser}
          open={open}
          closeDialog={closeDialog}
        />
      )}
      {open && selectedUser && dialogType === "delete" && (
        <DeleteUserDialog
          userId={selectedUser.id}
          userName={selectedUser.name}
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
