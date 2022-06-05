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
    var temp = url + "?query=" + encodeURIComponent(query) + "&format=xml"

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
            zoomToPlace(responseLat, responseLong);
            showInformation();
        }
    }
    xhttp.open("GET", temp);
    xhttp.send();

    //myView = new ol.View({
    //    center: ol.proj.transform([35.6892, 51.3889], "EPSG:4326", "EPSG:3857"), zoom: 11
    //});
    //map.setView(myView);
}

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

function zoomToPlace(lat, long) {
    if (lat && long) {
        lat = parseFloat(lat);
        long = parseFloat(long);

        zoomDestinateion = ol.proj.fromLonLat([long, lat]);
        view.setCenter(zoomDestinateion);
        view.setZoom(10);
        // flyTo(zoomDestinateion, function() {});

        // view.setZoom(10)

        // view.animate({
        //     zoom: 5.9,
        //     duration: 2000
        // })

        // view.animate({
        //     center: ol.proj.fromLonLat([long, lat]),
        //     zoom: 10,
        //     duration: 2000
        // })
    }
    // view.setCenter(ol.proj.fromLonLat([long, lat]))
}

function flyTo(location, done) {
    var zoom = view.getZoom();

    var finalZoom = 10;
    if (zoom > finalZoom - 4) {
        zoomOutValue = 4;
        duration = 4000
    }
    else {
        zoomOutValue = 1;
        duration = 2000;
    }

    var parts = 2;
    var called = false;
    function callback(complete) {
        --parts;
        if (called) {
        return;
        }
        if (parts === 0 || !complete) {
        called = true;
        done(complete);
        }
    }
    view.animate({
        center: location,
        duration: duration
    }, callback);
    view.animate({
        zoom: zoom - zoomOutValue,
        duration: duration / 2
    }, {
        zoom: finalZoom,
        duration: duration / 2
    }, callback);
}

function showInformation() {
    console.log("this is a test")
    


    // var long = document.getElementById('long').innerHTML
    // var lat = document.getElementById('lat').innerHTML

    // var inputValue = document.getElementById('').value;
    // var url = "http://dbpedia.org/resource/sparql"

    // var query2 = [
    //     `select *{<http://dbpedia.org/resource/${inputValue}> dbo:abstract ?abstract}`
    // ].join(" ");

    // var temp2 = url + "?query=" + encodeURIComponent(query2) + "&format=xml"
    // const xhttp = new XMLHttpRequest();
    // xhttp.onload = function () {
    //     var xml = xhttp.responseXML;
    //     document.getElementById('abstract').innerHTML = xml.getElementsByTagName('')
    // }



    // xhttp.open("GET", temp);
    // xhttp.send();
    // console.log(lat)
}
