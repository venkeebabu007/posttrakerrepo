import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const allClientsData = [
  { name: "Mon", scheduled: 12, done: 10 },
  { name: "Tue", scheduled: 15, done: 13 },
  { name: "Wed", scheduled: 18, done: 15 },
  { name: "Thu", scheduled: 14, done: 12 },
  { name: "Fri", scheduled: 16, done: 14 },
  { name: "Sat", scheduled: 10, done: 8 },
  { name: "Sun", scheduled: 8, done: 7 },
]

const clientSpecificData = {
  acme: [
    { name: "Mon", scheduled: 4, done: 3 },
    { name: "Tue", scheduled: 5, done: 4 },
    { name: "Wed", scheduled: 6, done: 5 },
    { name: "Thu", scheduled: 4, done: 4 },
    { name: "Fri", scheduled: 5, done: 3 },
    { name: "Sat", scheduled: 3, done: 2 },
    { name: "Sun", scheduled: 2, done: 2 },
  ],
  globex: [
    { name: "Mon", scheduled: 3, done: 3 },
    { name: "Tue", scheduled: 4, done: 4 },
    { name: "Wed", scheduled: 5, done: 4 },
    { name: "Thu", scheduled: 4, done: 3 },
    { name: "Fri", scheduled: 4, done: 4 },
    { name: "Sat", scheduled: 3, done: 3 },
    { name: "Sun", scheduled: 2, done: 2 },
  ],
  soylent: [
    { name: "Mon", scheduled: 5, done: 4 },
    { name: "Tue", scheduled: 6, done: 5 },
    { name: "Wed", scheduled: 7, done: 6 },
    { name: "Thu", scheduled: 6, done: 5 },
    { name: "Fri", scheduled: 7, done: 7 },
    { name: "Sat", scheduled: 4, done: 3 },
    { name: "Sun", scheduled: 4, done: 3 },
  ],
}

export function WeeklyPostsSummary({ clientId }: { clientId: string }) {
  const data =
    clientId === "all"
      ? allClientsData
      : clientSpecificData[clientId as keyof typeof clientSpecificData] || allClientsData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Posts Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="scheduled" fill="#8884d8" name="Scheduled" />
            <Bar dataKey="done" fill="#82ca9d" name="Done" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

