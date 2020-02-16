# Deployment Instructions
Type `make` or `make dev` to deploy to dev

Type `make deploy` or `make prod` to deploy to prod

If there are issues related to the container, type `make clean` before retrying

# Where are they deployed?
Prod is at https://mcc-prod-301.herokuapp.com/

Dev is at https://mcc-dev-301.herokuapp.com/

# Getting Heroku Setup
If you have Node.js installed, type `make setupheroku`. This will download and log into Heroku (will require you to do things)

If you have the Heroku command line installed but are not yet logged in, type either `make login` or `heroku login` to perform the login process.
