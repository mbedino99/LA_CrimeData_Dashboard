

// Create the map object
var map = L.map('map').setView([34.0319344,-118.2644802], 8);

// Draw the actual map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ADD DIFFERENT MAP TYPES 
// ADD LAYERS TO THE MAP

init()

// D3 event listener for Disctrict Selector
d3.select("#district-selector").selectAll(".dropdown-item")
    .on("click", function() {
        // Get the text content of the clicked item
        var selectedItemText = d3.select(this).text();
        
        // Do something with the selected item text
        console.log("Selected item: " + selectedItemText);

        // Update map with selected district?
        // CODE HERE
    });

// D3 event listener for Chart Selector
d3.select("#chart-selector").selectAll(".dropdown-item")
    .on("click", function() {
        // Get the text content of the clicked item
        var selectedItemText = d3.select(this).text();
        
        // Do something with the selected item text
        console.log("Selected item: " + selectedItemText);

        // Update Charts with selected parameters?
        // CODE HERE
    });


function init() {

    exampleBar()
    examplePie()
    exampleScatter()
    populateDistrictDropdown()
    populateChartParamtersDropdown()
}

function examplePie() {
    // Sample data for the pie chart
    var data = [{
        values: [30, 20, 50],  // Values for each pie slice
        labels: ['Slice 1', 'Slice 2', 'Slice 3'], // Labels for each slice
        type: 'pie'  // Specify chart type as 'pie'
    }];

    var layout = {
        width: 408,  // Width of the chart
        height: 400, // Height of the chart
        title: 'Simple Pie Chart' // Title of the chart
    };


    // Create the pie chart
    Plotly.newPlot('pie-chart', data, layout);
}

function exampleBar() {
    // Sample data for the bar chart
    var data = [{
        x: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
        y: [20, 35, 10, 45], // Values for each bar
        type: 'bar' // Specify chart type as 'bar'
    }];

    var layout = {
        width: 408,  // Width of the chart
        height: 400, // Height of the chart
        title: 'Simple Bar Chart', // Title of the chart
        xaxis: { title: 'Categories' }, // X-axis label
        yaxis: { title: 'Values' }    // Y-axis label
    };

    // Create the bar chart
    Plotly.newPlot('bar-chart', data, layout);
}

function exampleScatter() {
    // Sample data for the scatter chart
    var data = [{
        x: [1, 2, 3, 4, 5],  // X-axis values
        y: [10, 8, 6, 4, 2], // Y-axis values
        mode: 'markers', // Specify chart mode as 'markers'
        type: 'scatter'   // Specify chart type as 'scatter'
    }];

    var layout = {
        width: 408,      // Width of the chart
        height: 400,     // Height of the chart
        title: 'Simple Scatter Chart', // Title of the chart
        xaxis: { title: 'X-axis' },    // X-axis label
        yaxis: { title: 'Y-axis' }     // Y-axis label
    };

    // Create the scatter chart
    Plotly.newPlot('scatter-chart', data, layout)
}

function populateDistrictDropdown() {

// Populate the dropdown menu
    // Select the dropdown menu
    let dropdownMenu = d3.select("#district-selector")
    let options = dropdownMenu.select('ul')

    let districts = ['Nathan',"Andrew","Luis","Jason","Emily"]

    // Append a new option to the dopdown for every ID in the names array of the data
    for (i =0; i < districts.length; i++) 
        {
        options.append("li").html(`<a class="dropdown-item" href="#">${districts[i]}</a>`)
        }
}

function populateChartParamtersDropdown() {

    // Populate the dropdown menu
        // Select the dropdown menu
        let dropdownMenu = d3.select("#chart-selector")
        let options = dropdownMenu.select('ul')
    
        let districts = ['Bar','Scatter','Pie','Horizontal Bar','Apple Pie']
    
        // Append a new option to the dopdown for every ID in the names array of the data
        for (i =0; i < districts.length; i++) 
            {
            options.append("li").html(`<a class="dropdown-item" href="#">${districts[i]}</a>`)
            }
    }