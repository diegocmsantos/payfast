var restify = require('restify');

function CardService() {

  var restifyOptions = {
    url: 'http://localhost:3001'
  }

  this._client = restify.createJsonClient(restifyOptions);

}

CardService.prototype.authorize = function(card, callback) {

  this._client.post('/cards/authorize', card, callback);

}

module.exports = function() {

  return CardService;

}