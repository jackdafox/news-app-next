"use client"

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import SyncSharpIcon from '@mui/icons-material/SyncSharp';
import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import WarningSharpIcon from '@mui/icons-material/WarningSharp';
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CheckCircleSharpIcon className="size-4" />,
        info: <InfoSharpIcon className="size-4" />,
        warning: <WarningSharpIcon className="size-4" />,
        error: <CancelSharpIcon className="size-4" />,
        loading: <SyncSharpIcon className="size-4 animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
