import { dbConnect } from "@/lib/dbConnect";

import {z} from 'zod'
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

   
    
    const prisma = await dbConnect()

    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

    const result = UsernameQuerySchema.safeParse(queryParam)
    console.log(result) // remove
    if(!result.success) {
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query paramters'
        }, {
            status: 400
        })
    }

    const {username} = result.data
  

    const existingVerifiedUser = await prisma.user.findFirst({
        where: {
            username,
            isVerfied: true
        }
    })
  

    if(existingVerifiedUser) {
        return Response.json({
            success: false,
            message: "Username already exists"
        })
    }

    return Response.json({
        success: true,
        message: "Username is unique"
    })

    } catch(error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking uesrname"
        }, {
            status: 500
        })
    }
}