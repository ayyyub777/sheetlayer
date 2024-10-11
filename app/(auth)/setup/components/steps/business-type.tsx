import { z } from "zod"
import { useState, useTransition } from "react"
import { useSetupContext } from "../../setupContext"
import Controls from "../controls"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Label } from "@/components/ui/label"
import { StatusResponseDataType } from "@/types"

const BusinessTypeSchema = z.object({
  type: z.string().nonempty("Business type is required"),
})

export default function BusinessType() {
  const { activeStep, setActiveStep } = useSetupContext()
  const [success, setSuccess] = useState<StatusResponseDataType>()
  const [error, setError] = useState<StatusResponseDataType>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof BusinessTypeSchema>>({
    resolver: zodResolver(BusinessTypeSchema),
    defaultValues: {
      type: "",
    },
  })

  function onSubmit(values: z.infer<typeof BusinessTypeSchema>) {
    setActiveStep(activeStep + 1)
    // startTransition(() => {})
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <Label>Type</Label>
              <FormControl>
                <Input placeholder="Business Type" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Controls isPending={isPending} />
      </form>
    </Form>
  )
}
