let tooltip = null;

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
             let location = 12;
            // console.log(reports_data);
            // drawStreamgraph(reports_data);
            // drawStreamgraphFiner(reports_data);

            drawStreamgraphFinal(reports_data,location);
            drawLineChart(reports_data);
            tooltip =  d3.select('#tooltip');
            drawBarChart(14);
        });
    
});

function drawStreamgraphFinal (reports_data,location) {
  drawStreamgraph(reports_data,location);

document.getElementById('timeInterval').addEventListener('change', function () {
  const selectedInterval = this.value;

  if (selectedInterval === 'minutes') {
    drawStreamgraphFiner(reports_data,location);
  } else if (selectedInterval === 'hours') {
    drawStreamgraph(reports_data,location);
  }
});

}


function drawStreamgraphFiner(reports_data,location) {
  // console.log(reports_data);

  reports_data = reports_data.filter(entry => entry.location === location);

  const groupedData = reports_data.reduce((result, item) => {
    const date = item.time.toLocaleDateString();
    const hour = item.time.getHours();
    const minutes = item.time.getMinutes();
    const currLocation = item.location;

    const validProperties = Object.entries(item)
        .filter(([key, value]) =>  key !== 'location' && key != 'time' && key!='impact');

    if (validProperties.length > 0) {
      const dateTimeKey = `${date} ${hour}:${minutes}`; 

        if (!result[dateTimeKey]) {
            result[dateTimeKey] = {
                datetime: dateTimeKey,
                buildings: { sum: 0, count: 0 },
                medical: { sum: 0, count: 0 },
                power: { sum: 0, count: 0 },
                roads_and_bridges: { sum: 0, count: 0 },
                sewer_and_water: { sum: 0, count: 0 },
                shake_intensity: { sum: 0, count: 0 },
            };
        }

        validProperties.forEach(([key, value]) => {
          if (value !== -1) {
            result[dateTimeKey][key].sum += parseFloat(value);
            result[dateTimeKey][key].count += 1;
          }
      });

      result[dateTimeKey].location = currLocation;
    }

    return result;
}, {});

for (let dateTimeKey in groupedData) {
    for (let key in groupedData[dateTimeKey]) {
        if (key !== 'location' && key !== 'impact') {
            if (groupedData[dateTimeKey][key].count > 0) {
                groupedData[dateTimeKey][key] =
                    groupedData[dateTimeKey][key].sum / groupedData[dateTimeKey][key].count;
            } else {
                groupedData[dateTimeKey][key] = 0; 
            }
        }
    }
    for (let key in groupedData[dateTimeKey]) {
        delete groupedData[dateTimeKey][key].sum;
        delete groupedData[dateTimeKey][key].count;
    }
}



    const newData = {};
    let index = 0;
for (const datetimeKey in groupedData) {
  newData[index] = {
    datetime: new Date(datetimeKey),
    buildings: groupedData[datetimeKey].buildings,
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

const keys = Object.keys(arrayResult[0]).filter(key => key !== 'datetime' && key !== 'location' );

  arrayResult.forEach(item => {
    item.datetime = item.datetime.getTime();
  });

  var margin = {top: 10, right: 30, bottom: 175, left: 50},
  width = 1200 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

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
    .attr('transform', 'translate(0,' + (height+margin.bottom-20) + ')')
    .call(xAxis);    

    svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom+8) + ")")
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
const legend = legendSvg.append("g")
.attr("transform", "translate(75, 0)");

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

function drawStreamgraph(reports_data, location) {

  reports_data = reports_data.filter(entry => entry.location === location);

  const groupedData = reports_data.reduce((result, item) => {
    const date = item.time.toLocaleDateString();
    const hour = item.time.getHours();
    const currLocation = item.location;

    const validProperties = Object.entries(item)
        .filter(([key, value]) =>  key !== 'location' && key != 'time' && key!='impact');

    if (validProperties.length > 0) {
        const dateTimeKey = `${date} ${hour}:00`;

        if (!result[dateTimeKey]) {
            result[dateTimeKey] = {
                datetime: dateTimeKey,
                buildings: { sum: 0, count: 0 },
                medical: { sum: 0, count: 0 },
                power: { sum: 0, count: 0 },
                roads_and_bridges: { sum: 0, count: 0 },
                sewer_and_water: { sum: 0, count: 0 },
                shake_intensity: { sum: 0, count: 0 },
            };
        }

        validProperties.forEach(([key, value]) => {
          if (value !== -1) {
            result[dateTimeKey][key].sum += parseFloat(value);
            result[dateTimeKey][key].count += 1;
          }
      });

      result[dateTimeKey].location = currLocation;
    }

    return result;
}, {});

for (let dateTimeKey in groupedData) {
    for (let key in groupedData[dateTimeKey]) {
        if (key !== 'location' && key !== 'impact') {
            if (groupedData[dateTimeKey][key].count > 0) {
                groupedData[dateTimeKey][key] =
                    groupedData[dateTimeKey][key].sum / groupedData[dateTimeKey][key].count;
            } else {
                groupedData[dateTimeKey][key] = 0; 
            }
        }
    }
    for (let key in groupedData[dateTimeKey]) {
        delete groupedData[dateTimeKey][key].sum;
        delete groupedData[dateTimeKey][key].count;
    }
}

    const newData = {};
    let index = 0;
for (const datetimeKey in groupedData) {
  newData[index] = {
    datetime: new Date(datetimeKey),
    buildings: groupedData[datetimeKey].buildings,
    location: groupedData[datetimeKey].location,
    medical: groupedData[datetimeKey].medical,
    power: groupedData[datetimeKey].power,
    roads_and_bridges: groupedData[datetimeKey].roads_and_bridges,
    sewer_and_water: groupedData[datetimeKey].sewer_and_water,
    shake_intensity: groupedData[datetimeKey].shake_intensity

  };
  index++;
}

const arrayResult = Object.values(newData);
// console.log(arrayResult);

const keys = Object.keys(arrayResult[0]).filter(key => key !== 'datetime' && key !== 'location' );

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
  .attr("transform", "translate(75, 0)");


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

function drawBarChart(location) {

    var averages = calculateAverages(reports_data, location);
    console.log(averages);

    const margin = { top: 20, right: 20, bottom: 50, left: 60 };
    const width = 700 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart-bar")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand()
        .domain(Object.keys(averages))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(Object.values(averages))])
        .range([height, 0]);

   
    svg.selectAll(".bar-image")
        .data(Object.entries(averages))
        .enter()
        .append("image")
        .attr("class", "bar-image")
        .attr("id", d => `${d[0]}`)
        .attr("width", 100)
        .attr("height", d => height- yScale(d[1]))
        .attr("xlink:href", d => `/Data/vectors/${d[0]}.svg`)
        .attr("transform", d => `translate(${xScale(d[0])}, ${yScale(d[1])})`)
        .attr("preserveAspectRatio", "none")
        .on('mouseover', function(event, d){
            console.log("hovered on ", d);
            showTooltip(d, event);
        })
        .on('mouseout', function(event, d){
            hideTooltip(d, event);
        });


    // ---- CODE FOR RECTANGLES IN BAR. -----
    // svg.selectAll("rect")
    //     .data(Object.entries(averages))
    //     .enter()
    //     .append("rect")
    //     .attr("x", d => xScale(d[0]))
    //     .attr("y", d => yScale(d[1]))
    //     .attr("width", xScale.bandwidth())
    //     .attr("height", d => height - yScale(d[1]))
    //     .attr("fill", "lightblue")
    //     .on('mouseover', function (event, d) {
    //         console.log("hovered on", d);
    //         var param = d[0], value = d[1];
    //         d3.select(this).attr("fill", "steelblue");
    //         d3.select("#chart-bar").style("background-image", `/Data/icons/${d[0]}.png`);
    //         //showTooltip(reports_data, location, event);
    //     })
    //     .on('mouseout', function (event, d) {
    //         // Change the fill back to steelblue on hover out
    //         d3.select(this).attr("fill", "lightblue");
    //         d3.select("#chart-bar").style("background-image", "none");
    //     });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

}

function drawLineChart() {

}


function calculateAverages(data, location) {
    const parameters = ["buildings", "medical", "power", "roads_and_bridges", "sewer_and_water", "shake_intensity"];

    const locationData = data.filter(entry => +entry.location === location);
    const averages = {};

    parameters.forEach(parameter => {
        const validValues = locationData.filter(entry => entry[parameter] !== -1.0).map(entry => parseFloat(entry[parameter]));
        const sum = validValues.reduce((acc, value) => acc + value, 0);
        const average = validValues.length > 0 ? sum / validValues.length : 0;
        averages[parameter] = average;
    });

    return averages;
}

function showTooltip(d, event) {

    var x_cood = event.pageX - 1000, y_cood = event.pageY - 300;
  
    tooltip
        .style('top', y_cood + 'px')
        .style('left', x_cood + 'px');
    

    console.log("Tooltip in action")

    tooltip.select("#tooltip-title").text(`${d[0]}`)
    tooltip.select("#tooltip-x").text(`Average value reported - ${d[1]}`)

    tooltip
        .transition()
        .duration(200) 
        .style("opacity", 0.9);
}

function hideTooltip() {
    tooltip
        .transition()
        .duration(200)
        .style("opacity", 0);
}
