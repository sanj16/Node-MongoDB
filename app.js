const express = require('express');
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

// MongoDB connection
const uri = "mongodb+srv://sanj16:admin@cluster0.fgyvkon.mongodb.net/";
const client = new MongoClient(uri);

// Body parsing middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (like CSS)
app.use(express.static('public'));

// Route to handle form submission
app.post('/submit-question', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('your_database_name');
    const collection = database.collection('questions');

    // Extract form data from the request
    const { title, questionText, answer, image, url, subject, topic } = req.body;

    // Create a document object to be inserted into the 'questions' collection
    const question = {
      title,
      questionText,
      answer,
      imageUrl: '', // You need to handle image upload separately
      url,
      subject,
      topic,
      submitTime: new Date()
    };

    // Insert the form data into the 'questions' collection
    const result = await collection.insertOne(question);
    res.send('Question saved successfully.');

  } catch (err) {
    res.status(500).send('Error occurred while saving the question.');
  } finally {
    await client.close();
  }
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
