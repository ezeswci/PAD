$(document).ready(onDeviceReady);
var db;
var d = new Date();
// PhoneGap is ready
//
function onDeviceReady() {
    $("#aclaracion_max").hide();
    $("#aclaracion_min").hide();

    var dbSize = 200000;
    var dbName = "TMD";
    var dbVersion = "1.0";
    var dbDisplayName = "TMDDatabase";

    //Init DB
    //
    db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
    db.transaction(initDB, errorCB, successCB);

    initClickCB();

    //Init with actual date
    //
    var f = new Date();
    var dd = f.getDate();
    var mm = f.getMonth();
    var yy = f.getFullYear();
    var hs = f.getHours();
    var minut = f.getMinutes();
    var dateAuxString = dateParser(dd, mm, yy);
    var timeAuxString = timeParser(hs, minut);
    $("#date").text(dateAuxString);
    $("#time").text(timeAuxString);
}

// Init the table
//
function initDB(tx) {
    // DROP:
    //
    //tx.executeSql('DROP TABLE IF EXISTS HIST');

    tx.executeSql('CREATE TABLE IF NOT EXISTS HIST (id unique, max, min, note, dd, mm, yy, hs, minut)');
}

function insertHist(tx) {
    var max = $("#max").val();
    var min = $("#min").val();
    var note = $("#note").val();
	// --Franco sos un flashero--
	var dia = document.getElementById("date").innerHTML;
	var tiempo = document.getElementById("time").innerHTML; 
    var dd = dia.substring(0,2);
    var mm = dia.substring(3,5);
    var yy = dia.substring(6,10);
    var hs = tiempo.substring(0,2);
    var minut = tiempo.substring(3,5);
	//alert(dia+ tiempo);
	//alert((dd) + "+" + (mm) + "+" + (yy));
	//alert ((hs) + ":" + (minut) + "hs");
    var query = 'INSERT INTO HIST (max, min, note, dd, mm, yy, hs, minut) VALUES (?,?,?,?,?,?,?,?)';

    tx.executeSql(query, [max, min, note, dd, mm, yy, hs, minut]);

    //
    //User msg
    //
	setTimeout(function(){cleanForm();}, 2400);
    abrirVentana(1);
}

// Transaction error callback
//
function errorCB(tx, err) {
    alert("Error processing SQL: " + err);
}

// Transaction success callback
//
function successCB() {
    //alert("Success!");
}

// Alerts CB
//

function abrirVentana(ventana) {
    if (ventana == "1") {
        document.getElementById("cartel").style.visibility = "visible";
        document.getElementById("cartel2").style.visibility = "hidden";
        document.getElementById("fondo_negro").style.visibility = "visible";
    } else if (ventana == "2") {
        document.getElementById("cartel").style.visibility = "hidden";
        document.getElementById("cartel2").style.visibility = "visible";
        document.getElementById("fondo_negro").style.visibility = "visible";
    } else {
        document.getElementById("cartel").style.visibility = "hidden";
        document.getElementById("cartel2").style.visibility = "hidden";
        document.getElementById("fondo_negro").style.visibility = "hidden";
    }

}

function cerrarVentana() {
    document.getElementById("cartel").style.visibility = "hidden";
    document.getElementById("cartel2").style.visibility = "hidden";
    document.getElementById("fondo_negro").style.visibility = "hidden";
}

function dateParser(dd, mm, yy) {
    mm = mm + 1;
    return (conCeros(dd) + "-" + conCeros(mm) + "-" + conCeros(yy));
}
function timeParser(hs, minut) {
    return (conCeros(hs) + ":" + conCeros(minut) + "hs");
}
function conCeros(val){
	if(val<=9){return ("0"+val);}
	else{return val;}
}
function cleanForm() {
    window.location.href="datos.html";
}

function verif() {
    var max = $("#max").val();
    var min = $("#min").val();
    var note = $("#note").val();
    var date = $("#date").text();
    var time = $("#time").text();

    if (!($.isNumeric(max)) || !($.isNumeric(min))) {
        alert("MAX y MIN deben ser valores numéricos.");
        return false;
    }
    if (date == "dd-mm-aa") {
        alert("Debes ingresar una fecha valida.");
        return false;
    }
    if (time == "hh:mm") {
        alert("Debes ingresar una hora valida.");
        return false;
    }
	if (note == null) {
        alert("El campo Notas no puede quedar vacio, ingrese una opción");
        return false;
    }

    if (max == "" || min == "" || max == "---" || min == "---" || max == null || min == null) {
        $("#aclaracion_max").show();
        $("#aclaracion_min").show();

        return false;
    } else {

        //MAX (sistólica) – entre 70 y 270 mmHg
        //MIN (diastólica) – entre 40 y 140 mmHg
        if (max < 70 || max > 270) {
            $("#aclaracion_max").show();
            return false;
        }

        if (min < 40 || min > 140) {
            $("#aclaracion_min").show();
            return false;
        }

    }

    return true;
}

function initClickCB() {
    //OnClick CB
    //
    $(".i").click(function () {
        abrirVentana('2');
    });
    $("#x").click(function () {
        cerrarVentana();
    });
    $("#max").focus(function () {
        $("#max").val("");
        $("#aclaracion_max").hide();
        $("#aclaracion_min").hide();
    });
    $("#min").focus(function () {
        $("#min").val("");
        $("#aclaracion_max").hide();
        $("#aclaracion_min").hide();
    });

    $("#note").focus(function () {
        $("#note").val("");
        $("#aclaracion_max").hide();
        $("#aclaracion_min").hide();
    });

    $("#guardarButton").click(
        function () {
            if (verif()) {
                //SQL insert
                //
                db.transaction(insertHist, errorCB, successCB);
            }
        });

    $("#borrarButton").click(
        function () {
            cleanForm();
        });

    $("#date").click(
        function () {
            var options = {
                date: new Date(),
                mode: 'date'
            };

            datePicker.show(options, function (date) {
				var aux= new Date();
				var ddd = aux.getDate();
                var mmm = aux.getMonth();
                var yyy = aux.getFullYear();

                d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
                var dd = d.getDate();
                var mm = d.getMonth();
                var yy = d.getFullYear();
				//alert("Elec:"+dd+mm+yy+"-Sis:"+ddd+mmm+yyy);
				if((yyy<yy)||(yyy==yy && mmm<mm )||(yyy==yy && mmm==mm && ddd<dd )){
					var dateAuxString = dateParser(ddd, mmm, yyy);
					$("#date").text(dateAuxString);
					alert("No es posible ingresar fechas Futuras");
				}else{

                var dateAuxString = dateParser(dd, mm, yy);
                //var hourAuxString = timeParser(hs, minut);
				
                $("#date").text(dateAuxString);}}
                //$("#time").text(hourAuxString);
            );	
        }
		);

    $("#time").click(

        function () {
            var options = {
                date: new Date(),
                mode: 'time'
            };

            datePicker.show(options, function (date) {

                d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), date.getHours(), date.getMinutes(), 0, 0);
                //var dd = d.getDate();
                //var mm = d.getMonth();
                //var yy = d.getFullYear();
                var hs = d.getHours();
                var minut = d.getMinutes();
				
                //var dateAuxString = dateParser(dd, mm, yy);
                var hourAuxString = timeParser(hs, minut);
                //$("#date").text(dateAuxString);
                $("#time").text(hourAuxString);
            });
        });
}