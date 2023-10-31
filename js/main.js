let reports_data = null;

document.addEventListener('DOMContentLoaded', function () {
   Promise.all([d3.csv('Data/mc1-reports-data.csv')])
        .then(function (values) {
            reports_data = values[0];
            console.log(reports_data);
        });
        drawStreamgraph();
        drawBarChart();
        drawLineChart();
});

function drawStreamgraph() {
   
}

function drawBarChart() {

}

function drawLineChart() {

}
