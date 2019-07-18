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
        controller: 'loginController',
        templateUrl: 'app/pages/login.html'
    })
	.when('/Register', {
        templateUrl: 'app/pages/register.html'
    })
	.when('/ChangePass', {
        templateUrl: 'app/pages/changePass.html'
    })
	.when('/UpdateInfo', {
        templateUrl: 'app/pages/updateInfo.html'
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


app.controller('loginController',
    function ($scope, $http) {
        var link = "db/Students.js"
        var request = {
            method: 'get',
            url: link,
            dataType: 'json',
            contentType: "application/json"
        };

        $scope.arrStudents = new Array;

        $http(request)
            .success(function (jsonData) {
                $scope.arrStudents = jsonData;
                $scope.list = $scope.arrStudents;
            })
            .error(function () {

            });
        $scope.submit = function() {
         // alert("SUBMIT "+$scope.regObj.username);
          var stat="false";
        angular.forEach($scope.mydata, function(item){
                          if((item.username==$scope.regObj.Username)&&(item.password==$scope.regObj.Password))
                          {
                            stat="true";
                            document.getElementById("logginStatus").innerHTML = item.fullname;
                            loginFunction();
                          }


                       });
        $scope.regObj.Username="";
        $scope.regObj.Password="";
          if(stat=="true")
          {
          

          }
          else
            alert("Sai tài khoản hoặc mật khẩu!!");
          };

         $scope.regObj = {
              "Username" : "",
              "Password" : ""

            };
        $scope.mydata;
          $http.get("db/Students.js")
          .then(function(response) {
              $scope.mydata = response.data;
               angular.forEach($scope.mydata, function(item){
                          logOutFunction();
                       })

          });
    });

    function loginFunction() {

      var accountArea = document.getElementById("accountArea");
      accountArea.style.display = "none";
      document.getElementById("btnDangXuat").innerHTML = "Đăng xuất";

    }
    function logOutFunction() {
      var accountArea = document.getElementById("accountArea");
      accountArea.style.display = "block";
      document.getElementById("btnDangXuat").innerHTML = "";
      document.getElementById("logginStatus").innerHTML = "Tài khoản";

    }

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
