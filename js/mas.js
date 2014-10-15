//Not using jQuery because this is a special event for phonegap
//If not firing with this event, phonegap plugins don't work
//
document.addEventListener("deviceready", onDeviceReady, false);
var devicePlatform = device.platform;
var email = "";
var startDate = new Date();
var endDate = new Date();
startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDay, 0, 0, 0, 0, 0);
endDate = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDay, 0, 0, 0, 0, 0);
var title = "Recordar tomarme la presión.";
var location_ = "";
var notes = "Recordar tomarme la presión.";
var success = function (message) {
    //    /alert("Success: " + JSON.stringify(message));
};
var error = function (message) {
    //alert("Error: " + message);
};

function onDeviceReady() {
    initClickCB();
}
function agendarEvento() {
		var success = function(message) { alerta("Agendado: " + JSON.stringify(message)); };
 		 var error = function(message) { alerta("Error: " + message); };
		startDate = new Date(window.yy, window.mm, window.dd, window.hs, window.minut, 0, 0, 0);
        endDate = new Date(window.yy, window.mm, window.dd, window.hs +1, window.minut, 0, 0, 0);
        window.plugins.calendar.createEvent(title, location_, notes, startDate, endDate, success, error);
}

function createEvent() {
	cerrarVentana();
	if(devicePlatform='Android'){
	document.addEventListener("deviceready", agendarEvento, false);
	document.addEventListener("deviceready", elejirHora, false);	
	document.addEventListener("deviceready", elejirDia, false);}
		else{
			 var success = function(message) { alerta("Agendado: " + JSON.stringify(message)); };
 			 var error = function(message) { alerta("Error: " + message); };
			window.plugins.calendar.createCalendar("Mi Presion",success,error);
		}
		
		 		
		
}

function sendMail() {
	window.plugin.email.open({
    to:      [''],
    cc:      [''],
    bcc:     [''],
    subject: '¡Te recomiendo esta aplicación!',
    body:    'Quiero compartir contigo esta aplicación para que puedas controlar tu presión arterial. Descarga la app Mi Presión desde el store de tu teléfono.'
});
}
function abrirVentana(ventana) {
    if (ventana == "1") {
        document.getElementById("cartel").style.visibility = "visible";
        document.getElementById("fondo_negro").style.visibility = "visible";
    } else {
        document.getElementById("cartel").style.visibility = "hidden";;
        document.getElementById("fondo_negro").style.visibility = "hidden";
    }

}

function cerrarVentana() {
    document.getElementById("cartel").style.visibility = "hidden";
    document.getElementById("fondo_negro").style.visibility = "hidden";

}

function initClickCB() {
    $("#amigo").click(sendMail);
	$("#envdatos").click(sendMailDatos);
    $("#permitir").click(createEvent);
    $("#recordatorio").click(function () {
        abrirVentana('1');
    });
    $("#x").click(cerrarVentana);

}
function elejirDia () {
            var options = {
                date: new Date(),
                mode: 'date'
            };

            datePicker.show(options, function (date) {

                d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                window.dd = d.getDate();
                window.mm = d.getMonth();
                window.yy = d.getFullYear();
            });	
        }
function elejirHora () {
            var options = {
                date: new Date(),
                mode: 'time'
            };
            datePicker.show(options, function (date) {
                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), date.getHours(), date.getMinutes(), 0, 0);
                window.hs = d.getHours();
                window.minut = d.getMinutes();
            });
        }
function alerta(txt){
var iframe = document.createElement("IFRAME");
iframe.setAttribute("src", 'data:text/plain,');
document.documentElement.appendChild(iframe);
window.frames[0].window.alert(txt);
iframe.parentNode.removeChild(iframe);
}