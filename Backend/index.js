const express = require('express');
const mdb = require('mongoose');
const cors = require('cors');
const dotenv=require('dotenv')
const bcrypt=require('bcrypt')
const Product=require('./models/productSchema')
const signup=require('./models/signupSchema')
const Stock=require('./models/stockSchema')
const app = express();

app.use(express.json());
app.use(cors());
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
  const { userId, name, category, price, quantity } = req.body;
  try {
      const newProduct = new Product({ userId, name, category, price, quantity });
      await newProduct.save();
      res.json(newProduct);
  } catch (error) {
      res.status(500).json({ error: 'Error adding product' });
  }
});

app.put('/products/:id', async (req, res) => {
  const { quantity } = req.body;
  try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
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

app.get('/stocks/:userId', async (req, res) => {
  try {
      const stocks = await Stock.find({ userId: req.params.userId });
      res.json(stocks);
  } catch (err) {
      res.status(500).json({ error: "Error fetching stocks" });
  }
});

app.post('/stocks', async (req, res) => {
  const { userId, name, category, quantity, price } = req.body;
  try {
      const newStock = new Stock({ userId, name, category, quantity, price });
      await newStock.save();
      res.status(201).json(newStock);
  } catch (err) {
      res.status(500).json({ error: "Error adding stock item" });
  }
});

app.put('/stocks/:id', async (req, res) => {
  const { quantity } = req.body;
  try {
      const updatedStock = await Stock.findByIdAndUpdate(req.params.id, { quantity }, { new: true });
      res.json(updatedStock);
  } catch (err) {
      res.status(500).json({ error: "Error updating stock" });
  }
});

app.delete('/stocks/:id', async (req, res) => {
  try {
      await Stock.findByIdAndDelete(req.params.id);
      res.json({ message: "Stock item deleted successfully" });
  } catch (err) {
      res.status(500).json({ error: "Error deleting stock item" });
  }
});


app.listen(PORT, () => {
  console.log('Server is running on http://localhost:',`${PORT}`);
});
