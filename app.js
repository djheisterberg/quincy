var express = require('express');
var fs = require('fs');
var http = require('http');
var BASE_URI = require('base-uri');
var path = require('path');
var PORT = 1337;

var app = express();
var mysql = require('mysql');
var mysqlconfig;
var mysqlpool;


fs.readFile('./mysql.config', function(err, data) {
   if (err) {
      console.error('Could not read mysql.config file', err);
   } else {
      mysqlconfig = JSON.parse(data);
      mysqlpool = new mysql.createPool(mysqlconfig);
   }
});

app.use(function(req, res, next) {
  console.log(BASE_URI);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD");
  res.header("Access-Control-Max-Age", "1209600");

  next();
});

app.get(BASE_URI + '/job/:system/:id', function(req, res) {
   var system = req.params.system;
   var id = req.params.id
   var jid = id + '.' + system;

   mysqlpool.getConnection(function(err, cnx) {
      if (err) {
         res.status(500).send(err);
      } else {
        cnx.query('select * from Jobs where jobid like ? and system=?', [jid + '%', system], function(err, results, fields) {
          //cnx.query('select * from jobs limit 1 ', [jid + '%', system], function(err, results, fields) {
            if (err) {
               res.status(500).send(err);
            } else {
               if (results.length === 0) {
                  res.status(404).end();
               } else {
                  var job = {};
                  var rs = results[0];
                  for (var i = 0; i < fields.length; i++) {
                     var key = fields[i].name;
                     var value = rs[key];
                     job[key] = value;
                  }
                  res.json(job);
               }
            }
         });
         cnx.release();
      }
   });
});


app.use(express.static('public'));

var httpServer = http.createServer(app).listen(PORT, function() {
});
