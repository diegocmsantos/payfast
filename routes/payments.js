module.exports = function(app) {

  app.get('/payments', function(req, res) {
    console.log('request received');
    res.send('ok');
  });

  app.post('/payments', function(req, res) {

    req.assert('payment.payment_way', 'payment way is required').notEmpty();
    req.assert('payment.amount', 'amount is required and must be a float').notEmpty().isFloat();
    req.assert('payment.currency', 'currency is required and must be a float').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.status(400).send(errors);
      return;
    }

    var payment = req.body["payment"];
    console.log('processing new payment request');

    payment.status = 'CREATED';
    payment.createdAt = new Date();

    var connection = app.database.connectionFactory();
    var paymentDAO = new app.database.PaymentDAO(connection);

    paymentDAO.save(payment, function(err, result) {
      if (err) {
        res.status(500).send(err);
        return;
      }

      payment.id = result.insertId;
      console.log('payment created');

      if (payment.payment_way === 'card') {

        let card = req.body['card'];
        let cardService = new app.services.cardService();
        cardService.authorize(card, function(error, request, resp, ret) {
          if (error) {
            console.log(error);
            res.status(500).send(error);
            return;
          }
          console.log(ret);

          res.location('/payments/' + payment.id);

          let response = {
            payment_data: payment,
            card: ret.card_data,
            links: [
              {
                href: "http://localhost:3000/payments/" + payment.id,
                rel: "confirm",
                method: "PUT"
              },
              {
                href: "http://localhost:3000/payments/" + payment.id,
                rel: "cancel",
                method: "DELETE"
              }
            ]
          };

          res.status(201).json(response);

        });

      } else {

        res.location('/payments/' + payment.id);

        let response = {
          payment_data: payment,
          links: [
            {
              href: "http://localhost:3000/payments/" + payment.id,
              rel: "confirm",
              method: "PUT"
            },
            {
              href: "http://localhost:3000/payments/" + payment.id,
              rel: "cancel",
              method: "DELETE"
            }
          ]
        };

        res.status(201).json(response);

      }

    });

  });

  app.put('/payments/:id', function(req, res) {

    req.checkParams('id', 'invalid id param').isInt();

    let errors = req.validationErrors();
    if (errors) {
      res.status(400).send(errors);
      return;
    }

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

    req.checkParams('id', 'invalid id param').isInt();

    let errors = req.validationErrors();
    if (errors) {
      res.status(400).send(errors);
      return;
    }

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