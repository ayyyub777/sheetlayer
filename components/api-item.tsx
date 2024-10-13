import Link from "next/link"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Api } from "@prisma/client"
import { ApiOperations } from "./api-operations"
import { Button } from "./ui/button"

export function ApiItem({ api }: { api: Api }) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid">
        <p className="text-lg font-medium first-letter:uppercase">
          {api.title}
        </p>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(api.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Link
          href={`https://docs.google.com/spreadsheets/d/${api.spreadsheet}`}
          target="_blank"
        >
          <Button variant="outline" size="sm">
            Open in Spreadsheet
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
