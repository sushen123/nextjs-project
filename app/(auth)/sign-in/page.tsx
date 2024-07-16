"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from "next/link"

 import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Form, FormItem, FormField, FormControl, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { signInSchema } from "@/schemas/signinSchema"
import { signIn } from "next-auth/react"
import { PasswordInput } from "@/components/ui/password-input"
import { Loader2 } from "lucide-react"
import { useState } from "react"



export default function SigninForm() {
  
  
  const {toast} = useToast()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true)
   const result =  await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
    })
    if(result?.error) {
        if(result.error === "CredentialsSignin") {
            toast({
                title: "Login Failed",
                description: "Incorrect username or password",
                variant: "destructive"
            })
        }
    } else {
        toast({
            title: "Login Successfully",
            description: result?.error,
            variant: "default"
        })
    }

    setIsSubmitting(false)

    if(result?.url) {
        router.replace('/dashboard')
    }
  }

  
  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
       <div className="w-full max-w-md px-8 pt-4 pb-3 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-3xl mb-3">
            Join Mystery Message
          </h1>
          <p className="mb-3"> Sign In to start your anonymous adventure</p>
        </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
           
           <FormField
          control={form.control}
          name="identifier"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email or username"  {...field}  />
              </FormControl>
              <FormMessage />
            </FormItem>
    )}
  />
             <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput type="password"  placeholder="password"  {...field}  />
              </FormControl>
             
              <FormMessage />
            </FormItem>
            )}
          />
           <Button type="submit" disabled={isSubmitting} className="bg-yellow-300 text-slate-800  hover:bg-slate-950 hover:text-yellow-300 w-full">
            {
              isSubmitting ? (
                <>
                <Loader2 className="mr-2 h-4 animate-spin" /> Please wait
                </>
              ) : ('Signup')
            }
          </Button>
            </form>
          </Form>
          <div className="text-center mt-2">
              <p>
                Do not have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800">
                Sign Up
                </Link>
              </p>
          </div>
        </div> 
  </div>
}

