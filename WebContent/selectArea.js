	if(!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/, '')
		};
	}
	var drawingManager;
	var selectedShape;
	var polygonKnown = false;
	var polygonPathArray;
	var polygonVertexLatLng, polygonVertexLat, polygonVertexLng;
	var polygonHtml;
	var polygonBounds;
	var polygonInfoWindow;
	var polygonArea;
	var circleKnown = false;
	var circleLatLngRadius;
	var circleCenterLatLng, circleCenterLat, circleCenterLng;
	var circleRadiusMeters, circleRadiusKilometers;
	var circleHtml;
	var circleBounds;
	var circleInfoWindow;
	var circleArea;

	function clearSelection() {
		if (selectedShape) {
			selectedShape.setEditable(false);
			selectedShape = null;
		}
	}

	function setSelection(shape) {
		clearSelection();
		selectedShape = shape;
		shape.setEditable(true);
	}

	function deleteSelectedShape() {
		if (selectedShape) {
			selectedShape.setMap(null);
		}
	}

	function getCoordinates() {
		if(selectedShape) {
			switch(selectedShape.type) {
				case "circle":
				 circleCenterLatLng = selectedShape.getCenter();
				 circleCenterLat = circleCenterLatLng.lat();
				 circleCenterLng = circleCenterLatLng.lng();
				 circleRadiusMeters = selectedShape.getRadius();
				 circleRadiusKilometers = circleRadiusMeters / 1000;
				 circleLatLngRadius = circleCenterLat+","+circleCenterLng+" "+circleRadiusKilometers;
				 circleParse();
				 document.capForm.capCircle.value = circleCenterLat+","+circleCenterLng+" "+circleRadiusKilometers;
				 //message = "center: " + circleCenterLat + "," + circleCenterLng + "<br>" +
				 //					"radius: " + circleRadiusKilometers;
				 break;
			 case "polygon":
				 polygonParse();
				 message = "coordinates: " + polygonPathArray;
				 break;
			}// end switch
			//document.getElementById("debug").innerHTML +=	"<br><b>type: " + selectedShape.type + "</b><br>";
			//document.getElementById("debug").innerHTML += message + "<br>";
		} else {
			alert("Please select a shape.")
		} // end selectedShape if
	}// end getCoordinates

	function polygonParse() {
		polygonPathArray = selectedShape.getPath().getArray();
		if (polygonPathArray.length < 1) {
			alert("Polygon is not valid as it contains no coordinates.");		
		}
		var northernmost = polygonPathArray[0].lat();	
		var southernmost = polygonPathArray[0].lat();	
		var easternmost = polygonPathArray[0].lng();	
		var westernmost = polygonPathArray[0].lng();
		for (key in polygonPathArray) {
			polygonVertexLat = polygonPathArray[key].lat();
			polygonVertexLng = polygonPathArray[key].lng();
			if (polygonVertexLat > northernmost) { northernmost = polygonVertexLat; }
			if (polygonVertexLat < southernmost) { southernmost = polygonVertexLat; }
			if (polygonVertexLng > easternmost) { easternmost = polygonVertexLng; }
			if (polygonVertexLng < westernmost) { westernmost = polygonVertexLng; }
		}
		var leastSpan;
		if ((northernmost - southernmost) < (easternmost - westernmost)) {
			leastSpan = northernmost - southernmost;
		} else {
			leastSpan = easternmost - westernmost;
		}
		var polygonPathPrecise = "";	
		switch (true) {
			case (leastSpan < .1):
				for (key in polygonPathArray) {
					polygonVertexLat = polygonPathArray[key].lat().toFixed(3);
					polygonVertexLng = polygonPathArray[key].lng().toFixed(3);
					polygonPathPrecise += " " + polygonVertexLat + "," + polygonVertexLng;
				}
				break;
			case (leastSpan < 1):
				for (key in polygonPathArray) {
					polygonVertexLat = polygonPathArray[key].lat().toFixed(2);
					polygonVertexLng = polygonPathArray[key].lng().toFixed(2);
					polygonPathPrecise += " " + polygonVertexLat + "," + polygonVertexLng;
				}
				break;
			case (leastSpan < 10):
				for (key in polygonPathArray) {
					polygonVertexLat = polygonPathArray[key].lat().toFixed(1);
					polygonVertexLng = polygonPathArray[key].lng().toFixed(1);
					polygonPathPrecise += " " + polygonVertexLat + "," + polygonVertexLng;
				}
				break;
			default:
				for (key in polygonPathArray) {
					polygonVertexLat = polygonPathArray[key].lat().toFixed(0);
					polygonVertexLng = polygonPathArray[key].lng().toFixed(0);
					polygonPathPrecise += " " + polygonVertexLat + "," + polygonVertexLng;
				}
		} // end of switch
		document.capForm.capPolygon.value = polygonPathPrecise;
		//document.getElementById("debug").innerHTML += key + "<br>";
		//document.getElementById("debug").innerHTML += arPath + "<br>---------------<br>";
	}

	function circleParse() {
		circleKnown = false;
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
		circleArea = circleRadiusKilometers*circleRadiusKilometers*Math.PI; // Note: this area is planar, not spherical
	    circleRadiusMeters = circleRadiusKilometers * 1000;
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
		circleKnown = true;
	}

	function initialize() {
		var defaultLat = 22.344;
		var defaultLng = 114.048;
		var mapCenterLatLng = new google.maps.LatLng(defaultLat,defaultLng);
		var mapZoom = 10;
		var map = new google.maps.Map(document.getElementById('map_canvas'), {
			zoom: mapZoom,
			center: mapCenterLatLng,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
			mapTypeControl: true,
			zoomControl: true
		});
		var polyOptions = {
			strokeWeight: 2,
			fillOpacity: 0.1,
			editable: true,
			strokeColor: "#F33F00",
			fillColor: "#FF0000"
		};
		// Creates a drawing manager attached to the map that allows the user to draw
		// markers, lines, and shapes.
		drawingManager = new google.maps.drawing.DrawingManager({
			drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER,
			drawingModes: [
				google.maps.drawing.OverlayType.CIRCLE,
				google.maps.drawing.OverlayType.POLYGON
			]},
			drawingMode: google.maps.drawing.OverlayType.POLYGON,
			rectangleOptions: polyOptions,
			circleOptions: polyOptions,
			polygonOptions: polyOptions,
			map: map
		});
		google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
			if (e.type != google.maps.drawing.OverlayType.MARKER) {
				// Switch back to non-drawing mode after drawing a shape.
				drawingManager.setDrawingMode(null);
				// Add an event listener that selects the newly-drawn shape when the user
				// mouses down on it.
				var newShape = e.overlay;
				newShape.type = e.type;
				google.maps.event.addListener(newShape, 'click', function() {
					setSelection(newShape);
				});
				setSelection(newShape);
			}
		});
		// Clear the current selection when the drawing mode is changed, or when the
		// map is clicked.
		google.maps.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);
		google.maps.event.addListener(map, 'click', clearSelection);
		google.maps.event.addDomListener(document.getElementById('delete-button'), 'click', deleteSelectedShape);
		google.maps.event.addDomListener(document.getElementById('coordinates-button'), 'click', getCoordinates);
	}
	google.maps.event.addDomListener(window, 'load', initialize);
