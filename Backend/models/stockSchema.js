const mdb=require("mongoose")
const stockSchema = new mdb.Schema({
    name: String,
    category: String,
    quantity: Number,
    price: Number
});

const Stock_Schema = mdb.model('Stock', stockSchema);

module.exports=Stock_Schema;