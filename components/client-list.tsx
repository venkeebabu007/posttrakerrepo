"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const clients = [
  { id: 1, name: "Acme Corp" },
  { id: 2, name: "Globex Inc" },
  { id: 3, name: "Soylent Corp" },
]

export function ClientList() {
  const [selectedClient, setSelectedClient] = useState<number | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {clients.map((client) => (
            <Button
              key={client.id}
              variant={selectedClient === client.id ? "default" : "outline"}
              className="w-full justify-start"
              onClick={() => setSelectedClient(client.id)}
            >
              {client.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

