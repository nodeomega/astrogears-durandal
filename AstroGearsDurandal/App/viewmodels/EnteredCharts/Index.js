define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    function EnteredChartListing(data) {
        this.SubjectName = ko.observable(data.SubjectName);
        this.SubjectLocation = ko.observable(data.SubjectLocation);
        this.OriginDateTimeString = ko.observable(data.OriginDateTimeString.replace('??:??', '12:00'));
        this.OriginDateTime = ko.observable(data.OriginDateTime);
        this.OriginDateTimeUnknown = ko.observable(data.OriginDateTimeUnknown);
        this.ChartTypeName = ko.observable(data.ChartTypeName);
        this.ChartTypeId = ko.observable(data.ChartTypeId);
        this.EnteredChartId = ko.observable(data.EnteredChartId);
    }

    function BlankEnteredChartListing() {
        this.SubjectName = ko.observable();
        this.SubjectLocation = ko.observable();
        this.OriginDateTimeString = ko.observable();
        this.OriginDateTime = ko.observable();
        this.OriginDateTimeUnknown = ko.observable(false);
        this.ChartTypeName = ko.observable();
        this.ChartTypeId = ko.observable();
        this.EnteredChartId = ko.observable(0);
    }

    var editChart = ko.observable(new BlankEnteredChartListing());

    return {
        editChart: editChart,
        displayName: 'Entered Charts Listing',
        charts: ko.observableArray([]),
        numberOfPages: ko.observable(),
        pageNumbers: ko.observableArray([]),
        chartTypes: ko.observableArray([]),
        activate: function () {
            //the router's activator calls this function and waits for it to complete before proceeding
            if (this.charts().length > 0) {
                return;
            }

            var that = this;
            if (that.chartTypes.length === 0) {
                that.setUpChartTypeDropdown();
            }
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
        },
        setUpChartTypeDropdown: function () {
            var that = this;
            $.getJSON('/EnteredCharts/GetChartTypesList').then(function (response) {
                that.chartTypes(response);
            });
        },
        openCreateForm: function () {
            $('#createEnteredChartModal').modal('show');
            return false;
        },
        openEditForm: function (item) {
            $('#editEnteredChartModal').modal('show');
            editChart(new EnteredChartListing(item));
            return false;
        }
    };
});