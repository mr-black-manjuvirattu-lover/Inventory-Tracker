const mdb =require("mongoose")
const productSchema = new mdb.Schema({
  userId:String,
  name: String,
  category: String,
  price: Number
});

const product_Schema = mdb.model('Product', productSchema);

module.exports=product_Schema