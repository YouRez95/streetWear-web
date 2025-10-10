import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWorkPlaces } from "@/hooks/useWorkers";
import { useDebounce } from "@uidotdev/usehooks";
import { AlertCircle, Loader2, Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Workplace = {
  id: string;
  name: string;
};

type WorkplaceSelectProps = {
  handleWorkplaceChange: (id: string) => void;
  workPlaceId: string;
  disabled?: boolean;
  required?: boolean;
};

export default function WorkplaceSelect({
  handleWorkplaceChange,
  workPlaceId,
  disabled = false,
  required = true,
}: WorkplaceSelectProps) {
  const ITEMS_PER_PAGE = 15;
  const DEBOUNCE_DELAY = 300;
  const SCROLL_THRESHOLD = 10;

  const [page, setPage] = useState(1);
  const [allWorkplaces, setAllWorkplaces] = useState<Workplace[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  // const [isSelectOpen, setIsSelectOpen] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  const scrollRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const {
    data: workPlacesResponse,
    isLoading,
    isFetching,
    error,
  } = useWorkPlaces(page, ITEMS_PER_PAGE, debouncedSearchTerm);

  // Reset pagination when search changes
  const resetPagination = useCallback(() => {
    setPage(1);
    setAllWorkplaces([]);
  }, []);

  useEffect(() => {
    resetPagination();
  }, [debouncedSearchTerm, resetPagination]);

  // Handle new data from API
  useEffect(() => {
    if (!workPlacesResponse?.workplaces) return;

    setAllWorkplaces((prev) => {
      if (page === 1) {
        return workPlacesResponse.workplaces;
      }

      // Merge new results, avoiding duplicates
      const existingIds = new Set(prev.map((wp) => wp.id));
      const newWorkplaces = workPlacesResponse.workplaces.filter(
        (wp) => !existingIds.has(wp.id)
      );

      return [...prev, ...newWorkplaces];
    });
  }, [workPlacesResponse, page]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current || !workPlacesResponse || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isNearBottom =
      scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD;
    const hasMorePages =
      workPlacesResponse.currentPage < workPlacesResponse.totalPages;

    if (isNearBottom && hasMorePages) {
      setPage((prev) => prev + 1);
    }
  }, [workPlacesResponse, isFetching]);

  // Clear search functionality
  const clearSearch = useCallback(() => {
    setSearchTerm("");
    setHasUserInteracted(true);
    searchInputRef.current?.focus();
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setHasUserInteracted(true);
    },
    []
  );

  const handleSelection = useCallback(
    (value: string) => {
      if (value.startsWith("__")) return;

      handleWorkplaceChange(value);
      // setIsSelectOpen(false)
    },
    [handleWorkplaceChange]
  );

  // Get selected workplace name for display
  const selectedWorkplaceName = useMemo(() => {
    if (!workPlaceId) return null;
    return allWorkplaces.find((wp) => wp.id === workPlaceId)?.name || null;
  }, [workPlaceId, allWorkplaces]);

  // Determine if we should show "no results" state
  const showNoResults = useMemo(() => {
    return (
      !isLoading &&
      hasUserInteracted &&
      allWorkplaces.length === 0 &&
      debouncedSearchTerm.length > 0
    );
  }, [isLoading, hasUserInteracted, allWorkplaces.length, debouncedSearchTerm]);

  const showError = error && hasUserInteracted;

  return (
    <div className="flex flex-col items-start gap-4">
      <Label
        htmlFor="workPlaceId"
        className={`text-left text-base ${disabled ? "opacity-50" : ""}`}
      >
        Lieu de travail {required && "(*)"}
      </Label>

      <div className="md:col-span-3 w-full space-y-2">
        {/* Enhanced search input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-background/35">
            <Search size={16} />
          </div>

          <input
            ref={searchInputRef}
            type="text"
            placeholder="Rechercher un lieu de travail..."
            value={searchTerm}
            onChange={handleSearchChange}
            disabled={disabled}
            className={`
              w-full pl-10 pr-10 py-2 border rounded border-background/35 text-base 
              placeholder:text-background/35 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-background/50"
              }
            `}
            onFocus={() => setHasUserInteracted(true)}
          />

          {searchTerm && !disabled && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-background/35 hover:text-background/70 transition-colors"
              type="button"
              aria-label="Effacer la recherche"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {showError && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={14} />
            <span>Erreur lors du chargement des lieux de travail</span>
          </div>
        )}

        <Select
          onValueChange={handleSelection}
          value={workPlaceId}
          disabled={disabled}
          // onOpenChange={setIsSelectOpen}
        >
          <SelectTrigger
            className={`
              w-full border border-background/35 rounded-lg data-[placeholder]:text-background/35
              transition-colors duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:border-background/50"
              }
            `}
          >
            <SelectValue placeholder="Sélectionner un lieu de travail">
              {selectedWorkplaceName || "Sélectionner un lieu de travail"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="max-h-60 overflow-auto"
            >
              {/* Initial loading state */}
              {isLoading && page === 1 && (
                <SelectItem value="__loading" disabled>
                  <div className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Chargement...</span>
                  </div>
                </SelectItem>
              )}

              {showNoResults && (
                <SelectItem value="__no-results" disabled>
                  <div className="flex items-center gap-2 text-background/70">
                    <AlertCircle size={14} />
                    <span>Aucun résultat pour "{debouncedSearchTerm}"</span>
                  </div>
                </SelectItem>
              )}

              {allWorkplaces.map((workplace) => (
                <SelectItem
                  key={workplace.id}
                  value={workplace.id}
                  className="cursor-pointer hover:bg-background/10 transition-colors"
                >
                  <span className="truncate" title={workplace.name}>
                    {workplace.name}
                  </span>
                </SelectItem>
              ))}

              {isFetching &&
                workPlacesResponse &&
                workPlacesResponse.currentPage <
                  workPlacesResponse.totalPages && (
                  <SelectItem value="__fetching" disabled>
                    <div className="flex items-center gap-2 text-background/70">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Chargement de plus d'éléments...</span>
                    </div>
                  </SelectItem>
                )}

              {/* End of results indicator */}
              {!isFetching &&
                allWorkplaces.length > 0 &&
                workPlacesResponse &&
                workPlacesResponse?.currentPage ===
                  workPlacesResponse?.totalPages &&
                workPlacesResponse.totalPages > 1 && (
                  <div className="px-2 py-1 text-xs text-background/50 text-center border-t">
                    {allWorkplaces.length} lieu
                    {allWorkplaces.length > 1 ? "x" : ""} trouvé
                    {allWorkplaces.length > 1 ? "s" : ""}
                  </div>
                )}
            </div>
          </SelectContent>
        </Select>

        {/* Helper text */}
        {hasUserInteracted &&
          searchTerm &&
          !isLoading &&
          allWorkplaces.length > 0 && (
            <p className="text-xs text-background/60">
              {allWorkplaces.length} résultat
              {allWorkplaces.length > 1 ? "s" : ""} trouvé
              {allWorkplaces.length > 1 ? "s" : ""}
              {workPlacesResponse?.totalPages &&
                workPlacesResponse.totalPages > 1 &&
                ` • Page ${workPlacesResponse.currentPage} sur ${workPlacesResponse.totalPages}`}
            </p>
          )}
      </div>
    </div>
  );
}
