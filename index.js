const express = require('express')
const app = express()
const { MongoClient } = require('mongodb');
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 5000
const cors = require('cors')
app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
    res.send('courier running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gzjd3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db("courierService");
        const courierCollection = database.collection("courier");
        const agentCollection = database.collection("agent")
        const deliventureCollection = database.collection("deliventure")
        const orderCollection = database.collection("order")
        const pricingCollection = database.collection("pricing")

        // get services
        app.get('/services', async (req, res) => {
            const cursor = courierCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
        })

        // get pricing
        app.get('/pricing', async (req, res) => {
            const cursor = pricingCollection.find({})
            const pricing = await cursor.toArray()
            res.send(pricing)
        })

        // get service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await courierCollection.findOne(query)
            res.send(result)
        })
        // get agent collection 
        app.get('/agents', async (req, res) => {
            const cursor = agentCollection.find({})
            const agents = await cursor.toArray()
            res.send(agents)
        })
        // get deliventure using get method
        app.get('/deliventure', async (req, res) => {
            const cursor = deliventureCollection.find({})
            const deliventure = await cursor.toArray()
            res.send(deliventure)
        })
        // post details
        app.post('/order', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            console.log('hittin service', order)
            res.json(result)
        })

        // get order
        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({})
            const order = await cursor.toArray()
            res.send(order)
        })

        // add service
        app.post('/services', async (req, res) => {
            const service = req.body
            const result = await courierCollection.insertOne(service)
            console.log('hittin service', service)
            res.json(result)
        })

        // delete order
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            console.log('deleting user with id', result);
            res.json(result)
        })

        // update orders
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const updateStatus = {
                $set: {
                    status: "Approved"
                },
            }
            const result = await orderCollection.updateOne(filter, updateStatus)
            res.send(result)
        })

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log('server running port', port);
})