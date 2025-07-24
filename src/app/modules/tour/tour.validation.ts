import { Types } from "mongoose";
import z from "zod";

// Zod schema for tour
export const createTourZodSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  endDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  division: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid division ObjectId",
  }),
  tourType: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid tourType ObjectId"
  }),
  departureLocation: z.string().optional(),
  arivalLocation: z.string().optional()
});

// zod schema for update tour
export const updateTourZodSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  costFrom: z.number().optional(),
  startDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  endDate: z.preprocess(
    (val) => (val ? new Date(val as string) : undefined),
    z.date().optional()
  ),
  included: z.array(z.string()).optional(),
  excluded: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  tourPlan: z.array(z.string()).optional(),
  maxGuest: z.number().optional(),
  minAge: z.number().optional(),
  division: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid division ObjectId",
  }).optional(),
  tourType: z.string().refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid tourType ObjectId"
  }).optional(),
  departureLocation: z.string().optional(),
  arivalLocation: z.string().optional(),
  deleteImages: z.array(z.string()).optional()
});

// zod schema for tour type
export const createTourTypeZodSchema = z.object({
    name: z.string(),
});
