"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const scheduleOptions = [
  { id: "daily", name: "Daily" },
  { id: "weekly", name: "Weekly" },
  { id: "monthly", name: "Monthly" },
]

export function ScheduleSelector() {
  const [selectedSchedule, setSelectedSchedule] = useState("daily")

  return (
    <Select value={selectedSchedule} onValueChange={setSelectedSchedule}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select schedule" />
      </SelectTrigger>
      <SelectContent>
        {scheduleOptions.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

