
var express = require('express')
  , route = require('./routes/index')
  , http = require('http')
  , path = require('path');

var app = express();

//all environments
app.set('port', process.env.PORT || 3000);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')){
  app.use(express.errorHandler());
}

app.get('/isbn/:num', route.getIsbn);
app.get('/user/regist/:id/:num/:date', route.registUser);
app.get('/user/update/:id/:num/:date', route.updateUser);
app.get('/user/get/:id', route.getUser);
app.get('/user/reset/:id', route.resetUser);
app.get('/user/progess/:id/:page', route.setProgress);



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
