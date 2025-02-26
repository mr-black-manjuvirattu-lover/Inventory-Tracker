const mdb =require("mongoose")
const productSchema = new mdb.Schema({
  name: String,
  category: String,
  price: Number,
  quantity: Number,
});

const product_Schema = mdb.model('Product', productSchema);

module.exports=product_Schema