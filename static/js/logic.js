  // Function to determine marker size based on population
  function markerSize(depth) {
    return depth * 2000;
  }
  function markerColor(depth) {
    return depth * 2000;
  }  
  // Creating map object
    var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,        
      });
  
      
  // Adding tile layer to the map
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  // Assemble API query URL
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  
  var earthquakeMarkers = [];
  
  // Grab the data with d3
  d3.json(url, function(response) {
  
    // Create a new marker cluster group
    var markers = L.layerGroup();
    //var earthquakes = L.layerGroup(earthquakeMarkers);
  
    // // Loop through data
    for (var i = 0; i <  response.features.length; i++) {
  
        // Set the data location property to a variable  
        console.log(response.features[i]);
        var location = response.features[i].geometry;
        var mag = response.features[i].properties.mag;
        var details = response.features[i].properties.place;
            details += "<br/>Magnitude: " + mag;
            details += "<br/><a href='" + response.features[i].properties.url + "' target='_blank'>USGS Details</a>";
            //details += "<br/>" + response.features[i].properties.time;

        console.log(location)
  
      // Check for location property
      if (location) {
  
    //     // Add a new marker to the cluster group and bind a pop-up
        var marker = L.circle([location.coordinates[1],location.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: "darkgreen",
            fillColor: "lightgreen",
            radius: markerSize(location.coordinates[2])
            }).bindPopup("<div class='tool-tip'>" + details + "</div>");
            markers.addLayer(marker)

    //     markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
    //       .bindPopup(response[i].descriptor));
       }
  
    }
  
    // Add our marker cluster layer to the map
    myMap.addLayer(markers);
  
  });
  