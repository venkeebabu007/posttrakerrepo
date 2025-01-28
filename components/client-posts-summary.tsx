import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const clientData = [
  { name: "Acme Corp", weeklyScheduled: 15, weeklyDone: 13, monthlyScheduled: 60, monthlyDone: 55 },
  { name: "Globex Inc", weeklyScheduled: 12, weeklyDone: 10, monthlyScheduled: 48, monthlyDone: 45 },
  { name: "Soylent Corp", weeklyScheduled: 18, weeklyDone: 16, monthlyScheduled: 72, monthlyDone: 68 },
]

export function ClientPostsSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Posts Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Weekly Scheduled</TableHead>
              <TableHead>Weekly Done</TableHead>
              <TableHead>Monthly Scheduled</TableHead>
              <TableHead>Monthly Done</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientData.map((client) => (
              <TableRow key={client.name}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.weeklyScheduled}</TableCell>
                <TableCell>{client.weeklyDone}</TableCell>
                <TableCell>{client.monthlyScheduled}</TableCell>
                <TableCell>{client.monthlyDone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

