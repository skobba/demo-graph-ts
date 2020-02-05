# demo-graph

## Run
npm start

## Build docker container
docker build -t demo-graph/graph:latest .

## Run in docker-compose
docker-compose up -d

# Mongodb

## Enable authentication in mongod configuration file
Open /etc/mongod.conf on Linux or /usr/local/etc/mongod.conf with your favorite code editor and add the following lines:
```
security:
    authorization: "enabled"
```

## Start DB

### Mac (terminal)
```
mongod --auth --port 27017 --dbpath /usr/local/var/mongodb
```

### Mac (brew)
```
brew services restart mongodb-community
```

## Mongo client connect from host
```
mongo -u admin -p adminpass admin -port 27018
mongo -u demouser -p demopass graphdemo -port 27018
```

# Users
## Create User Mution
````
  mutation {
  Register(input:{email: "gjermund@skobba.net", password: "pw", tokenVersion: 1}) {
    _id
    email
    password
    tokenVersion
  }
}
```

```
mutation {
  Login(input:{email: "gjermund@skobba.net", password: "pw"}) {
    user {
      _id
      email
    	password
    }
    accessToken
  }
}
```