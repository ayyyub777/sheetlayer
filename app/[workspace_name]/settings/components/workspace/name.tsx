"use client"

import { useState, useTransition } from "react"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { Icons } from "@/components/icons"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { workspaceNameSchema } from "@/schemas/workspace"
import { Button } from "@/components/ui/button"
import { StatusResponseDataType, StatusResponseType } from "@/types"
import { redirect, useParams } from "next/navigation"
import { updateWorkspaceName } from "@/actions/workspace"

export function Name() {
  const params = useParams()
  const [success, setSuccess] = useState<StatusResponseDataType>()
  const [error, setError] = useState<StatusResponseDataType>()
  const [isPending, startTransition] = useTransition()

  const workspace_name = (params?.workspace_name as string) || ""

  const form = useForm<z.infer<typeof workspaceNameSchema>>({
    resolver: zodResolver(workspaceNameSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(values: z.infer<typeof workspaceNameSchema>) {
    startTransition(() => {
      updateWorkspaceName({ ...values, workspace_name })
        .then((data?: StatusResponseType) => {
          setError(data?.error)
          setSuccess(data?.success)
          if (data?.error) {
            toast(data.error)
          }
          if (data?.success) {
            redirect(`/${values.name}/settings`)
          }
        })
        .catch((error) => {
          toast({
            description: "An unexpected error occurred",
          })
        })
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Name</Label>
              <div className="flex gap-2">
                <FormControl>
                  <Input
                    placeholder="Workspace name"
                    {...field}
                    className="w-64"
                  />
                </FormControl>

                <Button type="submit" size="sm" disabled={isPending}>
                  {isPending && (
                    <Icons.spinner className="mr-2 size-4 animate-spin" />
                  )}
                  Change
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
