import { useTheme } from "@/hooks/useTheme"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      closeButton={true}
      richColors={true}
      expand={true}
      duration={5000}
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:p-4 group-[.toaster]:pr-12",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
          closeButton: "absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none text-white/80 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer text-lg"
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
