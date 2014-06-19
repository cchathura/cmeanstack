<%@ page contentType="text/html;charset=UTF-8" language="java"
%><%@ page import="java.util.HashMap,org.apache.commons.lang3.StringEscapeUtils"
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
<body>
<h1><img src="capLogo.jpg" alt="CAP logo" width="90" height="30"/>
 Published</h1>
<% 
HashMap<String, String> parms = (HashMap<String, String>)session.getAttribute("parms");
%><p>The alert was published and the 
<a href="<%= parms.get("capAlertsRssLink") %>">RSS feed</a> was updated.</p>

<table border="1">
<tbody>
  <tr><td title="[mandatory] identifier has a unique value assigned by the sender.">
    &nbsp;<b>identifier</b>&nbsp;<%= parms.get("capIdentifier") %></td></tr>
  <tr><td title="[mandatory] sender is typically an e-mail addreess at the sender organization.">
    &nbsp;<b>sender</b>&nbsp;<%= parms.get("capSender") %></td></tr>
  <tr><td title="[mandatory] sent provides the message date/time.">
    &nbsp;<b>sent</b>&nbsp;<%= parms.get("capSent") %></td></tr>
  <tr><td>
     <table border="1"><tbody><tr>
      <td title="[mandatory] status may have values: Actual, System, Test." width="33%">
      &nbsp;<b>status</b>&nbsp;<%= parms.get("capStatus") %></td>
      <td title="[mandatory] msgType may have values: Alert, Update, Cancel, Ack, Error." width="33%">
      &nbsp;<b>msgType</b>&nbsp;<%= parms.get("capMsgType") %></td>
      <td title="[mandatory] scope may have values: Public, Restricted, Private." width="33%">
      &nbsp;<b>scope</b>&nbsp;<%= parms.get("capScope") %></td>
     </tr></tbody></table>
  </td></tr>
  <tr><td>
    <table border="1"><tbody><tr>
      <td title="language indicates the natural language used for the alert text" width="50%">
      &nbsp;<b>language</b>&nbsp;<%= parms.get("capLanguage") %></td>
      <td title="category may have values: Geo, Met, Safety, Security, Rescue, Fire, Health, Env, Infra, Other" width="50%">
      &nbsp;<b>category</b>&nbsp;<%= parms.get("capCategory") %></td>
    </tr></tbody></table>
  </td></tr>
  <tr><td title="[mandatory] event refines the category to give the type of the event">
    &nbsp;<b>event:</b>&nbsp;<%= parms.get("capEvent") %></td></tr> 
  <tr><td>
    <table border="1"><tbody><tr>
      <td title="[mandatory] urgency  may have values: Immediate, Expected, Future, Past, Unknown" width="33%">
      &nbsp;<b>urgency</b>&nbsp;<%= parms.get("capUrgency") %></td>
      <td title="[mandatory] severity may have values: Extreme, Severe, Moderate, Minor, Unknown." width="33%">
      &nbsp;<b>severity</b>&nbsp;<%= parms.get("capSeverity") %></td>
      <td title="[mandatory] certainty may have values: Very Likely, Likely, Possible, Unlikely, Unknown" width="33%">
      &nbsp;<b>certainty</b>&nbsp;<%= parms.get("capCertainty") %></td>
    </tr></tbody></table>
  </td></tr>
  <tr><td title="senderName identifies the sender organization.">
    &nbsp;<b>senderName:</b>&nbsp;<%= parms.get("capSenderName") %></td></tr> 
  <tr><td title="headline should be brief and human-readable.">
    &nbsp;<b>headline</b>&nbsp;<%= parms.get("capHeadline") %></td></tr>
  <tr><td title="description of the subject event of the alert message.">
    &nbsp;<b>description</b>&nbsp;<%= parms.get("capDescription") %></td></tr>
  <tr><td title="instruction gives the recommended action to be taken by recipients of the alert message.">
    &nbsp;<b>instruction</b>&nbsp;<%= parms.get("capInstruction") %></td></tr>
  <tr><td title="web identifies an information Web page available via the given URL.">
    &nbsp;<b>web</b>&nbsp;<%= parms.get("capWeb") %></td></tr>
  <tr><td title="image identifies an image available via the given URL.">
    &nbsp;<b>image</b>&nbsp;<%= parms.get("capUri") %></td></tr>
  <tr><td title="contact identifies a contact program person available to discusss the alert.">
    &nbsp;<b>contact</b>&nbsp;<%= parms.get("capContact") %></td></tr>
  <tr><td title="[mandatory] areaDesc describes the target area of the alert.">
    &nbsp;<b>areaDesc</b>&nbsp;<textarea><%= parms.get("capAreaDesc") %></textarea></td></tr>
  <tr><td>
    <table border="1"><tbody>
      <tr>
        <td title="lat ',' lon ' ' radius in decimal degrees and kilometers">
        &nbsp;<b>circle</b>&nbsp;<%= parms.get("capCircle") %></td>
        <td title="geographic code as 'type' = 'value' pair">
        &nbsp;<b>geocode</b>&nbsp;<%= parms.get("capGeocode") %></td>
        <td title="space-delimited list of lat ',' lon coordinate pairs" colspan="2">
        &nbsp;<b>polygon</b>&nbsp;<%= parms.get("capPolygon") %></td>
      </tr>
    </tbody></table>
  </td></tr>
 </tbody>
</table>

<table><tr>
 <td><form id="validateCapForm" >
   <input name="escapedCapXml" value="<%= StringEscapeUtils.escapeXml(parms.get("capXml")) %>" type="hidden" />
   <input value="Validate (Google)" onclick="crossDomainPost();" type="button" />
  </form></td>
 <td><form method="post" action="EditController" name="continueSessionButton">
  <input name="editStep" value="newAlert" type="hidden" />
  <input type="submit" value="Continue editing session, different alert" />
 </form></td>
 <td><form method="post" action="EditController" name="endSessionButton">
  <input name="editStep" value="endSession" type="hidden" />
  <input type="submit" value="End this editing session" />
 </form></td>
</tr></table>
<script type="text/javascript"> 
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
</script>
</body>
</html>