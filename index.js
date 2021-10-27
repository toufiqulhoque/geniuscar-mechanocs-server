const express = require('express')
//mongodb atlas connect
const { MongoClient } = require('mongodb');
//To Get single id
const ObjectId = require('mongodb').ObjectId;
//cors middleware
const cors = require('cors')
//dotenv from dotenv website
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
//cors middleware
app.use(cors())
app.use(express.json())

//mongodb atlas connect
//username and password should be protected using env
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0pybo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


//Resource/ DRIVER/ INSERT a DOCUMENT
async function run() {
    try {
        //connection to mongo db
        await client.connect()
        const database = client.db('carMechanic');
        const servicesCollection = database.collection('services');


        //Get API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray()
            res.send(services)
        });
        //Get single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)
        })

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;

            console.log('hit the post', service)
            //create a doc to insert


            const result = await servicesCollection.insertOne(service)
            console.log(result)
            res.json(result)
        });

        //DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query)
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);

//we are checking local host working no not.....

app.get('/', (req, res) => {
    res.send('Running genius server')
})


//Port listen korbe

app.listen(port, () => {
    console.log('Running Genius server port', port)
})