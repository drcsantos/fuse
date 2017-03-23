(function() {

    'use strict';

    angular.module('app.residents').service('SearchResident', SearchResident);

    /** @ngInject */
    function SearchResident() {
        
        var arrayFields = ['foodAllergies', 'medicationAllergies', 'otherAllergies', 'foodLikes',
            'foodDislikes', 'outsideAgencyFile', 'psychosocialStatus', 'shopping', 'painManagedBy'];

        function transformResidentForSearch(resident) {

            var searchString = "";

            var fieldsTypes = {};

            for(var key in resident) {
                if(resident.hasOwnProperty(key)) {

                //skip over there fields
                if(key === "_id" || key === '$$hashKey' || key === 'community' || key === 'submitBy' || key === 'submitDate') {
                    continue;
                }

                // if(key === 'drivesCar' && resident[key] === true) {
                //     fieldsTypes[searchString.length] = 'car';
                //     searchString += 'car \n';
                //     continue;
                // }

                //format dates
                if(key === 'birthDate') {
                    fieldsTypes[searchString.length] = key;
                    searchString += moment(resident[key]).format('YYYY MM DD') + '\n';
                    continue;
                }

                //handling boolean fields
                if(resident[key] == true) {
                    fieldsTypes[searchString.length] = key;
                    searchString += key + '\n';
                    continue;
                }

                //handle arrays
                if(_.includes(arrayFields, key)) {
                    fieldsTypes[searchString.length] = key;
                    searchString += resident[key].join(' ');
                    continue;
                }

                //skip objects for now
                if(angular.isObject(resident[key])) {
                    continue;
                }

                if(resident[key]) {
                    fieldsTypes[searchString.length] = key;
                    searchString += resident[key] + '\n';
                }

                }
            }

            return { searchString: searchString, fieldsTypes: fieldsTypes };
        }


        return {
            transformResidentForSearch : transformResidentForSearch
        };
    }


})();