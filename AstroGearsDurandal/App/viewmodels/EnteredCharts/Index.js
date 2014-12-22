define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    //function EnteredChartListing(data) {
    //    this.SubjectName = ko.observable(data.SubjectName);
    //    this.SubjectLocation = ko.observable(data.SubjectLocation);
    //    this.OriginDateTimeString = ko.observable(data.OriginDateTimeString);
    //    this.ChartTypeName = ko.observable(data.ChartTypeName);
    //    this.EnteredChartId = ko.observable(data.EnteredChartId);
    //}

    return {
        displayName: 'AstroGears Entered Charts Listing',
        charts: ko.observableArray([]),
        numberOfPages: ko.observable(),
        pageNumbers: ko.observableArray([]),
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceeding
            if (this.charts().length > 0) {
                return;
            }

            var that = this;
            $('#listingLoading').show();
            //return http.jsonp('http://astrogears/EnteredCharts/GetEnteredChartsListing', { pageNum: 1, entriesPerPage: 10 }, 'callback').then(function (response) {
            return $.getJSON('/EnteredCharts/GetEnteredChartsListing', { pageNum: 1, entriesPerPage: 10 }).then(function (response) {
                // alert(response);
                that.charts(response[0]);
                that.numberOfPages(response[1]);
                for (var i = 1; i <= response[1]; i++) {
                    that.pageNumbers.push(i);
                }
                $('#listingLoading').hide();
            });
        },
        editLink: function (item) {
            EnteredCharts(item.EnteredChartId);
            return false;
        },
        selectNumberPerPage: function (item) {
            var that = this;
            $('#listingLoading').show();
            //return http.jsonp('http://astrogears/EnteredCharts/GetEnteredChartsListing', { pageNum: 1, entriesPerPage: $('#resultsPerPage').val() }, 'callback').then(function (response) {
            return $.getJSON('/EnteredCharts/GetEnteredChartsListing', { pageNum: 1, entriesPerPage: $('#resultsPerPage').val() }).then(function (response) {
                // alert(response);
                that.charts(response[0]);
                that.numberOfPages(response[1]);
                that.pageNumbers.removeAll();
                for (var i = 1; i <= response[1]; i++) {
                    that.pageNumbers.push(i);
                }
                $('#listingLoading').hide();
            });
        },
        selectPageNumber: function (item, event) {
            var that = this;
            //if (that.listChanged !== '#resultsPerPage') {
            if (event.originalEvent) {
                $('#listingLoading').show();
                //return http.jsonp('http://astrogears/EnteredCharts/GetEnteredChartsListing', { pageNum: $('#pageNumber').val(), entriesPerPage: $('#resultsPerPage').val() }, 'callback').then(function (response) {
                return $.getJSON('/EnteredCharts/GetEnteredChartsListing', { pageNum: $('#pageNumber').val(), entriesPerPage: $('#resultsPerPage').val() }).then(function (response) {
                    // alert(response);
                    that.charts(response[0]);
                    that.numberOfPages(response[1]);
                    $('#listingLoading').hide();
                });
            }
        }
    };
});

function EnteredCharts(id) {
    alert('You\'re editing ID # ' + id + '!');
}