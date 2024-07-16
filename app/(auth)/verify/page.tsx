"use client"

import { useToast } from "@/components/ui/use-toast"
import { verifySchema } from "@/schemas/verifySchema"

import { useSearchParams, useRouter } from "next/navigation"

import { useForm } from "react-hook-form"
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormItem, FormField, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const VerifyAccount = () => {
    const router = useRouter()
    const params = useSearchParams()
    const username = params.get("username")
    const {toast} = useToast()
   

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        
        
      })

      const onSubmit = async (data: z.infer<typeof verifySchema>) => {

        try {
        
          const response = await axios.post("/api/verify-code", {
                username: username,
                code: data.code
            })
            console.log("hello")

            toast({
                title: "Success",
                description: response.data.message
            })
          
            router.replace('/sign-in')
        } catch (error) {
        
            console.error("Error in signup of user", error)
    const axiosError = error as AxiosError<ApiResponse>
    let errorMessage = axiosError.response?.data.message
    toast({
      title: "Signup failed",
      description: errorMessage,
      variant: "destructive",
      duration: 3000
     
    })
 
        }
      }


    return <div className="flex justify-center items-center min-h-screen bg-gray-100">
       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                 Verify your Account
            </h1>
            <p className="mb-4">
                Enter the verification code
            </p>
        </div>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification Code</FormLabel>
              <FormControl>
                <Input placeholder="code" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>

       </div>
    </div>
}

export default VerifyAccount