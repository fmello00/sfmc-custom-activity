const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio'); // Importa o SDK do Twilio

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializa o cliente do Twilio usando variáveis de ambiente seguras
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint de Execução acionado pelo Journey Builder para cada contato
app.post('/execute', async (req, res) => {
    try {
        const requestBody = req.body;
        console.log('--- Processing contact for Twilio ---');

        // Extrai os dados enviados pelo Journey Builder (definidos no seu config.json)
        // Exemplo: configurando para pegar o telefone do cliente
        const inArguments = requestBody.inArguments[0] || {};
        const contactPhone = inArguments.phoneNumber; // Certifique-se de mapear isso no config.json
        
        // Dispara o SMS via Twilio
        const message = await twilioClient.messages.create({
            body: 'Hello! This is a custom message sent via SFMC Journey Builder.',
            from: process.env.TWILIO_PHONE_NUMBER, // Seu número virtual do Twilio
            to: contactPhone // Telefone do cliente que veio da jornada
        });

        console.log(`Message sent successfully! SID: ${message.sid}`);
        
        // Retorna 200 OK para o Journey Builder seguir com o contato na jornada
        return res.status(200).json({ status: 'ok' });

    } catch (error) {
        console.error('Error sending message via Twilio:', error);
        
        // Mesmo com erro, você pode retornar 200 se não quiser travar a jornada,
        // ou retornar 500 se quiser que o SFMC acuse falha no contato.
        return res.status(500).json({ status: 'error', message: error.message });
    }
});

app.post('/save', (req, res) => res.status(200).json({ status: 'ok' }));
app.post('/validate', (req, res) => res.status(200).json({ status: 'ok' }));
app.post('/publish', (req, res) => res.status(200).json({ status: 'ok' }));

app.listen(PORT, () => {
    console.log(`Server successfully running on port ${PORT}`);
});
