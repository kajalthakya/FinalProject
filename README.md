Kajal's Collection Website
Setup and Run
Clone the repository:

bash
Copy code
git clone https://github.com/kajalscollection/website.git
Install dependencies:

bash
Copy code
npm install
Start the server:

bash
Copy code
npm start
The server will start on localhost:3000

Database Setup
Ensure you have MySQL installed and running.
Create a database named digital_marketing.
Create a collection named feedback.
Database Schema
The feedback collection has the following schema:

name: String, required
email: String, required
message: String, required
Rationale
name: To store the name of the person providing feedback.
email: To store the email address of the person providing feedback.
message: To store the feedback message.
Documentation
The code is well-documented, especially the parts involving database interactions.

