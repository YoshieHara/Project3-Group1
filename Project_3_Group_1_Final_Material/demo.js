// Define the API data URLs
const apiUrl = 'http://localhost:5000/api/v1.0/CrimesInVictoria';
const apiUrl2 = 'http://localhost:5000/api/v1.0/DrugsOffencesVictoria';

// Define variables
let data;
let data2;
let lineChart;
let lineChart2;
let pieChart;
let barChart;

//these variables used to obtain selected values from HTML form elements.
let selectOffenceDivision = document.getElementById('selectOffenceDivision');
let selectYearPie = document.getElementById('selectYearPie');
let selectYearBar = document.getElementById('selectYearBar');
let selectOffenceGroup = document.getElementById('selectOffenceGroup');
let selectOffenceGroup2 = document.getElementById('selectOffenceGroup2'); 




// Function to create and update the linechart, "if" for Total for each year and "else" for each division for each year
function createLineChart(selectedOffenceDivision) {
    if (selectedOffenceDivision === "Total (all divisions)") {
        const yearlyData = {};
        data.forEach(d => {
            const year = d["Year"];
            const count = d["OffenceCount"];
            if (!yearlyData[year]) {
                yearlyData[year] = 0;
            }
            yearlyData[year] += count;
        });

        //do the Data Extraction After iterating through all the data entries,
        const years = Object.keys(yearlyData);
        const counts = Object.values(yearlyData);

        // and Create a line chart with the sum data, destroy if any exist one from the testing
        const ctxLineChart = document.getElementById('lineChartCanvas').getContext('2d');
        if (lineChart) {
            lineChart.destroy();
        }
        lineChart = new Chart(ctxLineChart, {
            type: 'line', // set the chart type
            data: {
                labels: years, //xaxis we use years
                datasets: [{
                    label: 'Offence Count', //for the label of the line
                    data: counts, //ylabel data
                    borderColor: 'steelblue', // line color
                    backgroundColor: 'rgba(70, 130, 180, 0.3)', //dot color
                    borderWidth: 1 //line tickness
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true, // to display xaxis
                            text: 'Year' //name of xaxis
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

    //filter the data to get the details based on the selected OffenceDivision 
    } else {
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
        const ctxLineChart = document.getElementById('lineChartCanvas').getContext('2d');
        if (lineChart) {
            lineChart.destroy();
        }
        lineChart = new Chart(ctxLineChart, {
            type: 'line',
            data: {
                labels: years, //xaxis, const by two section before, 
                datasets: [{
                    label: 'Offence Count',  //yaxis
                    data: counts, // const by two section before
                    borderColor: 'steelblue',
                    backgroundColor: 'rgba(70, 130, 180, 0.3)', //dot color as steelblue
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
}





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
                        const dataset = data.datasets[tooltipItem.datasetIndex];
                        const label = data.labels[tooltipItem.index];
                        return `${label}: ${dataset.data[tooltipItem.index]}`; // Display label and count
                    }
                }
            }
        }
    });
}



// Fetch data from the first API URL and populate dropdowns
fetch(apiUrl)
    .then(response => response.json())
    .then(jsonData => {
        // Store the data
        data = jsonData;

        // Extract unique OffenceDivisions for the dropdown, 
        // use  "..." to convert the Set into an array, otherwise not showing in the dropdown correctly
        const uniqueOffenceDivisions = [...new Set(data.map(d => d["OffenceDivision"]))];

        // Clear the selectOffenceDivision dropdown before populating it
        selectOffenceDivision.innerHTML = "";

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
                createLineChart("Total (all divisions)", years, counts);
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
                createLineChart(selectedOffenceDivision, years, counts);
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
            createPieChart(selectedYear);
        });

        // Initialize the line chart and pie chart with default values
        createLineChart("Total (all divisions)");
        createPieChart(uniqueYears[0]);
    })
    .catch(error => {
        console.error("Error loading data from the first API URL:", error);
    });




// From here use URL2    
// Function to create and update the linechart2, do the same as the first line chart
function createLineChart2(selectedOffenceGroup) {
    if (selectedOffenceGroup === "Total (all groups)") {
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
        const ctxLineChart2 = document.getElementById('lineChartCanvas2').getContext('2d');
        if (lineChart2) {
            lineChart2.destroy();
        }

        lineChart2 = new Chart(ctxLineChart2, {
            type: 'line',
            data: {
                labels: years2,
                datasets: [{
                    label: 'Offence Count',
                    data: counts2,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.3)', // Change the background color for URL2
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
    } else {
        // Filter data from URL2 based on the selected OffenceGroup
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
        const ctxLineChart2 = document.getElementById('lineChartCanvas2').getContext('2d');
        if (lineChart2) {
            lineChart2.destroy();
        }

        lineChart2 = new Chart(ctxLineChart2, {
            type: 'line',
            data: {
                labels: years2,
                datasets: [{
                    label: 'OffenceCount',
                    data: counts2,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 128, 0, 0.3)', // Change the background color for URL2
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
}



// Updated createBarChart function
function createBarChart(selectedYear) {
    // Filter data based on the selected year
    const filteredData = data2.filter(d => d["Year"] == selectedYear);

    // Extract unique Offence Groups for the bar chart
    const offenceGroups = [...new Set(filteredData.map(d => d["OffenceGroup"]))];

    // Extract counts for each Offence Group
    const counts = offenceGroups.map(group => {
        return filteredData.reduce((acc, d) => {
            if (d["OffenceGroup"] === group) {
                return acc + d["OffenceCount"];
            }
            return acc;
        }, 0);
    });

    // Create a bar chart
    const ctxBarChart = document.getElementById('barChartCanvas').getContext('2d');
    if (barChart) {
        barChart.destroy();
    }
    barChart = new Chart(ctxBarChart, {
        type: 'bar',
        data: {
            labels: offenceGroups,
            datasets: [{
                label: 'Offence Count',
                data: counts,
                backgroundColor: 'rgba(70, 130, 180, 0.7)',
                borderWidth: 1,
                barThickness:20
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
                        autoSkip: false, // Disable automatic label skipping
                        maxRotation: 15,   // Rotate labels to 0 degrees (vertical)
                        minRotation: 15    // Rotate labels to 0 degrees (vertical)
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Offence Count'
                    }
                }
            },
        }
    });
}






// Fetch data from URL2 and populate dropdowns
fetch(apiUrl2)
    .then(response => response.json())
    .then(jsonData => {
        // Store the data globally for URL2
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
                createLineChart2("Total (all groups)", years2, counts2);
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
                createLineChart2(selectedOffenceGroup, years2, counts2);
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
            createBarChart(selectedYear);
        });

        // Initialize the line chart and bar chart with default values
        createLineChart2("Total (all groups)");
        createBarChart(uniqueYears2[0]);
    })
    .catch(error => {
        console.error("Error loading data from URL2:", error);
    });