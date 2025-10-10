import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useYearsByCursor } from "@/hooks/useWorkers";
import { useYearStore } from "@/store/workerStore";
import { useDebounce, useIntersectionObserver } from "@uidotdev/usehooks";
import { memo, useCallback, useEffect, useState } from "react";

interface SelectYearFilterProps {
  onValueChange: (value: string) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function SelectYearFilter({
  onValueChange,
  value,
  placeholder = "Choisir une année",
  disabled = false,
}: SelectYearFilterProps) {
  const { workplaceId } = useYearStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "10px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useYearsByCursor(workplaceId, 20, debouncedSearchTerm);

  const years = data?.pages.flatMap((page) => page.years) ?? [];

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

  useEffect(() => {
    if (years.length > 0 && !value) {
      onValueChange(years[0].id);
    }
  }, [years]);

  const SearchInput = memo(({ value, onChange, disabled, className }: any) => (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      autoFocus
      placeholder="Rechercher une année"
    />
  ));

  return (
    <div className="w-full lg:w-64">
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
              <span className="ml-2">Chargement des annees...</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-2 text-center text-red-500">
              Échec du chargement des années. Veuillez réessayer.
            </div>
          )}

          {years.map((year) => (
            <SelectItem key={year.id} value={year.id}>
              <div className="flex flex-col">
                <span className="font-medium">{year.displayText}</span>
              </div>
            </SelectItem>
          ))}

          {/* Empty state */}
          {status === "success" && years.length === 0 && (
            <div className="p-4 text-center text-background/45">
              Aucune année trouvée
            </div>
          )}

          {/* Intersection observer trigger */}
          {hasNextPage && years.length > 0 && (
            <div ref={ref} className="h-1 w-full" aria-hidden="true" />
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-2 text-background/45">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
              Chargement d'autres années...
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && years.length > 0 && (
            <div className="p-2 text-center text-xs text-background/45 border-t">
              {years.length} années {years.length !== 1 ? "s" : ""} chargée
              {years.length !== 1 ? "s" : ""}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
