import { Icons } from "@/components/icons"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("login")
  }

  const { setup } = user

  if (setup) {
    const workspace = await db.workspace.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (workspace) {
      redirect(`/${workspace.name}`)
    }
  }

  return (
    <>
      <header className="container flex h-20 bg-background">
        <div className="flex w-full">
          <div className="flex items-center gap-7">
            <Link href="/" className="flex items-center">
              <Icons.logo className="h-[30px] w-auto" />
            </Link>
          </div>
        </div>
      </header>
      <div className="container my-16 space-y-5 sm:w-[640px]">{children}</div>
    </>
  )
}
