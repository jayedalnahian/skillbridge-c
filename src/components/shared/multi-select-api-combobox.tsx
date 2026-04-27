"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface ApiResponse<T> {
  data: T[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface MultiSelectApiComboboxProps<T> {
  fetcher: (searchTerm: string) => Promise<ApiResponse<T>>
  placeholder?: string
  onSelectionChange: (selectedItems: T[]) => void
  displayKey: keyof T
  valueKey: keyof T
  className?: string
  disabled?: boolean
  maxHeight?: string
}

export function MultiSelectApiCombobox<T extends Record<string, any>>({
  fetcher,
  placeholder = "Select items...",
  onSelectionChange,
  displayKey,
  valueKey,
  className,
  disabled = false,
  maxHeight = "300px",
}: MultiSelectApiComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [suggestions, setSuggestions] = React.useState<T[]>([])
  const [selectedItems, setSelectedItems] = React.useState<T[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Debounced search effect
  React.useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      fetchSuggestions(searchTerm)
    }, 400) // 400ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, open, fetcher])

  const fetchSuggestions = async (term: string) => {
    setIsLoading(true)
    try {
      const response = await fetcher(term)
      setSuggestions(response.data)
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSelection = (item: T) => {
    const itemValue = item[valueKey]
    const isSelected = selectedItems.some(
      (selected) => selected[valueKey] === itemValue
    )

    let newSelection: T[]
    if (isSelected) {
      newSelection = selectedItems.filter(
        (selected) => selected[valueKey] !== itemValue
      )
    } else {
      newSelection = [...selectedItems, item]
    }

    setSelectedItems(newSelection)
    onSelectionChange(newSelection)
  }

  const removeItem = (itemToRemove: T) => {
    const newSelection = selectedItems.filter(
      (item) => item[valueKey] !== itemToRemove[valueKey]
    )
    setSelectedItems(newSelection)
    onSelectionChange(newSelection)
  }

  const clearAll = () => {
    setSelectedItems([])
    onSelectionChange([])
  }

  const isSelected = (item: T) => {
    return selectedItems.some((selected) => selected[valueKey] === item[valueKey])
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* Selected items display */}
      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedItems.map((item) => (
            <Badge
              key={String(item[valueKey])}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {String(item[displayKey])}
              <button
                type="button"
                onClick={() => removeItem(item)}
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {String(item[displayKey])}</span>
              </button>
            </Badge>
          ))}
          {selectedItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="h-5 px-2 text-xs"
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Combobox */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between",
              !selectedItems.length && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {selectedItems.length > 0
                ? `${selectedItems.length} selected`
                : placeholder}
            </span>
            {isLoading ? (
              <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
            ) : (
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type to search..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList style={{ maxHeight }}>
              {isLoading ? (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    {searchTerm
                      ? "No results found."
                      : "Type to search..."}
                  </CommandEmpty>
                  <CommandGroup>
                    {suggestions.map((item) => {
                      const selected = isSelected(item)
                      return (
                        <CommandItem
                          key={String(item[valueKey])}
                          onSelect={() => toggleSelection(item)}
                          className="flex items-center gap-2"
                        >
                          <Checkbox
                            checked={selected}
                            className="pointer-events-none"
                          />
                          <span className="flex-1">
                            {String(item[displayKey])}
                          </span>
                          {selected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
