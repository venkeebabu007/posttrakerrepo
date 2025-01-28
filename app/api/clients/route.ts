import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables")
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

export async function GET() {
  console.log("API: Fetching clients")
  const { data, error } = await supabase.from("clients").select("*").order("name")

  if (error) {
    console.error("API: Error fetching clients:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log("API: Fetched clients:", data)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { name } = await request.json()

  const { data, error } = await supabase.from("clients").insert({ name }).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function PUT(request: Request) {
  const { id, name } = await request.json()

  const { data, error } = await supabase.from("clients").update({ name }).eq("id", id).select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data[0])
}

export async function DELETE(request: Request) {
  const { id } = await request.json()

  const { error } = await supabase.from("clients").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

