  // Function to determine marker size based on population
function markerSize(population) {
    return population /40;
  }

function createMarker() {
    var coordinates = [37.09, -95.71];//[location.coordinates[1],location.coordinates[0]]
    var details = "7km NW of The Geysers, CA<br/>1.43<br/>https://earthquake.usgs.gov/earthquakes/feed/v1.0/detail/nc73540881.geojson<br/>1616908310600"
    var marker =  L.circle(coordinates, {
        stroke: false,
        fillOpacity: 0.75,
        color: "green",
        fillColor: "lightgreen",
        radius: markerSize(10000000)
        }
    ).bindPopup(details);
    return marker
}  

  
  // Define arrays to hold created city and state markers
  var earthquakeMarkers = [];
  var earthquakeCoordinates = [];

  console.log("123")

  // Assemble API query URL
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  
  

  // Grab the data with d3
  d3.json(url, function(response) {
    var earthquakeArr = response.features
    
   // Loop through data
   for (var i = 0; i < 10; i++) {
      console.log(i);
      earthquakeMarkers.push(createMarker());  

     // Set the data location property to a variable
      var location = response.features[i].geometry;
      var mag = earthquakeArr[i].properties.mag;
     var details = earthquakeArr[i].properties.place;
         details += "<br/>" + mag;
         details += "<br/>" + earthquakeArr[i].properties.detail;
         details += "<br/>" + earthquakeArr[i].properties.time;
         //console.log(details)
    earthquake = { "location": location,
                    "mag":mag,
                    "details": details

    }
    var coordinates = [location.coordinates[1],location.coordinates[0]]
    earthquakeCoordinates.push(coordinates);
    //console.log(earthquake);
    //earthquakeDetails.push(earthquake);
        
        //  earthquakeMarkers.push(
        //     L.circle(coordinates, {
        //       stroke: false,
        //       fillOpacity: 0.75,
        //       color: "green",
        //       fillColor: "lightgreen",
        //       radius: markerSize(10000000)
        //     }).bindPopup(details)
        //   );


        if (i > 10) {
            break;
        }
        
        //console.log(earthquakeMarkers)

   }

 });
 
 console.log("earthquakeDetails")
 
 console.log(earthquakeCoordinates)
 

 for (var i = 0; i < 10; i++) {
    //console.log(earthquakeDetails[0][i])
    earthquakeMarkers.push(createMarker());  
 }

 

// // Loop through locations and create city and state markers
// for (var i = 0; i < locations.length; i++) {
//     console.log(locations[i].coordinates)
//   // Setting the marker radius for the state by passing population into the markerSize function
//   stateMarkers.push(
//     L.circle(locations[i].coordinates, {
//       stroke: false,
//       fillOpacity: 0.75,
//       color: "white",
//       fillColor: "white",
//       radius: markerSize(locations[i].state.population)
//     })
//   );

 
  
// Streetmap Layer
var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});

  // Create two separate layer groups: one for cities and one for states
  var earthquakes = L.layerGroup(earthquakeMarkers);
//   var cities = L.layerGroup(cityMarkers);
//   var states = L.layerGroup(stateMarkers);
 
  // Create a baseMaps object
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };
  
  // Create an overlay object
  var overlayMaps = {
    "Earthquakes": earthquakes
    // "Cities": cities,
    // "States": states
  };
  
  // Define a map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });
  
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  


