var app = require('./config/custom-express')();

app.listen(3000, function() {
  console.log('server listening on port 3000');
});