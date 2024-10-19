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
    const workspace = await db.workspace.findFirst({
      where: {
        userId: user.id,
      },
    })

    if (workspace) {
      redirect(`/${workspace.name}`)
    } else {
      redirect("setup")
    }
  }

  return (
    <>
      <div className="flex min-h-screen flex-col">
        <header className="max-w-5l container z-40 bg-background">
          <div className="flex h-20 items-center justify-between">
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
              <h1 className="h1">
                Real-Time APIs in{" "}
                <span className="text-[#0077b6]">One Click.</span>
              </h1>
              <p className="max-w-2xl text-muted-foreground sm:text-lg">
                Turn your Google Sheets into a powerful database that you can
                use to build web apps, automate workflows, and more.
              </p>
              <div className="space-x-4">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ size: "lg" }), "mt-2 px-4")}
                >
                  Try {siteConfig.name} for Free
                </Link>
                <Link
                  href="#learn-more"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "mt-2 px-4"
                  )}
                >
                  Learn More
                </Link>
              </div>
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
          <section className="container max-w-6xl py-16" id="learn-more">
            <div className="grid items-center gap-16 md:grid-cols-[1fr_1fr]">
              <Image
                src="/api-creation.png"
                alt="API creation process"
                height={360}
                width={640}
                className="aspect-video w-full rounded-md bg-muted"
              />
              <div>
                <h3 className="h3">Instant API Creation</h3>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Convert any spreadsheet into a fully functional API with just
                  a few clicks. No coding required.
                </p>
                <ul className="mt-6 grid grid-cols-3 items-center gap-5 text-sm font-medium">
                  <li className="flex items-center gap-2">
                    <Icons.check className="size-4" />
                    <span>No-Code Solution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="size-4" />
                    <span>Real-Time Updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Icons.check className="size-4" />
                    <span>Instant Deployment</span>
                  </li>
                </ul>
                <Button className="mt-8" variant="outline">
                  Get Started <Icons.chevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </div>
          </section>
          <section className="container max-w-6xl py-16">
            <div className="grid items-center gap-16 md:grid-cols-[1fr_1fr]">
              <div>
                <h3 className="h3">Powerful Features</h3>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  Sheetlayer comes packed with features to make your API
                  development process smooth and efficient.
                </p>
                <Button className="mt-8" variant="outline">
                  Learn More <Icons.chevronRight className="ml-2 size-4" />
                </Button>
              </div>
              <Image
                src="/features-overview.png"
                alt="Sheetlayer features overview"
                height={360}
                width={640}
                className="aspect-video w-full rounded-md bg-muted"
              />
            </div>
          </section>
          <section className="container max-w-6xl py-16">
            <Carousel className="w-full">
              <div className="mb-6 flex justify-between">
                <h3 className="h3">Testimonials</h3>
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
    role: "Startup Founder",
    avatar: "/images/block/avatar-1.webp",
    content:
      "Sheetlayer has revolutionized our development process. We can now prototype and deploy APIs in minutes instead of days.",
  },
  {
    name: "Jane Smith",
    role: "Product Manager",
    avatar: "/images/block/avatar-2.webp",
    content:
      "The ease of use and real-time updates have made our team significantly more productive. Sheetlayer is a game-changer.",
  },
  {
    name: "Mike Johnson",
    role: "Data Analyst",
    avatar: "/images/block/avatar-3.webp",
    content:
      "I love how Sheetlayer allows me to quickly turn my data models into functional APIs without any coding knowledge.",
  },
  {
    name: "Emily Brown",
    role: "Tech Lead",
    avatar: "/images/block/avatar-4.webp",
    content:
      "The automatic documentation and version control features have streamlined our development workflow immensely.",
  },
  {
    name: "Alex Lee",
    role: "Freelance Developer",
    avatar: "/images/block/avatar-5.webp",
    content:
      "Sheetlayer has become an essential tool in my kit. It's perfect for rapid prototyping and small to medium-sized projects.",
  },
  {
    name: "Sarah Chen",
    role: "UX Designer",
    avatar: "/images/block/avatar-6.webp",
    content:
      "The intuitive interface makes it easy for non-technical team members to contribute to API development. It's truly collaborative.",
  },
]
