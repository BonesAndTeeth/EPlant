var express = require('express'),
http = require('http'),
phantom = require('phantom');

var urlFactoringTrinomials = "http://coolmath.com/crunchers/algebra-problems-factoring-trinomials-0.htm";

var childArgs = [
path.join(__dirname, 'phantomjs-script.js'),
'some other argument (passed to phantomjs script)'
];

childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
  // handle results
})

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
              var data = {};
              text = $('[name="output1"]').val();
                var prop_name
                = th_text.trim().toLowerCase().replace(/[^a-z]/g,"");

                if({"country":1,"mayor":1,"elevation":1}[prop_name]) {
                  data[prop_name] = $(this).find("td").text();
                }
              });

              return data;

            }, function(data) {

              ph.exit();

              res.writeHead(200, {"Content-Type": "text/html"});
              res.write("<html><head><meta charset='UTF-8' />");
              res.write("</head><body><table>");

              for(var prop in data) {
                res.write("<tr><th>" + prop + "</th><td>");
                res.write(data[prop]);
                res.write("</td></tr>");
              }

              res.end("</table></body></html>");

              process.exit(0);
            });
          });
      });
    });
  });
  res.send("What is your name?@#$%;Violet");
});

app.get('/*', function  (req, res) {
  res.send(404, {status: 'not found'});
});

http.createServer(app).listen(3000, function () {
  console.log("Server ready at http://localhost:3000");
});