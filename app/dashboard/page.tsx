import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import DashboardPage  from "@/components/dashboard-page"

export const dynamic = "force-dynamic"

export default async function Dashboard() {


  // const supabase = createServerComponentClient({ cookies })

  // const {
  //   data: { session },
  // } = await supabase.auth.getSession()

  // if (!session) {
  //   redirect("/signin")
  // }

  return < DashboardPage />
}

