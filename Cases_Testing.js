casper.test.begin('EPlant Functionality Tests', 16, function suite(test) {

	/*
	 * First round of tests on whether login/signup modals show up (7 test cases)
	 */
	 casper.start("http://localhost:3000/", function() {
	 	test.assertNotVisible('#loginModal', "login modal not visible");
	 });

	 casper.thenClick('#loginB');

	 casper.then(function() {
	 	test.assertVisible('#loginModal', "login modal visible");
	 	test.assertVisible('#signUpB', "signup button visible");
	 });

	 casper.wait(1000, function() {
	 	this.click('#signUpB');
	 });

	 casper.wait(1000, function() {
	 	test.assertVisible('#UsernameField', "Username field should be visible");
	 	test.assertNotVisible('#loginModal', "login modal should be invisible after click");
	 	test.assertVisible('#signUpModal', "signup modal is visible after click");
	 });

	//This should dismiss the modal
	casper.wait(1000, function() {
		this.click('#joinB');
	});

	casper.wait(1000, function() {
		test.assertNotVisible('#signUpModal', "signup modal should dismiss after a meaningless click");
	});

	/*
	 * Second round of tests on whether login works well (6 test cases)
	 */
	 casper.wait(1000, function() {
	 	this.click('#loginB');
	 });

	 casper.wait(500, function() {
	 	this.fill('#loginEmailField', {
	 		'loginEmail':    'a@a.com',
	 	}, false);
	 	this.fill('#loginPasswordField', {
	 		'loginPassword':    'a',
	 	}, false);
	 });

	 casper.wait(1000, function() {
	 	this.click('#loginClickButton');
	 });

	 casper.waitUntilVisible('#logoutB', function() {
	 	test.assertVisible('#logoutB', "logout item should show");
	 	test.assertVisible('#loggedInItem', "loggedin item should show");
	 	test.assertNotVisible('#loginB', "login item should not show");
	 });


	 casper.then(function() {
	 	this.click('#logoutB');
	 	test.assertNotVisible('#logoutB', "logout item should not show");
	 	test.assertNotVisible('#loggedInItem', "loggedin item should not show");
	 	test.assertVisible('#loginB', "login item should show");
	 });

	//Third round of tests on whether signup works well (3 test cases)
	casper.wait(2000, function() {
		this.click('#loginB');
	});

	casper.wait(2000, function() {
		this.click('#signUpB');
	});

	casper.wait(2000, function() {
		var random = Math.floor(Math.random() * 70000000);
		var name = "test_"+ "haha" + random;
		var email = name + "@test.com";
		this.fill('#UsernameField', {
			'Username':    name,
		}, true);
		this.fill('#EmailField', {
			'Email':    email,
		}, true);
		this.fill('#PasswordFirstField', {
			'PasswordFirst':    '123456',
		}, true);
		this.fill('#PasswordConfirmField', {
			'PasswordConfirm':    '123456',
		}, true);
	});

	casper.wait(2000, function() {
		this.click('#joinB');
	});

	casper.wait(2000, function() {
		test.assertVisible('#logoutB', "User should be logged in after registration");
		test.assertVisible('#loggedInItem', "After login, username should show up");
		test.assertNotVisible('#loginB', "login icon should disapear");
	});

	casper.wait(500, function() {
		//test.assertEquals(this.getHTML('#loggedInItem'), 'Hi, '+name);
		this.click('#logoutB');
	});

	casper.run(function() {
		test.done();
	});

});


