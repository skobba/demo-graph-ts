#!/usr/bin/env sh

# For development on localhost
# Creates users: admin, demouser

# Set environment variables MONGO_ADMIN and MONGO_ADMINPASS
# or
# Import environment variables from .env with:
export $(cat .env | xargs)

echo $MONGO_ADMIN
echo $MONGO_ADMINPASS
echo $MONGO_USERNAME
echo $MONGO_PASSWORD
echo $MONGO_DATABASENAME

mongo -u $MONGO_ADMIN -p $MONGO_ADMINPASS admin<<EOF
use $MONGO_DATABASENAME
db.createUser(
   {
     user: "$MONGO_USERNAME",
     pwd: "$MONGO_PASSWORD",
     roles: [ "readWrite", "dbAdmin" ]
   }
)
EOF
