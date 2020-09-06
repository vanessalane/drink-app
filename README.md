# Drink App
A Node/Express app for sharing and rating cocktail recipes.

Deployed app: https://drink-app-dev.herokuapp.com/

## User Story
**As a** cocktail enthusiast, **I want** to share, find, and discuss new cocktail recipes **so that** I can enjoy great drinks.

## Testing
Test helper functions with `npm jest`
Run locally with:
1. `git clone git@github.com:vanessalane/drink-app.git`
2. cd into your newly cloned repo, then `npm run migrate`
3. start the app with `npm start`.

If you want to populate the database with dummy data:
1. Follow the steps above
2. Open a new terminal
3. cd into the cloned repo and run `npm run seed`

## Troubleshooting
This app depends on the following .env variables:
- DB_NAME='drink_app'
- DB_USER='your mysql username'
- DB_PW='your mysql password'
- S3_BUCKET='drink-app'
- S3_REGION='us-west-1' (or some other AWS region)
- S3_ACCESS_KEY='nice try'
- S3_SECRET_ACCESS_KEY='nice try'
- SESSION_SECRET='nice try'

## Packages/Libraries
- jQuery
    - RateYo: jQuery plugin for star ratings
- aws-sdk: recipe images are stored in an s3 bucket
- bcrypt
- connect-session-sequelize
- dotenv
- express
- express-handlebars
- express-session
- jest
- multer: middleware for handling multipart/form-data
- multer-s3: streaming multer storage engine for AWS S3.
- mysql2
- sequelize (ORM)

## Questions
If you have questions, reach out to one of the authors:
- Vanessa Lane: vlane0593@gmail.com
- Chris Vavuris: cvavuris@gmail.com
- Hani Ghaderi: hani.ghaderi@me.com
