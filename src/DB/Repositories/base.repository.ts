import mongoose, { FilterQuery, Model, ProjectionType, QueryOptions ,UpdateQuery} from "mongoose";



export abstract class BaseRepository<T> {
    
    constructor(private model: Model<T>){}

    async createNewDocument(document:Partial<T>):Promise<T>{
        return await this.model.create(document)
    }

    async findOneDocument(filters:FilterQuery<T>, projection?:ProjectionType<T>, options?:QueryOptions<T>):Promise<T|null>{
        return await this.model.findOne(filters, projection, options)
    }

    async findDocumentById(id: mongoose.Schema.Types.ObjectId, projection?:ProjectionType<T>, options?:QueryOptions<T>):Promise<T|null>{
        return await this.model.findById(id, projection, options)
    }

    async findByIdAndDeleteDocument(id: mongoose.Schema.Types.ObjectId){
        return await this.model.findByIdAndDelete(id)
    }

    async updateOneDocument(filters:FilterQuery<T>, updateObject:UpdateQuery<T>, options?:QueryOptions<T>){
        return await this.model.findOneAndUpdate(filters, updateObject, options)
    }

    deleteOneDocument(document: T){}

    deleteMultipleDocuments(documents: T[]){}

    findAndUpdateDocument(document: T){}

    findDocuments(filters:FilterQuery<T> = {}, projection?:ProjectionType<T>, options?:QueryOptions<T>):Promise<T[] | []>{
        return this.model.find(filters, projection, options)
    }

}
