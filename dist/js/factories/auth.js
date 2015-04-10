angular.module('Authentication', [])

.factory('AuthenticationService', ['$http', '$window','$rootScope',
    function ($http, $window,$rootScope) {
		var service = {};

		service.Login = function (username, password, callback) {

			// Base 64 encoding
			var AuHeader = 'Basic ' + btoa(username + ':' + password);
			var config = {
				headers: {
					'Authorization': AuHeader
				}
			};
			
			$http.post($rootScope.baseURL+'/login', {}, config).success(function (response, status) {
				callback(response, status);
			}).error(function (err) {
				callback(err)
			});

		};

		service.SetCredentials = function (username, token) {
			$window.sessionStorage.token = token;
			$window.sessionStorage.username = username;
		};

		service.isAuthenticated = function () {
			return ($window.sessionStorage.usernamename && $window.sessionStorage.token);
		}

		service.clearCredentials = function () {
			$window.sessionStorage.clear();
		};

		return service;
    }]);