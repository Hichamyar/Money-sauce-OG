"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/lib/finance-store"
import { HardDrive, Cloud } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function FirstTimePrompt() {
  const [open, setOpen] = useState(false)
  const { settings, updateSettings } = useFinanceStore()
  const { toast } = useToast()

  useEffect(() => {
    // Only show the prompt if it's the first time
    if (!settings.firstTimeSetupCompleted) {
      setOpen(true)
    }
  }, [settings.firstTimeSetupCompleted])

  const handleChoice = (choice: "local" | "google") => {
    if (choice === "google") {
      toast({
        title: "Google Integration",
        description:
          "This is a demo feature. In a production app, this would connect to Google for authentication and data syncing.",
        duration: 5000,
      })
    }

    updateSettings({
      dataLocation: choice,
      firstTimeSetupCompleted: true,
    })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Hicham's Money Sauce!</DialogTitle>
          <DialogDescription>Choose how you'd like to store your financial data:</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4 sm:grid-cols-2">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 p-4 gap-2"
            onClick={() => handleChoice("local")}
          >
            <HardDrive className="h-8 w-8" />
            <span className="font-medium">Use Locally</span>
            <span className="text-xs text-center text-muted-foreground">Stores all data on this device only</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-32 p-4 gap-2"
            onClick={() => handleChoice("google")}
          >
            <Cloud className="h-8 w-8" />
            <span className="font-medium">Connect with Google</span>
            <span className="text-xs text-center text-muted-foreground">
              Backs up data to the cloud, access from any device
            </span>
          </Button>
        </div>
        <p className="text-xs text-center text-muted-foreground">
          You can change this setting later in the Settings page.
        </p>
      </DialogContent>
    </Dialog>
  )
}
