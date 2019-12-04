/*
-------- STRUCTURE --------

-- MAIN FUNCTIONS --

	* drawMap()
	* drawClusters()
	* heatMap()
	* arrondissements()
	* quartiers()
	* wikiSearch()
	* getData()

-- UTILITARY FUNCTIONS --
	
	* drawMarker()
	* popupContent()
	* name_format()
	* checkBounds()
	* coordinates()
*/



//Global variables
const paris_coord = [48.864716, 2.349014];
var markers = L.markerClusterGroup({
	singleMarkerMode: true //Show single elements as clusters of size 1
});
const mymap = L.map('mapid').setView(L.latLng(paris_coord), 12.4);

drawMap(1908, false, false, true, true);

// ---- MAIN FUNCTIONS ----

//Function to draw the map with the clusters
function drawMap(year, cluster = true, heatmap = false, arrs = false, quart = false, style_id = 'mapbox/streets-v11'){
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 20,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: style_id
	}).addTo(mymap);

	//Other possible styles:
		//mapbox/streets-v11
		//mapbox/light-v10
		//mapbox/dark-v10

	//Use TileLayer.WMS to add the georeferenced map (need WMS of the georeferenced map!): https://leafletjs.com/reference-1.6.0.html#tilelayer-wms
		//See tutorial here: https://leafletjs.com/examples/wms/wms.html

	//Overlay ancient map of Paris: https://github.com/kartena/leaflet-tilejson
	//var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    //imageBounds = [[47, 2], [49, 3]];
	//L.imageOverlay(imageUrl, imageBounds).addTo(mymap);

	if (cluster){
		drawClusters(mymap, year);
	}
	if (heatmap){
		heatMap(mymap,year)	
	}
	if (arrs){
		arrondissements(mymap);
	}
	if (quart){
		if (arrs){
			quartiers(mymap, true);
		} else {
			quartiers(mymap);
		}
	}
}

//Function to draw the clusters
async function drawClusters(map, year){
	data = await getData(year);
	for (var i = 0; i < data.lat.length; i++) {
		drawMarker(data.names[i],data.addresses[i],data.lat[i],data.long[i]);
	}
	
	map.addLayer(markers);
}


//Function to draw the heatmap to show the density of famous people in Paris
async function heatMap(map,year){
	data = await getData(year)
	var heat = L.heatLayer(coordinates(data.lat,data.long), 
					{maxZoom: 20, 
					 radius: 25,
					 minOpacity: 0
				});
	heat.addTo(map);
}

//Function to draw the Paris arrondissements on the map
//Data from: https://opendata.paris.fr/explore/dataset/arrondissements/information/?dataChart=eyJxdWVyaWVzIjpbeyJjb25maWciOnsiZGF0YXNldCI6ImFycm9uZGlzc2VtZW50cyIsIm9wdGlvbnMiOnsiYmFzZW1hcCI6Imphd2cuc3RyZWV0cyIsImxvY2F0aW9uIjoiMTIsNDguODUzMDgsMi4yNDk3OSJ9fSwiY2hhcnRzIjpbeyJhbGlnbk1vbnRoIjp0cnVlLCJ0eXBlIjoiY29sdW1uIiwiZnVuYyI6IkFWRyIsInlBeGlzIjoic3VyZmFjZSIsInNjaWVudGlmaWNEaXNwbGF5Ijp0cnVlLCJjb2xvciI6IiMwMDMzNjYifV0sInhBeGlzIjoibl9zcV9hciIsIm1heHBvaW50cyI6NTAsInNvcnQiOiIifV0sInRpbWVzY2FsZSI6IiIsImRpc3BsYXlMZWdlbmQiOnRydWUsImFsaWduTW9udGgiOnRydWV9&location=12,48.8515,2.32979&basemap=jawg.streets
async function arrondissements(map){

	const path = "data/arrondissements_Paris.csv"
	const response = await fetch(path);
	const data = await response.text();
	const arr_number = [];
	const arr_name = [];
	const rows = data.split('\n').slice(1);

	//Extract name and number of the arrondissement
	rows.forEach(row => {
		arr_number.push(row.split(";")[3]);
		arr_name.push(row.split(";")[4]);
	});
	arr_number.pop();
	arr_name.pop();

	//Parsing of the csv file to extract coordinates of the arrondissements
	const coordinates = parse_rows(rows);

	//Draw the arrondissements as polygons
	for (var i = 0; i < coordinates.length; i++) {
		content = "<p><strong>N°: </strong> " + arr_number[i] + "<br /><strong>Name: </strong>" + arr_name[i] + "</p>"
		L.polygon(coordinates[i], {color: 'red', fillOpacity: 0.05}).bindTooltip(content, {opacity: 0.9}).addTo(map);
	}
}

//Function to draw the Paris neighborhoods on the map
//Data from: https://opendata.paris.fr/explore/dataset/quartier_paris/information/?location=12,48.88063,2.34695&basemap=jawg.streets
async function quartiers(map, dashed = false){

	const path = "data/quartier_paris.csv"
	const response = await fetch(path);
	const data = await response.text();
	const quart_number = [];
	const quart_name = [];
	const rows = data.split('\n').slice(1);

	//Extract name of the neighborhood
	rows.forEach(row => {
		quart_name.push(row.split(";")[3]);
	});	
	quart_name.pop();

	//Parsing of the csv file to extract coordinates of the arrondissements
	const coordinates = parse_rows(rows);

	//Draw the arrondissements as polygons
	dash_array = "0"
	if (dashed){
		dash_array = "15"
	}
	for (var i = 0; i < coordinates.length; i++) {
		content = "<p><strong>Name: </strong>" + quart_name[i] + "</p>"
		L.polygon(coordinates[i], {color: 'blue', fillOpacity: 0.05, dashArray: dash_array}).bindTooltip(content, {opacity: 0.9}).addTo(map);
	}
}

//Function to search in Wikipedia for more information on the people 
function wikiSearch(name){
	name = name_format(name)
	//Url for the wiki search: name is the search term
	var url = "https://en.wikipedia.org/w/api.php?action=opensearch&search="+ name.replace(" ", "%20") +"&format=json&callback=?";

	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		success: function(results, status){
			if (results[1].length > 0){
				link = results[3][0]
			} else {
				link = "No results found!"
			}
		},
		error: function(results, status, xhr){
			console.log(status)
		}
	})
}

//Function to parse the data in the csv file
async function getData(year) {
	const path = 'data/final_' + year + '.csv'
	//console.log("Data from: " + path)
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

// ---- UTILITY FUNCTIONS ----

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
	name = name_format(name)
	if (typeof adr != "undefined"){
		adr = adr.trim()
	}
	content = "<p><strong>Name: </strong>" + name + "<br /><strong>Address: </strong>" + adr + "</p>"
	//link = ""
	//wikiSearch(name)
	//content = content + "<br /><strong>More info at</strong>: " + link

    return content;
}

//Function to format the name (Capitalize only first letter of each word)
function name_format(name){
	if (typeof name != "undefined"){
		name = name.trim()
	}	
	name_parts = name.split(" ")
	for (var i = 0; i<name_parts.length; ++i){
		if (name_parts[i].length > 0){
			name_parts[i] = name_parts[i][0].toUpperCase() + name_parts[i].slice(1).toLowerCase()
		}
	}
	name = name_parts.join(" ")
	return name
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

//Function to combine lat & long into coordinates
function coordinates(lat,long){
	coordinates = []
	for (var i = 0; i < lat.length; i++) {
		if (checkBounds([lat[i],long[i]])){
			coordinates.push([lat[i],long[i]])
		}
	}
	return coordinates
}

//Function to extract coordinates from rows (used for quartiers() and arrondissements())
function parse_rows(rows){
	const geometry = [];
	const coordinates = [];

	rows.forEach(row => {
		const start = row.indexOf("{");
		const end = row.indexOf("}");
		geometry.push(row.slice(start,end));
	});
	geometry.forEach(geom => {
		const start = geom.indexOf("[");
		coordinates.push(geom.slice(start).slice(1,geom.length-3));
	});
	coordinates.pop();
	for (var i = 0; i < coordinates.length; i++) {
		coordinates[i] = coordinates[i].replace("[","").split("],");
		for (var j = 0; j < coordinates[i].length; j++) {
			coordinates[i][j] = coordinates[i][j].trim().slice(1);
			coordinates[i][j] = [parseFloat(coordinates[i][j].split(",")[1]), parseFloat(coordinates[i][j].split(",")[0])]
		}
	}
	return coordinates
}