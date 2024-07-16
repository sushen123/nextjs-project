import { resend } from "./resend";

import VerificationEmail from "@/email/Verificationemail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username: username, otp:verifyCode})
        })
        return {success: true, message: "Verification send successfully"}

    } catch(error) {
        console.error("Error sending verification email", error)
        return {success:false, message: "Failed to send  verification email" }
    }
}