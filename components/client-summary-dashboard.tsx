"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Post {
  id: string
  client_id: string
  platform: string
  media_type: string
  content: string
  status: string
  scheduled_time: string
  clients: {
    name: string
  }
}

interface ClientSummary {
  id: string
  name: string
  totalPosts: number
  scheduledPosts: number
  donePosts: number
}

interface ClientSummaryDashboardProps {
  posts: Post[]
}

export function ClientSummaryDashboard({ posts }: ClientSummaryDashboardProps) {
  const clientSummaries: ClientSummary[] = posts.reduce((summaries, post) => {
    const clientIndex = summaries.findIndex((summary) => summary.id === post.client_id)
    if (clientIndex === -1) {
      summaries.push({
        id: post.client_id,
        name: post.clients.name,
        totalPosts: 1,
        scheduledPosts: post.status === "scheduled" ? 1 : 0,
        donePosts: post.status === "done" ? 1 : 0,
      })
    } else {
      summaries[clientIndex].totalPosts++
      if (post.status === "scheduled") {
        summaries[clientIndex].scheduledPosts++
      } else if (post.status === "done") {
        summaries[clientIndex].donePosts++
      }
    }
    return summaries
  }, [] as ClientSummary[])

  const totalSummary = clientSummaries.reduce(
    (total, client) => {
      total.totalPosts += client.totalPosts
      total.scheduledPosts += client.scheduledPosts
      total.donePosts += client.donePosts
      return total
    },
    { totalPosts: 0, scheduledPosts: 0, donePosts: 0 },
  )

  return (
    <Card className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardTitle className="text-2xl font-bold">Client Summary Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-200 dark:bg-purple-800">
              <TableHead className="font-bold text-purple-800 dark:text-purple-200">Client</TableHead>
              <TableHead className="font-bold text-purple-800 dark:text-purple-200">Total Posts</TableHead>
              <TableHead className="font-bold text-purple-800 dark:text-purple-200">Scheduled Posts</TableHead>
              <TableHead className="font-bold text-purple-800 dark:text-purple-200">Done Posts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientSummaries.map((client, index) => (
              <TableRow
                key={client.id}
                className={index % 2 === 0 ? "bg-pink-50 dark:bg-pink-900" : "bg-purple-50 dark:bg-purple-900"}
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.totalPosts}</TableCell>
                <TableCell className="text-blue-600 dark:text-blue-400">{client.scheduledPosts}</TableCell>
                <TableCell className="text-green-600 dark:text-green-400">{client.donePosts}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-gradient-to-r from-purple-300 to-pink-300 dark:from-purple-700 dark:to-pink-700 font-bold">
              <TableCell>Total</TableCell>
              <TableCell>{totalSummary.totalPosts}</TableCell>
              <TableCell className="text-blue-700 dark:text-blue-300">{totalSummary.scheduledPosts}</TableCell>
              <TableCell className="text-green-700 dark:text-green-300">{totalSummary.donePosts}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

