const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

//bibliotheque  js pour l'envoi des email
const nodemailer = require('nodemailer');

//une bib pour generer  la verification des codes
const speakeasy = require('speakeasy');

//Twilio est une bib pour l'envoi des sms
const accountSid = 'ACtu met ici votre accountSid trouvé dans la platform twilio ';
const authToken = 'Aussi pour authToken vous trouvez dans la platform twilio';
const twilio = require('twilio')(accountSid, authToken);

//creation d'une instance d'une application express
const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

// users est mon exemple de base
const users = [
    { username: 'user1', password: 'password1', email: 'zizoujimmyyy@gmail.com',phoneNumber:'+21626319813'},
    { username: 'user2', password: 'password2', email: 'zizoujimmyyy@gmail.com',phoneNumber:'+21626319813' },
    { username: 'user3', password: 'password3', email: 'zizoujimmyyy@gmail.com',phoneNumber:'+21626319813' }
];

// la fonction pour envoyer un email
const sendEmail = (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'example@gmail.com: tu met ton email personnel',
            pass: 'votre password et vous devez utiliser le nouveau process de google est de generer un mot de passe specifique , ne mettez pas le mot de passe de votre compte fmail'
        }
    });

    const mailOptions = {
        from: 'example@gmail.com',
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
//la fonction pour envoyer un sms avec twilio
const sendSMS = (to, body) => {
    twilio.messages
        .create({
            body: body,
            from: 'twilio va te generer un numero de telephone qui vous mettre ici',
            to: to
        })
        .then(message => console.log('SMS sent:', message.sid))
        .catch(error => console.error('Error sending SMS:', error));
};

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid Email or password' });
    }
    // Ici on genere le code  qui va envoyer par email ou sms pour la double verification
    const secret = speakeasy.generateSecret({ length: 6 });
    user.secret = secret.base32;

    // envoi de l'email contenant le code pour la double verification
    sendEmail(user.email, 'Two-Factor Authentication Code', `Your authentication code: ${secret.base32}`);

    //  envoi de sms contenant le code pour la double verification
    sendSMS(user.phoneNumber, `Your authentication code: ${secret.base32}`);
    //creation d'un session utlisateur apres le success de l'authentification
    req.session.user = user;
    res.json({ message: 'Login successful' });
});


//verify endpoint
app.post('/verify', (req, res) => {
    const { code } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    //verification que le code est valable avant la verification
    if (!user.secret) {
        return res.status(400).json({ message: 'Missing secret' });
    }

    console.log('Verifying code:', code);
    console.log('User secret:', user.secret);

    if (code  === user.secret) {
        // Clear the session user data after successful authentication
        delete req.session.user;
        return res.json({ message: 'Two-factor authentication successful' });
    } else {
        return res.status(401).json({ message: 'Invalid code' });
    }
});


// Server listening
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
