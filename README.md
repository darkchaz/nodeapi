# Vanilla NodeJS Restful API Example
This example app does not use any external libraries, drivers, or frameworks--including Express. The entire app is written using vanilla core-NodeJS, leveraging only the includes found in this reference [https://nodejs.org/api/](https://nodejs.org/api/)

I wrote a psudeo database driver and ORM, bearing resemblance to mongodb, to handle data storage and persistance. In a production enviroment, leveraging actual mongodb drivers and data stores would be recommended, as the current implmentation is for demonstratin purposes only.

## Running The App


To run the app, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed

2. You can set the enviroment variable, KEY=chaz, but for ease of use, we can also pass it explicitly when executing node as well. From the project folder, execute the following command:

  ```shell
  KEY=chaz node server.js
  ```
3. The API is now available at [http://127.0.0.1:1337](http://127.0.0.1:1337)

4. Use a REST tool, such as [Postman](https://www.getpostman.com/), to interact with the API


#### Default authentication credentials:
username: `admin`

password: `12345`



## Restoring Default Seed Data

The app provides a method to restore the database to the default configuration and data entries. To complete the restore, start the app with the ``--reset`` argument. 

From the project root, execute the foollowing command:

  ```shell
KEY=chaz node server.js --reset
  ```

## Endpoints

All endpoints will:

1. Return JSON with `Content-Type` set to `application/json`
2. Only respond with requested JSON object without additional data-wrapping, unless an error occurs
3. Responses can be data-wrapped with additional verbose information by appending the following to any request:

  ```shell
 ?verbose=true
  ```
  
4. Require an Authorization header with a Bearer Token(JWT), except POST requests to the AUTH endpoint
5. Return a JSON encoded response object with error details if an error occurs. For example:

	```javascript
	{
	  "response": {
	    "status": 403,
	    "errors": [
	      "Authorized bearer token is invalid"
	    ]
	  }
	}
	```
	
##Endpoint Pagnation

### Page Selection
By appending ``?page=`` url parameter, you can select a certain page of an endpoint. The page size defualts to 5 items, unless otherwise specified.

Example: [http://127.0.0.1:1337/configurations/?page=2](http://127.0.0.1:1337/configurations/?page=2)

###Page Size
By appending ``?page_size=`` url parameter, you can setthe page size of an endpoint. The page size defualts to 5 items, unless otherwise specified.

Example: [http://127.0.0.1:1337/configurations/?page=2&page_size=10](http://127.0.0.1:1337/configurations/?page=2&page_size=10)

	
## AUTH

[http://127.0.0.1:1337/auth/](http://127.0.0.1:1337/auth/)

-

### GET

Get the current user's Token .

#### Returns
| Field     | Type           | Description                                    |
| --------- | -------------- | ---------------------------------------------- |
| username  | string         | The username associated with the access token  |
| token     | string         | The access token                               |

```javascript
{
  "username": "admin",
  "token": "eyJhbGciOiJURU5BQkxFIiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlIjoiMjAxNi0wOC0yN1QwMDoxMToyOS45NzBaIn0=.IjM2MzMzNjM4MzYzMTM3NjE2NTc5NGE2ODYyNDc2MzY5NGY2OTRhNTU1MjU1MzU0MjUxNmI3ODQ2NDk2OTc3Njk2NDQ4NmM3NzQ5NmE2ZjY5NTM2YzY0NTU0OTZlMzAzZDJlNjU3OTRhMzE2MzMyNTY3OTYyNmQ0Njc0NWE1MzQ5MzY0OTZkNDY2YjYyNTc2Yzc1NDk2OTc3Njk1YTU4Njg3NzYxNTg0YTZjNDk2YTZmNjk0ZDZhNDE3ODRlNjkzMDc3NGY0MzMwNzk0ZTMxNTE3NzRkNDQ2Zjc4NGQ1NDZmNzk0ZjUzMzQzNTRlN2E0MjYxNDk2ZTMwM2Q2MzY4NjE3YTU5MzI2ODY4NjU2NzNkM2Qi"
}
```
-

### POST

Log in a user and refresh the user's access token.

#### Parameters

| Parameter | Type           | Description                                    |
| --------- | -------------- | ---------------------------------------------- |
| username  | string         | The username of the user to be logged in       |
| password  | string         | The non-encoded password                       |

#### Returns
| Field     | Type           | Description                                    |
| --------- | -------------- | ---------------------------------------------- |
| username  | string         | The username that was just logged in           |
| token     | string         | The new refreshed access token for the user    |

```javascript
{
  "username": "admin",
  "token": "eyJhbGciOiJURU5BQkxFIiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlIjoiMjAxNi0wOC0yN1QwMDoxMToyOS45NzBaIn0=.IjM2MzMzNjM4MzYzMTM3NjE2NTc5NGE2ODYyNDc2MzY5NGY2OTRhNTU1MjU1MzU0MjUxNmI3ODQ2NDk2OTc3Njk2NDQ4NmM3NzQ5NmE2ZjY5NTM2YzY0NTU0OTZlMzAzZDJlNjU3OTRhMzE2MzMyNTY3OTYyNmQ0Njc0NWE1MzQ5MzY0OTZkNDY2YjYyNTc2Yzc1NDk2OTc3Njk1YTU4Njg3NzYxNTg0YTZjNDk2YTZmNjk0ZDZhNDE3ODRlNjkzMDc3NGY0MzMwNzk0ZTMxNTE3NzRkNDQ2Zjc4NGQ1NDZmNzk0ZjUzMzQzNTRlN2E0MjYxNDk2ZTMwM2Q2MzY4NjE3YTU5MzI2ODY4NjU2NzNkM2Qi"
}
```
-

### DELETE

Logout a user and invalidate the user's access token 

#### Returns
| Field     | Type           | Description                                                   |
| --------- | -------------- | ------------------------------------------------------------- |
| token     | boolean        | Returns false if the invalidation of the token was successful |
```javascript
{
  "token": "false"
}
```


## USERS

[http://127.0.0.1:1337/users/](http://127.0.0.1:1337/users/)

-
### GET

Get an array of all users.

#### Returns
| Field     | Type           | Description                                                                   |
| --------- | -------------- | ----------------------------------------------------------------------------- |
| username  | string         | The username associated with the access token                                 |
| password  | string         | The encoded password *(included for demo, should exclude from production)*    |
| token     | string         | The user's access token *(included for demo, should exclude from production)* |

```javascript
[
  {
    "username": "admin",
    "password": "363336383631376131323334356368617a5932686865673d3d",
    "token": "eyJhbGciOiJURU5BQkxFIiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlIjoiMjAxNi0wOC0yN1QwMDoxMToyOS45NzBaIn0=.IjM2MzMzNjM4MzYzMTM3NjE2NTc5NGE2ODYyNDc2MzY5NGY2OTRhNTU1MjU1MzU0MjUxNmI3ODQ2NDk2OTc3Njk2NDQ4NmM3NzQ5NmE2ZjY5NTM2YzY0NTU0OTZlMzAzZDJlNjU3OTRhMzE2MzMyNTY3OTYyNmQ0Njc0NWE1MzQ5MzY0OTZkNDY2YjYyNTc2Yzc1NDk2OTc3Njk1YTU4Njg3NzYxNTg0YTZjNDk2YTZmNjk0ZDZhNDE3ODRlNjkzMDc3NGY0MzMwNzk0ZTMxNTE3NzRkNDQ2Zjc4NGQ1NDZmNzk0ZjUzMzQzNTRlN2E0MjYxNDk2ZTMwM2Q2MzY4NjE3YTU5MzI2ODY4NjU2NzNkM2Qi"
  }
]
```
-

### POST

Create a new user.

#### Parameters

| Parameter | Type           | Description                                    |
| --------- | -------------- | ---------------------------------------------- |
| username  | string         | The username of the user to be logged in       |
| password  | string         | The non encoded password                       |


```javascript
{
    "username" : "chaz",
    "password" : "12345"
}
```

#### Returns
| Field     | Type           | Description                                    |
| --------- | -------------- | ---------------------------------------------- |
| username  | string         | The username to be created                     |
| token     | string         | The new user's access token                    |

```javascript
{
  "username": "chaz",
  "token": "eyJhbGciOiJURU5BQkxFIiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6ImNoYXoiLCJleHBpcmUiOiIyMDE2LTA4LTI5VDIxOjEzOjM4LjQwNVoifQ==.IjM2MzMzNjM4MzYzMTM3NjE2NTc5NGE2ODYyNDc2MzY5NGY2OTRhNTU1MjU1MzU0MjUxNmI3ODQ2NDk2OTc3Njk2NDQ4NmM3NzQ5NmE2ZjY5NTM2YzY0NTU0OTZlMzAzZDJlNjU3OTRhMzE2MzMyNTY3OTYyNmQ0Njc0NWE1MzQ5MzY0OTZkNGU2ZjU5NTg2ZjY5NGM0MzRhNmM2NTQ4NDI3MDYzNmQ1NTY5NGY2OTQ5Nzk0ZDQ0NDUzMjRjNTQ0MTM0NGM1NDQ5MzU1NjQ0NDk3ODRmNmE0NTdhNGY2YTRkMzQ0YzZhNTE3NzRlNTY2ZjY5NjY1MTNkM2Q2MzY4NjE3YTU5MzI2ODY4NjU2NzNkM2Qi"
}
```
-

### DELETE

Remove users with matching key-value pairs; doesn't have to be a primary key.

#### Parameters
| Field     | Type           | Description                                                       |
| --------- | -------------- | ----------------------------------------------------------------- |
| ::key::   | string         | Use the field name of the key and the value to match for deletion |

``` javascript
{
    "username" : "chaz"
}
```

#### Returns
| Field       | Type           | Description                                   |
| ----------- | -------------- | --------------------------------------------- |
| deleted     | integer        | Returns the number of documents/rows deleted  |
```javascript
{
  "deleted": 1
}
```





## USERS/:id

[http://127.0.0.1:1337/users/admin](http://127.0.0.1:1337/users/admin)

-
### GET

Get a user object by primary key (:id)

#### Returns
| Field     | Type           | Description                                                                   |
| --------- | -------------- | ----------------------------------------------------------------------------- |
| username  | string         | The username associated with the access token                                 |
| password  | string         | The encoded password *(included for demo, should exclude from production)*    |
| token     | string         | The user's access token *(included for demo, should exclude from production)* |

```javascript
{
  "username": "admin",
  "password": "363336383631376131323334356368617a5932686865673d3d",
  "token": "eyJhbGciOiJURU5BQkxFIiwidHlwIjoiSldUIn0=.eyJ1c2VybmFtZSI6ImFkbWluIiwiZXhwaXJlIjoiMjAxNi0wOC0yN1QwMDoxMToyOS45NzBaIn0=.IjM2MzMzNjM4MzYzMTM3NjE2NTc5NGE2ODYyNDc2MzY5NGY2OTRhNTU1MjU1MzU0MjUxNmI3ODQ2NDk2OTc3Njk2NDQ4NmM3NzQ5NmE2ZjY5NTM2YzY0NTU0OTZlMzAzZDJlNjU3OTRhMzE2MzMyNTY3OTYyNmQ0Njc0NWE1MzQ5MzY0OTZkNDY2YjYyNTc2Yzc1NDk2OTc3Njk1YTU4Njg3NzYxNTg0YTZjNDk2YTZmNjk0ZDZhNDE3ODRlNjkzMDc3NGY0MzMwNzk0ZTMxNTE3NzRkNDQ2Zjc4NGQ1NDZmNzk0ZjUzMzQzNTRlN2E0MjYxNDk2ZTMwM2Q2MzY4NjE3YTU5MzI2ODY4NjU2NzNkM2Qi"
}
```
-

### DELETE

Remove the user object associated with the primary key (:id)

#### Returns
| Field       | Type           | Description                                          |
| ----------- | -------------- | ---------------------------------------------------- |
| deleted     | boolean        | Returns true if the object was successfully deleted  |
```javascript
{
  "deleted": true
}
```
-




## CONFIGURATIONS

[http://127.0.0.1:1337/configurations/](http://127.0.0.1:1337/configurations/)

-
### GET

Get an array of all configurations.

#### Returns
| Field     | Type           | Description                                     |
| --------- | -------------- | ----------------------------------------------- |
| name      | string         | The name of the configuration                   |
| hostname  | string         | The configuration's hostname                    |
| port      | integer        | The configuration's port                        |
| username  | string         | The username associated with the conffiguration |

```javascript
[
  {
    "name": "host1",
    "hostname": "nessus-ntp.lab.com",
    "port": 1241,
    "username": "toto"
  }
]
```
-

### POST

Create a new configuration object.

#### Parameters
| Field     | Type           | Description                                     |
| --------- | -------------- | ----------------------------------------------- |
| name      | string         | The name of the configuration                   |
| hostname  | string         | The configuration's hostname                    |
| port      | integer        | The configuration's port                        |
| username  | string         | The username associated with the configuration  |


```javascript
 {
    "name": "host10",
    "hostname": "twitter.com",
    "port": 6907,
    "username": "chaz"
  }
```

#### Returns
| Field     | Type           | Description                                         |
| --------- | -------------- | --------------------------------------------------- |
| name      | string         | The name of the new configuration                   |
| hostname  | string         | The new configuration's hostname                    |
| port      | integer        | The new configuration's port                        |
| username  | string         | The username associated with the new configuration  |

```javascript
 {
    "name": "host10",
    "hostname": "twitter.com",
    "port": 6907,
    "username": "chaz"
  }
```
-

### DELETE

Remove configurations with matching key-value pairs; doesn't have to be a primary key.

#### Parameters
| Field     | Type           | Description                                                       |
| --------- | -------------- | ----------------------------------------------------------------- |
| ::key::   | string         | Use the field name of the key and the value to match for deletion |

``` javascript
{
    "hostname": "nessus-ntp.lab.com"
}
```

#### Returns
| Field       | Type           | Description                                   |
| ----------- | -------------- | --------------------------------------------- |
| deleted     | integer        | Returns the number of documents/rows deleted  |
```javascript
{
  "deleted": 2
}
```





## CONFIGURATIONS/:id

[http://127.0.0.1:1337/configurations/host1](http://127.0.0.1:1337/configurations/host1)

-
### GET

Get a configuration object by primary key (:id)

#### Returns
| Field     | Type           | Description                                     |
| --------- | -------------- | ----------------------------------------------- |
| name      | string         | The name of the configuration                   |
| hostname  | string         | The configuration's hostname                    |
| port      | integer        | The configuration's port                        |
| username  | string         | The username associated with the configuration  |

```javascript
{
  "name": "host1",
  "hostname": "nessus-ntp.lab.com",
  "port": 1241,
  "username": "toto"
}
```
-

### DELETE

Remove the configuration object associated with the primary key (:id)

#### Returns
| Field       | Type           | Description                                          |
| ----------- | -------------- | ---------------------------------------------------- |
| deleted     | boolean        | Returns true if the object was successfully deleted  |
```javascript
{
  "deleted": true
}
```
-















