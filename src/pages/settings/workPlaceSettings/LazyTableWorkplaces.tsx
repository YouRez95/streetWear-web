import { formatDateToDDMMYYYY } from "@/lib/utils";

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
import type { WorkPlace } from "@/types/models";

type LazyTableWorkplacesProps = {
  workplaces: WorkPlace[];
  openDialog: (workPlace: WorkPlace, type: "update" | "delete") => void;
};

function LazyTableWorkplaces({
  workplaces,
  openDialog,
}: LazyTableWorkplacesProps) {
  const { userData } = useUserStore();

  return (
    <Table className="border-background rounded-xl overflow-hidden text-base">
      <TableCaption className="sr-only">Liste des ateliers</TableCaption>
      <TableHeader className="text-background bg-tableHead border">
        <TableRow className="text-background rounded-xl font-medium">
          <TableHead className="text-background">No</TableHead>
          <TableHead className="text-background">Nom</TableHead>
          <TableHead className=" text-background">Date de création</TableHead>
          <TableHead className=" text-background">Adresse</TableHead>
          {userData?.role === "super admin" && (
            <TableHead className=" text-background text-right">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {workplaces.map((workplace, index) => (
          <TableRow key={workplace.name} className="h-[55px]">
            <TableCell className="font-medium">{formatIndex(index)}</TableCell>
            <TableCell className="h-full">
              <span>{workplace.name}</span>
            </TableCell>
            <TableCell className="">
              {formatDateToDDMMYYYY(workplace.createdAt)}
            </TableCell>
            <TableCell className="">{workplace.address}</TableCell>
            {userData?.role === "super admin" && (
              <TableCell className="flex gap-2 justify-end">
                <Button
                  variant={"ghost"}
                  onClick={() => openDialog(workplace, "update")}
                  className="text-destructive border-destructive border p-[8px] hover:text-destructive hover:bg-destructive/10"
                >
                  <PencilIcon />
                </Button>
                <Button
                  onClick={() => openDialog(workplace, "delete")}
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

export default memo(LazyTableWorkplaces);
