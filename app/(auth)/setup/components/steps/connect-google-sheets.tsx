import { useSetupContext } from "../../setupContext"
import Controls from "../controls"

export default function ConnectGoogleSheets() {
  const { activeStep, setActiveStep } = useSetupContext()
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveStep(activeStep + 1)
  }
  return (
    <form onSubmit={onSubmit}>
      <span>Connect form</span>
      <Controls isPending={false} />
    </form>
  )
}
