const mdb=require("mongoose")
const stockSchema = new mdb.Schema({
    userId: String,
    productId: String,
    productName: String,
    category: String,
    price: Number,
    quantity: Number

});

const Stock_Schema = mdb.model('Stock', stockSchema);

module.exports=Stock_Schema;