$(document).ready(onDeviceReady);
//var devicePlatform = device.platform;// - "Android" - "iOS"
//Global database
//
var db;

// PhoneGap is ready
//
function onDeviceReady() {
    var dbSize = 200000;
    var dbName = "TMD";
    var dbVersion = "1.0";
    var dbDisplayName = "TMDDatabase";
	//alert("Empieza");
    //Init DB
    //
    db = window.openDatabase(dbName, dbVersion, dbDisplayName, dbSize);
    db.transaction(initDB, errorCB, successCB);
	db.transaction(initDB, errorCB, successCBM);

}

// Init the table
//
function initDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS HIST (id unique, max, min, note, dd, mm, yy, hs, minut)');
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
    //Select query
    //
    db.transaction(selectHist, errorCB);
}

function selectHist(tx) {
    tx.executeSql('SELECT * FROM HIST ORDER BY yy DESC ,mm DESC ,dd DESC ,hs DESC ,minut DESC', [], querySuccess, errorCB);
}

function querySuccess(tx, rs) {
    // this will be empty since no rows were inserted.

    for (var i = 0; i < rs.rows.length; i++) {
        var p = rs.rows.item(i);

        var element = parseHistSelect(p.min, p.max, p.note, p.dd, p.mm, p.yy, p.hs, p.minut);
        //alert(element);
        $(".historial").append(element);
    }
}
function colorMaxHist(val){
if(val<140){return '#72AB6B'}
else if(val>140){return "#C54746"}
else{return "#FC3"}}

function colorMinHist(val){
if(val<90){return '#72AB6B'}
else if(val>90){return "#C54746"}
else{return "#FC3"}}

function parseHistSelect(min, max, note, dd, mm, yy, hs, minut) {
if(note == "" || note == null || note == "---") {
    return '<div class="historial_item"><div class="texto"><div class="fecha">' + dd + '-' + parMes(mm) + '-' + parAno(yy) + ' ' + hs + ':' + minut + 'hs </div><strong><a style="color:'+colorMaxHist(max)+'">' + max + '</a> / ' + '<a style="color:'+colorMinHist(min)+'">' +  min + '</a> mmHg</strong></div></div>';
    
} else {
    return '<div class="historial_item"><div class="texto"><div class="fecha">' + dd + '-' + parMes(mm) + '-' + parAno(yy) + ' ' + hs + ':' + minut + 'hs </div><strong><a style="color:'+colorMaxHist(max)+'">' + max + '</a> / ' + '<a style="color:'+colorMinHist(min)+'">' +  min + '</a> mmHg</strong> - Nota: ' + note + '</div></div>';
}
}
function parseHistSelectM(min, max, note, dd, mm, yy, hs, minut) {
if(note == "" || note == null || note == "---") {
    return dd + '-' + parMes(mm) + '-' + parAno(yy) + ' ' + hs + ':' + minut + ',' + max + ' / ' + min + ', ,'+"\n";
    
} else {
    return dd + '-' + parMes(mm) + '-' + parAno(yy) + ' ' + hs + ':' + minut + ',' + max + ' / ' + min + ',' + note + "\n";
}
}
// Email
function successCBM() {
    //alert("Success!");
    //Select query
    //
    db.transaction(selectHistM, errorCB);
}
function selectHistM(tx) {
    tx.executeSql('SELECT * FROM HIST ORDER BY yy DESC ,mm DESC ,dd DESC ,hs DESC ,minut DESC', [], querySuccessM, errorCB);
}

function querySuccessM(tx, rs) {
    // this will be empty since no rows were inserted.

    for (var i = 0; i < rs.rows.length; i++) {
        var p = rs.rows.item(i);

        var element = parseHistSelectM(p.min, p.max, p.note, p.dd, p.mm, p.yy, p.hs, p.minut);
        //alert(element);
        $("#resumen_oculto").append(element);
    }
}
function parMes(mes){
	if(mes==1){return 'ene';}
	if(mes==2){return 'feb';}
	if(mes==3){return 'mar';}
	if(mes==4){return 'abr';}
	if(mes==5){return 'may';}
	if(mes==6){return 'jun';}
	if(mes==7){return 'jul';}
	if(mes==8){return 'ago';}
	if(mes==9){return 'sep';}
	if(mes==10){return 'oct';}
	if(mes==11){return 'nov';}
	if(mes==12){return 'dic';}
}
function parAno(ano){
	return (ano-2000);
}
function sendMailDatos() {
	var datos="Fecha, Medicion, Nota \n";//"data:text/csv;charset=utf-8,Fecha,Medicion,Nota,\n";
	datos+=document.getElementById("resumen_oculto").innerHTML;
	datos=chauTildes(datos);
	var enc = window.btoa(datos);
	window.plugin.email.open({
	subject:     'Mi Historial',
	body:    'Quiero compartir contigo mi historial de presión arterial.'+"\r\n \r\n \r\n"+' Esta información fue compartida desde la aplicación “Mi Presión”, una herramienta de Tu Medicina Digital. ',
    attachments: ['base64:misdatospresion.csv//'+enc]
});
}
function chauTildes(name){
    // the characters i'm looking for in a string:
    var charList = ["á","é","í","ó","ú"];

    // the characters i'd like to replace them with:
    var replaceList = ["a","e","i","o","u"];

    var limit = name.length;
    for (i = 0; i < limit; i++){
        for(var j in charList){
            if (name.charAt(i) === charList[j])
    name = name.replace(name.charAt(i), replaceList[j]);
        }
    }

    return name;
}
function alerta(txt){
var iframe = document.createElement("IFRAME");
iframe.setAttribute("src", 'data:text/plain,');
document.documentElement.appendChild(iframe);
window.frames[0].window.alert(txt);
iframe.parentNode.removeChild(iframe);
}