import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Api } from "@prisma/client"
import { ApiOperations } from "./api-operations"
import { Button } from "./ui/button"
import { env } from "@/env.mjs"

export async function ApiItem({ api }: { api: Api }) {
  const businessName = api.Business?.name
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex h-9 flex-col justify-center gap-1">
        <p className="font-medium leading-none first-letter:uppercase">
          {api.title}
        </p>
        <div>
          <p className="text-sm leading-none text-muted-foreground">
            {`${env.NEXT_PUBLIC_APP_URL}/api/${businessName}/${api.title}`}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={`https://docs.google.com/spreadsheets/d/${api.spreadsheet}`}
          target="_blank"
        >
          <Button variant="outline" size="sm">
            Open in spreadsheet
          </Button>
        </Link>
        <ApiOperations api={{ id: api.id }} />
      </div>
    </div>
  )
}

ApiItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
