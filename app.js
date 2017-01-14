// Reference the packages we require so that we can use them in creating the bot
var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
// Listen for any activity on port 3978 of our local server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID || "fa572733-9256-438f-bf18-4c37dfb65ca6",
    appPassword: process.env.MICROSOFT_APP_PASSWORD || "mtdcS0qAwDS7x9KpTUkdfDO"
});
var bot = new builder.UniversalBot(connector);
// If a Post request is made to /api/messages on port 3978 of our local server, then we pass it to the bot connector to handle
server.post('/api/messages', connector.listen());

const LuisModelUrl = "https://api.projectoxford.ai/luis/v2.0/apps/ceb80200-3d4a-468d-9f15-3b0e43cc9cc6?subscription-key=e06c0f90af8b493692aeb9c6dbbc24fb&verbose=true";
var recogniser = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({recognizers:[recogniser]});
intents.matches(/\b(hi|hello|hey)\b/i, '/sayHi');
intents.matches('nusCorsBidding', '/corsBidding');
intents.onDefault('/feelingLucky');

//=========================================================
// Bots Dialogs
//=========================================================
// This is called the root dialog. It is the first point of entry for any message the bot receives
bot.dialog('/', intents);
bot.dialog('/sayHi', [
    function (session) {
        builder.Prompts.text(session, "Hi there");
    }, function(session, results) {
        session.endDialog("OHHHHHHH");    
    }
])
bot.dialog('/corsBidding', [
    function (session) {
        builder.Prompts.text(session, "Need help for bidding? Here's some blogs that you can refer to!<br>" 
        + "[Bidding for dummies like you :>](http://crazerk.blogspot.sg/2013/06/cors-guide-bidding-for-dummies.html?m=1)<br>"
        + "[Tips for freshmen like you :>](http://blog.nusmods.com/tips-for-freshmen-by-nuswhispers)<br>"
        + "[What is CORS?](http://muggingsg.com/university/understanding-nus-cors)");
    }
])
bot.dialog('/feelingLucky', [
    function (session) {
        builder.Prompts.text(session, "Sorry we do not understand what you are saying! D: We think this" +
        " may be relevant to you: ");
    }
])


