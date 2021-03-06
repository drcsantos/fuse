(function ()
{
    'use strict';

    /**
     * Main module of the Fuse
     */
    angular
        .module('fuse', [

            // Core
            'app.core',

            // Navigation
            'app.navigation',

            // Toolbar
            'app.toolbar',

            // Quick panel
            'app.quick-panel',

            // Appoitments
            'app.calendar',

            // Residents
            'app.residents',

            // Issues
            'app.issues',

            // Login
            'app.pages.auth.login',

            // Register
            'app.pages.auth.register',

            // Forgot passoword
            'app.pages.auth.forgot-password',

            // Reset password
            'app.pages.auth.reset-password',

            'app.pages.auth.verify',

            // Homepage
            'app.homepage',

            // 404
            'app.error-404',

            // 500
            'app.error-500',

            // Restricted access
            'app.not-auth',

            // Profile
            'app.profile',

            // Dashboard
            'app.dashboard',

            // Information
            'app.information',

           // To do
            'app.todo',

        ]);
})();
