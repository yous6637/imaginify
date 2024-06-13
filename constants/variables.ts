


// Database Constants
export const DATABASE_URL = process.env.DATABASE_URL || "postgresql://yous6637:" +
    "U5F1WPyCVOqv@ep-gentle-cake-68965845.us-east-2.aws.neon.tech/imaginify?sslmode=require";

export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "whsec_i9T1/saJzoA77sKI7f3y33xhJkehKOQK";

export const NEXT_PUBLIC_CLERK_SIGN_IN_URL = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in"
export const NEXT_PUBLIC_CLERK_SIGN_UP_URL = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up"
export const NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || "/"
export const NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || "/"


// Chargily Constants

export const CHARGILY_SK = process.env.CHARGILY_SK || "test_sk_84hl2JihjzxatIXuLbo8AT9eibVjkA8QfUr0Stxu";
export const CHARGILY_WEBHOOK_URL= process.env.CHARGILY_WEBHOOK_URL
export const CHARGILY_SUCCESS_URL= process.env.CHARGILY_SUCCESS_URL || "https://picturify-jl36e47gp-yous6637s-projects.vercel.app/"
export const CHARGILI_FAIL_URL= process.env.CHARGILI_FAIL_URL
// Clerk Constants
export const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_dG91Y2hlZC1nbGlkZXItNjguY2xlcmsuYWNjb3VudHMuZGV2JA"
export const CLERK_SECRET_KEY=process.env.CLERK_SECRET_KEY || "sk_test_cpQXzmS7uKlBHHoH3Ou15nATjiuTLx4dqRSOtBb6dO"


// Cloudinary Constants
export const NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||  "dmdlhscju"
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY ||  "484329223714865"
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET ||  "Q2rFeJtw4MtJy1hPqA6UzgbYDqo"
export const CLOUDINARY_URL = process.env.CLOUDINARY_URL ||  "cloudinary://484329223714865:Q2rFeJtw4MtJy1hPqA6UzgbYDqo@dmdlhscju"

