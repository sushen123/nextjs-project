import { dbConnect } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";

import bcrypt from 'bcryptjs'



export async function POST(req: Request) {
   const prisma =  await dbConnect()

    try{
        const {username, email, password} = await req.json() 
        const userExist = await prisma.user.findFirst({
            where: {
                username: username,
                isVerfied: true
            }
        })

        if(userExist) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, 
         {
            status: 400
         })
        }

       const existingUserByEmail = await prisma.user.findFirst({
            where: {
                email: email
            }
        })

        const verifyCode = Math.floor(100000 + Math.random() * 900000 ).toString()
        if(existingUserByEmail) {
            if(existingUserByEmail.isVerfied) {
                return Response.json({
                    success: false,
                    message: "User already exist with this email"
                }, {
                    status: 400
                })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10)

                await prisma.user.update({
                    where: {
                        email: email
                    },
                    data: {
                        username: username,
                        password: hashedPassword,
                        verifyCode: verifyCode,
                        verifyCodeExpiry: new Date(Date.now() + 3600000)  
                    }
                })
            }
    }
        else {
           const hashedPassword =   await bcrypt.hash(password, 10)
           const expiryDate = new Date()
           expiryDate.setHours(expiryDate.getHours() + 1)

          await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerfied: false,
                isAcceptingMessage: true,     
            }
           })
        }

       const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, {
                status: 500
            })
        }

        return Response.json({
            success: true,
            message: "User registered successfully, Please verify your email"
        }, {
            status: 200
        })



    }
     catch(error) {
        console.error("Error registering user", error)
        return Response.json({
            success: false,
            message: "Error registering user"
        }),
        {
            status: 500
        }
     }
}