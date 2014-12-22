// --------------------------------------------------------------------------------------------------------------------
// <copyright file="DurandalConfig.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell.  All Rights Reserved.
// </copyright>
// <summary>
//   Defines the DurandalConfig type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

////[assembly: WebActivator.PostApplicationStartMethod(
////    typeof(BetterDurandalTest.App_Start.DurandalConfig), "PreStart")]

namespace AstroGearsDurandal
{
    using System.Web.Optimization;

    /// <summary>
    /// Defines the DurandalConfig type.
    /// </summary>
    public static class DurandalConfig
    {
        /// <summary>
        /// Pre starts the application.
        /// </summary>
        public static void PreStart()
        {
            // Add your start logic here
            DurandalBundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}