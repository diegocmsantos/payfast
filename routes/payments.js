module.exports = function(app) {

  app.get('/payments', function(req, res) {
    console.log('request received');
    res.send('ok');
  });

  app.post('/payments', function(req, res) {
    var payment = req.body;
    console.log(payment);
    res.send('ok');
  });

}