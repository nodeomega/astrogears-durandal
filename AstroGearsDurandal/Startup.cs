// --------------------------------------------------------------------------------------------------------------------
// <copyright file="Startup.cs" company="Jonathan Russell">
//   Copyright (c) Jonathan Russell.  All Rights Reserved.
// </copyright>
// <summary>
//   Defines the Startup type.
// </summary>
// --------------------------------------------------------------------------------------------------------------------

using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AstroGearsDurandal.Startup))]

namespace AstroGearsDurandal
{
    using System;

    using JetBrains.Annotations;

    /// <summary>
    /// The Startup class.
    /// </summary>
    public partial class Startup
    {
        /// <summary>
        /// Configurations the specified application.
        /// </summary>
        /// <param name="app">The application.</param>
        public void Configuration([NotNull] IAppBuilder app)
        {
            if (app == null)
            {
                throw new ArgumentNullException("app");
            }

            ConfigureAuth(app);
        }
    }
}
