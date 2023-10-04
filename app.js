
// Import data from local sqlite server (Run the python file first)
const dataUrl = 'http://127.0.0.1:5000'

// establish the promise
promise1 = d3.json(dataUrl)

// log the data
promise1.then((data) => console.log(data))

const geoUrl = 'http://127.0.0.1:5000/stations'

// establish the promise
promise2 = d3.json(geoUrl)

// log the data
promise2.then((data) => {
    console.log(data)
    setStations(data)
})

const areaUrl = 'http://127.0.0.1:5000/cityareas'

// establish the promise
promise3 = d3.json(areaUrl)

// log the data
promise3.then((data) => {
    
    console.log(data)
    setDistrict(data)
    
    }    
)



// Create the map object
var map = L.map('map').setView([34.0319344,-118.2644802], 8);

// Draw the actual map
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// ADD DIFFERENT MAP TYPES 
// ADD LAYERS TO THE MAP



function setStations(data) {

    // let coordinates = data.features[0].geometry.coordinates
    console.log(data.features.length)

    for (let i = 0; i < data.features.length; i++) {

        // Note that the geojson data reversed the lat and long coordinates.
        let coordinates = data.features[i].geometry.coordinates
        let longitude = coordinates[0]
        let latitude = coordinates[1]

        // console.log(coordinates)

        let station = data.features[i].properties;

        L.marker([latitude,longitude])
        .bindPopup(`<h1>${station.DIVISION}</h1> <hr> <h3>Location ${station.LOCATION.toLocaleString()}</h3>`)
        .addTo(map)
    }

}

function setDistrict(data) {

    let coordinates = data.features[0].geometry.coordinates
    console.log(data.features[0].geometry.coordinates[0])

    // try {
    //     // Code that may cause an exception
    //     var x = undefinedVariable; // This will throw a ReferenceError
    //     console.log("This line won't be executed if an exception occurs.");
    // } catch (error) {
    //     // Code to handle the exception
    //     console.error("An error occurred:", error.message);
    // } finally {
    //     // Code that always runs, whether an exception occurred or not
    //     console.log("This line always runs.");
    // }


    for (let i = 0; i < data.features.length; i++) {

        if (data.features[i].geometry.coordinates.length === 2) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]
            let polyCoordinates2 = data.features[i].geometry.coordinates[1]
            // console.log(polyCoordinates1)

            // Switched coordinates with latitude first
            var fixedCoords1 = polyCoordinates1.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords2 = polyCoordinates2.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // console.log(fixedCoords)

            L.polygon([[fixedCoords1,fixedCoords2]], {
                // color: "yellow",
                // fill: false,
                // fillOpacity: 0.75
            }).addTo(map);
        }
        
        // catch (error) {        
        //     console.log("An error occurred");
            
        
        // }
        
        else if (data.features[i].geometry.coordinates.length === 1) {
        // Code that always runs, whether an exception occurred or not 
        // console.log(fixedCoords)

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]

                // Switched coordinates with latitude first
                var fixedCoords1 = polyCoordinates1.map(function(coord) {
                    return [coord[1], coord[0]];
                });

                L.polygon([fixedCoords1], {
                    // color: "yellow",
                    // fillColor: "lightblue",
                    // fillOpacity: 0.75
                }).addTo(map);
                }
        else if (data.features[i].geometry.coordinates.length === 3) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]
            let polyCoordinates2 = data.features[i].geometry.coordinates[1]
            let polyCoordinates3 = data.features[i].geometry.coordinates[2]

            // console.log(polyCoordinates1)

            // Switched coordinates with latitude first
            var fixedCoords1 = polyCoordinates1.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords2 = polyCoordinates2.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords3 = polyCoordinates3.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // console.log(fixedCoords)

            L.polygon([[fixedCoords1,fixedCoords2,fixedCoords3]], {
                // color: "yellow",
                // fill: false,
                // fillOpacity: 0.75
            }).addTo(map);
        }

        else if (data.features[i].geometry.coordinates.length === 4) {

            // Note that the geojson data reversed the lat and long coordinates.
            let polyCoordinates1 = data.features[i].geometry.coordinates[0]
            let polyCoordinates2 = data.features[i].geometry.coordinates[1]
            let polyCoordinates3 = data.features[i].geometry.coordinates[2]
            let polyCoordinates4 = data.features[i].geometry.coordinates[3]


            // console.log(polyCoordinates1)

            // Switched coordinates with latitude first
            var fixedCoords1 = polyCoordinates1.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords2 = polyCoordinates2.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords3 = polyCoordinates3.map(function(coord) {
                return [coord[1], coord[0]];
            });

            // Switched coordinates with latitude first
            var fixedCoords4 = polyCoordinates4.map(function(coord) {
                return [coord[1], coord[0]];
            });
            // console.log(fixedCoords)

            L.polygon([[fixedCoords1,fixedCoords2,fixedCoords3,fixedCoords4]], {
                // color: "yellow",
                // fill: false,
                // fillOpacity: 0.75
            }).addTo(map);
        }
        
        else {console.log("Once again. I'm out od ideas")}


        }

 

    }






// Initialize all of the charts and drop-downs
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