// onclick="EnteredChartDetails.GetListing(@Html.DisplayFor(model => model.EnteredChartId));EnteredChartDetails.GetHouseListing(@Html.DisplayFor(model => model.EnteredChartId))" 

define(['plugins/http', 'durandal/app', 'knockout'], function (http, app, ko) {
    //Note: This module exports an object.
    //That means that every module that "requires" it will get the same object instance.
    //If you wish to be able to create multiple instances, instead export a function.
    //See the "welcome" module for an example of function export.

    function EnteredChartListing(data) {
        this.SubjectName = ko.observable(data.SubjectName);
        this.SubjectLocation = ko.observable(data.SubjectLocation);
        this.OriginDateTimeString = ko.observable(data.OriginDateTimeString);
        this.ChartTypeName = ko.observable(data.ChartTypeName);
        this.EnteredChartId = ko.observable(data.EnteredChartId);
    }

    var mainAspect = ko.observable();

    return {
        settings: ko.observable({ cacheViews: false }),
        displayName: 'AstroGears Details Listing',
        chartObjects: ko.observableArray([]),
        thisnum: ko.observable(0),
        HouseList: ko.observableArray([]),
        AngleList: ko.observableArray([]),
        DraconicHouseList: ko.observableArray([]),
        HasDraconicHouses: ko.observable(false),
        mainAspect: mainAspect,
        AspectItem: ko.observableArray([]),
        AspectList: ko.observableArray([]),
        chartId: ko.observable(0),
        activate: function (context) {
            //the router's activator calls this function and waits for it to complete before proceeding
            this.chartObjects.removeAll();

            //if (this.chartObjects().length > 0) {
            //    return;
            //}

            var that = this;
            $('#chartLoading').show();
            return $.when(
                $.getJSON('/EnteredCharts/GetDetailsChartListing', { id: context, draconic: false, arabic: false, asteroids: false, stars: false, houseSystemId: 0 }),
                $.getJSON('/EnteredCharts/GetDetailsHouseListing', { chartId: context, houseSystemId: 0 }),
                $.getJSON('/EnteredCharts/GetDetailsAngleListing', { chartId: context })
                ).then(function (listingResponse, houseResponse, angleResponse) {
                    that.chartObjects(listingResponse[0]);
                    that.thisnum(context)

                    that.HouseList(houseResponse[0]);
                    that.AngleList(angleResponse[0]);

                    that.chartId(context);

                    $('#chartLoading').hide();
                });
        },
        editLink: function (item) {
            EnteredCharts(item.EnteredChartId);
            return false;
        },
        ShitOnMe: function (item) {
            var that = this;
            that.chartObjects.removeAll();
            $('#chartLoading').show();
            return $.when(
                $.getJSON('/EnteredCharts/GetDetailsChartListing', {
                    id: that.chartId,
                    draconic: $('#includeDraconic').is(':checked'),
                    arabic: $('#includeArabic').is(':checked'),
                    asteroids: $('#includeAsteroids').is(':checked'),
                    stars: $('#includeStars').is(':checked'),
                    houseSystemId: $('#chartHouseSystems').val()
                }),
                $.getJSON('/EnteredCharts/GetDetailsHouseListing', { chartId: that.chartId, houseSystemId: $('#chartHouseSystems').val() }),
                $.getJSON('/EnteredCharts/GetDetailsAngleListing', { chartId: that.chartId })
                ).then(function (listingResponse, houseResponse, angleResponse) {
                    that.chartObjects(listingResponse[0]);

                    that.HouseList(houseResponse[0]);
                    that.AngleList(angleResponse[0]);

                    $('#chartLoading').hide();
                });
        },
        dynamicChartObjectCss: dynamicChartObjectCss,
        CoordinateString: CoordinateString,
        GetAspects: function (item, event) {
            event.cancelBubble = true;
            mainAspect('Aspects to ' + item.CelestialObjectName + ' (' + CoordinateString(item) + ')');
            var a;
            if (item.Draconic)
                a = 1;
                //return 'GetAspectsForDraconicChart()';
            else if (item.CelestialObjectTypeName === 'Arabic Part')
                a = 1;
                //return 'GetAspectsForArabicChart();';
            else if (item.CelestialObjectTypeName === 'Angle/House Cusp')
                a = 1;
                //return 'GetAspectsForAngleChart()';
            else
                a = 1;
            //return 'GetAspects';
            return false;
        },
        EditThisShit: EditThisShit,
        isCelestialObject: isCelestialObject,
        HouseCoordinateString: HouseCoordinateString,
        HouseLabel: HouseLabel,
        AngleLabel: AngleLabel
    };

    function HouseCoordinateString(item) {
        return item.Degrees
            + '° <span class="'
            + item.HtmlTextCssClass + '">'
            + item.SignAbbreviation
            + '</span> '
            + item.Minutes
            + '\' '
            + item.Seconds
            + '"';
    }

    function HouseLabel(item) {
        var houseCusps = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th', 7: '7th', 8: '8th', 9: '9th', 10: '10th', 11: '11th', 12: '12th' };

        return houseCusps[item.HouseId];
    }

    function AngleLabel(item) {
        var angles = { 0: 'Vertex', 1: 'ASC', 2: 'M.C.', 3: 'Antivertex', 4: 'DESC', 5: 'I.C.' };
        return angles[item.AngleId];
    }

    function EnteredCharts(id) {
        alert('You\'re editing ID # ' + id + '!');
    }

    function draconicRow(item) {
        if (item.Draconic) {
            return 'draconic';
        } else {
            return null;
        }
    }

    function dynamicChartObjectCss(item) {
        switch (item.CelestialObjectTypeName) {
            case 'Arabic Part':
                if (item.Draconic === true) {
                    return 'arabic-part draconic';
                } else {
                    return 'arabic-part';
                }
                break;
            case 'Major Planet/Luminary':
                if (item.Draconic === true) {
                    return 'planet-luminary draconic';
                } else {
                    return 'planet-luminary';
                }
                break;
            case 'Fixed Star':
                return 'fixed-star';
                break;
            case 'Angle/House Cusp':
                if (item.Draconic === true) {
                    return 'house-cusp draconic';
                } else {
                    return 'house-cusp';
                }
                break;
            default:
                if (item.Draconic === true) {
                    return 'draconic';
                } else {
                    return null;
                }
                break;
        }
    }

    function CoordinateString(item) {
        var orientationString = (!!item.OrientationAbbreviation) ? ' ' + item.OrientationAbbreviation : '';

        var returnValue = item.Degrees
            + '° <span class="'
            + item.HtmlTextCssClass + '">'
            + item.SignAbbreviation
            + '</span> '
            + item.Minutes
            + '\' '
            + item.Seconds
            + '"'
            + orientationString;

        return returnValue;
    }

    function EditThisShit(item) {
        if (!item.Draconic && item.CelestialObjectTypeName !== 'Arabic Part' && item.CelestialObjectTypeName !== 'Angle/House Cusp')
            return 'FuckOff();'
    }

    function isCelestialObject(item) {
        if (item.CelestialObjectId > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    $('.get-aspect').click(function () {
        var context = ko.contextFor(this);
        GetAspects(context.$data);
        return false;
        //
    })
});