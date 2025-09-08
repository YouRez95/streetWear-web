import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

type ProductSearchProps = {
  setSearch: (search: string) => void;
  search: string;
};

export default function ReturnStockSearch({
  setSearch,
  search,
}: ProductSearchProps) {
  return (
    <div className="flex justify-end items-center gap-2 mb-5">
      <div className="w-full md:min-w-[300px] md:w-auto relative">
        <div className="absolute left-2 top-[50%] translate-y-[-50%]">
          <SearchIcon className="text-background/50" />
        </div>
        <Input
          className="w-full placeholder:text-background/35 text-background rounded-lg pl-9"
          placeholder="Rechercher un produit"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
