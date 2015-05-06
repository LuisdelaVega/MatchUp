angular.module('Authentication', [])

.factory('AuthenticationService', ['$http','$rootScope',
    function ($http,$rootScope) {
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
			localStorage.setItem('token', token);
			localStorage.setItem('username', username);
		};

		service.isAuthenticated = function () {
			return (localStorage.getItem("token") && localStorage.getItem("username"));
		}

		service.clearCredentials = function () {
			localStorage.clear();
		};

		return service;
    }]);