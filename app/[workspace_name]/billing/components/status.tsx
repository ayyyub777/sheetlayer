import { Badge } from "@/components/ui/badge"

export function SubscriptionStatus({
  statusFormatted,
  isPaused,
}: {
  statusFormatted: string
  isPaused?: boolean
}) {
  const _statusFormatted = isPaused ? "Paused" : statusFormatted

  return (
    <>
      <Badge variant="outline">{_statusFormatted}</Badge>
    </>
  )
}
