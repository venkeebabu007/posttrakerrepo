"use client"

import { useState, useEffect } from "react"
import { ClientSelector } from "@/components/client-selector"
import { WeeklyPostsNumbers } from "@/components/weekly-posts-numbers"
import { MonthlyPostsSummary } from "@/components/monthly-posts-summary"
import { PostsDashboard } from "@/components/posts-dashboard"
import { ClientSummaryDashboard } from "@/components/client-summary-dashboard"
import { createClient } from "@/utils/supabase/client"
import { NewPostForm } from "@/components/new-post-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

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

export default function DashboardPage() {
  const [selectedClient, setSelectedClient] = useState("all")
  const [posts, setPosts] = useState<Post[]>([])
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false)
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPosts()
  }, [selectedClient])

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      let query = createClient()
        .from("posts")
        .select(`
          *,
          clients (name),
          platforms (name),
          media_types (name)
        `)
        .order("scheduled_time", { ascending: false })

      if (selectedClient !== "all") {
        query = query.eq("client_id", selectedClient)
      }

      const { data, error } = await query

      if (error) throw error
      console.log("Fetched posts:", data)
      setPosts(data || [])
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClients = async () => {
    try {
      const { data, error } = await createClient().from("clients").select("id, name").order("name")
      if (error) throw error
      setClients(data || [])
    } catch (error) {
      console.error("Error fetching clients:", error)
    }
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const handlePostCreated = (newPost: Post) => {
    setPosts((prevPosts) => [newPost, ...prevPosts])
    setIsNewPostModalOpen(false)
    fetchPosts() // Refetch all posts to ensure consistency
  }


  const handleSignOut = async () => {
    try {
      const { error } = await createClient().auth.signOut()
      if (error) throw error
      router.push("/signin")
    } catch (e) {
      console.error("Error signing out:", e)
      setError("Failed to sign out. Please try again.")
    }
  }


  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

      
        {/* <Dialog open={isNewPostModalOpen} onOpenChange={setIsNewPostModalOpen}>
          <DialogTrigger asChild>
            <Button>New Post</Button>
          </DialogTrigger>
          

          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
              <DialogDescription>Fill in the details to create a new post.</DialogDescription>
            </DialogHeader>
            <NewPostForm onPostCreated={handlePostCreated} onClose={() => setIsNewPostModalOpen(false)} />
          </DialogContent>
        </Dialog> */}
        <Button onClick={handleSignOut} className="w-100 mt-6">
            Sign Out
          </Button>
      </div>
      <div className="mb-6">
        <ClientSelector onClientChange={setSelectedClient} clients={clients} selectedClient={selectedClient} />
      </div>
      <div className="space-y-8">
        <ClientSummaryDashboard posts={posts} />
        <WeeklyPostsNumbers clientId={selectedClient} posts={posts} />
        <MonthlyPostsSummary clientId={selectedClient} posts={posts} />
        <PostsDashboard posts={posts} onPostUpdated={handlePostUpdated} clientId={selectedClient} />
      </div>
    </main>
  )
}

