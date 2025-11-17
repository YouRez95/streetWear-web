import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type SearchableDropdownProps<T> = {
  items: T[];
  selectedItem: T | undefined;
  onSelect: (item: T) => void;
  placeholder?: string;
  displayValue: (item: T) => string;
  displayLabel?: (item: T) => React.ReactNode;
  searchFields: (keyof T)[];
  className?: string;
  disabled?: boolean;
  placeholderInput?: string;
};

export default function SearchableDropdown<T extends { id: string }>({
  items,
  selectedItem,
  onSelect,
  placeholder = "Sélectionner",
  displayValue,
  displayLabel,
  searchFields,
  className = "",
  disabled = false,
  placeholderInput = "Entrer le numéro de bon",
}: SearchableDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return searchFields.some((field) => {
      const value = item[field];
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchLower);
      }
      if (typeof value === "number") {
        return value.toString().includes(searchQuery);
      }
      return false;
    });
  });

  const handleSelect = (item: T) => {
    onSelect(item);
    setIsOpen(false);
    setSearchQuery("");
  };

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (isOpen) {
        setSearchQuery("");
      }
    }
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className="w-full border border-background/50 text-[14px] flex justify-between items-center p-2 rounded-md bg-foreground text-background disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="truncate">
          {selectedItem ? displayValue(selectedItem) : placeholder}
        </span>
        <ChevronDown
          className={`h-4 w-4 transition-transform flex-shrink-0 ml-2 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-foreground border border-background/50 rounded-md mt-1 z-50 shadow-lg">
          {/* Search Input */}
          <div className="p-2 border-b border-background/20">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-background/50" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={placeholderInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 text-sm border-background/30 placeholder:text-background/30"
              />
            </div>
          </div>

          {/* Items List */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="p-3 text-background/70 text-sm text-center">
                Aucun résultat trouvé
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-2 hover:bg-background/10 cursor-pointer text-sm transition-colors"
                  onClick={() => handleSelect(item)}
                >
                  {displayLabel ? displayLabel(item) : displayValue(item)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
