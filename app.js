    var express = require('express'), mongoose = require('mongoose'), fs = require('fs'), http = require('http'),
            config = require('./config/config'), root = __dirname, app = express(), server = null;
            
    require('./config/db')(config);
        var modelsPath = __dirname + '/server/models';
    fs.readdirSync(modelsPath).forEach(function (file) {
      if (file.indexOf('.js') >= 0) {
        require(modelsPath + '/' + file);
      }
    });
        require('./config/express')(app, config);
    require('./config/routes')(app);
    
        var server = http.createServer(app);
    server.listen(config.port, config.host);
    console.log('App started on port ' + config.port);
