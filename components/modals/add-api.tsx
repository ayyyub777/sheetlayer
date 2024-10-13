"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"

import { useAddApiModal } from "@/hooks/modals/use-add-api-modal"
import { StatusResponseDataType, StatusResponseType } from "@/types"
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Modal } from "../ui/modal"

const ApiSchema = z.object({
  title: z.string().nonempty("Title is required"),
})

export default function AddApi() {
  const { isOpen, onClose } = useAddApiModal()
  const [success, setSuccess] = useState<StatusResponseDataType>()
  const [error, setError] = useState<StatusResponseDataType>()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ApiSchema>>({
    resolver: zodResolver(ApiSchema),
    defaultValues: {
      title: "",
    },
  })

  const onSubmit = (values: z.infer<typeof ApiSchema>) => {
    console.log(values)
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-3">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="E.g. Posts"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Modal>
  )
}
