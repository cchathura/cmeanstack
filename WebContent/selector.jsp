<%@ page contentType="text/html;charset=UTF-8" language="java"
%><%@ page import="java.text.SimpleDateFormat, java.util.*,java.io.File,java.io.IOException,java.io.StringReader"
%><%@ page import="javax.xml.parsers.DocumentBuilder,javax.xml.parsers.DocumentBuilderFactory"
%><%@ page import="javax.xml.parsers.ParserConfigurationException,javax.xml.xpath.*"
%><%@ page import="org.w3c.dom.*,org.xml.sax.InputSource,org.xml.sax.SAXException,org.cap.en.editor.jsp.controller.*"
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
<% 
SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");

HashMap<String, String> parms = (HashMap<String, String>)session.getAttribute("parms");
String capXml = parms.get("capXml");
String capDraftsDirectoryName = parms.get("capDraftsDirectoryName");
String capAlertsDirectoryName = parms.get("capAlertsDirectoryName");
String capAlertsRssFileName = parms.get("capAlertsRssFileName");

File capDraftsDirNode = new File(capDraftsDirectoryName);
String [] capDraftNames = capDraftsDirNode.list();
File [] capDraftObjects= capDraftsDirNode.listFiles();

File capAlertsDirNode = new File(capAlertsDirectoryName);
String [] capAlertNames = capAlertsDirNode.list();
File [] capAlertObjects= capAlertsDirNode.listFiles();


DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
DocumentBuilder db = dbf.newDocumentBuilder();
XPath xpath = XPathFactory.newInstance().newXPath();

%>
<h1><img src="capLogo.jpg" alt="CAP logo" width="90" height="30"/>
Initialize an alert for editing</h1>
<p>This application confirmed or created two file directories, within 
the designated server directory for the application, now set to 
<%= parms.get("appDirectoryName") %>. The directory at 
<%= parms.get("capDraftsDirectoryName") %> is for draft CAP alerts and 
<%= parms.get("capAlertsDirectoryName") %> is for published CAP alerts.
<form method="post" action="EditController" name="initCAP">
  <input name="editStep" value="draftAlert" type="hidden" />
  <input name="capPathFileName" id="capPathFileName" type="hidden" value="none">
<p><font size="+1">Select initial values using one of the most recent 
                   posted alerts: (<%= capAlertsDirectoryName %>)</font></p>
<%
int selectionLimit = 20; // this limits the total of posted and draft alerts to be displayed here
int row = 0;
String capHeadline = "";
File postedFiles[] = CapFileUtils.dirListByDescendingDate(new File(capAlertsDirectoryName));
for (File file : postedFiles) {
	if((!(file.isDirectory())) && 
			(!(file.getName().equals("rss.xml")))){
		row = row + 1;
		if (row > 10) { break; }
		String capPathFileName = capAlertsDirectoryName+"/"+file.getName();
		Document doc = db.parse(capPathFileName);
%>
 <table border="1">
  <tr onmouseover="document.initCAP.capPathFileName.value='<%= capPathFileName %>';
                   document.getElementById('row<%= row %>').style.display='';"
       onmouseout="document.getElementById('row<%= row %>').style.display='none';">
    <td><input type="submit" value="As Posted <%= sdf.format(file.lastModified()) %>">
         <font size="+1"><b><%= file.getName() %></b></font> 
			<%= (String)xpath.evaluate("//alert/info/headline/text()",doc) %>
    </td>
  </tr>
  <tr style="display:none" id="row<%= row %>">
    <td><b>Description: </b><%= (String)xpath.evaluate("//alert/info/description/text()",doc) %><br/>
        <b>Instruction: </b><%= (String)xpath.evaluate("//alert/info/instruction/text()",doc) %></td>
  </tr>
 </table>
<%	}
}%>
<hr />
<p><font size="+1">Select initial values using one of the most recent 
                   draft alerts: (<%= capDraftsDirectoryName %>)</font></p>
<%
File draftFiles[] = CapFileUtils.dirListByDescendingDate(new File(capDraftsDirectoryName));
for (File file : draftFiles) {
	if(!(file.isDirectory())){
		row = row + 1;
		if (row > selectionLimit) { break; }
		String capPathFileName = capDraftsDirectoryName+"/"+file.getName();
		Document doc = db.parse(capPathFileName);
%>
 <table border="1">
  <tr onmouseover="document.initCAP.capPathFileName.value='<%= capPathFileName %>';
                   document.getElementById('row<%= row %>').style.display='';"
       onmouseout="document.getElementById('row<%= row %>').style.display='none';">
    <td><input type="submit" value="Draft as of <%= sdf.format(file.lastModified()) %>">
         <font size="+1"><b><%= file.getName() %></b></font> 
			<%= (String)xpath.evaluate("//alert/info/headline/text()",doc) %>
    </td>
  </tr>
  <tr style="display:none" id="row<%= row %>">
    <td><b>Description: </b><%= (String)xpath.evaluate("//alert/info/description/text()",doc) %><br/>
        <b>Instruction: </b><%= (String)xpath.evaluate("//alert/info/instruction/text()",doc) %></td>
  </tr>
 </table>
<%	}
}%>
</form>
<hr />
<form method="post" action="EditController" name="endSessionButton" >
  <input name="editStep" value="endSession" type="hidden" />
  <input type="submit" value="End this session" />
</form>
</body>
</html>