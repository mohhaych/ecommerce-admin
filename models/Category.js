import mongoose, {model, models, Schema} from 'mongoose';

const CategotySchema = new Schema({
    name: {type:String,required:true},
    parent: {type:mongoose.Types.ObjectId, ref:'Category'},
    properties: [{type:Object}]
});

export const Category = models?.Category || model('Category',CategotySchema);