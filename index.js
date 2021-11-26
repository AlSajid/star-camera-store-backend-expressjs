const { response } = require('express');
const express = require('express')

const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

var cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@myfirstcluster.duw99.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("star-camera-store");
        const productCollection = database.collection("products");
        const usersCollection = database.collection("users");
        const orderCollection = database.collection("orders");
        const reviewCollection = database.collection("reviews");
        const adminCollection = database.collection("admins");

        //create new user
        app.post('/users', async (request, response) => {
            const user = request.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            response.json(result);
        });

        //add order
        app.post('/addOrder', async (request, response) => {
            const order = request.body;
            const result = await orderCollection.insertOne(order);
            console.log(result);
            response.json(result);
        });

        //add review
        app.post('/addReview', async (request, response) => {
            const review = request.body;
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            response.json(result);
        });

        //add a product
        app.post('/addAProduct', async (request, response) => {
            const product = request.body;
            const result = await productCollection.insertOne(product);
            console.log(result);
            response.json(result);
        });

        // get all reviews 
        app.get('/reviews', async (request, response) => {
            const cursor = reviewCollection.find({});
            const reviews = await cursor.toArray();
            response.send(reviews);
        });

        // get all products detail
        app.get('/products', async (request, response) => {
            const cursor = productCollection.find({});
            const products = await cursor.toArray();
            response.send(products);
        });

        // get specific products details
        app.get('/products/:id', async (request, response) => {
            const id = request.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productCollection.findOne(query);
            response.send(product);

        });

        // POST API
        app.get('/addServices', async (request, response) => {

            // create a document to insert
            const service = {
                title: "CANON EOS 2000D 24.1MP WITH 18-55MM KIT LENS FULL HD ,WI-FI DSLR CAMERA",
                include: [
                    "Model: Canon 2000D",
                    "Cmos 24.1 megapixel",
                    "Type Processor TDIGIC 4+",
                    "Aspect Ratio 3:2",
                    "7.5 cm TFT LCD"
                ],
                price: 41500,
                image: "https://www.startech.com.bd/image/cache/catalog/camera/dslr-camera/canon/2000d/2000d-500x500.jpg"
            }

            const result = await productCollection.insertOne(service);
            console.log(`A document was inserted with the _id: ${result.insertedId}`);
        })



        // get my order list
        app.get('/myOrder/:email', async (request, response) => {
            const email = request.params.email;
            const query = { email: email };
            const cursor = orderCollection.find(query);
            const myOrders = await cursor.toArray();
            response.send(myOrders);

        });

        app.post('/addAdmin', async (request, response) => {
            const admin = request.body;
            const result = await adminCollection.insertOne(admin);
            console.log(result);
            response.json(result);
        });

        // get admin
        app.get('/admin/:email', async (request, response) => {
            const email = request.params.email;
            const query = { admin: email };
            const cursor = adminCollection.find(query);
            const myOrders = await cursor.toArray();
            response.send(myOrders);
        });

        // get all order list
        app.get('/allOrder', async (request, response) => {
            const cursor = orderCollection.find({});
            const myOrders = await cursor.toArray();
            response.send(myOrders);

        });

        // delete specific order
        app.delete('/deleteOrder/:id', async (request, response) => {
            const id = request.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            response.json(result);
        })

        // ship specific order
        app.put('/shipOrder/:id', async (request, response) => {
            const id = request.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: false };
            const updateDoc = { $set: {status: "Shipped"} };
            const result = await orderCollection.updateOne(query, updateDoc, options);
            response.json(result);
        })

        // delete specific product
        app.delete('/deleteProduct/:id', async (request, response) => {
            const id = request.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            response.json(result);
        })


    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})