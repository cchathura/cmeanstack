package org.cap.en.editor.jsp.controller;

import java.io.File;
import java.util.HashMap;

import javax.servlet.http.HttpSession;

public class Initialize {

	public void setParms(HttpSession session, String editorEmail) throws Exception {
		// copy /WEB-INF/web.xml context parameter values, should be customized to this implementation.
		try {
			try {
				parmsTable(session, editorEmail);
			} catch (Exception parmsEx) {
				throw new Exception(LogMsg.append(parmsEx.toString(),"Failed in setting parameters for local implementation."));
			}
			// At this point, the parms table has been initialized. Now confirm or create
			// the file structure needed for drafts directory, alerts directory, and RSS file.
			HashMap<String, String> parms = ((HashMap<String, String>)session.getAttribute("parms"));
			try {
				structureFiles(parms);
			} catch (Exception structureEx) {
				throw new Exception(LogMsg.append(structureEx.toString(),"Cannot confirm or create alerts and drafts file structure."));
			}
		} catch (Exception tryEx) {
			throw new Exception(LogMsg.append(tryEx.toString(),"Fatal error: initialization not completed."));
		}
	}

	public void parmsTable(HttpSession session, String editorEmail) throws Exception {

		// Various parameters that are partiular to the local implementation are set here using the
		// Tomcat 'WEB-INF/web.xml' convention. These could be set using a config file instead.
		HashMap<String, String> parms = new HashMap<String, String>();
		parms.put("editorEmail",editorEmail);
		try {
			//String alertingAuthorityName = checkParmValue(session, "alertingAuthorityName");
			//parms.put("alertingAuthorityName",alertingAuthorityName);
			String alertingAuthorityLogoUrl = checkParmValue(session, "alertingAuthorityLogoUrl");
			parms.put("alertingAuthorityLogoUrl",alertingAuthorityLogoUrl);
			String alertingAuthorityOid = checkParmValue(session, "alertingAuthorityOid");
			parms.put("alertingAuthorityOid",alertingAuthorityOid);
			String alertingAreaDefaultLatLng = checkParmValue(session, "alertingAreaDefaultLatLng");
			try {
				parseLatLng(alertingAreaDefaultLatLng);
			} catch (Exception parseLatLngEx) {
				throw new Exception(parseLatLngEx);
			}
			parms.put("alertingAreaDefaultLatLng",alertingAreaDefaultLatLng);
			String alertingAreaDefaultZoom = checkParmValue(session, "alertingAreaDefaultZoom");
			parms.put("alertingAreaDefaultZoom",alertingAreaDefaultZoom);
			String capDraftsDirectoryName = checkParmValue(session, "capDraftsDirectoryName");
			if (capDraftsDirectoryName.lastIndexOf("/")+1 == capDraftsDirectoryName.length()) {
				capDraftsDirectoryName.substring(0, capDraftsDirectoryName.lastIndexOf("/"));
			} // trailing slash has been removed from directory name
			parms.put("capDraftsDirectoryName",capDraftsDirectoryName);
			String capAlertsDirectoryName = checkParmValue(session, "capAlertsDirectoryName");
			if (capAlertsDirectoryName.lastIndexOf("/")+1 == capAlertsDirectoryName.length()) {
				capAlertsDirectoryName.substring(0, capAlertsDirectoryName.lastIndexOf("/"));
			} // trailing slash has been removed from directory name
			parms.put("capAlertsDirectoryName",capAlertsDirectoryName);
			String capAlertsRssFileName = checkParmValue(session, "capAlertsRssFileName");
			parms.put("capAlertsRssFileName",capAlertsRssFileName);
			String capAlertsPublicUrlStub = checkParmValue(session, "capAlertsPublicUrlStub");
			if (capAlertsPublicUrlStub.lastIndexOf("/")+1 == capAlertsPublicUrlStub.length()) {
				capAlertsPublicUrlStub.substring(0, capAlertsPublicUrlStub.lastIndexOf("/"));
			} // trailing slash has been removed from URL stub
			parms.put("capAlertsPublicUrlStub",capAlertsPublicUrlStub);
			String capAlertsRssItemLimit = checkParmValue(session, "capAlertsRssItemLimit");
			parms.put("capAlertsRssItemLimit",capAlertsRssItemLimit);
			String capAdminEmail = checkParmValue(session, "capAdminEmail");
			parms.put("capAdminEmail",capAdminEmail);
			String mailDeliveryMethod = checkParmValue(session, "mailDeliveryMethod");
			parms.put("mailDeliveryMethod",mailDeliveryMethod);
			switch (mailDeliveryMethod) {
				case "immediate":
					String mailSmtpHost = checkParmValue(session, "mailSmtpHost");
					parms.put("mailSmtpHost",mailSmtpHost);
					String mailSmtpPort = checkParmValue(session, "mailSmtpPort");
					parms.put("mailSmtpPort",mailSmtpPort);
					String mailSubmitterUsername = checkParmValue(session, "mailSubmitterUsername");
					parms.put("mailSubmitterUsername",mailSubmitterUsername);
					String mailSubmitterPassword = checkParmValue(session, "mailSubmitterPassword");
					parms.put("mailSubmitterPassword",mailSubmitterPassword);
					break;
				case "pickup":
					String mailPickupDirectoryName = checkParmValue(session, "mailPickupDirectoryName");
					parms.put("mailPickupDirectoryName",mailPickupDirectoryName);
					break;
				default:
					throw new Exception(LogMsg.append("","Parameter mailDeliveryMethod must specify 'immediate' or 'pickup'."));
			}
		}
		catch (Exception checkStringEx){
			throw new Exception(LogMsg.append(checkStringEx.toString(),"Correction needed in deployment descriptor file 'web.xml'."));
		}
		session.setAttribute("parms", parms);
	}

	public void structureFiles(HashMap<String, String> parms) throws Exception {
		try {
			confirmOrCreateDirectory(parms.get("capDraftsDirectoryName"));
		} catch (Exception draftsDirEx) {
			throw new Exception(draftsDirEx);
		}
		try {
			confirmOrCreateDirectory(parms.get("capAlertsDirectoryName"));
		} catch (Exception alertsDirEx) {
			throw new Exception(alertsDirEx);
		}
		// At this point, CAP Alerts directory exists
		String capAlertsRssFileName = parms.get("capAlertsRssFileName");
		File capAlertsRssFile = new File(capAlertsRssFileName);
		try {
			capAlertsRssFile.exists();
		} catch (Exception rssEx) {
			throw new Exception(LogMsg.append("","File system exception on checking for RSS file: "+capAlertsRssFileName));
		}
	}

	public void confirmOrCreateDirectory(String directoryName) throws Exception {
		File thisDirectory = new File(directoryName);
		try {
			thisDirectory.exists();
		} catch (Exception existsDirEx) {
			throw new Exception(LogMsg.append("","File system exception on checking for directory: "+directoryName));
		}
		if (!thisDirectory.exists()) {
			try {
				thisDirectory.mkdir();
			} catch (Exception makeDirEx) {
				throw new Exception(LogMsg.append("","File system exception on creating directory: "+directoryName));
			}
			if (!thisDirectory.exists()) {
				throw new Exception(LogMsg.append("","File system cannot confirm just created directory: "+directoryName));
			}
		}
	}
	
	public String checkParmValue(HttpSession session, String parameterName) throws Exception {
		if (session.getServletContext().getInitParameter(parameterName) == null) {
			throw new Exception(LogMsg.append("","Required parameter "+parameterName+" is missing."));
		}
		if (session.getServletContext().getInitParameter(parameterName).isEmpty()) {
			throw new Exception(LogMsg.append("","Required parameter "+parameterName+" is empty."));
		}
		if (session.getServletContext().getInitParameter(parameterName).trim().isEmpty()) {
			throw new Exception(LogMsg.append("","Required parameter "+parameterName+" is blank."));
		}
		return session.getServletContext().getInitParameter(parameterName).trim();
	}

	public void parseLatLng (String thisLatLng) throws Exception {
		String[] coordinates = thisLatLng.split(",");
		Float thisLat = Float.parseFloat(coordinates[0]);
		Float thisLng = Float.parseFloat(coordinates[1]);
		if (thisLat < -90  || thisLat > 90) {
//				errorMessage = LogMsg.append(initEx.toString(),"Error in step: uninitialized.");

			throw new Exception(LogMsg.append("","Required parameter alertingAreaDefaultLatLng has invalid latitude."));
		}
		if (thisLng < -180  || thisLat > 180) {
			throw new Exception(LogMsg.append("","Required parameter alertingAreaDefaultLatLng has invalid longitude."));
		}
	}	
}
