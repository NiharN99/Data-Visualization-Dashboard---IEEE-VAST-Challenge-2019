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
            console.log(reports_data);
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
