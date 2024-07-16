import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "./input"
import { EyeIcon, EyeOffIcon } from "lucide-react"

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
   
  }

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    return   <Input type={showPassword ? "text" : "password"}  suffix={showPassword ? <EyeIcon className="select-none border h-10 rounded-r-md w-10 px-2 cursor-pointer" onClick={() => setShowPassword(false)} /> :  <EyeOffIcon className="select-none border h-10 rounded-r-md w-10 px-2 cursor-pointer" onClick={() => setShowPassword(true) } />} className={className} {...props} ref={ref} />
    
  }
)
PasswordInput.displayName = "PasswordInput"

export {PasswordInput}
