import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkersByCursor } from "@/hooks/useWorkers";
import { useDebounce, useIntersectionObserver } from "@uidotdev/usehooks";
import { memo, useCallback, useEffect, useState } from "react";

interface SelectWorkerFilterProps {
  onValueChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  showTextAtBottom?: boolean;
}

export default function SelectWorkerFilter({
  onValueChange,
  value,
  placeholder = "Choisir une employé",
  disabled = false,
  showTextAtBottom = true,
}: SelectWorkerFilterProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "10px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useWorkersByCursor(20, debouncedSearchTerm);

  const workers = data?.pages.flatMap((page) => page.workers) ?? [];

  const handleFetchNextPage = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (entry?.isIntersecting) {
      handleFetchNextPage();
    }
  }, [entry?.isIntersecting, handleFetchNextPage]);

  const SearchInput = memo(({ value, onChange, disabled, className }: any) => (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      autoFocus
      placeholder="Entre le nom ou le prénom"
    />
  ));

  return (
    <div className="w-full min-w-80">
      {/* Slightly wider for date ranges */}
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
              <span className="ml-2">Chargement des employés...</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-2 text-center text-red-500">
              Échec du chargement des employés. Veuillez réessayer.
            </div>
          )}

          {workers.map((worker) => (
            <SelectItem key={worker.id} value={worker.id}>
              <div className="flex flex-col">
                <span className="font-medium">{worker.name}</span>
              </div>
            </SelectItem>
          ))}

          {/* Empty state */}
          {status === "success" && workers.length === 0 && (
            <div className="p-4 text-center text-background/45">
              Aucune employé trouvée
            </div>
          )}

          {/* Intersection observer trigger */}
          {hasNextPage && workers.length > 0 && (
            <div ref={ref} className="h-1 w-full" aria-hidden="true" />
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-2 text-background/45">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
              Chargement d'autres employé...
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && workers.length > 0 && (
            <div className="p-2 text-center text-xs text-background/45 border-t">
              {workers.length} employé{workers.length !== 1 ? "s" : ""} chargée
              {workers.length !== 1 ? "s" : ""}
            </div>
          )}
        </SelectContent>
      </Select>

      {showTextAtBottom && (
        <div className="text-sm text-background/50 mt-1">
          L'emplyé sélectionné sera automatiquement ajouté à son lieu de travail
        </div>
      )}
    </div>
  );
}
