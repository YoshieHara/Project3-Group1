// Define the API data URL
const url = 'http://localhost:5000/api/v1.0/CrimesInVictoria';

// Define global variables for data and charts
let data;
let lineChart;
let pieChart;
let divisions; // Move divisions to the global scope
let counts;    // Move counts to the global scope

// Function to create the Line Chart
function createLineChart(selectedDivision) {
    // Destroy the existing line chart if it exists
    if (lineChart) {
        lineChart.destroy();
    }

    // Filter data based on the selected Offence Division
    const filteredData = (selectedDivision === "all") ?
        data :
        data.filter(d => d["OffenceDivision"] === selectedDivision);

    // Extract unique years and corresponding counts
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
    counts = Object.values(yearlyData);

    // Create a line chart
    const ctxLineChart = document.getElementById('lineChartCanvas').getContext('2d');
    lineChart = new Chart(ctxLineChart, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Offence Count',
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
                        text: 'Offence Count'
                    }
                }
            }
        }
    });
}

// Function to create and update the pie chart
function createPieChart(selectedYear) {
    // Filter data based on the selected year
    const filteredData = data.filter(d => d["Year"] == selectedYear);

    // Calculate percentage of Offence Division counts
    const divisionCounts = {};
    filteredData.forEach(d => {
        const division = d["OffenceDivision"];
        if (!divisionCounts[division]) {
            divisionCounts[division] = 0;
        }
        divisionCounts[division] += d["OffenceCount"];
    });

    divisions = Object.keys(divisionCounts);
    counts = Object.values(divisionCounts); // Update counts

    // Calculate percentages and total count
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
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                ]
            }]
        },
        options: {
            title: {
                display: true,
                text: `Pie Chart - Offence Division Distribution for ${selectedYear}`
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        const dataset = data.datasets[0];
                        const currentValue = dataset.data[tooltipItem.index];
                        const percentage = ((currentValue / total) * 100).toFixed(1);
                        return `${data.labels[tooltipItem.index]}: ${percentage}% (${currentValue})`;
                    }
                }
            },
            legend: {
                display: true,
                position: 'right',
            }
        }
    });
}

// Load the data from the API using fetch
fetch(url)
    .then(response => response.json())
    .then(jsonData => {
        // Store the data globally
        data = jsonData;

        // Extract unique Offence Divisions for the line chart dropdown
        const offenceDivisions = [...new Set(data.map(d => d["OffenceDivision"]))];

        // Add an option to calculate the sum of counts for all divisions
        const selectDivision = document.getElementById("selectDivision");
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "Total (All Divisions)";
        selectDivision.appendChild(allOption);

        // Populate the line chart dropdown with Offence Division options
        offenceDivisions.forEach(division => {
            const option = document.createElement("option");
            option.value = division;
            option.textContent = division;
            selectDivision.appendChild(option);
        });

        // Extract unique years for the pie chart dropdown
        const uniqueYears = [...new Set(data.map(d => d["Year"]))];

        // Populate the pie chart dropdown with unique years
        const selectYear = document.getElementById("selectYear");
        uniqueYears.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            selectYear.appendChild(option);
        });

        // Add change event listener to the line chart division dropdown
        selectDivision.addEventListener("change", function () {
            const selectedDivision = this.value;
            createLineChart(selectedDivision);
        });

        // Add change event listener to the pie chart year dropdown
        selectYear.addEventListener("change", function () {
            const selectedYear = this.value;
            createPieChart(selectedYear);
        });

        // Initialize the line chart and pie chart with all data
        createLineChart("all");
        createPieChart(uniqueYears[0]);
    })
    .catch(error => {
        console.error("Error loading data:", error);
    });
