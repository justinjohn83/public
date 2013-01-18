
$(document).ready(function() {
	showMap();	
}
);
function showMap() {



           // geolocation
           var options = {enableHighAccuracy: true,timeout:5000};
           navigator.geolocation.getCurrentPosition(
           		function(position) {
           			$('#location').html(
           					'Latitute: ' + position.coords.latitude + '<br />' +
           					'Longitude: ' + position.coords.longitude + '<br/>' + 
           					'Accuracy: ' + position.coords.accuracy + 'm <br/>');
           		
           		           		$('#map_canvas').gmap().bind('init', function(ev, map) {
	           		// In the callback you can use "this" to call a function (e.g. this.get('map') instead of $('#map_canvas').gmap('get', 'map'))
					$('#map_canvas').gmap({'callback': function() {
						$('#map_canvas').gmap('addMarker',{'position': position.coords.latitude + ',' + position.coords.longitude, 'bounds': true}).click(
							function() {
								self.openInfoWindow({'content': 'Me!'}, this);
							});
					}});
				});
           				
           			
           		},
           		
           		function(error) {
           			$('#location').html('ERROR (' + error.code + '): ' + error.message);
           		
           		},
           		
           		options);		

}