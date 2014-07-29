    var env = process.env.NODE_ENV || 'development';

    var config = {
      port: 3000,
      db: 'mongodb://localhost/songs',
      host: 'localhost'
    };

    module.exports = config;
