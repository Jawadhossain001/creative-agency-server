const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload')
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();

app.use(cors());
app.use(bodyParser.json());
// app.use(express.static(''))
app.use(fileUpload())


const port = 4000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.penom.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect((err) => {
	const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
	const reviewCollection = client.db(`${process.env.DB_NAME}`).collection("reviews");
	const serviceCollection = client.db(`${process.env.DB_NAME}`).collection("services");
	const admin = client.db(`${process.env.DB_NAME}`).collection("Admin");
	console.log("mongo is ready to fly");

	/* API: Getting Services Data on home page */
	app.get("/home/services", (req, res) => {
		serviceCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	/* API: Getting Review Data on home page */
	app.get("/home/reviews", (req, res) => {
		reviewCollection.find({}).toArray((err, docs) => {
			res.send(docs);
		});
	});

	/* API: Add Review */
	app.post("/addReview", (req, res) => {
		const newReview = req.body;
		reviewCollection.insertOne(newReview).then((result) => {
			// console.log(result, "Add new review");
			res.send(result.insertedCount > 0);
		});
	});

	/* API: Add order */
	app.post("/addOrder", (req, res) => {
		const newOrder = req.body;
		orderCollection.insertOne(newOrder).then((result) => {
			console.log(result, "Add new order");
			res.send(result.insertedCount > 0);
		});
	});

	/* API: Getting Admin list */
	app.post('/addAdmin',(req,res)=>{
		adminsCollection.insertOne({admin:req.body.admin})
		.then(result=>{
		  res.send(result.insertedCount > 0)
		})
		.catch(err=>console.log(err))
	  })

	/* API: Getting service list */
	app.get("/serviceList", (req, res) => {
		orderCollection.find({ email: req.query.email }).toArray((error, documents) => {
			res.send(documents);
			console.log(error);
		});
	});
});

/* API : Default */
app.get("/", (req, res) => {
	res.send("Hello, API is working");
});

app.listen(process.env.PORT || port);
