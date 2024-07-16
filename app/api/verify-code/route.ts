import { dbConnect } from "@/lib/dbConnect";


export async function POST(req: Request)  {

    const prisma = await dbConnect()

    try {
        const {username, code} = await req.json()
        console.log({username, code})
        const decodedUsername = decodeURIComponent(username)
     
        const user = await prisma.user.findFirst({
           where: {
            username: decodedUsername
           }
        })
        
        if(!user) {
            return Response.json({
                success: false,
                message: "Error verifying user"
            }, {
                status: 500
            })
        }

        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()
        console.log(isCodeNotExpired)
        console.log(user.verifyCode)

        if(isCodeValid && isCodeNotExpired){
         await prisma.user.update({
            where: {
               username: decodedUsername
            },
            data: {
                isVerfied: true
            }
         })

         return Response.json({
            success: true,
            message: "Account verified"
         }, 
        {
            status: 200
        })
    
        }
        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code has expired, please signup again to get a new code"
             }, 
            {
                status: 400
            })
        } 
        else {
            return Response.json({
                success: false,
                message: "Incorrect Verification code"
             }, 
            {
                status: 400
            })
        }


    }
     catch(error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        }, {
            status: 500
        })
     }
}