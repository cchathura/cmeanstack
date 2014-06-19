<%@ page contentType="text/html;charset=UTF-8" language="java"
%><%@ page import="java.util.*,org.apache.commons.lang3.StringEscapeUtils"
%><%@ page import="java.io.IOException,java.io.StringReader"
%><%@ page import="javax.xml.parsers.DocumentBuilder, javax.xml.parsers.DocumentBuilderFactory"
%><%@ page import="javax.xml.parsers.ParserConfigurationException,javax.xml.xpath.*"
%><%@ page import="org.w3c.dom.*,org.xml.sax.InputSource,org.xml.sax.SAXException"
%><% 
HashMap<String, String> parms = (HashMap<String, String>)session.getAttribute("parms");
String capDraftsDirectoryName = parms.get("capDraftsDirectoryName");
String defaultLatLng = parms.get("alertingAreaDefaultLatLng");
String defaultZoom = parms.get("alertingAreaDefaultZoom");
String defaultLatLngZoom = defaultLatLng+","+defaultZoom;

String capXml = parms.get("capXml");
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
DocumentBuilder db = dbf.newDocumentBuilder();
InputSource is = new InputSource();
is.setCharacterStream(new StringReader(capXml));
Document doc = db.parse(is);
XPath xpath = XPathFactory.newInstance().newXPath();

XPathExpression getCapIdentifier = xpath.compile("//alert/identifier/text()");
XPathExpression getCapSender = xpath.compile("//alert/sender/text()");
XPathExpression getCapSent = xpath.compile("//alert/sent/text()");
XPathExpression getCapStatus = xpath.compile("//alert/status/text()");
XPathExpression getCapMsgType = xpath.compile("//alert/msgType/text()");
XPathExpression getCapScope = xpath.compile("//alert/scope/text()");
XPathExpression getCapRestriction = xpath.compile("//alert/restriction/text()");
XPathExpression getCapAddresses = xpath.compile("//alert/addresses/text()");
XPathExpression getCapLanguage = xpath.compile("//alert/info/language/text()");
XPathExpression getCapCategory = xpath.compile("//alert/info/category/text()");
XPathExpression getCapEvent = xpath.compile("//alert/info/event/text()");
XPathExpression getCapResponseType = xpath.compile("//alert/info/responseType/text()");
XPathExpression getCapUrgency = xpath.compile("//alert/info/urgency/text()");
XPathExpression getCapSeverity = xpath.compile("//alert/info/severity/text()");
XPathExpression getCapCertainty = xpath.compile("//alert/info/certainty/text()");
XPathExpression getCapOnset = xpath.compile("//alert/info/onset/text()");
XPathExpression getCapExpires = xpath.compile("//alert/info/expires/text()");
XPathExpression getCapSenderName = xpath.compile("//alert/info/senderName/text()");
XPathExpression getCapHeadline = xpath.compile("//alert/info/headline/text()");
XPathExpression getCapDescription = xpath.compile("//alert/info/description/text()");
XPathExpression getCapInstruction = xpath.compile("//alert/info/instruction/text()");
XPathExpression getCapWeb = xpath.compile("//alert/info/web/text()");
XPathExpression getCapContact = xpath.compile("//alert/info/contact/text()");
XPathExpression getCapResourceDesc = xpath.compile("//alert/info/resource/resourceDesc/text()");
XPathExpression getCapUri = xpath.compile("//alert/info/resource/uri/text()");
XPathExpression getCapAreaDesc = xpath.compile("//alert/info/area/areaDesc/text()");
XPathExpression getCapCircle = xpath.compile("//alert/info/area/circle/text()");
XPathExpression getCapGeocode = xpath.compile("//alert/info/area/geocode/text()");
XPathExpression getCapPolygon = xpath.compile("//alert/info/area/polygon/text()");

%><!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="keywords" content="CAP,common alerting protocol,CAP alert editor">
<meta http-equiv="content-type" content="text/html; charset=UTF-8">
<meta http-equiv="content-language" content="en">
<meta name="description" content="Editing tool for alerts in CAP (X.1303) format"/>
<meta name="author" content="Eliot Christian"/> 
<meta name="expires" content="never"/>
<title>Editing tool for alerts in CAP (X.1303) format</title>
<style> 
body {font: normal 12px verdana;}
.link {color:blue;text-decoration:underline;cursor:pointer};
</style>

</head>
<body onload="bodyLoaded();">
<p>Click for <a href="textTemplates.html"  target="_blank">headline, description, instruction</a> text suggestions.</p>
<table><tr>
<td width="50%" valign="top">
 <form name="capForm">
  <input name="alertingAuthorityOid" value="<%= parms.get("alertingAuthorityOid") %>" type="hidden" />
  <input name="capDraftsDirectoryName" value="<%= capDraftsDirectoryName %>" type="hidden" />
  <input name="defaultLatLng" value="<%= defaultLatLng %>" type="hidden" />
  <input name="defaultZoom" value="<%= defaultZoom %>" type="hidden" />
  <input name="defaultLatLngZoom" value="<%= defaultLatLngZoom %>" type="hidden" />
 <table>
 <tbody>
  <tr>
    <td title="[mandatory] identifier has a unique value assigned by the sender.">
    &nbsp;<b>identifier</b> 
        <input onchange="makeXML();" name="capIdentifier" 
               value="<%= (String)getCapIdentifier.evaluate(doc) %>" size="40" id="capIdentifier" />
    </td>
  </tr>
  <tr>
    <td>
     <table>
     <tbody><tr>
      <td title="[mandatory] sender is typically an e-mail addreess at the sender organization." width="50%">
         &nbsp;<b>sender</b>&nbsp; 
          <input onchange="makeXML();" name="capSender" 
               value="<%= (String)getCapSender.evaluate(doc) %>" size="25" id="capSender" />
      </td>
      <td title="[mandatory] sent provides the message date/time." width="50%">
        &nbsp;<b>sent</b>&nbsp; 
        <input onchange="makeXML();" name="capSent" 
               value="<%= (String)getCapSent.evaluate(doc) %>" size="25" id="capSent" />
      </td>
     </tr>
     </tbody></table>
    </td>
  </tr>
  <tr>
    <td>
     <table>
     <tbody><tr>
      <td title="[mandatory] status may have values: Actual, System, Test." width="33%">
      &nbsp;<b>status</b>
      <select onchange="makeXML();" name="capStatus" id="capStatus"> 
        <option value="<%= (String)getCapStatus.evaluate(doc) %>" selected="selected"><%= (String)getCapStatus.evaluate(doc) %></option>
      </select>
      </td>
      <td title="[mandatory] msgType may have values: Alert, Update, Cancel, Ack, Error" width="33%">
      &nbsp;<b>msgType</b>
      <select onchange="makeXML();" name="capMsgType" id="capMsgType"> 
        <option value="<%= (String)getCapMsgType.evaluate(doc) %>" selected="selected"><%= (String)getCapMsgType.evaluate(doc) %></option>
      </select>
      </td>
      <td title="[mandatory] scope may have values: Public, Restricted, Private" width="33%">
      &nbsp;<b>scope</b>
      <select onchange="makeXML();" name="capScope" id="capScope"> 
        <option value="<%= (String)getCapScope.evaluate(doc) %>" selected="selected"><%= (String)getCapScope.evaluate(doc) %></option>
      </select>
      </td>
     </tr>
     </tbody></table>
    </td>
  </tr>
  <tr style="display:none" id="rowRestriction" >
    <td title="restriction has the rule for limiting distribution of the restricted alert">
    &nbsp;<b>restriction:</b>
        <input onchange="makeXML();" name="capRestriction" 
               value="<%= (String)getCapRestriction.evaluate(doc) %>" size="50" id="capRestriction" />
    </td>
  </tr>
  <tr style="display:none" id="rowAddresses" >
    <td title="addresses are e-mail for intended recipients of the private alert">
    &nbsp;<b>addresses:</b>
        <input onchange="makeXML();" name="capAddresses" 
               value="<%= (String)getCapAddresses.evaluate(doc) %>" size="50" id="capAddresses" />
    </td>
  </tr>
  <tr>
    <td>
    <table><tbody><tr>
      <td title="language indicates the natural language used for the alert text" width="28%">
      &nbsp;<b>language</b>
       <select onchange="makeXML();" name="capLanguage" id="capLanguage"> 
        <option value="<%= (String)getCapLanguage.evaluate(doc) %>" selected="selected"><%= (String)getCapLanguage.evaluate(doc) %></option>
       </select>
      </td>
      <td title="category may have values: Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Infra, Other" width="32%">
      &nbsp;<b>category</b>
       <select onchange="makeXML();" name="capCategory" id="capCategory"> 
        <option value="<%= (String)getCapCategory.evaluate(doc) %>" selected="selected"><%= (String)getCapCategory.evaluate(doc) %></option>
       </select>
      </td>
      <td title="responseType is the action recommended for the target audience." width="40%">
      &nbsp;<b>responseType</b>
       <select onchange="makeXML();" name="capResponseType" id="capResponseType"> 
        <option value="<%= (String)getCapResponseType.evaluate(doc) %>" selected="selected"><%= (String)getCapResponseType.evaluate(doc) %></option>
       </select>
      </td>
    </tr></tbody></table>
    </td>
  </tr>
  <tr>
    <td title="[mandatory] event refines the category to give the type of the event">
    &nbsp;<b>event:</b>
        <input onchange="makeXML();" name="capEvent" 
               value="<%= (String)getCapEvent.evaluate(doc) %>" size="50" id="capEvent"/>
    </td>
  </tr> 
  <tr>
    <td>
    <table><tbody><tr>
      <td title="[mandatory] urgency  may have values: Immediate, Expected, Future, Past, Unknown" width="33%">
      &nbsp;<b>urgency</b>
      <select onchange="makeXML();" name="capUrgency" id="capUrgency"> 
        <option value="<%= (String)getCapUrgency.evaluate(doc) %>" selected="selected"><%= (String)getCapUrgency.evaluate(doc) %></option>
      </select>
      </td>
      <td title="[mandatory] severity may have values: Extreme, Severe, Moderate, Minor, Unknown." width="33%">
      &nbsp;<b>severity</b>
      <select onchange="makeXML();" name="capSeverity" id="capSeverity"> 
        <option value="<%= (String)getCapSeverity.evaluate(doc) %>" selected="selected"><%= (String)getCapSeverity.evaluate(doc) %></option>
      </select>
      </td>
      <td title="[mandatory] certainty may have values: Very Likely, Likely, Possible, Unlikely, Unknown" width="33%">
      &nbsp;<b>certainty</b>
      <select onchange="makeXML();" name="capCertainty" id="capCertainty"> 
        <option value="<%= (String)getCapCertainty.evaluate(doc) %>" selected="selected"><%= (String)getCapCertainty.evaluate(doc) %></option>
      </select>
      </td>
    </tr></tbody></table>
    </td>
  </tr>
  <tr>
   <td>
   <table><tbody><tr>
      <td title="date/time when the event is expected to begin." width="50%">
          &nbsp;<b>onset</b>&nbsp;
          <input onchange="makeXML();" name="capOnset" 
                 value="<%= (String)getCapOnset.evaluate(doc) %>" size="25" id="capOnset" />
      </td>
      <td title="date/time when the message will be no longer in effect." width="50%">
          &nbsp;<b>expires</b>&nbsp;
          <input onchange="makeXML();" name="capExpires" 
                 value="<%= (String)getCapExpires.evaluate(doc) %>" size="25" id="capExpires" />
      </td>
    </tr></tbody></table>
   </td>
  </tr>
  <tr>
    <td title="senderName identifies the sender organization.">
    &nbsp;<b>senderName:</b>
        <input onchange="makeXML();" name="capSenderName" 
               value="<%= (String)getCapSenderName.evaluate(doc) %>" size="50" id="capSenderName" />
    </td>
  </tr> 
  <tr>
    <td title="headline should be brief and human-readable.">
    &nbsp;<b>headline</b><br>
        <input onchange="makeXML();" name="capHeadline" 
               value="<%= (String)getCapHeadline.evaluate(doc) %>" size="80" id="capHeadline" /><br/>
    </td>
  </tr>
  <tr>
    <td title="description of the subject event of the alert message.">
    &nbsp;<b>description</b><br> 
        <textarea onchange="makeXML();" name="capDescription" rows="7" cols="60" id="capDescription"><%= 
        (String)getCapDescription.evaluate(doc) 
        %></textarea> 
    </td>
  </tr>
  <tr>
    <td title="instruction gives the recommended action to be taken by recipients of the alert message.">
    &nbsp;<b>instruction</b><br> 
        <textarea onchange="makeXML();" name="capInstruction" rows="7" cols="60" id="capInstruction"><%= 
        (String)getCapInstruction.evaluate(doc) 
        %></textarea> 
    </td>
  </tr>
  <tr>
    <td title="web identifies an information Web page available via the given URL.">
    &nbsp;<b>web</b> 
        <input onchange="makeXML();" name="capWeb" 
               value="<%= (String)getCapWeb.evaluate(doc) %>" size="70" id="capWeb" />
    </td>
  </tr>
  <tr>
    <td title="image identifies an image available via the given URL.">
    &nbsp;<b>image</b> 
       <input onchange="makeXML();" name="capUri" 
              value="<%= (String)getCapUri.evaluate(doc) %>" size="70" id="capUri" />
    </td>
  </tr>
  <tr>
    <td title="contact identifies a contact program person available to discusss the alert.">
    &nbsp;<b>contact</b> 
       <input onchange="makeXML();" name="capContact" 
              value="<%= (String)getCapContact.evaluate(doc) %>" size="70" id="capContact" />
    </td>
  </tr>
  <tr>
    <td title="[mandatory] areaDesc describes the target area of the alert.">
    &nbsp;<b>areaDesc</b><br> 
        <textarea onchange="makeXML();" name="capAreaDesc" rows="2" cols="60" id="capAreaDesc"><%= 
        (String)getCapAreaDesc.evaluate(doc) 
        %></textarea> 
    </td>
  </tr>
  <tr>
    <td>
    <table>
      <tbody><tr>
        <td title="'lat,lon radius' in decimal degrees and kilometers">
          <b>circle</b><br>
          <input onchange="makeXML();" name="capCircle" 
                 value="<%= (String)getCapCircle.evaluate(doc) %>" size="25" id="capCircle" /><br/>
          Circle format: lat,long&lt;space&gt;radius<br/>
          <span class="link" onclick="getCircle(<%= defaultLatLngZoom %>)">Make circle using map</span>
        </td>
        <td title="geographic code as 'type' = 'value' pair">
          <b>geocode</b><br>
          <input onchange="makeXML();" name="capGeocode" 
                 value="<%= (String)getCapGeocode.evaluate(doc) %>" size="30" id="capGeocode" /><br/>
          Geocode format: 'type' = 'value'
        </td>
      </tr>
      <tr>
        <td title="space-delimited list of 'lat,lon' coordinate pairs" colspan="2">
          <b>polygon</b><br>
          <input onchange="makeXML();" name="capPolygon" 
                 value="<%= (String)getCapPolygon.evaluate(doc) %>" size="80" id="capPolygon" /><br/>
          Polygon format: <u>SW NW NE SE SW</u> (lat,lon points)<br/>          
          <span class="link" onclick="getRectangle(<%= defaultLatLngZoom %>)">Make rectangle using map</span>
        </td>
      </tr>
      <tr>
        <td title="alerting area" colspan="2">
          <div id="map_canvas" style="width:500px;height:500px;"></div>
        </td>
      </tr>
    </tbody></table>
    </td>
  </tr>
 </tbody>
</table>
</form>
</td>

<td width="50%" valign="top">
 <table><tr><td valign="top">
  <form id="validateCapForm" >
    <input name="escapedCapXml" value="<%= StringEscapeUtils.escapeXml(parms.get("capXml")) %>" type="hidden" />
    <input value="Validate (Google)" onclick="crossDomainPost();" type="button" />
  </form>
  <form method="post" action="EditController" id="saveAlertForm">
    <input name="editStep" value="saveAlert" type="hidden" />
    <input name="capPathFileName" value="" type="hidden" />
    <input value="Save edited alert" onclick="saveAlert();" type="button" id="saveAlertButton" />
    <div id="capXmlDiv" style="display:none">
     <input type="button"  value="Hide XML" onclick="document.getElementById('capXmlDiv').style.display='none';">
     <textarea id="capXml" rows="50" cols="80" name="capXml"></textarea>
    </div>
  </form>
  <input type="button" value="Show XML" onclick="document.getElementById('capXmlDiv').style.display='';">
  <form method="post" action="EditController" name="endSessionButton" >
    <input name="editStep" value="endSession" type="hidden" />
    <input type="submit" value="End this session" />
  </form>
 </td></tr></table>
</td>

</tr></table>
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=geometry&sensor=false"></script>
<script type="text/javascript" src="alertArea.js"></script>
<script type="text/javascript"> 
function bodyLoaded() {
	if(google && google.maps){
		initMap();
	} else {
		alert("Cannot detect access to Google maps.");
	}	
	setSelectors();
	makeXML();
};

var alertXML = "";
var today = new Date();
var yearUTC = today.getUTCFullYear().toString();
var monthUTC = today.getUTCMonth()+1;
var monthUTCpad = pad2(monthUTC);
var dateUTC = today.getUTCDate();
var dateUTCpad = pad2(dateUTC);
var hourUTC = today.getUTCHours();
var hourUTCpad = pad2(hourUTC);
var minuteUTC = today.getUTCMinutes();
var minuteUTCpad = pad2(minuteUTC);
var secondUTC = today.getUTCSeconds();
var secondUTCpad = pad2(secondUTC);
var browserMS = false;
var submitDone = false;
var capXml;
var escapedCapXml;
var capDom;
var defaultLatLngZoom;

function pad2(number) {
 return (number < 10 ? '0' : '') + number;
}

function capElementValue(xmlElement) {
  if (capDom.getElementsByTagName(xmlElement).length > 0) {
    return capDom.getElementsByTagName(xmlElement)[0].firstChild.nodeValue;
  } 
  else if (capDom.getElementsByTagName("cap:" + xmlElement).length > 0) {
    return capDom.getElementsByTagName("cap:" + xmlElement)[0].firstChild.nodeValue;
    }
  else {
    return "";
  }
}

function makeXML() {
  defaultLatLngZoom = document.capForm.defaultLatLngZoom.value;
  document.capForm.capIdentifier.value = document.capForm.alertingAuthorityOid.value+"."+ 
  yearUTC+"."+monthUTC+"."+dateUTC+"."+hourUTC+"."+minuteUTC+"."+secondUTC;
  document.capForm.capSent.value = yearUTC + "-" + monthUTCpad + "-" + dateUTCpad + "T" 
                          + hourUTCpad + ":" + minuteUTCpad + ":" + secondUTCpad + "-00:00";
  alertXML = "  <cap:identifier>" + document.capForm.capIdentifier.value.trim() + "<\/cap:identifier>\n";
  if (document.capForm.capSender.value.trim() !== "") {
    alertXML = alertXML +
    "  <cap:sender>" + document.capForm.capSender.value.trim() + "<\/cap:sender>\n";
  }
  if (document.capForm.capSent.value.trim() !== "") {
    alertXML = alertXML +
    "  <cap:sent>" + document.capForm.capSent.value.trim() + "<\/cap:sent>\n";
  }
  if (document.capForm.capStatus.value.trim() !== "") {
    alertXML = alertXML +
    "  <cap:status>" + document.capForm.capStatus.value.trim() + "<\/cap:status>\n";
  }
  if (document.capForm.capMsgType.value.trim() !== "") {
    alertXML = alertXML +
    "  <cap:msgType>" + document.capForm.capMsgType.value.trim() + "<\/cap:msgType>\n";
  }
  if (document.capForm.capScope.value.trim() !== "") {
    alertXML = alertXML +
    "  <cap:scope>" + document.capForm.capScope.value.trim() + "<\/cap:scope>\n";
    if (document.capForm.capScope.value.trim() == "Restricted") {
    	document.getElementById('rowRestriction').style.display = "";
    } else {
    	document.getElementById('rowRestriction').style.display = "none";
    }
    if (document.capForm.capScope.value.trim() == "Private") {
        document.getElementById('rowAddresses').style.display = "";
      } else {
    	  document.getElementById('rowAddresses').style.display = "none";
      }
  }
  if (document.capForm.capRestriction.value.trim() !== "") {
	    alertXML = alertXML +
	    "  <cap:restriction>" + document.capForm.capRestriction.value.trim() + "<\/cap:restriction>\n";
	  }
  if (document.capForm.capAddresses.value.trim() !== "") {
	    alertXML = alertXML +
	    "  <cap:addresses>" + document.capForm.capAddresses.value.trim() + "<\/cap:addresses>\n";
	  }

  alertInfo = "";
  if (document.capForm.capLanguage.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:language>" + document.capForm.capLanguage.value.trim() + "<\/cap:language>\n";
  }
  if (document.capForm.capCategory.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:category>" + document.capForm.capCategory.value.trim() + "<\/cap:category>\n";
  }
  if (document.capForm.capEvent.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:event>" + document.capForm.capEvent.value.trim() + "<\/cap:event>\n";
  }
  if (document.capForm.capResponseType.value.trim() !== "") {
	    alertInfo = alertInfo +
	    "    <cap:responseType>" + document.capForm.capResponseType.value.trim() + "<\/cap:responseType>\n";
	  }
  if (document.capForm.capUrgency.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:urgency>" + document.capForm.capUrgency.value.trim() + "<\/cap:urgency>\n";
  }
  if (document.capForm.capSeverity.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:severity>" + document.capForm.capSeverity.value.trim() + "<\/cap:severity>\n";
  }
  if (document.capForm.capCertainty.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:certainty>" + document.capForm.capCertainty.value.trim() + "<\/cap:certainty>\n";
  }
  if (document.capForm.capOnset.value.trim() !== "") {
	  alertInfo = alertInfo +
	  "    <cap:onset>" + document.capForm.capOnset.value.trim() + "<\/cap:onset>\n";
	  }
  if (document.capForm.capExpires.value.trim() !== "") {
	  alertInfo = alertInfo +
	  "    <cap:expires>" + document.capForm.capExpires.value.trim() + "<\/cap:expires>\n";
	  }
  if (document.capForm.capSenderName.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:senderName>" + document.capForm.capSenderName.value.trim() + "<\/cap:senderName>\n";
  }
  if (document.capForm.capHeadline.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:headline>" + document.capForm.capHeadline.value.trim() + "<\/cap:headline>\n";
  }
  if (document.capForm.capDescription.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:description>" + document.capForm.capDescription.value.trim() + "<\/cap:description>\n";
  }
  if (document.capForm.capInstruction.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:instruction>" + document.capForm.capInstruction.value.trim() + "<\/cap:instruction>\n";
  }
  if (document.capForm.capWeb.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:web>" + document.capForm.capWeb.value.trim() + "<\/cap:web>\n";
  }
  if (document.capForm.capContact.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:contact>" + document.capForm.capContact.value.trim() + "<\/cap:contact>\n";
  }

  if (document.capForm.capUri.value.trim() !== "") {
    alertInfo = alertInfo +
    "    <cap:resource>\n" +
    "      <cap:resourceDesc>Image file<\/cap:resourceDesc>\n" +
    "      <cap:uri>" + document.capForm.capUri.value.trim() + "<\/cap:uri>\n" +
    "    <\/cap:resource>\n";
  }

  alertArea = "";
  if (document.capForm.capAreaDesc.value.trim() !== "") {
    alertArea = alertArea+
    "      <cap:areaDesc>" + document.capForm.capAreaDesc.value.trim() + "<\/cap:areaDesc>\n";
  }
  if (document.capForm.capPolygon.value.trim() !== "") {
    alertArea = alertArea +
    "      <cap:polygon>" + document.capForm.capPolygon.value.trim() + "<\/cap:polygon>\n";
    getRectangle(defaultLatLngZoom);
  }
  if (document.capForm.capCircle.value.trim() !== "") {
    alertArea = alertArea +
    "      <cap:circle>" + document.capForm.capCircle.value.trim() + "<\/cap:circle>\n";
    getCircle(defaultLatLngZoom);
  }
  if (document.capForm.capGeocode.value.trim() !== "") {
    alertArea = alertArea +
    "      <cap:geocode>" + document.capForm.capGeocode.value.trim() + "<\/cap:geocode>\n";
  }

  if (alertArea !== "") {
    alertInfo = alertInfo +
    "    <cap:area>\n" +
    alertArea +
    "    <\/cap:area>\n";
  }

  if (alertInfo !== "") {
    alertXML = alertXML +
    "  <cap:info>\n" +
    alertInfo +
    "  <\/cap:info>\n";
  }

  startXML = '<' + '?xml version="1.0" encoding="UTF-8" ?>\n' +
			'<cap:alert xmlns:cap="urn:oasis:names:tc:emergency:cap:1.1" >\n';
  capXml = startXML + alertXML + "<\/cap:alert>";
  document.getElementById("validateCapForm").escapedCapXml.value = capXml;
  document.getElementById("saveAlertForm").capXml.value = capXml;
  document.getElementById("saveAlertForm").capPathFileName.value = document.capForm.capDraftsDirectoryName.value+"/"+ 
			yearUTC+"-"+monthUTCpad+"-"+dateUTCpad+"-"+hourUTCpad+"-"+minuteUTCpad+"-"+secondUTCpad+".xml";
}

function saveAlert() {
  makeXML();
  if (verifyMandatories()) {
    if (!submitDone) {
        submitDone = true;
        document.getElementById("saveAlertButton").value = "Saving draft, please wait...";
        document.getElementById("saveAlertButton").disabled = true;
    } 
    try { 
    	document.getElementById("saveAlertForm").submit();
    } 
    catch ( e ) { 
       alert ( e ); 
    } 
  }
}

function verifyMandatories() {
  if (!document.capForm.capIdentifier.value.trim()) {
    alert("A CAP message identifier is mandatory.");
    document.capForm.capIdentifier.focus();
    return false;
  }
  else if (!document.capForm.capSender.value.trim()) {
    alert("A value for sender ID is mandatory.");
    document.capForm.capSender.focus();
    return false;
  }
  else if (!document.capForm.capSent.value.trim()) {
    alert("A value for sent date/time is mandatory.");
    document.capForm.capSent.focus();
    return false;
  }
  else if (!document.capForm.capStatus.value.trim()) {
    alert("A value for status is mandatory.");
    document.capForm.capStatus.focus();
    return false;
  }
  else if (!document.capForm.capScope.value.trim()) {
    alert("A value for scope is mandatory.");
    document.capForm.capScope.focus();
    return false;
  }
  else if ((document.capForm.capScope.value.trim() == "Restricted") && 
		       (!document.capForm.capRestriction.value.trim())) {
	    alert("A value for restriction is mandatory when scope is Restricted.");
	    document.capForm.capRestriction.focus();
	    return false;
  }
  else if ((document.capForm.capScope.value.trim() == "Private") && 
	       (!document.capForm.capAddresses.value.trim())) {
   alert("A value for addresses is mandatory when scope is Private.");
   document.capForm.capAddresses.focus();
   return false;
  }
  else if (!document.capForm.capMsgType.value.trim()) {
    alert("A value for msgType is mandatory.");
    document.capForm.capMsgType.focus();
    return false;
  }
  else if (!document.capForm.capEvent.value.trim()) {
    alert("A value for event is mandatory.");
    document.capForm.capEvent.focus();
    return false;
  }
  else if (!document.capForm.capUrgency.value.trim()) {
    alert("A value for urgency is mandatory.");
    document.capForm.capUrgency.focus();
    return false;
  }
  else if (!document.capForm.capSeverity.value.trim()) {
    alert("A value for severity is mandatory.");
    document.capForm.capSeverity.focus();
    return false;
  }
  else if (!document.capForm.capCertainty.value.trim()) {
    alert("A value for certainty is mandatory.");
    document.capForm.capCertainty.focus();
    return false;
  }
  else if ((document.capForm.capOnset.value.trim() && 
            document.capForm.capExpires.value.trim()) && 
           !(document.capForm.capExpires.value.trim() > 
             document.capForm.capOnset.value.trim())) {
	    alert("Expires date/time must be later than the onset.");
	    document.capForm.capExpires.focus();
	    return false;
  }
  else if (document.capForm.capExpires.value.trim() && 
          !(document.capForm.capExpires.value.trim() > 
            document.capForm.capSent.value.trim())) {
	    alert("Expires must be later than date/time sent.");
	    document.capForm.capExpires.focus();
	    return false;
 }
  else if (!document.capForm.capAreaDesc.value.trim()) {
    alert("A value for areaDesc is mandatory.");
    document.capForm.capAreaDesc.focus();
    return false;
  }
  else {
    return true;
  }
}

function crossDomainPost() {
	  var capXml = document.getElementById("validateCapForm").escapedCapXml.value;
	  // Add the iframe with a unique name
	  var iframe = document.createElement("iframe");
	  document.body.appendChild(iframe);
	  iframe.style.display = "";
	  iframe.style.width = "100%";
	  iframe.contentWindow.name = "_validateCap";
	  // construct a form with hidden inputs, targeting the iframe
	  var form = document.createElement("form");
	  form.target = "_validateCap";
	  form.action = "https://cap-validator.appspot.com/validate#r";
	  form.method = "POST";
	  form.enctype = "multipart/form-data";
	  var input = document.createElement("input");
	  input.type = "hidden";
	  input.name = "input";
	  input.value = capXml;
	  form.appendChild(input);
	  document.body.appendChild(form);
	  form.submit();
	}

function setSelectors() {
	// Note: constructor parms - new Option(text, value, defaultSelected, selected)
	var selector, selected;

	// status
	selector = document.getElementById("capStatus");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Actual", "Actual", false, false);
	selector.options[1]=new Option("Exercise", "Exercise", false, false);
	selector.options[2]=new Option("System", "System", false, false);
	selector.options[3]=new Option("Test", "Test", true, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

	// msgType
	selector = document.getElementById("capMsgType");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Alert", "Alert", true, false);
	selector.options[1]=new Option("Update", "Update", false, false);
	selector.options[2]=new Option("Cancel", "Cancel", false, false);
	selector.options[3]=new Option("Ack", "Ack", false, false);
	selector.options[4]=new Option("Error", "Error", false, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

	// scope
	selector = document.getElementById("capScope");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Public", "Public", true, false);
	selector.options[1]=new Option("Restricted", "Restricted", false, false);
	selector.options[2]=new Option("Private", "Private", false, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

	// category
	selector = document.getElementById("capCategory");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Geo", "Geo", false, false);
	selector.options[1]=new Option("Met", "Met", true, false);
	selector.options[2]=new Option("Safety", "Safety", false, false);
	selector.options[3]=new Option("Security", "Security", true, false);
	selector.options[4]=new Option("Rescue", "Rescue", false, false);
	selector.options[5]=new Option("Fire", "Fire", false, false);
	selector.options[6]=new Option("Health", "Health", true, false);
	selector.options[7]=new Option("Env", "Env", false, false);
	selector.options[8]=new Option("Transport", "Transport", false, false);
	selector.options[9]=new Option("Infra", "Infra", true, false);
	selector.options[10]=new Option("CBRNE", "CBRNE", false, false);
	selector.options[11]=new Option("Other", "Other", false, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

	// responseType
	selector = document.getElementById("capResponseType");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Shelter", "Shelter", false, false);
	selector.options[1]=new Option("Evacuate", "Evacuate", false, false);
	selector.options[2]=new Option("Prepare", "Prepare", false, false);
	selector.options[3]=new Option("Execute", "Execute", true, false);
	selector.options[4]=new Option("Monitor", "Monitor", false, false);
	selector.options[5]=new Option("None", "None", false, false);
	selector.options[6]=new Option("", "", true, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

	// urgency
	selector = document.getElementById("capUrgency");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Immediate", "Immediate", false, false);
	selector.options[1]=new Option("Expected", "Expected", true, false);
	selector.options[2]=new Option("Future", "Future", false, false);
	selector.options[3]=new Option("Past", "Past", false, false);
	selector.options[4]=new Option("Unknown", "Unknown", false, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}
	
	// severity
	selector = document.getElementById("capSeverity");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Extreme", "Extreme", false, false);
	selector.options[1]=new Option("Severe", "Severe", false, false);
	selector.options[2]=new Option("Moderate", "Moderate", false, false);
	selector.options[3]=new Option("Minor", "Minor", true, false);
	selector.options[4]=new Option("Unknown", "Unknown", false, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

	// certainty
	selector = document.getElementById("capCertainty");
	selected = selector.options[0].value;
	selector.options.length=0;
	selector.options[0]=new Option("Observed", "Observed", false, false);
	selector.options[1]=new Option("Likely", "Likely", false, false);
	selector.options[2]=new Option("Possible", "Possible", true, false);
	selector.options[3]=new Option("Unlikely", "Unlikely", false, false);
	selector.options[4]=new Option("Unknown", "Unknown", false, false);
	for(i=0;i<selector.options.length;i++) { if(selector.options[i].value == selected) { 
			selector.options[i].selected = true; break; }
	}

}

</script>
</body>
</html>