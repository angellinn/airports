// 1. Create a map object.
var mymap = L.map('map', {
    center: [39.50, -98.35],
    zoom: 4,
    maxZoom: 10,
    minZoom: 3,
    detectRetina: true});

// 2. Add a base map.
L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);


// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var usAirports = null;

usAirports = L.geoJson.ajax("assets/airports.geojson", {
    // assign a function to the onEachFeature parameter of the cellTowers object.
    // Then each (point) feature will bind a popup window.
    // The content of the popup window is the value of `feature.properties.company`
    onEachFeature: function (feature, layer) {
        layer.bindPopup(feature.properties.AIRPT_NAME);
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane' })});
    },
    attribution: 'US Airport Data &copy; Data.Gov | US States &copy; Mike Bostock | Base Map &copy; CartoDB | Made By Angel Lin'
}).addTo(mymap);

// 4. Set function for color ramp
colors = chroma.scale('YlOrRd').colors(6); //colors = chroma.scale('OrRd').colors(5);

function setColor(count) {
    var id = 0;
    if (count > 100) { id = 5; }
    else if (count > 70 && count <= 100) { id = 4; }
    else if (count > 50 && count <= 70) { id = 3; }
    else if (count > 30 &&  count <= 50) { id = 2; }
    else if (count > 15 &&  count <= 30) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 5. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

// 6. Add county polygons
// create counties variable, and assign null to it.
var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
    style: style
}).addTo(mymap);

// 7. Create Leaflet Control Object for Legend
var legend = L.control({position: 'topright'});

// 8. Function that runs when legend is added to map
legend.onAdd = function () {

    // Create Div Element and Populate it with HTML
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += '<b>Number of Airport</b><br />';
    div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>100+</p>';
    div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>71-100</p>';
    div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>51-70</p>';
    div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>31-50</p>';
    div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p>16-30</p>';
    div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p>0-15</p>';
    // Return the Legend div containing the HTML content
    return div;
};

// 9. Add a legend to map
legend.addTo(mymap);

// 10. Add a scale bar to map
L.control.scale({position: 'bottomleft'}).addTo(mymap);
