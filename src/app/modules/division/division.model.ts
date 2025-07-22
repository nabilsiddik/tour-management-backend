import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";
import { setUniqueSlug } from "../../helpers/setUniqueSlug";

const divisionSchema = new Schema<IDivision>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    thumbnail: { type: String },
    description: { type: String }
}, {
    timestamps: true,
    versionKey: false
})

// Pre hook for create or save a divition
divisionSchema.pre('save', async function (next) {
    if (this.isModified("name")) {
        const baseSlug = this.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`

        let counter = 0
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }

        this.slug = slug
    }
    next()
})


// Pre hook for update a divition
divisionSchema.pre('findOneAndUpdate', async function (next) {
    const division = this.getUpdate() as Partial<IDivision>
    if(division.name){
        const baseSlug = division.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`

        let counter = 0
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }

        division.slug = slug
    }
    this.setUpdate(division)
    next()
})

export const Division = model<IDivision>('Division', divisionSchema)