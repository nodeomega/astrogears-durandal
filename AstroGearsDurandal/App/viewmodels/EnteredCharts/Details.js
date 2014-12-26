// onclick="EnteredChartDetails.GetListing(@Html.DisplayFor(model => model.EnteredChartId));EnteredChartDetails.GetHouseListing(@Html.DisplayFor(model => model.EnteredChartId))" 

define(['plugins/http', 'durandal/app', 'knockout', 'scripts/common-library'], function (http, app, ko, common) {
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

    var AspectItem = ko.observable(),
        AspectList = ko.observableArray([])
        includeDraconic = ko.observable(false),
        includeArabic = ko.observable(false),
        includeAsteroids = ko.observable(false),
        includeStars = ko.observable(false),
        chartHouseSystemId = ko.observable(0),
        chartId = ko.observable(0);

    return {
        settings: ko.observable({ cacheViews: false }),
        displayName: 'AstroGears Details Listing',
        includeDraconic: includeDraconic,
        includeArabic: includeArabic,
        includeAsteroids: includeAsteroids,
        includeStars: includeStars,
        chartHouseSystemId: chartHouseSystemId,
        chartObjects: ko.observableArray([]),
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
        activate: function (context) {
            //the router's activator calls this function and waits for it to complete before proceeding
            this.chartObjects.removeAll();

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
        refreshChartData: function (item) {
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
                    console.log('Refesh Failed.');
                });
        },
        dynamicChartObjectCss: dynamicChartObjectCss,
        CoordinateString: CoordinateString,
        GetAspects: function (item, event) {
            //event.cancelBubble = true;
            //event.stopPropagation();
            AspectList.removeAll();
            $('#aspectLoading').show();
            AspectItem('Aspects to ' + item.CelestialObjectName + ' (' + CoordinateString(item) + ')');
            if (item.Draconic) {
                var jqxhr = $.getJSON("/EnteredCharts/GetAspectChartObjectsForDraconicObject",
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
                         AspectList(data);
                     });
            }
            else if (item.CelestialObjectTypeName === 'Arabic Part') {
                var jqxhr = $.getJSON("/EnteredCharts/GetAspectChartObjectsForArabicPart",
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
                        AspectList(data);
                    });
            }
            else if (item.CelestialObjectTypeName === 'Angle/House Cusp') {
                var jqxhr = $.getJSON("/EnteredCharts/GetAspectChartObjectsForAngle",
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
                        AspectList(data);
                    });
            }
            else {
                var jqxhr = $.getJSON("/EnteredCharts/GetAspectChartObjects",
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
                        AspectList(data);
                    });
            }
            return false;
        },
        EditThisShit: EditThisShit,
        isCelestialObject: isCelestialObject,
        HouseCoordinateString: HouseCoordinateString,
        HouseLabel: HouseLabel,
        AngleLabel: AngleLabel,
        SetUpListItemElementForAspect: SetUpListItemElementForAspect,
        SetUpIdsForEntry: SetUpIdsForEntry,
        FormatAspectCoordinates: FormatAspectCoordinates,
        GetInterpretation: function (item, parent, tag, event) {
            //event.cancelBubble = true;
            //event.stopPropagation();

            var interpretationIds = (item.BaseObjectValidForInterpretation && item.ThisObjectValidForInterpretation) ? SetUpIdsForEntry(
                item.BaseObjectCelestialObjectId, (item.BaseObjectCelestialObjectId !== 0) ? true : false,
                item.BaseObjectAngleId, (!common.IsNullOrUndefined(item.BaseObjectAngleId)) ? true : false,
                item.CelestialObjectId, (item.CelestialObjectId !== 0) ? true : false,
                item.AngleId, (!common.IsNullOrUndefined(item.AngleId)) ? true : false
                )
                : null;

            if (common.IsNullOrUndefined(interpretationIds)) {
                return false;
            }

            var celestialObjectId1 = interpretationIds[0],
                angleId1 = interpretationIds[1],
                aspectId = parent.AspectId,
                celestialObjectId2 = interpretationIds[2],
                angleId2 = interpretationIds[3];

            if ($(tag + ' > ul').length > 0) {
                $(tag + ' > ul').remove();
                $(tag + ' > a > .fa').removeClass('action-successful');
                return;
            }
            $(tag + ' > a > .fa').addClass('action-successful');

            var interpretationList = $('<ul class="detail-interpretation"/>');

            var jqxhr = $.getJSON('/AspectInterpretations/GetSingleChartDetailAspectInterpretationRequest', {
                celestialObjectId1: celestialObjectId1,
                angleId1: angleId1,
                aspectId: aspectId,
                celestialObjectId2: celestialObjectId2,
                angleId2: angleId2
            }).done(function (data) {
                if (data.length > 0) {
                    $.each(data, function (i, item) {
                        interpretationList.append($('<li/>').html(item.Interpretation.replace(/\n/g, '<br>')
                            + (!common.IsNullOrUndefined(item.CitationUrl)
                            ? ' (' + (item.CitationUrl.substring(0, 4) === 'http'
                            ? '<a href="' + item.CitationUrl + '" target="_blank">' + item.CitationUrl + '</a>'
                            : item.CitationUrl) + ')'
                            : '')));
                    });
                } else {
                    interpretationList.append($('<li/>').html('(no interpretation available)'));
                }
            }).fail(function (jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.log("Interpretation Load failure: " + err);
            });

            $(tag).append(interpretationList);
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
        if (item.ChartObjectId > 0 && !item.Draconic) {
            return true;
        }
        else {
            return false;
        }
    }

    function SetUpListItemElementForAspect(aspectItem) {
        switch (aspectItem.CelestialObjectTypeName) {
            case 'Arabic Part':
                return (aspectItem.Draconic === true) ? "arabic-part draconic" : "arabic-part";
                break;
            case 'Major Planet/Luminary':
                return (aspectItem.Draconic === true) ? "planet-luminary draconic" : "planet-luminary";
                break;
            case 'Fixed Star':
                return "fixed-star";
                break;
            case 'Angle/House Cusp':
                return (aspectItem.Draconic === true) ?  "house-cusp draconic" : "house-cusp";
                break;
            default:
                return (aspectItem.Draconic === true) ?  "draconic" : "";
                break;
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

    function FormatAspectCoordinates(item, parent) {
        var newIdName = parent.AspectName + item.CelestialObjectId.toString();
        
        var orientationString = (!!item.OrientationAbbreviation) ? ' ' + item.OrientationAbbreviation : '';
        var houseString = (item.House != 0) ? ' | House ' + item.House : '';

        var interpretationIds = (item.BaseObjectValidForInterpretation && item.ThisObjectValidForInterpretation) ? SetUpIdsForEntry(
            item.BaseObjectCelestialObjectId, (item.BaseObjectCelestialObjectId !== 0) ? true : false,
            item.BaseObjectAngleId, (!common.IsNullOrUndefined(item.BaseObjectAngleId)) ? true : false,
            item.CelestialObjectId, (item.CelestialObjectId !== 0) ? true : false,
            item.AngleId, (!common.IsNullOrUndefined(item.AngleId)) ? true : false
            )
            : null;

        var interpretationLink = (item.BaseObjectValidForInterpretation && item.ThisObjectValidForInterpretation) ? ' <a href="#" data-bind="click: $root.GetInterpretation(\'#' + newIdName + '\', ' +
            interpretationIds[0] + ', ' + interpretationIds[1] + ', ' + parent.AspectId + ', ' + interpretationIds[2] + ', ' + interpretationIds[3] + ');return false;"><span class="fa fa-search"></span></a>' : '';

        return item.CelestialObjectName
            + ' ('
            + item.Degrees
            + '° <span class="'
            + item.HtmlTextCssClass + '">'
            + item.SignAbbreviation
            + '</span> '
            + item.Minutes
            + '\' '
            + item.Seconds
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