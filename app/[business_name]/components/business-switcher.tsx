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
import { Api, Business } from "@prisma/client"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface BusinessSwitcherProps extends PopoverTriggerProps {
  items: (Business & { apis: Api[] })[]
}

const capitalize = (str) => (str ? str[0].toUpperCase() + str.slice(1) : "")

const BusinessSwitcher = ({ className, items }: BusinessSwitcherProps) => {
  const params = useParams()
  const router = useRouter()

  const formattedItems = items.map((item) => ({
    name: item.name,
    apis: item.apis.length || 0,
  }))

  const currentBusiness = formattedItems.find(
    (item) => item.name === params?.business_name
  )

  const [open, setOpen] = React.useState(false)

  const onBusinessSelect = (business) => {
    setOpen(false)
    router.push(`/${business.name}/apis`)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-[60px] w-full justify-between px-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm uppercase">
            {currentBusiness?.name.charAt(0).toUpperCase()}
          </div>

          <div className="ml-2 flex flex-col text-left">
            <span>{capitalize(currentBusiness?.name)}</span>
            <span className="text-xs font-normal leading-none text-muted-foreground">
              {currentBusiness?.apis || 0} APIs
            </span>
          </div>
          <Icons.chevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search business..." />
            <CommandEmpty>No business found.</CommandEmpty>
            <CommandGroup>
              {formattedItems.map((business) => (
                <CommandItem
                  key={business.name}
                  onSelect={() => onBusinessSelect(business)}
                  className="cursor-pointer text-sm font-medium"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm uppercase">
                    {currentBusiness?.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="ml-2 flex flex-col text-left">
                    <span>{capitalize(business.name)}</span>
                    <span className="text-xs font-normal leading-none text-muted-foreground">
                      {business?.apis || 0} APIs
                    </span>
                  </div>
                  <Icons.check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentBusiness?.name === business.name
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
                <Icons.add className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Add business</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default BusinessSwitcher
