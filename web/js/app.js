'use strict';

angular.module('chatterJS', ['ngRoute'])
  .config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
      $locationProvider.html5Mode(true);
      $routeProvider.when('/', {
          templateUrl: 'templates/home.tpl.html',
          controller: 'HomeCtrl'
        })
        .when('/tips', {
          templateUrl: 'templates/tips.tpl.html',
          controller: 'TipsCtrl'
        })
        .when('/about', {
          templateUrl: 'templates/about.tpl.html',
          controller: 'AboutCtrl'
        })
        .otherwise({
          templateUrl: 'templates/room.tpl.html',
          controller: 'RoomCtrl'
        });
    }
  ])
  .factory('getDateTimeStr', [function () {
    var padToTwoNums = function (num) {
      if (num < 10) {
        num = '0' + num;
      }
      return num;
    };
    return function () {
      var now = new Date(),
        y = now.getUTCFullYear() - 2000,
        m = padToTwoNums(now.getUTCMonth()),
        d = padToTwoNums(now.getUTCDate()),
        h = padToTwoNums(now.getUTCHours()),
        i = padToTwoNums(now.getUTCMinutes()),
        s = padToTwoNums(now.getUTCSeconds());

      return [m, d, y].join('/') + ' ' + [h, i, s].join(':');
    };
  }])
  .factory('getRandomString', [function () {
    return function (strLen) {
      var str = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for(var i = 0; i < strLen; i++)
          str += possible.charAt(Math.floor(Math.random() * possible.length));

      return str;
    };
  }])
  .controller('NavCtrl',
    ['$scope', 'getRandomString', function ($scope, getRandomString) {
      $scope.randomUrl = getRandomString(10);
    }]
  )
  .controller('HomeCtrl',
    ['$scope', 'getRandomString', function ($scope, getRandomString) {
      $scope.randomUrl = getRandomString(10);
    }]
  )
  .controller('TipsCtrl', ['$scope', function ($scope) {
    $scope.anything = 'possible';
  }])
  .controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.anything = 'possible';
  }])
  .controller('RoomCtrl',
    ['$scope', '$location', 'getDateTimeStr',
      function ($scope, $location, getDateTimeStr) {
        $scope.roomName = $location.path();
        $scope.userCount = 0;
        $scope.chats = [
          {
            alias: 'Admin',
            body: 'You are connected.',
            dateTime: getDateTimeStr()
          }
        ];

        var socket = io.connect('/')
          .on('chat', function (chat) {
            chat.dateTime = getDateTimeStr();
            $scope.$apply(function () {
              $scope.chats.push(chat);
            });
          })
          .on('user-count', function (count) {
            $scope.$apply(function () {
              $scope.userCount = count;
            });
          })
          .emit('enter-room', $location.path());

        $scope.send = function (chat) {
          chat.dateTime = getDateTimeStr();
          socket.emit('chat', chat);
          chat.isSender = true;
          $scope.chats.push(chat);
          $scope.chat = {alias: chat.alias};
        };

        // show alias modal on load
        $('.alias-change-modal').modal('show');
      }
    ]
  );