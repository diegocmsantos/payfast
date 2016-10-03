module.exports = function(app) {

  app.get('/payments', function(req, res) {
    console.log('request received');
    res.send('ok');
  });

  app.post('/payments', function(req, res) {

    req.assert('payment_way', 'payment way is required').notEmpty();
    req.assert('amount', 'amount is required and must be a float').notEmpty().isFloat();
    req.assert('currency', 'currency is required and must be a float').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
      return;
    }

    var payment = req.body;
    console.log('processing new payment request');

    payment.status = 'CREATED';
    payment.createdAt = new Date();

    var connection = app.database.connectionFactory();
    var paymentDAO = new app.database.PaymentDAO(connection);

    paymentDAO.save(payment, function(err, result) {
      if (err) {
        res.status(500).send(err);
      }

      console.log('payment created');
      res.location('/payments/' + result.insertId);
      res.status(201).json(payment);
    });

  });

  app.put('/payments/:id', function(req, res) {

    let payment = {};
    let id = req.params.id;

    payment.id = id;
    payment.status = "CONFIRMED";

    var connection = app.database.connectionFactory();
    var paymentDAO = new app.database.PaymentDAO(connection);

    paymentDAO.update(payment, function(err) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log('payment updated');
      res.send(payment);
    });

  });

  app.delete('/payments/:id', function(req, res) {

    let payment = {};
    let id = req.params.id;

    payment.id = id;
    payment.status = "CANCELLED";

    let connection = app.database.connectionFactory();
    let paymentDAO = new app.database.PaymentDAO(connection);

    paymentDAO.update(payment, function(err) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log('payment cancelled');
      res.status(204).send(payment);
    });

  });

}