import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true)
      console.log("Checking auth status...")
      const { data, error } = await supabase.auth.getSession()
      console.log("Auth data:", data)
      console.log("Auth error:", error)
      if (error) throw error
      setIsAuthenticated(!!data.session)
      console.log("Is authenticated:", !!data.session)
    } catch (error) {
      console.error("Authentication error:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    router.push("/signin")
  }

  return { isAuthenticated, isLoading, checkAuthStatus, signOut }
}

