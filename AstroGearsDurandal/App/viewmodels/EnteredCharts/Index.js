define(['plugins/http', 'durandal/app', 'knockout', 'scripts/common-library'], function (http, app, ko, common) {
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
        this.ChartObjectCount = ko.observable(data.NumberOfChartObjects);
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
        this.ChartObjectCount = ko.observable(0);
    }

    var status = ko.observable();
    var createStatus = ko.observable();
    var createChart = ko.observable(new BlankEnteredChartListing());
    var editStatus = ko.observable();
    var editChart = ko.observable(new BlankEnteredChartListing());
    var deleteStatus = ko.observable();
    var deleteChart = ko.observable(new BlankEnteredChartListing());
    var charts = ko.observableArray([]);
    var numberOfPages = ko.observable();
    var pageNumbers = ko.observableArray([]);
    var chartTypes = ko.observableArray([]);
    var currentPageNumber = ko.observable();
    var resultsPerPage = ko.observable();

    return {
        status: status,
        createStatus: createStatus,
        createChart: createChart,
        editStatus: editStatus,
        editChart: editChart,
        deleteStatus: deleteStatus,
        deleteChart: deleteChart,
        displayName: 'Entered Charts Listing',
        charts: charts,
        numberOfPages: numberOfPages,
        pageNumbers: pageNumbers,
        chartTypes: chartTypes,
        currentPageNumber: currentPageNumber,
        resultsPerPage: resultsPerPage,
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
        selectNumberPerPage: function () {
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
        },
        openDeleteForm: function(item) {
            $('#deleteEnteredChartModal').modal('show');
            deleteChart(new EnteredChartListing(item));
            return false;
        },
        createNewChart: function (item) {
            $.post('/EnteredCharts/CreateNewEnteredChart', {
                subjectName: item.SubjectName(),
                subjectLocation: item.SubjectLocation(),
                originDateTime: item.OriginDateTime(),
                originDateTimeUnknown: item.OriginDateTimeUnknown(),
                chartTypeId: item.ChartTypeId()
            }).then(function (data) {
                if (data === 'Success') {
                    status(common.SuccessIcon + ' New Entered Chart created successfully.');

                    $('#createEnteredChartModal').modal('hide');

                    $('#listingLoading').show();
                    $.getJSON('/EnteredCharts/GetEnteredChartsListing', { pageNum: currentPageNumber, entriesPerPage: resultsPerPage }).then(function (response) {
                        // alert(response);
                        charts(response[0]);
                        numberOfPages(response[1]);
                        $('#listingLoading').hide();
                    });
                } else {
                    createStatus(common.ErrorIcon + ' Failed to create new Entered Chart.<br />' + data);
                }
            });
            return false;
        },
        updateChart: function (item) {
            $.post('/EnteredCharts/UpdateEnteredChart', {
                enteredChartId: item.EnteredChartId(),
                subjectName: item.SubjectName(),
                subjectLocation: item.SubjectLocation(),
                originDateTime: item.OriginDateTimeString(),
                originDateTimeUnknown: item.OriginDateTimeUnknown(),
                chartTypeId: item.ChartTypeId()
            }).then(function (data) {
                if (data === 'Success') {
                    status(common.SuccessIcon + ' Entered Chart updated successfully.');

                    $('#editEnteredChartModal').modal('hide');

                    $('#listingLoading').show();
                    $.getJSON('/EnteredCharts/GetEnteredChartsListing', { pageNum: currentPageNumber, entriesPerPage: resultsPerPage }).then(function (response) {
                        // alert(response);
                        charts(response[0]);
                        numberOfPages(response[1]);
                        $('#listingLoading').hide();
                    });
                } else {
                    editStatus(common.ErrorIcon + ' Failed to update Entered Chart.<br />' + data);
                }
            });
            return false;
        },
        killChart: function (item) {
            $.post('/EnteredCharts/ConfirmDeleteOfEnteredChart', {
                enteredChartId: item.EnteredChartId()
            }).then(function (data) {
                if (data === 'Success') {
                    status(common.SuccessIcon + ' Entered Chart deleted successfully.');
                    $('#deleteEnteredChartModal').modal('hide');

                    $('#listingLoading').show();
                    $.getJSON('/EnteredCharts/GetEnteredChartsListing', { pageNum: currentPageNumber, entriesPerPage: resultsPerPage }).then(function (response) {
                        charts(response[0]);
                        numberOfPages(response[1]);
                        if (numberOfPages < currentPageNumber) {
                            currentPageNumber(numberOfPages);
                        }
                        $('#listingLoading').hide();
                    });
                } else {
                    deleteStatus(common.ErrorIcon + ' Failed to delete Entered Chart.<br />' + data);
                }
            });
            return false;
        }
    };
});