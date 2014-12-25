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
    using System;
    using System.Diagnostics;
    using System.IO;
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
            if (Request.QueryString["_escaped_fragment_"] == null)
            {
                return this.View();
            }

            // If the request contains the _escaped_fragment_, then we return an HTML Snapshot tp the bot
            try
            {
                // We´ll crawl the normal url without _escaped_fragment_
                var url = this.Request.Url;
                if (url == null)
                {
                    // If the URL was null somehow, just return the normal view.
                    return this.View();
                }

                ////var result = this.Crawl(url.AbsoluteUri.Replace("?_escaped_fragment_=", string.Empty));
                var result = this.Crawl(url.AbsoluteUri.Replace("?_escaped_fragment_=", "#!"));
                return this.Content(result);
            }
            catch 
            {
                // If any exception occurs then you can log the exception and return the normal View()
                // ... Wathever method to log ...
                return this.View();
            }
        }



        /// <summary>
        /// Start a new phantom js process for crawling
        /// </summary>
        /// <param name="url">The target url</param>
        /// <returns>Html string</returns>
        private string Crawl(string url)
        {
            var appRoot = Path.GetDirectoryName(AppDomain.CurrentDomain.BaseDirectory);

            var startInfo = new ProcessStartInfo
            {
                Arguments = string.Format("{0} {1}", Path.Combine(appRoot, "Scripts\\createSnapshot.js"), url),
                FileName = Path.Combine(appRoot, "phantomjs.exe"),
                UseShellExecute = false,
                CreateNoWindow = true,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                RedirectStandardInput = true,
                StandardOutputEncoding = System.Text.Encoding.UTF8
            };

            var p = new Process { StartInfo = startInfo };
            p.Start();
            var output = p.StandardOutput.ReadToEnd();
            p.WaitForExit();
            return output;
        }
    }
}