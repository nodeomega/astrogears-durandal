//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace AstroGearsDurandal.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class Orientation
    {
        public Orientation()
        {
            this.ChartObjects = new HashSet<ChartObject>();
        }
    
        public byte OrientationId { get; set; }
        public string OrientationName { get; set; }
        public string OrientationAbbreviation { get; set; }
    
        public virtual ICollection<ChartObject> ChartObjects { get; set; }
    }
}
