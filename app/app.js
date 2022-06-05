getValueInput = () => {
    var userInput = document.getElementById("search").value;
    var inputValue = userInput.charAt(0).toUpperCase() + userInput.slice(1);

    // console.log(inputValue)
    var url = "https://dbpedia.org/sparql";
    var query = [
        `select * { <http://dbpedia.org/resource/${inputValue}> geo:lat ?lat ; geo:long ?long }`
    ].join(" ");
    var temp = url + "?query=" + encodeURIComponent(query) + "&format=xml"
    console.log(temp);

    // console.log(temp)

    const xhttp = new XMLHttpRequest();
    xhttp.onload= function () {
        var xmlResponseFromDBPedia= xhttp.response;

        parser = new DOMParser();
        parsedXmlResponseFromDBPedia = parser.parseFromString(xmlResponseFromDBPedia, "text/xml");

        responseLat = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[0].childNodes[0].nodeValue;
        responseLong = parsedXmlResponseFromDBPedia.getElementsByTagName('literal')[1].childNodes[0].nodeValue;

        document.getElementById('lat').innerHTML = responseLat;
        document.getElementById('long').innerHTML = responseLong;
    }

    xhttp.open("GET", temp);
    xhttp.send();
}
