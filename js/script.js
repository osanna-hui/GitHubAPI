var myApp = angular.module("ghMod", []);
myApp.controller("ghCtrl", ["$scope", function($scope){

	document.getElementById("submit").onclick = function(){
		searchRepos();
	}
	
	function searchRepos(){
		var username = document.getElementById("username").value;
		var reqUser = "https://api.github.com/users/"+username;

		document.getElementById('search').style.display = "none";
		document.getElementById('resultHeader').style.display = "block";
		document.getElementById('results').style.display = "block";
		console.log("looking for "+username+"'s repositories?");
		requestJSON(reqUser, function(respUser){
			//check username
			if(respUser.message == "Not Found"){
				document.getElementById("display").innerHTML = "Please make sure you have the correct username";
				return;
			}

			console.log(respUser);
			document.getElementById("avatar_url").src = respUser.avatar_url;
			$scope.username = respUser.login;
			$scope.joinDate = respUser.created_at;
			$scope.location = respUser.location;
			$scope.publicRepos = respUser.public_repos;

			var reposURL = respUser.repos_url;

			requestJSON(reposURL, function(respRepos){
				//format repos title
				for (i=0; i<respRepos.length; i++){
					respRepos[i].name = respRepos[i].name.replace(/_-/g," ");
				}

				$scope.$apply(function(){
					$scope.repos = respRepos;
				});
			});
		});
	}

	function requestJSON(url, callback){
		$.ajax({
			url: url,
			complete: function(resp){
				callback.call(null, resp.responseJSON);
			}
		});
	}

}]);