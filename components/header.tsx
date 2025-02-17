"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { NewPostForm } from "@/components/new-post-form"
import { useToast } from "@/components/ui/use-toast"

export function Header() {
  const [isNewPostDialogOpen, setIsNewPostDialogOpen] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const { toast } = useToast()

  const handlePostCreated = (newPost: any) => {
    console.log("New post created:", newPost)
    setIsNewPostDialogOpen(false)
    setIsSuccessDialogOpen(true)
    // You can add any additional logic here to refresh the dashboard
  }

  const refreshDashboard = () => {
    // Implement your dashboard refresh logic here
    console.log("Refreshing dashboard")
    // For example, you could emit a custom event that the dashboard listens for
    window.dispatchEvent(new CustomEvent("refreshDashboard"))
  }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">Social Media Tracker</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <div>Dash Board</div>
            </li>
            <li>
              <Link href="/clients" className="text-gray-600 hover:text-blue-600">
                Clients
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Dialog open={isNewPostDialogOpen} onOpenChange={setIsNewPostDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Schedule New Post</DialogTitle>
                <DialogDescription>Fill in the details to schedule your new social media post.</DialogDescription>
              </DialogHeader>
              <NewPostForm
                onPostCreated={handlePostCreated}
                onClose={() => setIsNewPostDialogOpen(false)}
                refreshDashboard={refreshDashboard}
              />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
            <DialogDescription>
              Your post has been created successfully and scheduled for publication.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={() => {
              setIsSuccessDialogOpen(false)
              refreshDashboard()
            }}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </header>
  )
}

