define(['plugins/router', 'durandal/app', 'knockout'], function (router, app, ko) {
    return {
        copyright: ko.observable('&copy; ' + new Date().getFullYear() + ' - AstroGears'),
        router: router,
        activate: function () {
            router.map([
                { route: '', title:'Welcome', moduleId: 'viewmodels/welcome', nav: true },
                { route: '!EnteredCharts', moduleId: 'viewmodels/EnteredCharts/Index', title: 'Entered Charts', nav: true },
                { route: '!EnteredCharts/Details/:id', moduleId: 'viewmodels/EnteredCharts/Details', title: 'Entered Charts | Details', nav: false },
                { route: 'NotFound', moduleId: 'viewmodels/not-found', title: '404 - Not Found', nav: false}
            ]).buildNavigationModel()
            .mapUnknownRoutes('viewmodels/not-found', 'not-found');
            
            return router.activate({ pushState: false });
        }
    };
});