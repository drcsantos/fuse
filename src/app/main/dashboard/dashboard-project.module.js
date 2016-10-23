(function ()
{
    'use strict';

    angular
        .module('app.dashboard', [])
        .config(config);

    /** @ngInject */
    function config($stateProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.dashboard', {
            url      : '/dashboard',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/dashboard/dashboard-project.html',
                    controller : 'DashboardProjectController as vm'
                }
            },
            bodyClass: 'dashboard-project'
        });

        msNavigationServiceProvider.saveItem('fuse.dashboard', {
            title    : 'Dashboard',
            icon     : 'icon-tile-four',
            state    : 'app.dashboard',
            weight   : 0
        });

    }

})();
