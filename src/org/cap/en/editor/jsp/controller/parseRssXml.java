package org.cap.en.editor.jsp.controller;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringReader;
import java.util.HashMap;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathExpressionException;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class parseRssXml {

	public static HashMap<String, String> getParms(HashMap<String, String> parms)
			throws ParserConfigurationException, SAXException,
				IOException,  XPathExpressionException, Exception {
		// Copy all existing parms and update entries that are parseable from rssXml
		String rssXml = "";
		try {
			rssXml = readRssXml(parms.get("capAlertsRssFileName"));
		} 
		catch (Exception readRssXmlEx) {
			throw new Exception(LogMsg.append(readRssXmlEx.toString(),"Cannot parse XML of CAP alerts RSS file."));
		}
		if(rssXml.trim().isEmpty()) {
			throw new Exception(LogMsg.append("","RSS file '" + parms.get("capAlertsRssFileName") + "' is empty."));
		}
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		InputSource is = new InputSource();
		is.setCharacterStream(new StringReader(rssXml));
		Document rss = db.parse(is);
		XPath xpath = XPathFactory.newInstance().newXPath();

		parms.put("capAlertsRssTitle",elementValue(xpath,rss,"//rss/channel/title"));
		parms.put("capAlertsRssLink",elementValue(xpath,rss,"//rss/channel/link"));
		parms.put("capAlertsRssDescription",elementValue(xpath,rss,"//rss/channel/description"));
		parms.put("capAlertsRssLanguage",elementValue(xpath,rss,"//rss/channel/language"));
		parms.put("capAlertsRssCopyright",elementValue(xpath,rss,"//rss/channel/copyright"));;
		return(parms);
    }

	public static String readRssXml(String capAlertsRssFileName) throws IOException {
		FileInputStream inputStream = new FileInputStream(capAlertsRssFileName);
		InputStreamReader reader = new InputStreamReader(inputStream, "UTF8");
		Reader in = new BufferedReader(reader);
		StringBuffer fileData = new StringBuffer(100000);
		int ch;
		while ((ch = in.read()) > -1) { // int value -1 indicates end of data
			fileData.append((char)ch);
		}
		in.close();
		return(fileData.toString());
	}

	
	public static String elementValue(XPath xpath, Document rss, String elementPath) throws Exception {
		if (xpath.evaluate(elementPath+"/text()",rss) == null) {
			throw new Exception(LogMsg.append("","Required RSS file element '"+elementPath+"' is missing."));
		}
		if (xpath.evaluate(elementPath+"/text()",rss).isEmpty()) {
			throw new Exception(LogMsg.append("","Required RSS file element '"+elementPath+"' is empty."));
		}
		if (xpath.evaluate(elementPath+"/text()",rss).trim().isEmpty()) {
			throw new Exception(LogMsg.append("","Required RSS file element '"+elementPath+"' is blank."));
		}
		return xpath.evaluate(elementPath+"/text()",rss);
	}
}

