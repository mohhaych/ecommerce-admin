import {model, models, Schema} from 'mongoose';

const CategotySchema = new Schema({
    name: {type:String,required:true},
});

export const Category = models?.Category || model('Category',CategotySchema);