// --------------------------------------------------------------------------------------------------------------------
// <copyright file="BundleConfig.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell - All Rights Reserved.
// </copyright>
// <summary>
//   Defines the BundleConfig type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace AstroGearsDurandal
{
    using System;
    using System.Web.Optimization;

    using JetBrains.Annotations;

    /// <summary>
    /// Defines the BundleConfig.
    /// </summary>
    public class BundleConfig
    {
        /// <summary>
        /// Adds the default ignore patterns.
        /// </summary>
        /// <param name="ignoreList">The ignore list.</param>
        /// <exception cref="System.ArgumentNullException">ignoreList is null</exception>
        public static void AddDefaultIgnorePatterns([NotNull] IgnoreList ignoreList)
        {
            if (ignoreList == null)
            {
                throw new ArgumentNullException("ignoreList");
            }

            ignoreList.Ignore("*.intellisense.js");
            ignoreList.Ignore("*-vsdoc.js");
            ignoreList.Ignore("*.debug.js", OptimizationMode.WhenEnabled);
            ////ignoreList.Ignore("*.min.js", OptimizationMode.WhenDisabled);
            ////ignoreList.Ignore("*.min.css", OptimizationMode.WhenDisabled);
        }

        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862

        /// <summary>
        /// Registers the bundles.
        /// </summary>
        /// <param name="bundles">The bundles.</param>
        public static void RegisterBundles([NotNull] BundleCollection bundles)
        {
            if (bundles == null)
            {
                throw new ArgumentNullException("bundles");
            }

            bundles.IgnoreList.Clear();
            AddDefaultIgnorePatterns(bundles.IgnoreList);

            bundles.Add(
                new ScriptBundle("~/Scripts/vendor").Include("~/Scripts/jquery-{version}.js")
                    .Include("~/Scripts/bootstrap.js")
                    .Include("~/Scripts/knockout-{version}.js"));

            bundles.Add(
                new StyleBundle("~/Content/durandalcss").Include("~/Content/ie10mobile.css")
                    .Include("~/Content/bootstrap.min.css")
                    .Include("~/Content/font-awesome.min.css")
                    .Include("~/Content/durandal.css")
                    .Include("~/Content/Site.css"));

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include("~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include("~/Scripts/jquery.validate*"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include("~/Scripts/modernizr-*"));

            bundles.Add(
                new ScriptBundle("~/bundles/bootstrap").Include("~/Scripts/bootstrap.js", "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include("~/Content/bootstrap.css", "~/Content/site.css"));

            // Set EnableOptimizations to false for debugging. For more information,
            // visit http://go.microsoft.com/fwlink/?LinkId=301862
            BundleTable.EnableOptimizations = true;
        }
    }
}
