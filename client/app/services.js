    angular.module("myApp.services", []).factory("Song", function($resource) {
      return $resource('/api/songs/:id', {
        id: '@id'
      }, {
        update: {
          method: "PUT"
        },
        remove: {
          method: "DELETE"
        }
      });
    });
