Slimple NodeJS Framework 
========================
A slim and simple nodejs framework.  
  
The idea of Slimple is to make it easy for you to write service oriented nodejs web applications.  
It is abandonning too much fancy shmancy modules and tries as much as possible to be pure JS.  
  
At the first look, it might not be as simple as express for instance.  
But it provides you a coherent environment for writing apps.  
Its core focus lies on a service oriented architecture and MongoDB support.  
Everything you create will be loaded automatically to the Slimple application context (if you follow the convention). 
  
The official [website](http://slimple.eu01.aws.af.cm/) is still work in progress and not fully up-to-date.  
If the message "In progres" appears, just hit refresh.


> Caution: There are breaking changes in version 0.5.0.  
> The resource path to your services can now be defined with the folder structure.  
> For example the resource /echo/:text will now be a folder /echo with the service in it. The resource defined in the service will be just :text  
> Slimple automatically adds the folder structure to the resource path.

## Installation
```
$ npm install slimple
```
As it doesn't come with convenient building tools, following step has to be done manually to get your first Slimple app running:  
  
```
copy the content of  
/node_modules/slimple/examples/skeleton   
to your project root folder
```

### Mongoose Support  
If you want to add mongoose support to your project, perform following steps:  
```
$ npm install mongoose  
```
* add mongoose dependency to the package.json of your project  
* open /config/db.js  
* set property "active" to true  
* set the connectionString to your db

### Run the app  
You don't have to worry about the apps.js at the moment.  
If you're familiar with JS you know what you can do with it.  
```
$ node app
```
## Features

* REST services
* MongoDB support
* Server side events
* Simple HTTP server

## Examples
By installing the skeleton app, you already get some examples of how to write services, mongoose schemas and events.  
Just have a look at the corresponding folders, you will see that it is really easy.  

### Services
By default, the services are located in the /services folder.  
By adding subfolders, you create the path to your REST service:

```
$ mkdir /services/echo  
```

Now create a file (the name doesn't matter) and add the basic service structure:
```
module.exports = {
    resource: '(/:what)',
    GET: function(ctx, data, http){
        http.reply(data.what);
    }
};
```  
This service will be available through this URL:
/echo  
You can nest folders as much as you like, but keep in mind that each folder will be added to the resource path.  
You also create other methods like POST, DELETE or PUT.  
As you can see, the service method(s) need following parameters: 

* ctx - the application context where events and schemas are available  
* data - the data passed to this service from the client  
* http - request and response wrapper  


http.reply is a convenient method to send back data to the client. It will be stringified automatically if it is a JSON object.

The resource defined here is a URL pattern which will be resolved by [WayJS](https://github.com/haggen/wayjs).  
For further informations about what URL patterns are possible, have a look at the WayJS documentation.  
  
#### Error handling
If you like to return some http errors, just throw an error object in your service:  
```
throw { status: 500, message : new Error("that sucks")};
```
#### Session handling
Accessing session attributes within a service is quite simple:  
```
var sessionId = http.session.uid();
var attribute = http.session.get('attribute');
http.session.set('attribute', attribute);
```
### Mongoose  
Because Slimple uses the mongoose module, you can take a look at the [mongoose documentation](http://mongoosejs.com/docs/guide.html) about what is possible.  
To use mongoose schemas in Slimple, you can simply place your schema below the /schemas folder.  
```
module.exports = {
    name: 'BlogPost',
    schema: {
        author  : { type: "String", required: true},
        title   : { type: "String", required: true},
        body    : { type: "String", required: true},
        date    : { type: "Date", default: new Date() }
    }
};
```
It's quite easy to use this schema in a service now:
```
var model = ctx.db.model('BlogPost);
```
You don't have to worry about creating the schema and connecting to the database, Slimple will do that for you.  

### Events  
Similar thing for server side events.  
Just put your event code below the /events folder.  
```
module.exports = {
  name: 'echoEvent',
  invoke: function(ctx, data){
      ctx.log.trace(data);
  }
};
```
And fire the event (for example) in your service:  
```
ctx.event.emit("echoEvent", "hello event");
```
### Logging
Convenient logging stuff is possible with
```
ctx.log.trace(msg)
ctx.log.debug(msg)
ctx.log.info(msg)
ctx.log.error(msg)
ctx.log.fatal(msg)
```
### Application context
Documentation on this topic will follow soon.

