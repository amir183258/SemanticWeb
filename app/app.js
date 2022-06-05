getValueInput = () => {
    const userInputBox = document.getElementById("userInput")
    var userInput = userInputBox.value;
    userInputBox.value = "";

    var inputValue = userInput.charAt(0).toUpperCase() + userInput.slice(1);

    var url = "https://dbpedia.org/sparql";
    var query = [
        `select * { <http://dbpedia.org/resource/${inputValue}> geo:lat ?lat ; geo:long ?long }`
    ].join(" ");
    var temp = url + "?query=" + encodeURIComponent(query) + "&format=xml"

    const xhttp = new XMLHttpRequest();
    xhttp.onload= function () {
        var xmlResponseFromDBPedia= xhttp.response;

        parser = new DOMParser();
        parsedXmlResponseFromDBPedia = parser.parseFromString(xmlResponseFromDBPedia, "text/xml");

        try {
            responseLat = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[0].childNodes[0].nodeValue;
            responseLong = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[1].childNodes[0].nodeValue;
        }
        catch (e){
            inputValue = responseLat = responseLong = false;
        }
        finally {
        displayCoordinates(inputValue, responseLat, responseLong);
        }
    }
    xhttp.open("GET", temp);
    xhttp.send();
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
