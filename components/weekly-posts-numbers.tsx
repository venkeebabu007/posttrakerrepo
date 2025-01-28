"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Post {
  id: string
  client_id: string
  platform: string
  media_type: string
  content: string
  status: string
  scheduled_time: string
}

interface WeeklyPostsNumbersProps {
  clientId: string
  posts: Post[]
}

export function WeeklyPostsNumbers({ clientId, posts }: WeeklyPostsNumbersProps) {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  const today = new Date()
  const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay())

  const filterPosts = () => {
    return posts.filter((post) => {
      const postDate = new Date(post.scheduled_time)
      return postDate >= startOfWeek && postDate <= today && (clientId === "all" || post.client_id === clientId)
    })
  }

  const filteredPosts = filterPosts()

  const weeklyStats = weekDays.map((day) => ({ day, scheduled: 0, done: 0 }))

  filteredPosts.forEach((post) => {
    const postDate = new Date(post.scheduled_time)
    if (postDate >= startOfWeek && postDate <= today && (clientId === "all" || post.client_id === clientId)) {
      const dayIndex = postDate.getDay()
      if (post.status === "scheduled") {
        weeklyStats[dayIndex].scheduled++
      } else if (post.status === "done") {
        weeklyStats[dayIndex].done++
      }
    }
  })

  const totals = weeklyStats.reduce(
    (acc, day) => {
      acc.scheduled += day.scheduled
      acc.done += day.done
      return acc
    },
    { scheduled: 0, done: 0 },
  )

  return (
    <Card className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-2xl font-bold">Weekly Posts Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2">
          {weeklyStats.map((day, index) => (
            <div key={day.day} className="space-y-2">
              <div className="text-center font-semibold text-sm">{day.day}</div>
              <div className="bg-blue-500 text-white p-2 rounded-md">
                <div className="text-xs">Scheduled</div>
                <div className="text-2xl font-bold">{day.scheduled}</div>
              </div>
              <div className="bg-green-500 text-white p-2 rounded-md">
                <div className="text-xs">Done</div>
                <div className="text-2xl font-bold">{day.done}</div>
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <div className="text-center font-semibold text-sm">Total</div>
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <div className="text-xs">Scheduled</div>
              <div className="text-2xl font-bold">{totals.scheduled}</div>
            </div>
            <div className="bg-green-500 text-white p-2 rounded-md">
              <div className="text-xs">Done</div>
              <div className="text-2xl font-bold">{totals.done}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

