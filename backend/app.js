const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const config = require('./config/db');
const bodyParser = require('body-parser'); //Needed for parsing request body

const app = express();
const port = process.env.PORT || 3001;

//Use body-parser middleware (to be able to read request body)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Set up CORS
const corsOptions = {
    origin: ['http://localhost:3000'], //Allow only from this origin
    methods: ['GET', 'POST'],
    credentials: true,
};

app.use(cors(corsOptions));


app.use(cookieParser());
app.use(session({
    secret: 'your_secret_key', // Replace with a strong, randomly generated key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } //Set to true for HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

//Connect to MongoDB
mongoose.connect(config.dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

//Import and use user model and passport strategies
require('./models/User');
require('./config/passport')(passport);

app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});