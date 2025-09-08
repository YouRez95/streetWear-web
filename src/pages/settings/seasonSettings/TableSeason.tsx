import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PaginationComponent } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSeasons } from "@/hooks/useSeason";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/userStore";
import { useDebounce } from "@uidotdev/usehooks";
import {
  ArrowDownSquare,
  ArrowRightSquare,
  ArrowUpSquare,
  DoorClosed,
  DoorOpen,
  PencilIcon,
  Settings,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteSeasonDialog } from "./DeleteSeasonDialog";
import { ToggleSeasonDialog } from "./ToggleSeasonDialog";
import UpdateSeasonDialog from "./UpdateSeasonDialog";
import type { SeasonData } from "@/types/models";

type TableSeasonProps = {
  searchTerm: string;
};

export default function TableSeason({ searchTerm }: TableSeasonProps) {
  const { activeSeason, setActiveSeason, userData } = useUserStore();
  const [selectedSeason, setSelectedSeason] = useState<SeasonData | null>(null);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<
    "update" | "delete" | "toggle" | null
  >(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const {
    data: seasonsData,
    isLoading,
    error,
  } = useSeasons(page, limit, debouncedSearchTerm);

  useEffect(() => {
    if (seasonsData?.totalPages) {
      setTotalPages(seasonsData.totalPages);
    }
  }, [seasonsData]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const openDialog = (season: SeasonData, type: typeof dialogType) => {
    setSelectedSeason(season);
    setDialogType(type);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    setSelectedSeason(null);
    setDialogType(null);
  };

  if (isLoading) return <p className="text-background/50">Chargement...</p>;

  if (error || seasonsData?.status === "failed")
    return (
      <p className="text-background/50">
        Erreur lors de la récupération des saisons
      </p>
    );
  return (
    <div className="h-full flex flex-col">
      {seasonsData && seasonsData.seasons.length === 0 && (
        <p className="text-background/50 w-full text-center my-10">
          Aucune saison trouvée, créez une pour commencer.
        </p>
      )}

      {seasonsData && seasonsData.seasons && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full p-7">
          {seasonsData.seasons.map((season, index) => (
            <Card
              key={season.id}
              className="w-full h-fit rounded-xl overflow-hidden hover:shadow-xl transition-all py-0"
            >
              <CardHeader
                className={cn(
                  `relative space-y-4 h-[180px] flex flex-col justify-between pt-5`,
                  index % 2 === 0 ? "bg-background/80" : "bg-secondary/80"
                )}
              >
                <CardTitle className="text-lg font-bagel text-foreground flex items-center">
                  <span className="truncate mr-2">
                    {season.name.toUpperCase()}
                  </span>
                  <Switch
                    checked={season.id === activeSeason?.id}
                    className={cn(
                      "cursor-pointer",
                      index % 2 === 0
                        ? "data-[state=checked]:bg-background"
                        : "data-[state=checked]:bg-secondary"
                    )}
                    onCheckedChange={() => setActiveSeason(season)}
                  />
                </CardTitle>
                <CardDescription className="text-base font-medium text-foreground/70 space-y-2">
                  <p className="line-clamp-2">
                    {season.description
                      ? season.description
                      : "Aucune description trouvée"}
                  </p>
                  {season.summary.type && (
                    <p className="flex items-center gap-1">
                      {season.summary.type === "down" ? (
                        <ArrowDownSquare className="inline-block text-foreground/50 h-5 w-5" />
                      ) : season.summary.type === "up" ? (
                        <ArrowUpSquare className="inline-block text-foreground/50 h-5 w-5" />
                      ) : (
                        <ArrowRightSquare className="inline-block text-foreground/50 h-5 w-5" />
                      )}
                      <span className="text-sm">
                        {season.summary.percentage} par rapport à la saison
                        précédente
                      </span>
                    </p>
                  )}
                </CardDescription>
                {userData?.role === "super admin" && (
                  <Popover>
                    <PopoverTrigger
                      asChild
                      className="absolute right-2 top-2 gap-2 flex cursor-pointer"
                    >
                      <Button
                        variant="ghost"
                        className="bg-foreground hover:bg-transparent hover:text-foreground border-foreground border p-2 h-8 w-8"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      className="flex flex-col w-fit min-w-52 p-0"
                    >
                      <Button
                        variant={"ghost"}
                        onClick={() => openDialog(season, "update")}
                        className="m-1 p-1 hover:bg-slate-300 hover:text-primary flex justify-start items-center gap-2 "
                      >
                        <PencilIcon className="h-4 w-4" />
                        Modifier Saison
                      </Button>
                      {season.isClosed && (
                        <Button
                          onClick={() => openDialog(season, "toggle")}
                          variant={"ghost"}
                          className="m-1 p-1 hover:bg-slate-300 hover:text-primary justify-start flex items-center gap-2 "
                        >
                          {/* < className="h-4 w-4" /> */}
                          <DoorOpen className="h-4 w-4" />
                          Ouvrir Saison
                        </Button>
                      )}

                      {!season.isClosed && (
                        <Button
                          onClick={() => openDialog(season, "toggle")}
                          variant={"ghost"}
                          className="m-1 p-1 hover:bg-slate-300 hover:text-primary justify-start flex items-center gap-2 "
                        >
                          <DoorClosed className="h-4 w-4" />
                          Fermer Saison
                        </Button>
                      )}
                      <Button
                        onClick={() => openDialog(season, "delete")}
                        variant={"ghost"}
                        className="m-1 p-1 hover:bg-slate-300 hover:text-primary justify-start flex items-center gap-2 "
                      >
                        <Trash2Icon className="h-4 w-4" />
                        Supprimer Saison
                      </Button>
                    </PopoverContent>
                  </Popover>
                )}
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 text-sm font-semibold">
                  <div className="flex flex-col items-center justify-center text-primary py-4 border-r">
                    <p>Produits</p>
                    <span>{season.products.totalProducts}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-secondary py-4 border-r">
                    <p>Achats</p>
                    <span>{season.products.totalClient}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center text-destructive py-4">
                    <p>Stock</p>
                    <span>{season.products.totalStock}</span>
                  </div>
                </div>
                <div
                  className={cn(
                    "py-2 flex flex-col items-center text-base justify-center text-primary-foreground font-bold",
                    season.isClosed ? "bg-red-500" : "bg-green-500"
                  )}
                >
                  <p className="text-xs">
                    {season.isClosed ? "Saison fermée" : "Saison ouverte"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
          {open && selectedSeason && dialogType === "update" && (
            <UpdateSeasonDialog
              open={open}
              closeDialog={closeDialog}
              season={selectedSeason}
            />
          )}
          {open && selectedSeason && dialogType === "delete" && (
            <DeleteSeasonDialog
              open={open}
              closeDialog={closeDialog}
              seasonId={selectedSeason.id}
              seasonName={selectedSeason.name}
            />
          )}
          {open && selectedSeason && dialogType === "toggle" && (
            <ToggleSeasonDialog
              open={open}
              closeDialog={closeDialog}
              seasonId={selectedSeason.id}
              seasonName={selectedSeason.name}
              isClosed={selectedSeason.isClosed}
            />
          )}
        </div>
      )}
      <div className="h-16 bg-muted-foreground sticky bottom-0 shrink-0 mt-auto w-full">
        <PaginationComponent
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          limit={limit}
          setLimit={setLimit}
        />
      </div>
    </div>
  );
}
