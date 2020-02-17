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

# Get new access_token from refresh_token
curl -X POST http://localhost:3000/refresh_token

fetch('http://localhost:3000/graphql', {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //credentials: 'same-origin', // include, *same-origin, omit
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    //body: JSON.stringify(data) // body data type must match "Content-Type" header
  });


# fetch
## post
// Example POST method implementation:
async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

postData('/refresh_token', { answer: 42 })
  .then((data) => {
    console.log(data); // JSON data parsed by `response.json()` call
  });