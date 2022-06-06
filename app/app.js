// Global variable for user place input.
var inputValue;

// Global variable for removing abstract box when user click on Go button.
const resultBox = document.getElementById("resultAbstract");

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
            putMarker(responseLat, responseLong);

            resultBox.style.display = "none";

        }
    }
    xhttp.open("GET", queryURL);
    xhttp.send();
}

// IF there will be a correct respnose from DBPedia:
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
    if (lat && long) {
        lat = parseFloat(lat);
        long = parseFloat(long);

        view.setZoom(12)
        view.setCenter(ol.proj.fromLonLat([long, lat]))
    }
}

function putMarker(lat, long) {
    if (lat && long) {
        lat = parseFloat(lat);
        long = parseFloat(long);

        const markerBox = document.getElementById("marker");
        markerBox.style.display = "block";

        var pos = ol.proj.fromLonLat([long, lat]);
        var marker = new ol.Overlay({
            position: pos,
            positioning: 'center-center',
            element: document.getElementById('marker'),
            stopEvent: false
        });
        map.addOverlay(marker);

        const markerButton = document.getElementById("markerButton");
        markerButton.style.display = "block";
        markerButton.addEventListener("click", showInformation);
    }
    else {
        const markerBox = document.getElementById("marker");
        markerBox.style.display = "none";
    }
}

function showInformation() {
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
            displayabstract(responseAbstract, inputValue);
        }
    }
    xhttp.open("GET", queryURL2);
    xhttp.send();
}

function displayabstract(abs, input) {
    // resultBox variable is global.
    if (abs && input) {
        if (resultBox.style.display === "none") {
            resultBox.style.display = "block";
            outputMessage = "<b>Abstract information of " + input + " :</br></b>" + abs;
            resultBox.innerHTML = outputMessage;
        }
        else
        resultBox.style.display = "none";
    }
}