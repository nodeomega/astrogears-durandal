﻿// --------------------------------------------------------------------------------------------------------------------
// <copyright file="TransitsController.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell - All Rights Reserved.
// </copyright>
// <summary>
//   Defines the TransitsController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace AstroGearsDurandal.Controllers
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Mvc;

    using AstroGearsDurandal.Models;

    using JetBrains.Annotations;

    /// <summary>
    /// Defines the TransitController type.
    /// </summary>
    public class TransitsController : Controller
    {
        #region Fields

        /// <summary>
        ///     The database
        /// </summary>
        private readonly AstroGearsEntities db = new AstroGearsEntities();

        #endregion

        /// <summary>
        /// Gets the selected entered chart data.
        /// </summary>
        /// <param name="transitChartId">The transit chart identifier.</param>
        /// <returns>The subject location and origin date</returns>
        [CanBeNull]
        public JsonResult GetSelectedEnteredChartData(int transitChartId)
        {
            var thisChart = this.db.EnteredCharts.Find(transitChartId);

            return this.Json(
                new { thisChart.EnteredChartId, thisChart.SubjectLocation, thisChart.OriginDateTimeString, thisChart.ChartTypeId },
                JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the conjunct chart objects.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="firstChartId">The chart identifier.</param>
        /// <param name="secondChartId">The second chart identifier.</param>
        /// <param name="draconic">if set to <c>true</c> [draconic].</param>
        /// <param name="arabic">if set to <c>true</c> [arabic].</param>
        /// <param name="asteroids">if set to <c>true</c> [asteroids].</param>
        /// <param name="stars">if set to <c>true</c> [stars].</param>
        /// <param name="houseSystemId">The house system identifier.</param>
        /// <returns>
        /// A JSON array of chart objects and their aspects to the specified chart object.
        /// </returns>
        [CanBeNull]
        public JsonResult GetTransitAspectChartObjects(
            int id,
            int firstChartId,
            int secondChartId,
            bool draconic,
            bool arabic,
            bool asteroids,
            bool stars,
            byte houseSystemId)
        {
            if (id <= 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var chartCon = new EnteredChartsController();

            var firstChartObject = this.db.ChartObjects.Find(id);

            var thisChart =
                this.db.ChartObjects.Where(x => x.EnteredChartID == secondChartId)
                    .Where(
                        objects =>
                        (!objects.CelestialObject.Draconic)
                        && (objects.CelestialObject.CelestialObjectTypeId
                            != (byte)ChartObject.ObjectTypes.AngleHouseCusp)
                        && (objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.ArabicPart)
                        && ((!asteroids
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.Asteroid)
                            || asteroids)
                        && ((!stars
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.FixedStar)
                            || stars))
                    .ToList()
                    .Union(chartCon.GetAngleChartObjects(secondChartId))
                    .Union(chartCon.GetArabicPartChartObjects(secondChartId, houseSystemId, arabic))
                    .Union(
                        chartCon.GetDraconicChartObjects(
                            secondChartId,
                            draconic,
                            arabic,
                            asteroids,
                            houseSystemId))
                    .OrderBy(x => x.CalculatedCoordinate);

            var aspectList = this.db.Aspects.OrderBy(a => a.AspectId).ToList();

            var aspectObjectLists = chartCon.GetAspectObjectLists(thisChart, firstChartObject, secondChartId, houseSystemId);

            var thisList = new List<object>();

            for (var i = 0; i < aspectList.Count; i++)
            {
                thisList.Add(
                    new { aspectList[i].AspectId, aspectList[i].AspectName, aspectList[i].HtmlTextCssClass, aspectList = aspectObjectLists[i] });
            }

            return this.Json(thisList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the aspect chart objects for angle.
        /// </summary>
        /// <param name="firstChartId">The chart identifier.</param>
        /// <param name="secondChartId">The second chart identifier.</param>
        /// <param name="angleName">Name of the angle.</param>
        /// <param name="angleCoordinates">The angle coordinates.</param>
        /// <param name="draconic">if set to <c>true</c> [draconic].</param>
        /// <param name="arabic">if set to <c>true</c> [arabic].</param>
        /// <param name="asteroids">if set to <c>true</c> [asteroids].</param>
        /// <param name="stars">if set to <c>true</c> [stars].</param>
        /// <param name="houseSystemId">The house system identifier.</param>
        /// <returns>
        /// a JSON object containing all of the objects that aspect the given Arabic Part.
        /// </returns>
        [CanBeNull]
        [ValidateInput(false)]
        public JsonResult GetTransitAspectChartObjectsForAngle(
            int firstChartId,
            int secondChartId,
            [CanBeNull] string angleName,
            [CanBeNull] string angleCoordinates,
            bool draconic,
            bool arabic,
            bool asteroids,
            bool stars,
            byte houseSystemId)
        {
            if (string.IsNullOrEmpty(angleName) || string.IsNullOrEmpty(angleCoordinates) || firstChartId <= 0 || secondChartId <= 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var chartCon = new EnteredChartsController();

            var angles = chartCon.GetAngleChartObjects(firstChartId);

            var comparisonAngles = chartCon.GetAngleChartObjects(secondChartId);

            if (angles.Count == 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var thisObject = angles.FirstOrDefault(ap => ap.CelestialObject.CelestialObjectName == angleName);

            var thisChart =
                this.db.ChartObjects.Where(x => x.EnteredChartID == secondChartId)
                    .Where(
                        objects =>
                        (!objects.CelestialObject.Draconic)
                        && (objects.CelestialObject.CelestialObjectTypeId
                            != (byte)ChartObject.ObjectTypes.AngleHouseCusp)
                        && (objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.ArabicPart)
                        && ((!asteroids
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.Asteroid)
                            || asteroids)
                        && ((!stars
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.FixedStar)
                            || stars))
                    .ToList()
                    .Union(comparisonAngles)
                    .Union(chartCon.GetArabicPartChartObjects(secondChartId, houseSystemId, arabic))
                    .Union(chartCon.GetDraconicChartObjects(secondChartId, draconic, arabic, asteroids, houseSystemId))
                    .OrderBy(x => x.CalculatedCoordinate);

            var aspectList = this.db.Aspects.OrderBy(a => a.AspectId).ToList();

            var aspectObjectLists = chartCon.GetAspectObjectLists(thisChart, thisObject, secondChartId, houseSystemId);

            var thisList = new List<object>();

            for (var i = 0; i < aspectList.Count; i++)
            {
                thisList.Add(
                    new { aspectList[i].AspectId, aspectList[i].AspectName, aspectList[i].HtmlTextCssClass, aspectList = aspectObjectLists[i] });
            }

            return this.Json(thisList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the aspect chart objects for arabic part.
        /// </summary>
        /// <param name="firstChartId">The chart identifier.</param>
        /// <param name="secondChartId">The second chart identifier.</param>
        /// <param name="arabicPartName">Name of the arabic part.</param>
        /// <param name="arabicPartCoordinates">The arabic part coordinates.</param>
        /// <param name="draconic">if set to <c>true</c> [draconic].</param>
        /// <param name="arabic">if set to <c>true</c> [arabic].</param>
        /// <param name="asteroids">if set to <c>true</c> [asteroids].</param>
        /// <param name="stars">if set to <c>true</c> [stars].</param>
        /// <param name="houseSystemId">The house system identifier.</param>
        /// <returns>
        /// a JSON object containing all of the objects that aspect the given Arabic Part.
        /// </returns>
        [CanBeNull]
        [ValidateInput(false)]
        public JsonResult GetTransitAspectChartObjectsForArabicPart(
            int firstChartId,
            int secondChartId,
            [CanBeNull] string arabicPartName,
            [CanBeNull] string arabicPartCoordinates,
            bool draconic,
            bool arabic,
            bool asteroids,
            bool stars,
            byte houseSystemId)
        {
            if (string.IsNullOrEmpty(arabicPartName) || string.IsNullOrEmpty(arabicPartCoordinates) || firstChartId <= 0 || secondChartId <= 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var chartCon = new EnteredChartsController();

            var arabicParts = chartCon.GetArabicPartChartObjects(firstChartId, houseSystemId, arabic);

            if (arabicParts.Count == 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var thisObject = arabicParts.FirstOrDefault(ap => ap.CelestialObject.CelestialObjectName == arabicPartName);

            ////arabicParts = null;

            var secondArabicParts = chartCon.GetArabicPartChartObjects(secondChartId, houseSystemId, arabic);

            var thisChart =
                this.db.ChartObjects.Where(x => x.EnteredChartID == secondChartId)
                    .Where(
                        objects =>
                        (!objects.CelestialObject.Draconic)
                        && (objects.CelestialObject.CelestialObjectTypeId
                            != (byte)ChartObject.ObjectTypes.AngleHouseCusp)
                        && (objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.ArabicPart)
                        && ((!asteroids
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.Asteroid)
                            || asteroids)
                        && ((!stars
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.FixedStar)
                            || stars))
                    .ToList()
                    .Union(chartCon.GetAngleChartObjects(secondChartId))
                    .Union(secondArabicParts)
                    .Union(chartCon.GetDraconicChartObjects(secondChartId, draconic, arabic, asteroids, houseSystemId))
                    .OrderBy(x => x.CalculatedCoordinate);

            var aspectList = this.db.Aspects.OrderBy(a => a.AspectId).ToList();

            var aspectObjectLists = chartCon.GetAspectObjectLists(thisChart, thisObject, secondChartId, houseSystemId);

            var thisList = new List<object>();

            for (var i = 0; i < aspectList.Count; i++)
            {
                thisList.Add(
                    new { aspectList[i].AspectId, aspectList[i].AspectName, aspectList[i].HtmlTextCssClass, aspectList = aspectObjectLists[i] });
            }

            return this.Json(thisList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the aspect chart objects for draconic object.
        /// </summary>
        /// <param name="firstChartId">The chart identifier.</param>
        /// <param name="secondChartId">The second chart identifier.</param>
        /// <param name="draconicName">Name of the draconic.</param>
        /// <param name="draconicCoordinates">The draconic coordinates.</param>
        /// <param name="draconic">if set to <c>true</c> [draconic].</param>
        /// <param name="arabic">if set to <c>true</c> [arabic].</param>
        /// <param name="asteroids">if set to <c>true</c> [asteroids].</param>
        /// <param name="stars">if set to <c>true</c> [stars].</param>
        /// <param name="houseSystemId">The house system identifier.</param>
        /// <returns>
        /// a JSON object containing all of the objects that aspect the given Draconic Object.
        /// </returns>
        [CanBeNull]
        [ValidateInput(false)]
        public JsonResult GetTransitAspectChartObjectsForDraconicObject(
            int firstChartId,
            int secondChartId,
            [CanBeNull] string draconicName,
            [CanBeNull] string draconicCoordinates,
            bool draconic,
            bool arabic,
            bool asteroids,
            bool stars,
            byte houseSystemId)
        {
            if (string.IsNullOrEmpty(draconicName) || string.IsNullOrEmpty(draconicCoordinates) || firstChartId <= 0 || secondChartId <= 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var chartCon = new EnteredChartsController();

            var draconicObjects = chartCon.GetDraconicChartObjects(firstChartId, draconic, arabic, asteroids, houseSystemId);

            if (draconicObjects.Count == 0)
            {
                return this.Json(null, JsonRequestBehavior.AllowGet);
            }

            var secondDraconicObjects = chartCon.GetDraconicChartObjects(secondChartId, draconic, arabic, asteroids, houseSystemId);

            var thisObject = draconicObjects.FirstOrDefault(
                ap => ap.CelestialObject.CelestialObjectName == draconicName);

            var thisChart =
                this.db.ChartObjects.Where(x => x.EnteredChartID == secondChartId)
                    .Where(
                        objects =>
                        (!objects.CelestialObject.Draconic)
                        && (objects.CelestialObject.CelestialObjectTypeId
                            != (byte)ChartObject.ObjectTypes.AngleHouseCusp)
                        && (objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.ArabicPart)
                        && ((!asteroids
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.Asteroid)
                            || asteroids)
                        && ((!stars
                             && objects.CelestialObject.CelestialObjectTypeId != (byte)ChartObject.ObjectTypes.FixedStar)
                            || stars))
                    .ToList()
                    .Union(chartCon.GetAngleChartObjects(secondChartId))
                    .Union(chartCon.GetArabicPartChartObjects(secondChartId, houseSystemId, arabic))
                    .Union(secondDraconicObjects)
                    .OrderBy(x => x.CalculatedCoordinate);

            var aspectList = this.db.Aspects.OrderBy(a => a.AspectId).ToList();

            var aspectObjectLists = chartCon.GetAspectObjectLists(thisChart, thisObject, secondChartId, houseSystemId);

            var thisList = new List<object>();

            for (var i = 0; i < aspectList.Count; i++)
            {
                thisList.Add(
                    new { aspectList[i].AspectId, aspectList[i].AspectName, aspectList[i].HtmlTextCssClass, aspectList = aspectObjectLists[i] });
            }

            return this.Json(thisList, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the transit chart listing.
        /// </summary>
        /// <param name="chartId">The chart identifier.</param>
        /// <returns>JSON for a drop down list to select on the Transit page.</returns>
        [CanBeNull]
        public JsonResult GetTransitChartListing(int chartId)
        {
            var availableCharts =
                this.db.EnteredCharts.Where(
                    x =>
                    x.EnteredChartId != chartId
                    && ((x.ChartTypeId == (byte)EnteredChart.ChartTypes.Event)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.Transit)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.Progressed)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.SolarReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.LunarReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.MercuryReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.VenusReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.MarsReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.JupiterReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.SaturnReturn)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.SolarEclipse)
                        || (x.ChartTypeId == (byte)EnteredChart.ChartTypes.LunarEclipse)))
                    .Select(x => new { x.EnteredChartId, x.SubjectName, x.ChartType.ChartTypeName });

            return this.Json(availableCharts, JsonRequestBehavior.AllowGet);
        }
    }
}