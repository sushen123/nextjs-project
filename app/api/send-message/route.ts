import { dbConnect } from "@/lib/dbConnect";
import { messageSchema } from "@/schemas/messageSchema";

export async function POST(request: Request) {
    
    const prisma = await dbConnect()

    const {username, content} = await request.json()
    
    try {
         const user = await prisma.user.findFirst({
            where: {
                username: username
            }
         })
         if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
         }

         if(user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages"
            }, {
                status: 403
            })
          }
        
          
         const userId = user.id
         
         await prisma.message.create({
            data: {
                userId: userId,
                content: content,
                createdAt: new Date()
            }
         })


    } catch (error) {
        console.log("Error adding messages" , error)
        return Response.json({
            success: false,
            message: "Internal server  error"
        }, {
            status: 500
        })
    }
}