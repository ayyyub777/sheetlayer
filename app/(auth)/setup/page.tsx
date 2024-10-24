"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SetupProvider } from "./setupContext"
import WorkspaceName from "./components/steps/workspace-name"
import ConnectDatabase from "./components/steps/connect-database"
import { completeSetup } from "@/actions/user"

interface StepItem {
  label: string
}

const steps: StepItem[] = [
  { label: "Connect Google Sheets" },
  { label: "Workspace Name" },
]

export default function SetupPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)
  const lastStep = activeStep + 1 === steps.length
  const done = activeStep === steps.length

  const handleFinishSetup = useCallback(async () => {
    try {
      const res = await completeSetup()
      if (res?.success) {
        router.push("/")
      }
    } catch (error) {
      console.error("Failed to finish setup:", error)
    }
  }, [router])

  useEffect(() => {
    if (done) {
      handleFinishSetup()
    }
  }, [done, handleFinishSetup])

  const renderStepComponent = () => {
    switch (activeStep) {
      case 0:
        return <ConnectDatabase />
      case 1:
        return <WorkspaceName />
      default:
        return null
    }
  }

  return (
    <SetupProvider value={{ activeStep, setActiveStep, lastStep }}>
      <div className="flex w-full flex-col gap-4">
        <div className="space-y-8">
          {activeStep < steps.length && (
            <>
              <div>
                {steps.length > 1 && (
                  <p className="mb-2 text-lg text-muted-foreground">
                    {`${activeStep + 1}/${steps.length}`}
                  </p>
                )}
                <h2 className="h3">{steps[activeStep].label}</h2>
              </div>
              <div>{renderStepComponent()}</div>
            </>
          )}
        </div>
      </div>
    </SetupProvider>
  )
}
