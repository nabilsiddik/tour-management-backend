import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 character." })
    .max(50, { message: "Name can not more than 50 character." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters long." })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[\W_]/, "Password must contain at least one special character."),
  phone: z
    .string()
    .regex(/^(?:\+880|880|0)(1[3-9]\d{8})$/, {
      message: "Invalid Phone Number",
    })
    .optional(),
  address: z
    .string()
    .min(200, {
      message: "Address cannot exced 200 characters.",
    })
    .optional(),
});



export const updateUserZodSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 character." })
    .max(50, { message: "Name can not more than 50 character." }).optional(),
  password: z
    .string()
    .min(8, { message: "Password must be minimum 8 characters long." })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[\W_]/, "Password must contain at least one special character.").optional(),
  phone: z
    .string()
    .regex(/^(?:\+880|880|0)(1[3-9]\d{8})$/, {
      message: "Invalid Phone Number",
    })
    .optional(),
  address: z
    .string()
    .min(200, {
      message: "Address cannot exced 200 characters.",
    })
    .optional(),
  role: z
    .enum(Object.values(Role) as [string])
    .optional(),
  isActive: z
    .enum(Object.values(IsActive) as [string])
    .optional(),
  isDeleted: z 
    .boolean()
    .optional(),
  isVerified: z
    .boolean()
    .optional()
});

