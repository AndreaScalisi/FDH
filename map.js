const paris_coord = [48.864716, 2.349014];
drawMap(1884)


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
	const mymap = L.map('mapid').setView(L.latLng(paris_coord), 12.4);
	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 20,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11'
	}).addTo(mymap);

	//Overlay ancient map of Paris
	//var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    //imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	//L.imageOverlay(imageUrl, imageBounds).addTo(map);

	drawClusters(mymap, year);
}

//Function to draw the clusters
async function drawClusters(map, year){
	data = await getData(year);
	var markers = L.markerClusterGroup({
		singleMarkerMode: true //Show single elements as clusters of size 1
	});

	for (var i = 0; i < data.lat.length; i++) {
		// Check for NaN values
		lat = data.lat[i];
		long = data.long[i];
		if (lat != NaN && long != NaN) {
			if (checkBounds([lat,long])){	//Check if the addresses is in Paris
				var title = data.names[i];
				if (typeof title != "undefined"){
					title = title.trim()
				}
				var marker = L.marker(new L.LatLng(lat, long), { title: title });
				marker.bindPopup(title);
				markers.addLayer(marker);
			}
		} else {	//Outputs the corresponding name to check errors in the csv file
			console.log(data.names[i]);				
			console.log("Coordinates: " + i)		
			console.log(lat);
			console.log(long);
		}
	}

	map.addLayer(markers);
}

//Function to check the addresses are in Paris
function checkBounds(people_coord){
	inParis = false;
	bound = [49,2.35];
	dist = math.distance(bound, paris_coord);
	dist_people = math.distance(people_coord, paris_coord);

	if (dist_people <= dist){
		inParis = true;
	}

	return inParis;
}