 // @TODO: YOUR CODE HERE!
 var svgWidth = 960;
 var svgHeight = 500;
 
 var margin = {
   top: 20,
   right: 40,
   bottom: 80,
   left: 100
 };
 
 var width = svgWidth - margin.left - margin.right;
 var height = svgHeight - margin.top - margin.bottom;

 var svg = d3
   .select("#scatter")
   .append("svg")
   .attr("width", svgWidth)
   .attr("height", svgHeight);
 
 var chartGroup = svg.append("g")
   .attr("transform", `translate(${margin.left}, ${margin.top})`);

 var chosenXAxis = "healthcare";
 
 function xScale(data, chosenXAxis) {
   var xLinearScale = d3.scaleLinear()
     .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
       d3.max(data, d => d[chosenXAxis]) * 1.2
     ])
     .range([0, width]);
 
   return xLinearScale;
 
 }

 function renderCircles(circlesGroup, newXScale, chosenXaxis) {
 
   circlesGroup.transition()
     .duration(1000)
     .attr("cx", d => newXScale(d[chosenXAxis]));
 
   return circlesGroup;
 }
 
 function updateToolTip(chosenXAxis, circlesGroup) {
 
   if (chosenXAxis === "healthcare") {
     var label = "Healthcare:";
   }
   else {
     var label = "Age:";
   }
 
   var toolTip = d3.tip()
     .attr("class", "tooltip")
     .offset([80, -60])
     .html(function(d) {
       return (`${d.rockband}<br>${label} ${d[chosenXAxis]}`);
     });
 
   circlesGroup.call(toolTip);
 
 
   return circlesGroup;
 }

 d3.csv("assets/data/data.csv").then(function(data) {
    
   data.forEach(function(data) {
     data.healthcare = +data.healthcare;
     data.age = +data.age;
     data.abbr = +data.abbr;
   });

   var xLinearScale = xScale(data, chosenXAxis);

   var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(data, d => d.age)])
     .range([height, 0]);

   var bottomAxis = d3.axisBottom(xLinearScale);
   var leftAxis = d3.axisLeft(yLinearScale);

   var xAxis = chartGroup.append("g")
     .classed("x-axis", true)
     .attr("transform", `translate(0, ${height})`)
     .call(bottomAxis);

   chartGroup.append("g")
     .call(leftAxis);

   var circlesGroup = chartGroup.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", d => xLinearScale(d[chosenXAxis]))
     .attr("cy", d => yLinearScale(d.age))
     .attr("r", 10)
     .attr("fill", "blue");

    svg.selectAll("text")
     .data(data)
     .enter()
     .append("text")
     .text(function(d) {
         return data.abbr;
     })
     .attr("font_family", "sans-serif") 
     .attr("font-size", "11px")  
   var labelsGroup = chartGroup.append("g")
     .attr("transform", `translate(${width / 2}, ${height + 20})`);
 
   var healthcareLabel = labelsGroup.append("text")
     .attr("x", 0)
     .attr("y", 20)
     .attr("value", "healthcare") 
     .classed("active", true)
     .text("Healthcare");
  chartGroup.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("axis-text", true)
  .text("Age");

   var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
 
   labelsGroup.selectAll("text")
     .on("click", function() {
       var value = d3.select(this).attr("value");
       if (value !== chosenXAxis) {
 
         chosenXAxis = value;

         xLinearScale = xScale(data , chosenXAxis);
 
         xAxis = renderAxes(xLinearScale, xAxis);

         circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
 
         circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
 
         if (chosenXAxis === "num_age") {
           ageLabel
             .classed("active", true)
             .classed("inactive", false);
           healthcareLabel
             .classed("active", false)
             .classed("inactive", true);
         }
         else {
           agelabel
             .classed("active", false)
             .classed("inactive", true);
           healthcareLabel
             .classed("active", true)
             .classed("inactive", false);
         }
       }
     });
 });
 