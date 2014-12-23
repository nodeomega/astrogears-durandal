// --------------------------------------------------------------------------------------------------------------------
// <copyright file="HomeController.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell - All Rights Reserved.
// </copyright>
// <summary>
//   Defines the HomeController type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace AstroGearsDurandal.Controllers
{
    using System.Web.Mvc;

    /// <summary>
    /// The Home Controller.
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Gets the home index view.
        /// </summary>
        /// <returns>The home index view.</returns>
        public ActionResult Index()
        {
                return this.View();
        }
    }
}