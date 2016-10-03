module.exports = function(app) {

  app.get('/payments', function(req, res) {
    console.log('request received');
    res.send('ok');
  });

  app.post('/payments', function(req, res) {
    var payment = req.body;
    console.log('processing new payment request');

    payment.status = 'CREATED';
    payment.createAt = new Date();

    var connection = app.database.connectionFactory();
    var paymentDAO = new app.database.PaymentDAO(connection);

    paymentDAO.save(payment, function(err, result) {
      console.log(err);
      console.log('payment created');
      res.json(payment);
    });

  });

}