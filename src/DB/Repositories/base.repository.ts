import { FilterQuery, Model, ProjectionType, QueryOptions } from "mongoose";



export abstract class BaseRepository<T> {
    
    constructor(private model: Model<T>){}

    async createNewDocument(document:Partial<T>):Promise<T>{
        return await this.model.create(document)
    }

    async findOneDocument(filters:FilterQuery<T>, projection?:ProjectionType<T>, options?:QueryOptions<T>):Promise<T|null>{
        return await this.model.findOne(filters, projection, options)
    }

    findDocumentById(id: string){}


    updateOneDocument(document: T){}

    deleteOneDocument(document: T){}

    deleteMultipleDocuments(documents: T[]){}

    findAndUpdateDocument(document: T){}

    findAndDeleteDocument(document: T){}

    findDocuments(query: T){}

}
