import { ClientManagement } from "@/components/client-management"

export default function ClientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Client Management</h1>
      <ClientManagement />
    </div>
  )
}

