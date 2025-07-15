import { envVars } from "../config/env"
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface"
import User from "../modules/user/user.model"
import bcrypt from 'bcryptjs'

export const seedSuperAdmin = async() => {
    try{
        const isSuperAdminExist = await User.findOne({email: envVars.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExist){
            console.log('Super admin already exist')
            return
        }

        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, 10)
        const authProvider: IAuthProvider = {
            provider: 'credentials',
            providerId: envVars.SUPER_ADMIN_EMAIL,
        }

        const payload: Partial <IUser> = {
            name: 'Super Admin',
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
            auths: [authProvider],
            isVerified: true
        }

        const superAdmin = await User.create(payload)

        console.log('super admin crated successfully', superAdmin)
    }catch(error){
        console.log(error)
    }
}