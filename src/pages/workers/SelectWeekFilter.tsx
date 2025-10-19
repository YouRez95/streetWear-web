import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWeeksByCursor } from "@/hooks/useWorkers";
import { useWorkerStore } from "@/store/workerStore";
import { useDebounce, useIntersectionObserver } from "@uidotdev/usehooks";
import { memo, useCallback, useEffect, useState } from "react";

interface SelectWeekFilterProps {
  onValueChange: (data: { weekId: string; weekName: string }) => void;
  value?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function SelectWeekFilter({
  onValueChange,
  value,
  placeholder = "Choisir une semaine",
  disabled = false,
}: SelectWeekFilterProps) {
  const { workplaceId } = useWorkerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [ref, entry] = useIntersectionObserver({
    threshold: 0,
    root: null,
    rootMargin: "10px",
  });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useWeeksByCursor(workplaceId, 20, debouncedSearchTerm);

  const weeks = data?.pages.flatMap((page) => page.weeks) ?? [];

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

  // Auto-select first week with both ID and name
  useEffect(() => {
    if (weeks.length > 0 && !value) {
      const firstWeek = weeks[0];
      onValueChange({
        weekId: firstWeek.id,
        weekName: firstWeek.displayText,
      });
    }
  }, [weeks, value, onValueChange]);

  // Handle week selection with both ID and name
  const handleWeekSelection = useCallback(
    (selectedWeekId: string) => {
      const selectedWeek = weeks.find((week) => week.id === selectedWeekId);

      if (selectedWeek) {
        onValueChange({
          weekId: selectedWeek.id,
          weekName: selectedWeek.displayText,
        });
      }
    },
    [weeks, onValueChange]
  );

  const SearchInput = memo(({ value, onChange, disabled, className }: any) => (
    <Input
      type="text"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={className}
      autoFocus
      placeholder="2025 or 01/2025"
    />
  ));

  return (
    <div className="w-full lg:w-64">
      {/* Slightly wider for date ranges */}
      <Select
        onValueChange={handleWeekSelection}
        value={value}
        disabled={disabled}
      >
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
          {!workplaceId && (
            <div className="flex items-center justify-center p-4">
              <span className="ml-2 text-background/30">
                Choisir un atelier
              </span>
            </div>
          )}
          {workplaceId && status === "pending" && (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
              <span className="ml-2">Chargement des semaines...</span>
            </div>
          )}

          {status === "error" && (
            <div className="p-2 text-center text-red-500">
              Échec du chargement des semaines. Veuillez réessayer.
            </div>
          )}

          {weeks.map((week) => (
            <SelectItem key={week.id} value={week.id}>
              <div className="flex flex-col">
                <span className="font-medium">{week.displayText}</span>
              </div>
            </SelectItem>
          ))}

          {/* Empty state */}
          {status === "success" && weeks.length === 0 && (
            <div className="p-4 text-center text-background/45">
              Aucune semaine trouvée
            </div>
          )}

          {/* Intersection observer trigger */}
          {hasNextPage && weeks.length > 0 && (
            <div ref={ref} className="h-1 w-full" aria-hidden="true" />
          )}

          {/* Loading more indicator */}
          {isFetchingNextPage && (
            <div className="flex items-center justify-center p-2 text-background/45">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
              Chargement d'autres semaines...
            </div>
          )}

          {/* End of list indicator */}
          {!hasNextPage && weeks.length > 0 && (
            <div className="p-2 text-center text-xs text-background/45 border-t">
              {weeks.length} semaine{weeks.length !== 1 ? "s" : ""} chargée
              {weeks.length !== 1 ? "s" : ""}
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
