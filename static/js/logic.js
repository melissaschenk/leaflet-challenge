var colors = ["#610000","#810300","#A00E00","#C01D08","#DF2F13","#FF4420","#F94C57","#F5769B","#F49ECA","#F6C3E8","#FAE5F9"]

// Function to determine marker size based on population
  function markerSize(mag) {
    return mag * 20000;
  };

  function markerColor(depth) {
    var i = 9;
    if (depth > 90) { 
      i = 0; } else if (depth > 80) { i = 1
    } else if (depth > 70) { i = 2
    } else if (depth > 60) { i = 3
    } else if (depth > 50) { i = 4
    } else if (depth > 40) { i = 5
    } else if (depth > 30) { i = 6
    } else if (depth > 20) { i = 7
    } else if (depth > 10) { i = 8 
    };    
    return colors[i]
  };  
  
  // Adding tile layer to the map
  var tilemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
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
  var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "satellite-v9",    
    accessToken: API_KEY
    });


  // Assemble API query URL
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  var earthquakeMarkers = [];
  
  // Grab the data with d3
  d3.json(url, function(response) {
    
    // Loop through data
    for (var i = 0; i <  response.features.length; i++) {
  
        // Set the data location property to a variable  
        //console.log(response.features[i]);
        var location = response.features[i].geometry;
        var mag = response.features[i].properties.mag;
        var details = response.features[i].properties.place;
            details += "<br/>Magnitude: " + mag;
            details += "<br/><a href='" + response.features[i].properties.url + "' target='_blank'>USGS Details</a>";
            //details += "<br/>" + response.features[i].properties.time;

      // Check for location property
      if (location) {
  
        // Add a new marker to the cluster group and bind a pop-up
        var marker = L.circle([location.coordinates[1],location.coordinates[0]], {
            stroke: false,
            fillOpacity: 0.75,
            color: "darkgreen",
            fillColor: markerColor(parseFloat(location.coordinates[2])),
            radius: markerSize(parseFloat(mag))
            }).bindPopup("<div class='tool-tip'>" + details + "</div>");
            earthquakeMarkers.push(marker);
       };
    };

    // Load in geojson data
    var geoData_plates = "static/data/PB2002_plates.json";
    
    // Grabbing our GeoJSON data..
    d3.json(geoData_plates, function(data) {
      // Creating a GeoJSON layer with the retrieved data
      var plates = L.geoJson(data)
    
      var earthquakes = L.layerGroup(earthquakeMarkers);
    
      // Create an overlay object
      var overlayMaps = {
        "Plates": plates,
        "Earthquakes": earthquakes
        
      };

      // Create a baseMaps object
      var baseMaps = {
        "Light Map": tilemap,
        "Dark Map": darkmap,
        "Satellite": satellite
      };

      // Creating map object
      var myMap = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,       
        layers: [tilemap, earthquakes] 
      });

      // Pass our map layers into our layer control
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);

      // Set up the legend
      var legend = L.control({ position: "bottomright" });
      legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = [90,80,70,60,50,40,30,10];      
      var labels = [];

      // Add min & max
      var legendInfo = "<h1>Earthquakes within 7 days</h1>" +
        "<div class=\"labels\">" +
        "</div>" +
        "<p>Earthquake Depth (km)</p>";

      div.innerHTML = legendInfo;
      limits.forEach(ledgendItem)
      function ledgendItem(item, index) {
        labels.push("<li style='background-color:"+ colors[index] +"'>"+ item +"</li>")
      };
      
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";      
      return div;
    };

    // Adding legend to the map
    legend.addTo(myMap);
            
  });

});
  





