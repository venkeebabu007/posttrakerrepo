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

interface MonthlyPostsSummaryProps {
  clientId: string
  posts: Post[]
}

export function MonthlyPostsSummary({ clientId, posts }: MonthlyPostsSummaryProps) {
  const today = new Date()
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

  const weeklyStats = [
    { week: "Week 1", scheduled: 0, done: 0 },
    { week: "Week 2", scheduled: 0, done: 0 },
    { week: "Week 3", scheduled: 0, done: 0 },
    { week: "Week 4", scheduled: 0, done: 0 },
    { week: "Week 5", scheduled: 0, done: 0 },
  ]

  posts.forEach((post) => {
    const postDate = new Date(post.scheduled_time)
    if (postDate >= startOfMonth && postDate <= today && (clientId === "all" || post.client_id === clientId)) {
      const weekOfMonth = Math.floor((postDate.getDate() - 1) / 7)
      if (weekOfMonth < 5) {
        if (post.status === "scheduled") {
          weeklyStats[weekOfMonth].scheduled++
        } else if (post.status === "done") {
          weeklyStats[weekOfMonth].done++
        }
      }
    }
  })

  const filledWeeks = weeklyStats.filter((week) => week.scheduled > 0 || week.done > 0)

  const totals = filledWeeks.reduce(
    (acc, week) => {
      acc.scheduled += week.scheduled
      acc.done += week.done
      return acc
    },
    { scheduled: 0, done: 0 },
  )

  return (
    <Card className="bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
      <CardHeader className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardTitle className="text-2xl font-bold">Monthly Posts Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {filledWeeks.map((week, index) => (
            <div key={week.week} className="space-y-2">
              <div className="text-center font-semibold">{week.week}</div>
              <div className="bg-blue-500 text-white p-3 rounded-md">
                <div className="text-sm">Scheduled</div>
                <div className="text-3xl font-bold">{week.scheduled}</div>
              </div>
              <div className="bg-green-500 text-white p-3 rounded-md">
                <div className="text-sm">Done</div>
                <div className="text-3xl font-bold">{week.done}</div>
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <div className="text-center font-semibold">Total</div>
            <div className="bg-blue-500 text-white p-3 rounded-md">
              <div className="text-sm">Scheduled</div>
              <div className="text-3xl font-bold">{totals.scheduled}</div>
            </div>
            <div className="bg-green-500 text-white p-3 rounded-md">
              <div className="text-sm">Done</div>
              <div className="text-3xl font-bold">{totals.done}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

