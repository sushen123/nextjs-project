import { AriaAttributes } from "react";


interface Message{
    content: string
    createdAt: Date
}

export interface ApiResponse {
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}

