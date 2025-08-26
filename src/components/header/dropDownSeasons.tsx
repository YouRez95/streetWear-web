import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store/userStore";
import { useSeasons } from "@/hooks/useSeason";
import type { FullSeasonData } from "@/types/models";
import { cn } from "@/lib/utils";

export default function DropDownSeasons() {
  const { data, isLoading } = useSeasons(1, 4, "");
  const { activeSeason, seasons, setActiveSeason, updateSeasons } =
    useUserStore();

  useEffect(() => {
    if (data?.seasons && data.status === "success") {
      updateSeasons(data.seasons);
      setActiveSeason(data.seasons[0]);
    }
  }, [data]);

  const handleUpdateSeason = (season: FullSeasonData) => {
    if (activeSeason?.id !== season.id) {
      setActiveSeason(season);
    }
  };

  if (isLoading) return <p className="text-background/50">Loading...</p>;
  if (!isLoading && !seasons.length)
    return <p className="text-background/50">No seasons found</p>;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="flex items-center justify-between"
      >
        <Button
          className="text-white font-bagel rounded-lg flex w-[200px] items-center justify-between text-base py-5 px-4"
          variant="secondary"
        >
          {activeSeason?.name.toUpperCase().slice(0, 15)}
          <ChevronDown className="h-4 w-4 text-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="text-center w-[200px]">
        <DropdownMenuLabel className="text-base">Seasons</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {seasons.map((season) => (
          <DropdownMenuItem
            key={season.id}
            className={cn(
              "flex items-center justify-center cursor-pointer text-background text-base hover:bg-none focus:bg-transparent focus:text-inherit",
              activeSeason?.id === season.id
                ? "bg-secondary focus:bg-secondary text-foreground focus:text-foreground"
                : "focus:bg-secondary/20"
            )}
            onClick={() => handleUpdateSeason(season)}
          >
            <Check
              className={cn(
                "h-4 w-4",
                activeSeason?.id === season.id ? "text-foreground" : "hidden"
              )}
            />
            {season.name.toUpperCase()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
