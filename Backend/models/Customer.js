const mdb = require('mongoose');

const customerSchema = new mdb.Schema({
  userId: String,
  name: String,
  email: String,
  phone: Number
 
});

const Customer = mdb.model('Customer', customerSchema);
module.exports = Customer;
