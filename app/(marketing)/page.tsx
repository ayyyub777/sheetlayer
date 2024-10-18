import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { marketingConfig } from "@/config/marketing"
import { MainNav } from "@/components/main-nav"
import { getCurrentUser } from "@/lib/session"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { siteConfig } from "@/config/site"
import Image from "next/image"
import { Icons } from "@/components/icons"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default async function IndexPage() {
  const user = await getCurrentUser()

  if (user) {
    const business = await db.business.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (business) {
      redirect(`/${business.name}`)
    } else {
      redirect("setup")
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="container z-40 bg-background">
          <div className="flex h-20 items-center justify-between p-6">
            <MainNav items={marketingConfig.mainNav} />
            <nav>
              <Link href="/login" className={cn(buttonVariants())}>
                Sign In
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">
          <section className="space-y-6 pb-8 pt-4">
            <div className="container flex max-w-5xl flex-col items-center gap-3 text-center">
              <h1 className="h1">Turn spreadsheets to realtime APIs</h1>
              <p className="max-w-2xl text-muted-foreground sm:text-lg">
                Turn your Google Sheets into a powerful database that you can
                use to build web apps, automate workflows, and more.
              </p>
              <Link
                href="/login"
                className={cn(buttonVariants({ size: "lg" }), "mt-2 px-4")}
              >
                Try {siteConfig.name} for free
              </Link>
            </div>
          </section>
          <section className="relative mx-auto my-16 max-w-5xl">
            <div className="relative">
              <Image
                src="/screenshot.png"
                width={1280}
                height={720}
                alt="screenshot"
                className="rounded-md"
              />
            </div>
            <div className="absolute -start-10 -top-10 -z-[1] h-full w-[calc(100%+80px)] rounded-md bg-gradient-to-b from-[#03045e]/5 to-background p-px"></div>
          </section>
          <section className="container max-w-7xl pb-16">
            <div className="grid items-center gap-16 md:grid-cols-[1fr_1fr]">
              <Image
                src="/placeholder.png"
                alt=""
                height={360}
                width={640}
                className="aspect-video w-full rounded-md bg-muted"
              />
              <div>
                <h2 className="h2">Built with latest</h2>
                <p className="mt-3 max-w-2xl text-muted-foreground sm:text-lg">
                  Turn your Google Sheets into a powerful database that you can
                  use to build web apps, automate workflows, and more.
                </p>
                <ul className="mt-6 flex items-center gap-5 text-sm font-medium">
                  <li className="flex items-center gap-2">
                    <Icons.check className="size-4" />
                    <span>Quality</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="size-4" />
                    <span>Multi-purpose</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="size-4" />
                    <span>Easy to use</span>
                  </li>
                </ul>
                <Button className="mt-10">
                  Get Started <Icons.chevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </section>
          <section className="container max-w-7xl py-16">
            <Carousel className="w-full">
              <div className="mb-8 flex justify-between">
                <h2 className="h2">Testimonials</h2>
                <div className="flex items-center space-x-2">
                  <CarouselPrevious
                    className="static translate-y-0"
                    variant="link"
                  />
                  <CarouselNext
                    className="static translate-y-0"
                    variant="link"
                  />
                </div>
              </div>
              <CarouselContent>
                {testimonials.map((testimonial, idx) => (
                  <CarouselItem
                    key={idx}
                    className="basis-full md:basis-1/2 lg:basis-1/3"
                  >
                    <div className="h-full p-1">
                      <div className="flex h-full flex-col justify-between rounded-md border p-6">
                        <q className="text-muted-foreground">
                          {testimonial.content}
                        </q>
                        <div className="mt-8 flex gap-4">
                          <Avatar className="size-9 rounded-full">
                            <AvatarImage
                              src={testimonial.avatar}
                              alt={testimonial.name}
                            />
                          </Avatar>
                          <div className="text-sm">
                            <p className="font-medium">{testimonial.name}</p>
                            <p className="text-muted-foreground">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        </main>
      </div>
    </>
  )
}

const testimonials = [
  {
    name: "John Doe",
    role: "CEO & Founder",
    avatar: "/images/block/avatar-1.webp",
    content:
      "Lorem ipsum dolor sit, amet Odio, incidunt.  id ut omnis repellat. Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis.",
  },
  {
    name: "Jane Doe",
    role: "CTO",
    avatar: "/images/block/avatar-2.webp",
    content:
      "Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat. Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat.",
  },
  {
    name: "John Smith",
    role: "COO",
    avatar: "/images/block/avatar-3.webp",
    content:
      "Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat. Lorem ipsum dolor sit.",
  },
  {
    name: "Jane Smith",
    role: "Tech Lead",
    avatar: "/images/block/avatar-4.webp",
    content:
      "Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat. incidunt. Ratione, ullam? Iusto id ut omnis repellat ratione.",
  },
  {
    name: "Richard Doe",
    role: "Designer",
    avatar: "/images/block/avatar-5.webp",
    content:
      "Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat.",
  },
  {
    name: "Gordon Doe",
    role: "Developer",
    avatar: "/images/block/avatar-6.webp",
    content:
      "Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat. Lorem ipsum dolor sit, amet Odio, incidunt. Ratione, ullam? Iusto id ut omnis repellat.",
  },
]
