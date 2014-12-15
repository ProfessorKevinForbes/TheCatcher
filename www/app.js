/**
 * Final Project CSCI N300 - Mobile Applications
 * Matheus Barcelos de Oliveira
 */


function Entry(Lgn, Lat){
	this.tmsp = new Date();
	this.Lgn = Lgn;
	this.Lat = Lat;
}

function Queue(size){
	this.lim = size;
	this.elements = [];
	
	this.add = function(Lat, Lgn){
		if(this.elements.length >= this.lim){
			this.elements.shift();
		}
		this.elements.push(new Entry(Lgn, Lat));
	}
	
	this.resize = function(newsize){
		if(newsize < this.elements.length){
			this.elements.splice(0,this.elements.length-newsize);
		}		
		this.lim = newsize;	
	}
	
	this.show = function(){
		var h = "<tr><th>Latitude</th> <th>Longitude</th> <th>Time</th></tr>";
		for(var i = this.elements.length - 1; i>=0;i--){
			h = h + "<tr><th>"+this.elements[i].Lat+"</th>"+
						"<th>"+this.elements[i].Lgn+"</th>"+
						"<th>"+this.elements[i].tmsp.getHours()+":"+this.elements[i].tmsp.getMinutes()+":"+this.elements[i].tmsp.getSeconds()+"</th></tr>";
		}
		return h;	
	}
	
	this.getPos = function(){
		var h = "";
		for(var i = this.elements.length - 1; i>=0;i--){
			h = h + this.elements[i].Lat+" "+
					this.elements[i].Lgn+" "+
					this.elements[i].tmsp.getHours()+":"+this.elements[i].tmsp.getMinutes()+":"+this.elements[i].tmsp.getSeconds()+"\n";
		
		}
		return h;
	}
}


var Positions;
var number;
var watchID;
var locked;
var locked_position;
var last_send;
var send_period;



function Lock(){
	if(locked){
		locked=false;
		document.getElementById("lock").innerHTML="Lock";
		
	}
	else{
		locked=true;
		locked_position.Lat = Positions.elements[Positions.elements.length-1].Lat;
		locked_position.Lgn = Positions.elements[Positions.elements.length-1].Lgn;
		delete last_send;
		document.getElementById("lock").innerHTML="Unlock";
	}
}

function onSuccess(p){
	Positions.add(p.coords.latitude,p.coords.longitude);
	if(locked){
		if(Math.abs(p.coords.latitude-locked_position.Lat)>0.0005||
		   Math.abs(p.coords.longitude-locked_position.Lgn)>0.0005){
			if(typeof(last_send) == "undefined"){
					last_send = new Date();
					window.location.href = "sms:" + number + "?body=" + "Cell phone is moving! Here goes a table of its positions: \n"+ Positions.getPos();
			}
			else{
				if((new Date()).getTime()-last_send.getTime()>send_period){
					delete last_send;
					last_send = new Date();
					window.location.href = "sms:" + number + "?body=" + "Cell phone is moving"+ Positions.getPos();
				}
			}
		}
	}
	else{	
		document.getElementById("tbl").innerHTML=Positions.show();
	}
}

function onError(error){
	document.getElementById("Page").innerHTML = "<p> Problem!"+error+"</p>";
}


function SaveConfigs(){
	number = document.getElementById("number").value;
	if(number.length==10){
		Positions.resize(document.getElementById("sizeoflist").value);
		locked = false;
		document.getElementById("Page").innerHTML = "<button id=\"lock\" onclick=\"Lock();\">Lock</button>" + "<button onclick=\"Configure()\" class=\"special\">Configure</button>" +
													"<br/><center><table id=\"tbl\"><tr><th>Latitude</th> <th>Longitude</th> <th>Time</th></tr></table></center>";
		document.getElementById("Hd").innerHTML ="<div class=\"title\"><img src=\"img/icon.png\"/>The Catcher</div>";
		watchID = navigator.geolocation.watchPosition(onSuccess, onError, {timeout:30000});	
	}
	else{
		alert("Number must be 10 digits long");
	}
}

function Configure(){
	document.getElementById("Page").innerHTML= "<center>"+
				"Contact number:"+
				"<input id=\"number\""+number+"\"/>"+
				"<br/><br/>"+
				"Send Period:"+
				"<select id=\"sendperiod\">"+
					"<option value=\"5\">5 min</option>"+
					"<option value=\"10\">10 min</option>"+
					"<option value=\"30\">30 min</option>"+
				"</select>"+
				"<br/><br/>"+
				"List Size:"+
				"<select id=\"sizeoflist\">"+
					"<option value=\"5\">5</option>"+
					"<option value=\"10\">10</option>"+
					"<option value=\"25\">25</option>"+
					"<option value=\"50\">50</option>"+
					"<option value=\"100\">100</option>"+
				"</select>"+
				"<br/><br/>"+
				"<button onclick=\"SaveConfigs()\"/>"+
				"Save"+
				"</button>"+
			"</center>";
	navigator.geolocation.clearWatch(watchID);
	watchID=null;
}


function Ready(){
	number = document.getElementById("number").value;
	if(number.length==10){
		Positions = new Queue(document.getElementById("sizeoflist").value);
		locked = false;
		locked_position = {Lat:0, Lgn:0};
		send_period = document.getElementById("sendperiod").value * 60000;
		watchID = navigator.geolocation.watchPosition(onSuccess, onError, {timeout:30000});	
		document.getElementById("Page").innerHTML = "<button id=\"lock\" onclick=\"Lock();\">Lock</button>" + "<button onclick=\"Configure()\" class=\"special\">Configure</button>" +
													"<br/><center><table id=\"tbl\"><tr><th>Latitude</th> <th>Longitude</th> <th>Time</th></tr></table></center>";
		document.getElementById("Hd").innerHTML ="<div class=\"title\"><img src=\"img/icon.png\"/>The Catcher</div>";
	}
	else{
		alert("Number must be 10 digits long");
	}
}