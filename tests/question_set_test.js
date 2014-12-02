var util = require('utils');

casper.test.begin('EPlant Functionality Tests', 8, function suite(test) {

   /*
	* First round of tests on whether questions show up (6 test cases)
	*/
	casper.start("http://localhost:3000/", function() {
		this.click('#questionSelectionDropdown');
	});

	casper.then(function() {
		test.assertVisible('#firstQuestion', "Dropdown item #1 should show up");
		test.assertVisible('#secondQuestion', "Dropdown item #2 should show up");
		test.assertVisible('#thirdQuestion', "Dropdown item #3 should show up");
		test.assertVisible('#fourthQuestion', "Dropdown item #4 should show up");
	});

	casper.wait(1000, function() {
		this.click('#thirdQuestion');
	});

	casper.waitUntilVisible('#qaform', function() {
		test.assertNotVisible('#question2', "There should be no second line for calculation problem");
		test.assertVisible('#problem', "Problem section should show up");
	});

   /*
	* Second round of tests on whether question/answer check works well (6 test cases)
	*/
	casper.wait(500, function() {
	 	//Wrong answer
	 	question = this.getHTML('#question');
	 	this.fill('#answerSection', {
	 		'answerInput':    "blah",
	 	}, true);
	 	
	 });

	casper.wait(1000, function() {
		this.click('#submitbtn');
	});

	casper.waitForSelector('#reply', function() {
		test.assert(this.exists('#replyContent'), "Response section should show up and tell if the user got right answer");
	});

	casper.wait(1000, function() {
		this.click('#closeIcon');
	});

	casper.wait(1000, function() {
		test.assertNotVisible('#qaform', "Question modal should close");
	});

	casper.run(function() {
		test.done();
	});

});


