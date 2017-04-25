$(document).ready(function() {
	var x = document.getElementById("demo");

	function getLocation() {
	    if (navigator.geolocation) {
	        navigator.geolocation.getCurrentPosition(showPosition);
	    } else { 
	        x.innerHTML = "Geolocation is not supported by this browser.";
	    }
	}

	function showPosition(position) {
		var latitude = 	position.coords.latitude;
		var longitude = position.coords.longitude;

	    $.ajax({
	    	url : "http://api.wunderground.com/api/a7a0a0da06d892e8/geolookup/conditions/q/"+latitude+","+longitude+".json",
	    	dataType : "jsonp",
	    	success : function(parsed_json) {
		    	var location = parsed_json['location']['city'];
		    	var state = parsed_json['location']['state'];
		    	var temp_f = parsed_json['current_observation']['temp_f'];
		    	var zipCode = parsed_json['current_observation']['display_location']['zip'];
		    	var weatherImage = parsed_json['current_observation']['icon_url'];
		    	var weather = parsed_json['current_observation']['weather'];
		    	fillIn(location,temp_f,zipCode,state, weatherImage, weather);
		    	
	    	}
	    });	

	    $.ajax({
	    	url : "http://api.wunderground.com/api/a7a0a0da06d892e8/forecast10day/q/"+latitude+","+longitude+".json",
	    	dataType : "jsonp",
	    	success : function(parsed_json) {
	    		var forecastArray=parsed_json['forecast']['txt_forecast']['forecastday'];
	    		loopForecast(forecastArray);		    	
	    	}
	    });		    
	}

	function loopForecast(forecastArray){
		for(var i=1;i<forecastArray.length-8;i++){
			if(i%2===0){
				var picture=forecastArray[i]['icon_url'];
				var k=picture.lastIndexOf('k');
				var picture=picture.replace('k','h');
				var forecast=forecastArray[i]['fcttext'];
				var day=forecastArray[i]['title'];
				var days=day.split(' ');
				var newDiv=document.createElement('div');
				var newh3=document.createElement('h3');
				var newh5=document.createElement('h5');
				var forecastImage=document.createElement('img');
				forecastImage.src=picture;
				
				newDiv.classList.add("customSize");
				newDiv.classList.add("col-md-2");
				var forecastText=document.createTextNode(forecast);
				var dayText=document.createTextNode(days[0]);
				newh5.append(forecastText);
				newh3.append(dayText);
				newDiv.append(newh3);
				newDiv.append(forecastImage);
				newDiv.append(newh5);
				var weatherContent=document.getElementById('weatherContent');
				weatherContent.appendChild(newDiv);
			}

		}
	}

	function fillIn(location, temp_f, zipCode, state, weatherImage, weather){
		var temperatureNode = document.getElementById('temperature');
		var locationNode = document.getElementById('location');
		document.getElementById('weatherImage').src=weatherImage;
		document.getElementById('weather').innerHTML=weather;
		temperatureNode.innerHTML=temp_f;
		locationNode.innerHTML=location+ ', '+state+' '+zipCode;

		
	}

	getLocation();
});