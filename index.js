const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const fileUpload = require('express-fileupload');
const ObjectId = require('mongodb').ObjectId;

//access environment file
require('dotenv').config();

//use middleware
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

//root api for confirming the connection
app.get('/', (req, res) => {
     res.send('Hello World');
});

//server Uniform Resource Identifier
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjr1x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {

     try {

          await client.connect();

          const database = client.db('holidayInn');
          const roomCollection = database.collection('rooms');
          const userCollection = database.collection('users');

          //post room data into db
          app.post('/rooms', async (req, res) => {
               const roomTitle = req.body.roomTitle;
               const bedCapacity = req.body.bedCapacity;
               const bedType = req.body.bedType;
               const price = req.body.price;
               const description = req.body.description;
               const photo = req.files.photo;
               const photoData = photo.data;
               const encodedPhoto = photoData.toString('base64');
               const photoBuffer = Buffer.from(encodedPhoto, 'base64');

               const room = {
                    roomTitle,
                    bedCapacity,
                    bedType,
                    price,
                    description,
                    photo: photoBuffer
               }
               const result = await roomCollection.insertOne(room);

               res.json(result)
          });

          //get all room data from db
          app.get('/rooms', async (req, res) => {
               const cursor = roomCollection.find({});
               const room = await cursor.toArray();

               res.json(room);
          });

          //get specific room data based on id
          app.get('/rooms/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const room = await roomCollection.findOne(query);

               res.json(room);
          });

          //delete api (room data)
          app.delete('/rooms/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const result = await roomCollection.deleteOne(query);

               res.json(result);
          });

          //get shipment data based on id
          app.get('/shipment/:id', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const shipment = await roomCollection.findOne(query);

               res.json(shipment);
          });

          //post user data into db
          app.post('/users', async (req, res) => {
               const bookingData = req.body;
               const result = await userCollection.insertOne(bookingData);
               console.log(result);

               res.json(result);
          });

          //get specific user based on id
          app.get('/shipment/:id/billing', async (req, res) => {
               const id = req.params.id;
               const query = { _id: ObjectId(id) };
               const billing = await roomCollection.findOne(query);

               res.json(billing);
          });




     }
     finally {
          // await client.close();
     }

}
run()










app.listen(port, () => {
     console.log(`listening to port ${port}`);
})
