// Dependencias
const builder = require('botbuilder');
const restify = require('restify');
const cognitiveservices = require('botbuilder-cognitiveservices');

// Setup do servidor
const port = 3978;
const server = restify.createServer();

server.listen(port, () => {console.log(`Servidor rodando em ${server.url}`);});

// Criação de um canal de comunicação com o Bot Framework Service
const connector = new builder.ChatConnector(
    {
        appId: process.env.APP_ID,
        appPassword: process.env.APP_PASSWORD,
    }
);

// Endpoint que irá monitorar as mensagens do usuário
server.post('/api/messages', connector.listen());

// Recebe as mensagens do usuário
const bot = new builder.UniversalBot(connector);

// Cria uma biblioteca de resposta 
/* const qnaMakerTools = new cognitiveservices.QnAMakerTools();
bot.library(qnaMakerTools.createLibrary); */

// Reconhce a base do QnA Maker de acordo com a Id e SubKey especificada
const recognizer = new cognitiveservices.QnAMakerRecognizer(
    {
        knowledgeBaseId: process.env.KNOWLEDGEBASE_ID,
        subscriptionKey: process.env.SUBSCRIPTION_KEY,
        top: 1 // quantidade de respostas, por padrão é 1, e uma quantidade maior necessita da criação de um biblioteca
    }
);

// Recognizers: define a resposta a ser enviada a classe dialog 
// qna Threshold e defaultMessage: retorna uma mensagem padrão caso o indice de confiabilidade da resposta esteja abaixo do limite  
const qnaMakerDialog = new cognitiveservices.QnAMakerDialog(
    {
        recognizers: [recognizer],
        defaultMessage: 'Não entendi sua pergunta! Tente refazer a questão em outras palavras ;)',
        qnaThreshold: 0.7
    }
);

// Envia a resposta ao chat 
bot.dialog('/', qnaMakerDialog);
