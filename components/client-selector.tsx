"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"

interface Client {
  id: string
  name: string
}

export function ClientSelector({
  onClientChange,
  clients,
  selectedClient,
}: {
  onClientChange: (clientId: string) => void
  clients: { id: string; name: string }[]
  selectedClient: string
}) {
  // Remove this line:
  // const [selectedClient, setSelectedClient] = useState("all")

  const handleClientChange = (value: string) => {
    onClientChange(value)
  }

  return (
    <Select value={selectedClient} onValueChange={handleClientChange}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select client" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Clients</SelectItem>
        {clients.map((client) => (
          <SelectItem key={client.id} value={client.id}>
            {client.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

