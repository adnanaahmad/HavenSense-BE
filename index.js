// Import express
let express = require('express');
// Import cors
let cors = require('cors')
// Import Mongoose
let mongoose = require('mongoose');
// Import routes
let userRouter = require("./routers/userRouter");
let postRouter = require("./routers/postRouter");
let searchRouter = require("./routers/searchRouter");
let marketplaceRouter = require("./routers/marketplaceRouter");
let cartRouter = require("./routers/cartRouter");
let orderRouter = require("./routers/orderRouter");
let s3Router = require("./routers/s3Router");
let paymentRouter = require("./routers/paymentRouter");
let webhookRouter = require("./routers/webhookRouter");
// import global error middleware
let globalErrorHandler = require('./controllers/errorController');
// import app error class
const AppError = require('./utility/appError');
// import env variables
require('dotenv').config();

// Initialize the app
let app = express();

let corsOptions = {
    origin: ['http://localhost:3000'],
}
app.use(cors(corsOptions));

// Parse URL-encoded bodies
app.use(express.urlencoded({extended: true}));

// Connect to Mongoose and set connection variable
mongoose.connect(process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD), { 
    useNewUrlParser: true,
});
let db = mongoose.connection;

// Added check for DB connection
if(!db)
    console.log("Error connecting db")
else
    console.log("Db connected successfully")

// Webhook middleware listen's to checkout event by stripe
app.use('/webhook', express.raw({type: 'application/json'}), webhookRouter);

// Middleware that'll convert incoming req data, adds that to body
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/search', searchRouter);
app.use('/api/s3', s3Router);
app.use('/api/payment', paymentRouter);
app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// Setup server port
let port = process.env.PORT || 8080;
// Launch app to listen to specified port
app.listen(port, function () {
    console.log("Running havense on port " + port + ' in ' + process.env.NODE_ENV + ' environment');
});