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
  .controller('HomeCtrl', ['$scope', function ($scope) {
    $scope.anything = 'possible';
  }])
  .controller('TipsCtrl', ['$scope', function ($scope) {
    $scope.anything = 'possible';
  }])
  .controller('AboutCtrl', ['$scope', function ($scope) {
    $scope.anything = 'possible';
  }])
  .controller('RoomCtrl', ['$scope', '$location', 'getDateTimeStr', function ($scope, $location, getDateTimeStr) {
    $scope.chats = [
      {
        alias: 'Admin',
        body: 'You are connected.',
        dateTime: getDateTimeStr()
      }
    ];

    var socket = io.connect('http://localhost')
      .on('chat', function (chat) {
        chat.dateTime = getDateTimeStr();
        $scope.$apply(function () {
          $scope.chats.push(chat);
        });
      })
      .emit('enter-room', {room: $location.path()});

    $scope.send = function (chat) {
      chat.dateTime = getDateTimeStr();
      chat.isSender = true;
      $scope.chats.push(chat);
      socket.emit('chat', chat);
      $scope.chat = {alias: chat.alias};
    };

  }]);