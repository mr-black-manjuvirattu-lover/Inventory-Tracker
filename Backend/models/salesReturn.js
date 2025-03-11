const mdb = require('mongoose');

const salesReturnSchema = new mdb.Schema({
  userId: String,
  customerId: String,
  customer: String,
  productId: String,
  product: String,
  quantity: Number,
  feedback: String,
  salesOrderId: String,
  returnDate: Date
});

const SalesReturn = mdb.model('SalesReturn', salesReturnSchema);

module.exports = SalesReturn;
