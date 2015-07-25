function hacerReporte(filename, data) {
   try {
      netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
   } catch (e) {
      //salert("permiso denegado");
   }
   var file = Components.classes["@mozilla.org/file/local;1"]
      .createInstance(Components.interfaces.nsILocalFile);
   file.initWithPath( filename );
   if ( file.exists() == false ) {
      file.create( Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 420 );
   }
   var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
      .createInstance( Components.interfaces.nsIFileOutputStream );

   var PR_RDONLY  =     0x01
   var PR_WRONLY  =     0x02
   var PR_RDWR    =     0x04
   var PR_CREATE_FILE = 0x08
   var PR_APPEND  =     0x10
   var PR_TRUNCATE=     0x20
   var PR_SYNC    =     0x40
   var PR_EXCL    =     0x80

   outputStream.init( file, PR_RDWR | PR_CREATE_FILE | PR_APPEND, 420, 0 );
   var result = outputStream.write( data, data.length );
   outputStream.close();
}

//  DECLARACIÃ“N DE OBJETOS
function tiempo (segundos) {
  var codigo = "CODE:\n";
    codigo += "WAIT SECONDS= "+segundos+"\n";
  iimPlay(codigo);
}
function Contratos (serv) {
  var Procesado = 0;
  this.Servicios = serv;
  this.getProcesado = function () {
    return Procesado;
  }
  this.setProcesado = function (dato) {
    Procesado = dato;
  }
}
function Tareas () {
  var Tare = new Array();
    Tare [0] = "Acceder al Sistema CUENTAME";
    Tare [1] = "Desvincular Beneficiarios"; 
    Tare [2] = "Vincular UDS";
    Tare [3] = "Verificar Beneficiarios";
    Tare [4] = "Ingresar Beneficiarios";
    Tare [5] = "Vincular Beneficiarios a UDS";
    Tare [6] = "Ingresar Peso && Talla";
    Tare [7] = "Modificar fechas de Nac";
    Tare [8] = "Modificar Etnia";
    Tare [9] = "Modificar SISBEN Y FAMILIAS EN ACCION";
    Tare [10] = "Modificar Discapacidad";
    Tare [11] = "Puntaje SISBEN";
    Tare [12] = "Victimas";
    Tare [13] = "Modificar residencia";
    Tare [14] = "INGRESAR ACUDIENTE";
    Tare [15] = "INGRESAR DIRECCION";
  this.getTare = function (pos) {
    return Tare[pos];
  }
  this.Longitud = function () {
    return Tare.length
  }
}
Tareas.prototype.mostrarMenu = function() {
  var opcion = prompt("Ingrese la actividad a Desarrollar: "+"\n"+"\n"+"[0] "+this.getTare(0)+"\n"+"[1]  "+this.getTare(1)+"\n"+"[2]  "+this.getTare(2)+"\n"+"[3]  "+this.getTare(3)+"\n"+"[4]  "+this.getTare(4)+"\n"+"[5]  "+this.getTare(5)+"\n"+"[6]  "+this.getTare(6)+"\n"+"[7]  "+this.getTare(7)+"\n"+"[8]  "+this.getTare(8)+"\n"+"[9]  "+this.getTare(9)+"\n"+"[10]  "+this.getTare(10)+"\n"+"[11]  "+this.getTare(11)+"\n"+"[12]  "+this.getTare(12)+"\n"+"[13]  "+this.getTare(13)+"\n"+"[14]  "+this.getTare(14)+"\n"+"[15]  "+this.getTare(15),"");
    switch (opcion) {
        case "0":
            accederCuentame();
          break
        case "1":
          _desvincularBeneficiarios();
          //  buscarContrato();
          break
        case "2":
            VincularUDS();
          break
        case "3":
            buscarBeneficiarios();
          break
        case "4":
          guardarBeneficiarios ();
          break
        case "5":
          vincularBeneficiarios();
          break
        case "6":
          cargarUDS();
          break
        case "7":
            modificarFnac();
          break
        case "8":
            modificarEtnia();
          break
        case "9":
            modificar_FA();
          break
        case "10":
          modificarDiscapacidad();
          break
        case "11":
          IngresarPuntaje();
          break
        case "12":
          Ingresarvictima();
          break
        case "13":
          modificar_Residencia();
          break
        case "14":
          agregarAcudiente();
          break
        case "15":
          agregarDireccion();
          break
        default:
            break
    } 
}

function HTTPGET(url) {
  var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
  async = false;
  request.open('GET', url, async);
  request.send();
  if (request.status !== 200) {
    var message = 'an error occurred at url: ' + url + ', status: ' + request.status;
    return message;
  }
  return request.response;
}
function Ruta () {
  var direccion = new  Array();
    direccion[0]="https://rubonline.icbf.gov.co/Page/RUBONLINE/CONTRATO/List.aspx";//Buscar contratos
    direccion[1]="https://rubonline.icbf.gov.co/Page/RUBONLINE/CONTRATO/Detail.aspx";//Detalles del contrato
    direccion[2]="https://rubonline.icbf.gov.co/Page/RubOnline/ServicioContratado/List.aspx";//Lista de servicio
    direccion[3]="https://rubonline.icbf.gov.co/Page/RUBONLINE/UNIDADSERVICIO/List.aspx";//BUSCADOR UDS
    direccion[4]="https://rubonline.icbf.gov.co/Page/RubOnline/UnidadServicioContrato/List.aspx";//
    direccion[5]="https://rubonline.icbf.gov.co/Page/RUBONLINE/BENEFICIARIO/List.aspx";
    direccion[6]="https://rubonline.icbf.gov.co/Page/RubOnline/VincularUDSContrato/List.aspx";
  this.getDireccion = function (pos) {
    return direccion[pos];
  }
}

function modificarFnac(){
  var hoy = new Date().toJSON().slice(0,10);
  var datosJson =  HTTPGET('http://localhost/lucy/fnac.json');
  var respuesta = JSON.parse(datosJson);
  var resultado = "TIPO_ID;NUMERO_ID;FECHA_NACIMIENTO;ESTADO\r\n";
   hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_Estado_Beneficiarios_"+hoy+".csv",resultado);
   resultado ="";
  var ejecutor;
  var Url = new Ruta();
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].Documento+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "SET !TIMEOUT_STEP 20"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/edit.gif"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaExpideDocumento_txtFecha CONTENT="+respuesta[i].fechaExpedicion+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaRecepFiscalRegistroCivil_txtFecha CONTENT=04/05/2015"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaNacimiento_txtFecha CONTENT="+respuesta[i].FechaNacimiento+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    ejecutor = iimPlay(codigo);
      if (ejecutor < 0) {
        errtext = iimGetLastError();
        iimDisplay(errtext);
        resultado ="";
        resultado += respuesta[i].TipoDocumento+";"+respuesta[i].Documento+";"+respuesta[i].FechaNacimiento+";"+"NO MODIFICADA\r\n";
        hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_Estado_Beneficiarios_"+hoy+".csv",resultado);
      };
  }

}

function IngresarPuntaje(){
  var hoy = new Date().toJSON().slice(0,10);
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/sisben.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
    codigo += "SET !TIMEOUT_STEP 20"+"\n";
    switch(respuesta[i].tipoId){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].numeroId+"\n";
    iimDisplay(respuesta[i].numeroId);
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/edit.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPuntajeSisben CONTENT="+respuesta[i].puntaje+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaRecepFiscalRegistroCivil_txtFecha CONTENT=04/02/2015"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    iimPlay(codigo);
    }
  }
function Ingresarvictima(){
  var ejecutor;
  var hoy = new Date().toJSON().slice(0,10);
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/victimas.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var aux = "CODE:\n";
      aux += "URL GOTO="+Url.getDireccion(5)+"\n";
      aux += "SET !TIMEOUT_STEP 20"+"\n";
      switch(respuesta[i].tipoId){
          case "RC":
            aux += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
            break;
          case "CC":
            aux += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
            break;
          case "TI":
            aux += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
            break;
          default:
            break;
      }
      aux += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].numeroId+"\n";
      iimDisplay(respuesta[i].numeroId);
      aux += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
      aux += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
      aux += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%6"+"\n";
      aux += "SET !TIMEOUT_STEP 1"+"\n";
      aux += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
      ejecutor = iimPlay(aux);
      if (ejecutor < 0) {
          edit();
      }else{
        add();
      };
    }
  }
      function add() {
         var codigo = "CODE:\n";
         // codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
          codigo += "SET !TIMEOUT_STEP 10"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbVictimaConflicto_1"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbDesplazamientoForzado_1"+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
        iimPlay(codigo);
      };
      function edit(){
        var codigo = "CODE:\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/edit.gif"+"\n";
          codigo += "SET !TIMEOUT_STEP 10"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbVictimaConflicto_1"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbDesplazamientoForzado_1"+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
        iimPlay(codigo);
      };      

function modificarEtnia(){
  var ejecutor;
  var hoy = new Date().toJSON().slice(0,10);
  var resultado = "TIPO_ID;NUMERO_ID;ESTADO\r\n";
   hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_ETNIA_Beneficiarios_"+hoy+".csv",resultado);
   resultado ="";
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/etnia.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
    codigo += "SET !TIMEOUT_STEP 2"+"\n";
    switch(respuesta[i].TIPO_ID){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_ID+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%1"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlGrupoEtnico CONTENT=%8"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    ejecutor = iimPlay(codigo);
      if (ejecutor < 0) {
        errtext = iimGetLastError();
        iimDisplay(errtext);
        resultado ="";
        resultado += respuesta[i].TipoDocumento+";"+respuesta[i].Documento+";"+"NO MODIFICADA\r\n";
        hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_ETNIA_Beneficiarios_"+hoy+".csv",resultado);
      };
  }
}
function agregarAcudiente(){
  var ejecutor;
  var hoy = new Date().toJSON().slice(0,10);
  var resultado = "TIPO_ID;NUMERO_ID;ESTADO\r\n";
   hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_acudiente_Beneficiarios_"+hoy+".csv",resultado);
   resultado ="";
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/acudiente.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
    codigo += "SET !TIMEOUT_STEP 20"+"\n";
    switch(respuesta[i].TIPO_ID){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_ID+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%5"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTipoResponsabilidad CONTENT=%1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdParentesco CONTENT=%"+respuesta[i].TIPO_ACUDIENTE+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%"+respuesta[i].TIPO_ID_ACUDIENTE+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_ID_ACUDIENTE+"\n";
    //codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoExpideDoc CONTENT=%10"+"\n";
    //codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioExpideDoc CONTENT=%432"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPrimerNombre CONTENT="+respuesta[i].NOMBRE+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPrimerApellido CONTENT="+respuesta[i].APELLIDO+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSegundoApellido CONTENT="+respuesta[i].APELLIDO2+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    ejecutor = iimPlay(codigo);
      if (ejecutor < 0) {
        errtext = iimGetLastError();
        iimDisplay(errtext);
        resultado ="";
        resultado += respuesta[i].TipoDocumento+";"+respuesta[i].Documento+";"+"NO INGRESADO\r\n";
        hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_acudiente_Beneficiarios_"+hoy+".csv",resultado);
      };
  }
}
function agregarDireccion(){
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/direccion.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
    codigo += "SET !TIMEOUT_STEP 20"+"\n";
    switch(respuesta[i].tipoId){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].numeroId+"\n";
    iimDisplay(respuesta[i].numeroId);
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/edit.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_txtDireccionResidencia_rbtnDetalleZonaGeo_0"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtDireccionResidencia_txtDireccion CONTENT="+respuesta[i].direccion+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    iimPlay(codigo);
    }
}
function modificarDiscapacidad(){
  var ejecutor;
  var hoy = new Date().toJSON().slice(0,10);
  var resultado = "TIPO_ID;NUMERO_ID;ESTADO\r\n";
   hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_DISCAP_Beneficiarios_"+hoy+".csv",resultado);
   resultado ="";
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/disca.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
    codigo += "SET !TIMEOUT_STEP 20"+"\n";
    switch(respuesta[i].TipoDocumento){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].Documento+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%3"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTieneDiscapacidad CONTENT=%N"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    ejecutor = iimPlay(codigo);
      if (ejecutor < 0) {
        errtext = iimGetLastError();
        iimDisplay(errtext);
        resultado ="";
        resultado += respuesta[i].TipoDocumento+";"+respuesta[i].Documento+";"+"NO MODIFICADA\r\n";
        hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_DISCAP_Beneficiarios_"+hoy+".csv",resultado);
      };
  }
}
function modificar_FA (){
  var datosJson =  HTTPGET('http://localhost/lucy/flia.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RUBONLINE/BENEFICIARIO/List.aspx"+"\n";
    switch(respuesta[i].TIPO_ID){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_ID+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/edit.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlBeneficiarioSisbenizado CONTENT=%S"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlPerteneceFamiliasAccion CONTENT=%S"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPuntajeSisben CONTENT="+respuesta[i].PUNTAJE+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaRecepFiscalRegistroCivil_txtFecha CONTENT=04/05/2014"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    iimPlay(codigo);
  }
}
function modificar_Residencia (){
  var datosJson =  HTTPGET('http://localhost/lucy/residencia.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i <= respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RUBONLINE/BENEFICIARIO/List.aspx"+"\n";
    switch(respuesta[i].TIPO_ID){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
    }
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_ID+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/edit.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdPaisResidencia CONTENT=%41"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoResidencia CONTENT=%"+respuesta[i].DEPARTAMENTO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioResidencia CONTENT=%"+respuesta[i].MUNICIPIO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlEstratoHogar CONTENT=%1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlZonaUbicacion CONTENT=%C"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_txtDireccionResidencia_rbtnDetalleZonaGeo_0"+"\n";
    codigo += "WAIT SECONDS=1"+"\n"
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtDireccionResidencia_txtDireccion CONTENT="+respuesta[i].DIRECCION_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    iimPlay(codigo);
  }
}
function buscarBeneficiarios () {
  var hoy = new Date().toJSON().slice(0,10);
  var Url = new Ruta();
   var datosJson =  HTTPGET('http://localhost/lucy/datos.json');
   var respuesta = JSON.parse(datosJson);
   var resultado = "TIPO_ID;NUMERO_ID;PRIMER_NOMBRE;SEGUNDO_NOMBRE;PRIMER_APELLIDO;SEGUNDO_APELLIDO;SEXO_BENEFICIARIO;ESTADO\r\n";
   hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_Estado_Beneficiarios_"+hoy+".csv",resultado);
   resultado ="";
   for (var i = 0; i <= respuesta.length; i++) {
     var codigo = "CODE:\n";
      codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
      switch(respuesta[i].TIPO_ID){
        case "RC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
          break;
        case "CC":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
          break;
        case "TI":
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
          break;
        default:
          break;
      }
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_ID+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
      codigo += "SET !TIMEOUT_STEP 20"+"\n";
      codigo += "TAG POS=26 TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
      iimPlay(codigo);
      var estado = iimGetExtract();
      if (estado=="No se encontraron datos, verifique por favor.") {
        resultado ="";
        resultado += respuesta[i].TIPO_ID+";"+respuesta[i].NUMERO_ID+";"+respuesta[i].PRIMER_NOMBRE+";"+respuesta[i].SEGUNDO_NOMBRE+";"+respuesta[i].PRIMER_APELLIDO+";"+respuesta[i].SEGUNDO_APELLIDO+";"+respuesta[i].SEXO_BENEFICIARIO+";"+"INACTIVO\r\n";
      }else{
        resultado ="";
        resultado += respuesta[i].TIPO_ID+";"+respuesta[i].NUMERO_ID+";"+respuesta[i].PRIMER_NOMBRE+";"+respuesta[i].SEGUNDO_NOMBRE+";"+respuesta[i].PRIMER_APELLIDO+";"+respuesta[i].SEGUNDO_APELLIDO+";"+respuesta[i].SEXO_BENEFICIARIO+";"+"ACTIVO\r\n";
      };
      hacerReporte("C:\\xampp\\htdocs\\lucy\\Reporte_Estado_Beneficiarios_"+hoy+".csv",resultado);
   };
}

function mostrarContratos (){
  var Url = new Ruta();
  var datosJson = HTTPGET('http://localhost/lucy/contratos.json');
  var respuesta = JSON.parse(datosJson);
  var texto = "";
    for (var i = 0; i < respuesta.length; i++) {
        texto += "["+i+"] "+respuesta[i].NCONTRATO+"  CZ "+respuesta[i].CENTROZONAL+"\n";
      };
  var contrato = prompt('Seleccione el contrato a procesar'+"\n"+"\n"+texto,"");
  var nContrato = respuesta[contrato].NCONTRATO;
  var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(0)+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtNumeroContrato CONTENT="+respuesta[contrato].NCONTRATO+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdVigencia CONTENT=%"+respuesta[contrato].VIGENCIA+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdRegional CONTENT=%10"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_cblDireccionesICBF_0 CONTENT=YES"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    codigo += "SET !TIMEOUT_STEP 25"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvContrato_btnInfo_0"+"\n";
  iimPlay(codigo);
  return nContrato;
}
function recorridoVinculacion(servicio){
  var Url = new Ruta();
  var codigo = "CODE:\n";
    if (servicio > 0) {
      codigo += "URL GOTO="+Url.getDireccion(1)+"\n";
    };
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%3"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvServicioContratado_btnInfo_"+servicio+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlDepartamento CONTENT=%"+10+"\n";
    codigo += "WAIT SECONDS=1"+"\n";
    //codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlMunicipio CONTENT=%"+430+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
  iimPlay(codigo);  
}
function retornar () {
   var codigo = "CODE:\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
   iimPlay(codigo);
}

function vinc (_uds) {
  var ejecutor;
  var errtex = "";  
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/paraCargar.json');
  var respuesta = JSON.parse(datosJson);
           for (var j in respuesta) {
            iimDisplay("Busqueda "+j+" en UDS "+ _uds);
               if (respuesta[j].CODIGO_UDS == _uds) {
                  codigo = "CODE:\n";
                  codigo += "SET !TIMEOUT_STEP 25"+"\n";
                  codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoBeneficiario CONTENT=%"+respuesta[j].TIPO_DE_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoResidencia CONTENT=%"+respuesta[j].DEPARTAMENTO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
                  codigo += "WAIT SECONDS=1"+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioResidencia CONTENT=%"+respuesta[j].MUNICIPIO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaVinculacion_txtFecha CONTENT=17/07/2015"+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTipoDocumento CONTENT=%"+respuesta[j].TIPO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtNumeroDocumento CONTENT="+respuesta[j].NUMERO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_btnFiltrar"+"\n";
                  codigo += "WAIT SECONDS=1"+"\n";
                  codigo += "SET !TIMEOUT_STEP 21"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiarios_chkAdd_0 CONTENT=YES"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaAtencion_txtFecha CONTENT=17/07/2015"+"\n";
                  codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
                 ejecutor = iimPlay(codigo);
                 if (ejecutor < 0) {              
                    errtext = iimGetLastError();
                    iimDisplay(errtext);
                    retornar();
                };
              }else{
                continue;
              };
        };
       codigo= null;
       codigo = "CODE:\n";
       codigo += "URL GOTO="+Url.getDireccion(6)+"\n";
       codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlDepartamento CONTENT=%"+10+"\n";
       codigo += "WAIT SECONDS=1"+"\n";
       codigo += "SET !TIMEOUT_STEP 26"+"\n";
       //codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlMunicipio CONTENT=%"+430+"\n";
       codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
       iimPlay(codigo);
}

function capturarUDS(pag) {
  var codigoUDS = new Array();
  var arreglo = new Array("2","7","12","17","22","27","32","37","42","47");
  var nPag = pag;
  for (var k = 1; k <= nPag; k++) {
   iimDisplay(nPag);
       iimDisplay(" la pagina es "+k);
             if (k!=1) {
                paginador(k);
              };
            capturar();
        for (var j = 0; j < codigoUDS.length; j++) {
            iimDisplay("UNIDAD  "+j+"  pagina "+k+"  Longitud del arreglo  "+codigoUDS.length);
            iimDisplay(codigoUDS[j]);
            ingresarItenUDS(j);
            vinc(codigoUDS[j]);
             if (k!=1) {
                paginador(k);
              };
        }; 
    };
  function capturar(){
    for (var i = 0; i < arreglo.length; i++) {
      var codigo = "CODE:\n";
      codigo += "TAG POS=1 TYPE=TH ATTR=TXT:*"+"\n";
      if (i!=10) {
        codigo += "TAG POS=R"+arreglo[i]+" TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
      };
      iimPlay(codigo);
      codigoUDS[i]=iimGetExtract(i);
    };
  }
}

function ingresarItenUDS (dato) {
  var codigo = "CODE:\n";
    codigo += "SET !EXTRACT NULL"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvServicioUnidad_btnInfo_"+dato+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%1"+"\n";
    //codigo += "BACK"+"\n";
  iimPlay(codigo);
}

function vincularBeneficiarios(){
  var datosJson = HTTPGET('http://localhost/lucy/contratos.json');
  var respuesta = JSON.parse(datosJson);
  var contrato = mostrarContratos ();//tiene alamacenado el numero de contrato seleccionado
  var Nservicio = 0;
  var cantidadUDS;
  for (var i in respuesta) {
    if (respuesta[i].NCONTRATO == contrato) {
      Nservicio = respuesta[i].SERVICIOS;
      cantidadUDS = new Array(respuesta[i].FAMI,respuesta[i].TRADI);
    }else{
      continue;
    };
  };
  for (var j = 0; j < Nservicio; j++) { //cambiar a 0
    var aux = (cantidadUDS[j]%10);
    if (aux!=0) {
      var nPag = ((cantidadUDS[j]/10)+1);   
    }else{
      var nPag = (cantidadUDS[j]/10);
    };
    var dato = parseInt(nPag);

    recorridoVinculacion(j);
    capturarUDS(dato);
    iimDisplay(dato);
  };
}

function guardarBeneficiarios (){
  var aux = "";
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/beneficiarios.json');
    var respuesta = JSON.parse(datosJson);
    for (var i = 0; i <= respuesta.length; i++) {
      var codigo = "CODE:\n";
        codigo += "URL GOTO="+Url.getDireccion(5)+"\n";
        codigo += "SET !TIMEOUT_STEP 20"+"\n";
        codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
        codigo += "SET !TIMEOUT_STEP 20"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoBeneficiario CONTENT=%"+respuesta[i].TIPO_DE_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%"+respuesta[i].TIPO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoExpideDoc CONTENT=%"+respuesta[i].DEPARTAMENTO_DE_EXPEDICION_DEL_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
        codigo += "WAIT SECONDS=1"+"\n"; 
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioExpideDoc CONTENT=%"+respuesta[i].MUNICIPIO_DE_EXPEDICION_DEL_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaExpideDocumento_txtFecha CONTENT="+respuesta[i].FECHA_DE_EXPEDICION_DEL_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
        if (respuesta[i].TIPO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO=="5") {
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaRecepFiscalRegistroCivil_txtFecha CONTENT="+respuesta[i].FECHA_DE_VINCULACION_AL_PROGRAMA+"\n"; 
        };
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPrimerNombre CONTENT="+respuesta[i].PRIMER_NOMBRE_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSegundoNombre CONTENT="+respuesta[i].SEGUNDO_NOMBRE_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPrimerApellido CONTENT="+respuesta[i].PRIMER_APELLIDO_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSegundoApellido CONTENT="+respuesta[i].SEGUNDO_APELLIDO_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaNacimiento_txtFecha CONTENT="+respuesta[i].FECHA_DE_NACIMIENTO_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdSexo CONTENT=%"+respuesta[i].SEXO_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdPaisNacimiento CONTENT=%41"+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoNacimiento CONTENT=%"+respuesta[i].DEPARTAMENTO_DE_NACIMIENTO_DEL_BENEFICIARIO+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioNacimiento CONTENT=%"+respuesta[i].MUNICIPIO_DE_NACIMIENTO_DEL_BENEFICIARIO+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdPaisResidencia CONTENT=%41"+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoResidencia CONTENT=%"+respuesta[i].DEPARTAMENTO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioResidencia CONTENT=%"+respuesta[i].MUNICIPIO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlEstratoHogar CONTENT=%1"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlZonaUbicacion CONTENT=%C"+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtNombreZonaResto CONTENT="+respuesta[i].NOMBRE_DEL_BARRIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtTelefonoResidencia CONTENT="+respuesta[i].NUMERO_TELEFONICO_DEL_BENEFICIARIO+"\n";
        codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_txtDireccionResidencia_rbtnDetalleZonaGeo_0"+"\n";
        codigo += "WAIT SECONDS=1"+"\n"
        codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtDireccionResidencia_txtDireccion CONTENT="+respuesta[i].DIRECCION_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
        if (respuesta[i].EL_BENEFICIARIO_HA_SIDO_SISBENIZADO == "SI") {
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlBeneficiarioSisbenizado CONTENT=%S"+"\n";         
          if (respuesta[i].LA_FAMILIA_DEL_BENEFICIARIO_PERTENECE_A_FAMILIAS_EN_ACCION == "SI") {
              codigo += "WAIT SECONDS=0.5"+"\n";
              codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlPerteneceFamiliasAccion CONTENT=%S"+"\n";
          } else{
              codigo += "WAIT SECONDS=0.5"+"\n";
              codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlPerteneceFamiliasAccion CONTENT=%X"+"\n";
          };
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPuntajeSisben CONTENT=10.5"+"\n";
        } else{
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlBeneficiarioSisbenizado CONTENT=%N"+"\n";
            if (respuesta[i].LA_FAMILIA_DEL_BENEFICIARIO_PERTENECE_A_FAMILIAS_EN_ACCION == "SI") {
              codigo += "WAIT SECONDS=0.5"+"\n";
              codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlPerteneceFamiliasAccion CONTENT=%S"+"\n";
          } else{
              codigo += "WAIT SECONDS=0.5"+"\n";
              codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlPerteneceFamiliasAccion CONTENT=%X"+"\n";
          };
        };
        codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
        codigo += "SET !TIMEOUT_STEP 60"+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%5"+"\n";
        codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
 ///************************ AGREGA EL ACUDIENTE ************************************************************************//
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTipoResponsabilidad CONTENT=%1"+"\n";
      codigo += "WAIT SECONDS=0.5"+"\n";
      aux = respuesta[i].QUIEN_ES_EL_RESPONSABLE_O_ACUDIENTE_DEL_BENEFICIARIO;
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdParentesco CONTENT=%"+verificarParentesco(aux)+"\n";
      codigo += "WAIT SECONDS=0.5"+"\n";
      if (respuesta[i].TIPO_DE_IDENTIFICACION_DEL_RESPONSABLE_O_ACUDIENTE) {
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
      }else{
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
      };
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_DE_DOCUMENTO_DE_IDENTIFICACION_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoExpideDoc CONTENT=%"+respuesta[i].DEPARTAMENTO_DE_EXPEDICION_DEL_DOCUMENTO_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "WAIT SECONDS=0.5"+"\n";
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioExpideDoc CONTENT=%"+respuesta[i].MUNICIPIO_DE_EXPEDICION_DEL_DOCUMENTO_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPrimerNombre CONTENT="+respuesta[i].PRIMER_NOMBRE_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSegundoNombre CONTENT="+respuesta[i].SEGUNDO_NOMBRE_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPrimerApellido CONTENT="+respuesta[i].PRIMER_APELLIDO_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSegundoApellido CONTENT="+respuesta[i].SEGUNDO_APELLIDO_DEL_RESPONSABLE_O_ACUDIENTE+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
 ///************************ AGREGA EL GRUPO ETNICO ************************************************************************//
      codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RubOnline/Beneficiario/List.aspx"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      aux ="";
        switch(respuesta[i].TIPO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO){
            case "RC":
                codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
                aux = "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%5"+"\n";
              break;
            case "CC":
                codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
                aux = "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%1"+"\n";
              break;
            case "TI":
                codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
                aux = "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoDocumento CONTENT=%6"+"\n";
              break;
            default:
              break;
            }
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%1"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
      codigo += "WAIT SECONDS=0.5"+"\n";
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlGrupoEtnico CONTENT=%8"+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
 ///************************ AGREGA CONFLICTO ARMADO ************************************************************************//
      codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RubOnline/Beneficiario/List.aspx"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += aux;  
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtIdentificacion CONTENT="+respuesta[i].NUMERO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiario_btnInfo_0"+"\n";
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%6"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
      codigo += "WAIT SECONDS=0.5"+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbVictimaConflicto_1"+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbDesplazamientoForzado_1"+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
      codigo += "SET !TIMEOUT_STEP 60"+"\n";
    iimPlay(codigo);    
    };
}

function verificarParentesco (dato) {
  var resultado = "";
  switch(dato){
    case "MADRE":
      resultado = "3";
      break;
    case "TIA":
      resultado = "12";
      break;
    case "ABUELA":
      resultado = "11";
      break;
    case "MAMA":
      resultado = "3";
      break;
    case "PADRE":
      resultado = "2";
      break;
    default:
      break;
  }
  return(resultado);
}
function VincularUDS () {
  var datosJson =  HTTPGET('http://localhost/lucy/unidades.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i < respuesta.length; i++) {
    asignarServicio(respuesta[i].CODIGO,respuesta[i].CUPOS);
    asignarContrato();
    tiempo(1);
  };
}
function asignarContrato (argument) {
  var Url = new Ruta();
  var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(4)+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "WAIT SECONDS= 1"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_imgBcodigoUsuario"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_gvServiciosContratados_chbAsignar_1 CONTENT=YES"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
  iimPlay(codigo);
}
function asignarServicio (codigoUDS,cupoUds) {
  var Url = new Ruta();
  var codigo = "CODE:\n";
    codigo += "URL GOTO="+Url.getDireccion(3)+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtCodigoUnidadServicio CONTENT="+codigoUDS+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "WAIT SECONDS= 1"+"\n";
    if (cupoUds==12) {
      codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvUnidadServicio_btnInfo_0"+"\n";     
    }else{
      codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvUnidadServicio_btnInfo_1"+"\n";
    };
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%2"+"\n";
    codigo += "WAIT SECONDS= 2"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_DdlIdVigencia CONTENT=%7"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    codigo += "WAIT SECONDS= 1"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
    codigo += "WAIT SECONDS= 1"+"\n";
    if (cupoUds==12) {
      codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_gvServicios_chbContiene_66 CONTENT=YES"+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_gvServicios_txtAsignarCupo_66 CONTENT="+cupoUds+"\n";    
    }else{
      codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_gvServicios_chbContiene_65 CONTENT=YES"+"\n";
      codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_gvServicios_txtAsignarCupo_65 CONTENT="+cupoUds+"\n";
    };
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_DdlIdVigencia CONTENT=%7"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
  iimPlay(codigo);
}
//Funciones imacros
function accederCuentame () {
  var Url = new Ruta();
  var datosJson =  HTTPGET('http://localhost/lucy/acceso.json');
  var respuesta = JSON.parse(datosJson);
  var texto = "";
      for (var i = 0; i < respuesta.length; i++) {
        texto += "["+i+"] "+respuesta[i].EAS+"\n";
      };
  var dato = prompt('Seleccione el USUARIO a accedercontrato'+"\n"+"\n"+texto,"");
  //iimDisplay(respuesta[dato].USER+" "+respuesta[dato].PASS);
  var codigo = "CODE:\n";
    codigo += "URL GOTO=https://rubonline.icbf.gov.co/"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=NAME:loGeneraciones$UserName CONTENT="+respuesta[dato].USER+"\n";
    codigo += "SET !ENCRYPTION NO"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:form1 ATTR=NAME:loGeneraciones$Password CONTENT="+respuesta[dato].PASS+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:form1 ATTR=NAME:loGeneraciones$LoginButton"+"\n";
    iimPlay(codigo);
  core();
}

function _desvincularBeneficiarios(){
  var datosJson = HTTPGET('http://localhost/lucy/contratos.json');
  var respuesta = JSON.parse(datosJson);
  var contrato = mostrarContratos ();//tiene alamacenado el numero de contrato seleccionado
  var Nservicio = 0;
  var cantidadUDS;
  for (var i in respuesta) {
    if (respuesta[i].NCONTRATO == contrato) {
      Nservicio = respuesta[i].SERVICIOS;
      cantidadUDS = new Array(respuesta[i].FAMI,respuesta[i].TRADI);
    }else{
      continue;
    };
  };
  for (var j = 0; j < Nservicio; j++) { //cambiar a 0
    var aux = (cantidadUDS[j]%10);
    if (aux!=0) {
      var nPag = ((cantidadUDS[j]/10)+1);   
    }else{
      var nPag = (cantidadUDS[j]/10);
    };
    var dato = parseInt(nPag);

    recorridoVinculacion(j);
    _capturarUDSDesvinc(dato);
    iimDisplay(dato);
  };
}
function _capturarUDSDesvinc(pag) {
  var nPag = pag;
  for (var k = 1; k <= nPag; k++) {
   iimDisplay(nPag);
       iimDisplay(" la pagina es "+k);
             if (k!=1) {
                paginador(k);
              };
        for (var j = 0; j < 10; j++) {
            ingresarItenUDS(j);
            _desvinculador();
             if (k!=1) {
                paginador(k);
              };
        }; 
    };
  }
function _desvinculador () {
        var codigo = "CODE:\n";
        codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
        codigo += "WAIT SECONDS=1"+"\n";
        codigo += "TAG POS=30 TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
        iimPlay(codigo);
        var estado = iimGetExtract();
        if (estado=="No se encontraron datos, verifique por favor.") {
          codigo = "";
          codigo = "CODE:\n";
          codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RubOnline/VincularUDSContrato/List.aspx"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
          iimPlay(codigo);
        } else{
          codigo = "";
          codigo = "CODE:\n";
          codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiarios_btnInfo_0"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaDesvinculacion_txtFecha CONTENT=31/12/2014"+"\n";
          codigo += "TAG POS=1 TYPE=TD ATTR=TXT:Seleccione<SP>Traslado<SP>de<SP>municipio<SP>Transito<SP>a*"+"\n";
          codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMotivoRetiroBeneficiario CONTENT=%11"+"\n";
          codigo += "TAG POS=1 TYPE=LABEL FORM=ID:form1 ATTR=TXT:Seleccionar<SP>Todos"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbTodos"+"\n";
          codigo += "ONDIALOG POS=1 BUTTON=OK CONTENT="+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/delete.gif"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
          codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RubOnline/VincularUDSContrato/List.aspx"+"\n";
          codigo += "WAIT SECONDS=1"+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
          iimPlay(codigo);
        }; 
}
function paginador (pag){
  iimDisplay("Entro a pagina:  "+pag);
  if(pag < 11){
    var pagina = "CODE:\n";
        pagina += "SET !TIMEOUT_STEP 20"+"\n";
        pagina += "TAG POS=1 TYPE=A ATTR=TXT:"+pag+"\n";
        pagina += "SET !TIMEOUT_STEP 20"+"\n";
    iimPlay(pagina);
    tiempo(1);
  }
  else{
    if (pag == 11) {
      var pagina = "CODE:\n";
          pagina += "SET !TIMEOUT_STEP 20"+"\n";
          pagina += "TAG POS=1 TYPE=A ATTR=TXT:...\n";
          pagina += "SET !TIMEOUT_STEP 20"+"\n";
          pagina += "TAG POS=1 TYPE=A ATTR=TXT:"+pag+"\n";
          if(pag>1){
          pagina += "WAIT SECONDS= 1"+"\n";
          }       
      iimPlay(pagina);      
    }else{
      var pagina = "CODE:\n";
          pagina += "SET !TIMEOUT_STEP 20"+"\n";
          pagina += "TAG POS=1 TYPE=A ATTR=TXT:...\n";
          pagina += "SET !TIMEOUT_STEP 20"+"\n";
          pagina += "TAG POS=1 TYPE=A ATTR=TXT:"+pag+"\n";
          if(pag>1){
            pagina += "WAIT SECONDS= 1"+"\n";
          }       
      iimPlay(pagina);
    };
  }
  
}
      peso_mujeres = new Array();
      peso_mujeres[150]  = new Array (Math.floor(Math.random() * (47 - 45 + 1)) + 45,Math.floor(Math.random() *(50 - 46 + 1)) + 46,Math.floor(Math.random() *(52 - 47 + 1) + 47 ));
peso_mujeres[151]  = new Array (Math.floor(Math.random() * (47 - 45 + 1)) + 45,Math.floor(Math.random() *(50 - 46 + 1)) + 46,Math.floor(Math.random() *(52 - 47 + 1) + 47 ));
peso_mujeres[152]  = new Array (Math.floor(Math.random() * (48 - 46 + 1)) + 46,Math.floor(Math.random() *(52 - 47 + 1)) + 47,Math.floor(Math.random() *(54 - 48 + 1) + 48 ));
peso_mujeres[153]  = new Array (Math.floor(Math.random() * (48 - 46 + 1)) + 46,Math.floor(Math.random() *(52 - 47 + 1)) + 47,Math.floor(Math.random() *(54 - 48 + 1) + 48 ));
peso_mujeres[154]  = new Array (Math.floor(Math.random() * (49 - 47 + 1)) + 47,Math.floor(Math.random() *(53 - 48 + 1)) + 48,Math.floor(Math.random() *(55 - 49 + 1) + 49 ));
peso_mujeres[155]  = new Array (Math.floor(Math.random() * (49 - 47 + 1)) + 47,Math.floor(Math.random() *(53 - 48 + 1)) + 48,Math.floor(Math.random() *(55 - 49 + 1) + 49 ));
peso_mujeres[156]  = new Array (Math.floor(Math.random() * (51 - 48 + 1)) + 48,Math.floor(Math.random() *(54 - 49 + 1)) + 49,Math.floor(Math.random() *(57 - 51 + 1) + 51 ));
peso_mujeres[157]  = new Array (Math.floor(Math.random() * (51 - 48 + 1)) + 48,Math.floor(Math.random() *(54 - 49 + 1)) + 49,Math.floor(Math.random() *(57 - 51 + 1) + 51 ));
peso_mujeres[158]  = new Array (Math.floor(Math.random() * (52 - 49 + 1)) + 49,Math.floor(Math.random() *(56 - 51 + 1)) + 51,Math.floor(Math.random() *(58 - 52 + 1) + 52 ));
peso_mujeres[159]  = new Array (Math.floor(Math.random() * (52 - 49 + 1)) + 49,Math.floor(Math.random() *(56 - 51 + 1)) + 51,Math.floor(Math.random() *(58 - 52 + 1) + 52 ));
peso_mujeres[160]  = new Array (Math.floor(Math.random() * (53 - 51 + 1)) + 51,Math.floor(Math.random() *(57 - 52 + 1)) + 52,Math.floor(Math.random() *(60 - 53 + 1) + 53 ));
peso_mujeres[161]  = new Array (Math.floor(Math.random() * (53 - 51 + 1)) + 51,Math.floor(Math.random() *(57 - 52 + 1)) + 52,Math.floor(Math.random() *(60 - 53 + 1) + 53 ));
peso_mujeres[162]  = new Array (Math.floor(Math.random() * (55 - 52 + 1)) + 52,Math.floor(Math.random() *(59 - 53 + 1)) + 53,Math.floor(Math.random() *(61 - 55 + 1) + 55 ));
peso_mujeres[163]  = new Array (Math.floor(Math.random() * (55 - 52 + 1)) + 52,Math.floor(Math.random() *(59 - 53 + 1)) + 53,Math.floor(Math.random() *(61 - 55 + 1) + 55 ));
peso_mujeres[164]  = new Array (Math.floor(Math.random() * (56 - 53 + 1)) + 53,Math.floor(Math.random() *(60 - 55 + 1)) + 55,Math.floor(Math.random() *(63 - 56 + 1) + 56 ));
peso_mujeres[165]  = new Array (Math.floor(Math.random() * (56 - 53 + 1)) + 53,Math.floor(Math.random() *(60 - 55 + 1)) + 55,Math.floor(Math.random() *(63 - 56 + 1) + 56 ));
peso_mujeres[166]  = new Array (Math.floor(Math.random() * (57 - 55 + 1)) + 55,Math.floor(Math.random() *(62 - 56 + 1)) + 56,Math.floor(Math.random() *(64 - 57 + 1) + 57 ));
peso_mujeres[167]  = new Array (Math.floor(Math.random() * (57 - 55 + 1)) + 55,Math.floor(Math.random() *(62 - 56 + 1)) + 56,Math.floor(Math.random() *(64 - 57 + 1) + 57 ));
peso_mujeres[168]  = new Array (Math.floor(Math.random() * (59 - 56 + 1)) + 56,Math.floor(Math.random() *(63 - 57 + 1)) + 57,Math.floor(Math.random() *(66 - 59 + 1) + 59 ));
peso_mujeres[169]  = new Array (Math.floor(Math.random() * (59 - 56 + 1)) + 56,Math.floor(Math.random() *(63 - 57 + 1)) + 57,Math.floor(Math.random() *(66 - 59 + 1) + 59 ));
peso_mujeres[170]  = new Array (Math.floor(Math.random() * (60 - 57 + 1)) + 57,Math.floor(Math.random() *(65 - 59 + 1)) + 59,Math.floor(Math.random() *(67 - 60 + 1) + 60 ));
peso_mujeres[171]  = new Array (Math.floor(Math.random() * (60 - 57 + 1)) + 57,Math.floor(Math.random() *(65 - 59 + 1)) + 59,Math.floor(Math.random() *(67 - 60 + 1) + 60 ));
peso_mujeres[172]  = new Array (Math.floor(Math.random() * (62 - 59 + 1)) + 59,Math.floor(Math.random() *(66 - 60 + 1)) + 60,Math.floor(Math.random() *(69 - 62 + 1) + 62 ));
peso_mujeres[173]  = new Array (Math.floor(Math.random() * (62 - 59 + 1)) + 59,Math.floor(Math.random() *(66 - 60 + 1)) + 60,Math.floor(Math.random() *(69 - 62 + 1) + 62 ));
peso_mujeres[174]  = new Array (Math.floor(Math.random() * (63 - 60 + 1)) + 60,Math.floor(Math.random() *(68 - 62 + 1)) + 62,Math.floor(Math.random() *(71 - 63 + 1) + 63 ));
peso_mujeres[175]  = new Array (Math.floor(Math.random() * (63 - 60 + 1)) + 60,Math.floor(Math.random() *(68 - 62 + 1)) + 62,Math.floor(Math.random() *(71 - 63 + 1) + 63 ));
peso_mujeres[176]  = new Array (Math.floor(Math.random() * (65 - 62 + 1)) + 62,Math.floor(Math.random() *(69 - 63 + 1)) + 63,Math.floor(Math.random() *(72 - 65 + 1) + 65 ));
peso_mujeres[177]  = new Array (Math.floor(Math.random() * (65 - 62 + 1)) + 62,Math.floor(Math.random() *(69 - 63 + 1)) + 63,Math.floor(Math.random() *(72 - 65 + 1) + 65 ));
peso_mujeres[178]  = new Array (Math.floor(Math.random() * (66 - 63 + 1)) + 63,Math.floor(Math.random() *(71 - 65 + 1)) + 65,Math.floor(Math.random() *(74 - 66 + 1) + 66 ));
peso_mujeres[179]  = new Array (Math.floor(Math.random() * (66 - 63 + 1)) + 63,Math.floor(Math.random() *(71 - 65 + 1)) + 65,Math.floor(Math.random() *(74 - 66 + 1) + 66 ));
peso_mujeres[180]  = new Array (Math.floor(Math.random() * (68 - 64 + 1)) + 64,Math.floor(Math.random() *(72 - 66 + 1)) + 66,Math.floor(Math.random() *(76 - 68 + 1) + 68 ));
peso_mujeres[181]  = new Array (Math.floor(Math.random() * (68 - 64 + 1)) + 64,Math.floor(Math.random() *(72 - 66 + 1)) + 66,Math.floor(Math.random() *(76 - 68 + 1) + 68 ));
peso_mujeres[182]  = new Array (Math.floor(Math.random() * (69 - 66 + 1)) + 66,Math.floor(Math.random() *(74 - 67 + 1)) + 67,Math.floor(Math.random() *(77 - 69 + 1) + 69 ));
peso_mujeres[183]  = new Array (Math.floor(Math.random() * (69 - 66 + 1)) + 66,Math.floor(Math.random() *(74 - 67 + 1)) + 67,Math.floor(Math.random() *(77 - 69 + 1) + 69 ));
peso_mujeres[184]  = new Array (Math.floor(Math.random() * (71 - 67 + 1)) + 67,Math.floor(Math.random() *(76 - 69 + 1)) + 69,Math.floor(Math.random() *(79 - 71 + 1) + 71 ));
peso_mujeres[185]  = new Array (Math.floor(Math.random() * (71 - 67 + 1)) + 67,Math.floor(Math.random() *(76 - 69 + 1)) + 69,Math.floor(Math.random() *(79 - 71 + 1) + 71 ));


      talla_ninas = new Array (); 
      talla_ninas[0]  = new Array ('44.0','47.8','49.5','51.5','53.0');
      talla_ninas[1]  = new Array ('47.5','49.15','51.4','53.25','55.25','57.1');
      talla_ninas[2]  = new Array ('51','53','55','57','59','61.2');
      talla_ninas[3]  = new Array ('53.35','55.5','57.5','59.5','61.5','63.85');
      talla_ninas[4]  = new Array ('55.7','58','60','62','64','66.5');
      talla_ninas[5]  = new Array ('57.35','59.6','61.75','64','66','68.5');
      talla_ninas[6]  = new Array ('59','61.2','63.5','66','68','70.5');
      talla_ninas[7]  = new Array ('60.25','62.6','65','67.5','69.5','72');
      talla_ninas[8]  = new Array ('61.5','64','66.5','69','71','73.5');
      talla_ninas[9]  = new Array ('62.75','65.35','67.75','70.25','72.5','75');
      talla_ninas[10]  = new Array ('64','66.7','69','71.5','74','76.5'); 
      talla_ninas[11]  = new Array ('65','67.85', '70.25', '72.75','75.3','77.75');
      talla_ninas[12]  = new Array ('66','69','71.5','74','76.6','79'); 
      talla_ninas[13]  = new Array ('66.8','69.9','72.45','75.01','77.67','80.15'); 
      talla_ninas[14]  = new Array ('67.77','70.8','73.4167','76.0','78.75','81.3');
      talla_ninas[15]  = new Array ('68.65','71.75','74.375','77.05','79.825','82.45');
      talla_ninas[16]  = new Array ('69.5','72.67','75.3','78.07','80.9','83.6');
      talla_ninas[17]  = new Array ('70.4167','73.58','76.2917','79.08','81.975','84.75');
      talla_ninas[18]  = new Array ('71.3','74.5','77.25','80.1','83.05','85.9');
      talla_ninas[19]  = new Array ('72.18','75.4167','78.208','81.1167','84.125','87.05');
      talla_ninas[20]  = new Array ('73.07','76.3','79.17','82.1','85.2','88.2');
      talla_ninas[21]  = new Array ('73.95','77.25','80.125','83.15','86.275','89.35');
      talla_ninas[22]  = new Array ('74.8','78.17','81.08','84.17','87.35','90.5');
      talla_ninas[23]  = new Array ('75.7167','79.08','82.0417','85.18','88.425','91.65');
      talla_ninas[24]  = new Array ('76.6','80','83','86.2','89.5','92.8');
      talla_ninas[25]  = new Array ('77.175','80.6','83.67','86.9','90.2917','93.625');
      talla_ninas[26]  = new Array ('77.75','81.2','84.3','87.67','91.08','94.45');
      talla_ninas[27]  = new Array ('78.325','81.8','85','88.4','91.875','95.275');
      talla_ninas[28]  = new Array ('78.9','82.4','85.67','89.1','92.67','96.1');
      talla_ninas[29]  = new Array ('79.475','83','86.3','89.87','93.458','96.925');
      talla_ninas[30]  = new Array ('80.05','83.6','87','90.6','94.25','97.75');
      talla_ninas[31]  = new Array ('80.625','84.2','87.67','91.3','95.0417','98.575');
      talla_ninas[32]  = new Array ('81.2','84.8','88.3','92.07','95.8','99.4');
      talla_ninas[33]  = new Array ('81.775','85.4','89','92.8','96.625','100.225');
      talla_ninas[34]  = new Array ('82.35','86','89.67','93.5','97.4167','101.05');
      talla_ninas[35]  = new Array ('82.925','86.6','90.3','94.27','98.208','101.875');
      talla_ninas[36]  = new Array ('83.5','87.2','91','95','99','102.7');
      talla_ninas[37]  = new Array ('84.0417','87.77','91.6167','95.67','99.67','103.391');
      talla_ninas[38]  = new Array ('84.58','88.3','92.2','96.3','100.','104.08');
      talla_ninas[39]  = new Array ('85.125','88.9','92.85','97','101','104.775');
      talla_ninas[40]  = new Array ('85.67','89.47','93.47','97.67','101.7','105.467');
      talla_ninas[41]  = new Array ('86.208','90.0','94.08','98.3','102.','106.158');
      talla_ninas[42]  = new Array ('86.75','90.6','94.7','99','103','106.85');
      talla_ninas[43]  = new Array ('87.2917','91.17','95.3167','99.67','103.7','107.541');
      talla_ninas[44]  = new Array ('87.8','91.7','95.9','100.','104.','108.2');
      talla_ninas[45]  = new Array ('88.375','92.3','96.55','101','105','108.925');
      talla_ninas[46]  = new Array ('88.9167','92.87','97.17','101.7','105.7','109.617');
      talla_ninas[47]  = new Array ('89.458','93.4','97.78','102.','106.','110.308');
      talla_ninas[48]  = new Array ('90','94','98.4','103','107','111');
      talla_ninas[49]  = new Array ('90.4167','94.5','98.908','103.508','107.58','111.7');
      talla_ninas[50]  = new Array ('90.8','95','99.4167','104.017','108.167','112.');
      talla_ninas[51]  = new Array ('91.25','95.5','99.925','104.525','108.75','113');
      talla_ninas[52]  = new Array ('91.67','96','100.4','105.0','109.','113.7');
      talla_ninas[53]  = new Array ('92.08','96.5','100.941','105.541','109.917','114');
      talla_ninas[54]  = new Array ('92.5','97','101.45','106.05','110.5','115');
      talla_ninas[55]  = new Array ('92.9167','97.5','101.958','106.558','111.08','115.7');
      talla_ninas[56]  = new Array ('93.3','98','102.467','107.067','111.7','116.');
      talla_ninas[57]  = new Array ('93.75','98.5','102.975','107.575','112.25','117');
      talla_ninas[58]  = new Array ('94.17','99','103.48','108.08','112.8','117.7');
      talla_ninas[59]  = new Array ('94.58','99.5','103.991','108.591','113.417','118');
      talla_ninas[60]  = new Array ('95','100','104.5','109.1','114','119');
      talla_ninas[61]  = new Array ('95.4167','100.5','105.008','109.608','114.58','119.7');
      talla_ninas[62]  = new Array ('95.8','101','105.517','110.117','115.167','120.');
      talla_ninas[63]  = new Array ('96.2499','101.5','106.025','110.625','115.75','121');
      talla_ninas[64]  = new Array ('96.66','102','106.5','111.1','116.','121.7');
      talla_ninas[65]  = new Array ('97.08','102.5','107.041','111.641','116.917','122');
      talla_ninas[66]  = new Array ('97.4','103','107.55','112.15','117.5','123');
      talla_ninas[67]  = new Array ('97.9165','103.5','108.058','112.658','118.08','123.7');
      talla_ninas[68]  = new Array ('98.2','104','108.5','113.1','118.6','124.');
      talla_ninas[69]  = new Array ('98.7499','104.5','109.075','113.674','119.25','125');
      talla_ninas[70]  = new Array ('99.15','105','109.58','114.18','119.8','125.6');
      talla_ninas[71]  = new Array ('99.581','105.5','110.091','114.691','119.917','126');
      talla_ninas[72]  = new Array ('99.8','106','110.6','115.2','120','127');
      
//esta es la matriz para la talla inicial de las niños
      talla_ninos = new Array (); 
      talla_ninos[0]   = new Array ('44.0','47.8','49.5','51.5','53.0');
      talla_ninos[1]   = new Array ('44.9','46.5','48.7','50.5','52','54');
      talla_ninos[2]   = new Array ('48.95','50.75','52.65','54.5','56.25','58.25');
      talla_ninos[3]   = new Array ('53','55','56.6','58.5','60.5','62.5');
      talla_ninos[4]   = new Array ('55.5','57.5','59.3','61.25','63.25','65.25');
      talla_ninos[5]   = new Array ('58','60','62','64','66','68');
      talla_ninos[6]   = new Array ('59.75','62','64','66','68','70');
      talla_ninos[7]   = new Array ('61.5','64','66','68','70','72');
      talla_ninos[8]   = new Array ('62.85','65.35','67.5','69.5','71.5','73.5');
      talla_ninos[9]   = new Array ('64.2','66.7','69','71','73','75');
      talla_ninos[10]   = new Array ('65.45','67.85','70.1','72.25','74.5','76.5');
      talla_ninos[11]   = new Array ('66.7','69','71.2','73.5','76','78');
      talla_ninos[12]   = new Array ('67.85','70.1','72.35','74.75','77','79.35');
      talla_ninos[13]   = new Array ('69','71.2','73.5','76','78','80.7');
      talla_ninos[14]   = new Array ('69.75','72.058','74.417','76.958','79.041','81.767');
      talla_ninos[15]   = new Array ('70.5','72.917','75.3','77.917','80.083','82.833');
      talla_ninos[16]   = new Array ('71.25','73.775','76.25','78.875','81.125','83.9');
      talla_ninos[17]   = new Array ('72','74.633','77.167','79.833','82.167','84.967');
      talla_ninos[18]   = new Array ('72.75','75.491','78.083','80.791','83.208','86.033');
      talla_ninos[19]   = new Array ('73.5','76.35','79','81.75','84.25','87.1');
      talla_ninos[20]   = new Array ('74.25','77.208','79.917','82.708','85.291','88.167');
      talla_ninos[21]   = new Array ('75','78.067','80.833','83.667','86.333','89.233');
      talla_ninos[22]   = new Array ('75.75','78.925','81.75','84.625','87.375','90.3');
      talla_ninos[23]   = new Array ('76.5','79.783','82.667','85.583','88.417','91.367');
      talla_ninos[24]   = new Array ('77.25','80.641','83.583','86.541','89.458','92.433');
      talla_ninos[25]   = new Array ('78','81.5','84.5','87.5','90.5','93.5');
      talla_ninos[26]   = new Array ('78.583','82.125','85.167','88.208','91.291','94.333');
      talla_ninos[27]   = new Array ('79.167','82.75','85.833','88.917','92.083','95.167');
      talla_ninos[28]   = new Array ('79.75','83.375','86.5','89.625','92.875','96');
      talla_ninos[29]   = new Array ('80.333','84','87.167','90.333','93.667','96.833');
      talla_ninos[30]   = new Array ('80.917','84.625','87.833','91.041','94.458','97.667');
      talla_ninos[31]   = new Array ('81.5','85.25','88.5','91.75','95.25','98.5');
      talla_ninos[32]   = new Array ('82.083','85.875','89.167','92.458','96.041','99.333');
      talla_ninos[33]   = new Array ('82.667','86.5','89.833','93.167','96.833','100.17');
      talla_ninos[34]   = new Array ('83.25','87.125','90.5','93.875','97.625','101');
      talla_ninos[35]   = new Array ('83.833','87.75','91.167','94.583','98.417','101.83');
      talla_ninos[36]   = new Array ('84.417','88.375','91.833','95.291','99.208','102.67');
      talla_ninos[37]   = new Array ('85','89','92.5','96','100','103.5');
      talla_ninos[38]   = new Array ('85.5','89.5','93.041','96.625','100.625','104.208');
      talla_ninos[39]   = new Array ('86','90','93.583','97.25','101.25','104.91');
      talla_ninos[40]   = new Array ('86.5','90.5','94.125','97.875','101.875','105.625');
      talla_ninos[41]   = new Array ('87','91','94.667','98.5','102.5','106.33');
      talla_ninos[42]   = new Array ('87.5','91.5','95.208','99.125','103.125','107.041');
      talla_ninos[43]   = new Array ('88','92','95.75','99.75','103.75','107.75');
      talla_ninos[44]   = new Array ('88.5','92.5','96.291','100.375','104.375','108.458');
      talla_ninos[45]   = new Array ('89','93','96.833','101','105','109.17');
      talla_ninos[46]   = new Array ('89.5','93.5','97.375','101.625','105.625','109.875');
      talla_ninos[47]   = new Array ('90','94','97.917','102.25','106.25','110.58');
      talla_ninos[48]   = new Array ('90.5','94.5','98.458','102.875','106.875','111.291');
      talla_ninos[49]   = new Array ('91','95','99','103.5','107.5','112');
      talla_ninos[50]   = new Array ('91.417','95.5','99.541','104.041','108.08','112.58');
      talla_ninos[51]   = new Array ('91.833','96','100.08','104.58','108.67','113.17');
      talla_ninos[52]   = new Array ('92.25','96.5','100.625','105.125','109.25','113.75');
      talla_ninos[53]   = new Array ('92.667','97','101.17','105.67','109.83','114.33');
      talla_ninos[54]   = new Array ('93.083','97.5','101.708','106.208','110.41','114.91');
      talla_ninos[55]   = new Array ('93.5','98','102.25','106.75','111','115.5');
      talla_ninos[56]   = new Array ('93.917','98.5','102.791','107.291','111.58','116.08');
      talla_ninos[57]   = new Array ('94.333','99','103.33','107.83','112.17','116.67');
      talla_ninos[58]   = new Array ('94.75','99.5','103.875','108.375','112.75','117.25');
      talla_ninos[59]   = new Array ('95.167','100','104.41','108.91','113.33','117.83');
      talla_ninos[60]   = new Array ('95.583','100.5','104.958','109.458','113.91','118.41');
      talla_ninos[61]   = new Array ('96','101','105.5','110','114.5','119');
      talla_ninos[62]   = new Array ('96.417','101.5','106.041','110.541','115.08','119.58');
      talla_ninos[63]   = new Array ('96.833','102','106.58','111.08','115.67','120.17');
      talla_ninos[64]   = new Array ('97.24','102.5','107.125','111.625','116.25','120.75');
      talla_ninos[65]   = new Array ('97.666','103','107.67','112.17','116.83','121.33');
      talla_ninos[66]   = new Array ('98.083','103.5','108.208','112.708','117.41','121.91');
      talla_ninos[67]   = new Array ('98.49','104','108.75','113.25','118','122.5');
      talla_ninos[68]   = new Array ('98.915','104.5','109.291','113.791','118.58','123.08');
      talla_ninos[69]   = new Array ('99.332','105','109.83','114.33','119.16','123.66');
      talla_ninos[70]   = new Array ('99.75','105.5','110.375','114.875','119.58','124.25');
      talla_ninos[71]   = new Array ('100.17','106','110.91','115.41','120','124.83');
      talla_ninos[72]   = new Array ('100.58','106.5','111.458','115.958','120','125.41');

//esta es la matriz para el peso de las niñas
peso_ninas = new Array (); 
   peso_ninas[45] = new Array ('1.9','2.1','2.25','2.5','2.75','3','3.4');
   peso_ninas[46] = new Array ('2.04','2.26','2.42','2.68','2.94','3.2','3.62');
   peso_ninas[47] = new Array ('2.18','2.42','2.59','2.86','3.13','3.4','3.84');
   peso_ninas[48] = new Array ('2.32','2.58','2.76','3.04','3.32','3.6','4.06');
   peso_ninas[49] = new Array ('2.46','2.74','2.93','3.22','3.51','3.8','4.28');
   peso_ninas[50] = new Array ('2.6','2.9','3.1','3.4','3.7','4','4.5');
   peso_ninas[51] = new Array ('2.78','3.08','3.32','3.62','3.96','4.3','4.8');
   peso_ninas[52] = new Array ('2.96','3.26','3.54','3.84','4.22','4.6','5.1');
   peso_ninas[53] = new Array ('3.14','3.44','3.76','4.06','4.48','4.9','5.4');
   peso_ninas[54] = new Array ('3.32','3.62','3.98','4.28','4.74','5.2','5.7');
   peso_ninas[55] = new Array ('3.5','3.8','4.2','4.5','5','5.5','6');
   peso_ninas[56] = new Array ('3.7','4.04','4.44','4.78','5.3','5.82','6.38');
   peso_ninas[57] = new Array ('3.9','4.28','4.68','5.06','5.6','6.14','6.76');
   peso_ninas[58] = new Array ('4.1','4.52','4.92','5.34','5.9','6.46','7.14');
   peso_ninas[59] = new Array ('4.3','4.76','5.16','5.62','6.2','6.78','7.52');
   peso_ninas[60] = new Array ('4.5','5','5.4','5.9','6.5','7.1','7.9');
   peso_ninas[61] = new Array ('4.7','5.2','5.62','6.12','6.74','7.38','8.22');
   peso_ninas[62] = new Array ('4.9','5.4','5.84','6.34','6.98','7.66','8.54');
   peso_ninas[63] = new Array ('5.1','5.6','6.06','6.56','7.22','7.94','8.86');
   peso_ninas[64] = new Array ('5.3','5.8','6.28','6.78','7.46','8.22','9.18');
   peso_ninas[65] = new Array ('5.5','6','6.5','7','7.7','8.5','9.5');
   peso_ninas[66] = new Array ('5.66','6.18','6.7','7.24','7.96','8.78','9.78');
   peso_ninas[67] = new Array ('5.82','6.36','6.9','7.48','8.22','9.06','10.06');
   peso_ninas[68] = new Array ('5.98','6.54','7.1','7.72','8.48','9.34','10.34');
   peso_ninas[69] = new Array ('6.14','6.72','7.3','7.96','8.74','9.62','10.62');
   peso_ninas[70] = new Array ('6.3','6.9','7.5','8.2','9','9.9','10.9');
   peso_ninas[71] = new Array ('6.44','7.06','7.68','8.38','9.2','10.12','11.16');
   peso_ninas[72] = new Array ('6.58','7.22','7.86','8.56','9.4','10.34','11.42');
   peso_ninas[73] = new Array ('6.72','7.38','8.04','8.74','9.6','10.56','11.68');
   peso_ninas[74] = new Array ('6.86','7.54','8.22','8.92','9.8','10.78','11.94');
   peso_ninas[75] = new Array ('7','7.7','8.4','9.1','10','11','12.2');
   peso_ninas[76] = new Array ('7.16','7.86','8.56','9.3','10.22','11.22','12.44');
   peso_ninas[77] = new Array ('7.32','8.02','8.72','9.5','10.44','11.44','12.68');
   peso_ninas[78] = new Array ('7.48','8.18','8.88','9.7','10.66','11.66','12.92');
   peso_ninas[79] = new Array ('7.64','8.34','9.04','9.9','10.88','11.88','13.16');
   peso_ninas[80] = new Array ('7.8','8.5','9.2','10.1','11.1','12.1','13.4');
   peso_ninas[81] = new Array ('7.98','8.7','9.42','10.32','11.34','12.38','13.7');
   peso_ninas[82] = new Array ('8.16','8.9','9.64','10.54','11.58','12.66','14');
   peso_ninas[83] = new Array ('8.34','9.1','9.86','10.76','11.82','12.94','14.3');
   peso_ninas[84] = new Array ('8.52','9.3','10.08','10.98','12.06','13.22','14.6');
   peso_ninas[85] = new Array ('8.7','9.5','10.3','11.2','12.3','13.5','14.9');
   peso_ninas[86] = new Array ('8.9','9.72','10.56','11.48','12.62','13.84','15.26');
   peso_ninas[87] = new Array ('9.1','9.94','10.82','11.76','12.94','14.18','15.62');
   peso_ninas[88] = new Array ('9.3','10.16','11.08','12.04','13.26','14.52','15.98');
   peso_ninas[89] = new Array ('9.5','10.38','11.34','12.32','13.58','14.86','16.34');
   peso_ninas[90] = new Array ('9.7','10.6','11.6','12.6','13.9','15.2','16.7');
   peso_ninas[91] = new Array ('9.9','10.82','11.82','12.86','14.16','15.5','17.06');
   peso_ninas[92] = new Array ('10.1','11.04','12.04','13.12','14.42','15.8','17.42');
   peso_ninas[93] = new Array ('10.3','11.26','12.26','13.38','14.68','16.1','17.78');
   peso_ninas[94] = new Array ('10.5','11.48','12.48','13.64','14.94','16.4','18.14');
   peso_ninas[95] = new Array ('10.7','11.7','12.7','13.9','15.2','16.7','18.5');
   peso_ninas[96] = new Array ('10.9','11.92','12.96','14.16','15.5','17.06','18.86');
   peso_ninas[97] = new Array ('11.1','12.14','13.22','14.42','15.8','17.42','19.22');
   peso_ninas[98] = new Array ('11.3','12.36','13.48','14.68','16.1','17.78','19.58');
   peso_ninas[99] = new Array ('11.5','12.58','13.74','14.94','16.4','18.14','19.94');
   peso_ninas[100] = new Array ('11.7','12.8','14','15.2','16.7','18.5','20.3');
   peso_ninas[101] = new Array ('11.96','13.04','14.3','15.52','17.06','18.86','20.76');
   peso_ninas[102] = new Array ('12.22','13.28','14.6','15.84','17.42','19.22','21.22');
   peso_ninas[103] = new Array ('12.48','13.52','14.9','16.16','17.78','19.58','21.68');
   peso_ninas[104] = new Array ('12.74','13.76','15.2','16.48','18.14','19.94','22.14');
   peso_ninas[105] = new Array ('13','14','15.5','16.8','18.5','20.3','22.6');
   peso_ninas[106] = new Array ('13.25','14.3','15.8','17.16','18.9','20.76','23.1');
   peso_ninas[107] = new Array ('13.5','14.6','16.1','17.52','19.3','21.22','23.6');
   peso_ninas[108] = new Array ('13.75','14.9','16.4','17.88','19.7','21.68','24.1');
   peso_ninas[109] = new Array ('14','15.2','16.7','18.24','20.1','22.14','24.6');
   peso_ninas[110] = new Array ('14.25','15.5','17','18.6','20.5','22.6','25.1');
   peso_ninas[111] = new Array ('14.55','15.82','17.34','19','20.94','23.12','25.68');
   peso_ninas[112] = new Array ('14.85','16.14','17.68','19.4','21.38','23.64','26.26');
   peso_ninas[113] = new Array ('15.15','16.46','18.02','19.8','21.82','24.16','26.84');
   peso_ninas[114] = new Array ('15.45','16.78','18.36','20.2','22.26','24.68','27.42');
   peso_ninas[115] = new Array ('15.75','17.1','18.7','20.6','22.7','25.2','28');
   peso_ninas[116] = new Array ('16.05','17.46','19.08','21.02','23.18','25.76','28.62');
   peso_ninas[117] = new Array ('16.35','17.82','19.46','21.44','23.66','26.32','29.24');
   peso_ninas[118] = new Array ('16.65','18.18','19.84','21.86','24.14','26.88','29.86');
   peso_ninas[119] = new Array ('16.95','18.54','20.22','22.28','24.62','27.44','30.48');
   peso_ninas[120] = new Array ('17.25','18.9','20.6','22.7','25.1','28','31.1');
   peso_ninas[121] = new Array ('17.55','19.26','20.98','23.12','25.58','28.56','31.72');
   peso_ninas[122] = new Array ('17.85','19.62','21.36','23.54','26.06','29.12','32.34');
   peso_ninas[123] = new Array ('18.15','19.98','21.74','23.96','26.54','29.68','32.96');
   peso_ninas[124] = new Array ('18.45','20.34','22.12','24.38','27.02','30.24','33.58');
   peso_ninas[125] = new Array ('18.75','20.7','22.5','24.8','27.5','30.8','34.2');
   peso_ninas[126] = new Array ('19.05','21.06','22.88','25.22','27.98','31.36','34.82');
   peso_ninas[127] = new Array ('19.35','21.42','23.26','25.64','28.46','31.92','35.44');

//esta es la matriz para el peso inicial de los niños
peso_ninos = new Array ();
peso_ninos[45]  = new Array ('1.9','2.1','2.25','2.5','2.75','2.9','3.3');
peso_ninos[46]  = new Array ('2.04','2.24','2.4','2.66','2.94','3.12','3.54');
peso_ninos[47]  = new Array ('2.18','2.38','2.55','2.82','3.13','3.34','3.78');
peso_ninos[48]  = new Array ('2.32','2.52','2.7','2.98','3.32','3.56','4.02');
peso_ninos[49]  = new Array ('2.46','2.66','2.85','3.14','3.51','3.78','4.26');
peso_ninos[50]  = new Array ('2.6','2.8','3','3.3','3.7','4','4.5');
peso_ninos[51]  = new Array ('2.78','3.02','3.24','3.54','3.96','4.28','4.8');
peso_ninos[52]  = new Array ('2.96','3.24','3.48','3.78','4.22','4.56','5.1');
peso_ninos[53]  = new Array ('3.14','3.46','3.72','4.02','4.48','4.84','5.4');
peso_ninos[54]  = new Array ('3.32','3.68','3.96','4.26','4.74','5.12','5.7');
peso_ninos[55]  = new Array ('3.5','3.9','4.2','4.5','5','5.4','6');
peso_ninos[56]  = new Array ('3.74','4.14','4.46','4.8','5.3','5.74','6.36');
peso_ninos[57]  = new Array ('3.98','4.38','4.72','5.1','5.6','6.08','6.72');
peso_ninos[58]  = new Array ('4.22','4.62','4.98','5.4','5.9','6.42','7.08');
peso_ninos[59]  = new Array ('4.46','4.86','5.24','5.7','6.2','6.76','7.44');
peso_ninos[60]  = new Array ('4.7','5.1','5.5','6','6.5','7.1','7.8');
peso_ninos[61]  = new Array ('4.9','5.32','5.74','6.24','6.78','7.4','8.13');
peso_ninos[62]  = new Array ('5.1','5.54','5.98','6.48','7.06','7.7','8.46');
peso_ninos[63]  = new Array ('5.3','5.76','6.22','6.72','7.34','8','8.79');
peso_ninos[64]  = new Array ('5.5','5.98','6.46','6.96','7.62','8.3','9.12');
peso_ninos[65]  = new Array ('5.7','6.2','6.7','7.2','7.9','8.6','9.45');
peso_ninos[66]  = new Array ('5.88','6.4','6.92','7.44','8.14','8.88','9.76');
peso_ninos[67]  = new Array ('6.06','6.6','7.14','7.68','8.38','9.16','10.07');
peso_ninos[68]  = new Array ('6.24','6.8','7.36','7.92','8.62','9.44','10.38');
peso_ninos[69]  = new Array ('6.42','7','7.58','8.16','8.86','9.72','10.69');
peso_ninos[70]  = new Array ('6.6','7.2','7.8','8.4','9.1','10','11');
peso_ninos[71]  = new Array ('6.78','7.38','7.98','8.62','9.34','10.26','11.28');
peso_ninos[72]  = new Array ('6.96','7.56','8.16','8.84','9.58','10.52','11.56');
peso_ninos[73]  = new Array ('7.14','7.74','8.34','9.06','9.82','10.78','11.84');
peso_ninos[74]  = new Array ('7.32','7.92','8.52','9.28','10.06','11.04','12.12');
peso_ninos[75]  = new Array ('7.5','8.1','8.7','9.5','10.3','11.3','12.4');
peso_ninos[76]  = new Array ('7.64','8.26','8.88','9.7','10.52','11.54','12.64');
peso_ninos[77]  = new Array ('7.78','8.42','9.06','9.9','10.74','11.78','12.88');
peso_ninos[78]  = new Array ('7.92','8.58','9.24','10.1','10.96','12.02','13.12');
peso_ninos[79]  = new Array ('8.06','8.74','9.42','10.3','11.18','12.26','13.36');
peso_ninos[80]  = new Array ('8.2','8.9','9.6','10.5','11.4','12.5','13.6');
peso_ninos[81]  = new Array ('8.36','9.08','9.8','10.7','11.62','12.72','13.86');
peso_ninos[82]  = new Array ('8.52','9.26','10','10.9','11.84','12.94','14.12');
peso_ninos[83]  = new Array ('8.68','9.44','10.2','11.1','12.06','13.16','14.38');
peso_ninos[84]  = new Array ('8.84','9.62','10.4','11.3','12.28','13.38','14.64');
peso_ninos[85]  = new Array ('9','9.8','10.6','11.5','12.5','13.6','14.9');
peso_ninos[86]  = new Array ('9.24','10.04','10.86','11.78','12.8','13.92','15.24');
peso_ninos[87]  = new Array ('9.48','10.28','11.12','12.06','13.1','14.24','15.58');
peso_ninos[88]  = new Array ('9.72','10.52','11.38','12.34','13.4','14.56','15.92');
peso_ninos[89]  = new Array ('9.96','10.76','11.64','12.62','13.7','14.88','16.26');
peso_ninos[90]  = new Array ('10.2','11','11.9','12.9','14','15.2','16.6');
peso_ninos[91]  = new Array ('10.38','11.2','12.12','13.12','14.24','15.48','16.9');
peso_ninos[92]  = new Array ('10.56','11.4','12.34','13.34','14.48','15.76','17.2');
peso_ninos[93]  = new Array ('10.74','11.6','12.56','13.56','14.72','16.04','17.5');
peso_ninos[94]  = new Array ('10.92','11.8','12.78','13.78','14.96','16.32','17.8');
peso_ninos[95]  = new Array ('11.1','12','13','14','15.2','16.6','18.1');
peso_ninos[96]  = new Array ('11.3','12.2','13.22','14.26','15.48','16.9','18.46');
peso_ninos[97]  = new Array ('11.5','12.4','13.44','14.52','15.76','17.2','18.82');
peso_ninos[98]  = new Array ('11.7','12.6','13.66','14.78','16.04','17.5','19.18');
peso_ninos[99]  = new Array ('11.9','12.8','13.88','15.04','16.32','17.8','19.54');
peso_ninos[100]  = new Array ('12.1','13','14.1','15.3','16.6','18.1','19.9');
peso_ninos[101]  = new Array ('12.32','13.26','14.38','15.6','16.96','18.48','20.32');
peso_ninos[102]  = new Array ('12.54','13.52','14.66','15.9','17.32','18.86','20.74');
peso_ninos[103]  = new Array ('12.76','13.78','14.94','16.2','17.68','19.24','21.16');
peso_ninos[104]  = new Array ('12.98','14.04','15.22','16.5','18.04','19.62','21.58');
peso_ninos[105]  = new Array ('13.2','14.3','15.5','16.8','18.4','20','22');
peso_ninos[106]  = new Array ('13.44','14.56','15.8','17.14','18.76','20.44','22.5');
peso_ninos[107]  = new Array ('13.68','14.82','16.1','17.48','19.12','20.88','23');
peso_ninos[108]  = new Array ('13.92','15.08','16.4','17.82','19.48','21.32','23.5');
peso_ninos[109]  = new Array ('14.16','15.34','16.7','18.16','19.84','21.76','24');
peso_ninos[110]  = new Array ('14.4','15.6','17','18.5','20.2','22.2','24.5');
peso_ninos[111]  = new Array ('14.66','15.9','17.32','18.88','20.64','22.68','25.04');
peso_ninos[112]  = new Array ('14.92','16.2','17.64','19.26','21.08','23.16','25.58');
peso_ninos[113]  = new Array ('15.18','16.5','17.96','19.64','21.52','23.64','26.12');
peso_ninos[114]  = new Array ('15.44','16.8','18.28','20.02','21.96','24.12','26.66');
peso_ninos[115]  = new Array ('15.7','17.1','18.6','20.4','22.4','24.6','27.2');
peso_ninos[116]  = new Array ('15.96','17.4','18.96','20.78','22.82','25.12','27.78');
peso_ninos[117]  = new Array ('16.22','17.7','19.32','21.16','23.24','25.64','28.36');
peso_ninos[118]  = new Array ('16.48','18','19.68','21.54','23.66','26.16','28.94');
peso_ninos[119]  = new Array ('16.74','18.3','20.04','21.92','24.08','26.68','29.52');
peso_ninos[120]  = new Array ('17','18.6','20.4','22.3','24.5','27.2','30.1');
peso_ninos[121]  = new Array ('17.26','18.9','20.76','22.68','24.92','27.72','30.68');
peso_ninos[122]  = new Array ('17.52','19.2','21.12','23.06','25.34','28.24','31.26');
peso_ninos[123]  = new Array ('17.78','19.5','21.48','23.44','25.76','28.76','31.84');
peso_ninos[124]  = new Array ('18.04','19.8','21.84','23.82','26.18','29.28','32.42');
peso_ninos[125]  = new Array ('18.3','20.1','22.2','24.2','26.6','29.8','33');
peso_ninos[126]  = new Array ('18.56','20.4','22.56','24.58','27.02','30.32','33.58');
peso_ninos[127]  = new Array ('18.82','20.7','22.92','24.96','27.44','30.84','34.16');

restaFechas = function(f1,f2){
  var aFecha1 = f1.split('/'); 
  var aFecha2 = f2.split('/'); 
  var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
  var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]); 
  var dif = fFecha2 - fFecha1;
  var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
return dias;
} 
function cargarUDS (){
  var datosJson =  HTTPGET('http://localhost/lucy/udsPeso.json');
  var respuesta = JSON.parse(datosJson);
  for (var i = 0; i < respuesta.length; i++) {
    var codigo = "CODE:\n";
    codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RUBONLINE/SEGUIMIENTONUTRICION/List.aspx"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtCodigoUnidadServicio CONTENT="+respuesta[i].Codigo_UDS+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_btnFiltrar"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdContrato CONTENT=%"+respuesta[i].Contrato+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlVigencia CONTENT=%"+respuesta[i].Vigencia+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlServicio CONTENT=%"+respuesta[i].Servicio+"\n";
    iimDisplay(respuesta[i].Codigo_UDS);
    iimPlay(codigo);
    capturarCC(respuesta[i].nPag,respuesta[i].nBeneficiarios);
  }
}
function capturarCC(pag,users) {
  iimDisplay(users);
  var IdBenef = new Array();
  var TomasBenef = new Array();
  var tipoIdBenef = new Array();
  var arreglo = new Array("3","11","19","27","35","43","51","59","67","75");
  var arreglo2 = new Array("8","16","24","32","40","48","56","64","72","80");
  var arreglo3 = new Array("2","10","18","26","34","42","50","58","66","74");
  var nPag = pag;
  var nBene = 0;
  var limite = users;
  for (var k = 1; k <= nPag; k++) {
    if (limite < 10 ) {
        nBene = limite;
      }else{
        iimDisplay("Entro"+limite);
        nBene = 10;
      };
   iimDisplay(nPag);
       iimDisplay(" la pagina es "+k+" el numero de bene"+nBene);
             if (k!=1) {
                paginador(k);
              };
            capturarTipoid();
            capturarCedula();
            capturarNtomas();
        for (var j = 0; j <= nBene; j++) {
            iimDisplay("UNIDAD  "+j+"  pagina "+k+"  cantidad de Beneficiarios  "+nBene);
            iimDisplay(IdBenef[j]);
            switch(TomasBenef[j]){
              case "0":
                ingresarItenBENE(j);
                buscarUser(IdBenef[j],TomasBenef[j]);
                 if (k!=1) {
                    paginador(k);
                  };
                break;
              case "1":
                  ingresarItenBENE2(j);
                  toma2(tipoIdBenef[j]);
                  if (k!=1) {
                    paginador(k);
                  };
                break;
              default:
                break;
            };
        }; 
        limite = limite-10;
    };
function capturarTipoid(){ 
//alert("entro");   
    for (var i = 0; i < nBene ; i++) {
      var codigo = "CODE:\n";
      codigo += "TAG POS=1 TYPE=TH ATTR=TXT:*"+"\n";
      if (i!=10) {
         iimDisplay(i);
        codigo += "TAG POS=R"+arreglo3[i]+" TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
        //codigo += "PROMPT {{!EXTRACT}}"+"\n";
      };
      iimPlay(codigo);
      tipoIdBenef[i]=iimGetExtract(i);
    };
  }
  function capturarCedula(){    
    for (var i = 0; i < nBene ; i++) {
      var codigo = "CODE:\n";
      codigo += "TAG POS=1 TYPE=TH ATTR=TXT:*"+"\n";
      if (i!=10) {
         iimDisplay(i);
        codigo += "TAG POS=R"+arreglo[i]+" TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
        //codigo += "PROMPT {{!EXTRACT}}"+"\n";
      };
      iimPlay(codigo);
      IdBenef[i]=iimGetExtract(i);
    };
  }
function capturarNtomas(){    
    for (var i = 0; i < nBene ; i++) {
      var codigo = "CODE:\n";
      codigo += "TAG POS=1 TYPE=TH ATTR=TXT:*"+"\n";
      if (i!=10) {
         iimDisplay(i);
        codigo += "TAG POS=R"+arreglo2[i]+" TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
        //codigo += "PROMPT {{!EXTRACT}}"+"\n";
      };
      iimPlay(codigo);
      TomasBenef[i]=iimGetExtract(i);
    };
  }
}
function toma2(tipoID){
  var ejecutor;
  var errtex = ""; 
  var tipoBeneficiario;
  if (tipoID == "RC") {
    tipoBeneficiario = 5;
  }else{
    tipoBeneficiario = 2;    
  };
  var codigo = "CODE:\n";
      codigo += "SET !EXTRACT_TEST_POPUP YES"+"\n";
      codigo += "TAG POS=1 TYPE=TH ATTR=TXT:*"+"\n";
      codigo += "TAG POS=R7 TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
      codigo += "SET !VAR1 {{!EXTRACT}}"+"\n";
      codigo += "SET !EXTRACT NULL"+"\n";
      codigo += "TAG POS=1 TYPE=TD ATTR=TXT:{{!VAR1}}"+ "\n";
      codigo += "TAG POS=R1 TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
      //VAR2 GUARDA LA TALLA 1
      codigo += "SET !VAR2 {{!EXTRACT}}"+"\n";
      codigo += "SET !EXTRACT NULL"+"\n";
      codigo += "TAG POS=1 TYPE=TD ATTR=TXT:{{!VAR2}}"+ "\n";
      codigo += "TAG POS=R1 TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
      codigo += "SET !VAR5 {{!EXTRACT}}"+"\n";
      codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
      codigo += "WAIT SECONDS = 1"+"\n";
      switch(tipoBeneficiario){
        case 5:
          // CALCULO Y GUARDO PESO 2
          codigo += "SET !VAR3 EVAL(\"var peso3={{!VAR1}};var aumento4=Math.floor(Math.random()*1 + 1)+Math.random();var peso4=peso3+aumento4; peso4.toFixed(2);\")"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPeso CONTENT={{!VAR3}}"+"\n";                      // CALCULO Y GUARDO TALLA 2
          codigo += "SET !VAR4 EVAL(\"var talla3={{!VAR2}};var aumentot4=Math.floor(Math.random()*2 + 1)+Math.random();var talla4=talla3+aumentot4; talla4.toFixed(2);\")"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtTalla CONTENT={{!VAR4}}"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaValoracionNuricional_txtFecha CONTENT=05/05/2015"+"\n";
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
          codigo += "WAIT SECONDS=0.5"+"\n";
          break;
        case 2:
            codigo += "SET !VAR3 EVAL(\"var peso3={{!VAR1}};var aumento4=Math.floor(Math.random()*1 + 1)+Math.random();var peso4=peso3+aumento4; peso4.toFixed(2);\")"+"\n";
            codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPeso CONTENT={{!VAR3}}"+"\n";
            codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtTalla CONTENT={{!VAR2}}"+"\n";
            codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaValoracionNuricional_txtFecha CONTENT=05/05/2015"+"\n";
            codigo += "SET !TIMEOUT_STEP 1"+"\n";
            codigo += "SET !VAR6 EVAL(\"var semGest={{!VAR5}};var aumento= 12;var semGest2=semGest+aumento; semGest2\")"+"\n";
            codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSemanasGestacion CONTENT={{!VAR6}}"+"\n";
            codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
            codigo += "WAIT SECONDS=0.5"+"\n";
          break;
        default:
          break;
      };
      ejecutor = iimPlay(codigo);
          if (ejecutor < 0) {              
              errtext = iimGetLastError();
              iimDisplay(errtext);
              guardar();
              retornar2();
          }else{
              retornar2();            
          };  
}
function buscarUser(id,ctomas){
  iimDisplay(ctomas);
  var ejecutor;
  var errtex = ""; 
  var datosJson =  HTTPGET('http://localhost/lucy/benePeso.json');
  var respuesta = JSON.parse(datosJson);
  var talla = 0;
  var peso = 0;
  var codigo = "CODE:\n";
  for (var j in respuesta) {
    if (respuesta[j].nId == id) {
      talla = calcularTalla(respuesta[j].fnac,respuesta[j].sexo);
      peso = generar_peso(respuesta[j].sexo,talla);
      var codigo = "CODE:\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbCarneSaludVigente_0"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaValoracionNuricional_txtFecha CONTENT=04/02/2015"+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPeso CONTENT="+peso+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtTalla CONTENT="+talla+"\n";
          codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbPresentaCarneVacunacion_0"+"\n";
          switch(respuesta[j].tipoBene){
            case 5:
              codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbCarneVacunacionAlDia_0"+"\n";
              codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbCarneCrecimientoDesarrollo_0"+"\n";
              break;
            case 2:
              codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtSemanasGestacion CONTENT="+Math.floor(Math.random()*4 + 12)+"\n";
              codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbAsistioControlesOdontologicos_0"+"\n";
              codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTipoComplementoAlimentarioRecibe CONTENT=%1"+"\n";
              break;
            case 3:
              codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbAsistioControlesOdontologicos_0"+"\n";
              codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTipoComplementoAlimentarioRecibe CONTENT=%1"+"\n";
              break;
            default:
              break;
            };
          codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
          codigo += "SET !TIMEOUT_STEP 6"+"\n";
          codigo += "WAIT SECONDS= 1"+"\n";
        ejecutor = iimPlay(codigo);
          if (ejecutor < 0) {              
              errtext = iimGetLastError();
              iimDisplay(errtext);
              retornar2();
          };
          retornar2();
          break;
    }else{
      continue;
    };
  };
}
function retornar2 () {
   var codigo = "CODE:\n";
   codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
   iimPlay(codigo);
}
function guardar () {
   var codigo = "CODE:\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
    codigo += "SET !TIMEOUT_STEP 60"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
   iimPlay(codigo);
}
function generarTallaAdultos () {
  return Math.floor(Math.random() * (185 -150 + 1)) + 150
}
function calcularTalla(fnac,sexo){
  var meses_vividos = Math.floor((restaFechas(fnac,'04/02/2015')/365)*12);
  if (sexo == "F") {
    if (meses_vividos<=72) {
      talla1 = talla_ninas[meses_vividos][Math.floor(Math.random()*3 + 2)];
    }else{
      talla1 = generarTallaAdultos ();
    };
  }else if (sexo == "M") {
    if (meses_vividos<=72) {
      talla1 = talla_ninos[meses_vividos][Math.floor(Math.random()*3 + 2)];
    }else{
      talla1 = generarTallaAdultos ();
    };
  }else{
     alert('parametros de busqueda incorrecto');
    };
  return talla1;
}
function generar_peso (sexo,talla) {
     if (sexo == "F") {
      if (parseInt(talla) <=127) {
          peso1 = peso_ninas[parseInt(talla)][Math.floor(Math.random()*3 + 2)];
        }else{
          //alert("la talla"+parseInt(talla)+"aleatorio"+Math.floor(Math.random()*2 + 1))
          peso1 = peso_mujeres[parseInt(talla)][Math.floor(Math.random()*2 + 1)];
        };
    }
    else if (sexo == "M") {
      if (parseInt(talla) <=127) {
        peso1 = peso_ninos[parseInt(talla)][Math.floor(Math.random()*3 + 2)];
      }else{
        //alert("No existen hombres Lactantes/Gestante")
      };
    }
    else{
     alert('parametros de busqueda incorrecto');
    }
  return peso1;
}

function ingresarItenBENE (dato) {
  var codigo = "CODE:\n";
    codigo += "SET !EXTRACT NULL"+"\n";
    codigo += "SET !TIMEOUT_STEP 6"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiarios_btnInfo_"+dato+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
  iimPlay(codigo);
}
function ingresarItenBENE2 (dato) {
  var codigo = "CODE:\n";
    codigo += "SET !EXTRACT NULL"+"\n";
    codigo += "SET !TIMEOUT_STEP 6"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiarios_btnInfo_"+dato+"\n";
    //codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
  iimPlay(codigo);
}

function core () {
  var menu= new Tareas();
    menu.mostrarMenu();
}
core();