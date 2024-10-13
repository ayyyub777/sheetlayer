import Link from "next/link"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Api } from "@prisma/client"
import { ApiOperations } from "./api-operations"

interface ApiItemProps {
  api: Pick<Api, "id" | "title" | "createdAt">
}

export function ApiItem({ api }: ApiItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid">
        <Link href="" className="font-medium hover:underline">
          {api.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(api.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <ApiOperations api={{ id: api.id }} />
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
