import { useWorkerStore } from "@/store/workerStore";
import { useState } from "react";
import AddWorkerDialog from "./AddWorkerDialog";
import CreateWeekDialog from "./CreateWeekDialog";
import { DeleteWeekDialog } from "./DeleteWeekDialog";
import FilterButton from "./FilterButton";
import SelectWeekFilter from "./SelectWeekFilter";
import SelectWorkerFilter from "./SelectWorkerFilter";
import SelectWorkplaceFilter from "./SelectWorkplaceFilter";
import UpdateWeekDialog from "./UpdateWeekDialog";

export const WorkersFilter = () => {
  const {
    setWeekId,
    weekId,
    setWorkplaceId,
    workplaceId,
    weekName,
    setWeekName,
    currentViewInWeekly,
  } = useWorkerStore();
  const [createWeekOpen, setCreateWeekOpen] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUpdateWeekDialog, setOpenUpdateWeekDialog] = useState(false);
  const { workerId, setWorkerId } = useWorkerStore();

  const handleChangeWorkplaceFilter = (value: string) => {
    setWorkplaceId(value);
    setWeekId("");
  };

  const handleChangeWeekId = ({
    weekId,
    weekName,
  }: {
    weekId: string;
    weekName: string;
  }) => {
    setWeekName(weekName);
    setWeekId(weekId);
  };

  const handleChangeWorkerId = (value: string) => {
    setWorkerId(value);
  };

  return (
    <div className="flex flex-col gap-5 xl:flex-row items-start justify-between my-4">
      <div className="flex flex-col gap-2">
        {currentViewInWeekly === "workplaces" ? (
          <>
            <SelectWorkplaceFilter
              value={workplaceId}
              onValueChange={handleChangeWorkplaceFilter}
            />

            <SelectWeekFilter
              value={weekId}
              onValueChange={handleChangeWeekId}
            />
          </>
        ) : (
          <SelectWorkerFilter
            value={workerId}
            onValueChange={handleChangeWorkerId}
            showTextAtBottom={false}
          />
        )}
      </div>

      <div className="flex gap-2 items-center justify-end w-full">
        {currentViewInWeekly === "workplaces" && (
          <>
            <CreateWeekDialog
              open={createWeekOpen}
              setOpen={setCreateWeekOpen}
            />
            <AddWorkerDialog />
            {weekId && (
              <DeleteWeekDialog
                open={openDeleteDialog}
                setOpen={setOpenDeleteDialog}
                weekName={weekName}
              />
            )}

            {weekId && (
              <UpdateWeekDialog
                open={openUpdateWeekDialog}
                setOpen={setOpenUpdateWeekDialog}
              />
            )}
          </>
        )}
        <FilterButton />
      </div>
    </div>
  );
};
