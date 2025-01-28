"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"

interface Client {
  id: string
  name: string
}

interface UpdateFormProps {
  onPostCreated: (newPost: any) => void
}

export function UpdateForm({ onPostCreated }: UpdateFormProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState("scheduled")
  const [postDate, setPostDate] = useState<Date | null>(new Date())
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [selectedMediaType, setSelectedMediaType] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [clients, setClients] = useState<{ id: string; name: string }[]>([])
  const [platforms, setPlatforms] = useState<string[]>([])
  const [mediaTypes, setMediaTypes] = useState<string[]>([])
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchClients()
    fetchPlatforms()
    fetchMediaTypes()
  }, [])

  const fetchClients = async () => {
    const { data, error } = await supabase.from("clients").select("id, name").order("name")
    if (error) {
      console.error("Error fetching clients:", error)
    } else {
      setClients(data || [])
    }
  }

  const fetchPlatforms = async () => {
    const { data, error } = await supabase.from("platforms").select("name").order("name")
    if (error) {
      console.error("Error fetching platforms:", error)
    } else {
      setPlatforms(data?.map((p) => p.name) || [])
    }
  }

  const fetchMediaTypes = async () => {
    const { data, error } = await supabase.from("media_types").select("name").order("name")
    if (error) {
      console.error("Error fetching media types:", error)
    } else {
      setMediaTypes(data?.map((mt) => mt.name) || [])
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!postDate) {
      toast({
        title: "Error",
        description: "Please select a date and time for the post.",
        variant: "destructive",
      })
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast({
        title: "Error",
        description: "User not authenticated.",
        variant: "destructive",
      })
      return
    }

    const postData = {
      client_id: selectedClient,
      platform: selectedPlatform,
      media_type: selectedMediaType,
      content: content,
      status: status,
      scheduled_time: postDate.toISOString(),
      user_id: user.id,
    }

    const { data, error } = await supabase.from("posts").insert([postData]).select()

    if (error) {
      console.error("Error inserting new post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } else {
      console.log("Post created successfully:", data)
      toast({
        title: "Success",
        description: "Post created successfully.",
      })
      setOpen(false)
      resetForm()
      onPostCreated(data[0])
    }
  }

  const resetForm = () => {
    setStatus("scheduled")
    setPostDate(new Date())
    setSelectedClient("")
    setSelectedPlatform("")
    setSelectedMediaType("")
    setContent("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Select required value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger id="clientName">
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platform">Platform</Label>
            <Select required value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger id="platform">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mediaType">Media Type</Label>
            <Select required value={selectedMediaType} onValueChange={setSelectedMediaType}>
              <SelectTrigger id="mediaType">
                <SelectValue placeholder="Select media type" />
              </SelectTrigger>
              <SelectContent>
                {mediaTypes.map((mediaType) => (
                  <SelectItem key={mediaType} value={mediaType}>
                    {mediaType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter post content"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <RadioGroup value={status} onValueChange={setStatus}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label htmlFor="scheduled">Scheduled</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="done" id="done" />
                <Label htmlFor="done">Done</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="postDate">Post Date and Time</Label>
            <DatePicker
              selected={postDate}
              onChange={(date: Date) => setPostDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full p-2 border rounded-md"
              placeholderText="Select date and time"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Create Post
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

