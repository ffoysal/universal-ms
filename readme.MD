# Universal-MS

Often time developer need a microservice just to play with different technologies, like 
- to put a service behind a proxy
- make a service to call another service
- create mutiple services so that a service mesh can be experimented
  
by keeping all those use cases, the microservice is just `JSON` file driven to serve very minimal use cases.

The json config is self explanatory

```
{
    "msName": "universal-1",
    "routes": [
        {
            "path": "/",
            "method": "get",
            "responseBody": {
                "hello": "Hello world",
                "there": "something new"
            },
            "responseCode": 200
        },
        {
            "path": "/dummy",
            "method": "get",
            "responseBody": {
                "hello": "Hello dummy",
                "there": "something dummy"
            },
            "responseCode": 200
        },
        {
            "path": "/myport",
            "method": "post",
            "responseBody": {
                "hello": "Hello world POST",
                "there": "something new POST"
            },
            "responseCode": 200
        },
        {
            "path": "/callapp2",
            "method": "get",
            "externalService": "http://localhost:4000/dummy"
        }
    ]
}
```

### Create two different service using docker compose

Please have a look at `example` direcotry