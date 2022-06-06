// Global variable for user place input.
var inputValue;
getValueInput = () => {
    const userInputBox = document.getElementById("userInput")
    var userInput = userInputBox.value;
    userInputBox.value = "";

    inputValue = userInput.charAt(0).toUpperCase() + userInput.slice(1);

    var url = "https://dbpedia.org/sparql";
    var query = [
        `select * { <http://dbpedia.org/resource/${inputValue}> geo:lat ?lat ; geo:long ?long }`
    ].join(" ");
    var queryURL = url + "?query=" + encodeURIComponent(query) + "&format=xml"

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var xmlResponseFromDBPedia = xhttp.response;

        parser = new DOMParser();
        parsedXmlResponseFromDBPedia = parser.parseFromString(xmlResponseFromDBPedia, "text/xml");

        try {
            var responseLat = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[0].childNodes[0].nodeValue;
            var responseLong = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[1].childNodes[0].nodeValue;

        }
        catch (e) {
            inputValue = responseLat = responseLong = false;
        }
        finally {
            displayCoordinates(inputValue, responseLat, responseLong);
            zoomToCity(responseLat, responseLong);
            marker(responseLat, responseLong);
        }


    }
    xhttp.open("GET", queryURL);
    xhttp.send();

}


// abstract query

function displayCoordinates(city, lat, long) {
    const resultBox = document.getElementById("resultCoordinates");

    if (city && lat && long) {
        resultBox.style.display = "block";
        outputMessage = city + " Coordinates = (" + lat + ", " + long + ")";
        resultBox.innerHTML = outputMessage;
    }
    else {
        resultBox.innerHTML = "Not in knowledge graph!";
        resultBox.style.display = "block";
    }
}

function zoomToCity(lat, long) {
    lat = parseFloat(lat);
    long = parseFloat(long);

    view.setZoom(12)
    view.setCenter(ol.proj.fromLonLat([long, lat]))
}

function marker(lat, long) {
    lat = parseFloat(lat);
    long = parseFloat(long);

    var markers = new ol.layer.Vector({
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: 'https://openlayers.org/en/v3.20.1/examples/data/icon.png'
            })
        })
    });
    map.addLayer(markers);

    var marker = new ol.Feature(new ol.geom.Point(ol.proj.fromLonLat([long, lat])));
    markers.getSource().addFeature(marker);
}



function showInformation(click) {
    console.log(inputValue)
    var url = "https://dbpedia.org/sparql";

    var query2 = [
        `select * {<http://dbpedia.org/resource/${inputValue}> dbo:abstract ?abstract .filter((lang(?abstract) ='en')) }`
    ].join(" ");
    var queryURL2 = url + "?query=" + encodeURIComponent(query2) + "&format=xml"
    console.log(queryURL2)

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
        var xmlResponseFromDBPedia = xhttp.response;

        parser = new DOMParser();
        parsedXmlResponseFromDBPedia = parser.parseFromString(xmlResponseFromDBPedia, "text/xml");

        try {
            var responseAbstract = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[0].childNodes[0].nodeValue;

        }
        catch (e) {
            inputValue = responseAbstract = false;
        }
        finally {
            overlay.setPosition(long, lat)
            map.addOverlay(overlay)
            document.getElementById("abstract").innerHTML = responseAbstract
        }
    }
    xhttp.open("GET", queryURL2);
    xhttp.send();
}

