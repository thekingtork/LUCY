restaFechas = function(f1,f2){
  var aFecha1 = f1.split('/'); 
  var aFecha2 = f2.split('/'); 
  var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]); 
  var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]); 
  var dif = fFecha2 - fFecha1;
  var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
return dias;
} 
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
    for (var j = 1; j <= respuesta[i].nPag; i++) {
      alert("La UDS"+respuesta[i].Codigo_UDS+"Tiene "+respuesta[i].nBeneficiarios+"Usuarios");
      capturarCC(j,respuesta[i].nBeneficiarios);
    };
  }
}
function capturarCC(pag,users) {
  iimDisplay(users);
  var IdBenef = new Array();
  var arreglo = new Array("3","11","19","27","35","43","51","59","67","75");
  var nPag = pag;
  var nBene = 0;
  if (users < 10 ) {
    nBene = users;
    alert("Es menor que diez "+nBene);
  }else{
    iimDisplay("Entro"+users);
    nBene = arreglo.length;
  };
  for (var k = 1; k <= nPag; k++) {
   iimDisplay(nPag);
       iimDisplay(" la pagina es "+k+" el numero de bene"+nBene);
             if (k!=1) {
                paginador(k);
              };
            capturar();
        for (var j = 0; j < nBene; j++) {
            iimDisplay("UNIDAD  "+j+"  pagina "+k+"  cantidad de Beneficiarios  "+nBene);
            iimDisplay(IdBenef[j]);
            ingresarItenUDS(j);
            buscarUser(IdBenef[j]);
            //vinc(IdBenef[j]);
             if (k!=1) {
                paginador(k);
              };
        }; 
    };
function buscarUser(id){
  var ejecutor;
  var errtex = ""; 
  var datosJson =  HTTPGET('http://localhost/lucy/benePeso.json');
  var respuesta = JSON.parse(datosJson);
  var talla = 0;
  for (var j in respuesta) {
            iimDisplay("Busqueda "+j+" en UDS "+ _uds);
               if (respuesta[j].nId == id) {
                  talla=calcularTalla(respuesta[j].fnac);
                  var codigo = "CODE:\n";
                  codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:cphCont_rbCarneSaludVigente_0"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbPresentaCarneVacunacion_0"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbCarneVacunacionAlDia_0"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_cuwFechaValoracionNuricional_txtFecha CONTENT=04/02/2015"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtPeso CONTENT="+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:form1 ATTR=ID:cphCont_txtTalla CONTENT=78"+"\n";
                  codigo += "TAG POS=1 TYPE=INPUT:RADIO FORM=ID:form1 ATTR=ID:rbCarneCrecimientoDesarrollo_0"+"\n";
                  codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/save.gif"+"\n";
               };
  }
}
function(fnac){

}
  function capturar(){    
    for (var i = 0; i < nBene ; i++) {
     // alert(nBene);
      var codigo = "CODE:\n";
      codigo += "TAG POS=1 TYPE=TH ATTR=TXT:*"+"\n";
      if (i!=10) {
         iimDisplay(i);
        codigo += "TAG POS=R"+arreglo[i]+" TYPE=TD ATTR=TXT:* EXTRACT=TXT"+"\n";
        codigo += "PROMPT {{!EXTRACT}}"+"\n";
      };
      iimPlay(codigo);
      IdBenef[i]=iimGetExtract(i);
    };
  }
}
function ingresarItenUDS (dato) {
  var codigo = "CODE:\n";
    codigo += "SET !EXTRACT NULL"+"\n";
    codigo += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ID:form1 ATTR=ID:cphCont_gvServicioUnidad_btnInfo_"+dato+"\n";
    //codigo += "TAG POS=1 TYPE=IMG ATTR=SRC:https://rubonline.icbf.gov.co/Image/btn/add.gif"+"\n";
    //codigo += "BACK"+"\n";
  iimPlay(codigo);
}
cargarUDS();
