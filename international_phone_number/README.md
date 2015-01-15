We deal with a lot of calls. Once a User has signed up for Talkdesk and have created their own account, they will then buy a new phone number. Using this number, a User is able to receive phone calls directly in their browser and optionally define a cellphone or office number which we'll use to forward the inbound call to. Users are also able to make outbound calls from their browser.

Once an inbound/outbound call has finished, we need to charge the User's account depending on the duration. This is done by deducting the cost of the call from an Account's credits (which uses Dollars as the currency). The amount we charge depends on our service provider, Twilio, so we use Twilio's prices plus a little margin.

For this challenge we'll just focus on the billing of inbound calls.

## The Problem

There are various events that occur during the lifetime of a call. Upon received a call finished event we need to bill an Account's credits based on:

* The call's duration
* The type of the Talkdesk number that received the call
* If the call was forwarded to a User's external number, then the price of the call to the specified country needs to be considered

The price we must charge must be Twilio's price plus, for example, 5 cents (See Formula section). You can find a `.csv` file with the prices [here](https://www.twilio.com/resources/rates/international-rates.csv)

In some cases, we might like to change the margin depending on our Client (for example, reduce the margin if they use a lot of minutes per month).

Another important aspect of billing for calls is keeping a record of the charge made to a User's Account, as we would like to display the list of calls they've made including the amount we've charged for each one.

When a call finishes, the information that's available when deciding how much to bill is:

* The duration of the call (in seconds)
* The Talkdesk Telephone's number that received the inbound call
* The external phone number that was used to forward the call (only defined when the User answers a call on their cellphone or office landline rather than answering in the browser)
* The corresponding Talkdesk account

### Formula

To calculate the price per minute for inbounds is as follows: `Talkdesk_Number_Cost + External_Number_Cost + Profit_Margin`

The `Talkdesk_Number_Cost` should be set to 1c except for two cases: US and UK Toll free numbers which should be set to 3c and 6c, respectively.

The `External_Number_Cost` should be set to 1c if the call is answered in the web browser, otherwise the price to charge should be the same as Twilio charges for calls to that number.

### Background Information

The way this is actually done in Talkdesk is by using RabbitMQ to send events. The types of events that are emitted for calls are:

* **call_initiated** - When a Customer starts a call to a Talkdesk, before it actually starts to ring
* **call_answered** - When an Agent picks up a call
* **call_missed** - When a call wasn't answered by an Agent
* **call_finished** - When an answered call finishes, either by the Agent closing the call or the Customer hanging up
* **call_voicemail** - When a call resulted in a voicemail

This problem is basically only dealing with a **call_finished** event.

Here's an example of the data the event has (they come in JSON):

```
{
  "event":"call_finished",
  "type":"in",
  "duration":"91",
  "account_id":"4f4a37a201c642014200000c",
  "contact_id":"505de7e5f857d94a3d000001",
  "call_id":"9d036a18-0986-11e2-b2c6-3d435d81b7fd",
  "talkdesk_phone_number":"+14845348611",
  "customer_phone_number":"+351961918192",
  "forwarded_phone_number":null,
  "agent_id":"4f78ded32b0ac00001000001",
  "previous_agent_id":"5054d89ec7573f082a000c9e",
  "customer_id":"505de7e5f857d94a3d000001",
  "customer":null,
  "record":"http://s3.amazonaws.com/plivocloud/9ff87998-0986-11e2-aed8-002590513972.mp3",
  "timestamp":"2012-09-28T16:09:07Z"
}
```

## Other Requirements

* To start, you can make a command-line program that can simulate an end of call and make a charge to the Account's credits.
* As a bonus, make an HTTP interface that can accept requests notifying this system that a call has ended and that it needs to bill an account for the call.

## Environment

We use MongoDB as our main database, so please do the same. (We have systems that use Mongoid (ORM) and others that use the MongoDB ruby driver directly, but use whichever you prefer).
