"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { StatusResponseDataType, StatusResponseType } from "@/types"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { useAddWorkspaceModal } from "@/hooks/modals/use-add-workspace-modal"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Modal } from "../ui/modal"
import { toast } from "../ui/use-toast"
import { addWorkspace } from "@/actions/workspace"
import { useRouter } from "next/navigation"

const workspaceNameSchema = z.object({
  name: z.string().nonempty("Workspace name is required"),
})

export default function AddWorkspace() {
  const { isOpen, onClose } = useAddWorkspaceModal()
  const [success, setSuccess] = useState<StatusResponseDataType>()
  const [error, setError] = useState<StatusResponseDataType>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof workspaceNameSchema>>({
    resolver: zodResolver(workspaceNameSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof workspaceNameSchema>) {
    startTransition(() => {
      addWorkspace(values)
        .then((data?: StatusResponseType) => {
          setError(data?.error)
          setSuccess(data?.success)
          if (data?.error) {
            toast(data.error)
          }
        })
        .catch((error) => {
          toast({
            description: "An unexpected error occurred",
          })
          console.error(error)
        })
        .finally(() => {
          toast({
            description: "Workspace added successfully",
          })
          router.push(`/${values.name.toLowerCase()}`)
        })
    })
  }

  return (
    <Modal
      title="Add API"
      description="Add a new API to your collection."
      isOpen={isOpen}
      onClose={onClose}
      action={{
        label: "Add API",
        disabled: isPending,
        onClick: form.handleSubmit(onSubmit),
        isPending,
      }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Name</Label>
                <FormControl>
                  <Input placeholder="Workspace name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </Modal>
  )
}
