/*
hi all, im yoshie,
im gonna talk about how we approach to get the dashboards.
we tried d3 and plotly plot to get the charts initially, but and then decided to use chart.js library to get the visulization.
bacause of the requirement of the project.

So firstly, html, we imported the library for chart.js, and insert a link for css, and js 

in css, we set up backgroud, margin and size of the chart, font size and some other more to make our dashboard prettier.

in js code, we use fetch API method to read the API which we created by thank python flask.
and as mentioned we used chart.js method to get the result of charts.

to quickly go through our code, 
firstly we define two API and variables, including the variables we set in html elements.



to add total option in the line chart, i have used the if else conditional to get the result.


*/



// Define the API data URLs
const apiUrl = 'http://localhost:5000/api/v1.0/CrimesInVictoria';

// Define variables
let data;
let lineChart;
let pieChart;
let selectOffenceDivision = document.getElementById('selectOffenceDivision');
let selectYearPie = document.getElementById('selectYearPie');





//I use Function to declare and take selectedOffenceDivision as a parameter. 
//If the selected division is "Total (all divisions)," > it goes here to calculate the sum of count of each year
// Function to create and update the linechart
function createLineChart(selectedOffenceDivision) {
    if (selectedOffenceDivision === "Total (all divisions)") {
        // Calculate the sum of all offence divisions for each year
        const yearlyData = {};
        data.forEach(d => {
            const year = d["Year"];
            const count = d["OffenceCount"];
            if (!yearlyData[year]) {yearlyData[year] = 0;} yearlyData[year] += count;});
            // Extract unique Years and corresponding OffenceCount
            // create a empty object "yearlydata", if there is a year havent created, make that as a new property, initial 0.
            // otherwise  add the count to the exisiting year which already created.

        //do the Data Extraction After iterating through all the data entries,
        const years = Object.keys(yearlyData);
        const counts = Object.values(yearlyData);

        // Create a line chart with the sum data
        const ctxLineChart = document.getElementById('lineChartCanvas').getContext('2d');
    
        if (lineChart) {lineChart.destroy();}
        lineChart = new Chart(ctxLineChart, {
            type: 'line',
            data: {labels: years,
                datasets: [{
                    label: 'OffenceCount',
                    data: counts,
                    borderColor: 'steelblue',
                    backgroundColor: 'rgba(70, 130, 180, 0.3)',
                    borderWidth: 1}]},

            options: {scales: {
                    x: {title: {display: true,text: 'Year'}},
                    y: {title: {display: true,text: 'OffenceCount'}} }}});} 

    else {
        // Filter data based on the selected OffenceDivision
        const filteredData = data.filter(d => d["OffenceDivision"] === selectedOffenceDivision);

   
        const yearlyData = {};
        filteredData.forEach(d => {
            const year = d["Year"];
            const count = d["OffenceCount"];
            if (!yearlyData[year]) {
                yearlyData[year] = 0;
            }
            yearlyData[year] += count;
        });

        //get arrays of years and offencecounts
        const years = Object.keys(yearlyData);
        const counts = Object.values(yearlyData);

        // Create a line chart with the selected offence division data
        const ctxLineChart = document.getElementById('lineChartCanvas').getContext('2d');
        if (lineChart) {lineChart.destroy();}
        lineChart = new Chart(ctxLineChart, {
            type: 'line',
            data: {labels: years,
                datasets: [{
                    label: 'OffenceCount',
                    data: counts,
                    borderColor: 'steelblue',
                    backgroundColor: 'rgba(70, 130, 180, 0.3)',
                    borderWidth: 1}]},

            options: {scales: {
                    x: { title: {display: true,text: 'Year'}},
                    y: {title: {display: true, text: 'OffenceCount'}} }}});}}




// Function to create and update the pie chart
function createPieChart(selectedYear) {
    // Filter data based on the selected year
    const filteredData = data.filter(d => d["Year"] == selectedYear);

    // Calculate percentage of OffenceDivision counts
    const divisionCounts = {};
    filteredData.forEach(d => {
        const division = d["OffenceDivision"];
        if (!divisionCounts[division]) {
            divisionCounts[division] = 0;
        }
        divisionCounts[division] += d["OffenceCount"];
    });

    const divisions = Object.keys(divisionCounts);
    const counts = Object.values(divisionCounts);

    // Calculate percentages
    const total = counts.reduce((acc, count) => acc + count, 0);
    const percentages = counts.map(count => ((count / total) * 100).toFixed(1));

    // Create a pie chart
    const ctxPieChart = document.getElementById('pieChartCanvas').getContext('2d');
    if (pieChart) {
        pieChart.destroy();
    }
    pieChart = new Chart(ctxPieChart, {
        type: 'pie',
        data: {
            labels: divisions,
            datasets: [{
                data: counts,
                backgroundColor: [ // set 70% opacity which make it to slightly transparent
                    'rgba(255, 0, 0, 0.7)', //red
                    'rgba(0, 0, 255, 0.7)',//blue
                    'rgba(0, 255, 0, 0.7)',//yellow
                    'rgba(60, 179, 113, 0.7)',//green
                    'rgba(153, 102, 255, 0.7)',//purple
                    'rgba(255, 159, 64, 0.7)',//orange
                ]}]},
        options: {
            title: {
                display: true,
                text: `Pie Chart - Offence Division Distribution for ${selectedYear}`},
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const label = data.labels[tooltipItem.index];
                        return `${label}: ${dataset.data[tooltipItem.index]}`; // Display label and count
                    }}}}});}


// Fetch data from the first API URL and populate dropdowns
fetch(apiUrl)
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;        // Store the data 

        // Extract unique OffenceDivisions for the dropdown by ...
        const uniqueOffenceDivisions = [...new Set(data.map(d => d["OffenceDivision"]))];


        // Add "Total (all divisions)" into the dropdown
        const totalOption = document.createElement("option");
        totalOption.value = "Total (all divisions)";
        totalOption.textContent = "Total (all divisions)";
        selectOffenceDivision.appendChild(totalOption);

        // Populate the dropdown with OffenceDivision options
        uniqueOffenceDivisions.forEach(division => {
            const option = document.createElement("option");
            option.value = division;
            option.textContent = division;
            selectOffenceDivision.appendChild(option);
        });

        // Add change event listener to the OffenceDivision dropdown
        selectOffenceDivision.addEventListener("change", function () {
            const selectedOffenceDivision = this.value;
            if (selectedOffenceDivision === "Total (all divisions)") {
                // Calculate the sum of all offence divisions for each year
                const yearlyData = {};
                data.forEach(d => {
                    const year = d["Year"];
                    const count = d["OffenceCount"];
                    if (!yearlyData[year]) {yearlyData[year] = 0;}yearlyData[year] += count;});

                const years = Object.keys(yearlyData);
                const counts = Object.values(yearlyData);

                // Create a line chart with the sum data
                createLineChart("Total (all divisions)", years, counts);} 
                
            else {
                // Filter data based on the selected OffenceDivision
                const filteredData = data.filter(d => d["OffenceDivision"] === selectedOffenceDivision);

                // Extract unique Years and corresponding OffenceCount
                const yearlyData = {};
                filteredData.forEach(d => {
                    const year = d["Year"];
                    const count = d["OffenceCount"];
                    if (!yearlyData[year]) {yearlyData[year] = 0; }
                    yearlyData[year] += count;});

                const years = Object.keys(yearlyData);
                const counts = Object.values(yearlyData);

                // Create a line chart with the selected offence division data
                createLineChart(selectedOffenceDivision, years, counts);}});




                
        // Extract unique years for the pie chart dropdown
        const uniqueYears = [...new Set(data.map(d => d["Year"]))];

        // Populate the dropdown with unique years for the pie chart
        uniqueYears.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            selectYearPie.appendChild(option);});

        // Add change event listener to the year dropdown for the pie chart
        selectYearPie.addEventListener("change", function () {
            const selectedYear = this.value;
            createPieChart(selectedYear);});

        // Initialize the line chart and pie chart with default values
        createLineChart("Total (all divisions)");
        createPieChart(uniqueYears[0]); })
    .catch(error => {console.error("Error loading data from the first API URL:", error); });
