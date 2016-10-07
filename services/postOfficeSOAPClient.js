let soap = require('soap');

function PostOfficeSOAPClient() {

  this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';

}

PostOfficeSOAPClient.prototype.deadline = function(deliveryData, callback) {

  soap.createClient(this._url, function(err, client) {
    if (err) {

    }
    console.log('client soap created');

    let params = deliveryData;
    client.CalcPrazo(params, callback);
  });

}

module.exports = function() {
  return PostOfficeSOAPClient;
}