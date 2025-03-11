const express = require('express');
const mdb = require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv')
const bcrypt=require('bcrypt')
const Product=require('./models/productSchema')
const signup=require('./models/signupSchema')
const Stock=require('./models/stockSchema')
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const Customer = require('./models/Customer');
const SalesOrder=require('./models/SalesOrderSchema')
const SalesReturn=require('./models/salesReturn');
const app = express();

app.use(express.json());

// const corsOptions={
//     origin: ['https://inventory-tracker-two-mocha.vercel.app', 'http://localhost:5173'],
//     methods: ['GET', 'POST','PUT','DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//  };
 
// app.use(cors(corsOptions))
app.use(cors())

dotenv.config()

const PORT=process.env.PORT||3001

mdb.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.post('/login',async (req,res)=>{
    try{
        const {Email,Password}=req.body
        const existingUser=await signup.findOne({Email:Email})
        console.log(existingUser)
        if(existingUser){
            const isValidPassword=bcrypt.compare(Password,existingUser.Password)
            if(isValidPassword){
                res.status(201).json({message:"Login Successful",isLoggedin:true,userName: existingUser.Name,userId:existingUser._id})
            }else{
                res.status(201).json({message:"Invalid Credentials",isLoggedin:false})
            }
        }else{
            res.status(201).json({message:"User Not Found",isLoggedin:false})
        }

    }catch(err){
        console.log("Error Occured in Login: ",err)
    }
})

app.post('/signup',async (req,res)=>{
    try{
        const {Name,Email,Password,PhoneNumber}=req.body
        const hashedPassword=await bcrypt.hash(Password,10)
        const newSignup=new signup({
            Name:Name,
            Email:Email,
            Password:hashedPassword,
            PhoneNumber:PhoneNumber
        })
        await newSignup.save()
        console.log("signup Successfully")
        res.status(201).json({message:"signup Successful",isSignup:true})
    }catch(err){
        console.log("Error Occured in Signup: ",err)
        res.status(201).json({message:"signup unSuccessful",isSignup:false})

    }
})

app.get('/products/:userId', async (req, res) => {
  try {
      const products = await Product.find({ userId: req.params.userId });
      res.json(products);
  } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
  }
});

app.post('/products', async (req, res) => {
  const { userId, name, category, price } = req.body;
  try {
      const newProduct = new Product({ userId, name, category, price });
      await newProduct.save();
      res.json(newProduct);
  } catch (error) {
      res.status(500).json({ error: 'Error adding product' });
  }
});

app.put('/products/:id', async (req, res) => {
    const { name, category, price} = req.body;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            { name, category, price},
            { new: true }
        );
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error updating product' });
    }
});
  

app.delete('/products/:id', async (req, res) => {
  try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error deleting product' });
  }
});

app.get("/products/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      res.status(500).json({ error: "Error fetching product" });
    }
});

app.get('/stocks/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const stocks = await Stock.find({ userId });
      res.json(stocks);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching stock data' });
    }
});
  

app.post("/stocks", async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ error: "Not enough stock available" });
        }

        const newStock = new Stock({
            userId,
            productId,
            productName: product.name,
            category: product.category,
            price: product.price,
            quantity,
        });

        await newStock.save();

        product.stock -= quantity;
        await product.save();

        res.status(201).json(newStock);
    } catch (err) {
        res.status(500).json({ error: "Error adding stock item" });
    }
});

app.put("/stocks/:id", async (req, res) => {
    const { quantity } = req.body;
    try {
        const stockItem = await Stock.findById(req.params.id);
        if (!stockItem) {
        return res.status(404).json({ error: "Stock item not found" });
        }

        const product = await Product.findById(stockItem.productId);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        const difference = quantity - stockItem.quantity;
        if (product.stock < difference) {
            return res.status(400).json({ error: "Not enough stock available" });
        }

        stockItem.quantity = quantity;
        await stockItem.save();

        product.stock -= difference;
        await product.save();

        res.json(stockItem);
    } catch (err) {
        res.status(500).json({ error: "Error updating stock" });
    }
});

app.delete("/stocks/:id", async (req, res) => {
    try {
        const stockItem = await Stock.findById(req.params.id);
        if (!stockItem) {
            return res.status(404).json({ error: "Stock item not found" });
        }

        const product = await Product.findById(stockItem.productId);
        if (product) {
            product.stock += stockItem.quantity;
            await product.save();
        }

        await Stock.findByIdAndDelete(req.params.id);

        res.json({ message: "Stock item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting stock item" });
    }
});

app.get('/reports', async (req, res) => {
    try {
        const { userId, type, format } = req.query;
        let data = [];

        if (type === 'products' || type === 'both') {
            const products = await Product.find({ userId });
            data.push({ category: 'Products', items: products });
        }
        if (type === 'stocks' || type === 'both') {
            const stocks = await Stock.find({ userId });
            data.push({ category: 'Stocks', items: stocks });
        }

        if (format === 'json') {
            return res.json(data);
        }

        if (format === 'csv') {
            const parser = new Parser();
            const csvData = parser.parse(data.flatMap(d => d.items));
            res.header('Content-Type', 'text/csv');
            res.attachment('report.csv');
            return res.send(csvData);
        }

        if (format === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
            doc.pipe(res);
            doc.fontSize(14).text('Inventory Report', { align: 'center' });
            data.forEach(({ category, items }) => {
                doc.moveDown().fontSize(12).text(`${category}:`);
                items.forEach((item, index) => {
                    doc.fontSize(10).text(`${index + 1}. ${item.name} - ${item.quantity} units`);
                });
            });
            doc.end();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error generating report' });
    }
});
  
app.post('/customers', async (req, res) => {
    try {
        console.log("Incoming Request to /customers:", req.body);

        const { userId, name, email, phone } = req.body;

        if (!userId || !name || !email || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newCustomer = new Customer({ userId, name, email, phone });
        await newCustomer.save();
        
        console.log("Customer added successfully:", newCustomer);
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error("Error adding customer:", error);
        res.status(500).json({ error: "Error adding customer" });
    }
});

app.get('/customers/:userId', async (req, res) => {
    try {
        const customers = await Customer.find({ userId: req.params.userId });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching customers' });
    }
});

app.put('/customers/:id', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCustomer);
    } catch (error) {
        res.status(500).json({ error: 'Error updating customer' });
    }
});

app.delete('/customers/:id', async (req, res) => {
    try {
        await Customer.findByIdAndDelete(req.params.id);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting customer' });
    }
});

app.post('/salesorder/:id', async (req, res) => {
    try {
      const { 
        userId, 
        productId, 
        stockId, 
        customerId, 
        customer, 
        product, 
        quantity, 
        price, 
        orderDate, 
        returnDate, 
        status 
      } = req.body;
  
      const totalPrice = price * quantity;
  
      const stockItem = await Stock.findById(stockId);
  
      if (!stockItem) {
        return res.status(400).json({ error: 'Stock not found' });
      }
  
      if (stockItem.quantity < quantity) {
        return res.status(400).json({ error: 'Not enough stock available' });
      }
  
      const newOrder = new SalesOrder({
        userId,
        productId,
        stockId,
        customerId,
        customer,
        product,
        quantity,
        price,
        totalPrice,
        orderDate,
        returnDate,
        status
      });
  
      const savedOrder = await newOrder.save();
  
      stockItem.quantity -= quantity;
      await stockItem.save();
  
      res.status(201).json({ message: 'Sales order created and stock updated', order: savedOrder });
  
    } catch (error) {
      console.error('Error creating sales order:', error);
      res.status(500).json({ error: 'Server error' });
    }
});
 
app.get('/salesorder/:id', async (req, res) => {
try {
    const orders = await SalesOrder.find({ userId: req.params.id });
    res.json(orders);
} catch (error) {
    res.status(500).json({ error: "Error fetching sales orders" });
}
});
  
app.post('/salesreturn/:userId', async (req, res) => {
    const { userId } = req.params;
    const { customerId, customer, productId, product, quantity, feedback, salesOrderId } = req.body;
  
    try {
      const salesReturn = new SalesReturn({
        userId,
        customerId,
        customer,
        productId,
        product,
        quantity,
        feedback,
        salesOrderId,  
        returnDate: new Date()
      });
  
      await salesReturn.save();
  
      res.status(201).json({ message: 'Sales return recorded', salesReturn });
    } catch (err) {
      res.status(500).json({ message: 'Error saving sales return', error: err.message });
    }
});

app.put('/updatestock/:id', async (req, res) => {
    const { stockId, quantity } = req.body;
    console.log('Request body:', req.body);
  
    try {
        const stock = await Stock.findById(stockId);
  
        if (!stock) {
          return res.status(404).json({ message: 'Stock not found' });
        }
  
        stock.quantity += parseInt(quantity, 10);
        await stock.save();
  
        res.status(200).json({ message: 'Stock updated successfully', stock });
    } catch (err) {
        console.error('Error updating stock:', err); 
        res.status(500).json({ message: 'Error updating stock', error: err.message });
    }
});

app.put('/updatesalesorder/:id', async (req, res) => {
    const { id } = req.params;  
    const { status } = req.body;  
  
    try {
      const salesOrder = await SalesOrder.findById(id);
  
      if (!salesOrder) {
        return res.status(404).json({ message: 'Sales order not found' });
      }
  
      salesOrder.status = status;
      await salesOrder.save();
  
      res.status(200).json({ message: 'Sales order updated successfully', salesOrder });
    } catch (err) {
      res.status(500).json({ message: 'Error updating sales order', error: err.message });
    }
});  

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:',`${PORT}`);
});
