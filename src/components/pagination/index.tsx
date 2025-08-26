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
  const paginationPages = getPaginationPages(page, totalPages);
  const limitItems = [10, 20, 50, 100];
  return (
    <Pagination className="h-full relative">
      <Select
        value={limit.toString()}
        onValueChange={(value) => setLimit(Number(value))}
        defaultValue={limit.toString()}
      >
        <SelectTrigger className="absolute left-10 top-[50%] translate-y-[-50%] w-20 h-8  border-background/50 border rounded-md p-3 data-[placeholder]:text-background bg-foreground">
          <SelectValue placeholder="limit" className="" />
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
            className="cursor-pointer text-base hover:bg-secondary/10"
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
            className="cursor-pointer text-base hover:bg-secondary/10"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
