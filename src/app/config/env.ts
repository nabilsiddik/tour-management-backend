import dotenv from 'dotenv'
dotenv.config()

interface EnvConfig {
    PORT: string,
    MONGODB_URL: string,
    NODE_ENV: 'development' | 'production',
    BCRYPT_SALT_ROUND: number,
    JWT_ACCESS_EXPIRES: string,
    JWT_ACCESS_SECRET: string,
    SUPER_ADMIN_EMAIL: string,
    SUPER_ADMIN_PASSWORD: string,
    JWT_REFRESH_SECRET: string,
    JWT_REFRESH_EXPIRES: string,
    GOOGLE_CLIENT_ID: string,
    GOOGLE_CLIENT_SECRET: string,
    EXPRESS_SESSION_SECRET: string,
    GOOGLE_CALLBACK_URL: string,
    FRONT_END_URL: string,
    SSL: {
        SSL_STORE_ID: string,
        SSL_STORE_PASS: string,
        SSL_PAYMENT_API: string,
        SSL_VALIDATION_API: string,
        SSL_SUCCESS_BACKEND_URL: string,
        SSL_FAIL_BACKEND_URL: string,
        SSL_CANCLE_BACKEND_URL: string,
        SSL_SUCCESS_FRONTEND_URL: string,
        SSL_FAIL_FRONTEND_URL: string,
        SSL_CANCLE_FRONTEND_URL: string,
    }
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = ['PORT', 'MONGODB_URL', 'NODE_ENV', 'SUPER_ADMIN_EMAIL', 'SUPER_ADMIN_PASSWORD', 'JWT_REFRESH_SECRET', 'JWT_REFRESH_EXPIRES', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'EXPRESS_SESSION_SECRET', 'GOOGLE_CALLBACK_URL', 'FRONT_END_URL', 'SSL_STORE_ID', 'SSL_STORE_PASS', 'SSL_PAYMENT_API', 'SSL_VALIDATION_API', 'SSL_SUCCESS_BACKEND_URL', 'SSL_FAIL_BACKEND_URL', 'SSL_CANCLE_BACKEND_URL', 'SSL_SUCCESS_FRONTEND_URL', 'SSL_FAIL_FRONTEND_URL', 'SSL_CANCLE_FRONTEND_URL']

    requiredEnvVariables.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URL: process.env.MONGODB_URL as string,
        NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
        BCRYPT_SALT_ROUND: parseInt(process.env.BCRYPT_SALT_ROUND || '10'),
        JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
        JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,
        EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
        GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL as string,
        FRONT_END_URL: process.env.FRONT_END_URL as string,
        // ssl
        SSL: {
            SSL_STORE_ID: process.env.SSL_STORE_ID as string,
            SSL_STORE_PASS: process.env.SSL_STORE_PASS as string,
            SSL_PAYMENT_API: process.env.SSL_PAYMENT_API as string,
            SSL_VALIDATION_API: process.env.SSL_VALIDATION_API as string,

            SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL as string,
            SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL as string,
            SSL_CANCLE_BACKEND_URL: process.env.SSL_CANCLE_BACKEND_URL as string,
            SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL as string,
            SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL as string,
            SSL_CANCLE_FRONTEND_URL: process.env.SSL_CANCLE_FRONTEND_URL as string,
        }
        
    };
}

export const envVars = loadEnvVariables()