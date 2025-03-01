const mdb=require("mongoose")
const SalesOrderSchema = new mdb.Schema({
    userId:String,
    productId:String,
    stockId:String,
    customerId:String,
    customer: String,
    product: String,
    quantity: Number,
    price: Number,
    totalPrice: Number,
    orderDate: String,
    returnDate: String,
    status: { type: String, default: 'Pending' }
  });
  const SalesOrder = mdb.model('SalesOrder', SalesOrderSchema);
  
  module.exports=SalesOrder;