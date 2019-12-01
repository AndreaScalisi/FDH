//Global variables
const paris_coord = [48.864716, 2.349014];
var markers = L.markerClusterGroup({
	singleMarkerMode: true //Show single elements as clusters of size 1
});
const mymap = L.map('mapid').setView(L.latLng(paris_coord), 12.4);

drawMap(1908);


//Function to parse the data in the csv file
async function getData(year) {
	const path = 'data/final_' + year + '.csv'
	console.log("Data from: " + path)
	const response = await fetch(path);
	const data = await response.text();
	const addresses = [];
	const names = [];
	const lat = [];
	const long = [];
	const rows = data.split('\n').slice(1);
	rows.forEach(row => {
	  const cols = row.split(',');
	  addresses.push(cols[0].trim());
	  names.push(cols[1]); //Some names return undefined, so no trim() possible here!
	  lat.push(parseFloat(cols[2]));
	  long.push(parseFloat(cols[3]));
	});
	return { addresses, names, lat, long };
}

//Function to draw the map with the clusters
function drawMap(year){
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 20,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11'
	}).addTo(mymap);

	//Overlay ancient map of Paris: https://github.com/kartena/leaflet-tilejson
	//var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    //imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	//L.imageOverlay(imageUrl, imageBounds).addTo(map);

	drawClusters(mymap, year);
}

//Function to draw the clusters
async function drawClusters(map, year){
	data = await getData(year);
	for (var i = 0; i < data.lat.length; i++) {
		drawMarker(data.names[i],data.addresses[i],data.lat[i],data.long[i]);
	}

	map.addLayer(markers);
}

//Function to draw the markers
function drawMarker(name,adr,lat,long){
	if (checkBounds([lat,long])){	//Check if the address is in Paris
		var marker = L.marker(new L.LatLng(lat, long));
		marker.bindPopup(popupContent(name,adr));
		markers.addLayer(marker);
	}
}

//Function to create the content of the popups (ie relevant information on the person)
function popupContent(name,adr){
	if (typeof name != "undefined"){
		name = name.trim()
	}
	if (typeof adr != "undefined"){
		adr = adr.trim()
	}
	content = "<p><strong>Name:</strong> " + name + "<br /><strong>Address</strong>: " + adr + "</p>"

    return content;
}

//Function to check if the addresses are in Paris
function checkBounds(people_coord){
	inParis = false;
	bound = [49,2.35];
	dist = math.distance(bound, paris_coord);
	dist_people = math.distance(people_coord, paris_coord);

	//Check for NaN values (note math.distance() return NaN if one parameter is NaN)
	if (dist_people != NaN){
		if (dist_people <= dist){
			inParis = true;
		}
	}

	return inParis;
}


//Function to search in Wikipedia for more information on the people
async function wikiSearch(name){
	if (typeof name != "undefined"){
		name = name.trim()
	}
	var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ name +"&format=json&callback=?";

	link = "No results found!"
	$.ajax({
		url: url,
		type: "GET",
		async: true,
		dataType: "json",
		success: function(data, status, jqXHR){
			//Get the first link found
			//console.log(jqXHR.responseJSON[3][0])
			link = jqXHR.responseJSON[3][0]
		}
	})

	return link;
}

async function getUrl(name){
	link = await wikiSearch(name)
	return link
}

test = getUrl("dog")