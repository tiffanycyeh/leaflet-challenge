var myMap = L.map("map", {
    center: [24, -17.5],
    zoom: 2
  });
  
// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);
  
// Store our API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

d3.json(queryUrl, function(data) {
function styleInfo(feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}

  function getColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "#b50000";
  case magnitude > 4:
    return "#ff2424";
  case magnitude > 3:
    return "#e67a00";
  case magnitude > 2:
    return "#ffd230";
  case magnitude > 1:
    return "#c4ff21";
  default:
    return "#b8b8b8";
  }
}
// set radiuss from magnitude
  function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }

  return magnitude * 4;
}
  // GeoJSON layer
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

      var div = L.DomUtil.create('div', 'info legend'),
          bins = [0, 1, 2, 3, 4, 5, 6, 7],
          labels = [];

      div.innerHTML = "<h4>Magnitude</h4>";

      for (var i = 0; i < bins.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(bins[i]) + '"></i> ' +
              bins[i] + (bins[i + 1] ? '-' + bins[i + 1] + '<br>' : '+');
      }

      return div;
  };

  legend.addTo(myMap);

});