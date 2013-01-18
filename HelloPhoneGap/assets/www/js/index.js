/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    
    showInfo: function() {
            $('#props').html('Device Name: ' + device.name + '<br />' + 
            				  'Device PhoneGap: ' + device.phonegap + '<br />' + 
            				  'Device Platform: ' + device.platform + '<br/>' + 
            				  'Device UUID: ' + device.uuid + '<br />' + 
            				  'Device Version: ' + device.version + '<br />');
           console.log('showInfo called');
           
           // camera works from here
           /*
              navigator.camera.getPicture(onSuccess, onFail, { quality: 50, allowEdit:true });
	function onSuccess(imgData) {
		var image = $('#camera_image');
		
		image.src = "data:image/jpeg;base64," + imgData;
	}
	function onFail(message) {
		alert("Failed because: " + message);
	}
	*/
           
           

           		

    
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
       
        
        document.addEventListener('searchbutton', app.onSearchButton, false);
        document.addEventListener('menubutton', app.onMenuButton, false);
        document.addEventListener('backbutton', app.onBackButton, false);
        document.addEventListener('online',app.onOnline,false);
        document.addEventListener('offline',app.onOffline,false);
        
        app.showInfo();
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    
    // Handle the backbutton //
	onBackButton: function() {
		console.log('You hit the back button!');
		alert('You hit the back button!',null,'Back');
	 },
	// Handle the menubutton //
	onMenuButton: function() {
		console.log('You hit the menu button!');
		alert('You hit the menu button!',null,'Menu'); 
	},
	
	// Handle the searchbutton //
	onSearchButton: function() {
		console.log('You hit the search button!');
		alert('You hit the search button!',null,'Search'); 
	},
	
	onOnline: function() {
		console.log('on online');
	},
	
	onOffline: function() {
		console.log('on offline');
	}
	
	
};
