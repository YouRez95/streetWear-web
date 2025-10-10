import { LoadingSuspense } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Suspense, useState } from "react";
import { CreateWorkerDialog } from "./CreateWorkerDialog";
import TableWorker from "./TableWorkers";
// import { CreateUserDialog } from './CreateUserDialog'
// import TableUsers from './TableUsers'

export default function TabWorkers() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col md:flex-row gap-10 md:gap-0 justify-between items-start px-7 pt-7">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Employés</h1>
          <p className="">Gérer vos employés</p>
        </div>
        <div className="flex md:items-center flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="w-full md:min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <Search className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Rechercher un employé"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dialog for creating User */}
          <CreateWorkerDialog />
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          <TableWorker searchTerm={searchTerm} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </div>
  );
}
