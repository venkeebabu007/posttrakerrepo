"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      const { data: authData, error: authError } = await createClient().auth.signUp({
        email,
        password,
      })

      if (authError) throw authError

      if (authData.user) {
        const { error: insertError } = await createClient().from("users").upsert({
          id: authData.user.id,
          email: email,
          name: name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })

        if (insertError) throw insertError

        router.push("/dashboard")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "An error occurred during sign-up")
      console.error("Error during sign-up:", e)
    }
  }

  return (
    <form onSubmit={handleSignUp} className="w-full max-w-md">
      <div className="mb-4">
        <Label htmlFor="name">Name</Label>
        <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
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
        Sign Up
      </Button>
    </form>
  )
}

