import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function GET(request: Request) {
  try {
    const currentTime = new Date()

    // Fetch all scheduled posts that are due
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "scheduled")
      .lt("scheduled_time", currentTime.toISOString())

    if (error) throw error

    // Update status to 'done' for each post
    const updatePromises = data.map((post) => supabase.from("posts").update({ status: "done" }).eq("id", post.id))

    await Promise.all(updatePromises)

    return NextResponse.json({
      message: `Updated ${data.length} posts to 'done' status.`,
      updatedPosts: data,
    })
  } catch (error) {
    console.error("Error updating post statuses:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

