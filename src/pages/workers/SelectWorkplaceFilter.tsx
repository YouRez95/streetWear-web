import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useWorkPlacesByCursor } from "@/hooks/useWorkers";
import { useDebounce, useIntersectionObserver } from "@uidotdev/usehooks";
import { memo, useCallback, useEffect, useState } from "react";

interface SelectWorkplaceFilterProps {
  onValueChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function SelectWorkplaceFilter({
  onValueChange,
  value,
  placeholder = "Choisir un atelier",
  disabled = false,
}: SelectWorkplaceFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "10px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useWorkPlacesByCursor(20, debouncedSearchTerm);

  const workplaces = data?.pages.flatMap((page) => page.workplaces) ?? [];

  // Memoize the fetch function to prevent unnecessary re-renders
  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    console.log("workplaces:", workplaces);
    if (entry?.isIntersecting) {
      handleFetchNextPage();
    }
  }, [entry?.isIntersecting, handleFetchNextPage]);

  useEffect(() => {
    if (workplaces.length > 0 && !value) {
      onValueChange(workplaces[0].id);
    }
  }, [workplaces]);

  const SearchInput = memo(({ value, onChange, disabled, className }: any) => (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      autoFocus
      placeholder="Rechercher un atelier"
    />
  ));

  return (
    <div className="lg:w-64 w-full">
      <Select onValueChange={onValueChange} value={value} disabled={disabled}>
        <SelectTrigger className="w-full data-[placeholder]:text-background/35 border border-background/50">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="max-h-64 overflow-y-auto"
          position="popper"
          side="bottom"
          avoidCollisions={false}
        >
          {/* Search input */}
          <div className="p-2">
            <SearchInput
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
              disabled={disabled}
              className="w-full border border-background/50 focus:ring-0 focus:border-background placeholder:text-background/35"
            />
          </div>
          {status === "pending" && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              <span className="ml-2">Chargement des ateliers...</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-2 text-center text-red-500">
              Échec du chargement des ateliers. Veuillez réessayer.
            </div>
          )}

          {workplaces.map((workplace) => (
            <SelectItem key={workplace.id} value={workplace.id}>
              <span className="truncate">{workplace.name}</span>
            </SelectItem>
          ))}

          {/* Empty state */}
          {status === "success" && workplaces.length === 0 && (
            <div className="p-4 text-center text-background/45">
              Aucun atelier trouvé
            </div>
          )}

          {/* Intersection observer trigger */}
          {hasNextPage && workplaces.length > 0 && (
            <div ref={ref} className="h-1 w-full" aria-hidden="true" />
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-2 text-background/45">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
              Chargement d'autres ateliers...
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && workplaces.length > 0 && (
            <div className="p-2 text-center text-xs text-background/45 border-t">
              {workplaces.length} atelier{workplaces.length !== 1 ? "s" : ""}{" "}
              chargé
              {workplaces.length !== 1 ? "s" : ""}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
