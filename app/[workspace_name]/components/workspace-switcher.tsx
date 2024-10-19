"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useParams, useRouter } from "next/navigation"
import { Icons } from "@/components/icons"
import { Api, Workspace } from "@prisma/client"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface workspaceSwitcherProps extends PopoverTriggerProps {
  items: (Workspace & { apis: Api[] })[]
}

const capitalize = (str) => (str ? str[0].toUpperCase() + str.slice(1) : "")

const WorkspaceSwitcher = ({ className, items }: workspaceSwitcherProps) => {
  const params = useParams()
  const router = useRouter()

  const formattedItems = items.map((item) => ({
    name: item.name,
    apis: item.apis.length || 0,
  }))

  const currentworkspace = formattedItems.find(
    (item) => item.name === params?.workspace_name
  )

  const [open, setOpen] = React.useState(false)

  const onworkspaceSelect = (workspace) => {
    setOpen(false)
    router.push(`/${workspace.name}/apis`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[52px] w-full justify-between px-3"
        >
          {/* <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm uppercase">
            {currentworkspace?.name.charAt(0).toUpperCase()}
          </div> */}

          <div className="ml-1 flex flex-col text-left">
            <span>{capitalize(currentworkspace?.name)}</span>
            <span className="text-xs font-normal leading-none text-muted-foreground">
              {currentworkspace?.apis || 0} APIs
            </span>
          </div>
          <Icons.chevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search workspace..." />
            <CommandEmpty>No workspace found.</CommandEmpty>
            <CommandGroup>
              {formattedItems.map((workspace) => (
                <CommandItem
                  key={workspace.name}
                  onSelect={() => onworkspaceSelect(workspace)}
                  className="cursor-pointer text-sm font-medium"
                >
                  {/* <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm uppercase">
                    {currentworkspace?.name.charAt(0).toUpperCase()}
                  </div> */}

                  <div className="ml-1 flex flex-col text-left">
                    <span>{capitalize(workspace.name)}</span>
                    <span className="text-xs font-normal leading-none text-muted-foreground">
                      {workspace?.apis || 0} APIs
                    </span>
                  </div>
                  <Icons.check
                    className={cn(
                      "ml-auto size-4",
                      currentworkspace?.name === workspace.name
                        ? "opacity-50"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem className="cursor-pointer">
                <Icons.add className="mr-2 size-4" />
                <span className="text-sm font-medium">Add workspace</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default WorkspaceSwitcher
