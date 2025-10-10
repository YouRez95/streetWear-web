import { formatDateToDDMMYYYY, formatIndex } from "@/lib/utils";

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
import { useUpdateWorkerStatus } from "@/hooks/useWorkers";
import { useUserStore } from "@/store/userStore";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { memo, useCallback } from "react";
import { ToggleActivation } from "../ToggleActivation";
import type { GetWorkersResponse } from "@/types/models";

type LazyTableWorkersProps = {
  workers: GetWorkersResponse[];
  openDialog: (worker: GetWorkersResponse, type: "update" | "delete") => void;
};

function LazyTableWorkers({ workers, openDialog }: LazyTableWorkersProps) {
  const { userData } = useUserStore();
  const updateWorkerStatusMutation = useUpdateWorkerStatus();

  const handleDialog = useCallback(
    (worker: GetWorkersResponse, type: "update" | "delete") => () => {
      openDialog(worker, type);
    },
    [openDialog]
  );

  return (
    <Table className="border-background rounded-xl overflow-hidden text-base">
      <TableCaption className="sr-only">Liste de vos employés</TableCaption>
      <TableHeader className="text-background bg-tableHead border">
        <TableRow className="text-background rounded-xl font-medium">
          <TableHead className="text-background">No</TableHead>
          <TableHead className="text-background">Nom</TableHead>
          <TableHead className="text-background">Date de création</TableHead>
          <TableHead className="text-background">Téléphone</TableHead>
          <TableHead className="text-background">Salaire / Semaine</TableHead>
          <TableHead className="text-background">Lieu de travail</TableHead>
          <TableHead className="text-background text-center">Statut</TableHead>
          {userData?.role === "super admin" && (
            <TableHead className="text-background text-center">
              Actions
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody className="border">
        {workers.map((worker, index) => (
          <TableRow key={worker.id} className="h-[55px]">
            <TableCell className="font-medium">{formatIndex(index)}</TableCell>
            <TableCell>{worker.name}</TableCell>
            <TableCell>{formatDateToDDMMYYYY(worker.createdAt)}</TableCell>
            <TableCell>{worker.phone || "-"}</TableCell>
            <TableCell>{worker.salaireHebdomadaire.toFixed(2)} MAD</TableCell>
            <TableCell>{worker.workplace?.name}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center">
                <ToggleActivation
                  id={worker.id}
                  active={worker.isActive}
                  mutateFn={updateWorkerStatusMutation}
                  idField="workerId"
                />
              </div>
            </TableCell>
            {userData?.role === "super admin" && (
              <TableCell>
                <div className="flex gap-2 justify-center items-center">
                  <Button
                    variant={"ghost"}
                    onClick={handleDialog(worker, "update")}
                    className="text-destructive border-destructive border p-[8px] hover:text-destructive hover:bg-destructive/10"
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    onClick={handleDialog(worker, "delete")}
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

export default memo(LazyTableWorkers);
