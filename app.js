require('dotenv').load()

const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const path = require('path')

var stripe = require('stripe')(process.env.API_KEY)

app.use(bodyParser.urlencoded({ extended: false }))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
app.use(require('serve-static')(path.join(__dirname, 'public')))

app.get('/', (request, response) => {
	response.redirect('/bill')
})

app.get('/bill', (request, response) => {
	response.render('bill')
})

app.post('/charge', (request, response) => {
	createCharge(request.body.amount * 100, request.body.stripeToken)
	if (response.error) {
		response.render('error')
	} else {
		response.render('success', request.body)
	}
})

app.listen(process.env.PORT || 3000)

function createCharge(amount, token) {
	// Token is created using Checkout or Elements!
	// Get the payment token ID submitted by the form:
	// Charge the user's card:
	stripe.charges.create(
		{
			amount: amount,
			currency: 'usd',
			description: 'Example charge',
			source: token
		},
		function(err, charge) {
			console.log(charge)
			// asynchronously called
		}
	)
}
