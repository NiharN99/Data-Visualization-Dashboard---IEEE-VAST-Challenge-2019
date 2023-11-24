
let tooltip = null;
let reports_data = null;
var width;
var chorosvg;
var chorowidth;
var choroheight;
var selectedStates = [];
var mainViolinDiv;
var secondViolinDiv;
var pieChartInstruct;
var pieLocation;
var violinInstruct;
var return_button;

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
            //    item.locationNum = parseInt(item.location.replace(/[^\d]/g, ''));
                for (let key in item) {
                  if (key !== 'time') {
                    item[key] = parseFloat(item[key]);
                  }
                }
                item.time = new Date(item.time);
              });
             let location = [1,2,3,4,5,6,7];
            // console.log(reports_data);
            // drawStreamgraph(reports_data);
            // drawStreamgraphFiner(reports_data);

            drawStreamgraphFinal(reports_data,location);
            drawLineChart(reports_data);
            tooltip =  d3.select('#tooltip');
            drawBarChart(14);
            console.log(reports_data);
            drawChoropleth(reports_data,topo);
            drawViolinChart(reports_data);
            drawInnovative(reports_data);

        });
    
});

function drawStreamgraphFinal (reports_data,location) {
  drawStreamgraph(reports_data,location);

// document.getElementById('timeInterval').addEventListener('change', function () {
//   const selectedInterval = this.value;

//   if (selectedInterval === 'minutes') {
//     drawStreamgraphFiner(reports_data,location);
//   } else if (selectedInterval === 'hours') {
//     drawStreamgraph(reports_data,location);
//   }
// });

}


// function drawStreamgraphFiner(reports_data,location) {

//   reports_data = reports_data.filter(entry => entry.location === location);

//   reports_data = reports_data.map(obj => {
//     let { location, impact, time, ...rest } = obj;
  
  
//     let updatedObject = Object.fromEntries(
//       Object.entries(rest).map(([key, value]) => [key, value + 1])
//     );
  
//     return {
//       location,
//       impact,
//       time,
//       ...updatedObject,
//     };
//   });
  
//   reports_data = reports_data.map(obj => {
//     let { location, impact, time, ...rest } = obj;
  
//     let updatedObject = Object.fromEntries(
//       Object.entries(rest).map(([key, value]) => {
//         return [key, (value === 0 && key !== "location" && key !== "impact" && key !== "time") ? value - 1 : value];
//       })
//     );
  
//     return {
//       location,
//       impact,
//       time,
//       ...updatedObject,
//     };
//   });

//   const groupedData = reports_data.reduce((result, item) => {
//     const date = item.time.toLocaleDateString();
//     const hour = item.time.getHours();
//     const minutes = item.time.getMinutes();
//     const currLocation = item.location;

//     const validProperties = Object.entries(item)
//         .filter(([key, value]) =>  key !== 'location' && key != 'time' && key!='impact');

//     if (validProperties.length > 0) {
//       const dateTimeKey = `${date} ${hour}:${minutes}`; 

//         if (!result[dateTimeKey]) {
//             result[dateTimeKey] = {
//                 datetime: dateTimeKey,
//                 buildings: { sum: 0, count: 0 },
//                 medical: { sum: 0, count: 0 },
//                 power: { sum: 0, count: 0 },
//                 roads_and_bridges: { sum: 0, count: 0 },
//                 sewer_and_water: { sum: 0, count: 0 },
//                 shake_intensity: { sum: 0, count: 0 },
//             };
//         }

//         validProperties.forEach(([key, value]) => {
//           if (value !== -1) {
//             result[dateTimeKey][key].sum += parseFloat(value);
//             result[dateTimeKey][key].count += 1;
//           }
//       });

//       result[dateTimeKey].location = currLocation;
//     }

//     return result;
// }, {});

// for (let dateTimeKey in groupedData) {
//     for (let key in groupedData[dateTimeKey]) {
//         if (key !== 'location' && key !== 'impact') {
//             if (groupedData[dateTimeKey][key].count > 0) {
//                 groupedData[dateTimeKey][key] =
//                     groupedData[dateTimeKey][key].sum / groupedData[dateTimeKey][key].count;
//             } else {
//                 groupedData[dateTimeKey][key] = 0; 
//             }
//         }
//     }
//     for (let key in groupedData[dateTimeKey]) {
//         delete groupedData[dateTimeKey][key].sum;
//         delete groupedData[dateTimeKey][key].count;
//     }
// }



//     const newData = {};
//     let index = 0;
// for (const datetimeKey in groupedData) {
//   newData[index] = {
//     datetime: new Date(datetimeKey),
//     buildings: groupedData[datetimeKey].buildings,
//     location: groupedData[datetimeKey].location,
//     medical: groupedData[datetimeKey].medical,
//     power: groupedData[datetimeKey].power,
//     roads_and_bridges: groupedData[datetimeKey].roads_and_bridges,
//     sewer_and_water: groupedData[datetimeKey].sewer_and_water,
//     shake_intensity: groupedData[datetimeKey].shake_intensity

//   };
//   index++;
// }

// // console.log(newData);

// const arrayResult = Object.values(newData);

// const keys = Object.keys(arrayResult[0]).filter(key => key !== 'datetime' && key !== 'location' );

//   arrayResult.forEach(item => {
//     item.datetime = item.datetime.getTime();
//   });

//   var margin = {top: 10, right: 30, bottom: 175, left: 50},
//   width = 1200 - margin.left - margin.right,
//   height = 400 - margin.top - margin.bottom;

// var svg = d3.select("#streamgraph");
// svg.selectAll("*").remove();

// svg
//   .attr("width", width + margin.left + margin.right)
//   .attr("height", height + margin.top + margin.bottom);
// // .append("g")
// //   .attr("transform",
// //         "translate(" + margin.left + "," + margin.top + ")");

//   const stack = d3.stack().keys(keys).order(d3.stackOrderNone).offset(d3.stackOffsetWiggle);
//   const stackedData = stack(arrayResult);

//   const padding = 30;
//   const xScale = d3.scaleLinear().domain([d3.min(arrayResult, d => d.datetime), d3.max(arrayResult, d => d.datetime)]).range([padding, width + padding]);
//   const yScale = d3.scaleLinear().domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))]).range([height, 0]);

//   const area = d3.area()
//     .x(d => xScale(d.data.datetime))
//     .y0(d => yScale(d[0]))
//     .y1(d => yScale(d[1]));

//     var Tooltip = svg
//     .append("text")
//     .attr("x", 0)
//     .attr("y", 0)
//     .style("opacity", 0)
//     .style("font-size", 17)

//     var mouseover = function(d) {
//         Tooltip.style("opacity", 1)
//         d3.selectAll(".path").style("opacity", .2)
//         d3.select(this)
//           .style("stroke", "black")
//           .style("opacity", 1)
//       }

//       var mousemove = function(d,i) {
//         grp = keys[i]
//         Tooltip.text(grp)
//       }

//       var mouseleave = function(d) {
//         Tooltip.style("opacity", 0)
//         d3.selectAll(".path").style("opacity", 1).style("stroke", "none")
//        }

//   svg.selectAll('path')
//     .data(stackedData)
//     .enter().append('path')
//     .attr("class", "path")
//       .attr('d', area)
//       .attr('fill', (d, i) => d3.schemeCategory10[i])
//       .on("mouseover", mouseover)
//       .on("mousemove", mousemove)
//       .on("mouseleave", mouseleave);

//       const xAxis = d3.axisBottom(xScale).tickValues([
//         new Date('4/6/2020'),
//         new Date('4/7/2020'),
//         new Date('4/8/2020'),
//         new Date('4/9/2020'),
//         new Date('4/10/2020'),
//         new Date('4/11/2020')
//       ]).tickFormat(d3.timeFormat("%b %d, %Y"));

//   svg.append('g')
//     .attr('transform', 'translate(0,' + (height+margin.bottom-20) + ')')
//     .call(xAxis);    

//     svg.append("text")
//   .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom+8) + ")")
//   .style("text-anchor", "end")
//   .text("Time");

//   var legendSvg = d3.select("#legend");
//   legendSvg.selectAll("*").remove();

//   legendSvg
//   .attr("width", 300) // Adjust the width as needed
//   .attr("height", 400)
//   .append("g")
//   .attr("transform", "translate(" + (100) + "," + 0 + ")");

// // Append the legend to the new SVG
// const legend = legendSvg.append("g")
// .attr("transform", "translate(75, 0)");

// keys.forEach((key, i) => {
//   const legendItem = legend.append("g")
//     .attr("transform", "translate(0," + (i * 25) + ")"); // Adjusted spacing

//   legendItem.append("rect")
//     .attr("width", 18)
//     .attr("height", 18)
//     .attr("fill", d3.schemeCategory10[i]);

//   legendItem.append("text")
//     .attr("x", 24)
//     .attr("y", 9)
//     .attr("dy", ".35em")
//     .style("text-anchor", "start")
//     .text(key);
// });
// }

function drawStreamgraph(reports_data, location) {

  reports_data = reports_data.filter(entry => location.includes(entry.location));

 reports_data = reports_data.map(obj => {
  let { location, impact, time, ...rest } = obj;


  let updatedObject = Object.fromEntries(
    Object.entries(rest).map(([key, value]) => [key, value + 1])
  );

  return {
    location,
    impact,
    time,
    ...updatedObject,
  };
});

reports_data = reports_data.map(obj => {
  let { location, impact, time, ...rest } = obj;

  let updatedObject = Object.fromEntries(
    Object.entries(rest).map(([key, value]) => {
      return [key, (value === 0 && key !== "location" && key !== "impact" && key !== "time") ? value - 1 : value];
    })
  );

  return {
    location,
    impact,
    time,
    ...updatedObject,
  };
});



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

  var margin = {top: 10, right: 20, bottom: 175, left: 50};
  width = 1200 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

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
        // new Date('4/6/2020'),
        new Date('4/7/2020'),
        new Date('4/8/2020'),
        new Date('4/9/2020'),
        new Date('4/10/2020'),
        // new Date('4/11/2020')
      ]).tickFormat(d3.timeFormat("%b %d, %Y"));

  svg.append('g')
    .attr('transform', 'translate('+ 0 +',' + (height+margin.bottom-23) + ')')
    .call(xAxis);    

    svg.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom + 9) + ")")
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
      // console.log(groupedData);

      var averagedImpact = new Map();
      groupedData.forEach((value, key) => {
        var totalImpact = value.reduce((acc, cur) => acc + parseFloat(cur.impact), 0);
        var averageImpact = totalImpact / value.length;
        averagedImpact.set(key, averageImpact);
      });

      // console.log(averagedImpact);


      let projection = d3.geoMercator()
      .scale(100000)
      .center(d3.geoCentroid(topo))
      .translate([(chorowidth/2),choroheight/2]);

      let path = d3.geoPath().projection(projection);
    
      let mouseOver = function(d) {
        // console.log(d);

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
        // console.log(d.properties.Id);
        var location = d.properties.Id; // Assuming 'Nbrhood' holds the location value
        averageImpact = averagedImpact.get(location);
        // console.log(averageImpact);
        return averageImpact ? colorScale(parseFloat(averageImpact)): '#ffffff';

      })
      .on("mouseover", mouseOver )
      .on("mouseleave", mouseLeave )
      .on("click", function(d) {
          // console.log(d);
          const selected = d.srcElement.__data__.properties.Id;
          const name = d.srcElement.__data__.properties.Nbrhood;
          // console.log(selected)
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

function drawInnovative(reports_data)
{
  var startDate = new Date('4/6/2020 0:00');
  var endDate = new Date('4/11/2020 0:00');

  // Filter the CSV data based on the date range
  var filteredData = reports_data.filter(function (d) {
    var currentDate = new Date(d.time);
    return currentDate >= startDate && currentDate <= endDate;
  });
  console.log(filteredData);

  const filteredByDate = filteredData.filter((record) => {
    const recordDate = new Date(record.time);
    return recordDate >= startDate && recordDate < endDate;
  });
  
  // Function to filter data for a specific category within a time range
  const filterDataByCategoryAndTimeRange = (data, category, startTime, endTime) => {
    const filteredByCategory = data.filter((record) => {
      const recordDate = new Date(record.time);
      return recordDate >= startTime && recordDate <= endTime && parseFloat(record[category]) !== -1.0;
    });
    return filteredByCategory;
  };
  
  // Example: Filter 'sewer_and_water' category data within specified time ranges
  const startTimeRange1 = new Date(startDate);
  const endTimeRange1 = new Date(startDate);
  const startTimeRange2 = new Date(endDate);
  const endTimeRange2 = new Date(endDate);
  
  startTimeRange1.setHours(startTimeRange1.getHours() ); // Start time + 1 hour
  endTimeRange1.setHours(endTimeRange1.getHours() + 1); // End time - 1 hour

  startTimeRange2.setHours(startTimeRange2.getHours() - 1); // Start time + 1 hour
  endTimeRange2.setHours(endTimeRange2.getHours()); // End time - 1 hour
  
  const filteredSewerAndWaterData1 = filterDataByCategoryAndTimeRange(filteredByDate, 'sewer_and_water', startTimeRange1, endTimeRange1);
  const filteredSewerAndWaterData2 = filterDataByCategoryAndTimeRange(filteredByDate, 'sewer_and_water', startTimeRange2, endTimeRange2);
  
  // Use filteredSewerAndWaterData for further processing/display
  // console.log(filteredSewerAndWaterData1);
  // console.log(filteredSewerAndWaterData2);


  const aggregateDataByRanges = (data, category) => {
    const ranges = {
      'Low': 0,
      'Medium': 0,
      'High': 0,
      'Very High': 0        };
  
    data.forEach(record => {
      const value = parseFloat(record[category]);
      if (value >= 0 && value <= 2) {
        ranges['Low'] +=1;
      } else if (value >= 3 && value <= 5) {
        ranges['Medium'] +=1;
      } else if (value >= 6 && value <= 8) {
        ranges['High'] +=1;
      } else if (value >= 9 && value <= 10) {
        ranges['Very High'] +=1;
      }
    });
  
    return ranges;
  };
  
  // Filter data for the 'sewer_and_water' category
  // const filteredSewerAndWaterData_1 = filterDataByCategory(filteredSewerAndWaterData1, 'sewer_and_water');
  // const filteredSewerAndWaterData_2 = filterDataByCategory(filteredSewerAndWaterData2, 'sewer_and_water');
  // // Aggregate data by value ranges for the 'sewer_and_water' category
  const aggregatedData1 = aggregateDataByRanges(filteredSewerAndWaterData1, 'sewer_and_water');
  const aggregatedData2 = aggregateDataByRanges(filteredSewerAndWaterData2, 'sewer_and_water');
  
  // Use aggregatedData for further processing/display
  console.log(aggregatedData1);
  console.log(aggregatedData2);

  const keys = Object.keys(aggregatedData1);



  // Create a merged object in the desired format
  const mergedObject = [];
  console.log(keys);
  keys.forEach((key) => {
    mergedObject.push({"startData": aggregatedData1[key],"endData":aggregatedData2[key] , "bin": key });
    // mergedObject[startTimeRange1] = mergedObject[startTimeRange1] || {};

  });

  // Display the merged object
  console.log(mergedObject);

  const width = 600;
  const height = 400;
  const marginTop = 40;
  const marginRight = 50;
  const marginBottom = 10;
  const marginLeft = 50;
  const padding = 3;
  
  // Prepare the positional scales.
  const x = d3.scalePoint()
    .domain([0, 1])
    .range([marginLeft, width - marginRight])
    .padding(0.5);

  const y = d3.scaleLinear()
    .domain(d3.extent(mergedObject.flatMap(d => [d["startData"], d["endData"]])))
    .range([height - marginBottom, marginTop]);

  const line = d3.line()
    .x((d, i) => x(i))
    .y(y);

  const formatNumber = y.tickFormat(100);

  // Create the SVG container.
  const svg = d3.select("#innovative")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

  // Append the x axis.
  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll("g")
    .data([0, 1])
    .join("g")
      .attr("transform", (i) => `translate(${x(i)},20)`)
      .call(g => g.append("text").text((i) => i ? "endDate" : "startDate"))
      .call(g => g.append("line").attr("y1", 3).attr("y2", 9).attr("stroke", "currentColor"));

  // Create a line for each country.
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
    .selectAll("path")
    .data(mergedObject)
    .join("path")
      .attr("d", (d) => line([d["startData"], d["endData"]]));

  // Create a group of labels for each year.
  svg.append("g")
    .selectAll("g")
    .data([0, 1])
    .join("g")
      .attr("transform", (i) => `translate(${x(i) + (i ? padding : -padding)},0)`)
      .attr("text-anchor", (i) => i ? "start" : "end")
    .selectAll("text")
    .data((i) => d3.zip(
      mergedObject.map(i ? (d) => `${formatNumber(d["endData"])} ${d.bin}` : (d) => `${d.bin} ${formatNumber(d["startData"])}`),
      dodge(mergedObject.map(d => y(d[i ? "endData" : "startData"])))))
    .join("text")
      .attr("y", ([, y]) => y)
      .attr("dy", "0.35em")
      .text(([text]) => text);
}

function dodge(positions, separation = 10, maxiter = 10, maxerror = 1e-1) {
  positions = Array.from(positions);
  let n = positions.length;
  if (!positions.every(isFinite)) throw new Error("invalid position");
  if (!(n > 1)) return positions;
  let index = d3.range(positions.length);
  for (let iter = 0; iter < maxiter; ++iter) {
    index.sort((i, j) => d3.ascending(positions[i], positions[j]));
    let error = 0;
    for (let i = 1; i < n; ++i) {
      let delta = positions[index[i]] - positions[index[i - 1]];
      if (delta < separation) {
        delta = (separation - delta) / 2;
        error = Math.max(error, delta);
        positions[index[i - 1]] -= delta;
        positions[index[i]] += delta;
      }
    }
    if (error < maxerror) break;
  }
  return positions;
}

function drawViolinChart(){

    var startDate = new Date('4/6/2020 0:00');
    var endDate = new Date('4/11/2020 1:10');

    data = reports_data.filter(function (d) {
        var currentDate = new Date(d.time);
        return currentDate >= startDate && currentDate <= endDate;
    });

   mainViolinDiv=document.getElementById("mainViolinDiv");
   secondViolinDiv=document.getElementById("secondViolinDiv");

   mainViolinDiv.style.display="block";
   secondViolinDiv.style.display="none";

   pieLocation=d3.select("#pieLocation");
   pieLocation.text(" ");

   violinInstruct=d3.select("#violinInstruct");
   violinInstruct.text("Distribution of damage across locations");

   pieChartInstruct=document.getElementById("pieChartInstruct");
   pieChartInstruct.style.display="block";
   d3.select(".pie-chart").style("display", "none");

   return_button=document.getElementById("return_button");
   return_button.style.display="none";

    //console.log(i++);

    // set the dimensions and margins of the graph
    var margin = {top: 10, right: 10, bottom: 30, left: 10},
    width = 760 - margin.left - margin.right,
    height = 490 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#mainViolin")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("class", "first_violin")
        .style('font-family', 'sans-serif')
    //    .style("display", "block")
       .style('font-size', 12)
        .append("g")
        .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")")
    ; 

   const x = d3.scaleBand()
     .domain(data.map(d => d.location).filter((v, i, a) => a.indexOf(v) === i))
     .range([margin.left, width - margin.right])
     .padding(0.05);
   
   const y = d3.scaleLinear()
     .domain([0, d3.max(data, d => +d.shake_intensity)]).nice()
     .range([height - margin.bottom, margin.top]);
   
   const xAxis = g => g
     .attr('transform', `translate(0, ${height - margin.bottom})`)
     .call(d3.axisBottom(x).tickSizeOuter(0));
   
   const yAxis = g => g
     .attr('transform', `translate(${margin.left}, 0)`)
     .call(d3.axisLeft(y))
     .call(g => g.select('.domain').remove());
   
   function kde(kernel, thds) {
     return V => thds.map(t => [t, d3.mean(V, d => kernel(t - d))])
   }
   
   function epanechnikov(bandwidth) {
     return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
   }
   
   const bandwidth = 0.3;
   const thds = y.ticks(40);
   const density = kde(epanechnikov(bandwidth), thds);
   
   const violins = d3.rollup(data, v => density(v.map(g => +g.shake_intensity)), d => d.location);
   
   var allNum = [];
   [...violins.values()].forEach((d,i) => allNum = allNum.concat([...violins.values()][i].map(d => d[1])))
   const xNum  = d3.scaleLinear()
     .domain([-d3.max(allNum), d3.max(allNum)])
     .range([0, x.bandwidth()]);
   
   const area = d3.area()
     .x0(d => xNum(-d[1]))
     .x1(d => xNum(d[1]))
     .y(d => y(d[0]))
     .curve(d3.curveNatural);
   
   svg.append('g')
     .call(xAxis);
   
   svg.append('g')
     .call(yAxis);
   
   svg.append('g')
     .selectAll('g')
     .data([...violins])
     .join('g')
       .attr('transform', d => `translate(${x(d[0])}, 0)`)
     .append('path')
       .datum(d => d[1])
       .style('stroke', 'none')
       .style('fill', '#69b3a2')
       .attr('d', area)
    ;

    svg.selectAll('g')
        .select('path')
       .on('click', function(event, d) {
           const selectedLocation = d[0];
           console.log("selected Location : ", selectedLocation);

           filteredData = data.filter(l => l.location===selectedLocation);
            console.log("filtered data : ", filteredData);
           drawSecondaryViolinChart(filteredData, selectedLocation);
           drawPieChart(selectedLocation);
       });
    ;
   
   //return svg.node()
 
}

function drawSecondaryViolinChart(data, targetLocation){

    console.log("entered secondary");
    let reshapedData = [];

    data.forEach(d => {
        // Reshape data into long format
        reshapedData.push({category: 'buildings', shake_intensity: d.buildings});
        reshapedData.push({category: 'medical', shake_intensity: d.medical});
        reshapedData.push({category: 'power', shake_intensity: d.power});
        reshapedData.push({category: 'roads_and_bridges', shake_intensity: d.roads_and_bridges});
        reshapedData.push({category: 'sewer_and_water', shake_intensity: d.sewer_and_water});
    });

    
   mainViolinDiv.style.display="none";
   secondViolinDiv.style.display="block";

   const labelMapping = {
        'buildings': 'Buildings',
        'medical': 'Medical',
        'power': 'Power',
        'roads_and_bridges': 'Roads and Bridges',
        'sewer_and_water': 'Sewer and Water'
    };

     // set the dimensions and margins of the graph
     var margin = {top: 10, right: 10, bottom: 30, left: 10},
     width = 760 - margin.left - margin.right,
     height = 490 - margin.top - margin.bottom;

      // append the svg object to the body of the page
      var svg_new = d3.select("#secondViolin")
          .append("svg")
          .attr("width", width)
          .attr("height", height)
          .attr("class", "second_violin")
          .style('font-family', 'sans-serif')
         .style('font-size', 12)
        // .style("display", "block")
          .append("g")
          .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")")
      ; 
    
     const x = d3.scaleBand()
       .domain(reshapedData.map(d => d.category))
       .range([margin.left, width - margin.right])
       .padding(0.05);
     
     const y = d3.scaleLinear()
       .domain([0, d3.max(reshapedData, d => +d.shake_intensity)]).nice()
       .range([height - margin.bottom, margin.top]);
     
     const xAxis = g => g
       .attr('transform', `translate(0, ${height - margin.bottom})`)
       .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d => labelMapping[d] || d));
     
     const yAxis = g => g
       .attr('transform', `translate(${margin.left}, 0)`)
       .call(d3.axisLeft(y))
       .call(g => g.select('.domain').remove());

    
    // Function to calculate density
    function kde(kernel, thds) {
     //   return thresholds.map(t => [t, d3.mean(reshapedData, d => kernel(t - d))]);

        return V => thds.map(t => [t, d3.mean(V, d => kernel(t - d))])
    }
    
    // Kernel function for density estimation
    function epanechnikov(bandwidth) {
        return x => Math.abs(x /= bandwidth) <= 1 ? 0.75 * (1 - x * x) / bandwidth : 0;
    }
    
    // Calculate the violins
    let bandwidth = 0.3;  // Adjust bandwidth as needed
    let thresholds = d3.scaleLinear().domain([0, d3.max(reshapedData, d => +d.shake_intensity)]).ticks(40);
    let density = kde(epanechnikov(bandwidth), thresholds);
    
    let violins = d3.rollup(reshapedData, 
        v => density(v.map(g => +g.shake_intensity)), 
        d => d.category
    );
     
     var allNum = [];
     [...violins.values()].forEach((d,i) => allNum = allNum.concat([...violins.values()][i].map(d => d[1])))
     const xNum  = d3.scaleLinear()
       .domain([-d3.max(allNum), d3.max(allNum)])
       .range([0, x.bandwidth()]);
     
     const area = d3.area()
       .x0(d => xNum(-d[1]))
       .x1(d => xNum(d[1]))
       .y(d => y(d[0]))
       .curve(d3.curveNatural);
     
     svg_new.append('g')
        .call(xAxis);
     
     svg_new.append('g')
       .call(yAxis);
     
     svg_new.append('g')
       .selectAll('g')
       .data([...violins])
       .join('g')
         .attr('transform', d => `translate(${x(d[0])}, 0)`)
       .append('path')
         .datum(d => d[1])
         .style('stroke', 'none')
         .style('fill', '#69b3a2')
         .attr('d', area)
      ;

      return_button = document.getElementById("return_button");
      return_button.style.display='block';

    return_button.onclick=function(){drawViolinChart();};
}

function drawPieChart(targetLocation) {
    //console.log("Drawing Pie Chart");

    // Date filter
    var startDate = new Date('4/6/2020 0:00');
    var endDate = new Date('4/11/2020 1:10');

    // Log start and end dates
    //console.log("Start Date:", startDate);
    //console.log("End Date:", endDate);

    // Location filter (example: filter for a specific location)
  //  var targetLocation = "18";
    
    // Filter the CSV data based on both time and location
    var filteredData = reports_data.filter(function (d) {
        var currentDate = new Date(d.time);
        return currentDate >= startDate && currentDate <= endDate && d.location === targetLocation;
    });

    // Log the filtered data
    console.log("Filtered Data:", filteredData);

    // Group the filtered data by location and calculate the average impact
    var groupedData = d3.group(filteredData, d => d.location);

    // Log the grouped data
    //console.log("Grouped Data:", groupedData);

    // Rest of the drawPieChart function...

    function getPercentageDataForCategory(category) {
        const categoryData = filteredData.map(d => ({
            value: parseFloat(d[category]),
            label: category,
        }));

        //console.log("Category Data:", categoryData);

        const countMinusOne = categoryData.filter(d => d.value === -1.0).length;
        const countOther = categoryData.length - countMinusOne;

         // console.log("Count of -1.0:", countMinusOne);
         //console.log("Count of Other:", countOther);

         const percentageMinusOne = (countMinusOne / categoryData.length) * 100;
         const percentageOther = (countOther / categoryData.length) * 100;

         //console.log("Percentage of -1.0:", percentageMinusOne);
         //console.log("Percentage of Other:", percentageOther);

         return [
            { label: "-1.0", value: percentageMinusOne },
            { label: "Other", value: percentageOther },
        ];
    }

    const categories = ["sewer_and_water", "power", "roads_and_bridges", "medical", "buildings", "shake_intensity"];

    // Select the existing SVG container with the ID "pieChart"
    const svg = d3.select("#pieChart").attr("class", "pie-chart");

    // Clear any existing content inside the SVG container
    svg.selectAll("*").remove();

    const width = 55;
    const height = 80;

    const totalWidth = categories.length * (width + 20) + 90;

    svg.attr("width", totalWidth);

    const coordinates = [
        { x: 90, y: 70 },
        { x: 270, y: 70 },
        { x: 450, y: 70 },
        { x: 90, y: 240 },
        { x: 270, y: 240 },
        { x: 450, y: 240 },
    ];

    const colorScale = d3.scaleOrdinal()
        .domain(["-1.0", "Other"])
        .range(["brown", "gold"]);

    categories.forEach((category, index) => {
        const pieData = getPercentageDataForCategory(category);
       // console.log(pieData);

        const chartGroup = svg.append("g")
            .attr("transform", `translate(${coordinates[index].x}, ${coordinates[index].y})`);

        const pie = d3.pie().value(function (d) { return d.value; });
        const data_ready = pie(pieData);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(Math.min(width, height) / 2 + 30); // Set the outer radius relative to the SVG size

        const arcs = chartGroup.selectAll("arc")
            .data(data_ready)
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", (d, i) => colorScale(d.data.label));

        // Display category name below each pie
        chartGroup.append("text")
            .attr("x", 0)
            .attr("y", Math.min(width, height) / 2 + 50) // Adjust the vertical position
            .attr("text-anchor", "middle")
            .style("font-size", "13px") // Adjust the font size
            .style("font-weight", "bold")  // Set text to bold
            .style("font-family", "Arial, sans-serif")  // Change font family
            .text(`${category}: ${pieData[0].value.toFixed(2)}%`);
    });

    // Add legend
    const legendGroup = svg.append("g")
        .attr("transform", "translate(200,420)");

    legendGroup.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 10)
        .style("fill", "brown");

    legendGroup.append("text")
        .attr("x", 25)
        .attr("y", 13)
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .style("font-family", "Arial, sans-serif")
        .text("% Missing Data");

    const legendGroup2 = svg.append("g")
        .attr("transform", "translate(200,390)");

    legendGroup2.append("circle")
        .attr("cx", 10)
        .attr("cy", 10)
        .attr("r", 10)
        .style("fill", "gold");

    legendGroup2.append("text")
        .attr("x", 25)
        .attr("y", 13)
        .style("font-size", "15px")
        .style("font-weight", "bold")
        .style("font-family", "Arial, sans-serif")
        .text("% Available Data");

    //console.log("Pie Chart drawing completed");
    pieLocation.text("'"+targetLocation+"'");
    violinInstruct.text("Distribution of damage across utilities for Location '"+targetLocation+"'");

    pieChartInstruct=document.getElementById("pieChartInstruct");
    pieChartInstruct.style.display="none";
    d3.select(".pie-chart").style("display", "block");
}
