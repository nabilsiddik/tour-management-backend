import dotenv from 'dotenv'
dotenv.config() 

interface EnvConfig{
    PORT: string,
    MONGODB_URL: string,
    NODE_ENV: 'development' | 'production',
    BCRYPT_SALT_ROUND: number,
    JWT_ACCESS_EXPIRES: string,
    JWT_ACCESS_SECRET: string
}

const loadEnvVariables = ():EnvConfig => {
    const requiredEnvVariables: string[]= ['PORT', 'MONGODB_URL', 'NODE_ENV']

    requiredEnvVariables.forEach(key => {
        if(!process.env[key]){
            throw new Error(`Missing require environment variable ${key}`)
        }
    })

    return {
    PORT: process.env.PORT as string,
    MONGODB_URL: process.env.MONGODB_URL as string,
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production',
    BCRYPT_SALT_ROUND: parseInt(process.env.BCRYPT_SALT_ROUND || '10'),
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string
  };
}

export const envVars = loadEnvVariables()