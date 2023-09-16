 // Define the API data URL
 const url = 'http://localhost:5000/api/v1.0/CrimesInVictoria';
 const url2 = 'http://localhost:5000/api/v1.0/DrugsOffencesVictoria';

 // Define global variables for data and charts
 let data;
 let data2;
 let lineChart;
 let lineChart2;
 let pieChart;
 let barChart;
 
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
     const counts = Object.values(yearlyData);
 
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
                 data: percentages,
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
 



// Function to create the Bar Chart
function createBarChart(selectedGroup) {
    console.log(selectedGroup)
    // Filter data based on the selected year for Drugs Offences data
    const filteredData = (selectedGroup === "all") ?
        data2 :
        data2.filter(d => d["OffenceGroup"] === selectedGroup);

    //const filteredData = data2.filter(d => d["OffenceGroup"] == selectedGroup);
console.log(filteredData)
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
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Offence Group'
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

// Function to create the Line Chart for Year, Offence Group, and Offence Count
function createLineChart2(selectedOffenceGroup) {
    // Destroy the existing line chart if it exists
    if (lineChart2) {
        lineChart2.destroy();
    }

    // Filter data based on the selected Offence Group
    const filteredData = (selectedOffenceGroup === "all") ?
        data2 :
        data2.filter(d => d["OffenceGroup"] === selectedOffenceGroup);

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
    const counts = Object.values(yearlyData);

    // Create a line chart
    const ctxLineChart2 = document.getElementById('lineChartCanvas2').getContext('2d');
    lineChart2 = new Chart(ctxLineChart2, {
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

// Load data from the second URL using fetch
fetch(url2)
    .then(response => response.json())
    .then(jsonData => {
        // Store the data globally
        data2 = jsonData;

        // Extract unique Offence Groups for the bar chart dropdown
        const offenceGroups = [...new Set(data2.map(d => d["OffenceGroup"]))];

        // Add an option to calculate the sum of counts for all groups
        const selectGroup = document.getElementById("selectGroup");
        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "Total (All Groups)";
        selectGroup.appendChild(allOption);

        // Populate the bar chart dropdown with Offence Group options
        offenceGroups.forEach(group => {
            const option = document.createElement("option");
            option.value = group;
            option.textContent = group;
            selectGroup.appendChild(option);
        });

        // Add change event listener to the bar chart group dropdown
        selectGroup.addEventListener("change", function () {
            const selectedGroup = this.value;
            createBarChart(selectedGroup);
        });

        // Initialize the bar chart with all data
        createBarChart("all");

        // Extract unique Offence Groups for the line chart dropdown
        const offenceGroups2 = [...new Set(data2.map(d => d["OffenceGroup"]))];

        // Add an option to calculate the sum of counts for all groups
        const selectGroup2 = document.getElementById("selectGroup2");
        const allOption2 = document.createElement("option");
        allOption2.value = "all";
        allOption2.textContent = "Total (All Groups)";
        selectGroup2.appendChild(allOption2);

        // Populate the line chart dropdown with Offence Group options
        offenceGroups2.forEach(group => {
            const option = document.createElement("option");
            option.value = group;
            option.textContent = group;
            selectGroup2.appendChild(option);
        });

        // Add change event listener to the line chart group dropdown
        selectGroup2.addEventListener("change", function () {
            const selectedGroup = this.value;
            createLineChart2(selectedGroup);
        });

        // Initialize the line chart with all data
        createLineChart2("all");
    })
    .catch(error => {
        console.error("Error loading data:", error);
    });
