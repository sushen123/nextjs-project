import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import { dbConnect, prisma } from "@/lib/dbConnect";
import { error } from "console";


export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type:"password"}
            },
            async authorize(credentials: any): Promise<any> {
                
                await dbConnect()
                try {
                 const user = await prisma.user.findFirst({
                       where: {
                        OR: [
                            {
                               email:credentials.identifier 
                            },
                             {
                                username: credentials.identifier
                            }
                        ]
                       } 
                    })

                    if(!user) {
                        throw new Error("No user found with this email")
                    }

                    if(!user.isVerfied) {
                        throw new Error("Please verify your account before login")
                    }

                const passwordMatch = await bcrypt.compare(credentials.password, user.password )

                if(passwordMatch) {
                    return user
                }
                else {
                    throw new Error("Incorrect password")
                }
                }
                catch(error:any) {
                    throw new error
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user) {
                token.id = user.id?.toString()
                token.isVerified = user.isVerified
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username
            }
            

            return token
        },
        async session({session, token }) {
            if(token) {
                session.user.id = token.id
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessages = token.isAcceptingMessages
                session.user.username = token.username
            }
        
            return session
        }
       
    },
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-in'
    },
    session: {
        strategy: "jwt"
    }, 
    secret: process.env.NEXTAUTH_SECRET
}
