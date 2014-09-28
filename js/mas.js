//Not using jQuery because this is a special event for phonegap
//If not firing with this event, phonegap plugins don't work
//
document.addEventListener("deviceready", onDeviceReady, false);

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

function createEvent() {

    var options = {
        date: new Date(),
        mode: 'date'
    };

    datePicker.show(options, function (date) {
        var dd = date.getDate();
        var mm = date.getMonth();
        var yy = date.getFullYear();

        startDate = new Date(yy, mm, dd, 0, 0, 0, 0, 0);
        endDate = new Date(yy, mm, dd + 1, 0, 0, 0, 0, 0);
        
        window.plugins.calendar.createEvent(title, location_, notes, startDate, endDate, success, error);
    });

    cerrarVentana();
}

function sendMail() {
    window.plugin.email.open();
}
function sendMailDatos() {
var data = "";
db.transaction(function (tx) {
  tx.executeSql('SELECT * FROM HIST' , [], function (tx, results) {
  var len = results.rows.length, i;
    for (i = 0; i < len; i++) {
      data += results.rows.item(i).text;
    }
  });
});
window.plugin.email.open({
    subject:    "Mis Datos -- App Mi Presion Arterial", // subject of the email
    body:       data, // email body (could be HTML code, in this case set isHtml to true)
}, callback, scope);
}
function abrirVentana(ventana) {
    if (ventana == "1") {
        document.getElementById("cartel").style.visibility = "visible";
        document.getElementById("fondo_negro").style.visibility = "visible";
    }else if (ventana == "4") {
        document.getElementById("cartel2").style.visibility = "visible";
        document.getElementById("fondo_negro").style.visibility = "visible";
    }  else {
        document.getElementById("cartel").style.visibility = "hidden";;
        document.getElementById("fondo_negro").style.visibility = "hidden";
    }

}

function cerrarVentana() {
    document.getElementById("cartel").style.visibility = "hidden";
	document.getElementById("cartel2").style.visibility = "hidden";
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
function datosHistoricos(){
	tx.executeSql('SELECT * FROM HIST', [], function (tx, results) {  
            var len = results.rows.length;  
            var html = [];  
            for (var i = 0; i < rs.rows.length; i++) {
       			 var p = rs.rows.item(i);  
                html.push(parseHistSelect(p.min, p.max, p.note, p.dd, p.mm, p.yy, p.hs, p.minut));  
            }    
        },errorCB);
	return html;
}