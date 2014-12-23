﻿//------------------------------------------------------------------------------
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
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Data.Entity.Core.Objects;
    using System.Linq;
    
    public partial class AstroGearsEntities : DbContext
    {
        public AstroGearsEntities()
            : base("name=AstroGearsEntities")
        {
        }
    
        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            throw new UnintentionalCodeFirstException();
        }
    
        public virtual DbSet<Aspect> Aspects { get; set; }
        public virtual DbSet<CelestialObject> CelestialObjects { get; set; }
        public virtual DbSet<CelestialObjectType> CelestialObjectTypes { get; set; }
        public virtual DbSet<ChartAngle> ChartAngles { get; set; }
        public virtual DbSet<ChartHouse> ChartHouses { get; set; }
        public virtual DbSet<ChartObject> ChartObjects { get; set; }
        public virtual DbSet<ChartType> ChartTypes { get; set; }
        public virtual DbSet<Element> Elements { get; set; }
        public virtual DbSet<EnteredChart> EnteredCharts { get; set; }
        public virtual DbSet<HouseAngle> HouseAngles { get; set; }
        public virtual DbSet<HouseCusp> HouseCusps { get; set; }
        public virtual DbSet<HouseSystem> HouseSystems { get; set; }
        public virtual DbSet<Orientation> Orientations { get; set; }
        public virtual DbSet<Quality> Qualities { get; set; }
        public virtual DbSet<RelocatedChartAngle> RelocatedChartAngles { get; set; }
        public virtual DbSet<RelocatedChartHous> RelocatedChartHouses { get; set; }
        public virtual DbSet<RelocatedChart> RelocatedCharts { get; set; }
        public virtual DbSet<Sign> Signs { get; set; }
        public virtual DbSet<AspectInterpretationType> AspectInterpretationTypes { get; set; }
        public virtual DbSet<AspectInterpretation> AspectInterpretations { get; set; }
    
        [DbFunction("AstroGearsEntities", "SecondaryObjectsExistInEnteredChart")]
        public virtual IQueryable<SecondaryObjectsExistInEnteredChart_Result> SecondaryObjectsExistInEnteredChart(Nullable<int> enteredChartId)
        {
            var enteredChartIdParameter = enteredChartId.HasValue ?
                new ObjectParameter("EnteredChartId", enteredChartId) :
                new ObjectParameter("EnteredChartId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<SecondaryObjectsExistInEnteredChart_Result>("[AstroGearsEntities].[SecondaryObjectsExistInEnteredChart](@EnteredChartId)", enteredChartIdParameter);
        }
    
        [DbFunction("AstroGearsEntities", "PlanetsExistInEnteredChart")]
        public virtual IQueryable<PlanetsExistInEnteredChart_Result> PlanetsExistInEnteredChart(Nullable<int> enteredChartId)
        {
            var enteredChartIdParameter = enteredChartId.HasValue ?
                new ObjectParameter("EnteredChartId", enteredChartId) :
                new ObjectParameter("EnteredChartId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<PlanetsExistInEnteredChart_Result>("[AstroGearsEntities].[PlanetsExistInEnteredChart](@EnteredChartId)", enteredChartIdParameter);
        }
    
        [DbFunction("AstroGearsEntities", "AutoCompleteForEnteredChart")]
        public virtual IQueryable<AutoCompleteForEnteredChart_Result> AutoCompleteForEnteredChart(string enteredName, Nullable<int> enteredChartId)
        {
            var enteredNameParameter = enteredName != null ?
                new ObjectParameter("EnteredName", enteredName) :
                new ObjectParameter("EnteredName", typeof(string));
    
            var enteredChartIdParameter = enteredChartId.HasValue ?
                new ObjectParameter("EnteredChartId", enteredChartId) :
                new ObjectParameter("EnteredChartId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<AutoCompleteForEnteredChart_Result>("[AstroGearsEntities].[AutoCompleteForEnteredChart](@EnteredName, @EnteredChartId)", enteredNameParameter, enteredChartIdParameter);
        }
    
        [DbFunction("AstroGearsEntities", "PrimariesAndSecondariesExistInEnteredChart")]
        public virtual IQueryable<PrimariesAndSecondariesExistInEnteredChart_Result> PrimariesAndSecondariesExistInEnteredChart(Nullable<int> enteredChartId)
        {
            var enteredChartIdParameter = enteredChartId.HasValue ?
                new ObjectParameter("EnteredChartId", enteredChartId) :
                new ObjectParameter("EnteredChartId", typeof(int));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<PrimariesAndSecondariesExistInEnteredChart_Result>("[AstroGearsEntities].[PrimariesAndSecondariesExistInEnteredChart](@EnteredChartId)", enteredChartIdParameter);
        }
    
        [DbFunction("AstroGearsEntities", "AutoCompleteForAspectInterpretationEntry")]
        public virtual IQueryable<AutoCompleteForAspectInterpretationEntry_Result> AutoCompleteForAspectInterpretationEntry(string enteredName)
        {
            var enteredNameParameter = enteredName != null ?
                new ObjectParameter("EnteredName", enteredName) :
                new ObjectParameter("EnteredName", typeof(string));
    
            return ((IObjectContextAdapter)this).ObjectContext.CreateQuery<AutoCompleteForAspectInterpretationEntry_Result>("[AstroGearsEntities].[AutoCompleteForAspectInterpretationEntry](@EnteredName)", enteredNameParameter);
        }
    }
}