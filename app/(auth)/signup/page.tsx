"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceCallback} from 'usehooks-ts'

 import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema"
import axios from 'axios'
import { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormItem, FormField, FormControl, FormDescription, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { PasswordInput } from "@/components/ui/password-input"


export default function SignupForm() {
  const [username, setUsername] = useState("")
  const [usernameMessage, setUsernameMessage] = useState("")
  const [isCheckingUsername, setIsCheckingUsername]  = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const debounced = useDebounceCallback(setUsername, 400)
  const {toast} = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if(username) {
        setIsCheckingUsername(true)
        setUsernameMessage('')
        try {

       const response = await axios.get(`/api/check-username?username=${username}&code=123`)
       setUsernameMessage(response.data.message)
      
        } catch (error) {
          
          setUsernameMessage("Error checking username")
        } 
        finally {
          setIsCheckingUsername(false)
        }
      } 
        }

          checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
   try {
     
  const response =  await axios.post<ApiResponse>('/api/signup', data)
  toast({
    title: 'Success',
    description: response.data.message
  })
  setIsSubmitting(false)
  console.log(username)
  router.replace(`/verify?username=${username}`)
  

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
    setIsSubmitting(false) 
   }
    
  }

  
  return <div className="flex justify-center items-center min-h-screen bg-gray-100">
       <div className="w-full max-w-md px-8 pt-4 pb-3 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-3xl mb-3">
            Join Mystery Message
          </h1>
          <p className="mb-3"> Sign Up to start your anonymous adventure</p>
        </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
          control={form.control}
          name="username"
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username"  {...field}
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
              </FormControl>
              {isCheckingUsername && <Loader2 className="animate-spin"/> }  
             <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500': 'text-red-500' }`}>
                {usernameMessage}
             </p>
              <FormMessage />
            </FormItem>
    )}
  />
           <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email123@gmail.com"  {...field}  />
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
                Already have an account?{' '}
                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                Sign in
                </Link>
              </p>
          </div>
        </div> 
  </div>
}

