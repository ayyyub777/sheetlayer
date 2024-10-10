import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/main-nav"

export default async function IndexPage() {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between py-6">
            <MainNav items={marketingConfig.mainNav} />
            <nav>
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg" }), "px-4")}
              >
                Get Started
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <section className="space-y-6 pb-8 pt-6">
            <div className="container flex max-w-[64rem] flex-col items-center gap-3 text-center">
              <h1>Build with Google Sheets</h1>
              <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-lg">
                Turn your Google Sheets into a powerful database that you can
                use to build web apps, automate workflows, and more.
              </p>
              <div className="space-x-4 space-y-4">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ size: "lg" }), "px-4")}
                >
                  Get Started
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "px-4"
                  )}
                >
                  Learn More
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}
