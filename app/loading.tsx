import { Icons } from "@/components/icons"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center">
        <Icons.spinner size={32} className="animate-spin text-primary" />
      </div>
    </div>
  )
}
