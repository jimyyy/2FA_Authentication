2FA Authentication API with SMS and Email Support.

This project is an API developed in JavaScript using Express.js for implementing Two-Factor Authentication (2FA) with support for mobile SMS and email verification.


Features:

- 2FA Implementation: Secure two-factor authentication for user accounts.

- SMS Verification: Verification codes sent via SMS for user authentication.

- Email Verification: Verification codes sent via email for user authentication.

- Express.js Framework: Built on top of Express.js for easy integration and scalability.

Installation

1-  Clone the repository: : git clone + url of repository.

2-  Install dependencies: npm install.

3-  Configure environment variables for SMS and email providers. You will need to set up accounts with TWILIO for SMS service and obtain credentials to set into code and EMAIL .

4-  Start the server: npm start


Usage

Endpoints:

   You can use postman for api testing:

- POST http://localhost:3000/login: Endpoint for user login with 2FA.

- POST http://localhost:3000/verify: Endpoint for verifying the 2FA code sent via SMS or email.
