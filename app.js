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

const LuisModelUrl = "https://api.projectoxford.ai/luis/v2.0/apps/68d90fa9-d905-4f60-a527-3bd59f0f812d?subscription-key=a6b43fbe1d814bc7a807e3db1bd079cd&verbose=true";
var recogniser = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({recognizers:[recogniser]});
intents.matches(/\b(hi|hello|hey)\b/i, '/sayHi');
intents.matches('getNews', '/giveUserNews');
intents.matches('analyzeObject', '/giveAnalysis');
intents.onDefault(builder.DialogAction.send("Apa ini la dey"));

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
bot.dialog('/giveUserNews', [
    function (session) {
        builder.Prompts.text(session, "YOU WANT SOME NEWS?");
    }, function(session, results) {
        session.endDialog("NEW NEW CHINESE NEW");    
    }
])
bot.dialog('/giveAnalysis', [
    function (session) {
        builder.Prompts.text(session, "YOU WANT SOME ANALYSIS?");
    }, function(session, results) {
        session.endDialog("???????????");    
    }
])