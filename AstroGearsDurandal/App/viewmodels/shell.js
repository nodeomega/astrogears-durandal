define(['plugins/router', 'durandal/app'], function (router, app) {
    return {
        copyright: '&copy; ' + new Date().getFullYear + ' - AstroGears',
        router: router,
        search: function() {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: 'flickr', moduleId: 'viewmodels/flickr', nav: true },
                { route: 'EnteredCharts', moduleId: 'viewmodels/EnteredCharts/Index', title: 'Entered Charts', nav: true },
                { route: 'EnteredCharts/Details/:id', moduleId: 'viewmodels/EnteredCharts/Details', nav: false }
            ]).buildNavigationModel();
            
            return router.activate();
        }
    };
});