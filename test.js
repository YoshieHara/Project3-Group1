// Define the API data URLs
const apiUrl = 'http://localhost:5000/api/v1.0/CrimesInVictoria';
const apiUrl2 = 'http://localhost:5000/api/v1.0/DrugsOffencesVictoria';

// Define variables
let data;
let lineChart;
let pieChart;
let data2;
let lineChart2;
let barChart;

// Define chart contexts
const ctxLineChart = document.getElementById('lineChartCanvas').getContext('2d');
const ctxLineChart2 = document.getElementById('lineChartCanvas2').getContext('2d');
const ctxPieChart = document.getElementById('pieChartCanvas').getContext('2d');
const ctxBarChart = document.getElementById('barChartCanvas').getContext('2d');

// Define variables to store years and counts outside the if-else blocks
let years;
let counts;
let years2;
let counts2;


// Function to create a line chart
function createLineChart(ctx, label, years, counts) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label,
                data: counts,
                borderColor: 'steelblue',
                backgroundColor: 'rgba(70, 130, 180, 0.3)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'OffenceCount'
                    }
                }
            }
        }
    });
}

// Function to create a pie chart
function createPieChart(ctx, data) {
    return new Chart(ctx, {
        type: 'pie',
        data,
        options: {
            title: {
                display: true,
                text: `Pie Chart - Offence Division Distribution for ${selectedYear}`
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const label = data.labels[tooltipItem.index];
                        return `${label}: ${dataset.data[tooltipItem.index]}`;
                    }
                }
            }
        }
    });
}

// Function to create a bar chart
function createBarChart(ctx, labels, data) {
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'Offence Count',
                data,
                backgroundColor: 'rgba(70, 130, 180, 0.7)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Offence Group'
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 15,
                        minRotation: 15
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Offence Count'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Fetch data from the first API URL and populate dropdowns
fetch(apiUrl)
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;

        // Extract unique OffenceDivisions for the dropdown,
        // use "..." to convert the Set into an array, otherwise, it may not display correctly in the dropdown.
        const uniqueOffenceDivisions = [...new Set(data.map(d => d["OffenceDivision"]))];

        // Add "Total (all divisions)" as the first option in the dropdown
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
                    if (!yearlyData[year]) {
                        yearlyData[year] = 0;
                    }
                    yearlyData[year] += count;
                });

                const years = Object.keys(yearlyData);
                const counts = Object.values(yearlyData);

                // Create a line chart with the sum data
                createLineChart(ctxLineChart, "OffenceCount", years, counts);
            } else {
                // Filter data based on the selected OffenceDivision
                const filteredData = data.filter(d => d["OffenceDivision"] === selectedOffenceDivision);

                // Extract unique Years and corresponding OffenceCount
                const yearlyData = {};
                filteredData.forEach(d => {
                    const year = d["Year"];
                    const count = d["OffenceCount"];
                    if (!yearlyData[year]) {
                        yearlyData[year] = 0;
                    }
                    yearlyData[year] += count;
                });

                const years = Object.keys(yearlyData);
                const counts = Object.values(yearlyData);

                // Create a line chart with the selected offence division data
                createLineChart(ctxLineChart, selectedOffenceDivision, years, counts);
            }
        });

        // Extract unique years for the pie chart dropdown
        const uniqueYears = [...new Set(data.map(d => d["Year"]))];

        // Populate the dropdown with unique years for the pie chart
        uniqueYears.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            selectYearPie.appendChild(option);
        });

        // Add change event listener to the year dropdown for the pie chart
        selectYearPie.addEventListener("change", function () {
            const selectedYear = this.value;
            createPieChart(ctxPieChart, pieChartData[selectedYear]);
        });

        // Initialize the line chart and pie chart with default values
        createLineChart(ctxLineChart, "OffenceCount", years, counts);
        createPieChart(ctxPieChart, pieChartData[uniqueYears[0]]);
    })
    .catch(error => {
        console.error("Error loading data from the first API URL:", error);
    });

// Fetch data from URL2 and populate dropdowns
fetch(apiUrl2)
    .then(response => response.json())
    .then(jsonData => {
        data2 = jsonData;

        // Extract unique OffenceGroups for the dropdown for URL2
        const uniqueOffenceGroups = [...new Set(data2.map(d => d["OffenceGroup"]))];

        // Clear the selectOffenceGroup2 dropdown before populating it
        selectOffenceGroup2.innerHTML = "";

        // Add "Total (all groups)" as the first option in the dropdown
        const totalOption = document.createElement("option");
        totalOption.value = "Total (all groups)";
        totalOption.textContent = "Total (all groups)";
        selectOffenceGroup2.appendChild(totalOption);

        // Populate the dropdown with OffenceGroup options for URL2
        uniqueOffenceGroups.forEach(group => {
            const option = document.createElement("option");
            option.value = group;
            option.textContent = group;
            selectOffenceGroup2.appendChild(option);
        });

        // Add change event listener to the OffenceGroup dropdown for URL2
        selectOffenceGroup2.addEventListener("change", function () {
            const selectedOffenceGroup = this.value;
            if (selectedOffenceGroup === "Total (all groups)") {
                // Calculate the sum of all offence groups for each year in URL2
                const yearlyData2 = {};
                data2.forEach(d => {
                    const year = d["Year"];
                    const count = d["OffenceCount"];
                    if (!yearlyData2[year]) {
                        yearlyData2[year] = 0;
                    }
                    yearlyData2[year] += count;
                });

                const years2 = Object.keys(yearlyData2);
                const counts2 = Object.values(yearlyData2);

                // Create a line chart for URL2 with the sum data
                createLineChart(ctxLineChart2, "OffenceCount", years2, counts2);
            } else {
                // Filter data based on the selected OffenceGroup in URL2
                const filteredData2 = data2.filter(d => d["OffenceGroup"] === selectedOffenceGroup);

                // Extract unique Years and corresponding OffenceCount for URL2
                const yearlyData2 = {};
                filteredData2.forEach(d => {
                    const year = d["Year"];
                    const count = d["OffenceCount"];
                    if (!yearlyData2[year]) {
                        yearlyData2[year] = 0;
                    }
                    yearlyData2[year] += count;
                });

                const years2 = Object.keys(yearlyData2);
                const counts2 = Object.values(yearlyData2);

                // Create a line chart for URL2 with the selected offence group data
                createLineChart(ctxLineChart2, selectedOffenceGroup, years2, counts2);
            }
        });

        // Extract unique years for the bar chart dropdown for URL2
        const uniqueYears2 = [...new Set(data2.map(d => d["Year"]))];

        // Populate the dropdown with unique years for URL2
        uniqueYears2.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            selectYearBar.appendChild(option);
        });

        // Add change event listener to the year dropdown for the bar chart
        selectYearBar.addEventListener("change", function () {
            const selectedYear = this.value;
            createBarChart(ctxBarChart, offenceGroups, countsByGroup[selectedYear]);
        });

        // Initialize the line chart with default values for URL2
        createLineChart(ctxLineChart2, "OffenceCount", years2, counts2);
        // Set the default year for the bar chart
        createBarChart(ctxBarChart, offenceGroups, countsByGroup[uniqueYears2[0]]);
    })
    .catch(error => {
        console.error("Error loading data from URL2:", error);
    });
