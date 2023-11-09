const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection
// Your MongoDB URI
const uri = "mongodb+srv://sanj16:admin@cluster0.fgyvkon.mongodb.net/";
const client = new MongoClient(uri);

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// Body parsing middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Serve static files (like CSS)
app.use(express.static('public'));

// Route to handle form submission with file upload
app.post('/submit-question', upload.single('image'), async (req, res) => {
  try {
    await client.connect();
    const database = client.db('your_database_name');
    const collection = database.collection('questions');

    // Extract form data from the request
    const { title, questionText, answer, url, subject, topic } = req.body;

    // Get the file path from the uploaded image
    const imageUrl = req.file ? req.file.path : '';

    // Create a document object to be inserted into the 'questions' collection
    const question = {
      title,
      questionText,
      answer,
      imageUrl,
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
