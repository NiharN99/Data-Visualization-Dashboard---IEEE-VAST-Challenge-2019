let reports_data = null;
var width;
var chorosvg;
var chorowidth;
var choroheight;
var selectedStates = [];

document.addEventListener('DOMContentLoaded', function () {

      chorosvg = d3.select("#my_dataviz"),
      chorowidth = +chorosvg.attr("width"),
      choroheight = +chorosvg.attr("height");


    

   Promise.all([d3.json("Data/StHimark.geojson"),
                d3.csv('Data/processed_data.csv')])
        .then(function (values) {
            topo= values[0];
            reports_data = values[1];
            reports_data.forEach((item) => {
                for (let key in item) {
                  if (key !== 'time') {
                    item[key] = parseFloat(item[key]);
                  }
                }
                item.time = new Date(item.time);
              });
            console.log(reports_data);
            drawChoropleth(reports_data,topo);
            drawStreamgraph(reports_data);
            drawBarChart(reports_data);
            drawLineChart(reports_data);

        });
    
});

function drawStreamgraph(reports_data) {


    // set the dimensions and margins of the graph

   
}

function drawBarChart() {

}

function drawLineChart() {

}

function drawChoropleth (reports_data,topo){
  var colorScale = d3.scaleThreshold()
      .domain([0, 2, 4, 6, 8, 10])
      .range(d3.schemeBlues[7]);

      var startDate = new Date('4/6/2020 0:00');
      var endDate = new Date('4/11/2020 0:00');

      // Filter the CSV data based on the date range
      var filteredData = reports_data.filter(function (d) {
        var currentDate = new Date(d.time);
        return currentDate >= startDate && currentDate <= endDate;
      });

      // Group the filtered data by location and calculate the average impact
      var groupedData = d3.group(filteredData, d => d.location);
      console.log(groupedData);

      var averagedImpact = new Map();
      groupedData.forEach((value, key) => {
        var totalImpact = value.reduce((acc, cur) => acc + parseFloat(cur.impact), 0);
        var averageImpact = totalImpact / value.length;
        averagedImpact.set(key, averageImpact);
      });

      console.log(averagedImpact);


      let projection = d3.geoMercator()
      .scale(100000)
      .center(d3.geoCentroid(topo))
      .translate([(chorowidth/2),choroheight/2]);

      let path = d3.geoPath().projection(projection);
    
      let mouseOver = function(d) {
        console.log(d);

        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "black")
          .style("stroke-width","2px")
      }

      let mouseLeave = function(d) {
        d3.select(this)
        .transition()
        .duration(200)
        .style("stroke", "black")
        .style("stroke-width","0px")
      }

      let g = chorosvg.append("g")
      g.selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      .attr("d",path)
      .attr("id", function(d){return d.properties.Id})
      .attr("class", function(d){ console.log(); return "Country" })
      .style("stroke-width", "2")
      .style("stroke","#fff")
      .attr("fill", function (d) {
        console.log(d.properties.Id);
        var location = d.properties.Id; // Assuming 'Nbrhood' holds the location value
        averageImpact = averagedImpact.get(location);
        console.log(averageImpact);
        return averageImpact ? colorScale(parseFloat(averageImpact)): '#ffffff';

      })
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click", function(d) {
          console.log(d);
          const selected = d.srcElement.__data__.properties.Id;
          const name = d.srcElement.__data__.properties.Nbrhood;
          console.log(selected)
          let index = selectedStates.indexOf(name);

            if (index > -1) {
              // Remove from selected states
              selectedStates.splice(index, 1);
            } else {
              // Add to selected states
              selectedStates.push(name);
            }
          // }

          // Highlight selected states
          g.selectAll("path")
            .style("opacity", function(state) {
              if (selectedStates.length===0){
                d3.select(".Country")
                .transition()
                .duration(200)
                .style("opacity", 1);

              }
              else{
              
              return selectedStates.includes(state.properties.Nbrhood) ? 1 : 0.2;
              }
            })

      });
  
}
