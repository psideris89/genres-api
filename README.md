# genres-api
Node.js - Express rest api

## Application startup
```
node app.js
```

## Run profile
To run the application with a specific profile
```
NODE_ENV=staging node app.js
```

## Environmental variables
To run the application the {APP_PASSWORD} needs to be exported.
```
APP_PASSWORD=123 node app.js
```

```
export APP_PASSWORD=123
node app.js
```

## Debugging
The **debug** package is included in the project, and it could be enabled by:
```
DEBUG=app* node app.js
```
 You can customise the debug profiles instead of using a wildcard
```
DEBUG=app:startup,app:http node app.js
```
