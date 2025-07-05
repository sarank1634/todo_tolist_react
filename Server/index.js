const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./Models/Todo');
const UserModel = require('./Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://saravana:Saravana1634@cluster0.gnbrisd.mongodb.net/', {});

// Log connection status
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});


// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace with a strong secret key
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

// Auth Routes
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login.' });
    }
});


app.get('/todos/all', verifyToken, async(req,res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    try{
        const total = await TodoModel.countDocuments({ userId: req.userId });
        const todos = await TodoModel.find({ userId: req.userId })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ _id: -1});
        res.json({ 
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            todos,
        });
    } catch(err) {
        res.status(500).json({error: err.message})
    }
})



app.get('/todos/:id', verifyToken, (req, res) => {
  TodoModel.findOne({ _id: req.params.id, userId: req.userId })
    .then(result => {
        if (!result) {
            return res.status(404).json({ message: 'Todo not found.' });
        }
        res.json(result)
    })
    .catch(err => res.status(500).json(err));
});

// Define routes
app.post('/add', verifyToken, (req, res) => {
  const { task } = req.body;
  TodoModel.create({
    task: task,
    userId: req.userId
  }).then(result => res.json(result))
  .catch(err => res.status(500).json(err))
});

app.put('/update/:id', verifyToken, (req, res) => {
  const { task } = req.body;

  TodoModel.findOneAndUpdate({ _id: req.params.id, userId: req.userId }, { task }, { new:true })
  .then(result => {
      if (!result) {
          return res.status(404).json({ message: 'Todo not found.' });
      }
      res.json(result)
  })
  .catch(err => res.status(500).json(err));
})


app.delete('/delete/:id', verifyToken, (req,res) => {
  TodoModel.findOneAndDelete({ _id: req.params.id, userId: req.userId })
  .then(result => {
      if (!result) {
          return res.status(404).json({ message: 'Todo not found.' });
      }
      res.json(result)
  })
  .catch(err => res.status(500).json(err));
})

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

