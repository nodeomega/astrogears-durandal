// --------------------------------------------------------------------------------------------------------------------
// <copyright file="CommonController.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell - All Rights Reserved.
// </copyright>
// <summary>
//   Defines the CommonController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace AstroGearsDurandal.Controllers
{
    using System.Linq;
    using System.Web.Mvc;

    using AstroGearsDurandal.Models;

    using JetBrains.Annotations;

    /// <summary>
    /// Defines the CommonController Type
    /// </summary>
    public class CommonController : Controller
    {
        #region Fields

        /// <summary>
        ///     The database
        /// </summary>
        private readonly AstroGearsEntities db = new AstroGearsEntities();

        #endregion

        /// <summary>
        /// Gets the chart types list.
        /// </summary>
        /// <returns>A JSON array of the Chart Types.</returns>
        [CanBeNull]
        public JsonResult GetChartTypesList()
        {
            var aspectTypes = this.db.ChartTypes.Select(x => new { x.ChartTypeId, x.ChartTypeName });

            return this.Json(aspectTypes, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        ///     Gets the signs list.
        /// </summary>
        /// <returns>A JSON array of signs for the drop-down-list.</returns>
        [CanBeNull]
        public JsonResult GetSignsList()
        {
            var signs = this.db.Signs.Select(x => new { x.SignId, x.SignAbbreviation }).ToList();
            return this.Json(signs, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// Gets the orientations list.
        /// </summary>
        /// <returns>A JSON array of orientations for the drop-down list.</returns>
        public JsonResult GetOrientationsList()
        {
            var orientations =
                this.db.Orientations.Select(
                    x =>
                    new
                        {
                            x.OrientationId,
                            OrientationDescription = x.OrientationName + ((x.OrientationAbbreviation != null) ? " (" + x.OrientationAbbreviation + ")" : string.Empty)
                        });
            return this.Json(orientations, JsonRequestBehavior.AllowGet);
        }
    }
}