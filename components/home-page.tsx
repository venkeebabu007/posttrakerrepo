"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ClientSelector } from "@/components/client-selector"
import { WeeklyPostsNumbers } from "@/components/weekly-posts-numbers"
import { MonthlyPostsSummary } from "@/components/monthly-posts-summary"
import { PostsDashboard } from "@/components/posts-dashboard"
import { UpdateForm } from "@/components/update-form"
import { ClientManagement } from "@/components/client-management"
import { ClientSummaryDashboard } from "@/components/client-summary-dashboard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"

interface Post {
  id: string
  client_id: string
  platform: string
  media_type: string
  content: string
  status: string
  scheduled_time: string
  user_id: string
  clients: {
    name: string
  }
}

export default function HomePage() {
  const [selectedClient, setSelectedClient] = useState("all")
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClientComponentClient()

  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      let query = supabase.from("posts").select("*, clients(name)").eq("user_id", user.id)
      if (selectedClient !== "all") {
        query = query.eq("client_id", selectedClient)
      }
      const { data, error } = await query
      if (error) throw error
      const postsWithClients = (data as Post[]).map((post) => ({
        ...post,
        clients: post.clients || { name: "Unknown Client" },
      }))
      setPosts(postsWithClients)
    } catch (err) {
      console.error("Error fetching posts:", err)
      setError("Failed to fetch posts. Please try again.")
      toast({
        title: "Error",
        description: "Failed to fetch posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()

    const postsSubscription = supabase
      .channel("public:posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, (payload) => {
        console.log("Real-time update received:", payload)
        fetchPosts()
      })
      .subscribe()

    return () => {
      postsSubscription.unsubscribe()
    }
  }, [selectedClient])

  const handlePostCreated = (newPost: Post) => {
    const postWithClient = {
      ...newPost,
      clients: newPost.clients || { name: "Unknown Client" },
    }
    setPosts((prevPosts) => [...prevPosts, postWithClient])
    toast({
      title: "Success",
      description: "Post created and dashboard updated.",
    })
  }

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/signin")
  }

  const renderDashboard = () => {
    if (loading) {
      return <div className="text-center py-4 text-purple-600 dark:text-purple-300">Loading posts...</div>
    }
    if (error) {
      return <div className="text-center py-4 text-red-600 dark:text-red-300">Error: {error}</div>
    }
    return (
      <div className="space-y-6">
        <ClientSummaryDashboard posts={posts} />
        <WeeklyPostsNumbers clientId={selectedClient} posts={posts} />
        <MonthlyPostsSummary clientId={selectedClient} posts={posts} />
        <PostsDashboard clientId={selectedClient} posts={posts} onPostUpdated={handlePostUpdated} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
      <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Social Media Tracker</h1>
          <div className="flex items-center space-x-4">
            <UpdateForm onPostCreated={handlePostCreated} />
            <Button onClick={handleSignOut} variant="secondary">
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <ClientSelector onClientChange={setSelectedClient} />
          </div>
          <Tabs defaultValue="dashboard" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <TabsList className="mb-4">
              <TabsTrigger value="dashboard" className="text-purple-600 dark:text-purple-300">
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="clients" className="text-pink-600 dark:text-pink-300">
                Client Management
              </TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">{renderDashboard()}</TabsContent>
            <TabsContent value="clients">
              <ClientManagement />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

