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

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-blue-600">Social Media Tracker</div>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <div>Dash Board2</div>
              {/* <Link href="/dashboard" className="text-gray-600 hover:text-blue-600">
                Dashboard
              </Link> */}
            </li>
            <li>
              <Link href="/clients" className="text-gray-600 hover:text-blue-600">
                Clients
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Dialog>
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
              <NewPostForm />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

