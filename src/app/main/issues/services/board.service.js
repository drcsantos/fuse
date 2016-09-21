(function ()
{
    'use strict';

    angular
        .module('app.issues')
        .factory('BoardService', BoardService);

    /** @ngInject */
    function BoardService($q, msApi, apilaData)
    {
        var service = {
            data        : {},
        };

        service.list = {
             "data" : [
                {
                    "name": "Open Issues",
                    "uri": "open-issues",
                    "id": "32gfhaf2"
                },
                {
                    "name": "Shelved Issues",
                    "uri": "shelved-issues",
                    "id": "27cfcbe1"
                },
                {
                    "name": "Closed Issues",
                    "uri": "closed-issues",
                    "id": "fg56cbe1"
                }
            ]
        };

        service.name = "";


        //load dummy data at begining
        service.data = {
            "data": {
                "id": "27cfcbe1",
                "name": "ACME Backend Application",
                "uri": "acme-backend-application",
                "settings": {
                    "color": "blue-grey",
                    "subscribed": false,
                    "cardCoverImages": true
                },
                "lists": [
                ],
                "cards": [
                ],
                "members": [
                ],
                "labels": [
                ]
            }
        };



        return service;
    }
})();
