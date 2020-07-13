node-temp-mail
===================

Node wrapper for creating and fetching temporary, disposable emails, as well as their new messages.

#### Installation
```
npm install node-temp-mail
```

#### Usage
```
var TempMail = require('node-temp-mail');

// Let's create an address object so it can be accessed by the module.
var address = new TempMail("testAddress");

// We already have the address object, so now let's access it and get a list of the emails in a nice & neat json object.
address.fetchEmails(function(err,body){
  console.log(body);
});

// If for any reason you need to see the full temporary email address, you can use the following function.
address.getAddress()
```
