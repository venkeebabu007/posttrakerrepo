// import { createClient } from "@supabase/supabase-js"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error("Missing Supabase environment variables")
// }

// // Remove any quotation marks from the URL and ensure it starts with https://
// const cleanSupabaseUrl = supabaseUrl.replace(/["']/g, "").replace(/^(?!https:\/\/)/, "https://")

// // console.log("Supabase URL:", cleanSupabaseUrl)
// // console.log("Supabase Anon Key:", supabaseAnonKey.substring(0, 5) + "...")

// // export const supabase = createClient(cleanSupabaseUrl, supabaseAnonKey, {
// //   auth: {
// //     persistSession: true, // Enables session persistence
// //     autoRefreshToken: true, // Automatically refreshes expired tokens
// //     detectSessionInUrl: true, // Handles session on OAuth redirects
// //   },
// // });

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true,
//   },
// });


// // Export the cleaned URL for testing purposes
// export const cleanedSupabaseUrl = cleanSupabaseUrl

// // Function to check if Supabase connection is working
// export async function checkSupabaseConnection() {
//   try {
//     const { data, error } = await supabase.from("users").select("id").limit(1)
//     if (error) throw error
//     return { success: true, message: "Successfully connected to Supabase" }
//   } catch (error) {
//     return {
//       success: false,
//       message: error instanceof Error ? error.message : "Failed to connect to Supabase",
//     }
//   }
// }

