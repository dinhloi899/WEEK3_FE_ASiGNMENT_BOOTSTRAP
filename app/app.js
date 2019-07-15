var app = angular.module('myApp', ['ngRoute']); //ngRoute dependency injection

app.config(function ($routeProvider) {
    $routeProvider.
    when('/About', {
        templateUrl: 'app/pages/about.html'
    })
    .when('/Contact', {
        templateUrl: 'app/pages/contact.html'
    })
    .when('/QNA', {
        templateUrl: 'app/pages/qna.html'
    })
    .when('/Feedback', {
        templateUrl: 'app/pages/feedback.html'
    })
	.when('/Login', {
        templateUrl: 'app/pages/login.html'
    })
	.when('/Register', {
        templateUrl: 'app/pages/register.html'
    })
	.when('/ChangePass', {
        templateUrl: 'app/pages/changePass.html'
    })
	.when('/subjects',{
		controller: 'category-controller',
		templateUrl: 'app/pages/subjects.html'
  	})
  	.when('/subjects/:subjectid',{
		controller: 'QuizController',
		templateUrl: 'app/pages/quiz.html'
  	})

    .otherwise({ redirectTo: '/subjects' });
});

app.controller('category-controller',['$scope','categorys',
function($scope,categorys){
  categorys.success(function(data){
    $scope.categories = data;
  });
}]);

app.controller('QuizController',['$scope','categorys','$routeParams','$http',
function($scope, categorys, $routeParams,$http){
  categorys.success(function(data){

    var subjectId = $routeParams.subjectid;

    var link = "db/Quizs/"+subjectId+".js";
    var request = {
        method: 'get',
        url: link,
        dataType: 'json',
        contentType: "application/json"
      };


  $scope.arrQuizs = new Array;

  $http(request)
      .success(function (data) {
          $scope.arrQuizs = data;
      })
      .error(function (err) {
        $scope.error = err;
      });
    $scope.currentSubjectId = $routeParams.subjectid;
  });
}]);

app.factory('categorys',['$http',
function($http){
  return $http.get('db/Subjects.js')
  .success(function(data){
    return data;
  })
  .error(function(err){
    return err;
  });
}]);