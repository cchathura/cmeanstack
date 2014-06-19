package org.cap.en.editor.jsp.controller;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.util.HashMap;

import com.google.publicalerts.cap.feed.CapFeedParser;

public class PublishAlert {

	public void postThis(HashMap<String, String> parms) throws Exception {
		String capPathFileName = parms.get("capPathFileName");
		File draftAlertFile = new File(capPathFileName);
		// the basename of the draft alert is used as the base name of the published alert
		String publishAlertFileName = parms.get("capAlertsDirectoryName")+"/"+draftAlertFile.getName();
		String capXml = parms.get("capXml");
		try {
			File publishAlertFile = new File(publishAlertFileName);
			Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(publishAlertFile), "UTF8"));
			out.append(capXml);
			out.flush();
			out.close();
		}
		catch (Exception capFileWriteEx) {
			throw new Exception(LogMsg.append(capFileWriteEx.toString(),"Exception "+
						"caught while writing CAP file."));
		}
		String capAlertsRssFileName = parms.get("capAlertsRssFileName");
		try {
			parseRssXml.getParms(parms);
		} catch (Exception parseRssXmlEx) {
			throw new Exception(LogMsg.append(parseRssXmlEx.toString(),"Failed "+
						"attempt to parse RSS file: "+capAlertsRssFileName));
		}
		UpdateRssFile updateRssFile = new UpdateRssFile();
		String rssXml;
		try {
			rssXml = updateRssFile.makeRssXml(parms);
		}
		catch (Exception makeRssXmlEx) {
			throw new Exception(LogMsg.append(makeRssXmlEx.toString(),"Exception caught "+
						"while attempting to update contents of "+capAlertsRssFileName));
		}
//	Google CAP Feed Parser not usable yet due to errors returned for valid RSS email format
//		// Validate the RSS XML string comprising the file to be published.
//		// true means to validate the feed as it is parsed,
//		// null means there is no XML signature validation.
//		CapFeedParser capFeedParser = new CapFeedParser(true, null);
//		try {
//			capFeedParser.parseFeed(rssXml); 
//		} 
//		catch (Exception checkRssEx) {
//			throw new Exception(LogMsg.append(checkRssEx.toString(),"Exception caught while "+
//					"parsing RSS file contents.\nRepair is required urgently."));
//		}
		
		try {
			updateRssFile.rewrite(rssXml, capAlertsRssFileName);
		}
		catch (Exception rewriteRssEx) {
			throw new Exception(LogMsg.append(rewriteRssEx.toString(),"Exception caught while "+
					"rewriting RSS file.\nRepair is required urgently."));
		}
	}
}
