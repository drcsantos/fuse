(function ()
{
    'use strict';

    angular
        .module('app.todo',
            [
                // 3rd Party Dependencies
                'ng-sortable',
                'textAngular'
            ]
        )
        .config(config);

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.to-do', {
            url      : '/to-do',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/todo/todo.html',
                    controller : 'TodoController as vm'
                }
            },
            resolve  : {
                Tasks: function (msApi)
                {
                    return {};
                },
                Tags : function (msApi)
                {
                    return {};
                }
            },
            bodyClass: 'todo'
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/todo');

        // Api
        msApiProvider.register('todo.tasks', ['app/data/todo/tasks.json']);
        msApiProvider.register('todo.tags', ['app/data/todo/tags.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('fuse.to-do', {
            title : 'To-Do',
            icon  : 'icon-checkbox-marked',
            state : 'app.to-do',
            badge : {
                content: 0,
                color  : '#FF6F00'
            },
            weight: 1
        });
    }

})();
