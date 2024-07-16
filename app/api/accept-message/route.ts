import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

import { dbConnect } from "@/lib/dbConnect";
import { User } from "next-auth";


export async function  POST(req: Request) {
    
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
  const {acceptMessages} = await req.json()

  try {
   const updatedUser =  await prisma.user.update({
     where: {
        id: userId
     },
     data: {
        isAcceptingMessage: acceptMessages
     }
    }) 

    if(!updatedUser) {
        return Response.json({
            success: false,
            message: "Failed to update user status to accept messages"
        }, {
            status: 401
        })
    }

    return Response.json({
        success: true,
        message: "Message status updated successfully",
        updatedUser
    }, {
        status: 200
    })


  }
  catch(error) {
    console.log("Failed to update user status to accept messages")
    return Response.json({
        success: false,
        message: "Failed to updated user status to accept messages"
    }, {
        status: 500
    })
  }

  

}


export async function  GET(req: Request) {
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
       
    
   const foundUser =  await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!foundUser) {
        return Response.json({
            success: false,
            message: "User not found"
        }, {
            status: 404
        })
    }

    return Response.json({
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage
    }, {
        status: 200
    })


    } catch(error ) {
        console.log("Failed to update user status to accept messages")
    return Response.json({
        success: false,
        message: "Error while getting message acceptance status"
    }, {
        status: 500
    })
    }

    
}