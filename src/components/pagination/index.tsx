import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { getPaginationPages } from "@/lib/utils";
import { useMediaQuery } from "@uidotdev/usehooks";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationComponentProps = {
  page: number;
  setPage: (page: number) => void;
  totalPages: number;
  limit: number;
  setLimit: (limit: number) => void;
};

export const PaginationComponent = ({
  page,
  setPage,
  totalPages,
  limit,
  setLimit,
}: PaginationComponentProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const paginationPages = getPaginationPages(page, totalPages);
  const limitItems = [50, 100, 150, 200];

  if (isMobile) {
    return (
      <div className="h-full flex items-center justify-between px-4 gap-3">
        {/* Limit selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-background/80 whitespace-nowrap">
            Lignes:
          </span>
          <Select
            value={limit.toString()}
            onValueChange={(value) => setLimit(Number(value))}
            defaultValue={limit.toString()}
          >
            <SelectTrigger className="w-16 h-9 border-background/50 border rounded-md data-[placeholder]:text-background bg-foreground text-sm">
              <SelectValue placeholder="limit" />
            </SelectTrigger>
            <SelectContent>
              {limitItems.map((item) => (
                <SelectItem key={item} value={item.toString()}>
                  {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page info and navigation */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-background/80 whitespace-nowrap">
            Page {page} / {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-md border border-background/50 bg-foreground transition-colors",
                page === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary/10 active:bg-secondary/20"
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-md border border-background/50 bg-foreground transition-colors",
                page === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-secondary/10 active:bg-secondary/20"
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <Pagination className="h-full relative">
      <Select
        value={limit.toString()}
        onValueChange={(value) => setLimit(Number(value))}
        defaultValue={limit.toString()}
      >
        <SelectTrigger className="absolute left-10 top-[50%] translate-y-[-50%] w-20 h-8 border-background/50 border rounded-md p-3 data-[placeholder]:text-background bg-foreground">
          <SelectValue placeholder="limit" />
        </SelectTrigger>
        <SelectContent>
          {limitItems.map((item) => (
            <SelectItem key={item} value={item.toString()}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => setPage(Math.max(1, page - 1))}
            className={cn(
              "cursor-pointer text-base hover:bg-secondary/10",
              page === 1 && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          />
        </PaginationItem>

        {paginationPages.map((p, i) => (
          <PaginationItem key={i}>
            {p === "ellipsis" ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                onClick={() => setPage(p)}
                aria-current={page === p ? "page" : undefined}
                className={cn(
                  "cursor-pointer border text-base hover:bg-secondary/10 hover:font-semibold",
                  page === p &&
                    "bg-secondary/90 hover:bg-secondary/90 hover:text-foreground text-foreground font-semibold"
                )}
              >
                {p}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            className={cn(
              "cursor-pointer text-base hover:bg-secondary/10",
              page === totalPages &&
                "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
