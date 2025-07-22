import { Query } from "mongoose";
import { excludeFields } from "../constants";

export class QueryBuilder<T>{
    public modelQuery: Query<T[], T>
    public readonly query: Record<string, string>

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>){
        this.modelQuery = modelQuery
        this.query = query
    }

    // Filter tour
    filter(): this{
        const filter = {...this.query}

        for (const field of excludeFields){
            delete filter[field]
        }

        this.modelQuery = this.modelQuery.find(filter)

        return this
    }

    // Search tour
    search(searchableFields: string[]): this{
        const searchTerm = this.query.searchTerm || ""
        const searchQuery = {
            $or: searchableFields.map(field => (
                {[field] : {$regex: searchTerm, $options: "i"}}
            ))
        }

        this.modelQuery = this.modelQuery.find(searchQuery)
        return this
    }


    // Sort tour
    sort(): this{
        const sort = this.query.sort || "-createdAt"
        this.modelQuery = this.modelQuery.sort(sort)
        return this
    }

    // Fields we want to show
    fields(): this{
        console.log(this.query.fields)
        const fields = this.query.fields?.split(",").join(" ") || ""
        this.modelQuery = this.modelQuery.select(fields)
        return this
    }

    // pagination
    paginate(): this{
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this
    }

    // Build the model
    build(){
        return this.modelQuery
    }

    // get all meta data
    async getMeta(){
        const totalDocuments: any = await this.modelQuery.model.countDocuments()
        console.log('totaldoc', totalDocuments)
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const totalPage = Math.ceil(totalDocuments / limit)

        return {
            page,
            limit,
            total: totalDocuments,
            totalPage
        }
    }
}