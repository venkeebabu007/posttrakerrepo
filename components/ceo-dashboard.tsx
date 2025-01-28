"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const initialData = [
  { name: "Acme Corp", scheduled: 4, done: 10 },
  { name: "Globex Inc", scheduled: 3, done: 7 },
  { name: "Soylent Corp", scheduled: 5, done: 8 },
]

export function CEODashboard() {
  const [data, setData] = useState(initialData)
  const [selectedClient, setSelectedClient] = useState("all")
  const [selectedSchedule, setSelectedSchedule] = useState("daily")

  useEffect(() => {
    // In a real application, you would fetch data based on the selected client and schedule
    // For this example, we'll just filter the initial data
    const filteredData =
      selectedClient === "all"
        ? initialData
        : initialData.filter((item) => item.name.toLowerCase().replace(" ", "") === selectedClient)

    // Simulate different data for different schedules
    const multiplier = selectedSchedule === "weekly" ? 7 : selectedSchedule === "monthly" ? 30 : 1
    const adjustedData = filteredData.map((item) => ({
      ...item,
      scheduled: item.scheduled * multiplier,
      done: item.done * multiplier,
    }))

    setData(adjustedData)
  }, [selectedClient, selectedSchedule])

  return (
    <Card>
      <CardHeader>
        <CardTitle>CEO Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="scheduled" fill="#8884d8" />
            <Bar dataKey="done" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

