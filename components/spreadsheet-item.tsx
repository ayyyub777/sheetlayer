import Link from "next/link"

import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Spreadsheet } from "@prisma/client"
import { SpreadsheetOperations } from "./spreadsheet-operations"

interface SpreadsheetItemProps {
  spreadsheet: Pick<Spreadsheet, "id" | "title" | "createdAt">
}

export function SpreadsheetItem({ spreadsheet }: SpreadsheetItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="grid">
        <Link href="" className="font-medium hover:underline">
          {spreadsheet.title}
        </Link>
        <div>
          <p className="text-sm text-muted-foreground">
            {formatDate(spreadsheet.createdAt?.toDateString())}
          </p>
        </div>
      </div>
      <SpreadsheetOperations
        spreadsheet={{ id: spreadsheet.id, title: spreadsheet.title }}
      />
    </div>
  )
}

SpreadsheetItem.Skeleton = function PostItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  )
}
