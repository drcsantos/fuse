(function ()
{
    'use strict';

    angular
        .module('app.quick-panel', ['app.todo'])
        .config(config);

    /** @ngInject */
    function config($translatePartialLoaderProvider, msApiProvider)
    {
        // Translation
        $translatePartialLoaderProvider.addPart('app/quick-panel');

    }
})();
