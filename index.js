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
    res.send('food delivery running')
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

        // get services
        app.get('/services', async (req, res) => {
            const cursor = courierCollection.find({})
            const services = await cursor.toArray()
            res.send(services)
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

    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.listen(port, (req, res) => {
    console.log('server running port', port);
})