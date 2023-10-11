
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
    
            // console.log("Month:", month);
            // console.log("Year:", year);
        } else {
    console.log("No match found");
    }

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
// init()

// function init() {

    // exampleBar()
    // examplePie()
    // exampleScatter()
    // data(dataUrl)
    // populateDistrictDropdown()
    // populateCrimeDropdown()
    // populateChartParamtersDropdown()
// }

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
                map.setView(districtCoordinates[2], 12)
            }
            else if (name == districts[3]) {
                map.setView(districtCoordinates[3], 12.5)
            }
            else if (name == districts[4]) {
                map.setView(districtCoordinates[4], 13)
            }
            else if (name == districts[5]) {
                map.setView(districtCoordinates[5], 12)
            }
            else if (name == districts[6]) {
                map.setView(districtCoordinates[6], 11)
            }
            else if (name == districts[7]) {
                map.setView(districtCoordinates[7], 15)
            }
            else if (name == districts[8]) {
                map.setView(districtCoordinates[8], 15)
            }
            else if (name == districts[9]) {
                map.setView(districtCoordinates[9], 1)
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

                // var spaceName = name;
                var spaceName = name;
                var noSpaceName = encodeURIComponent(spaceName);

                // var url = baseUrl + encodedUsername;
                console.log(noSpaceName)

            assaultURL = `http://127.0.0.1:5000/crimedata/${noSpaceName}`
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



// document.addEventListener("DOMContentLoaded", function () {


//         // Get the dropdown element by its unique id
//         const dropdown2 = document.getElementById("crime-chart-selector");
//         const dropdownMenu2 = dropdown2.querySelector(".dropdown-menu");
//         const dropdownText2 = dropdown2.querySelector(".btn");
    
    
//         crimes = [ 'ASSAULT', 'ARSON', 'BATTERY', 'BIKE', 'BOMB', 'BUNCO', 'BURGLARY', 'COUNTERFEIT', 'CREDIT CARD', 'CRIMINAL HOMICIDE', 'DISTURBING THE PEACE', 'FORGERY', 'EMBEZZLEMENT', 'EXTORTION', 'HUMAN TRAFFICKING', 'INDECENT EXPOSURE', 'KIDNAPPING', 'LEWD', 'PICKPOCKET', 'ROBBERY', 'SHOPLIFTING', 'SEX', 'STALKING', 'THEFT', 'TRESPASSING', 'VANDALISM', 'VEHICLE','OTHER']
    
//         // Loop through the names array and create dropdown items
//         crimes.forEach(function (name) {
//             const dropdownItem = document.createElement("a");
//             dropdownItem.classList.add("dropdown-item");
//             dropdownItem.href = "#"; // You can set the link behavior if needed
//             dropdownItem.textContent = name;
        
//             dropdownItem.addEventListener("click", function () {
//                 console.log(name); // Log the selected item's text in the console
//                 dropdownText2.textContent = name
    
//                 if (name == 'OTHER') {
//                     assaultURL = `http://127.0.0.1:5000/crimedata/other/all`
//                     console.log(assaultURL)
//                     // current.push(`${name}`)
                    
//                     data(assaultURL)
    
//                 }
    
//                 else {
    
//                 assaultURL = `http://127.0.0.1:5000/crimedata/${name}`
//                 console.log(assaultURL)
//                 // current.push(`${name}`)
                
//                 data(assaultURL)
//                 }
//               });
    
//             // Append the item to the dropdown menu
//             dropdownMenu2.appendChild(dropdownItem);
//         });
//         });

// Open the layer control by triggering a click event on its toggle button


var controlToggle = document.querySelector('.leaflet-control-layers-toggle');
if (controlToggle) {
    controlToggle.click();
}

// Define a function to fetch data from the API and create the chart.
function createAgeDistributionChart() {
    // Replace 'your-api-url' with the actual URL of the API that provides age data.
    fetch(dataUrl)
        .then(response => response.json())
        .then(data => {
            // Extract ages and count the number of people for each age.
            const ageData = data.map(item => item['Vict Age']);
            const ageCounts = {};
            ageData.forEach(age => {
                ageCounts[age] = (ageCounts[age] || 0) + 1;
            });

            // Extract unique ages and their corresponding counts.
            const ages = Object.keys(ageCounts).map(age => parseInt(age, 10));
            const counts = Object.values(ageCounts);

            // Create a bar chart using Chart.js.
            const ctx = document.getElementById('ageChart').getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ages,
                    datasets: [{
                        label: 'Distribution of Reported Victim Ages',
                        data: counts,
                        backgroundColor: 'rgba(0,0,255, 0.6)',
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Age'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: '# of People'
                            }
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Call the function to create the chart.
createAgeDistributionChart();


// Define the API URL
const apiUrl = dataUrl;

// Fetch data from the API
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Initialize empty objects to store the count of each gender
    const genderCount = {
      Male: 0,
      Female: 0,
      Other: 0,
    };

    // Iterate over the data to extract sex information from the 'Vice Sex' attribute
    data.forEach((entry) => {
      const sex = entry['Vict Sex'];

      // Increment the count based on the extracted sex information
      if (sex === 'M') {
        genderCount.Male++;
      } else if (sex === 'F') {
        genderCount.Female++;
      } else {
        genderCount.Other++;
      }
    });

    // Create an array of gender labels and their corresponding counts
    const genderLabels = Object.keys(genderCount);
    const genderData = Object.values(genderCount);

    // Get the canvas element
    const ctx = document.getElementById('genderChart').getContext('2d');

    // Create the bar chart
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: genderLabels,
        datasets: [
          {
            label: 'Distribution of Sexes',
            data: genderData,
            backgroundColor: ['lightblue', 'lightpink', 'gray'], // You can set the colors as desired
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            stepSize: 1,
          },
        },
      },
    });
  })
  .catch((error) => {
    console.error('Error fetching data:', error);
  });



// // Define the URL of the API endpoint
// const apiUrl = dataUrl;

// // Fetch data from the API
// fetch(apiUrl)
//     .then(response => response.json())
//     .then(data => {
//         // Extract gender data from the API response
//         const genders = data.map(entry => entry['Vict Sex']);

//         // Count the occurrences of each gender
//         const genderCounts = {};
//         genders.forEach(gender => {
//             if (genderCounts[gender]) {
//                 genderCounts[gender]++;
//             } else {
//                 genderCounts[gender] = 1;
//             }
//         });

//         // Extract labels and data for the pie chart
//         const labels = Object.keys(genderCounts);
//         const data2 = Object.values(genderCounts);

//         // Create a pie chart
//         const ctx = document.getElementById('genderChart').getContext('2d');
//         new Chart(ctx, {
//             type: 'pie',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     data: data2,
//                     backgroundColor: ['blue', 'pink', 'gray'], // You can customize the colors
//                 }],
//             },
//             options: {
//                 title: {
//                     display: true,
//                     text: 'Distribution of Sexes',
//                     fontSize: 16,
//                 },
//             },
//         });
//     })
//     .catch(error => console.error('Error fetching data:', error));

















