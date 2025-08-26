import { LoadingSuspense } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { SearchIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { CreateFaconnierDialog } from "./CreateFaconnierDialog";
import { TableFaconniers } from "./TableFaconniers";

export default function TabFaconniers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { userData } = useUserStore();

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start px-7 pt-7">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Faconniers</h1>
          <p className="">Gérer vos faconniers</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <SearchIcon className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Rechercher un faconnier"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dialog for creating User */}
          {userData?.role === "super admin" && <CreateFaconnierDialog />}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center ">
        <Suspense fallback={<LoadingSuspense />}>
          <TableFaconniers searchTerm={searchTerm} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </div>
  );
}
