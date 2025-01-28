import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Twitter, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NewPostForm } from "@/components/new-post-form"

interface UpcomingPostsProps {
  clientId: string
}

const allUpcomingPosts = [
  { id: 1, client: "Client 1", platform: "Facebook", date: "2025-01-22", time: "10:00 AM" },
  { id: 2, client: "Client 2", platform: "Instagram", date: "2025-01-22", time: "2:00 PM" },
  { id: 3, client: "Client 3", platform: "Twitter", date: "2025-01-23", time: "11:30 AM" },
  { id: 4, client: "Client 1", platform: "LinkedIn", date: "2025-01-24", time: "9:00 AM" },
]

const platformIcons = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: Linkedin,
}

export function UpcomingPosts({ clientId }: UpcomingPostsProps) {
  const upcomingPosts =
    clientId === "all"
      ? allUpcomingPosts
      : allUpcomingPosts.filter((post) => post.client.toLowerCase().replace(" ", "") === clientId)

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Scheduled Posts</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule New Post</DialogTitle>
              <DialogDescription>Fill in the details to schedule your new social media post.</DialogDescription>
            </DialogHeader>
            <NewPostForm />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingPosts.map((post) => {
            const Icon = platformIcons[post.platform as keyof typeof platformIcons]
            return (
              <div key={post.id} className="flex items-center justify-between border-b pb-2 last:border-b-0">
                <div className="flex items-center space-x-4">
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{post.client}</p>
                    <p className="text-sm text-gray-500">{post.platform}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{post.date}</p>
                  <p className="text-sm text-gray-500">{post.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

