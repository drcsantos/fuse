(function ()
{
    'use strict';

    angular
        .module('app.pages.auth.verify', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.pages_auth_verify', {
            url      : '/auth/verify/{token}',
            views    : {
                'main@'                          : {
                    templateUrl: 'app/core/layouts/content-only.html',
                    controller : 'MainController as vm'
                },
                'content@app.pages_auth_verify': {
                    templateUrl: 'app/main/auth/verify/verify.html',
                    controller : 'VerifyController as vm'
                }
            },
            bodyClass: 'verify'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/auth/verify');

    }

})();
