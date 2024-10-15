import { Icons } from "@/components/icons"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  console.log(user)

  if (!user) {
    redirect("login")
  }

  const { setup } = user

  if (setup) {
    return redirect("/")
  }

  return (
    <>
      <header className="container flex h-20 bg-background">
        <div className="flex w-full">
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center">
              <Icons.logo className="h-8 w-auto" />
            </Link>
          </div>
        </div>
      </header>
      <div className="container my-16 space-y-5 sm:w-[640px]">{children}</div>
    </>
  )
}
