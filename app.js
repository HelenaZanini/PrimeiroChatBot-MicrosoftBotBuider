var builder = require('botbuilder');

var connector = new builder.ConsoleConnector().listen();

var restify = require('restify');

var cognitiveservices = require('botbuilder-cognitiveservices');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Crie um chat conector para se comunicar com o Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

// Recebe as mensagens do usuário

var bot = new builder.UniversalBot(connector) 
/* {
    
    var userMessage = session.message.text;
    
    function resposta() {
        if (ola.indexOf(userMessage) > -1) {
            return "Oi, tudo bem?";    
        } else if (tudoBem.indexOf(userMessage) > -1) {
            return "Estou bem tbm :)";
        } else {
            return "Não conheço o significado dessa palavra ou frase";
        }
    }    

    session.send(resposta());
}); */ 

// Reconhce a base QnA Maker de acordo com a Id e SubKey especificada

var recognizer = new cognitiveservices.QnAMakerRecognizer({
	knowledgeBaseId: 'ff0355d2-845b-40e4-a76b-560a97398d3a', 
	subscriptionKey: '98234eda420646daae5980d54222c1d9',
    top: 1});
    
// Retorna uma mensagem padrão caso o indice de confiabilidade da resposta esteja abaixo do limite  

var basicQnAMakerDialog = new cognitiveservices.QnAMakerDialog({
	recognizers: [recognizer],
	defaultMessage: 'Não entendi sua pergunta! Tente refazer a questão em outras palavras;)',
	qnaThreshold: 0.5
});

bot.dialog('/',basicQnAMakerDialog);
