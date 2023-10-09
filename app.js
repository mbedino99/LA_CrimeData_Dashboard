
// Import data from local sqlite server (Run the python file first)

// layer lists
let stationMarkers = []
// let heatMap = []
// let cityArea = []


// Define variables for our tile layers.
let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let stationLayer = L.layerGroup(stationMarkers)
let heatLayer = new L.layerGroup()
let areaLayer = new L.layerGroup()

// Only one base layer can be shown at a time.
let baseMaps = {
    Street: street,
    Topography: topo
  };



let overlayMaps = {
    LAPD: stationLayer,
    Crime: heatLayer,
    Districts: areaLayer
};

// Create the map object
var map = L.map('map', {
    
    center:[34.0319344,-118.2644802],
    zoom:10,
    layers:[street, stationLayer, heatLayer, areaLayer]
}
)

L.control.layers(baseMaps, overlayMaps).addTo(map);


// setting data to links from local API

const dataUrl = 'http://127.0.0.1:5000'

const geoUrl = 'http://127.0.0.1:5000/stations'

const areaUrl = 'http://127.0.0.1:5000/cityareas'


// pull crime data
let promise1 = d3.json(dataUrl).then(data => {

// iterate over crime data

    // console.log(data[0].AREA)

    let heatArray = []

    for (i = 0; i < data.length; i++) {
  
   let lat = data[i].LAT
   let lon = data[i].LON
   let location = [lat,lon]
      if (location) {
        // console.log(location);
        heatArray.push(location);
      }
  
    }
  
    L.heatLayer(heatArray, {
      radius: 20,
      blur: 35
    }).addTo(heatLayer)

})


// pull stations data
let promise2 = d3.json(geoUrl).then(data => {

    // console.log(data)
// itterate over stations data
for (let i = 0; i < data.features.length; i++) {

    // Note that the geojson data reversed the lat and long coordinates.
    let coordinates = data.features[i].geometry.coordinates
    let longitude = coordinates[0]
    let latitude = coordinates[1]

    // console.log(coordinates)

    let station = data.features[i].properties;

    stationMarkers.push(L.marker([latitude,longitude])
    .bindPopup(`<h1>${station.DIVISION}</h1> <hr> <h3>Location ${station.LOCATION.toLocaleString()}</h3>`).addTo(stationLayer))
}})

// pull district areas data
let promise3 = d3.json(areaUrl).then(data => {

    // let coordinates = data.features[0].geometry.coordinates
    // console.log(data.features[0].geometry.coordinates[0])

    // iterate over district areas data
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
            }).addTo(areaLayer)
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
                }).addTo(areaLayer)
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
            }).addTo(areaLayer)
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
            }).addTo(areaLayer)
        }
        
        else {console.log("Once again. I'm out of ideas")}
        }

})



// }
// // establish the promise
// promise1 = d3.json(dataUrl)

// // log the data
// promise1.then((data) => {
    
//     console.log(data)
//     setHeatMap(data)
    
// })

// // establish the promise
// promise2 = d3.json(geoUrl)

// // log the data
// promise2.then((data) => {
//     console.log(data)
//     setStations(data)
// })


// // establish the promise
// promise3 = d3.json(areaUrl)

// // log the data
// promise3.then((data) => {
    
//     console.log(data)
//     setDistrict(data)
// })



// function setHeatMap(data) {

//     console.log(data[0].AREA)

//     let heatArray = []

//     for (i = 0; i < data.length; i++) {
  
//    let lat = data[i].LAT
//    let lon = data[i].LON
//    let location = [lat,lon]
//       if (location) {
//         console.log(location);
//         heatArray.push(location);
//       }
  
//     }
  
//     heatMap.push(L.heatLayer(heatArray, {
//       radius: 20,
//       blur: 35
//     })).addTo(heatLayer)

//     };

// function setStations(data) {

//     // let coordinates = data.features[0].geometry.coordinates
//     console.log(data.features.length)

//     for (let i = 0; i < data.features.length; i++) {

//         // Note that the geojson data reversed the lat and long coordinates.
//         let coordinates = data.features[i].geometry.coordinates
//         let longitude = coordinates[0]
//         let latitude = coordinates[1]

//         // console.log(coordinates)

//         let station = data.features[i].properties;

//         stationMarkers.push(L.marker([latitude,longitude])
//         .bindPopup(`<h1>${station.DIVISION}</h1> <hr> <h3>Location ${station.LOCATION.toLocaleString()}</h3>`))
//     }

// }

// function setDistrict(data) {

//     let coordinates = data.features[0].geometry.coordinates
//     console.log(data.features[0].geometry.coordinates[0])

//     for (let i = 0; i < data.features.length; i++) {

//         if (data.features[i].geometry.coordinates.length === 2) {

//             // Note that the geojson data reversed the lat and long coordinates.
//             let polyCoordinates1 = data.features[i].geometry.coordinates[0]
//             let polyCoordinates2 = data.features[i].geometry.coordinates[1]
//             // console.log(polyCoordinates1)

//             // Switched coordinates with latitude first
//             var fixedCoords1 = polyCoordinates1.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // Switched coordinates with latitude first
//             var fixedCoords2 = polyCoordinates2.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // console.log(fixedCoords)

//             cityArea.push(L.polygon([[fixedCoords1,fixedCoords2]], {
//                 // color: "yellow",
//                 // fill: false,
//                 // fillOpacity: 0.75
//             }))
//         }
        
//         // catch (error) {        
//         //     console.log("An error occurred");
            
        
//         // }
        
//         else if (data.features[i].geometry.coordinates.length === 1) {
//         // Code that always runs, whether an exception occurred or not 
//         // console.log(fixedCoords)

//             // Note that the geojson data reversed the lat and long coordinates.
//             let polyCoordinates1 = data.features[i].geometry.coordinates[0]

//                 // Switched coordinates with latitude first
//                 var fixedCoords1 = polyCoordinates1.map(function(coord) {
//                     return [coord[1], coord[0]];
//                 });

//                 cityArea.push(L.polygon([fixedCoords1], {
//                     // color: "yellow",
//                     // fillColor: "lightblue",
//                     // fillOpacity: 0.75
//                 }))
//                 }
//         else if (data.features[i].geometry.coordinates.length === 3) {

//             // Note that the geojson data reversed the lat and long coordinates.
//             let polyCoordinates1 = data.features[i].geometry.coordinates[0]
//             let polyCoordinates2 = data.features[i].geometry.coordinates[1]
//             let polyCoordinates3 = data.features[i].geometry.coordinates[2]

//             // console.log(polyCoordinates1)

//             // Switched coordinates with latitude first
//             var fixedCoords1 = polyCoordinates1.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // Switched coordinates with latitude first
//             var fixedCoords2 = polyCoordinates2.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // Switched coordinates with latitude first
//             var fixedCoords3 = polyCoordinates3.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // console.log(fixedCoords)

//             cityArea.push(L.polygon([[fixedCoords1,fixedCoords2,fixedCoords3]], {
//                 // color: "yellow",
//                 // fill: false,
//                 // fillOpacity: 0.75
//             }))
//         }

//         else if (data.features[i].geometry.coordinates.length === 4) {

//             // Note that the geojson data reversed the lat and long coordinates.
//             let polyCoordinates1 = data.features[i].geometry.coordinates[0]
//             let polyCoordinates2 = data.features[i].geometry.coordinates[1]
//             let polyCoordinates3 = data.features[i].geometry.coordinates[2]
//             let polyCoordinates4 = data.features[i].geometry.coordinates[3]


//             // console.log(polyCoordinates1)

//             // Switched coordinates with latitude first
//             var fixedCoords1 = polyCoordinates1.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // Switched coordinates with latitude first
//             var fixedCoords2 = polyCoordinates2.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // Switched coordinates with latitude first
//             var fixedCoords3 = polyCoordinates3.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });

//             // Switched coordinates with latitude first
//             var fixedCoords4 = polyCoordinates4.map(function(coord) {
//                 return [coord[1], coord[0]];
//             });
//             // console.log(fixedCoords)

//             cityArea.push(L.polygon([[fixedCoords1,fixedCoords2,fixedCoords3,fixedCoords4]], {
//                 // color: "yellow",
//                 // fill: false,
//                 // fillOpacity: 0.75
//             }))
//         }
        
//         else {console.log("Once again. I'm out od ideas")}


//         }

 

//     }


d3.selectAll("#district-selector").selectAll(".dropdown-item").onchange = function(){console.log("YES")};


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



// Initialize all of the charts and drop-downs
init()

function init() {

    exampleBar()
    examplePie()
    exampleScatter()
    populateDistrictDropdown()
    populateCrimeDropdown()
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

    let districts = ['West Hills','Harbor 1','Harbor 2','Harbor 3','North Valley','South Valley','Central','East LA','West LA','South LA']

    // Append a new option to the dopdown for every ID in the names array of the data
    for (i =0; i < districts.length; i++) 
        {
        options.append("li").html(`<a class="dropdown-item" href="#">${districts[i]}</a>`)
        }
}

function populateCrimeDropdown() {

    // Populate the dropdown menu
        // Select the dropdown menu
        let dropdownMenu = d3.select("#crime-selector")
        let options = dropdownMenu.select('ul')
    
        let crimes = ['Battery','Burglary','Jaywalking',"Petting the wrong dog","Forethought aftethoughts"]
    
        // Append a new option to the dopdown for every ID in the names array of the data
        for (i =0; i < crimes.length; i++) 
            {
            options.append("li").html(`<a class="dropdown-item" href="#">${crimes[i]}</a>`)
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