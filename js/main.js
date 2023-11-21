let reports_data = null;

document.addEventListener('DOMContentLoaded', function () {

   Promise.all([d3.csv('Data/processed_data.csv')])
        .then(function (values) {
            reports_data = values[0];
            reports_data.forEach((item) => {
                for (let key in item) {
                  if (key !== 'time') {
                    item[key] = parseFloat(item[key]);
                  }
                }
                item.time = new Date(item.time);
              });

            // console.log(reports_data);
            // drawStreamgraph(reports_data);
            // drawStreamgraphFiner(reports_data);

            drawStreamgraphFinal(reports_data);
            drawBarChart(reports_data);
            drawLineChart(reports_data);
        });
    
});

function drawStreamgraphFinal (reports_data) {
  drawStreamgraph(reports_data);

document.getElementById('timeInterval').addEventListener('change', function () {
  const selectedInterval = this.value;

  if (selectedInterval === 'minutes') {
    drawStreamgraphFiner(reports_data);
  } else if (selectedInterval === 'hours') {
    drawStreamgraph(reports_data);
  }
});

}


function drawStreamgraphFiner(reports_data) {
  console.log(reports_data);

  const groupedData = reports_data.reduce((result, item) => {
        const date = item.time.toLocaleDateString();
        const hour = item.time.getHours();
        const minutes = item.time.getMinutes();
        
        const hasMinusOne = Object.values(item).some(
            (value) => value === "-1.0"
        );
    
        if (!hasMinusOne) {
            const dateTimeKey = `${date} ${hour}:${minutes}`; 
    
            if (!result[dateTimeKey]) {
                result[dateTimeKey] = {
                    datetime: dateTimeKey,
                    buildings: 0,
                    impact: 0,
                    location: 0,
                    medical: 0,
                    power: 0,
                    roads_and_bridges: 0,
                    sewer_and_water: 0,
                    shake_intensity: 0,
                    count: 0,
                };
            }
    
            result[dateTimeKey].buildings += parseFloat(item.buildings);
            result[dateTimeKey].impact += parseFloat(item.impact);
            result[dateTimeKey].location += parseFloat(item.location);
            result[dateTimeKey].medical += parseFloat(item.medical);
            result[dateTimeKey].power += parseFloat(item.power);
            result[dateTimeKey].roads_and_bridges += parseFloat(item.roads_and_bridges);
            result[dateTimeKey].sewer_and_water += parseFloat(item.sewer_and_water);
            result[dateTimeKey].shake_intensity += parseFloat(item.shake_intensity);
    
            result[dateTimeKey].count += 1;
        }
    
        return result;
    }, {});
    
    for (let dateTimeKey in groupedData) {
        for (let key in groupedData[dateTimeKey]) {
            if (key !== 'count') {
                groupedData[dateTimeKey][key] /= groupedData[dateTimeKey].count;
            }
        }
        delete groupedData[dateTimeKey].count; 
    }


    const newData = {};
    let index = 0;
for (const datetimeKey in groupedData) {
  newData[index] = {
    datetime: new Date(datetimeKey),
    buildings: groupedData[datetimeKey].buildings,
    impact: groupedData[datetimeKey].impact,
    location: groupedData[datetimeKey].location,
    medical: groupedData[datetimeKey].medical,
    power: groupedData[datetimeKey].power,
    roads_and_bridges: groupedData[datetimeKey].roads_and_bridges,
    sewer_and_water: groupedData[datetimeKey].sewer_and_water,
    shake_intensity: groupedData[datetimeKey].shake_intensity

  };
  index++;
}

// console.log(newData);

const arrayResult = Object.values(newData);

const keys = Object.keys(arrayResult[0]).filter(key => key !== 'datetime' && key !== 'location');

  arrayResult.forEach(item => {
    item.datetime = item.datetime.getTime();
  });

  var margin = {top: 10, right: 30, bottom: 150, left: 50},
  width = 1200 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

var svg = d3.select("#streamgraph");
svg.selectAll("*").remove();

svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);
// .append("g")
//   .attr("transform",
//         "translate(" + margin.left + "," + margin.top + ")");

  const stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetWiggle);
  const stackedData = stack(arrayResult);

  const padding = 30;
  const xScale = d3.scaleLinear().domain([d3.min(arrayResult, d => d.datetime), d3.max(arrayResult, d => d.datetime)]).range([padding, width + padding]);
  const yScale = d3.scaleLinear().domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))]).range([height, 0]);

  const area = d3.area()
    .x(d => xScale(d.data.datetime))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

    var Tooltip = svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

    var mouseover = function(d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".path").style("opacity", .2)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }

      var mousemove = function(d,i) {
        grp = keys[i]
        Tooltip.text(grp)
      }

      var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".path").style("opacity", 1).style("stroke", "none")
       }

  svg.selectAll('path')
    .data(stackedData)
    .enter().append('path')
    .attr("class", "path")
      .attr('d', area)
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      const xAxis = d3.axisBottom(xScale).tickValues([
        new Date('4/6/2020'),
        new Date('4/7/2020'),
        new Date('4/8/2020'),
        new Date('4/9/2020'),
        new Date('4/10/2020'),
        new Date('4/11/2020')
      ]).tickFormat(d3.timeFormat("%b %d, %Y"));

  svg.append('g')
    .attr('transform', 'translate(0,' + (height+margin.bottom-35) + ')')
    .call(xAxis);    

    svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
  .style("text-anchor", "end")
  .text("Time");

  var legendSvg = d3.select("#legend");
  legendSvg.selectAll("*").remove();

  legendSvg
  .attr("width", 300) // Adjust the width as needed
  .attr("height", 400)
  .append("g")
  .attr("transform", "translate(" + (100) + "," + 0 + ")");

// Append the legend to the new SVG
const legend = legendSvg.append("g");

keys.forEach((key, i) => {
  const legendItem = legend.append("g")
    .attr("transform", "translate(0," + (i * 25) + ")"); // Adjusted spacing

  legendItem.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d3.schemeCategory10[i]);

  legendItem.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(key);
});
}

function drawStreamgraph(reports_data) {


    const groupedData = reports_data.reduce((result, item) => {
        const date = item.time.toLocaleDateString();
        const hour = item.time.getHours();
        
        const hasMinusOne = Object.values(item).some(
            (value) => value === "-1.0"
        );
    
        if (!hasMinusOne) {
            const dateTimeKey = `${date} ${hour}:00`; 
    
            if (!result[dateTimeKey]) {
                result[dateTimeKey] = {
                    datetime: dateTimeKey,
                    buildings: 0,
                    impact: 0,
                    location: 0,
                    medical: 0,
                    power: 0,
                    roads_and_bridges: 0,
                    sewer_and_water: 0,
                    shake_intensity: 0,
                    count: 0,
                };
            }
    
            result[dateTimeKey].buildings += parseFloat(item.buildings);
            result[dateTimeKey].impact += parseFloat(item.impact);
            result[dateTimeKey].location += parseFloat(item.location);
            result[dateTimeKey].medical += parseFloat(item.medical);
            result[dateTimeKey].power += parseFloat(item.power);
            result[dateTimeKey].roads_and_bridges += parseFloat(item.roads_and_bridges);
            result[dateTimeKey].sewer_and_water += parseFloat(item.sewer_and_water);
            result[dateTimeKey].shake_intensity += parseFloat(item.shake_intensity);
    
            result[dateTimeKey].count += 1;
        }
    
        return result;
    }, {});
    
    for (let dateTimeKey in groupedData) {
        for (let key in groupedData[dateTimeKey]) {
            if (key !== 'count') {
                groupedData[dateTimeKey][key] /= groupedData[dateTimeKey].count;
            }
        }
        delete groupedData[dateTimeKey].count; 
    }
    // console.log(groupedData);


    const newData = {};
    let index = 0;
for (const datetimeKey in groupedData) {
  newData[index] = {
    datetime: new Date(datetimeKey),
    buildings: groupedData[datetimeKey].buildings,
    impact: groupedData[datetimeKey].impact,
    location: groupedData[datetimeKey].location,
    medical: groupedData[datetimeKey].medical,
    power: groupedData[datetimeKey].power,
    roads_and_bridges: groupedData[datetimeKey].roads_and_bridges,
    sewer_and_water: groupedData[datetimeKey].sewer_and_water,
    shake_intensity: groupedData[datetimeKey].shake_intensity

  };
  index++;
}

// console.log(newData);

const arrayResult = Object.values(newData);

const keys = Object.keys(arrayResult[0]).filter(key => key !== 'datetime' && key !== 'location');

  arrayResult.forEach(item => {
    item.datetime = item.datetime.getTime();
  });

  var margin = {top: 10, right: 20, bottom: 150, left: 50};
  width = 1200 - margin.left - margin.right,
  height = 420 - margin.top - margin.bottom;

  var svg = d3.select("#streamgraph");
  svg.selectAll("*").remove();


svg
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom);

  // svg.append("g")
  // .attr("transform",
  //       "translate(" + margin.left + "," + margin.top + ")");

  const stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetWiggle);
  const stackedData = stack(arrayResult);

  const padding = 30;
  const xScale = d3.scaleLinear().domain([d3.min(arrayResult, d => d.datetime), d3.max(arrayResult, d => d.datetime)]).range([padding, width + padding]);
  
  const yScale = d3.scaleLinear().domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))]).range([height, 0]);

  const area = d3.area()
    .x(d => xScale(d.data.datetime))
    .y0(d => yScale(d[0]))
    .y1(d => yScale(d[1]));

    var Tooltip = svg
    .append("text")
    .attr("x", 0)
    .attr("y", 0)
    .style("opacity", 0)
    .style("font-size", 17)

    var mouseover = function(d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".path").style("opacity", .2)
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 1)
      }

      var mousemove = function(d,i) {
        grp = keys[i]
        Tooltip.text(grp)
      }

      var mouseleave = function(d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".path").style("opacity", 1).style("stroke", "none")
       }

  svg.selectAll('path')
    .data(stackedData)
    .enter().append('path')
    .attr("class", "path")
      .attr('d', area)
      .attr('fill', (d, i) => d3.schemeCategory10[i])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

      const xAxis = d3.axisBottom(xScale).tickValues([
        new Date('4/6/2020'),
        new Date('4/7/2020'),
        new Date('4/8/2020'),
        new Date('4/9/2020'),
        new Date('4/10/2020'),
        new Date('4/11/2020')
      ]).tickFormat(d3.timeFormat("%b %d, %Y"));

  svg.append('g')
    .attr('transform', 'translate('+ 0 +',' + (height+margin.bottom-35) + ')')
    .call(xAxis);    

    svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom) + ")")
  .style("text-anchor", "end")
  .text("Time");

  var legendSvg = d3.select("#legend");
  legendSvg.selectAll("*").remove();

legendSvg
  .attr("width", 300) 
  .attr("height", 400);

  const legend = legendSvg.append("g")
  .attr("transform", "translate(100, 0)");


keys.forEach((key, i) => {
  const legendItem = legend.append("g")
    .attr("transform", "translate(0," + (i * 25) + ")"); 
  legendItem.append("rect")
    .attr("width", 18)
    .attr("height", 18)
    .attr("fill", d3.schemeCategory10[i]);

  legendItem.append("text")
    .attr("x", 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(key);
});
    
   
}

function drawBarChart() {

}

function drawLineChart() {

}


