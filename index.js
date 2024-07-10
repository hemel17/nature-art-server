const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://nature-art-8a756.web.app",
      "https://nature-art-8a756.firebaseapp.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "X-Requested-With",
      "Accept",
      "x-client-key",
      "x-client-token",
      "x-client-secret",
      "Authorization",
    ],
    credentials: true,
  })
);
app.use(express.json());

// MongoDB connection URI
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
    // Connect the client to the server
    // await client.connect();
    console.log("Connected to MongoDB!");

    const db = client.db("forestDB");
    const collections = {
      forest: db.collection("forest"),
      abstract: db.collection("abstract"),
      architecture: db.collection("architecture"),
      floral: db.collection("floral"),
      mountain: db.collection("mountain"),
      realistic: db.collection("realistic"),
      userArt: db.collection("userArt"),
    };

    // Generic function to handle GET requests for collections
    const handleGetCollection = (collectionName) => async (req, res) => {
      try {
        const result = await collections[collectionName].find().toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    };

    // Routes for fetching all documents in collections
    app.get("/forest", handleGetCollection("forest"));
    app.get("/abstract", handleGetCollection("abstract"));
    app.get("/architecture", handleGetCollection("architecture"));
    app.get("/floral", handleGetCollection("floral"));
    app.get("/mountain", handleGetCollection("mountain"));
    app.get("/realistic", handleGetCollection("realistic"));
    app.get("/userArt", handleGetCollection("userArt"));

    // Generic function to handle GET requests for individual documents
    const handleGetDocument = (collectionName) => async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections[collectionName].findOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    };

    // Routes for fetching individual documents
    app.get("/forest/:id", handleGetDocument("forest"));
    app.get("/abstract/:id", handleGetDocument("abstract"));
    app.get("/architecture/:id", handleGetDocument("architecture"));
    app.get("/floral/:id", handleGetDocument("floral"));
    app.get("/mountain/:id", handleGetDocument("mountain"));
    app.get("/realistic/:id", handleGetDocument("realistic"));
    app.get("/userArt/:id", handleGetDocument("userArt"));

    // Insert a document
    app.post("/forest", async (req, res) => {
      try {
        const newForest = req.body;
        const result = await collections.forest.insertOne(newForest);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Insert a user art document
    app.post("/userArt", async (req, res) => {
      try {
        const newArt = req.body;
        const result = await collections.userArt.insertOne(newArt);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Delete a document
    const handleDeleteDocument = (collectionName) => async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await collections[collectionName].deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    };

    app.delete("/forest/:id", handleDeleteDocument("forest"));
    app.delete("/userArt/:id", handleDeleteDocument("userArt"));

    // Update a user art document
    app.put("/userArt/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedArt = req.body;
        const updateDoc = {
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
        const result = await collections.userArt.updateOne(
          filter,
          updateDoc,
          options
        );
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });

    // Handle the root route
    app.get("/", (req, res) => {
      res.send("Nature art server is running");
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running at port: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);
