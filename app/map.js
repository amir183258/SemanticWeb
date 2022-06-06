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

////////////////////////view///////////////////////////////

var view = new ol.View({
    zoom: 2.5,
    center: ol.proj.fromLonLat([20, 35.6892])
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






// * Add a click handler to hide the popup.
// * @return { boolean } Don't follow the href.

// closer.onclick = function () {
//     overlay.setPosition(undefined);
//     closer.blur();
//     return false;
// };