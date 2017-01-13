(function() {

  angular
    .module('app.residents')
    .directive('scrolly', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var raw = element[0];
                console.log('loading directive');

                element.bind('scroll', function () {
                  //console.log("Scrolling "  + raw.scrollTop + ' + ' + raw.offsetHeight + ' > '+ raw.scrollHeight);
                    if (raw.scrollTop + raw.offsetHeight + 10 > raw.scrollHeight) {
                        scope.$apply(attrs.scrolly);
                    }
                });
            }
        };
    });

})();
