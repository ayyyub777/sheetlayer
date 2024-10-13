import * as React from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Icons } from "../icons"

type ModalProps = {
  title: string
  description?: string
  children: React.ReactNode
  action?: {
    label: string
    disabled?: boolean
    onClick: () => void
    isPending?: boolean
    variant?:
      | "link"
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
  }
  isOpen: boolean
  onClose: () => void
}

export function Modal({
  title,
  description,
  children,
  action,
  isOpen,
  onClose,
}: ModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          <div>{children}</div>

          {action && (
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="link">Cancel</Button>
              </DialogClose>
              <Button
                disabled={action.disabled}
                onClick={action.onClick}
                variant={action?.variant || "default"}
              >
                {action.isPending && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                {action.label}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
        <div className="px-4 pb-4">{children}</div>
        {action && (
          <DrawerFooter className="pt-4">
            <Button
              disabled={action.disabled}
              onClick={action.onClick}
              variant={action?.variant || "default"}
            >
              {action.isPending && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {action.label}
            </Button>
            <DrawerClose asChild>
              <Button variant="link">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}
