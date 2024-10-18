import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useSetupContext } from "../../setupContext"
import Controls from "../controls"
import { Card } from "@/components/ui/card"
import { Icons } from "@/components/icons"

type DatabaseType = "google_sheets" | "notion" | "airtable"

interface DatabaseConfig {
  type: DatabaseType
  name: string
  priotity: "Necessary" | "Optional"
  icon: string
  connectUrl: string
}

const databaseConfigs: DatabaseConfig[] = [
  {
    type: "google_sheets",
    name: "Google Sheets",
    priotity: "Necessary",
    icon: "/icons/google_sheets.svg",
    connectUrl: "/api/connect-google-sheets",
  },
]

const ConnectDatabase: React.FC = () => {
  const { activeStep, setActiveStep } = useSetupContext()
  const [connections, setConnections] = useState<DatabaseType[]>([])
  const [pendingConnections, setPendingConnections] = useState<DatabaseType[]>(
    []
  )

  useEffect(() => {
    fetchConnections()
  }, [])

  const fetchConnections = async () => {
    try {
      const response = await fetch("/api/get-connections")
      if (response.ok) {
        const data = await response.json()
        setConnections(data)
      }
    } catch (error) {
      console.error("Error fetching connections:", error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (connections.length === 0) return
    setActiveStep(activeStep + 1)
  }

  const connectDatabase = async (config: DatabaseConfig) => {
    setPendingConnections((prev) => [...prev, config.type])
    try {
      const response = await fetch(config.connectUrl)
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error(`Error connecting to ${config.name}:`, error)
    } finally {
      setPendingConnections((prev) =>
        prev.filter((type) => type !== config.type)
      )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {databaseConfigs.map((config) => (
        <DatabaseCard
          key={config.type}
          config={config}
          isConnected={connections.includes(config.type)}
          isPending={pendingConnections.includes(config.type)}
          onConnect={() => connectDatabase(config)}
        />
      ))}
      <Controls isDisabled={connections.length === 0} />
    </form>
  )
}

interface DatabaseCardProps {
  config: DatabaseConfig
  isConnected: boolean
  isPending: boolean
  onConnect: () => void
}

const DatabaseCard: React.FC<DatabaseCardProps> = ({
  config,
  isConnected,
  isPending,
  onConnect,
}) => (
  <Card className="mb-4 flex items-center justify-between p-3">
    <div className="flex items-center gap-4">
      <div className="flex size-12 items-center justify-center rounded-md border">
        <Image src={config.icon} alt={config.name} width={28} height={28} />
      </div>
      <div>
        <p className="text-sm font-medium leading-none">{config.name}</p>
        <span className="text-xs font-medium text-muted-foreground">
          {config.priotity}
        </span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <Link href="/" className="flex items-center gap-2 text-sm font-medium">
        Learn more
        <Icons.chevronDown className="size-4" />
      </Link>
      <div className="h-5 w-[0.5px] bg-border" />
      <ConnectButton
        isConnected={isConnected}
        isPending={isPending}
        onClick={onConnect}
      />
    </div>
  </Card>
)

interface ConnectButtonProps {
  isConnected: boolean
  isPending: boolean
  onClick: () => void
}

const ConnectButton: React.FC<ConnectButtonProps> = ({
  isConnected,
  isPending,
  onClick,
}) => {
  if (isConnected) {
    return (
      <Button
        type="button"
        size="sm"
        className="bg-green-500 hover:bg-green-500"
      >
        <Icons.check className="mr-2 size-4" />
        Done
      </Button>
    )
  }

  return (
    <Button type="button" size="sm" onClick={onClick} disabled={isPending}>
      {isPending ? (
        <Icons.spinner className="mr-2 size-4 animate-spin" />
      ) : (
        <Icons.plug className="mr-2 size-4" />
      )}
      Connect
    </Button>
  )
}

export default ConnectDatabase
