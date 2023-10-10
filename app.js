
// Import data from local sqlite server (Run the python file first)

// layer lists
let stationMarkers = []
// let heatMap = []
// let cityArea = []
// let crimeMarkers = []


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
// let crimeLayer = L.layerGroup(crimeMarkers)

// Only one base layer can be shown at a time.
let baseMaps = {
    Street: street,
    Topography: topo
  };



let overlayMaps = {
    LAPD: stationLayer,
    Crime: heatLayer,
    Districts: areaLayer
    // Details: crimeLayer
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

// var route = 'http://127.0.0.1:5000'

var dataUrl = 'http://127.0.0.1:5000/crimedata'

var geoUrl = 'http://127.0.0.1:5000/stations'

var areaUrl = 'http://127.0.0.1:5000/cityareas'


// current crime
// var current = []

function data(url) {
// pull crime data
let promise1 = d3.json(url).then(data => {

// iterate over crime data

    // emptyArray(current)

    console.log(data)

    let heatArray = []
    // let crimeMarkers = []

    for (i = 0; i < data.length; i++) {
  
    let lat = data[i].LAT
    let lon = data[i].LON
    let location = [lat,lon]
        if (location) {
        // console.log(location);
        heatArray.push(location);
        }
    
    let crime = data[i]["Crm Cd Desc"]
    
    let time = data[i]["DATE OCC"]
    var dateString = time;
    var regex = /(\d{2})\/(\d{2})\/(\d{4})/;

    var match = dateString.match(regex);

        if (match) {
            var month = match[1]; // Contains the month (e.g., '01')
            var year = match[3];  // Contains the year (e.g., '2020')
    
            console.log("Month:", month);
            console.log("Year:", year);
        } else {
    console.log("No match found");
    }
    console.log(crime, time)
    // let vict_age = data[i]["Vict Age"]
    // let vict_sex = data[i]["Vict Sex"]

    // crimeMarkers.push(
    //     L.marker(location).bindPopup("<h1>" + crime + "</h1><br>",
    //     "<h1>" + time + "</h1><br>",
    //     "<h1>" + vict_age + "</h1><br>",
    //     "<h1>" + vict_sex + "</h1>").addTo(crimeLayer)
    //   );
    // }
    }

    L.heatLayer(heatArray, {
        radius: 20,
        blur: 35
    }).addTo(heatLayer)
})
}

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
    .bindPopup(`<h6>${station.DIVISION}</h6> <hr> <h6>Location: ${station.LOCATION.toLocaleString()}</h6>`).addTo(stationLayer))
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






// Initialize all of the charts and drop-downs
init()

function init() {

    exampleBar()
    examplePie()
    exampleScatter()
    // data(dataUrl)
    // populateDistrictDropdown()
    // populateCrimeDropdown()
    // populateChartParamtersDropdown()
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









// Populates the district dropdown list with items that, when selected, set the map to the coordinates of that district
document.addEventListener("DOMContentLoaded", function () {
    

    // Get the dropdown element by its unique id
    const dropdown1 = document.getElementById("district-selector");
    const dropdownMenu1 = dropdown1.querySelector(".dropdown-menu");
    const dropdownText = dropdown1.querySelector(".btn");


    let districts = ['North Valley','South Valley','West LA','Central','East LA','South LA','Harbor Districts','West Hills']
    
    let districtCoordinates = [[34.25994983206024,-118.45081865787508], // North Valley
    [34.176837772589096, -118.49853515625001], // South Valley
    [34.06950035227694,-118.47691118717194], // West LA
    [34.085711502121676,-118.3220672607422], // Central
    [34.091113788749794,-118.21872711181642], // East LA
    [33.99556781046533,-118.3042895793915], // South LA
    [33.81543900487201,-118.28810244798663], // Harbors
    [34.21971760306106,-118.65619875490667], // West Hills
]

    
    // Loop through the names array and create dropdown items
    districts.forEach(function (name) {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#"; // You can set the link behavior if needed
        dropdownItem.textContent = name;
    
        dropdownItem.addEventListener("click", function () {
            console.log(name); // Log the selected item's text in the console
            dropdownText.textContent = name

            if (name == districts[0]) {
                map.setView(districtCoordinates[0], 12)
            }
            else if (name == districts[1]) {
                map.setView(districtCoordinates[1], 12)
            }
            else if (name == districts[2]) {
                map.setView(districtCoordinates[2], 11)
            }
            else if (name == districts[3]) {
                map.setView(districtCoordinates[3], 11)
            }
            else if (name == districts[4]) {
                map.setView(districtCoordinates[4], 11)
            }
            else if (name == districts[5]) {
                map.setView(districtCoordinates[5], 11)
            }
            else if (name == districts[6]) {
                map.setView(districtCoordinates[6], 11)
            }
            else if (name == districts[7]) {
                map.setView(districtCoordinates[7], 11)
            }
            else if (name == districts[8]) {
                map.setView(districtCoordinates[8], 15)
            }
            else if (name == districts[9]) {
                map.setView(districtCoordinates[9], 15)
            }
          });

        // Append the item to the dropdown menu
        dropdownMenu1.appendChild(dropdownItem);
    });
    });


    // Populates the district dropdown list with items that, when selected, set the map to the coordinates of that district
document.addEventListener("DOMContentLoaded", function () {


    // Get the dropdown element by its unique id
    const dropdown1 = document.getElementById("crime-selector");
    const dropdownMenu1 = dropdown1.querySelector(".dropdown-menu");
    const dropdownText = dropdown1.querySelector(".btn");


    crimes = [ 'ASSAULT', 'ARSON', 'BATTERY', 'BIKE', 'BOMB', 'BUNCO', 'BURGLARY', 'COUNTERFEIT', 'CREDIT CARD', 'CRIMINAL HOMICIDE', 'DISTURBING THE PEACE', 'FORGERY', 'EMBEZZLEMENT', 'EXTORTION', 'HUMAN TRAFFICKING', 'INDECENT EXPOSURE', 'KIDNAPPING', 'LEWD', 'PICKPOCKET', 'ROBBERY', 'SHOPLIFTING', 'SEX', 'STALKING', 'THEFT', 'TRESPASSING', 'VANDALISM', 'VEHICLE','OTHER']

    // Loop through the names array and create dropdown items
    crimes.forEach(function (name) {
        const dropdownItem = document.createElement("a");
        dropdownItem.classList.add("dropdown-item");
        dropdownItem.href = "#"; // You can set the link behavior if needed
        dropdownItem.textContent = name;
    
        dropdownItem.addEventListener("click", function () {
            console.log(name); // Log the selected item's text in the console
            dropdownText.textContent = name

            if (name == 'OTHER') {
                assaultURL = `http://127.0.0.1:5000/crimedata/other/all`
                console.log(assaultURL)
                // current.push(`${name}`)
                heatLayer.clearLayers()
                data(assaultURL)

            }

            else {

            assaultURL = `http://127.0.0.1:5000/crimedata/${name}`
            console.log(assaultURL)
            // current.push(`${name}`)
            heatLayer.clearLayers()
            data(assaultURL)
            }
          });

        // Append the item to the dropdown menu
        dropdownMenu1.appendChild(dropdownItem);
    });
    });



document.addEventListener("DOMContentLoaded", function () {


        // Get the dropdown element by its unique id
        const dropdown2 = document.getElementById("crime-chart-selector");
        const dropdownMenu2 = dropdown2.querySelector(".dropdown-menu");
        const dropdownText2 = dropdown2.querySelector(".btn");
    
    
        crimes = [ 'ASSAULT', 'ARSON', 'BATTERY', 'BIKE', 'BOMB', 'BUNCO', 'BURGLARY', 'COUNTERFEIT', 'CREDIT CARD', 'CRIMINAL HOMICIDE', 'DISTURBING THE PEACE', 'FORGERY', 'EMBEZZLEMENT', 'EXTORTION', 'HUMAN TRAFFICKING', 'INDECENT EXPOSURE', 'KIDNAPPING', 'LEWD', 'PICKPOCKET', 'ROBBERY', 'SHOPLIFTING', 'SEX', 'STALKING', 'THEFT', 'TRESPASSING', 'VANDALISM', 'VEHICLE','OTHER']
    
        // Loop through the names array and create dropdown items
        crimes.forEach(function (name) {
            const dropdownItem = document.createElement("a");
            dropdownItem.classList.add("dropdown-item");
            dropdownItem.href = "#"; // You can set the link behavior if needed
            dropdownItem.textContent = name;
        
            dropdownItem.addEventListener("click", function () {
                console.log(name); // Log the selected item's text in the console
                dropdownText2.textContent = name
    
                if (name == 'OTHER') {
                    assaultURL = `http://127.0.0.1:5000/crimedata/other/all`
                    console.log(assaultURL)
                    // current.push(`${name}`)
                    
                    data(assaultURL)
    
                }
    
                else {
    
                assaultURL = `http://127.0.0.1:5000/crimedata/${name}`
                console.log(assaultURL)
                // current.push(`${name}`)
                
                data(assaultURL)
                }
              });
    
            // Append the item to the dropdown menu
            dropdownMenu2.appendChild(dropdownItem);
        });
        });

// particlesJS("particles-js", {"particles":{"number":{"value":80,"density":{"enable":true,"value_area":800}},
//     "color":{"value":"#6a1e7a"},"shape":{"type":"circle","stroke":{"width":1,"color":"#000000"},"polygon":{"nb_sides":6},
//     "image":{"src":"img/github.svg","width":100,"height":100}},
//     "opacity":{"value":0.5,"random":false,"anim":{"enable":false,"speed":1,"opacity_min":0.1,"sync":false}},
//     "size":{"value":3,"random":true,"anim":{"enable":false,"speed":40,"size_min":0.1,"sync":false}},
//     "line_linked":{"enable":true,"distance":272.58005034713887,"color":"#ffffff","opacity":0.4,"width":1},
//     "move":{"enable":true,"speed":1.603412060865523,"direction":"none","random":false,"straight":false,"out_mode":"bounce","bounce":false,
//     "attract":{"enable":false,"rotateX":2164.606282168456,"rotateY":2084.43567912518}}},"interactivity":{"detect_on":"canvas",
//     "events":{"onhover":{"enable":true,"mode":"repulse"},"onclick":{"enable":true,"mode":"repulse"},"resize":true},
//     "modes":{"grab":{"distance":767.4129656247711,"line_linked":{"opacity":1}},
//     "bubble":{"distance":353.2535873510851,"size":178.65698670629592,"duration":5.5221250436491465,"opacity":8,"speed":3},
//     "repulse":{"distance":200,"duration":0.4},"push":{"particles_nb":4},"remove":{"particles_nb":2}}},
//     "retina_detect":true});var count_particles, stats, update; stats = new Stats; stats.setMode(0); stats.domElement.style.position = 'absolute'; 
//     stats.domElement.style.left = '0px'; stats.domElement.style.top = '0px'; document.body.appendChild(stats.domElement); 
//     count_particles = document.querySelector('.js-count-particles'); update = function() { stats.begin(); stats.end(); 
//         if (window.pJSDom[0].pJS.particles && window.pJSDom[0].pJS.particles.array) { 
//             count_particles.innerText = window.pJSDom[0].pJS.particles.array.length; } 
//             requestAnimationFrame(update); }; requestAnimationFrame(update);;
// var chartData = d3.json(url).then(data => {

//     // iterate over crime data
    
//         console.log(data)
    
//         let chartArray = []
    
//         for (i = 0; i < data.length; i++) {
      
//             if (selection == 'OTHER') {
//                 assaultURL = `http://127.0.0.1:5000/crimedata/other/all`
//                 console.log(assaultURL)
//                 // current.push(`${name}`)
                
//                 data(assaultURL)

//             }}
//         }
















