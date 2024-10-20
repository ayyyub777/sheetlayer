import { z } from "zod"

export const workspaceNameSchema = z.object({
  name: z.string().nonempty("Workspace name is required"),
})
