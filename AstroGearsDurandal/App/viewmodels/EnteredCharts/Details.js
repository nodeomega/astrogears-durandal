define(["plugins/http", "durandal/app", "knockout", "scripts/common-library"], function (http, app, ko, common) {
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

    function EnteredChartCoordinates(data) {
        this.CelestialObjectName = ko.observable(data.CelestialObjectName);
        this.Degrees = ko.observable(data.Degrees);
        this.SignId = ko.observable(data.SignId);
        this.SignAbbreviation = ko.observable(data.SignAbbreviation);
        this.Minutes = ko.observable(data.Minutes);
        this.Seconds = ko.observable(data.Seconds);
        this.OrientationId = ko.observable(data.OrientationId);
        this.OrientationAbbreviation = ko.observable(data.OrientationAbbreviation);
        this.ChartObjectId = ko.observable(data.ChartObjectId);
        this.HtmlTextCssClass = ko.observable(data.HtmlTextCssClass);
    }

    function AspectBaseListing(data) {
        var array = [];
        $.each(data, function (i, item) {
            if (!common.IsNullOrUndefined(item.aspectList)) {
                array.push(new AspectBase(item));
            }
        });

        return array;
    }

    function AspectListing(data) {
        var array = [];
        $.each(data, function (i, item) {
            array.push(new AspectListingItem(item));
        });

        return array;
    }

    function AspectBase(item) {
        this.AspectId = ko.observable(item.AspectId);
        this.AspectName = ko.observable(item.AspectName);
        this.HtmlTextCssClass = ko.observable(item.HtmlTextCssClass);
        this.aspectList = ko.observable(new AspectListing(item.aspectList));
    }

    function AspectListingItem(item) {
        this.CelestialObjectName = ko.observable(item.CelestialObjectName);
        this.CelestialObjectTypeName = ko.observable(item.CelestialObjectTypeName);
        this.Draconic = ko.observable(item.Draconic);
        this.Degrees = ko.observable(item.Degrees);
        this.HtmlTextCssClass = ko.observable(item.HtmlTextCssClass);
        this.SignAbbreviation = ko.observable(item.SignAbbreviation);
        this.Minutes = ko.observable(item.Minutes);
        this.Seconds = ko.observable(item.Seconds);
        this.OrientationAbbreviation = ko.observable(item.OrientationAbbreviation);
        this.House = ko.observable(item.House);
        this.BaseObjectValidForInterpretation = ko.observable(item.BaseObjectValidForInterpretation);
        this.ThisObjectValidForInterpretation = ko.observable(item.ThisObjectValidForInterpretation);
        this.BaseObjectCelestialObjectId = ko.observable(item.BaseObjectCelestialObjectId);
        this.BaseObjectAngleId = ko.observable(item.BaseObjectAngleId);
        this.CelestialObjectId = ko.observable(item.CelestialObjectId);
        this.AngleId = ko.observable(item.AngleId);

        this.InterpretationList = ko.observable([]);
    }

    var status = ko.observable(),
        AspectItem = ko.observable(),
        AspectList = ko.observableArray([]),
        includeDraconic = ko.observable(false),
        includeArabic = ko.observable(false),
        includeAsteroids = ko.observable(false),
        includeStars = ko.observable(false),
        chartHouseSystemId = ko.observable(0),
        chartId = ko.observable(0),
        chartObjects = ko.observableArray([]),
        signsOptions = ko.observableArray([]),
        orientationsOptions = ko.observableArray([]),
        editSignId = ko.observable(0),
        editOrientationId = ko.observable(0),
        editCoordinates = ko.observable(),
        editStatus = ko.observable(),
        deleteCoordinates = ko.observable(),
        deleteStatus = ko.observable();

    return {
        status: status,
        enteredChartListing: ko.observable(),
        settings: ko.observable({ cacheViews: false }),
        displayName: 'Chart Details',
        includeDraconic: includeDraconic,
        includeArabic: includeArabic,
        includeAsteroids: includeAsteroids,
        includeStars: includeStars,
        signsOptions: signsOptions,
        orientationsOptions: orientationsOptions,
        chartHouseSystemId: chartHouseSystemId,
        chartObjects: chartObjects,
        thisnum: ko.observable(0),
        HouseList: ko.observableArray([]),
        AngleList: ko.observableArray([]),
        DraconicHouseList: ko.observableArray([]),
        DraconicAngleList: ko.observableArray([]),
        HasDraconicHouses: ko.observable(false),
        AspectItem: AspectItem,
        AspectList: AspectList,
        AspectObjectList: ko.observableArray([]),
        chartId: chartId,
        editSignId: editSignId,
        editOrientationId: editOrientationId,
        editCoordinates: editCoordinates,
        editStatus: editStatus,
        deleteCoordinates: deleteCoordinates,
        deleteStatus: deleteStatus,
        activate: function (context) {
            //the router's activator calls this function and waits for it to complete before proceeding
            this.chartObjects.removeAll();

            var that = this;
            $('#chartLoading').show();
            return $.when(
                $.getJSON('/EnteredCharts/GetEnteredChartForDetails', { chartId: context }),
                $.getJSON('Common/GetSignsList'),
                $.getJSON('Common/GetOrientationsList'),
                $.getJSON('/EnteredCharts/GetDetailsChartListing', { id: context, draconic: false, arabic: false, asteroids: false, stars: false, houseSystemId: 0 }),
                $.getJSON('/EnteredCharts/GetDetailsHouseListing', { chartId: context, houseSystemId: 0 }),
                $.getJSON('/EnteredCharts/GetDetailsAngleListing', { chartId: context })
                ).then(function (detailsResponse, signsResponse, orientationsResponse, listingResponse, houseResponse, angleResponse) {
                    that.enteredChartListing(new EnteredChartListing(detailsResponse[0]));

                    that.chartObjects(listingResponse[0]);
                    that.thisnum(context);

                    that.signsOptions(signsResponse[0]);
                    that.orientationsOptions(orientationsResponse[0]);

                    that.HouseList(houseResponse[0]);
                    that.AngleList(angleResponse[0]);

                    that.chartId(context);

                    $('#chartLoading').hide();
                });
        },
        editLink: function () {
            //EnteredCharts(item.EnteredChartId);
            return false;
        },
        refreshChartData: function () {
            var that = this;
            that.chartObjects.removeAll();
            $('#chartLoading').show();
            return $.when(
                $.getJSON('/EnteredCharts/GetDetailsChartListing', {
                    id: that.chartId,
                    draconic: that.includeDraconic,
                    arabic: that.includeArabic,
                    asteroids: that.includeAsteroids,
                    stars: that.includeStars,
                    houseSystemId: that.chartHouseSystemId
                }),
                $.getJSON('/EnteredCharts/GetDetailsHouseListing', { chartId: that.chartId, houseSystemId: that.chartHouseSystemId }),
                $.getJSON('/EnteredCharts/GetDetailsAngleListing', { chartId: that.chartId }),
                $.getJSON('/EnteredCharts/GetDetailsDraconicHouseListing', { chartId: that.chartId, houseSystemId: that.chartHouseSystemId, draconic: that.includeDraconic }),
                $.getJSON('/EnteredCharts/GetDetailsDraconicAngleListing', { chartId: that.chartId, draconic: that.includeDraconic })
                ).then(function (listingResponse, houseResponse, angleResponse, draconicHouseResponse, draconicAngleResponse) {
                    that.chartObjects(listingResponse[0]);

                    that.HouseList(houseResponse[0]);
                    that.AngleList(angleResponse[0]);
                    if (that.includeDraconic()) {
                        that.HasDraconicHouses(true);
                        that.DraconicHouseList(draconicHouseResponse[0]);
                        that.DraconicAngleList(draconicAngleResponse[0]);
                    } else {
                        that.HasDraconicHouses(false);
                        that.DraconicHouseList.removeAll();
                        that.DraconicAngleList.removeAll();
                    }

                    $('#chartLoading').hide();
                }, function () {
                    console.log('Refresh Failed.');
                });
        },
        dynamicChartObjectCss: dynamicChartObjectCss,
        CoordinateString: CoordinateString,
        GetAspects: function (item) {
            //event.cancelBubble = true;
            //event.stopPropagation();
            AspectList.removeAll();
            $('#aspectLoading').show();
            AspectItem('Aspects to ' + item.CelestialObjectName + ' (' + CoordinateString(item) + ')');
            if (item.Draconic) {
                $.getJSON("/EnteredCharts/GetAspectChartObjectsForDraconicObject",
                     {
                         chartId: chartId,
                         draconicName: item.CelestialObjectName,
                         draconicCoordinates: CoordinateString(item),
                         draconic: includeDraconic,
                         arabic: includeArabic,
                         asteroids: includeAsteroids,
                         stars: includeStars,
                         houseSystemId: chartHouseSystemId
                     }).then(function (data) {
                         $('#aspectLoading').hide();
                         AspectList(new AspectBaseListing(data));
                     });
            } else if (item.CelestialObjectTypeName === 'Arabic Part') {
                $.getJSON("/EnteredCharts/GetAspectChartObjectsForArabicPart",
                    {
                        chartId: chartId,
                        arabicPartName: item.CelestialObjectName,
                        arabicPartCoordinates: CoordinateString(item),
                        draconic: includeDraconic,
                        arabic: includeArabic,
                        asteroids: includeAsteroids,
                        stars: includeStars,
                        houseSystemId: chartHouseSystemId
                    }).then(function (data) {
                        $('#aspectLoading').hide();
                        AspectList(new AspectBaseListing(data));
                    });
            } else if (item.CelestialObjectTypeName === 'Angle/House Cusp') {
                $.getJSON("/EnteredCharts/GetAspectChartObjectsForAngle",
                    {
                        chartId: chartId,
                        angleName: item.CelestialObjectName,
                        angleCoordinates: CoordinateString(item),
                        draconic: includeDraconic,
                        arabic: includeArabic,
                        asteroids: includeAsteroids,
                        stars: includeStars,
                        houseSystemId: chartHouseSystemId
                    }).then(function (data) {
                        $('#aspectLoading').hide();
                        AspectList(new AspectBaseListing(data));
                    });
            } else {
                $.getJSON("/EnteredCharts/GetAspectChartObjects",
                    {
                        id: item.ChartObjectId,
                        chartId: chartId,
                        draconic: includeDraconic,
                        arabic: includeArabic,
                        asteroids: includeAsteroids,
                        stars: includeStars,
                        houseSystemId: chartHouseSystemId
                    }).then(function (data) {
                        $('#aspectLoading').hide();
                        AspectList(new AspectBaseListing(data));
                    });
            }
            return false;
        },
        openEditCoordinatesForm: openEditCoordinatesForm,
        openDeleteCoordinatesForm: openDeleteCoordinatesForm,
        isCelestialObject: isCelestialObject,
        HouseCoordinateString: HouseCoordinateString,
        HouseLabel: HouseLabel,
        AngleLabel: AngleLabel,
        SetUpListItemElementForAspect: SetUpListItemElementForAspect,
        SetUpIdsForEntry: SetUpIdsForEntry,
        FormatAspectCoordinates: FormatAspectCoordinates,
        GetInterpretation: function (item, parent) {
            //event.cancelBubble = true;
            //event.stopPropagation();

            var interpretationIds = (item.BaseObjectValidForInterpretation() && item.ThisObjectValidForInterpretation()) ? SetUpIdsForEntry(
                item.BaseObjectCelestialObjectId(), (item.BaseObjectCelestialObjectId() !== 0) ? true : false,
                item.BaseObjectAngleId(), (!common.IsNullOrUndefined(item.BaseObjectAngleId())) ? true : false,
                item.CelestialObjectId(), (item.CelestialObjectId() !== 0) ? true : false,
                item.AngleId(), (!common.IsNullOrUndefined(item.AngleId())) ? true : false
                )
                : null;

            if (common.IsNullOrUndefined(interpretationIds)) {
                return false;
            }

            var celestialObjectId1 = interpretationIds[0],
                angleId1 = interpretationIds[1],
                aspectId = parent.AspectId(),
                celestialObjectId2 = interpretationIds[2],
                angleId2 = interpretationIds[3];

            if (!common.IsNullOrUndefined(item.InterpretationList()) && item.InterpretationList().length > 0)
            {
                item.InterpretationList([]);
                return;
            }

            $.when($.getJSON('/AspectInterpretations/GetSingleChartDetailAspectInterpretationRequest', {
                celestialObjectId1: celestialObjectId1,
                angleId1: angleId1,
                aspectId: aspectId,
                celestialObjectId2: celestialObjectId2,
                angleId2: angleId2
            })).then(function (response) {
                if (response.length > 0) {
                    item.InterpretationList(response);
                } else {
                    item.InterpretationList([function () { this.Interpretation = '(No interpretation available).', this.CitationUrl = null; }]);
                }
            });
            return false;
        },
        confirmUpdateCoordinates: function (item) {
            $.post('/EnteredCharts/UpdateChartObjectForEnteredChart', {
                chartObjectId: item.ChartObjectId,
                degrees: item.Degrees,
                signId: item.SignId,
                minutes: item.Minutes,
                seconds: item.Seconds,
                orientationId: item.OrientationId
            }).then(function (data) {
                if (data === 'Success') {
                    status(common.SuccessIcon + ' Coordinates updated successfully.');

                    $('#editCoordinatesModal').modal('hide');

                    chartObjects.removeAll();
                    $('#chartLoading').show();
                    $.getJSON('/EnteredCharts/GetDetailsChartListing', {
                        id: chartId,
                        draconic: includeDraconic,
                        arabic: includeArabic,
                        asteroids: includeAsteroids,
                        stars: includeStars,
                        houseSystemId: chartHouseSystemId
                    }).then(function (response) {
                        chartObjects(response);
                        $('#chartLoading').hide();
                    });
                } else {
                    editStatus(common.ErrorIcon + ' Failed to update Coordinates.<br />' + data);
                }
            });
            return false;
        },
        confirmDeleteCoordinates: function (item) {
            $.post('/EnteredCharts/DeleteChartObjectForEnteredChart', {
                chartObjectId: item.ChartObjectId
            }).then(function (data) {
                if (data === 'Success') {
                    status(common.SuccessIcon + ' Coordinates deleted successfully.');

                    $('#deleteCoordinatesModal').modal('hide');

                    chartObjects.removeAll();
                    $('#chartLoading').show();
                    $.getJSON('/EnteredCharts/GetDetailsChartListing', {
                        id: chartId,
                        draconic: includeDraconic,
                        arabic: includeArabic,
                        asteroids: includeAsteroids,
                        stars: includeStars,
                        houseSystemId: chartHouseSystemId
                    }).then(function (response) {
                        chartObjects(response);
                        $('#chartLoading').hide();
                    });
                } else {
                    deleteStatus(common.ErrorIcon + ' Failed to delete Coordinates.<br />' + data);
                }
            });
            return false;
        }
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

    function openEditCoordinatesForm(item) {
        if (!item.Draconic && item.CelestialObjectTypeName !== 'Arabic Part' && item.CelestialObjectTypeName !== 'Angle/House Cusp')
        {
            $("#editCoordinatesModal").modal("show");
            //editCoordinates(new EnteredChartCoordinates(item));
            editCoordinates(item);
        }
    }

    function openDeleteCoordinatesForm(item) {
        if (!item.Draconic && item.CelestialObjectTypeName !== 'Arabic Part' && item.CelestialObjectTypeName !== 'Angle/House Cusp') {
            $("#deleteCoordinatesModal").modal("show");
            //deleteCoordinates(new EnteredChartCoordinates(item));
            deleteCoordinates(item);
        }
    }

    function isCelestialObject(item) {
        if (item.ChartObjectId > 0 && !item.Draconic) {
            return true;
        } else {
            return false;
        }
    }

    function SetUpListItemElementForAspect(aspectItem) {
        switch (aspectItem.CelestialObjectTypeName()) {
            case 'Arabic Part':
                return (aspectItem.Draconic() === true) ? "arabic-part draconic" : "arabic-part";
            case 'Major Planet/Luminary':
                return (aspectItem.Draconic() === true) ? "planet-luminary draconic" : "planet-luminary";
            case 'Fixed Star':
                return "fixed-star";
            case 'Angle/House Cusp':
                return (aspectItem.Draconic() === true) ? "house-cusp draconic" : "house-cusp";
            default:
                return (aspectItem.Draconic() === true) ? "draconic" : "";
        }
    }

    function SetUpIdsForEntry(celObj1Id, useCelObj1Id, angleId1, useAngle1Id, celObj2Id, useCelObj2Id, angleId2, useAngle2Id) {
        if (useCelObj1Id) {
            if (useCelObj2Id) {
                if (celObj1Id > celObj2Id) {
                    return [parseInt(celObj1Id), null, parseInt(celObj2Id), null];
                } else {
                    return [parseInt(celObj2Id), null, parseInt(celObj1Id), null];
                }
            } else if (useAngle2Id) {
                return [parseInt(celObj1Id), null, null, parseInt(angleId2)];
            }
        } else if (useAngle1Id) {
            if (useCelObj2Id) {
                return [null, parseInt(angleId1), parseInt(celObj2Id), null];
            } else if (useAngle2Id) {
                if (angleId1 > angleId2) {
                    return [null, parseInt(angleId1), null, parseInt(angleId2)];
                } else {
                    return [null, parseInt(angleId2), null, parseInt(angleId1)];
                }
            }
        }
        return null;
    }

    function FormatAspectCoordinates(item) { //, parent) {
        //var newIdName = parent.AspectName + item.CelestialObjectId().toString();
        
        var orientationString = (!!item.OrientationAbbreviation()) ? ' ' + item.OrientationAbbreviation() : '';
        var houseString = (item.House() !== 0) ? ' | House ' + item.House() : '';

        //var interpretationIds = (item.BaseObjectValidForInterpretation() && item.ThisObjectValidForInterpretation()) ? SetUpIdsForEntry(
        //    item.BaseObjectCelestialObjectId(), (item.BaseObjectCelestialObjectId() !== 0) ? true : false,
        //    item.BaseObjectAngleId(), (!common.IsNullOrUndefined(item.BaseObjectAngleId())) ? true : false,
        //    item.CelestialObjectId(), (item.CelestialObjectId() !== 0) ? true : false,
        //    item.AngleId(), (!common.IsNullOrUndefined(item.AngleId())) ? true : false
        //    )
        //    : null;

        //var interpretationLink = (item.BaseObjectValidForInterpretation() && item.ThisObjectValidForInterpretation()) ? ' <a href="#" data-bind="click: $root.GetInterpretation(\'#' + newIdName + '\', ' +
        //    interpretationIds[0] + ', ' + interpretationIds[1] + ', ' + parent.AspectId + ', ' + interpretationIds[2] + ', ' + interpretationIds[3] + ');return false;"><span class="fa fa-search"></span></a>' : '';

        return item.CelestialObjectName()
            + ' ('
            + item.Degrees()
            + '° <span class="'
            + item.HtmlTextCssClass() + '">'
            + item.SignAbbreviation()
            + '</span> '
            + item.Minutes()
            + '\' '
            + item.Seconds()
            + '"'
            + orientationString
            + houseString
            + ')';
            //+ interpretationLink;
    }

    // function GetInterpretation(tag, celestialObjectId1, angleId1, aspectId, celestialObjectId2, angleId2) {
    

    //$('.get-aspect').click(function () {
    //    var context = ko.contextFor(this);
    //    GetAspects(context.$data);
    //    return false;
    //    //
    //})
});