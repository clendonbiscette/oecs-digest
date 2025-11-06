"use client"

import { useState, useMemo } from "react"
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

type SortDirection = "asc" | "desc" | null

interface Column<T> {
  key: string
  header: string
  accessor: (row: T) => any
  sortable?: boolean
  align?: "left" | "right" | "center"
  render?: (value: any, row: T) => React.ReactNode
}

interface SortableTableProps<T> {
  data: T[]
  columns: Column<T>[]
  className?: string
}

export function SortableTable<T>({ data, columns, className = "" }: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data

    const column = columns.find(col => col.key === sortKey)
    if (!column) return data

    return [...data].sort((a, b) => {
      const aValue = column.accessor(a)
      const bValue = column.accessor(b)

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1

      // Compare values
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      // String comparison
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()

      if (sortDirection === "asc") {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })
  }, [data, sortKey, sortDirection, columns])

  // Handle column header click
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column || column.sortable === false) return

    if (sortKey === columnKey) {
      // Cycle through: asc -> desc -> null
      if (sortDirection === "asc") {
        setSortDirection("desc")
      } else if (sortDirection === "desc") {
        setSortDirection(null)
        setSortKey(null)
      }
    } else {
      setSortKey(columnKey)
      setSortDirection("asc")
    }
  }

  // Render sort icon
  const renderSortIcon = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey)
    if (!column || column.sortable === false) return null

    if (sortKey === columnKey) {
      if (sortDirection === "asc") {
        return <ArrowUp className="h-3 w-3 ml-1 inline" />
      } else if (sortDirection === "desc") {
        return <ArrowDown className="h-3 w-3 ml-1 inline" />
      }
    }
    return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-40" />
  }

  const getAlignClass = (align?: "left" | "right" | "center") => {
    switch (align) {
      case "right": return "text-right"
      case "center": return "text-center"
      default: return "text-left"
    }
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`p-2 ${getAlignClass(column.align)} ${
                  column.sortable !== false ? "cursor-pointer hover:bg-muted/50 select-none" : ""
                }`}
                onClick={() => handleSort(column.key)}
              >
                <div className={`flex items-center ${
                  column.align === "right" ? "justify-end" :
                  column.align === "center" ? "justify-center" : ""
                }`}>
                  {column.header}
                  {renderSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, idx) => (
            <tr key={idx} className="border-b hover:bg-muted/50">
              {columns.map((column) => {
                const value = column.accessor(row)
                return (
                  <td key={column.key} className={`p-2 ${getAlignClass(column.align)}`}>
                    {column.render ? column.render(value, row) : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
