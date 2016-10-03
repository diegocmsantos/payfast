module.exports = function(app) {

  app.get('/payments', function(req, res) {
    console.log('request received');
    res.send('ok');
  });

  app.post('/payments', function(req, res) {

    req.assert('payment_way', 'payment way is required').notEmpty();
    req.assert('amount', 'amount is required and must be a float').notEmpty().isFloat();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
      return;
    }

    var payment = req.body;
    console.log('processing new payment request');

    payment.status = 'CREATED';
    payment.createAt = new Date();

    var connection = app.database.connectionFactory();
    var paymentDAO = new app.database.PaymentDAO(connection);

    paymentDAO.save(payment, function(err, result) {
      if (err) {
        res.status(500).send(err);
      }

      console.log('payment created');
      res.json(payment);
    });

  });

}