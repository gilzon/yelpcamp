

if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
 }
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb');
const engine = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const userRoutes = require('./routes/userRoutes');
const MongoSanitize = require('express-mongo-sanitize');
const { default: helmet } = require('helmet');

const MongoStore = require('connect-mongo');
const app = express();
const port = 3000;

// MongoDB connection URI
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const dbUrl =  'mongodb://localhost:27017/yelp-camp';
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

  // Use the MongoDB client to connect to the 'yelp-camp' database
//     const database = client.db('yelpcamp');
//     const db= mongoose.connection;
// db.on('error',console.error.bind(console,"connection error"));
// db.once("open", ()=>{
//     console.log("Database connected");
// });

    app.engine('ejs', engine);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.urlencoded({ extended: true }));
    app.use(methodOverride('_method'));
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(MongoSanitize());

    const secret = process.env.SECRET || 'thisshouldbeabettersecret';


    // const client = new MongoClient(dbUrl, {
    //   serverSelectionTimeoutMS: 30000
    // });
    
    // async function run() {
    //   try {
    //     // Connect to the MongoDB database
    //     await client.connect();
    // const db = mongoose.connection;
    // db.on('error', console.error.bind(console, 'connection error'));
    // db.once('open', () => {
    //   console.log('Database connected');
    // });

    const store = MongoStore.create({
      mongoUrl: dbUrl,
      touchAfter: 24 * 60 * 60,
      crypto: {
          secret: 'thisshouldbeabettersecret!'
      }
  });

 store.on("error",  function (e){
  console.log("SESSION STORE ERROR", e)
 })

    const sessionConfig = {
      store,
      name: 'session',
      secret,
      resave: false,
      saveUninitialized: true,
      cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    };
    

    app.use(session(sessionConfig));
    app.use(flash());
    app.use(helmet());
    const scriptSrcUrls = [
        " https://cdn.jsdelivr.net/",
        "https://stackpath.bootstrapcdn.com/",
        "https://api.tiles.mapbox.com/",
        "https://api.mapbox.com/",
        "https://kit.fontawesome.com/",
        "https://cdnjs.cloudflare.com/",
        "https://cdn.jsdelivr.net",
    ];
    const styleSrcUrls = [
        "https://cdn.jsdelivr.net",
        "https://kit-free.fontawesome.com/",
        "https://stackpath.bootstrapcdn.com/",
        "https://api.mapbox.com/",
        "https://api.tiles.mapbox.com/",
        "https://fonts.googleapis.com/",
        "https://use.fontawesome.com/",
    ];
    const connectSrcUrls = [
        "https://api.mapbox.com/",
        "https://a.tiles.mapbox.com/",
        "https://b.tiles.mapbox.com/",
        "https://events.mapbox.com/",
    ];
    const fontSrcUrls = [];
    app.use(
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: [],
                connectSrc: ["'self'", ...connectSrcUrls],
                scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
                styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
                workerSrc: ["'self'", "blob:"],
                objectSrc: [],
                imgSrc: [
                    "'self'",
                    "blob:",
                    "data:",
                    "https://res.cloudinary.com/dnxdktspd/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                    "https://images.unsplash.com/",
                ],
                fontSrc: ["'self'", ...fontSrcUrls],
            },
        })
    );
    
    app.use(passport.initialize());
    app.use(passport.session());

    // Passport configuration and middleware

    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      res.locals.success = req.flash('success');
      res.locals.error = req.flash('error');
      next();
    });

    // Routes

    app.use('/campgrounds', campgrounds);
    app.use('/campgrounds/:id/reviews', reviews);
    app.use('/', userRoutes);

    app.get('/', (req, res) => res.render('home'));

    // Error handling

    app.all('*', (req, res, next) => {
      next(new ExpressError('Page not found', 404));
    });

    app.use((err, req, res, next) => {
      const { statusCode = 500 } = err;
      if (!err.message) err.message = 'Oh no, something went wrong';
      res.status(statusCode).render('error', { err });
    });

    // Start the Express app

    app.listen(port, () => console.log(`App listening on port ${port}!`));
//   } finally {
//     // Ensure the MongoDB client is closed
//     await client.close();
//   }
// }

// run().catch(console.dir);







