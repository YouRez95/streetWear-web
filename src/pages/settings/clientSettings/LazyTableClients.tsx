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
import { useUpdateClientStatus } from "@/hooks/useClients";
import { useUserStore } from "@/store/userStore";
import { formatIndex } from "@/lib/utils";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { memo } from "react";
import { ToggleActivation } from "../ToggleActivation";
import type { ClientData } from "@/types/models";

type LazyTableClientsProps = {
  clients: ClientData[];
  openDialog: (client: ClientData, type: "update" | "delete") => void;
};

function LazyTableClients({ clients, openDialog }: LazyTableClientsProps) {
  const { userData } = useUserStore();
  const updateClientStatusMutation = useUpdateClientStatus();

  return (
    <Table className="border-background rounded-xl overflow-hidden text-base">
      <TableCaption className="sr-only">Liste de vos clients</TableCaption>
      <TableHeader className="text-background bg-tableHead border">
        <TableRow className="text-background rounded-xl font-medium">
          <TableHead className="text-background">No</TableHead>
          <TableHead className="text-background">Nom du client</TableHead>
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
        {clients.map((client, index) => (
          <TableRow key={client.name} className="h-[55px]">
            <TableCell className="font-medium">{formatIndex(index)}</TableCell>
            <TableCell className="h-full">
              <div className="flex items-center gap-2 h-full">
                {client.name}
              </div>
            </TableCell>
            <TableCell className="">
              {formatDateToDDMMYYYY(client.createdAt)}
            </TableCell>
            <TableCell className="">{client.phone}</TableCell>
            <TableCell className="">{client.address}</TableCell>
            <TableCell className="">
              <div className="flex items-center justify-center">
                <ToggleActivation
                  id={client.id}
                  active={client.active}
                  mutateFn={updateClientStatusMutation}
                  idField="clientId"
                />
              </div>
            </TableCell>
            {userData?.role === "super admin" && (
              <TableCell className="">
                <div className="flex gap-2 justify-center items-center">
                  <Button
                    variant={"ghost"}
                    onClick={() => openDialog(client, "update")}
                    className="text-destructive border-destructive border p-[8px] hover:text-destructive hover:bg-destructive/10"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    onClick={() => openDialog(client, "delete")}
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

// export default LazyTableClients
export default memo(LazyTableClients);
