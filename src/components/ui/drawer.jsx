'use client'

import { Drawer as VaulDrawer } from 'vaul'
import { cn } from '../../lib/utils'

const Drawer = VaulDrawer.Root
const DrawerTrigger = VaulDrawer.Trigger
const DrawerPortal = VaulDrawer.Portal
const DrawerClose = VaulDrawer.Close
const DrawerOverlay = VaulDrawer.Overlay

const DrawerContent = ({ className, children, ...props }) => (
  <DrawerPortal>
    <DrawerOverlay className="fixed inset-0 z-50 bg-black/40" />
    <VaulDrawer.Content
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-zinc-300 dark:bg-zinc-600" />
      {children}
    </VaulDrawer.Content>
  </DrawerPortal>
)

const DrawerHeader = ({ className, ...props }) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)

const DrawerFooter = ({ className, ...props }) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)

const DrawerTitle = ({ className, ...props }) => (
  <VaulDrawer.Title
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
)

const DrawerDescription = ({ className, ...props }) => (
  <VaulDrawer.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}