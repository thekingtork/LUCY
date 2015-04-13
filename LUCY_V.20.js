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
  this.getTare = function (pos) {
    return Tare[pos];
  }
  this.Longitud = function () {
    return Tare.length
  }
}
Tareas.prototype.mostrarMenu = function() {
  var opcion = prompt("Ingrese la actividad a Desarrollar: "+"\n"+"\n"+"[0] "+this.getTare(0)+"\n"+"[1]  "+this.getTare(1)+"\n"+"[2]  "+this.getTare(2)+"\n"+"[3]  "+this.getTare(3)+"\n"+"[4]  "+this.getTare(4)+"\n"+"[5]  "+this.getTare(5),"");
    switch (opcion) {
        case "0":
            accederCuentame();
          break
        case "1":
            buscarContrato();
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
		codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdVigencia CONTENT=%7"+"\n";
		codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdRegional CONTENT=%10"+"\n";
		codigo += "TAG POS=1 TYPE=LABEL FORM=ID:form1 ATTR=TXT:Dirección<SP>de<SP>Primera<SP>Infancia"+"\n";
		codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_cblDireccionesICBF_0 CONTENT=YES"+"\n";
		codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
		codigo += "WAIT SECONDS=1"+"\n";
		codigo += "SET !TIMEOUT_STEP 15"+"\n";
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
		//codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlDepartamento CONTENT=%"+departamento+"\n";
		codigo += "WAIT SECONDS=1"+"\n";
		//codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlMunicipio CONTENT=%"+municipio+"\n";
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
                  codigo += "SET !TIMEOUT_STEP 5"+"\n";
                  codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdTipoBeneficiario CONTENT=%"+respuesta[j].TIPO_DE_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdDepartamentoResidencia CONTENT=%"+respuesta[j].DEPARTAMENTO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
                  codigo += "WAIT SECONDS=1"+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdMunicipioResidencia CONTENT=%"+respuesta[j].MUNICIPIO_DE_RESIDENCIA_DEL_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaVinculacion_txtFecha CONTENT=27/03/2014"+"\n";
                  codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlTipoDocumento CONTENT=%"+respuesta[j].TIPO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtNumeroDocumento CONTENT="+respuesta[j].NUMERO_DE_DOCUMENTO_DE_IDENTIDAD_DEL_BENEFICIARIO+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_btnFiltrar"+"\n";
                  codigo += "WAIT SECONDS=1"+"\n";
                  codigo += "SET !TIMEOUT_STEP 1"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_gvBeneficiarios_chkAdd_0 CONTENT=YES"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaAtencion_txtFecha CONTENT=04/02/2015"+"\n";
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
       codigo += "SET !TIMEOUT_STEP 5"+"\n";
       codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlMunicipio CONTENT=%"+456+"\n";
       codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
       iimPlay(codigo);
}

function capturarUDS(pag) {
  var codigoUDS = new Array();
  var arreglo = new Array("2","7","12","17","22","27","32","37","42","47");
  var nPag = pag;
  for (var k = 1; k <= nPag; k++) {
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
  for (var j = 0; j < Nservicio; j++) {
    var aux = (cantidadUDS[j]%10);
    if (aux!=0) {
      var nPag = ((cantidadUDS[j]/10)+1);   
    }else{
      var nPag = (cantidadUDS[j]/10);
    };
    var dato = parseInt(nPag);
    recorridoVinculacion(j);
    capturarUDS(dato);
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
  var codigo = "CODE:\n";
    codigo += "URL GOTO=https://rubonline.icbf.gov.co/"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=NAME:loGeneraciones$UserName CONTENT=victor.puello"+"\n";
    codigo += "SET !ENCRYPTION NO"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:form1 ATTR=NAME:loGeneraciones$Password CONTENT=samy1025"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:form1 ATTR=NAME:loGeneraciones$LoginButton"+"\n";
  iimPlay(codigo);
  core();
}
function buscarContrato(){
  var Url = new Ruta();
  var code = "CODE:\n";
    code += "TAB T=1"+"\n";
    code += "URL GOTO="+Url.getDireccion(0);+"\n";
  iimPlay(code);
  var anioContrato = prompt("AÃ±o del contrato","");
  var aux = 1;
    if (anioContrato=="2015") {
      aux=7;
    } else{
      if(anioContrato=="2014"){
        aux=6;
      }else{
        aux=1;
      };
    };
  var codigo = "CODE:\n";
    codigo += "TAB T=1"+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:cphCont_ddlIdVigencia CONTENT=%"+aux+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ID:form1 ATTR=ID:cphCont_cblDireccionesICBF_0 CONTENT=YES"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
  iimPlay(codigo);
    tiempo(10);
      codigo = "";
      codigo = "CODE:\n";
      codigo += "TAB T=1"+"\n";
      codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%3"+"\n";
    iimPlay(codigo);
    Servicios();
}

function paginador (pag){
  iimDisplay("Entor a pagina:  "+pag);
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

function Servicios () {
  var nSer = prompt('Ingresa el numero de Servicios a procesar:','');
  var contrato = new Contratos(nSer);
  for (var i = 0; i < contrato.Servicios; i++) {//cambiar para fami
    var codigo = "CODE:\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvServicioContratado_btnInfo_"+i+"\n";
    codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%1"+"\n";
    codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/list.png"+"\n";
    iimPlay(codigo);
    var nPag = 1;
    for (var k = 1; k <= nPag; k++) {
      for (var j = 0; j < 10; j++) {
        if (k!=1) {
          paginador(k);
        };
        codigo = "";
        codigo = "CODE:\n";
        codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvServicioUnidad_btnInfo_"+j+"\n";
        codigo += "TAG POS=1 TYPE=SELECT FORM=ID:form1 ATTR=ID:ddlExtends CONTENT=%1"+"\n";
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
      };
    };
    contrato.setProcesado(i+1);
    if (contrato.getProcesado()<contrato.Servicios) {
      codigo = "";
      codigo = "CODE:\n";
      codigo += "URL GOTO=https://rubonline.icbf.gov.co/Page/RubOnline/ServicioContratado/List.aspx"+"\n";
      iimPlay(codigo);
    } else{
      alert("TAREA DE DESVINCULACION TERMINADA CON EXITO");
    };
  };  
}

function core () {
  var menu= new Tareas();
    menu.mostrarMenu();
}
core();