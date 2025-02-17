"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import dynamic from "next/dynamic"
const DatePicker = dynamic(() => import("react-datepicker"), { ssr: false })
import "react-datepicker/dist/react-datepicker.css"
import { createClient } from "@/utils/supabase/client"

interface Client {
  id: string
  name: string
}

interface Platform {
  id: string
  name: string
}

interface MediaType {
  id: string
  name: string
}

export function NewPostForm({
  onPostCreated,
  onClose,
  refreshDashboard,
}: {
  onPostCreated: (newPost: any) => void
  onClose: () => void
  refreshDashboard: () => void
}) {
  const [clients, setClients] = useState<Client[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [mediaTypes, setMediaTypes] = useState<MediaType[]>([])
  const [selectedClient, setSelectedClient] = useState<string>("")
  const [selectedPlatform, setSelectedPlatform] = useState<string>("")
  const [selectedMediaType, setSelectedMediaType] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [scheduledTime, setScheduledTime] = useState<Date | null>(new Date())
  const { toast } = useToast()

  useEffect(() => {
    fetchClients()
    fetchPlatforms()
    fetchMediaTypes()
  }, [])

  const fetchClients = async () => {
    const { data, error } = await createClient().from("clients").select("id, name")
    if (error) {
      console.error("Error fetching clients:", error)
    } else {
      setClients(data || [])
    }
  }

  const fetchPlatforms = async () => {
    const { data, error } = await createClient().from("platforms").select("id, name")
    if (error) {
      console.error("Error fetching platforms:", error)
    } else {
      setPlatforms(data || [])
    }
  }

  const fetchMediaTypes = async () => {
    const { data, error } = await createClient().from("media_types").select("id, name")
    if (error) {
      console.error("Error fetching media types:", error)
    } else {
      setMediaTypes(data || [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("handleSubmit function called")
    console.log("Form submission started")

    if (!selectedClient || !selectedPlatform || !selectedMediaType || !content || !scheduledTime) {
      console.log("Form validation failed", {
        selectedClient,
        selectedPlatform,
        selectedMediaType,
        content,
        scheduledTime,
      })
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    try {
      console.log("Preparing new post data")
      const newPost = {
        client_id: selectedClient,
        platform_id: selectedPlatform,
        media_type_id: selectedMediaType,
        content: content,
        scheduled_time: scheduledTime.toISOString(),
        status: "scheduled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user_id: "58d6e98b-5277-4ae2-b392-85c63cb9ab78",
      }
      console.log("New post object to be inserted:", newPost)

      console.log("Inserting new post into database")
      const { data, error } = await createClient().from("posts").insert([newPost]).select()

      if (error) {
        console.error("Database insertion error:", error)
        throw new Error(JSON.stringify(error))
      }

      if (data) {
        console.log("Post created successfully:", data)
        onPostCreated(data[0])
        resetForm()
        refreshDashboard()
      } else {
        throw new Error("No data returned from insert operation")
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      let errorMessage = "An unknown error occurred"
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error)
      }
      toast({
        title: "Error",
        description: `Failed to create post: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setSelectedClient("")
    setSelectedPlatform("")
    setSelectedMediaType("")
    setContent("")
    setScheduledTime(new Date())
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto pr-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select value={selectedClient} onValueChange={setSelectedClient}>
            <SelectTrigger id="client">
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
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger id="platform">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((platform) => (
                <SelectItem key={platform.id} value={platform.id}>
                  {platform.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mediaType">Media Type</Label>
          <Select value={selectedMediaType} onValueChange={setSelectedMediaType}>
            <SelectTrigger id="mediaType">
              <SelectValue placeholder="Select media type" />
            </SelectTrigger>
            <SelectContent>
              {mediaTypes.map((mediaType) => (
                <SelectItem key={mediaType.id} value={mediaType.id}>
                  {mediaType.name}
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="scheduledTime">Scheduled Time</Label>
          <DatePicker
            selected={scheduledTime}
            onChange={(date: Date) => setScheduledTime(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MM/dd/yyyy h:mm aa"
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>

        <Button type="submit" className="w-full">
          Create Post
        </Button>
      </form>
    </div>
  )
}

