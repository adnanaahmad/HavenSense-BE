// Import catchAsync wrapper
const catchAsync = require('../utility/catchAsync');
// Import stripe, Now this here will then expose a function basically. 
// And usually what we do then right away is to pass our secret key right into that.
// And so that will then give us a Stripe object that we can work with.
const Stripe = require('stripe');
// Import Order model
let Order = require('../models/orderModel');
// Import Cart model
let Cart = require('../models/cartModel');

// Handle get checkout session for donation
exports.getCheckoutSessionForDonation = catchAsync(async (req, res, next) => {
    
    let stripe;
    let frontendBaseUrl;
    const amount = Number(req.params.amount);
    
    if(process.env.NODE_ENV === 'production') {
        stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        frontendBaseUrl = process.env.FRONTEND_BASEURL;
    } else {
        stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY);
        frontendBaseUrl = process.env.FRONTEND_BASEURL_LOCAL;
    }

    // create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${frontendBaseUrl}/home/play-by-play`,
        cancel_url: `${frontendBaseUrl}/home/play-by-play`,
        customer_email: req.user.email,
        client_reference_id: req.user.id,
        line_items: [
            {
                name: 'Donation',
                amount: amount*100,
                currency: 'usd',
                quantity: 1,
            }
        ],
        metadata: {donation: true}
    })

    // send session as response
    res.status(200).json({
        status: 'success',
        data: session
    });
});


// Handle get checkout session for shopping cart
exports.getCheckoutSessionForCart = catchAsync(async (req, res, next) => {
    
    let stripe;
    let frontendBaseUrl;
    let line_items=[];
    let order = [];
    if(process.env.NODE_ENV === 'production') {
        stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        frontendBaseUrl = process.env.FRONTEND_BASEURL;
    } else {
        stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY);
        frontendBaseUrl = process.env.FRONTEND_BASEURL_LOCAL;
    }

    const cart = await Cart.find({user: req.user.id}).populate('user', 'id name email media').populate('product').sort({dateCreated: -1});
    cart.forEach(node => {
        line_items.push({
            name: node.product.name,
            description: node.product.description,
            images: [node.product.media],
            amount: node.product.price*100,
            currency: 'usd',
            quantity: node.quantity,
        });
        order.push(JSON.stringify({
            seller: node.product.user,
            product: node.product._id,
            price: node.product.price,
            quantity: node.quantity
        }));
    });

    // create checkout session
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${frontendBaseUrl}/home/play-by-play`,
        cancel_url: `${frontendBaseUrl}/home/play-by-play`,
        customer_email: req.user.email,
        client_reference_id: req.user.id,
        line_items,
        metadata: Object.assign({}, order)
    })

    // send session as response
    res.status(200).json({
        status: 'success',
        data: session
    });
});

// Handle listen for checkout
exports.listenForCheckout = catchAsync(async (req, res, next) => {
    let stripe;
    let endpointSecret;
    
    if(process.env.NODE_ENV === 'production') {
        stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        endpointSecret = process.env.STRIPE_ENDPOINT_KEY;
    } else {
        stripe = Stripe(process.env.STRIPE_TEST_SECRET_KEY);
        endpointSecret = process.env.STRIPE_TEST_ENDPOINT_KEY;
    }

    let event = req.body;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse
    if (endpointSecret) {
        // Get the signature sent by Stripe
        const signature = req.headers['stripe-signature'];
        try {
          event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            endpointSecret
          );
        } catch (err) {
          console.log(`⚠️  Webhook signature verification failed.`, err.message);
          return response.sendStatus(400);
        }
    }
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        break;
      case 'checkout.session.completed':
        const paymentObject = event.data.object;
        //console.log(paymentObject);
        console.log(`Checkout session for ${paymentObject.amount} was successful!`);
        // check if checkout is of type cart
        if(!paymentObject.metadata.donation) {
            let buyer = paymentObject.client_reference_id;
            let cart =  Object.values(paymentObject.metadata);
            cart = cart.map(x => JSON.parse(x));
            // create record for each order
            for (const item of cart) {
                await Order.create({
                    buyer,
                    seller: item.seller,
                    product: item.product,
                    price: item.price,
                    quantity: item.quantity
                });
            };
            // after checkout empty user cart
            await Cart.deleteMany({user: buyer});
        }
        break;
      default:
        // Unexpected event type
        console.log(`Unhandled event type ${event.type}.`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    res.send();
});

