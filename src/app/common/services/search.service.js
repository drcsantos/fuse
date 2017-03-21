(function() {

    angular
        .module('app.core')
        .service('SearchService', SearchService);

    SearchService.$inject = ['msNavigationService', '$q', '$rootScope'];

    function SearchService(msNavigationService, $q, $rootScope) {

      // The data that is being set through filter/search
      var data = [];

      // The resulting data from the filter/search function
      var resultData = [];

      var searchBy = [];

      var unfiltered = [];

      function setData(d, searchParams) {
        data = d;
        searchBy = searchParams;
      }

      function getUnfiltered() {
        return unfiltered;
      }

      function getResult() {
        return resultData;
      }

      function subscribe(scope, callback) {
        var handler = $rootScope.$on('notifying-service-event', callback);
        scope.$on('$destroy', handler);
      }

      function search(query)
      {

          unfiltered = [];
          var deferred = $q.defer();

          if(searchBy === undefined || searchBy === []) {
            return;
          }

          if ( query )
          {

              resultData = data.filter(function (item)
              {
                console.log(item.title, angular.lowercase(item['title'].toString()).search(angular.lowercase(query)));

                  for(var i = 0; i < searchBy.length; ++i) {
                    if(item[searchBy[i]] !== undefined) {
                      if ( angular.lowercase(item[searchBy[i]].toString()).indexOf(angular.lowercase(query)) !== -1 ) {
                        return true;
                      }
                    }
                  }

                  // searching of nested fields
                  if(item.residentGoing !== undefined) {
                    if ( angular.lowercase(item.residentGoing.firstName + item.residentGoing.lastname).indexOf(angular.lowercase(query)) !== -1 ) {
                      return true;
                    }
                  }

                  return false;

              });

              //resultData = _.uniqBy(resultData, "_id");

          } else if(query === "") {

            resultData = removeDueDate();
          }

          // notify the controller to update their data
          $rootScope.$emit('notifying-service-event');

          deferred.resolve(resultData);

          return deferred.promise;
      }

      //remove due date, temp function while the calendar is sorted out
      function removeDueDate() {
        var tmp = [];
        for(var i = 0; i  < data.length; ++i) {
          if(data[i].color === undefined) {
            tmp.push(data[i]);
          }
        }

        return tmp;
      }

      function collapseSearch() {
        resultData = removeDueDate();
        $rootScope.$emit('notifying-service-event');
      }

      function searchResultClick(item) {
        console.log(item);
      }

      return {
        setData : setData,
        getResult : getResult,
        getUnfiltered : getUnfiltered,
        search : search,
        subscribe : subscribe,
        searchResultClick : searchResultClick,
        collapseSearch : collapseSearch
      };

    }

})();
