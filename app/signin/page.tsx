"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import SignInForm from "./SignInForm"

export default function SignIn() {
  const router = useRouter()

  // useEffect(() => {
  //   const checkUser = async () => {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser()
  //     if (user) {
  //       console.log("Authentication successfull")
  //       router.push("/dashboard")
  //     }
  //   }
  //   checkUser()
  // }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Sign In</h1>
      <SignInForm />
    </div>
  )
}

