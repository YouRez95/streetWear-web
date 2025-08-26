import { formatDateToDDMMYYYY } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
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
import { useUpdateStylistStatus } from "@/hooks/useStylist";
import { useUserStore } from "@/store/userStore";
import { formatIndex } from "@/lib/utils";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { memo, useCallback } from "react";
import { ToggleActivation } from "../ToggleActivation";
import type { StylistData } from "@/types/models";

type LazyTableStylistsProps = {
  stylists: StylistData[];
  openDialog: (stylist: StylistData, type: "update" | "delete") => void;
};

function LazyTableStylists({ stylists, openDialog }: LazyTableStylistsProps) {
  const updateStylistStatusMutation = useUpdateStylistStatus();
  const { userData } = useUserStore();

  const handleDialog = useCallback(
    (stylist: StylistData, type: "update" | "delete") => () => {
      openDialog(stylist, type);
    },
    [openDialog]
  );

  return (
    <Table className="border-background rounded-xl overflow-hidden text-base">
      <TableCaption className="sr-only">Liste de vos faconniers</TableCaption>
      <TableHeader className="text-background bg-tableHead border">
        <TableRow className="text-background rounded-xl font-medium">
          <TableHead className="text-background">No</TableHead>
          <TableHead className="text-background">Nom du styliste</TableHead>
          <TableHead className="text-background">Date de création</TableHead>
          <TableHead className="text-background">Téléphone</TableHead>
          <TableHead className="text-background">Adresse</TableHead>
          <TableHead className="text-background">Type</TableHead>
          <TableHead className="text-background text-center">Statut</TableHead>
          {userData?.role === "super admin" && (
            <TableHead className="text-background text-center">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {stylists.map((stylist, index) => (
          <TableRow key={stylist.id} className="h-[55px]">
            <TableCell className="font-medium">{formatIndex(index)}</TableCell>
            <TableCell className="h-full">
              <div className="flex items-center gap-2 h-full">
                {stylist.name}
              </div>
            </TableCell>
            <TableCell className="">
              {formatDateToDDMMYYYY(stylist.createdAt)}
            </TableCell>
            <TableCell className="">{stylist.phone}</TableCell>
            <TableCell className="">{stylist.address}</TableCell>
            <TableCell className="">
              <Badge variant={"default"}>{stylist.type}</Badge>
            </TableCell>
            <TableCell className="">
              <div className="flex items-center justify-center">
                {/* WIP: This one of impact performance */}
                <ToggleActivation
                  id={stylist.id}
                  active={stylist.active}
                  mutateFn={updateStylistStatusMutation}
                  idField="stylistId"
                />
              </div>
            </TableCell>
            {userData?.role === "super admin" && (
              <TableCell className="">
                <div className="flex gap-2 justify-center items-center">
                  <Button
                    variant={"ghost"}
                    onClick={handleDialog(stylist, "update")}
                    className="text-destructive border-destructive border p-[8px] hover:text-destructive hover:bg-destructive/10"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    onClick={handleDialog(stylist, "delete")}
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
export default memo(LazyTableStylists);
