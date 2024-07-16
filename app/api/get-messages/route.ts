import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";
import { Prisma } from "@prisma/client";


export async function GET(req: Request) {
    const prisma =  await dbConnect()

    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    
    if(!session || !session.user) {
  
      return Response.json({
          success: false,
          message: "Not Authenticated"
      }, {
          status: 401
      })
    }
  
    const userId = user.id
    try {
        const messages = await prisma.message.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: Prisma.SortOrder.asc
            }
  
        })

        if(!messages || messages.length === 0) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 401
            })
        }

        return Response.json({
            success: true,
            message: messages
        }, {
            status: 200
        })
    } catch(error) {
        console.log(error)
        return Response.json({
            success: false,
            message: "Unexpected Error"
        }, {
            status: 500
        })
    }

}