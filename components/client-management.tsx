"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/utils/supabase/client"

interface Client {
  id: string
  name: string
  user_id: string
}

// Predefined user ID for new client submissions
const PREDEFINED_USER_ID = "58d6e98b-5277-4ae2-b392-85c63cb9ab78"

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([])
  const [newClientName, setNewClientName] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    const { data, error } = await createClient().from("clients").select("*").order("name")
    if (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: "Error",
        description: "Failed to fetch clients. Please try again.",
        variant: "destructive",
      })
    } else {
      setClients(data || [])
    }
    setLoading(false)
  }

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClientName.trim()) return

    const { data, error } = await createClient()
      .from("clients")
      .insert({ name: newClientName, user_id: PREDEFINED_USER_ID })
      .select()

    if (error) {
      console.error("Error adding client:", error)
      toast({
        title: "Failed to add client",
        description: error.message,
        variant: "destructive",
      })
    } else if (data) {
      setClients([...clients, data[0]])
      setNewClientName("")
      toast({ title: "Client added successfully" })
    }
  }

  if (loading) {
    return <div>Loading clients...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Client Management</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addClient} className="mb-6">
          <div className="flex items-center space-x-2">
            <Input
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Enter new client name"
            />
            <Button type="submit">Add Client</Button>
          </div>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>User ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.user_id}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

