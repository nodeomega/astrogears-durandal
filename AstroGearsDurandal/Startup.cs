using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AstroGearsDurandal.Startup))]
namespace AstroGearsDurandal
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
