"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlatformWidgets } from "./platform-widgets"
import { UpcomingPosts } from "./upcoming-posts"

const clients = [
  { id: "all", name: "All Clients" },
  { id: "client1", name: "Client 1" },
  { id: "client2", name: "Client 2" },
  { id: "client3", name: "Client 3" },
]

export function ClientDashboard() {
  const [selectedClient, setSelectedClient] = useState("all")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <PlatformWidgets clientId={selectedClient} />
      <UpcomingPosts clientId={selectedClient} />
    </div>
  )
}

