const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDB connect

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.vgu9onq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const forestCollection = client.db("forestDB").collection("forest");

    // find all documents
    app.get("/forest", async (req, res) => {
      const result = await forestCollection.find().toArray();
      res.send(result);
    });

    // find a document
    app.get("/forest/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await forestCollection.findOne(query);
      res.send(result);
    });

    // inset a document
    app.post("/forest", async (req, res) => {
      const newForest = req.body;
      console.log(newForest);
      const result = await forestCollection.insertOne(newForest);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("nature art server is running");
});

app.listen(port, () => {
  console.log(`server is running at port : ${port}`);
});
