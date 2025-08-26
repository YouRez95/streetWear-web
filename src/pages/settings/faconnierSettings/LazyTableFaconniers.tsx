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
import { useUpdateFaconnierStatus } from "@/hooks/useFaconnier";
import { useUserStore } from "@/store/userStore";
import { formatIndex } from "@/lib/utils";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { memo, useCallback } from "react";
import { ToggleActivation } from "../ToggleActivation";
import type { FaconnierData } from "@/types/models";

type LazyTableFaconniersProps = {
  faconniers: FaconnierData[];
  openDialog: (faconnier: FaconnierData, type: "update" | "delete") => void;
};

function LazyTableFaconniers({
  faconniers,
  openDialog,
}: LazyTableFaconniersProps) {
  const { userData } = useUserStore();
  const updateFaconnierStatusMutation = useUpdateFaconnierStatus();

  const handleDialog = useCallback(
    (faconnier: FaconnierData, type: "update" | "delete") => () => {
      openDialog(faconnier, type);
    },
    [openDialog]
  );

  return (
    <Table className="border-background rounded-xl overflow-hidden text-base">
      <TableCaption className="sr-only">Liste de vos faconniers</TableCaption>
      <TableHeader className="text-background bg-tableHead border">
        <TableRow className="text-background rounded-xl font-medium">
          <TableHead className="text-background">No</TableHead>
          <TableHead className="text-background">Nom du faconnier</TableHead>
          <TableHead className="text-background">Date de création</TableHead>
          <TableHead className="text-background">Téléphone</TableHead>
          <TableHead className="text-background">Adresse</TableHead>
          <TableHead className="text-background text-center">Statut</TableHead>
          {userData?.role === "super admin" && (
            <TableHead className="text-background text-center">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {faconniers.map((faconnier, index) => (
          <TableRow key={faconnier.name} className="h-[55px]">
            <TableCell className="font-medium">{formatIndex(index)}</TableCell>
            <TableCell className="h-full">
              <div className="flex items-center gap-2 h-full">
                {faconnier.name}
              </div>
            </TableCell>
            <TableCell className="">
              {formatDateToDDMMYYYY(faconnier.createdAt)}
            </TableCell>
            <TableCell className="">{faconnier.phone}</TableCell>
            <TableCell className="">{faconnier.address}</TableCell>
            <TableCell className="">
              <div className="flex items-center justify-center">
                {/* WIP: This one of impact performance */}
                <ToggleActivation
                  id={faconnier.id}
                  active={faconnier.active}
                  mutateFn={updateFaconnierStatusMutation}
                  idField="faconnierId"
                />
              </div>
            </TableCell>
            {userData?.role === "super admin" && (
              <TableCell className="">
                <div className="flex gap-2 justify-center items-center">
                  <Button
                    variant={"ghost"}
                    onClick={handleDialog(faconnier, "update")}
                    className="text-destructive border-destructive border p-[8px] hover:text-destructive hover:bg-destructive/10"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    onClick={handleDialog(faconnier, "delete")}
                    variant={"ghost"}
                    className="text-secondary border-secondary border p-[8px] hover:text-secondary hover:bg-secondary/10"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// export default LazyTableFaconniers
export default memo(LazyTableFaconniers);
