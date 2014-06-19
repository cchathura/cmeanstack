<%@ page contentType="text/html;charset=UTF-8" language="java"
%><%@ page import="java.util.HashMap"
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
<h1>Error encountered during session</h1>
<p><%= (String)session.getAttribute("errorMessage").toString().replace("\n", "<br/>") %></p>

<form method="get" action="edit.html">
   <input type="submit" value="Exit to login screen" />
</form>

</body>
</html>