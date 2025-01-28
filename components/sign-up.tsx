"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/utils/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://succestree.com"

export function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Step 1: Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${siteUrl}/auth/callback`,
          data: {
            name: name,
          },
        },
      })

      if (authError) {
        console.error("Auth error:", authError)
        throw authError
      }

      if (!authData.user) {
        console.error("No user data returned from Supabase")
        throw new Error("User data not returned from Supabase")
      }

      console.log("Auth successful, user ID:", authData.user.id)

      // Step 2: Insert user data into the users table
      const { data: userData, error: insertError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()

      if (insertError) {
        console.error("Error inserting user data:", insertError)
        console.error("Failed to create user profile. Manual cleanup may be required.")
        throw insertError
      }

      if (!userData || userData.length === 0) {
        console.error("No user data returned after insertion")
        throw new Error("Failed to create user profile")
      }

      console.log("User data inserted successfully:", userData)

      toast({
        title: "Sign up successful",
        description: "Welcome to your dashboard!",
      })

      // Redirect to the dashboard page
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      let errorMessage = "An unexpected error occurred during sign up. Please try again."
      if (error.message) {
        errorMessage = error.message
      } else if (error.error_description) {
        errorMessage = error.error_description
      }
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create a new account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

