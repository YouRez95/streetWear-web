import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDebounce } from "@uidotdev/usehooks";
import { SearchIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface SelectOption {
  id: string;
  name: string;
  type?: string;
  [key: string]: any;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  searchPlaceholder?: string;
  showType?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select...",
  className = "w-[200px]",
  searchPlaceholder = "Search...",
  showType = false,
  disabled = false,
}: SearchableSelectProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search term
  const filteredOptions = useMemo(() => {
    if (!debouncedSearchTerm) return options;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(searchLower) ||
        (option.type && option.type.toLowerCase().includes(searchLower))
    );
  }, [options, debouncedSearchTerm]);

  // Maintain focus when options change
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [filteredOptions, isOpen]); // Re-focus when filtered options change

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchTerm(""); // Reset search when closing
    }
  };

  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger
        className={`border-background/35 border rounded-md p-3 data-[placeholder]:text-background/35 ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {/* Search Input */}
        <div className="p-2 sticky top-0 z-10 border-b bg-popover">
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-background/35" />
            <Input
              ref={inputRef}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-background/35"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                // Prevent the select from closing when pressing escape on the input
                if (e.key === "Escape") {
                  e.stopPropagation();
                }
              }}
            />
          </div>
        </div>

        {/* Options List */}
        <div className="max-h-[250px] overflow-y-auto py-3">
          {filteredOptions.length === 0 ? (
            <div className="p-2 text-center text-background/35 text-sm">
              No results found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <SelectItem
                key={option.id}
                value={option.id}
                className="cursor-pointer"
              >
                {option.name}
                {showType && option.type && ` (${option.type})`}
              </SelectItem>
            ))
          )}
        </div>
      </SelectContent>
    </Select>
  );
}
