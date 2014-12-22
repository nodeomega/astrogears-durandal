// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DurandalBundleConfig.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell.  All Rights Reserved.
// </copyright>
// <summary>
//   Defines the DurandalBundleConfig type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

namespace AstroGearsDurandal
{
    using System;
    using System.Web.Optimization;

    using JetBrains.Annotations;

    /// <summary>
    /// The DurandalBundleConfig
    /// </summary>
    public class DurandalBundleConfig
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
        }
    }
}