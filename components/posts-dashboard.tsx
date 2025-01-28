"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/utils/supabase/client"

interface Post {
  id: string
  client_id: string
  platform_id: string
  media_type_id: string
  content: string
  status: string
  scheduled_time: string
  clients?: {
    name: string
  }
  platforms?: {
    name: string
  }
  media_types?: {
    name: string
  }
}

interface PostsDashboardProps {
  posts: Post[]
  onPostUpdated: (updatedPost: Post) => void
  clientId: string
}

export function PostsDashboard({ posts, onPostUpdated, clientId }: PostsDashboardProps) {
  const [dateRange, setDateRange] = useState("all")

  const filterPosts = () => {
    const now = new Date()
    const startDate = new Date()
    if (dateRange === "week") {
      startDate.setDate(now.getDate() - 7)
    } else if (dateRange === "month") {
      startDate.setMonth(now.getMonth() - 1)
    } else if (dateRange === "quarter") {
      startDate.setMonth(now.getMonth() - 3)
    }

    return posts.filter((post) => {
      const postDate = new Date(post.scheduled_time)
      return (
        (dateRange === "all" || (postDate >= startDate && postDate <= now)) &&
        (clientId === "all" || post.client_id === clientId)
      )
    })
  }

  const filteredPosts = filterPosts()

  console.log("Filtered posts:", filteredPosts)

  const handleStatusUpdate = async (postId: string, newStatus: string) => {
    console.log("Updating post status:", postId, newStatus)
    const { data, error } = await createClient()
      .from("posts")
      .update({ status: newStatus })
      .eq("id", postId)
      .select(`
        *,
        clients (name),
        platforms (name),
        media_types (name)
      `)
      .single()

    if (error) {
      console.error("Error updating post status:", error)
    } else if (data) {
      console.log("Post status updated successfully:", data)
      const updatedPost: Post = {
        ...data,
        clients: data.clients || { name: "Unknown Client" },
        platforms: data.platforms || { name: "Unknown Platform" },
        media_types: data.media_types || { name: "Unknown Media Type" },
      }
      onPostUpdated(updatedPost)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Posts Dashboard</CardTitle>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px] bg-white text-black">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-yellow-200 dark:bg-yellow-800">
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Client</TableHead>
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Platform</TableHead>
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Media Type</TableHead>
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Content</TableHead>
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Scheduled Time</TableHead>
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Status</TableHead>
              <TableHead className="font-bold text-yellow-800 dark:text-yellow-200">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((post, index) => (
              <TableRow
                key={post.id}
                className={index % 2 === 0 ? "bg-orange-50 dark:bg-orange-900" : "bg-yellow-50 dark:bg-yellow-900"}
              >
                <TableCell>{post.clients?.name || "Unknown Client"}</TableCell>
                <TableCell>{post.platforms?.name || "Unknown Platform"}</TableCell>
                <TableCell>{post.media_types?.name || "Unknown Media Type"}</TableCell>
                <TableCell>{post.content}</TableCell>
                <TableCell>{new Date(post.scheduled_time).toLocaleString()}</TableCell>
                <TableCell>{post.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(post.id, post.status === "scheduled" ? "done" : "scheduled")}
                    className="bg-white text-orange-500 hover:bg-orange-100 hover:text-orange-600"
                  >
                    {post.status === "scheduled" ? "Mark as Done" : "Reschedule"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredPosts.length === 0 && (
          <div className="text-center py-4 text-orange-600 dark:text-orange-300">
            No posts found for the selected criteria.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

