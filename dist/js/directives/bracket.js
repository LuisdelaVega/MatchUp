var myApp = angular.module("bracketDirective", []);

//FUNCIONAAA
myApp.directive("match", function ($compile) {
	return {
		restrict: 'E',
		link: function (scope, element, attrs) {
			var html = "";
			if (attrs.bye == "true") {
				html = '<li class="bye-spacer"></li>';
			} else {
				// Check if match is completed
				if (attrs.completed == "true") {
					// Check score to asign winner
					if (parseInt(attrs.score1) > parseInt(attrs.score2)) {
						// Player 1 won
						if (attrs.position1 == "top" || !attrs.position1) {
							html = '<li class="' + ((attrs.loserBye) ? "bye-player winner" : "game game-top winner") + '">' + attrs.player1 + ' (Match ' + attrs.match + ')' +
								'<span>' + attrs.score1 + '</span></li>' +
								'<li class="game game-spacer">&nbsp;</li>' +
								'<li class="game game-bottom">' + attrs.player2 +
								'<span>' + attrs.score2 + '</span></li>';
						} 
						else {
							html = '<li class="' + ((attrs.loserBye) ? "bye-player" : "game game-top") + '">' + attrs.player2 + ' (Match ' + attrs.match + ')' +
								'<span>' + attrs.score2 + '</span></li>' +
								'<li class="game game-spacer">&nbsp;</li>' +
								'<li class="game game-bottom winner">' + attrs.player1 +
								'<span>' + attrs.score1 + '</span></li>';
						}
					}
					else {
						// Player 2 won
						if (attrs.position1 == "top" || !attrs.position1) {
							html = '<li class="' + ((attrs.loserBye) ? "bye-player" : "game game-top") + '">' + attrs.player1 + ' (Match ' + attrs.match + ')' +
								'<span>' + attrs.score1 + '</span></li>' +
								'<li class="game game-spacer">&nbsp;</li>' +
								'<li class="game game-bottom winner">' + attrs.player2 +
								'<span>' + attrs.score2 + '</span></li>';
						} else {
							html = '<li class="' + ((attrs.loserBye) ? "bye-player winner" : "game game-top winner") + '">' + attrs.player2 + ' (Match ' + attrs.match + ')' +
								'<span>' + attrs.score2 + '</span></li>' +
								'<li class="game game-spacer">&nbsp;</li>' +
								'<li class="game game-bottom">' + attrs.player1 +
								'<span>' + attrs.score1 + '</span></li>';
						}
					}
				}
				// Not completed
				else {
					if (attrs.position1 == "top" || !attrs.position1) {
						html = '<li class="' + ((attrs.loserBye) ? "bye-player" : "game game-top") + '">' + attrs.player1 + ' (Match ' + attrs.match + ')' +
							'<span>' + ((!attrs.score1) ? "" : parseInt(attrs.score1)) + '</span></li>' +
							'<li class="game game-spacer">&nbsp;</li>' +
							'<li class="game game-bottom">' + attrs.player2 +
							'<span>' + ((!attrs.score2) ? "" : parseInt(attrs.score2)) + '</span></li>';
					} else {
						html = '<li class="' + ((attrs.loserBye) ? "bye-player" : "game game-top") + '">' + attrs.player2 + ' (Match ' + attrs.match + ')' +
							'<span>' + ((!attrs.score1) ? "" : parseInt(attrs.score1)) + '</span></li>' +
							'<li class="game game-spacer">&nbsp;</li>' +
							'<li class="game game-bottom">' + attrs.player1 +
							'<span>' +  ((!attrs.score2) ? "" : parseInt(attrs.score2)) + '</span></li>';
					}
				}
				
				if(attrs.extra == "true"){
					html = '<li class="bye-spacer"></li><li class="spacer" ng-repeat-end>&nbsp;</li>' + html + '<li class="spacer" ng-repeat-end>&nbsp;</li> <li class="bye-spacer"></li>';
				}
			}
			element.replaceWith(html);
		}
	}
});

//myApp.directive("match", function () {
//	return {
//		restrict: 'E',
//		replace: "true",
//		priority: 1111,
//		template: "<h3>hey</h3>",
//		compile: function (element, attrs) {
//			console.log("hey");
//			var html = "";
//			if (!attrs.player1 || !attrs.player2 || !attrs.score1 || !attrs.score2) {
//				html = '<li class="bye-spacer"></li>';
//			} else {
//				html = '<li class="game game-top">' + attrs.player1 +
//					'<span>' + attrs.score1 + '</span></li>' +
//					'<li class="game game-spacer">&nbsp;</li>' +
//					'<li class="game game-bottom winner">' + attrs.player2 +
//					'<span>' + attrs.score2 + '</span></li>';
//			}
//			//			element.replaceWith("<h3>hey</h3>");
//			element.replaceWith(html);
//		}
//	}
//});



//DOES NOT WORK
//myApp.directive("match", function () {
//	return {
//		restrict: 'E',
//		replace: "true",
//		priority: 1111,
//		scope:{
//			item: '='	
//		},
//		templateUrl: function(elem,attr){
//			if(attr.bye){
//				return '../../public/tournament/bye-template.html';
//			}
//			else{
//				return '../../public/tournament/match-template.html';
//			}
//		}
//	}
//});