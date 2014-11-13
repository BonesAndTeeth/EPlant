var express = require('express'),
http = require('http'),
phantom = require('phantom');

var urlFactoringTrinomials = "http://coolmath.com/crunchers/algebra-problems-factoring-trinomials-0.htm";
var urlTwoEquations = "http://coolmath.com/crunchers/algebra-problems-systems-equations-2x2.htm";
var urlMath = "http://www.tom-muck.com/math.html";

var app = express();
app.use(express.static('public'));

app.get('/qaTwoEquations', function  (req, res) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(urlTwoEquations, function (status) {
        page.includeJs(
          "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
          function() {
            page.evaluate(function() {
              $('[name="Button1"]').click();
              $('[name="Button"]').click();
              var data = {
                "equation1": $('[name="output11"]').val(),
                "equation2": $('[name="output22"]').val(),
                "answer": $('[name="output10"]').val(),
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

app.get('/doMath', function  (req, res) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(urlMath, function (status) {
        page.includeJs(
          "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js",
          function() {
            page.evaluate(function() {
              var data = {"question":{}, "answer":{}};
              var type = Math.floor(Math.random()*5+1); // random type 
              var operators = ['','/','*','+','-','% of'];

              $("#typeProblem").val(type.toString()); // select type
              $('[name="howMany"]').children().first().attr('selected','selected'); // 5 problems
              $('input[name="answers"][value="1"]').attr('checked','checked') // check 'question and answer'
              $('input[name="answers"][value="0"]').attr('checked','') // uncheck 'answer only'
              $('#submit').click() // generate
              
              var qadiv = $("#theDisplay")
              var qawrapper = qadiv.children('table').eq(1).children('tbody').eq(0).children('tr').eq(0);

              qawrapper.children('td').each(function(qid){
                
                var qatable = $(this).children('table').eq(0);
                if(type>=2 && type<=4){
                  var op0 = qatable.find('td').eq(0).html();
                  var op1 = qatable.find('td').eq(1).html().replace(/x|\s+/g,""); // strip operator and space
                  var answer = qatable.find('td').eq(2).html();
                  data['question'][qid] = op0+""+operators[type]+op1;
                } // + - *

                else if(type == 1){
                  var op0 = qatable.find('td').eq(3).html();
                  var op1 = qatable.find('td').eq(2).html();
                  var answer = qatable.find('td').eq(1).html();
                  data['question'][qid] = op0+""+operators[type]+op1;
                } // division

                else{
                  var question= qatable.find('td').eq(0).html();
                  var answer = qatable.find('td').eq(1).html().substring(3); // strip operator
                  data['question'][qid] = question;
                } // percentage
                data['answer'][qid] = Number(answer);
              });

              return data;
            }, function(data) {
              ph.exit();
              res.json(data);
            });
          });
      });
    });
  });
});

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