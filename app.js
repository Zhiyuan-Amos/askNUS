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
intents.matches('askNusGreetingHelp', '/askNusGreetingHelp');
intents.matches('nusCorsBidding', '/corsBidding');
intents.matches('nusShuttleBusToTake', '/nusShuttleBusToTake');
intents.matches('nusBusTiming', '/nusBusTiming');
intents.onDefault('/feelingLucky');

//=========================================================
// Bots Dialogs
//=========================================================
// This is called the root dialog. It is the first point of entry for any message the bot receives
bot.dialog('/', intents);
bot.dialog('/askNusGreetingHelp', [
    function (session) {
        session.endDialog("Hi there! How can I help you? For example, if you want to find out more about CORS bidding, "
        + "type in 'CORS' or 'bid'. If you want to find out about how to get to somewhere in NUS, type 'going from X to Y'");
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
bot.dialog('/nusShuttleBusToTake', [
    function (session) {
        builder.Prompts.text(session, "Going from UTown to Kent Ridge MRT? Take bus D2!");
    }
])
bot.dialog('/nusBusTiming', [
    function (session) {
        builder.Prompts.text(session, "Bus timings at Utown: D1 in 5 minutes, D2 in 8 minutes.");
    }
])
bot.dialog('/feelingLucky', [
    function (session) {
        var website = "http://www.google.com/search?q=" + session.message.text.replace("\\s+", "+") + "&btnI";
        builder.Prompts.text(session, "Sorry we do not understand what you are saying! D: We think [this](" + website + ")" +
        " may be relevant to you");
    }
])