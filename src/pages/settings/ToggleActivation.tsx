import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { type UseMutationResult } from "@tanstack/react-query";
import { useState } from "react";

export const ToggleActivation = <
  TData,
  TError = Error,
  TVariables = any,
  TContext = unknown
>({
  id,
  active,
  mutateFn,
  idField = "clientId",
}: {
  id: string;
  active: boolean;
  mutateFn: UseMutationResult<TData, TError, TVariables, TContext>;
  idField?: string;
}) => {
  const [status, setStatus] = useState(active ? "active" : "inactive");

  const handleChangeStatus = (value: string) => {
    //console.log('Selected value changed:', value)
    setStatus(value);

    // Create the mutation variables object dynamically based on idField
    const mutationVariables = {
      [idField]: id,
      status: value === "active",
    } as unknown as TVariables;

    mutateFn.mutate(mutationVariables);
  };

  return (
    <Select value={status} onValueChange={handleChangeStatus}>
      <SelectTrigger
        className={cn(
          "w-28 rounded-full px-0 py-0 flex items-center justify-center gap-2 font-medium text-white [&>svg]:text-white",
          status === "active"
            ? "bg-green-400 hover:bg-green-500"
            : "bg-destructive/90 hover:bg-destructive"
        )}
      >
        <span className="text-sm font-bold">
          {status === "active" ? "Actif" : "Inactif"}
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="active" className="hover:bg-green-300">
          Actif
        </SelectItem>
        <SelectItem value="inactive" className="hover:bg-destructive/10">
          Inactif
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
