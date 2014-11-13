var express = require('express'),
http = require('http'),
phantom = require('phantom');

var urlFactoringTrinomials = "http://coolmath.com/crunchers/algebra-problems-factoring-trinomials-0.htm";

var app = express();
app.use(express.static('public'));

app.get('/qaFactoringTrinomials', function  (req, res) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(urlFactoringTrinomials, function (status) {
        page.includeJs(
          "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
          function() {
            page.evaluate(function() {
              $('[name="Button1"]').click();
              $('[name="Button"]').click();
              var data = {
                "question": $('[name="output1"]').val(),
                "answer": $('[name="output6"]').val()
              };
              return data;
            }, function(data) {
              ph.exit();
              res.json(data);
              //process.exit(0);
            });
          });
      });
    });
  });
});

app.get('/*', function  (req, res) {
  res.json(404, {status: 'not found'});
});

http.createServer(app).listen(3000, function () {
  console.log("Server ready at http://localhost:3000");
});