const express = require('express');
const dotenv = require('dotenv')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
dotenv.config()

const uri = process.env.MONGODB_URI;
const app = express()
const port = process.env.PORT;

app.use(cors())
app.use(express.json())

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    await client.connect();
    const db = client.db("car-rental")
    const carCollection = db.collection("cars")

   app.get('/car', async(req,res)=>{
    const result = await carCollection.find().toArray();
    res.send(result)
   })


    app.post('/car', async (req, res) => {
      const carData = req.body;
      console.log(carData)
      const result = await carCollection.insertOne(carData);
      res.send(result)
    })


    app.get('/car/:id', async(req,res)=>{
      const {id} = req.params;
      console.log(id)
      const result = await carCollection.findOne({_id: new ObjectId(id)})
      res.send(result)
    })



    app.patch('/car/:id', async(req,res)=>{
            const {id} = req.params;
            const updateData = req.body

            const result = await carCollection.updateOne(
              {_id: new ObjectId (id)},
              {$set: updateData}
            )

            res.send(result)
    } );

    app.delete('/car/:id', async(req,res)=>{
       const {id} = req.params;
       const result = await carCollection.deleteOne({_id: new ObjectId(id)})
       res.send(result)
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {

    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('server is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})