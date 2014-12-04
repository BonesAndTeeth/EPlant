//SignUp, logIn, logOut are snippets from mp3
angular.module("plantApp", ['firebase', 'questionServices','answerServices','settreeServices'])
.controller("AppCtrl",function($scope, $firebase,$rootScope){
	FirebaseRef = new Firebase("https://eplant.firebaseio.com");
	$scope.usr = null;
	$scope.data = "data";
	$scope.loggedIn = true;

	//logout fucntion
	$scope.logout = function(){
		$scope.loggedIn = false;
		FirebaseRef.unauth();
		$scope.usr = null;
	}

	//login function
	$scope.userLogin = function(email, password, set){
		$('.basic.modal').modal('hide');

		FirebaseRef.authWithPassword({
			"email"    : email,
			"password" : password
		}, function(error, authData) {
			if (error) {
				console.log('Login Failed!', error);
			} else {
				var auth = $firebase(FirebaseRef.child("users").child(authData.uid));
				if(set==true){
					auth.$set({username: $scope.Username, email: $scope.Email});
					$scope.Username = "";
					$scope.Email = "";
					$scope.PasswordFirst = "";
					$scope.PasswordConfirm = "";
				}
				$scope.usr = auth.$asObject();
				$scope.loggedIn = true;
				$scope.loginEmail = "";
				$scope.loginPassword = "";
				$rootScope.$broadcast('userLoggedIn', $scope.usr);
			}
		});
	};

	//signup function
	$scope.userSignup = function(){
		$('.signup.small.modal').modal('hide');
		if($scope.PasswordFirst!=$scope.PasswordConfirm){
			alert("Sorry! The passwords do not match :(");
		}
		else{
			FirebaseRef.createUser({
				email    : $scope.Email,
				password : $scope.PasswordConfirm
			}, function(err) {
				if (err) {
					switch (err.code) {
						case 'EMAIL_TAKEN':
						console.log(err.code);
						case 'INVALID_EMAIL':
						console.log(err.code);
					}
				} else {
					$scope.userLogin($scope.Email, $scope.PasswordConfirm, true);
				}
			});
		}
	};

	//This controls the signup popup window
	$scope.signupmodal = function(){
		$('.signup.small.modal')
		.modal('setting',{
			closable  : true,
			onDeny    : function(){},
			onApprove : function(){}
		})
		.modal('hide others')
		.modal('show');
	}

	//This controls the login popup window
	$scope.loginmodal = function(){
		$('.basic.modal')
		.modal('setting',{
			closable  : true,
			onDeny    : function(){},
			onApprove : function(){}
		})
		.modal('hide others')
		.modal('show');

	};
}); 