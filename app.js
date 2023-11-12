const express = require('express');
const multer = require('multer');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb+srv://sanj16:admin@cluster0.fgyvkon.mongodb.net/";
const client = new MongoClient(uri);

const upload = multer({ dest: 'uploads/' });

app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.post('/submit-question', upload.single('image'), async (req, res) => {
  try {
    await client.connect();
    const database = client.db('your_database_name');
    const collection = database.collection('questions');

    const { title, questionText, answer, url, subject, topic } = req.body;

    const imageUrl = req.file ? req.file.path : '';

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


    const result = await collection.insertOne(question);
    res.send('Question saved successfully.');

  } catch (err) {
    res.status(500).send(err);
  } finally {
    await client.close();
  }
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:3000`);
});
