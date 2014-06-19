package org.cap.en.editor.jsp.controller;

import java.io.IOException;
import java.util.HashMap;
import java.io.StringReader;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.xpath.*;
import org.w3c.dom.*;
import org.xml.sax.InputSource;
import org.xml.sax.SAXException;

public class ParseCapElements {

	public HashMap getValues(HashMap<String, String> parms)
			throws ParserConfigurationException, SAXException,
				IOException,  XPathExpressionException {
		// Copy all existing parms and update entries that are parseable from capXml
		HashMap<String, String> updatedParms = new HashMap<String, String>();
		updatedParms.putAll(parms);
		String capXml = (String) parms.get("capXml");
		if(capXml.isEmpty()) {
			updatedParms.put("capXML","");
			return(updatedParms);
		}
		DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
		DocumentBuilder db = dbf.newDocumentBuilder();
		InputSource is = new InputSource();
		is.setCharacterStream(new StringReader(capXml));
		Document doc = db.parse(is);
		XPath xpath = XPathFactory.newInstance().newXPath();

		updatedParms.put("capIdentifier",(String)xpath.evaluate("//alert/identifier/text()",doc));
		updatedParms.put("capSender",(String)xpath.evaluate("//alert/sender/text()",doc));
		updatedParms.put("capSent",(String)xpath.evaluate("//alert/sent/text()",doc));
		updatedParms.put("capStatus",(String)xpath.evaluate("//alert/status/text()",doc));
		updatedParms.put("capMsgType",(String)xpath.evaluate("//alert/msgType/text()",doc));
		updatedParms.put("capScope",(String)xpath.evaluate("//alert/scope/text()",doc));
		updatedParms.put("capRestriction",(String)xpath.evaluate("//alert/restriction/text()",doc));
		updatedParms.put("capAddresses",(String)xpath.evaluate("//alert/addresses/text()",doc));
		updatedParms.put("capLanguage",(String)xpath.evaluate("//alert/info/language/text()",doc));
		updatedParms.put("capCategory",(String)xpath.evaluate("//alert/info/category/text()",doc));
		updatedParms.put("capEvent",(String)xpath.evaluate("//alert/info/event/text()",doc));
		updatedParms.put("capResponseType",(String)xpath.evaluate("//alert/info/responseType/text()",doc));
		updatedParms.put("capUrgency",(String)xpath.evaluate("//alert/info/urgency/text()",doc));
		updatedParms.put("capSeverity",(String)xpath.evaluate("//alert/info/severity/text()",doc));
		updatedParms.put("capCertainty",(String)xpath.evaluate("//alert/info/certainty/text()",doc));
		updatedParms.put("capOnset",(String)xpath.evaluate("//alert/info/onset/text()",doc));
		updatedParms.put("capExpires",(String)xpath.evaluate("//alert/info/expires/text()",doc));
		updatedParms.put("capSenderName",(String)xpath.evaluate("//alert/info/senderName/text()",doc));
		updatedParms.put("capHeadline",(String)xpath.evaluate("//alert/info/headline/text()",doc));
		updatedParms.put("capDescription",(String)xpath.evaluate("//alert/info/description/text()",doc));
		updatedParms.put("capInstruction",(String)xpath.evaluate("//alert/info/instruction/text()",doc));
		updatedParms.put("capWeb",(String)xpath.evaluate("//alert/info/web/text()",doc));
		updatedParms.put("capContact",(String)xpath.evaluate("//alert/info/contact/text()",doc));
		updatedParms.put("capResourceDesc",(String)xpath.evaluate("//alert/info/resource/resourceDesc/text()",doc));
		updatedParms.put("capUri",(String)xpath.evaluate("//alert/info/resource/uri/text()",doc));
		updatedParms.put("capAreaDesc",(String)xpath.evaluate("//alert/info/area/areaDesc/text()",doc));
		updatedParms.put("capCircle",(String)xpath.evaluate("//alert/info/area/circle/text()",doc));
		updatedParms.put("capGeocode",(String)xpath.evaluate("//alert/info/area/geocode/text()",doc));
		updatedParms.put("capPolygon",(String)xpath.evaluate("//alert/info/area/polygon/text()",doc));
		return(updatedParms);
    }
}
