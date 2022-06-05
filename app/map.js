///////////////////////OSM/////////////////////////////////////////

var osmSource = new ol.source.OSM()
var osm = new ol.layer.Tile({
    source: osmSource
})

///////////////////////interaction Draw//////////////////////////////  

var drawSource = new ol.source.Vector()
var drawLayer = new ol.layer.Vector({
    source: drawSource
})
var draw = new ol.interaction.Draw({
    source: drawSource,
    type: 'Point'
})


////////////////////////overlay///////////////////////////////

var overlay = new ol.Overlay({
    element: document.getElementById('popup')
})

var view = new ol.View({
    zoom: 5.9,
    center: ol.proj.fromLonLat([51, 33])
})

//////////////////add  map/////////////////// 

var map = new ol.Map({
    target: 'map',
    view: view

});
//////////////////////////add layers to map////////////////////// 
map.addLayer(osm)
map.addControl(new ol.control.FullScreen())
map.addLayer(drawLayer)
map.addOverlay(overlay)

// map.on('singleclick', function(evt) {
