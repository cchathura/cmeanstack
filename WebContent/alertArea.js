String.prototype.trim = function() {  
	return this.replace(/^\s+|\s+$/g,"");  
 }
// Global variables
var defaultLatLngZoom, defaultLatLng, defaultLat, defaultLng, deafultZoom;

var map;
var mapCenterLatLng, mapCenterLat, mapCenterLng;
var mapZoom;

var useCircleControlDiv, useCircleControl;
var deleteCircleControlDiv, deleteCircleControl;
var useBoxControlDiv, useBoxControl;
var deleteBoxControlDiv, deleteBoxControl;
var circleParsed = false;
var circle; 								// circle object 
var circleCenterMarker, circleRadiusMarker; // circle markers
var circleCenterLatLng, circleCenterLat, circleCenterLng;
var circleRadiusLatLng, circleRadiusLat, circleRadiusLng;
var circleRadiusMeters, circleRadiusKilometers;
var circleHtml;
var circleBounds;
var circleInfoWindow;
var circleArea;

var boxParsed = false;
var box; 									// box object 
var boxMarker1, boxMarker2;					// box markers
var boxSouth, boxWest, boxNorth, boxEast;
var boxSouthWestLatLng, boxNorthWestLatLng;
var boxNorthEastLatLng, boxSouthEastLatLng;
var boxHtml;
var boxBounds;
var boxInfoWindow;
var boxArea;

function getCircle() {
	// Here because the coordinates in the circle element changed 
	//  or the editor clicked the GetCircle() hyperlink. 
	if(!document.capForm.capCircle.value) { 
		newCircle(); 
		return; 
	}
	var capCircle = document.capForm.capCircle.value.trim(); 
	if(capCircle.length = 0) { 
		newCircle(); 
		return; 
	}
	// The circle value is non-blank, so try to parse the center and radius
	parseCircle(capCircle);  // the parsing will emit alert message for any error
	if(!circleParsed) { 
		return; 
	}
	// Now the circle center and radius are set. Use these to center map on
	// the circle, to set the circle markers, and to trigger "dragend" event.
	resetCircleMap();
	mapCenterLatLng = circleCenterLatLng;
	circleCenterMarker.setPosition(circleCenterLatLng);
	circleRadiusMarker.setPosition(circleRadiusLatLng); // straight north of center
	google.maps.event.trigger(circleRadiusMarker, 'dragend');
	return;
}
function newCircle() {
	// no circle center and radius, so make up one based on mapCenterLatLng and mapZoom
	mapCenterLatLng = map.getCenter();
	mapZoom = map.getZoom();
	circleCenterLatLng = mapCenterLatLng;
	var quarterSpanLng = (map.getBounds().getNorthEast().lng() - map.getBounds().getSouthWest().lng()) / 4;
	circleRadiusLat = circleCenterLatLng.lat()+quarterSpanLng;
	circleRadiusLng = circleCenterLatLng.lng();
	circleRadiusLatLng = new google.maps.LatLng(circleRadiusLat,circleRadiusLng);

	resetCircleMap();
	circleCenterMarker.setPosition(circleCenterLatLng);
	circleRadiusMarker.setPosition(circleRadiusLatLng); // straight north of center
	google.maps.event.trigger(circleRadiusMarker, 'dragend');
	return;
}
function getRectangle() {
	// Here because the coordinates in the polygon element changed 
	//  or the editor clicked the GetRectangle() hyperlink. 
	if(!document.capForm.capPolygon.value) { 
		newBox(); 
		return; 
	}
	var capPolygon = document.capForm.capPolygon.value.trim(); 
	if(capPolygon.length = 0) { 
		newBox(); 
		return; 
	}
	parseBox(capPolygon);  // the parsing will emit alert message for any error
	if(!boxParsed) { 
		return; 
	}
	// Now the box coordinates are set. Use these to center map on 
	// the box, to set the box markers, and to trigger "dragend" event.
	mapCenterLat = boxSouth + ((boxNorth - boxSouth)/2);
	mapCenterLng = boxWest + ((boxEast - boxWest)/2);
	mapCenterLatLng = new google.maps.LatLng(mapCenterLat,mapCenterLng);
	mapZoom = zoomByDegrees(boxEast - boxWest);
	boxSouthWestLatLng = new google.maps.LatLng(boxSouth,boxWest);
	boxNorthEastLatLng = new google.maps.LatLng(boxNorth,boxEast);

	resetBoxMap();
	boxMarker1.setPosition(boxSouthWestLatLng);
	boxMarker2.setPosition(boxNorthEastLatLng);
	google.maps.event.trigger(boxMarker2, 'dragend');
	return;
}
function newBox() {
	// no box coordinates, so make up one based on mapCenterLatLng and mapZoom
	mapCenterLatLng = map.getCenter();
	mapZoom = map.getZoom();
	var quarterSpanLng = (map.getBounds().getNorthEast().lng() - map.getBounds().getSouthWest().lng()) / 4;
	boxSouth = mapCenterLatLng.lat() - quarterSpanLng;
	boxWest = mapCenterLatLng.lng() - quarterSpanLng;
	boxNorth = mapCenterLatLng.lat() + quarterSpanLng;
	boxEast = mapCenterLatLng.lng() + quarterSpanLng;
	boxSouthWestLatLng = new google.maps.LatLng(boxSouth,boxWest);
	boxNorthEastLatLng = new google.maps.LatLng(boxNorth,boxEast);

	resetBoxMap();
	boxMarker1.setPosition(boxSouthWestLatLng);
	boxMarker2.setPosition(boxNorthEastLatLng);
	google.maps.event.trigger(boxMarker2, 'dragend');
	return;
}
function useCircle() {
	var circleLatLngRadius = circleCenterLat+","+circleCenterLng+" "+circleRadiusKilometers;
	parseCircle(circleLatLngRadius);
	if(circleParsed) {
		document.capForm.capCircle.value = circleLatLngRadius;
		makeXML();
	}
}
function useBox() {
	var boxCoordinates = boxSouth+","+boxWest+" "+boxNorth+","+boxWest+" "+
		boxNorth+","+boxEast+" "+boxSouth+","+boxEast+" "+boxSouth+","+boxWest;
	parseBox(boxCoordinates);
	if(boxParsed) {
		document.capForm.capPolygon.value = boxCoordinates;
		makeXML();
	}
}
function deleteCircle() {
	circle.setMap(null);
	circleCenterMarker.setMap(null);
	circleRadiusMarker.setMap(null);
	document.capForm.capCircle.value = "";
	makeXML();
}
function deleteBox() {
	// clear the box markers and the box itself 
	box.setMap(null);
	boxMarker1.setMap(null);
	boxMarker2.setMap(null);
	document.capForm.capPolygon.value = "";
	makeXML();
}
function drawCircle() { 
	circleCenterLatLng = circleCenterMarker.getPosition();
	circleCenterLat = circleCenterMarker.getPosition().lat();
	circleCenterLng = circleCenterMarker.getPosition().lng();
	circleRadiusLatLng = circleRadiusMarker.getPosition();
	circleRadiusMeters = google.maps.geometry.spherical.computeDistanceBetween(circleCenterLatLng,circleRadiusLatLng);
	circleRadiusKilometers = circleRadiusMeters / 1000;
	circleArea = circleRadiusKilometers*circleRadiusKilometers*Math.PI; // Note: this area is planar, not spherical
	circlePrecision(); // set the center, radius, and area decimal points by the radius scale
	circleHtml = "<center><p><b>Circle</b> (drag markers to adjust)<br />center: "+circleCenterLat+","+circleCenterLng+"<br/>"+
		" radius: "+circleRadiusKilometers+" km<br/>area: "+circleArea+" sq.km</p></center>";
	circleInfoWindow.setContent(circleHtml);
	var marker = this;
	circleInfoWindow.open(map, marker);
	circle.setCenter(circleCenterLatLng);
	circle.setRadius(circleRadiusMeters);
}
function drawBox() {
	var boxMarker1LatLng = boxMarker1.getPosition();
	var boxMarker1Lat = boxMarker1LatLng.lat();
	var boxMarker1Lng = boxMarker1LatLng.lng();
	var boxMarker2LatLng = boxMarker2.getPosition();
	var boxMarker2Lat = boxMarker2LatLng.lat();
	var boxMarker2Lng = boxMarker2LatLng.lng();
	if(boxMarker1Lat < boxMarker2Lat) { 
		boxSouth = boxMarker1Lat; boxNorth = boxMarker2Lat; 
	} else { boxSouth = boxMarker2Lat; boxNorth = boxMarker1Lat; }
	if(boxMarker1Lng < boxMarker2Lng) { 
		boxWest = boxMarker1Lng; boxEast = boxMarker2Lng; 
	} else { boxWest = boxMarker2Lng; boxEast = boxMarker1Lng; }
	var boxSouthWestLatLng = new google.maps.LatLng(boxSouth,boxWest);
	var boxNorthWestLatLng = new google.maps.LatLng(boxNorth,boxWest);
	var boxNorthEastLatLng = new google.maps.LatLng(boxNorth,boxEast);
	var boxSouthEastLatLng = new google.maps.LatLng(boxSouth,boxEast);
	boxArea = google.maps.geometry.spherical.computeArea(
			[boxSouthWestLatLng,boxNorthWestLatLng,
			 boxNorthEastLatLng,boxSouthEastLatLng,boxSouthWestLatLng]);	
	boxArea = boxArea / 1000000;    // convert from square meters to square kilometers
	boxPrecision(); // set the coordinates decimal points by the box scale
	boxHtml = '<center><p><b>Box</b> (drag markers to adjust)<br/>south: '+boxSouth+', '+' west: '+boxWest+'<br/>'+
		' north: '+boxNorth+', '+' east: '+boxEast+'<br/>'+
		' area: '+boxArea+' sq. km.</p></center>';
	boxInfoWindow.setContent(boxHtml);
	var marker = this;
	boxInfoWindow.open(map, marker);
	boxBounds = new google.maps.LatLngBounds(boxSouthWestLatLng,boxNorthEastLatLng);
	box.setBounds(boxBounds);
}
function circlePrecision () {
	if(circleRadiusKilometers < 1) { 
		circleRadiusKilometers = circleRadiusKilometers.toFixed(3);
		circleCenterLat = circleCenterLat.toFixed(3);
		circleCenterLng = circleCenterLng.toFixed(3);
		circleArea = circleArea.toFixed(3); 
	} else if(circleRadiusKilometers < 10000) { 
		circleRadiusKilometers = circleRadiusKilometers.toFixed(2); 
		circleCenterLat = circleCenterLat.toFixed(2);
		circleCenterLng = circleCenterLng.toFixed(2);
		circleArea = circleArea.toFixed(2); 
	} else if(circleRadiusKilometers < 100000) { 
		circleRadiusKilometers = circleRadiusKilometers.toFixed(1); 
		circleCenterLat = circleCenterLat.toFixed(1);
		circleCenterLng = circleCenterLng.toFixed(1);
		circleArea = circleArea.toFixed(1); 
	} else { 
		circleRadiusKilometers = circleRadiusKilometers.toFixed(0); 
		circleCenterLat = circleCenterLat.toFixed(0);
		circleCenterLng = circleCenterLng.toFixed(0);
		circleArea = circleArea.toFixed(0); 
	}
}
function boxPrecision () {
	var span;
	span = boxNorth - boxSouth;
	switch (true) {
		case (span < .1):
			boxNorth = boxNorth.toFixed(3);
			boxSouth = boxSouth.toFixed(3);
			break;
		case (span < 1):
			boxNorth = boxNorth.toFixed(2);
			boxSouth = boxSouth.toFixed(2);
			break;
		case (span < 10):
			boxNorth = boxNorth.toFixed(1);
			boxSouth = boxSouth.toFixed(1);
			break;
		default:
			boxNorth = boxNorth.toFixed(0);
			boxSouth = boxSouth.toFixed(0);
	}
	span = boxEast - boxWest;
	switch (true) {
		case (span < .1):
			boxEast = boxEast.toFixed(3);
			boxWest = boxWest.toFixed(3);
			break;
		case (span < 1):
			boxEast = boxEast.toFixed(2);
			boxWest = boxWest.toFixed(2);
			break;
		case (span < 10):
			boxEast = boxEast.toFixed(1);
			boxWest = boxWest.toFixed(1);
			break;
		default:
			boxEast = boxEast.toFixed(0);
			boxWest = boxWest.toFixed(0);
	}
	if(boxArea < .1) {
		boxArea = boxArea.toFixed(3);
	} else if(boxArea < 1) { 
		boxArea = boxArea.toFixed(2);
	} else if(boxArea < 10) { 
		boxArea = boxArea.toFixed(1);
	} else { 
		boxArea = boxArea.toFixed(0);
	}
}
function parseCircle(circleLatLngRadius) {
	var circleValues = circleLatLngRadius.trim();
	var centerAndRadius = circleValues.split(" ");
	if(centerAndRadius.length !== 2) { 
		alert("Error in checking circle: must have 'lat,lng' center and a radius, "+
				"with a space between: " + circleLatLngRadius);
		return;
	}
	circleCenter = centerAndRadius[0];
	LatLng = circleCenter.split(",");
	if(LatLng.length !== 2) { 
		alert("Error in checking circle: 'lat,lng' center must have latitude and longitude "+
				" with a comma between: " + circleLatLngRadius);
		return;
	}
	if(isNaN(LatLng[0])) { 
		alert("Error in checking circle: center latitude is not numeric: " + circleLatLngRadius);
		return;
	}
	if(isNaN(LatLng[1])) { 
		alert("Error in checking circle: center longitude is not numeric: " + circleLatLngRadius);
		return;
	}
	circleCenterLat = parseFloat(LatLng[0]);
	if(circleCenterLat < -90 || circleCenterLat > 90) { 
		alert("Error in checking circle: center latitude is out of range (-90 to 90): " + circleLatLngRadius);
		return;
	}
	circleCenterLng = parseFloat(LatLng[1]);
	if(circleCenterLng < -180 || circleCenterLng > 180) { 
		alert("Error in checking circle: center longitude is out of range (-180 to 180): " + circleLatLngRadius);
		return;
	}
	if(isNaN(centerAndRadius[1])) { 
		alert("Error in checking circle: radius is not numeric: " + circleLatLngRadius);
		return;
	}
	circleCenterLatLng = new google.maps.LatLng(circleCenterLat, circleCenterLng);
	circleRadiusKilometers = parseFloat(centerAndRadius[1]);
	circleRadiusMeters = circleRadiusKilometers * 1000;
	// Compute the radius latitude, due north of the center (same longitude)
	// given that there are 111.13295254 kilometers per degree of latitude on Earth
	circleRadiusLat = circleCenterLat + (circleRadiusKilometers/ 111.13295254 );
	circleRadiusLng = circleCenterLng;
	circleRadiusLatLng = new google.maps.LatLng(circleRadiusLat, circleRadiusLng);
	circleParsed = true;
}
function parseBox(boxCoordinates) {
	boxParsed = false;
/* lat-lon pairs are delimited by a space and the order is: SW NW NE SE SW
 * Within each lat-lon pair, the latitude is followed by a comma then the 
 * longitude. The polygon must have five points defining a bounding box.
 * The north west and south east coordinates must be valid and the south 
 * east and north east corners must match them.
 */
	var thisNorth, thisSouth, thisWest, thisEast;
	var SW, NW, NE, SE, LatLng;
	var boundingBox = boxCoordinates.trim();
	var coordPairs = boundingBox.split(" ");
	if((coordPairs.length !== 4) && (coordPairs.length !== 5))  { 
		alert("Error in checking polygon: must have four or five 'lat,lng' "+
				"coordinate pairs, with one space between each pair: " + boxCoordinates);
		return;
	}
	SW = coordPairs[0];
	if(!checkLatLng(SW,"first",boxCoordinates)) { return;}
	LatLng = SW.split(",");
	thisSouth = parseFloat(LatLng[0]);
	thisWest = parseFloat(LatLng[1]);
	
	NW = coordPairs[1];
	if(!checkLatLng(NW,"second",boxCoordinates)) { return;}
	LatLng = NW.split(",");
	thisNorth = parseFloat(LatLng[0]);
	if (thisWest != parseFloat(LatLng[1])) {
		alert("Error in checking polygon: latitudes of first and second "+
				"coordinate pairs do not match in " + boxCoordinates);
		return;
	}
	
	NE = coordPairs[2];
	if(!checkLatLng(SW,"third",boxCoordinates)) { return;}
	LatLng = NE.split(",");
	if (thisNorth != parseFloat(LatLng[0])) {
		alert("Error in checking polygon: longitudes of second and third "+
				"coordinate pairs do not match in " + boxCoordinates);
		return;
	}
	thisEast = parseFloat(LatLng[1]);

	SE = coordPairs[3];
	if(!checkLatLng(SE,"fourth",boxCoordinates)) { return;}
	LatLng = SE.split(",");
	if (thisSouth != parseFloat(LatLng[0])) {
		alert("Error in checking polygon: latitudes of third and fourth "+
				"coordinate pairs do not match in " + boxCoordinates);
		return;
	}
	if (thisEast != parseFloat(LatLng[1])) {
		alert("Error in checking polygon: longitudes of third and fourth "+
				"coordinate pairs do not match in " + boxCoordinates);
		return;
	}
	if(coordPairs.length == 5)  {
		SW = coordPairs[4];
		if(!checkLatLng(SW,"fifth",boxCoordinates)) { return;}
		LatLng = SW.split(",");
		if (thisSouth != parseFloat(LatLng[0])) {
			alert("Error in checking polygon: latitudes of fourth and fifth "+
					"coordinate pairs do not match in " + boxCoordinates);
			return;
		}
		if (thisWest != parseFloat(LatLng[1])) {
			alert("Error in checking polygon: longitudes of fourth and fifth "+
					"coordinate pairs do not match in " + boxCoordinates);
			return;
		}
	}
	// all coordinate pairs are valid, check on swapping north/south and east/west
	if(thisNorth > thisSouth) {
		boxNorth = thisNorth;
		boxSouth = thisSouth;
	} else {
		alert("swapping-- south: "+thisSouth+" is greater than north: "+thisNorth);
		boxNorth = thisSouth;
		boxSouth = thisNorth;
	}
	if(thisEast > thisWest) {
		boxWest = thisWest;
		boxEast = thisEast;
	} else {
		alert("swapping-- west: "+thisWest+" is greater than east: "+thisEast);
		boxWest = thisEast;
		boxEast = thisWest;
	}
	boxParsed = true;
}
function checkLatLng (coordPair,pairOrder,boxCoordinates) {
	LatLng = coordPair.split(",");
	if(LatLng.length !== 2) { 
		alert("Error in checking polygon: missing comma for "+
				pairOrder+" coordinate pair in " + boxCoordinates);
		return false;
	}
	if(isNaN(LatLng[0])) { 
		alert("Error in checking polygon: latitude not numeric for "+
				pairOrder+" coordinate pair in " + boxCoordinates);
		return false;
	}
	var thisLat = parseFloat(LatLng[0]);
	if(thisLat < -90 || thisLat > 90) { 
		alert("Error in checking polygon: latitude out of range for "+
				pairOrder+" coordinate pair in " + boxCoordinates);
		return false;
	}
	if(isNaN(LatLng[0])) { 
		alert("Error in checking polygon: longitude not numeric for "+
				pairOrder+" coordinate pair in " + boxCoordinates);
		return false;
	}
	var thisLng = parseFloat(LatLng[1]);
	if(thisLng < -180 || thisLng > 180) { 
		alert("Error in checking polygon: longitude out of range for "+
				pairOrder+" coordinate pair in " + boxCoordinates);
		return false;
	}
	return true;
}
function degreesbyZoom(zoomLevel) {
  // these figures are approximate
  switch (true) {
	case (zoomLevel <= 13): 
		return .086;
		break;
	case (zoomLevel == 12): 
		return .172;
		break;
	case (zoomLevel == 11): 
		return .344;
		break;
	case (zoomLevel == 10): 
		return .688;
		break;
	case (zoomLevel == 9): 
		return 1.37;
		break;
	case (zoomLevel == 8): 
		return 2.75;
		break;
	case (zoomLevel == 7): 
		return 5.5;
		break;
	case (zoomLevel == 6): 
		return 11.2;
		break;
	case (zoomLevel == 5): 
		return 22.5;
		break;
	case (zoomLevel == 4): 
		return 45;
		break;
	case (zoomLevel == 2): 
		return 90;
		break;
	case (zoomLevel == 1): 
		return 180;
		break;
	default:
		return .05;
  }
}
function zoomByDegrees(degreesLongitude) {
  // these figures are approximate
	var degrees = Math.abs(degreesLongitude);
  switch (true) {
	case (degrees < .086): 
		return 12;
		break;
	case (degrees < .172): 
		return 11;
		break;
	case (degrees < .344): 
		return 10;
		break;
	case (degrees < .68): 
		return 9;
		break;
	case (degrees < 1.37): 
		return 8;
		break;
	case (degrees < 2.75): 
		return 7;
		break;
	case (degrees < 5.5): 
		return 6;
		break;
	case (degrees < 11.2): 
		return 5;
		break;
	case (degrees < 22.5): 
		return 4;
		break;
	case (degrees < 45): 
		return 3;
		break;
	case (degrees < 90): 
		return 2;
		break;
	case (degrees < 180): 
		return 1;
		break;
	default:
		return 1;
  }
}
function initMap() {
	var splitDefaultLatLng = document.capForm.defaultLatLng.value.split(",");
	defaultLat = parseFloat(splitDefaultLatLng[0]).toFixed(4);
	defaultLng = parseFloat(splitDefaultLatLng[1]).toFixed(4);
	mapCenterLatLng = new google.maps.LatLng(defaultLat,defaultLng);
	mapZoom = parseInt(document.capForm.defaultZoom.value);
	var mapOptions = {
		'zoom': mapZoom,
		'center': mapCenterLatLng,
		'mapTypeId': google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

	addMapControls();

	circle = new google.maps.Circle({ 
		map: map,
		strokeColor: "#F33F00",
		strokeWeight: 2,
		strokeOpacity: 1,
		fillColor: "#FF000",
		fillOpacity: 0.1
		});
	circleInfoWindow = new google.maps.InfoWindow;
	circleCenterMarker = new google.maps.Marker({
		map: map,
		draggable: true,
		title: 'center: drag to move circle'
	});
	circleRadiusMarker = new google.maps.Marker({
		map: map,
		draggable: true,
		title: 'radius: drag to resize circle'
		}); 
	google.maps.event.addListener(circleCenterMarker, 'dragend', drawCircle);
	google.maps.event.addListener(circleRadiusMarker, 'dragend', drawCircle);

	// box stuff
	box = new google.maps.Rectangle({
		map: map,
		strokeColor: "#F33F00",
		strokeWeight: 2,
		strokeOpacity: 1,
		fillColor: "#FF000",
		fillOpacity: 0.1
		});
	boxInfoWindow = new google.maps.InfoWindow;
	boxMarker1 = new google.maps.Marker({
		map: map,
		draggable: true,
		title: 'box corner'
		});
	boxMarker2 = new google.maps.Marker({
		map: map,
		draggable: true,
		title: 'box corner'
		});
	google.maps.event.addListener(boxMarker1, 'dragend', drawBox);
	google.maps.event.addListener(boxMarker2, 'dragend', drawBox);
}
function addMapControls () {
	// add a button to delete the box as drawn on the map
	deleteBoxControlDiv = document.createElement('div');
	deleteBoxControl = new deleteBoxControl(deleteBoxControlDiv, map);
	deleteBoxControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(deleteBoxControlDiv);
	// add a button to accept the Box as drawn on the map
	useBoxControlDiv = document.createElement('div');
	useBoxControl = new useBoxControl(useBoxControlDiv, map);
	useBoxControlDiv.index = 2;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(useBoxControlDiv);
	// add a button to make a new Box on the map
	newBoxControlDiv = document.createElement('div');
	newBoxControl = new newBoxControl(newBoxControlDiv, map);
	newBoxControlDiv.index = 3;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(newBoxControlDiv);
	// add a button to delete the circle as drawn on the map
	deleteCircleControlDiv = document.createElement('div');
	deleteCircleControl = new deleteCircleControl(deleteCircleControlDiv, map);
	deleteCircleControlDiv.index = 4;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(deleteCircleControlDiv);
	// add a button to accept the circle as drawn on the map
	useCircleControlDiv = document.createElement('div');
	useCircleControl = new useCircleControl(useCircleControlDiv, map);
	useCircleControlDiv.index = 5;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(useCircleControlDiv);
	// add a button to make a new circle on the map
	newCircleControlDiv = document.createElement('div');
	newCircleControl = new newCircleControl(newCircleControlDiv, map);
	newCircleControlDiv.index = 6;
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(newCircleControlDiv);
}
function newCircleControl(newCircleDiv, map) {
	// Set padding to offset the control from the other controls
	newCircleDiv.style.padding = '2px';
	// Set CSS for the control border
	var newCircleUI = document.createElement('div');
	newCircleUI.style.backgroundColor = 'white';
	newCircleUI.style.borderStyle = 'solid';
	newCircleUI.style.borderWidth = '1px';
	newCircleUI.style.cursor = 'pointer';
	newCircleUI.style.textAlign = 'center';
	newCircleUI.title = 'Draw circle for alerting area';
	newCircleDiv.appendChild(newCircleUI);
	// Set CSS for the control interior
	var newCircleText = document.createElement('div');
	newCircleText.style.paddingLeft = '2px';
	newCircleText.style.paddingRight = '2px';
	newCircleText.style.width = '40px';
	newCircleText.innerHTML = 'New circle';
	newCircleUI.appendChild(newCircleText);
	// add onclick behavior for the control
	google.maps.event.addDomListener(newCircleUI, 'click', newCircle);
}
function useCircleControl(useCircleDiv, map) {
	// Set padding to offset the control from the other controls
	useCircleDiv.style.padding = '2px';
	// Set CSS for the control border
	var useCircleUI = document.createElement('div');
	useCircleUI.style.backgroundColor = 'white';
	useCircleUI.style.borderStyle = 'solid';
	useCircleUI.style.borderWidth = '1px';
	useCircleUI.style.cursor = 'pointer';
	useCircleUI.style.textAlign = 'center';
	useCircleUI.title = 'Use circle as an alerting area';
	useCircleDiv.appendChild(useCircleUI);
	// Set CSS for the control interior
	var useCircleText = document.createElement('div');
	useCircleText.style.paddingLeft = '2px';
	useCircleText.style.paddingRight = '2px';
	useCircleText.style.width = '40px';
	useCircleText.innerHTML = 'Use circle';
	useCircleUI.appendChild(useCircleText);
	// add onclick behavior for the control
	google.maps.event.addDomListener(useCircleUI, 'click', useCircle);
}
function deleteCircleControl(deleteCircleDiv, map) {
	// Set padding to offset the control from the other controls
	deleteCircleDiv.style.padding = '2px';
	// Set CSS for the control border
	var deleteCircleUI = document.createElement('div');
	deleteCircleUI.style.backgroundColor = 'white';
	deleteCircleUI.style.borderStyle = 'solid';
	deleteCircleUI.style.borderWidth = '1px';
	deleteCircleUI.style.cursor = 'pointer';
	deleteCircleUI.style.textAlign = 'center';
	deleteCircleUI.title = 'Delete circle as an alerting area';
	deleteCircleDiv.appendChild(deleteCircleUI);
	// Set CSS for the control interior
	var deleteCircleText = document.createElement('div');
	deleteCircleText.style.paddingLeft = '2px';
	deleteCircleText.style.paddingRight = '2px';
	deleteCircleText.style.width = '40px';
	deleteCircleText.innerHTML = 'Delete circle';
	deleteCircleUI.appendChild(deleteCircleText);
	// add onclick behavior for the control
	google.maps.event.addDomListener(deleteCircleUI, 'click', deleteCircle);
}
function newBoxControl(newBoxDiv, map) {
	// Set padding to offset the control from the other controls
	newBoxDiv.style.padding = '2px';
	// Set CSS for the control border
	var newBoxUI = document.createElement('div');
	newBoxUI.style.backgroundColor = 'white';
	newBoxUI.style.borderStyle = 'solid';
	newBoxUI.style.borderWidth = '1px';
	newBoxUI.style.cursor = 'pointer';
	newBoxUI.style.textAlign = 'center';
	newBoxUI.title = 'Draw box for alerting area';
	newBoxDiv.appendChild(newBoxUI);
	// Set CSS for the control interior
	var newBoxText = document.createElement('div');
	newBoxText.style.paddingLeft = '2px';
	newBoxText.style.paddingRight = '2px';
	newBoxText.style.width = '40px';
	newBoxText.innerHTML = 'New box';
	newBoxUI.appendChild(newBoxText);
	// add onclick behavior for the control
	google.maps.event.addDomListener(newBoxUI, 'click', newBox);
}
function resetBoxMap() {
	if (box.Map == null) { box.setMap(map); };
	if (boxMarker1.Map == null) { boxMarker1.setMap(map); };
	if (boxMarker2.Map == null) { boxMarker2.setMap(map); };
}
function resetCircleMap() {
	if (circle.Map == null) { circle.setMap(map); };
	if (circleCenterMarker.Map == null) { circleCenterMarker.setMap(map); };
	if (circleRadiusMarker.Map == null) { circleRadiusMarker.setMap(map); };
}
function useBoxControl(useBoxDiv, map) {
	// Set padding to offset the control from the other controls
	useBoxDiv.style.padding = '2px';
	// Set CSS for the control border
	var useBoxUI = document.createElement('div');
	useBoxUI.style.backgroundColor = 'white';
	useBoxUI.style.borderStyle = 'solid';
	useBoxUI.style.borderWidth = '1px';
	useBoxUI.style.cursor = 'pointer';
	useBoxUI.style.textAlign = 'center';
	useBoxUI.title = 'Use box as an alerting area';
	useBoxDiv.appendChild(useBoxUI);
	// Set CSS for the control interior
	var useBoxText = document.createElement('div');
	useBoxText.style.paddingLeft = '2px';
	useBoxText.style.paddingRight = '2px';
	useBoxText.style.width = '40px';
	useBoxText.innerHTML = 'Use box';
	useBoxUI.appendChild(useBoxText);
	// add onclick behavior for the control
	google.maps.event.addDomListener(useBoxUI, 'click', useBox);
}
function deleteBoxControl(deleteBoxDiv, map) {
	// Set padding to offset the control from the other controls
	deleteBoxDiv.style.padding = '2px';
	// Set CSS for the control border
	var deleteBoxUI = document.createElement('div');
	deleteBoxUI.style.backgroundColor = 'white';
	deleteBoxUI.style.borderStyle = 'solid';
	deleteBoxUI.style.borderWidth = '1px';
	deleteBoxUI.style.cursor = 'pointer';
	deleteBoxUI.style.textAlign = 'center';
	deleteBoxUI.title = 'Delete box as an alerting area';
	deleteBoxDiv.appendChild(deleteBoxUI);
	// Set CSS for the control interior
	var deleteBoxText = document.createElement('div');
	deleteBoxText.style.paddingLeft = '2px';
	deleteBoxText.style.paddingRight = '2px';
	deleteBoxText.style.width = '40px';
	deleteBoxText.innerHTML = 'Delete box';
	deleteBoxUI.appendChild(deleteBoxText);
	// add onclick behavior for the control
	google.maps.event.addDomListener(deleteBoxUI, 'click', deleteBox);
}
