let allowCrossDomain = function (req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Credentials', 'true');
   res.setHeader('Content-Security-Policy', 'img-src');
   res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Headers, Authorization, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
   );
   next();
};

module.exports = [allowCrossDomain];
