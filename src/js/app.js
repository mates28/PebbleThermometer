var UI = require('ui');
var ajax = require('ajax');
var vibe = require('ui/vibe');
var Vector2 = require('vector2');

var device_name = "Teploměr";
var device_version = '1.0.6';
var action = false;

var DEVICE_ID = "Your Device ID";//FROM PARTICLE DEVICE IDE
var ACCESS_TOKEN = "Your Access Token";//FROM PARTICLE ACCESS TOKEN

var dataNum = 1;
var data1 = 'IntTemp';
var data2 = 'IntHumid';
var data3 = 'Presure';
var data4 = 'Altitude';
var data5 = 'ExtTemp';

var txt1 = 'Vnitřní templota';
var txt2 = 'Vnitřní vlhkost';
var txt3 = 'Atmosferický tlak';
var txt4 = 'Nadmořská výška';
var txt5 = 'Venkovní teplota';

var ico1 = 'images/teplomer-symbol.png';
var ico2 = 'images/vlhkost-symbol.png';
var ico3 = 'images/tlak-symbol.png';
var ico4 = 'images/vyska-symbol.png';
var ico5 = 'images/teplomer-symbol.png';

console.log(device_name + " aplikace startuje");


var main_window = new UI.Window();


//static text for buttons
var up = new UI.Image({
  position: new Vector2(146, 15),
  size: new Vector2(20, 20),
  image: 'images/up-symbol.png'
});

var circle = new UI.Circle({
  position: new Vector2(144, 84),
  radius: 10,
  backgroundColor: 'white',
});

var down = new UI.Image({
  position: new Vector2(146, 133),
  size: new Vector2(20, 20),
  image: 'images/down-symbol.png'
});

var txtHeaderLabel = new UI.Text({
    position: new Vector2(0, -2),
    size: new Vector2(144, 28),
    font: 'Gothic 24 Bold',
    text: 'Teploměr',
    textAlign: 'center',
    color: 'white'
});

var txtFooterLabel = new UI.Text({
    position: new Vector2(0, 150),
    size: new Vector2(144, 30),
    font: 'Gothic 14',
    text: 'Version ' + device_version,
    textAlign: 'center',
    color: 'white'
});

var image = new UI.Image({
  position: new Vector2(52, 40),
  size: new Vector2(40, 40),
  image: eval('ico'+dataNum)
});

var txtStatus = new UI.Text({
	position: new Vector2(0, 84),
	size: new Vector2(144, 28),
	font: 'Gothic 28 Bold',
	//font: 'Bitham 30 Black',
	text: '',
	textAlign: 'center',
	color: 'white'
});

var txtStatusEnd = new UI.Text({
	position: new Vector2(0, 120),
	size: new Vector2(144, 14),
	font: 'Gothic 14 Bold',
	text: eval('txt'+dataNum),
	textAlign: 'center',
	color: 'white'
});

main_window.add(txtHeaderLabel);
main_window.add(up);
main_window.add(image);
main_window.add(down);
main_window.add(txtStatus);
main_window.add(txtStatusEnd);
main_window.add(circle);
main_window.add(txtFooterLabel);  

main_window.show();


//initialization
DoGet(eval('data'+dataNum),'Načítám');


//***************************
//*** FUNCTIONS *************
  
function DoGet(variable_name,txtString){
  console.log("DoGet(): " + new Date().getTime());  
  
  //display card
	txtStatus.text(txtString);
	//
	txtStatusEnd.text(eval('txt'+dataNum));
	image.image(eval('ico'+dataNum));
	//
	if (dataNum <= 1) {
		up.position(new Vector2(146, 15));
	} else {
		up.position(new Vector2(136, 15));
	}
	if (dataNum >= 5) {
		down.position(new Vector2(146, 133));
	} else {
		down.position(new Vector2(136, 133));
	}
  
  //make url based on function being called and device tokens
  var URL = 'https://api.particle.io/v1/devices/' + DEVICE_ID + '/' + variable_name +'?access_token=' + ACCESS_TOKEN; //identify which sparkcore and function
  
  //log data being used
  console.log("variable_name: " + variable_name);
  console.log("URL: " + URL);
  
  ajax(
    {
      url: URL,
			method: 'get',
      type: 'json'
    },
    function(data) {
      // Success
      console.log("Success: " + JSON.stringify(data));
      vibe.vibrate('short');
      // Show to user
      
      if(variable_name==data1){
       	txtStatus.text(data.result + " °C");
      }else if(variable_name==data2){
        txtStatus.text(data.result + " %");
      }else if(variable_name==data3){
        txtStatus.text(data.result + " hPa");
      }else if(variable_name==data4){
        txtStatus.text(data.result + " m");
      }else if(variable_name==data5){
        txtStatus.text(data.result + "  °C");
      }
			action = true;
    },
    function(error) {
      // Failure
      console.log('Failed: ' + error.toString());
      txtStatus.text("CHYBA");
			action = true;
    }
  );
  
  console.log("Comleted DoGet(): " + new Date().getTime());  
}

main_window.on('click', 'select', function(e) {
	if (action == true) {
		action = false;
  	console.log("click select"); 
  	DoGet(eval('data'+dataNum),"Aktualizuji");
	}
});

main_window.on('click', 'up', function(e) {
	if (action == true) {
		if (dataNum > 1) {
			dataNum = dataNum-1;
			action = false;
			console.log("click down | dataNum = "+dataNum);
			DoGet(eval('data'+dataNum),"Načítám");
		} else {
			console.log("click down");
		}
	}
});

main_window.on('click', 'down', function(e) {
	if (action == true) {
		if (dataNum < 5) {
			dataNum = dataNum+1;
			action = false;
			console.log("click down | dataNum = "+dataNum);
			DoGet(eval('data'+dataNum),"Načítám");
		} else {
			console.log("click down");
		}
	}
});