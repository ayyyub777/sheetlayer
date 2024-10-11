import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSetupContext } from "../../setupContext"
import Controls from "../controls"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

export default function ConnectGoogleSheets() {
  const { activeStep, setActiveStep } = useSetupContext()
  const [connected, setConnected] = useState(false)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveStep(activeStep + 1)
  }

  const connect = async () => {
    setConnected(true)
  }

  return (
    <form onSubmit={onSubmit}>
      <Card className="flex items-center justify-between p-3">
        <div className="flex size-16 items-center justify-center rounded-md border">
          <Image
            src="/icons/google_sheets.svg"
            alt="Google Sheets"
            width={38}
            height={38}
          />
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm font-medium"
          >
            Learn more
            <Icons.chevronDown className="size-4" />
          </Link>
          <div className="h-5 w-[1px] border-r" />
          {connected ? (
            <Button
              type="button"
              size="sm"
              onClick={connect}
              className="bg-green-500 hover:bg-green-500"
            >
              <Icons.check className="mr-2 size-4" />
              Done
            </Button>
          ) : (
            <Button type="button" size="sm" onClick={connect}>
              <Icons.plug className="mr-2 size-4" />
              Connect
            </Button>
          )}
        </div>
      </Card>
      <Controls isPending={false} isDisabled={!connected} />
    </form>
  )
}
