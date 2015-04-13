var myApp = angular.module('InputDirectives', []);

myApp.directive('validInput', function () {
	return {
		require: '?ngModel',
		scope: {
			"inputPattern": '@'
		},
		link: function (scope, element, attrs, ngModelCtrl) {

			var regexp = null;

			if (scope.inputPattern !== undefined) {
				regexp = new RegExp(scope.inputPattern, "g");
			}

			if (!ngModelCtrl) {
				return;
			}

			ngModelCtrl.$parsers.push(function (val) {
				if (regexp) {
					var clean = val.replace(regexp, '');
					if (val !== clean) {
						ngModelCtrl.$setViewValue(clean);
						ngModelCtrl.$render();
					}
					return clean;
				} else {
					return val;
				}

			});

			element.bind('keypress', function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
});

myApp.directive('validDecimal', function () {
	return {
		require: '?ngModel',
		link: function (scope, element, attrs, ngModelCtrl) {
			if (!ngModelCtrl) {
				return;
			}

			ngModelCtrl.$parsers.push(function (val) {
				if (angular.isUndefined(val)) {
					var val = '';
				}
				var clean = val.replace(/[^0-9\.]/g, '');
				var decimalCheck = clean.split('.');

				if (!angular.isUndefined(decimalCheck[1])) {
					decimalCheck[1] = decimalCheck[1].slice(0, 2);
					clean = decimalCheck[0] + '.' + decimalCheck[1];
				}

				if (val !== clean) {
					ngModelCtrl.$setViewValue(clean);
					ngModelCtrl.$render();
				}
				return clean;
			});

			element.bind('keypress', function (event) {
				if (event.keyCode === 32) {
					event.preventDefault();
				}
			});
		}
	};
});