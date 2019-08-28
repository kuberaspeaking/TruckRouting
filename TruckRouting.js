/**
 * Boilerplate map initialization code starts below:
 */

// set up containers for the map  + panel

let M = {
    'Init': { // developer.here.com for app_id and app_code
        "apikey": "12zohpgEZ_pIGMu7srJ2sZ-im4kj0yN245n3s-l2IJA",
        "useHTTPS": true
    }
    };
    
    var mapContainer = document.getElementById('map-truck');
    
    var platform = new H.service.Platform(M.Init);
    
    var defaultLayers = platform.createDefaultLayers();
    
    
    
    //Step 2: initialize a map - this map is centered over Berlin
    var map = new H.Map(mapContainer,
      defaultLayers.vector.normal.map,{
      center: {lat:52.99053, lng:11.67124},
      zoom: 13
    });
    
    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    
    //Step 6: Create "Capture" button and place for showing the captured area
    // var resultContainer = document.getElementById('panel');
    
    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);
    // Get an instance of the routing service:

    calculateTruckRouteFromAtoB();
      
function calculateTruckRouteFromAtoB () {
    var router = platform.getRoutingService(),
      routeRequestParams = {
        mode: 'fastest;truck;',
        representation: 'display',
        routeattributes : 'no,lg',
        RouteLegAttributeType: 'wp,mn',
        maneuverattributes: 'direction,action',
        waypoint0: '51.0535,13.74079', 
        waypoint1: '54.07906,12.13216',  
      };

// Define a callback function to process the routing response:
var onSuccess = function(result) {
    var route,
    routeShape,
    startPoint,
    endPoint,
    linestring;
    if(result.response.route) {
    // Pick the first route from the response:
    route = result.response.route[0];
    // Pick the route's shape:
    routeShape = route.shape;
  
    // Create a linestring to use as a point source for the route line
    linestring = new H.geo.LineString();
  
    // Push all the points in the shape into the linestring:
    routeShape.forEach(function(point) {
    var parts = point.split(',');
    linestring.pushLatLngAlt(parts[0], parts[1]);
    });
  
    // Retrieve the mapped positions of the requested waypoints:
    startPoint = route.waypoint[0].mappedPosition;
    endPoint = route.waypoint[1].mappedPosition;
  
    // Create a polyline to display the route:
    var routeLine = new H.map.Polyline(linestring, {
    style: { strokeColor: 'blue', lineWidth: 3 }
    });
  
    // Create a marker for the start point:
    var startMarker = new H.map.Marker({
    lat: startPoint.latitude,
    lng: startPoint.longitude
    });
  
    // Create a marker for the end point:
    var endMarker = new H.map.Marker({
    lat: endPoint.latitude,
    lng: endPoint.longitude
    });
  
    // Add the route polyline and the two markers to the map:
    map.addObjects([routeLine, startMarker, endMarker]);
  
    // Set the map's viewport to make the whole route visible:
    map.getViewModel().setLookAtData({bounds: routeLine.getBoundingBox()});
    }
  };

    router.calculateRoute(
      routeRequestParams,
      onSuccess,
      function(error) {
    alert(error.message);
    });
  }

    
    