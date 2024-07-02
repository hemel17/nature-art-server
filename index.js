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
    const userArtCollection = client.db("forestDB").collection("userArt");

    // find all documents
    app.get("/forest", async (req, res) => {
      const result = await forestCollection.find().toArray();
      res.send(result);
    });

    // find all user art documents
    app.get("/userArt", async (req, res) => {
      const result = await userArtCollection.find().toArray();
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

    // find a user art document
    app.get("/userArt/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userArtCollection.findOne(query);
      res.send(result);
    });

    // inset a document
    app.post("/forest", async (req, res) => {
      const newForest = req.body;
      console.log(newForest);
      const result = await forestCollection.insertOne(newForest);
      res.send(result);
    });

    // inset a user art document
    app.post("/userArt", async (req, res) => {
      const newArt = req.body;
      console.log(newArt);
      const result = await userArtCollection.insertOne(newArt);
      res.send(result);
    });

    // delete a doucment
    app.delete("/forest/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await forestCollection.deleteOne(query);
      res.send(result);
    });

    // delete a user art doucment
    app.delete("/userArt/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await userArtCollection.deleteOne(query);
      res.send(result);
    });

    // update a user art document
    app.put("/userArt/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedArt = req.body;
      const art = {
        $set: {
          email: updatedArt.email,
          name: updatedArt.displayName,
          customization: updatedArt.customization,
          image: updatedArt.image,
          item_name: updatedArt.item_name,
          subcategory_name: updatedArt.subcategory_name,
          price: updatedArt.price,
          rating: updatedArt.rating,
          short_description: updatedArt.short_description,
          processing_time: updatedArt.processing_time,
          stock_status: updatedArt.stock_status,
        },
      };
      const result = await userArtCollection.updateOne(filter, art, options);
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
