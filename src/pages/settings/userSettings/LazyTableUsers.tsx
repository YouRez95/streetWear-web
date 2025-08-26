import defaultUserImage from "@/assets/placeholder-image/default-user.png";
import { formatDateToDDMMYYYY, getImageUrl } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUserStore } from "@/store/userStore";
import { formatIndex } from "@/lib/utils";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { memo } from "react";
import type { UserData } from "@/types/models";

type LazyTableUsersProps = {
  users: UserData[];
  openDialog: (user: UserData, type: "update" | "delete") => void;
};

function LazyTableUsers({ users, openDialog }: LazyTableUsersProps) {
  const { userData } = useUserStore();

  return (
    <Table className="border-background rounded-xl overflow-hidden text-base">
      <TableCaption className="sr-only">Liste des utilisateurs</TableCaption>
      <TableHeader className="text-background bg-tableHead border">
        <TableRow className="text-background rounded-xl font-medium">
          <TableHead className="text-background">No</TableHead>
          <TableHead className="text-background">Nom d'utilisateur</TableHead>
          <TableHead className="text-background">Email</TableHead>
          <TableHead className=" text-background">Date de création</TableHead>
          <TableHead className=" text-background">Rôle</TableHead>
          <TableHead className=" text-background">Téléphone</TableHead>
          <TableHead className=" text-background">Adresse</TableHead>
          {userData?.role === "super admin" && (
            <TableHead className=" text-background">Actions</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {users.map((user, index) => (
          <TableRow key={user.name} className="h-[55px]">
            <TableCell className="font-medium">{formatIndex(index)}</TableCell>
            <TableCell className="h-full">
              <div className="flex items-center gap-2 h-full">
                <img
                  loading="lazy"
                  src={getImageUrl(user.imageUrl)}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = defaultUserImage;
                  }}
                />
                <span>{user.name}</span>
              </div>
            </TableCell>
            <TableCell className="">{user.email}</TableCell>
            <TableCell className="">
              {formatDateToDDMMYYYY(user.createdAt)}
            </TableCell>
            <TableCell className="">{user.role}</TableCell>
            <TableCell className="">{user.phone}</TableCell>
            <TableCell className="">{user.address}</TableCell>
            {userData?.role === "super admin" && (
              <TableCell className="flex gap-2">
                <Button
                  variant={"ghost"}
                  onClick={() => openDialog(user, "update")}
                  className="text-destructive border-destructive border p-[8px] hover:text-destructive hover:bg-destructive/10"
                >
                  <PencilIcon />
                </Button>
                <Button
                  onClick={() => openDialog(user, "delete")}
                  variant={"ghost"}
                  className="text-secondary border-secondary border p-[8px] hover:text-secondary hover:bg-secondary/10"
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default memo(LazyTableUsers);
