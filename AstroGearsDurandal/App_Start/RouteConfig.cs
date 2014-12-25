// --------------------------------------------------------------------------------------------------------------------
// <copyright file="RouteConfig.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell - All Rights Reserved.
// </copyright>
// <summary>
//   Defines the RouteConfig type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace AstroGearsDurandal
{
    using System;
    using System.Web.Mvc;
    using System.Web.Routing;

    using JetBrains.Annotations;

    /// <summary>
    /// The Route Configuration
    /// </summary>
    public class RouteConfig
    {
        /// <summary>
        /// Registers the routes.
        /// </summary>
        /// <param name="routes">The routes.</param>
        public static void RegisterRoutes([NotNull] RouteCollection routes)
        {
            if (routes == null)
            {
                throw new ArgumentNullException("routes");
            }

            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute("Default", "{controller}/{action}/{id}", new { controller = "Home", action = "Index", id = UrlParameter.Optional });

            ////routes.MapRoute("Default", "{*url}", new { controller = "Home", action = "Index" });
        }
    }
}
