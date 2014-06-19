package org.cap.en.editor.jsp.controller;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.TimeZone;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathFactory;

import org.w3c.dom.Document;

public class UpdateRssFile {

	public String makeRssXml(HashMap<String, String> parms)
			throws Exception {

		// Customized configuration is accomplished in Initialize.java

		Date localTime = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("EEE, dd MMM yyyy hh:mm:ss 'GMT'"); // RFC822 required
		sdf.setTimeZone(TimeZone.getTimeZone("GMT"));
		String capRssPubDate = sdf.format(localTime);
		String capRssLastBuildDate = capRssPubDate;

		String capAlertsRssTitle = parms.get("capAlertsRssTitle");
		String capAlertsRssLink = parms.get("capAlertsRssLink");
		String capAlertsRssDescription = parms.get("capAlertsRssDescription");
		String capAlertsRssLanguage = parms.get("capAlertsRssLanguage");
		String capAlertsRssCopyright = parms.get("capAlertsRssCopyright");
		String alertingAuthorityLogoUrl = parms.get("alertingAuthorityLogoUrl");
		String capAlertsDirectoryName = parms.get("capAlertsDirectoryName");
		String capAlertsPublicUrlStub = parms.get("capAlertsPublicUrlStub");
		Integer itemLimit = Integer.parseInt(parms.get("capAlertsRssItemLimit"));

		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		XPath xpath = XPathFactory.newInstance().newXPath();

		String capPathFileName = "";
		// RSS Validator at http://rss.scripting.com/ and RSS Specs at http://blogs.law.harvard.edu/tech/rss
		
		String rssChannelHead = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\r\n" +
			"<rss version=\"2.0\" xmlns:atom=\"http://www.w3.org/2005/Atom\">\r\n" +
			"  <channel>\r\n" +
			"    <atom:link rel=\"hub\" href=\"//alert-hub.appspot.com\" />\r\n" +
			"    <atom:link rel=\"self\" href=\"" + capAlertsRssLink + "\" type=\"application/rss+xml\" />\r\n" +
			"    <title>" + capAlertsRssTitle + "</title>\r\n" +
			"    <link>" + capAlertsRssLink + "</link>\r\n" +
			"    <description>" + capAlertsRssDescription + "</description>\r\n" +
			"    <language>" + capAlertsRssLanguage + "</language>\r\n" +
			"    <copyright>" + capAlertsRssCopyright + "</copyright>\r\n" +
			"    <pubDate>" + capRssPubDate + "</pubDate>\r\n" +
			"    <lastBuildDate>" + capRssLastBuildDate + "</lastBuildDate>\r\n" +
			"    <docs>http://blogs.law.harvard.edu/tech/rss</docs>\r\n" +
			"    <image>\r\n" +
			"      <title>" + capAlertsRssTitle + "</title>\r\n" +
			"      <url>" + alertingAuthorityLogoUrl + "</url>\r\n" +
			"      <link>" + capAlertsRssLink + "</link>\r\n" +
			"    </image>\r\n";
		String rssChannelTail = "  </channel>\r\n" + "</rss>\r\n";
		String rssItems = "";
		String capAlertsPublicUrl;
		String capHeadline = "";
		String capDescription = "";
		String capSender = "";
		String capSenderName = "";
		String capCategory = "";
		String capIdentifier = "";
		String capSent = "";
		int itemCount = 0;
		File postedFiles[] = CapFileUtils.dirListByDescendingDate(new File(capAlertsDirectoryName));
		for (File file : postedFiles) {
			if (itemCount > itemLimit) { break;}
			if((!(file.isDirectory())) && (!(file.getName().equals("rss.xml")))){
				capPathFileName = capAlertsDirectoryName+"/"+file.getName();
				capAlertsPublicUrl = capAlertsPublicUrlStub+"/"+file.getName();
				Document doc = db.parse(capPathFileName);
				capHeadline = (String)xpath.evaluate("//alert/info/headline/text()",doc);
				capDescription = (String)xpath.evaluate("//alert/info/description/text()",doc);
				capSender = (String)xpath.evaluate("//alert/sender/text()",doc);
				capSenderName = (String)xpath.evaluate("//alert/info/senderName/text()",doc);
				capCategory = (String)xpath.evaluate("//alert/info/category/text()",doc);
				capIdentifier = (String)xpath.evaluate("//alert/identifier/text()",doc);
				capSent = (String)xpath.evaluate("//alert/info/sent/text()",doc);
				rssItems = rssItems + "    <item>\r\n" +
					"      <title>"+capHeadline+"</title>\r\n" +
					"      <link>"+capAlertsPublicUrl+"</link>\r\n" +
					"      <description>"+capDescription+"</description>\r\n";
				if (capSenderName.isEmpty()) {
					rssItems = rssItems + "      <author>"+capSender+"</author>\r\n";
				} else {	
					rssItems = rssItems + "      <author>"+capSender+" ("+capSenderName+")"+"</author>\r\n";
				}
				rssItems = rssItems + "      <category>"+capCategory+"</category>\r\n" +
					"      <guid>"+capIdentifier+"</guid>\r\n";
				if (!(capSent.isEmpty())) {
					rssItems = rssItems + 	"      <pubDate>"+capSent+"</pubDate>\r\n";
				}
				rssItems = rssItems + 	"    </item>\r\n";
			}  // end of this posted file
		}      // end of all posted files in alerts directory
		return rssChannelHead + rssItems + rssChannelTail;
	}

	public void rewrite(String rssXml, String capAlertsRssFileName) throws Exception {
	File capAlertsRssFile = new File(capAlertsRssFileName);
	try {
		capAlertsRssFile.createNewFile();
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(capAlertsRssFile), "UTF8"));
		out.append(rssXml);
		out.flush();
		out.close();
	}
	catch (Exception rssEx) {
		throw new Exception(LogMsg.append(rssEx.toString(),"Failed attempt to create RSS file for CAP alerts "+capAlertsRssFileName));
	}
	}
}
