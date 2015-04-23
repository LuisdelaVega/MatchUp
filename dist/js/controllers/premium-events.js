var myApp = angular.module('premium-events', []);

//Controller used to manage the Premium event page, includes various tasks such as retriving participants, sponsors, the organization hosting the event, the different tournaments, meetups and news
myApp.controller('eventPremiumSummaryController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {

	var now_utc = new Date();

	$q.all([
	// Get Event Info
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location + ''),

	// Get Sponsors
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/sponsors?date=' + $stateParams.date + '&location=' + $stateParams.location),

	// Get News
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/news?date=' + $stateParams.date + '&location=' + $stateParams.location),

	// Participants
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/spectators?date=' + $stateParams.date + '&location=' + $stateParams.location),

	// Tournaments
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/tournaments?date=' + $stateParams.date + '&location=' + $stateParams.location)]).then(function (results) {

		// Get Events
		$scope.eventInfo = results[0].data;

		var startDate = new Date($scope.eventInfo.event_start_date);
		var endDate = new Date($scope.eventInfo.event_end_date);
		var registration = new Date($scope.eventInfo.event_registration_deadline);

		$scope.isOngoing = false;
		// Check if event ended
		if (endDate.getTime() < now_utc.getTime()) {
			
			$scope.finished = true;
			
		} else {
			$scope.finished = false;
			$scope.isOngoing = (startDate.getTime() < now_utc.getTime());
		}

		// Get Host info
		$http.get($rootScope.baseURL + '/matchup/organizations/' + $scope.eventInfo.host).success(function (data) {
			// Get host
			$scope.hostInfo = data;
		});

		// Get sponsors
		$scope.sponsors = results[1].data;
		// Get News
		$scope.news = results[2].data;
		// Get Participants
		$scope.participants = results[3].data;
		// Get Tournaments
		$scope.tournamentsInfo = results[4].data;
	}, function (err) {
		console.log(err);
		console.log("Oh oh");
	});

	$scope.getFees = function(){
		// Model for selected fee
		$scope.selected = {
			name: ""
		}
		$('#signUpModal').modal("show");
		
		$http.get($rootScope.baseURL + '/matchup/events/' + $scope.eventInfo.event_name + '/specfees' + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function (data) {
			$scope.fees = data;
		});
	}
	
	$scope.payFee = function (){
		$scope.paySelected = true;
		$http.post($rootScope.baseURL + '/matchup/events/' + $scope.eventInfo.event_name + '/specfees/' + $scope.selected.name + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function (data) {
			$('#signUpModal').modal("hide");
			console.log(data);
		});
	}
	
	//Go to a list of meetups for this event
	$scope.goToMeetupList = function (eventName, eventDate, eventLocation) {
		//heyyeah
		//eventName = eventName.replace(" ", "%20");
		// var params = [eventName, eventDate, eventLocation];
		// sharedDataService.set(params);
		$state.go("app.meetupList", {
				"eventname": eventName,
				"date": eventDate,
				"location": eventLocation
			}) //
	};

	$scope.newNews = {};

	$scope.postNews = function () {
		//
		if (!$scope.newNews.title || !$scope.newNews.content) {
			alert("Please fill all fields!");
			return;
		} else {
			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/news?date=' + $stateParams.date + '&location=' + $stateParams.location, $scope.newNews).success(function (data) {
				//$scope.tournaments.push($scope.newTournament);
				//console.log($scope.newTournament);
				var now = new Date;
				$scope.news.unshift({
					"news_number": $scope.news.length + 1,
					"news_title": $scope.newNews.title,
					"news_content": $scope.newNews.content,
					"news_date_posted": now

				});
				$('#postNewsModal').modal("hide");
				$scope.newNews = {};

			}).error(function (err) {
				console.log(err);
			});
		}

	};

	$scope.editNewsPrompt = function (news, index) {
		// Hard copy the selected news. If we just copy news to newNews the ngmodel will update the orignal local news array
		$scope.newNews = angular.copy(news);
		// Index used for updating the local news if the edit is done
		$scope.currentEditNews = index;
		$('#editNewsModal').modal("show");
	};

	$scope.editNews = function () {
		//REST PUT REQUEST
		if (!$scope.newNews.news_title || !$scope.newNews.news_content) {
			alert("Please fill all fields!");
			return;
		} else {
			$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/news/' + $scope.newNews.news_number + '?date=' + $stateParams.date + '&location=' + $stateParams.location, {
				"title": $scope.newNews.news_title,
				"content": $scope.newNews.news_content
			}).success(function (data) {
				$('#editNewsModal').modal("hide");
				$scope.news[$scope.currentEditNews] = $scope.newNews;

			}).error(function (err) {
				console.log(err);
			});
		}

	};

	$scope.deleteNewsPrompt = function (index) {
		//get news Index
		//show modal
		$scope.deleteNewsIndex = index;
		$('#deleteNewsModal').modal("show");

	};

	$scope.deleteNews = function () {
		//REST DELETE REQUEST
		$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/news/' + $scope.news[$scope.deleteNewsIndex].news_number + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function (data) {
			$('#deleteNewsModal').modal("hide");
			$scope.news.splice($scope.deleteNewsIndex, 1);

		}).error(function (err) {
			console.log(err);
			alert("News was not deleted, error ocurred");
		});

	};
	
	$scope.getNumber = function(num) {
		return new Array(num);
	}
	//getr all reviews
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/reviews?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function(data) {
		$scope.reviews = data;

	}).error(function(err) {
		console.log(err);
	});

	$scope.postReview = function () {
		//
		if ($scope.newReview.rating < 1 || $scope.newReview.rating > 5 || isNaN($scope.newReview.rating)) {
			alert("Please choose a rating between 1 and 5!");
			return;
		}
		if (!$scope.newReview.title || !$scope.newReview.content || !$scope.newReview.rating) {
			alert("Please fill all fields!");
			return;
		} else {

			$http.post($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/reviews?date=' + $stateParams.date + '&location=' + $stateParams.location, $scope.newReview).success(function (data) {
				//$scope.tournaments.push($scope.newTournament);
				//console.log($scope.newTournament);
				$http.get($rootScope.baseURL + '/matchup/profile').success(function (data) {
					$scope.user = data;
					var now = new Date;

					$scope.reviews.unshift({
						"review_title": $scope.newReview.title,
						"review_content": $scope.newReview.content,
						"star_rating": $scope.newReview.rating,
						"review_date_created": now,
						"customer_username": $scope.user.customer_username,
						"customer_first_name": $scope.user.customer_first_name,
						"customer_last_name": $scope.user.customer_last_name,
						"customer_tag": $scope.user.customer_tag,
						"customer_profile_pic": $scope.user.customer_profile_pic,
						"is_writer": true
					});

					$('#postReviewModal').modal("hide");
					$scope.newReview = {};

				}).error(function (err) {
					console.log(err);
				});

			}).error(function (err) {
				console.log(err);
			});

		}

	};

	$scope.editReviewPrompt = function (review) {
		//get news Index
		//show modal
		$scope.newReview = review;
		$('#editReviewModal').modal("show");

		//load information

	};

	$scope.editReview = function () {
		//REST PUT REQUEST
		if ($scope.newReview.star_rating < 1 || $scope.newReview.star_rating > 5 || isNaN($scope.newReview.star_rating)) {
			alert("Please choose a rating between 1 and 5!");
			return;
		}
		if (!$scope.newReview.review_title || !$scope.newReview.review_content || !$scope.newReview.star_rating) {
			alert("Please fill all fields!");
			return;
		} else {

			$http.get($rootScope.baseURL + '/matchup/profile').success(function (data) {}).success(function (data) {
				$scope.user = data;

				$http.put($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/reviews/' + $scope.user.customer_username + '?date=' + $stateParams.date + '&location=' + $stateParams.location, {
					"title": $scope.newReview.review_title,
					"content": $scope.newReview.review_content,
					"rating": $scope.newReview.star_rating
				}).success(function (data) {
					$('#editReviewModal').modal("hide");
					$scope.newNews = {};

				}).error(function (err) {
					console.log(err);
				});
			}).error(function (err) {
				console.log(err);
			});

		}
	};

	$scope.deleteReviewPrompt = function (review, index) {
		//get news Index
		$scope.reviewIndex = index;
		//show modal
		$scope.newReview = review;
		$('#deleteReviewModal').modal("show");
	};

	$scope.deleteReview = function () {
		//REST DELETE REQUEST

		$http.get($rootScope.baseURL + '/matchup/profile').success(function (data) {}).success(function (data) {
			$scope.user = data;
			$http.delete($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/reviews/' + $scope.user.customer_username + '?date=' + $stateParams.date + '&location=' + $stateParams.location).success(function (data) {
				$scope.reviews.splice($scope.reviewIndex, 1);
				$('#deleteReviewModal').modal("hide");
				$scope.newReview = {};

			}).error(function (err) {
				console.log(err);
				alert("Review was not deleted, error ocurred");
			});
		}).error(function (err) {
			console.log(err);
			alert("Review was not deleted, error ocurred");
		});

	};

});


//Meetup List controller, shows all meetups for a specific event
myApp.controller('meetupListController', ['$scope', '$http', '$state', '$stateParams', '$window', '$rootScope',
function ($scope, $http, $state, $stateParams, $window, $rootScope) {
		var config = {
			headers: {
				'Authorization': "Bearer " + $window.sessionStorage.token
			}
		};

		var now = new Date();
		var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());

		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '/meetups?date=' + $stateParams.date + '&location=' + $stateParams.location + '').success(function (data, status, headers) {

			$scope.meetupsInfo = angular.fromJson(data);
			console.log($scope.meetupsInfo);
			if ($scope.meetupsInfo.length == 0) {
				$scope.noMeetup = "Currently there are no Meetups available";
				console.log("hello");
			}

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in meetupListController");
		});

		//Get Event Info from server
		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventname + '?date=' + $stateParams.date + '&location=' + $stateParams.location + '').success(function (data, status, headers) {

			$scope.eventInfo = angular.fromJson(data);
			var endDate = new Date($scope.eventInfo.event_end_date);
			$scope.cover = "linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2)), url(" + $scope.eventInfo.event_banner + ")";

			if (endDate <= now_utc)
				$scope.endDate = false;
			else
				$scope.endDate = true;

		}).error(function (data, status) {

			if (status == 404 || status == 401 || status == 400)
				$state.go("" + status);
			console.log("error in eventPremiumSummaryController");
		});

		//Go to a specific meetup for this event
		$scope.goToMeetup = function (eventName, eventDate, eventLocation, meetupDate, meetupLocation, customerUsername) {
			$state.go("app.meetup", {
				"eventName": eventName,
				"eventDate": eventDate,
				"eventLocation": eventLocation,
				"meetupDate": meetupDate,
				"meetupLocation": meetupLocation,
				"customerUsername": customerUsername
			});
			//
		};
}]);

//Meetup  controller, shows the details of a specific meetup
myApp.controller('meetupController', ['$scope', '$http', '$state', '$stateParams', '$window', '$rootScope',
function ($scope, $http, $state, $stateParams, $window, $rootScope) {

		$scope.eventInfo = {
			event_name: "",
			event_start_date: "",
			event_location: ""
		};

		$scope.meetup = {
			customer_username: "",
			meetup_start_date: "",
			meetup_location: ""
		};

		$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/meetups/' + $stateParams.customerUsername + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + '&meetup_date=' + $stateParams.meetupDate + '&meetup_location=' + $stateParams.meetupLocation).success(function (data, status, headers) {
			$scope.meetup = data;
			$scope.eventInfo.event_name = $stateParams.eventName;
			$scope.meetup.customer_username = $stateParams.customerUsername;
			$scope.eventInfo.event_start_date = $stateParams.eventDate;
			$scope.eventInfo.event_location = $stateParams.eventLocation;
			$scope.meetup.meetup_start_date = $stateParams.meetupDate;
			$scope.meetup.meetup_location = $stateParams.meetupLocation;

		});

		//Go to edit the meetUp selected
		$scope.goToEditMeetup = function (eventName, eventDate, eventLocation, meetupDate, meetupLocation, customerUsername) {
			$state.go("app.edit_meetup", {
				"eventName": eventName,
				"eventDate": eventDate,
				"eventLocation": eventLocation,
				"meetupDate": meetupDate,
				"meetupLocation": meetupLocation,
				"customerUsername": customerUsername
			});

		};
}]);

myApp.controller('eventSettingsController', function ($scope, $state, $http, $stateParams, sharedDataService, $q, $rootScope) {
	$q.all([
	// Get Event Info
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation + ''),
	// Tournaments
	$http.get($rootScope.baseURL + '/matchup/events/' + $stateParams.eventName + '/tournaments?date=' + $stateParams.eventDate + '&location=' + $stateParams.eventLocation)]).then(function (results) {

		// Get Events
		$scope.event = results[0].data;
		// Get Tournaments
		$scope.tournamentsInfo = results[1].data;
		if ($scope.event.host == null)
			$scope.isHosted = false;
		else
			$scope.isHosted = true;

		console.log($scope.event);

		if ($scope.isHosted)
			hostedEventSettings($scope.event, $scope.tournamentsInfo);
		else
			regularEventSettings($scope.event, $scope.tournamentsInfo);

	}, function (err) {
		console.log(err);
		console.log("Oh oh");
	});

	var hostedEventSettings = function (event, tournamentsInfo) {
		//stuff will go here
		$scope.eventInfo = event;
		$scope.tournaments = tournamentsInfo[0].tournament_name;

	};
	var regularEventSettings = function (event, tournamentsInfo) {
		//console.log(tournamentsInfo[0]);
		$scope.eventInfo = event;
		$scope.tournament = tournamentsInfo[0].tournament_name;

	};

});