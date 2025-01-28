import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

interface PlatformWidgetsProps {
  clientId: string
}

const platformData = {
  all: [
    { name: "Facebook", icon: Facebook, done: 500, scheduled: 150 },
    { name: "Instagram", icon: Instagram, done: 400, scheduled: 100 },
    { name: "Twitter", icon: Twitter, done: 350, scheduled: 80 },
    { name: "LinkedIn", icon: Linkedin, done: 200, scheduled: 50 },
  ],
  client1: [
    { name: "Facebook", icon: Facebook, done: 200, scheduled: 50 },
    { name: "Instagram", icon: Instagram, done: 150, scheduled: 30 },
    { name: "Twitter", icon: Twitter, done: 100, scheduled: 20 },
    { name: "LinkedIn", icon: Linkedin, done: 50, scheduled: 10 },
  ],
  // Add data for other clients...
}

export function PlatformWidgets({ clientId }: PlatformWidgetsProps) {
  const platforms = platformData[clientId as keyof typeof platformData] || platformData.all

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Posts by Platform</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.name}>
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center">
                <platform.icon className="mr-2 h-4 w-4" />
                {platform.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Done:</span>
                  <span className="font-semibold">{platform.done}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Scheduled:</span>
                  <span className="font-semibold">{platform.scheduled}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

