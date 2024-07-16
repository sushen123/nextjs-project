import { BlobOptions } from 'buffer';
import 'next-auth'
import { DefaultSession } from 'next-auth';
import { decl } from 'postcss';

declare module 'next-auth' {
    interface User {
        id?: number
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }

    interface Session {
        user: {
            id?: number
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        } & DefaultSession['user']
    }
}


declare module 'next-auth/jwt' {
    interface JWT {
        id?: number
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}