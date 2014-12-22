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
    
    public partial class EnteredChart
    {
        public EnteredChart()
        {
            this.ChartAngles = new HashSet<ChartAngle>();
            this.ChartHouses = new HashSet<ChartHouse>();
            this.ChartObjects = new HashSet<ChartObject>();
            this.RelocatedChartAngles = new HashSet<RelocatedChartAngle>();
            this.RelocatedChartHouses = new HashSet<RelocatedChartHous>();
            this.RelocatedCharts = new HashSet<RelocatedChart>();
        }
    
        public int EnteredChartId { get; set; }
        public string SubjectName { get; set; }
        public string SubjectLocation { get; set; }
        public System.DateTime OriginDateTime { get; set; }
        public byte ChartTypeId { get; set; }
        public bool OriginDateTimeUnknown { get; set; }
    
        public virtual ICollection<ChartAngle> ChartAngles { get; set; }
        public virtual ICollection<ChartHouse> ChartHouses { get; set; }
        public virtual ICollection<ChartObject> ChartObjects { get; set; }
        public virtual ChartType ChartType { get; set; }
        public virtual ICollection<RelocatedChartAngle> RelocatedChartAngles { get; set; }
        public virtual ICollection<RelocatedChartHous> RelocatedChartHouses { get; set; }
        public virtual ICollection<RelocatedChart> RelocatedCharts { get; set; }
    }
}
