"use client"

import { useState, useEffect, useCallback } from "react"
import { redirect, useRouter } from "next/navigation"
import { SetupProvider } from "./setupContext"
import ConnectGoogleSheets from "./components/steps/connect-google-sheets"
import BusinessName from "./components/steps/business-name"
import BusinessType from "./components/steps/business-type"
import { completeSetup } from "@/actions/user"
import { toast } from "@/components/ui/use-toast"

interface StepItem {
  label: string
}

const steps: StepItem[] = [
  { label: "Connect Google" },
  { label: "Business Name" },
  { label: "Business Type" },
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
        router.push("/dashboard")
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
        return <ConnectGoogleSheets />
      case 1:
        return <BusinessName />
      case 2:
        return <BusinessType />
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
                  <p className="mb-4 text-lg text-muted-foreground">
                    {`${activeStep + 1}/${steps.length}`}
                  </p>
                )}
                <h2>{steps[activeStep].label}</h2>
              </div>
              <div>{renderStepComponent()}</div>
            </>
          )}
        </div>
      </div>
    </SetupProvider>
  )
}
