module.exports = function(app) {

  app.post('/postoffice/deadline', function(req, res) {
    
    let deliveryData = req.body;

    let postOffice = new app.services.postOfficeSOAPClient();
    postOffice.deadline(deliveryData, function(err, result) {

      if (err) {
        res.status(500).send(err);
        return;
      }

      console.log(JSON.stringify(result));
      res.status(200).json(result);

    });

  });

}