import { LoadingSuspense } from "@/components/loading";
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/store/userStore";
import { Search } from "lucide-react";
import { Suspense, useState } from "react";
import { CreateUserDialog } from "./CreateUserDialog";
import TableUsers from "./TableUsers";

export default function TabUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const { userData } = useUserStore();
  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-start px-7 pt-7">
        <div className="flex flex-col gap-5">
          <h1 className="text-xl font-medium">Permissions des utilisateurs</h1>
          <p className="">Gérer qui a accès à votre système</p>
        </div>
        <div className="flex items-center gap-2 ">
          <div className="min-w-[300px] relative">
            <div className="absolute left-2 top-[50%] translate-y-[-50%]">
              <Search className="text-background/50" />
            </div>
            <Input
              className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
              placeholder="Rechercher un utilisateur"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Dialog for creating User */}
          {userData?.role === "super admin" && <CreateUserDialog />}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <Suspense fallback={<LoadingSuspense />}>
          <TableUsers searchTerm={searchTerm} />
          {/* <div>Table come here</div> */}
        </Suspense>
      </div>
    </div>
  );
}
