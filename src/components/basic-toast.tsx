"use client"

import { createToaster, Toaster, Toast } from "@ark-ui/react/toast"
import { Portal } from "@ark-ui/react/portal"
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

const toaster = createToaster({
  placement: "bottom-end",
  gap: 16,
  overlap: true,
})

type ToastType = "success" | "error" | "info" | "warning"

function getIcon(type: ToastType) {
  switch (type) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-500" />
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    default:
      return <Info className="w-4 h-4 text-blue-500" />
  }
}

export function useToast() {
  return {
    success: (title: string, description?: string) =>
      toaster.create({ title, description, type: "success" }),
    error: (title: string, description?: string) =>
      toaster.create({ title, description, type: "error" }),
    warning: (title: string, description?: string) =>
      toaster.create({ title, description, type: "warning" }),
    info: (title: string, description?: string) =>
      toaster.create({ title, description, type: "info" }),
  }
}

export function ToastProvider() {
  return (
    <Portal>
      <Toaster toaster={toaster}>
        {(toast) => (
          <Toast.Root className="bg-white rounded-lg shadow-md border border-gray-100 min-w-80 p-4 relative overflow-anywhere transition-all duration-300 ease-default will-change-transform h-(--height) opacity-(--opacity) translate-x-(--x) translate-y-(--y) scale-(--scale) z-(--z-index)">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {getIcon(toast.type as ToastType)}
              </div>

              <div className="flex-1">
                <Toast.Title className="text-gray-900 font-semibold text-sm">
                  {toast.title}
                </Toast.Title>
                {toast.description && (
                  <Toast.Description className="text-gray-600 text-sm mt-1">
                    {toast.description}
                  </Toast.Description>
                )}
              </div>

              <Toast.CloseTrigger className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600">
                <X className="w-3 h-3" />
              </Toast.CloseTrigger>
            </div>
          </Toast.Root>
        )}
      </Toaster>
    </Portal>
  )
}
