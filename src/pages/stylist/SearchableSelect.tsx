import { Input } from "@/components/ui/input";
import { useDebounce } from "@uidotdev/usehooks";
import { ChevronDown, SearchIcon } from "lucide-react";
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
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearchTerm) return options;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return options.filter(
      (option) =>
        option.name.toLowerCase().includes(searchLower) ||
        (option.type && option.type.toLowerCase().includes(searchLower))
    );
  }, [options, debouncedSearchTerm]);

  const selectedOption = options.find((opt) => opt.id === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (optionId: string) => {
    onValueChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border border-background/50 rounded-md p-1.5 text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed ${
          !selectedOption ? "text-background/35" : ""
        }`}
      >
        <span>{selectedOption?.name || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-background/35" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-background/50 rounded-md shadow-lg z-50 max-h-80 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-background/20">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-background/35" />
              <Input
                ref={inputRef}
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-background/35 border-0"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setIsOpen(false);
                  }
                }}
              />
            </div>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-background/35 text-sm">
                No results found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-background/10 transition-colors ${
                    option.id === value ? "bg-background/20" : ""
                  }`}
                >
                  {option.name}
                  {showType && option.type && ` (${option.type})`}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
