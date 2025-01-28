import "@/styles/globals.css"
import "react-datepicker/dist/react-datepicker.css"
import { Header } from "@/components/header"

export const dynamic = "force-dynamic"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {/* <Header /> */}
        {children}
      </body>
    </html>
  )
}



import './globals.css'