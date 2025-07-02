const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo')

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saravana:Saravana1634@cluster0.gnbrisd.mongodb.net/', {
  useNewUrlParser: true,
  // why useNewUrlParser: true is used?
  // The useNewUrlParser option is used to opt in to the MongoDB driver's new URL string parser.this option is recommended because the new parser handles connection strings more consistently and supports new features, such as SRV records and replica sets, which are common in modern MongoDB deployments. eg mongodb+srv://<username>:<password>@cluster0.mongodb.net/test
  // what is srv?
  // The srv protocol is used in MongoDB connection strings to indicate that the connection should use DNS SRV records to discover the database servers. This allows for automatic discovery of replica sets and sharded clusters without needing to specify each server individually.
  useUnifiedTopology: true,
  // useUnifiedTopology: true is used to opt in to the MongoDB driver's new connection management engine, which provides a more robust and efficient way to manage connections, especially in environments with multiple servers or replica sets.
});

// Log connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.get('/todos', (req,res) => {
    TodoModel.find()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
})

// get one todo by id
app.get('/todos/:id', (req, res) => {
  TodoModel.findById(req.params.id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err));
});

// Define routes
app.post('/add', (req, res) => {
  const task = req.body.task;
  TodoModel.create({
    task:task
  }).then(result => res.json(result))
  .catch(err => res.status(500).json(err))
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const TodoModel = require('./Models/Todo');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Cloud (replace credentials with your own secure ones)
// mongoose.connect('mongodb+srv://saravana:Saravana1634@cluster0.gnbrisd.mongodb.net/tododb', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on('connected', () => {
//   console.log('✅ Connected to MongoDB Atlas');
// });
// mongoose.connection.on('error', (err) => {
//   console.error('❌ MongoDB connection error:', err);
// });

// // ✅ Get all todos
// app.get('/todos', (req, res) => {
//   TodoModel.find()
//     .then(result => res.json(result))
//     .catch(err => res.status(500).json(err));
// });

// // ✅ Add a new todo
// app.post('/add', (req, res) => {
//   const { task } = req.body;
//   TodoModel.create({ task })
//     .then(result => res.json(result))
//     .catch(err => res.status(500).json(err));
// });

// // ✅ Delete a todo
// app.delete('/delete/:id', (req, res) => {
//   TodoModel.findByIdAndDelete(req.params.id)
//     .then(result => res.json(result))
//     .catch(err => res.status(500).json(err));
// });

// // ✅ Update a todo
// app.put('/update/:id', (req, res) => {
//   const { task } = req.body;
//   TodoModel.findByIdAndUpdate(req.params.id, { task }, { new: true })
//     .then(result => res.json(result))
//     .catch(err => res.status(500).json(err));
// });

// app.listen(3000, () => {
//   console.log('🚀 Server running on http://localhost:3000');
// });
