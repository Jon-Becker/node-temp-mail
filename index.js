var request = require('request');

function buildJson(callback, label, currentJson, addressJson, currentIndex, finalIndex) {

  request({
    url: "https://www.1secmail.com/api/v1/?action=readMessage&login="+label+"&domain=1secmail.com&id="+addressJson[currentIndex].id,
    json: true
  }, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      return callback(error || {statusCode: response.statusCode});
    }
    else {
      var messageBody = {}
      messageBody.from = body.from;
      messageBody.timestamp = body.date;
      messageBody.subject = body.subject;
      messageBody.message = body.textBody;
      currentJson.messages.push(messageBody);
      if((currentIndex+1) < finalIndex){
        buildJson(label, currentJson, addressJson, (currentIndex+1), finalIndex);
      }
      else {
        callback(null, currentJson);
      }
    }
  });
}

class TempMail {
  constructor(mailingAddressLabel) {
    this.mailingAddressLabel = mailingAddressLabel;
  }

  fetchEmails(callback){
    var isComplete = false;
    var mailingAddressLabel = this.mailingAddressLabel;


    request({
      url: "https://www.1secmail.com/api/v1/?action=getMessages&login="+mailingAddressLabel+"&domain=1secmail.com",
      json: true
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        return callback(error || {statusCode: response.statusCode});
      }
      else {
        response = {};
        response.address = mailingAddressLabel + "@1secmail.com";
        response.messageCount = body.length;
        response.messages = [];
        if(body.length > 0){
          buildJson(callback, mailingAddressLabel, response, body, 0, body.length);
        }
        else {
          callback(null, response);
        }
      }
    });


  }

  getAddress(){
    var response = {};
    response.address = this.mailingAddressLabel + "@1secmail.com";
    return response;
  }
}

module.exports = TempMail;
