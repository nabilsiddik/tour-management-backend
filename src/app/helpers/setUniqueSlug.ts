import { IDivision } from "../modules/division/division.interface"
import { Division } from "../modules/division/division.model"

export const setUniqueSlug = async (payload: Partial<IDivision>) => {
    if (payload.name) {
        const baseSlug = payload.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`

        let counter = 0
        while (await Division.exists({ slug })) {
            slug = `${slug}-${counter++}`
        }

        payload.slug = slug
    }
}