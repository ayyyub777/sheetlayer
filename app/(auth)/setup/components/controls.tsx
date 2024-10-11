import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { useSetupContext } from "../setupContext"

export default function Controls({
  isPending,
  isDisabled,
}: {
  isPending: boolean
  isDisabled?: boolean
}) {
  const { activeStep, setActiveStep, lastStep } = useSetupContext()

  function handlePrevious() {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
    }
  }

  return (
    <div className="mt-4 flex justify-between">
      <Button
        variant="link"
        onClick={handlePrevious}
        disabled={activeStep === 0}
        className="px-0 text-muted-foreground hover:text-foreground hover:no-underline"
      >
        Previous
      </Button>
      <Button type="submit" disabled={isPending || isDisabled}>
        {isPending && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        {lastStep ? "Finish" : "Next"}
      </Button>
    </div>
  )
}
