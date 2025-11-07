'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"

interface YearSelectorProps {
  years: Array<{ id: number; year_label: string; is_active: boolean }>
  currentYear?: string
}

export function YearSelector({ years, currentYear }: YearSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', year)
    router.push(`?${params.toString()}`)
  }

  // If no currentYear provided, use the active year or the most recent year
  const defaultYear = currentYear ||
    years.find(y => y.is_active)?.year_label ||
    years[0]?.year_label ||
    '2022-2023'

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-muted-foreground" />
      <Select value={defaultYear} onValueChange={handleYearChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select academic year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((year) => (
            <SelectItem key={year.id} value={year.year_label}>
              {year.year_label}
              {year.is_active && " (Active)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
