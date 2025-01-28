





"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
export default function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent the default form submission behavior
    setError(null) // Clear any previous errors
    try {
      // Step 1: Check if the user exists in the custom users table
      const { data: userData, error: userError } = await createClient()
        .from("users")
        .select("id")
        .eq("email", email)
        .single()
      if (userError || !userData) {
        throw new Error("User not found")
      }
      // Step 2: Authenticate with Supabase Auth
      const { error: authError } = await createClient().auth.signInWithPassword({
        email,
        password,
      })
      if (authError) {
        throw authError
      }
      // Redirect to dashboard on successful sign-in

      const { data: { session }, error: sessionError } = await createClient().auth.getSession();
      console.log("Session:", session); // 
      router.push("/dashboard")
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred during sign-in")
    }
  }
  return (
    <form onSubmit={handleSignIn} className="w-full max-w-md">
      <div className="mb-4">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="mb-4">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Button type="submit" className="w-full">
        Sign In
      </Button>
    </form>
  )
}