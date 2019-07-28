var correctCount = 0;
var currentSubject = "";
var answer_checked = new Map();

var sec = 0;
var min = 0;
var go;



function start() {
  document.getElementById("clockQuiz").innerHTML = min + ":" + sec;
  go = setTimeout("start()", 1000);
  sec++;
  if (sec == 60) {
    sec = 0;
    min++;
  }
}

function stop(go){
  clearTimeout(go);
}


function reset() {
  sec = 0;
  min = 0;
}


app.controller('QuizController', ['$scope', 'categorys', '$routeParams', '$http', function($scope, categorys, $routeParams, $http) {
  categorys.success(function(data) {

    var subjectId = $routeParams.subjectid;
    var quizId = $routeParams.quizId;

    var arrCategory = Array;
    arrCategory = data;
    $scope.subjectName = "";
    for (var k = 0; k < arrCategory.length; k++) {
      if (arrCategory[k].Id === subjectId) {
        $scope.subjectName = arrCategory[k].Name;
        break;
      }
    }

    if (currentSubject !== subjectId) {
      correctCount = 0;
      currentSubject = subjectId;
      answer_checked.clear();
      reset();
      stop(go);
      start();
    }

    //Xu ly load cau hoi moi se khong bi mat dong ho
    $scope.min = min;
    $scope.sec = sec;

    //Correct answers number
    $scope.correctCount = correctCount;

    //Create request HTTP to get question
    var link = "db/Quizs/" + subjectId + ".js";
    var request = {
      method: 'get',
      url: link,
      dataType: 'json',
      contentType: "application/json"
    };

    $scope.arrQuizs = new Array;

    $http(request)
      .success(function(data) {
        $scope.arrQuizs = data;
        $scope.currentSubjectId = $routeParams.subjectid;

        $scope.quiz = $scope.arrQuizs[quizId];
        $scope.quizId = quizId;
        $scope.currentQuiz =  parseInt($scope.quizId) + 1;

        // Using these properties to create the URLs in line 1 and line 11 of view/chapter.html
        $scope.currentSubjectIndex = subjectId;
        $scope.currentQuizIndex = parseInt($routeParams.quizId);
        $scope.nextQuizIndex = $scope.currentQuizIndex + 1;
        $scope.prevQuizIndex = $scope.currentQuizIndex - 1;

        if ($routeParams.quizId >= $scope.arrQuizs.length - 1) {
          $scope.nextQuizIndex -= 1;
        }

        if ($routeParams.quizId <= 0) {
          $scope.prevQuizIndex += 1;
        }

        var trueAnswer = $scope.arrQuizs[quizId].AnswerId;
        $scope.checkAnswer = new Array;
        $scope.chosen = 'false';
        //Load cau tra loi da co
        $scope.checked = new Array;
        if (answer_checked.get(quizId) != undefined) {
          $scope.chosen = 'true';

          for (var i = 0; i < $scope.arrQuizs[quizId].Answers.length; i++) {
            if (answer_checked.get(quizId) === $scope.arrQuizs[quizId].Answers[i].Id) {
              if (trueAnswer === answer_checked.get(quizId)) {
                $scope.checkAnswer[i] = 'true';
                $scope.checked[i] = 'checked';
              } else {
                $scope.checkAnswer[i] = 'false';
                $scope.checked[i] = '';
              }
            }
          }
        }


        //Xu ly tra loi
        $scope.checkAnswerUser = function(quizId, answer_id) {
          //Save Answer of user
          answer_checked.set(quizId, answer_id);
          $scope.chosen = 'true';

          for (var i = 0; i < $scope.arrQuizs[quizId].Answers.length; i++) {
            $scope.checkAnswer[i] = "";

            if(answer_id === $scope.arrQuizs[quizId].Answers[i].Id){
                if(trueAnswer === answer_id){
                  $scope.checkAnswer[i] = 'true';
                  correctCount++;
                  $scope.correctCount = correctCount;
                }
                else {
                  $scope.checkAnswer[i] = 'false';
                }
            }
          }

          if(correctCount == arrQuizs.length){
            stop(go);
          }

        }

      })
      .error(function(err) {
        $scope.error = err;
      });
  });



}]);
