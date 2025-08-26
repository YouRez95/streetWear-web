import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { Search } from "lucide-react";
import { useState } from "react";
import CreateSeassonDialog from "./CreateSeassonDialog";
import TableSeason from "./TableSeason";

export default function TabSeasons() {
  // WIP: Import and export data
  const [searchTerm, setSearchTerm] = useState("");
  const [createSeassonDialogOpen, setCreateSeassonDialogOpen] = useState(false);
  const { userData } = useUserStore();

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start px-7 pt-7">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Saisons</h1>
          <p className="">Gérer vos saisons</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <Search className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Search Season"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {userData?.role === "super admin" && (
            <Button
              className="font-bagel text-lg flex items-center justify-center pb-3 rounded-lg"
              onClick={() => setCreateSeassonDialogOpen(true)}
            >
              <span>+</span>
              Créer une saison
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex-1">
          <TableSeason searchTerm={searchTerm} />
        </div>
      </div>

      {createSeassonDialogOpen && (
        <CreateSeassonDialog
          open={createSeassonDialogOpen}
          setOpen={setCreateSeassonDialogOpen}
        />
      )}
    </div>
  );
}
