package org.cap.en.editor.jsp.controller;
/**
 * This is the controller for a CAP alert editing session app. The 
 * /WEB-INF/web.xml file has context parameters that must be set to 
 * the local implementation, and appropriate permissions are needed. 
 * The /WEB-INF/web.xml file also defines security roles, here only 
 * users in the 'admin' role and the 'member' role are allowed access. 
 * The username and password for users by role are maintained in the 
 * Tomat config file 'users.xml'. In this app, the username must be 
 * the e-mail address of the editor as the sendMail function uses it. 
 * 
 * This controller gets all 'requests' and creates the conditions 
 * needed for each 'response' to be generated and returned. JSP 
 * is used for 'views', per the MVC (Model-View-Controller) pattern. 
 * 
 * To deploy from Eclipse, select the project "org.cap.en.editor.jsp",
 * right click and choose "Export" then "WAR file". Where dialog
 * prompts for Destination, use TOMCAT_HOME/webapps/ . Then shutdown
 * Tomcat and once it is stopped, startup Tomcat again and go to
 * this page - http://localhost:8080/org.cap.editor.jsp/edit.html
 */

import java.io.IOException;
import java.util.HashMap;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import com.sun.syndication.feed.rss.Channel;
import com.google.publicalerts.cap.feed.CapFeedParser;

@WebServlet("/EditController")
public class EditController extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	public void doPost( HttpServletRequest request,
						HttpServletResponse response)
				throws IOException, ServletException {

	HttpSession session = request.getSession();
	synchronized(session) { 
		String errorMessage;  // extend previous errorMessage or initialize to blank if none exists
		if (session.getAttribute("errorMessage") == null) {
			errorMessage = "";
		}
		else {
			errorMessage = (String)session.getAttribute("errorMessage");
		}
		String editStep = request.getParameter("editStep");
		if (editStep.equals("uninitialized")) { 	// set by post action in edit.html
			String editorEmail = request.getUserPrincipal().getName(); 
			errorMessage = "";
			session.setAttribute("errorMessage", "");
			LogMsg.txt("step - uninitialized: Status - Opening new edit session for "+editorEmail);
			/*  The authorized users are defined by the Web Container (e.g., Tomcat) 
			 *  and that also handles authentication using passwords. For example, to 
			 *  make 'admin' and 'member' role entries in Tomcat config under Eclipse IDE 
			 *  edit C:\workspace\Servers\Tomcat v7.0 Server at localhost-config\tomcat-users.xml
			 *  to add users like this:
			 * <tomcat-users>
			 * 	<role rolename="admin"/>
			 * 	<role rolename="member"/>
			 * 	<user username="echristian@usgs.gov" password="admin" roles="admin,member"/>
			 * 	<user username="eliotchristian@earthlink.net" password="reallyme" roles="member"/>
			*/
			Initialize initialize = new Initialize();
			try {
				initialize.setParms(session, editorEmail);
			}
			catch (Exception initEx) {
				errorMessage = LogMsg.append(initEx.toString(),"Error in step: uninitialized."+
					"\n"+"Edit session now ending due to errors during setup.");
				editStep = "fatalError";
			}
			if (!(editStep.equals("fatalError"))) {
				LogMsg.txt("step - uninitialized: Status - Initialization complete and application structure confirmed.");
				editStep = "newAlert";
			}
		}
		HashMap<String, String> parms = (HashMap<String, String>)session.getAttribute("parms");
		String nextJsp = "";  // the nextJsp value controls which page will be shown next
		switch (editStep) {
			case "newAlert":		// set in initialize code (here above) or saved.jsp or sent.jsp or published.jsp
				LogMsg.txt("step - newAlert: Status - Editor will select example alert for editing new draft alert.");
				nextJsp = "selector.jsp";					// JSP objective is to initialize a draft alert
				break;
			case "draftAlert":		// set by selector.jsp or saved.jsp or sent.jsp
				// In their post action, these jsp pages pass the capPathFileName for the file being edited
				parms.put("capPathFileName",request.getParameter("capPathFileName")); // editor is editing this file
				LogMsg.txt("step - draftAlert: Status - Editor selected file to start editing.");
				LogMsg.txt("step - draftAlert: Status - Selected file is "+request.getParameter("capPathFileName"));
				try {
					CapFileUtils capFileUtils = new CapFileUtils();
					capFileUtils.setCapXml(parms);
				} 
				catch (Exception capXmlEx) {
					errorMessage = LogMsg.append(capXmlEx.toString(),"Error in step: draftAlert."+
							"\n"+"Drafting of initialized alert now ending due to errors in XML processing.");
					break;
				}
				LogMsg.txt("step - draftAlert: Status - Draft initialized and editing underway.");
				nextJsp = "draft.jsp";				// JSP objective is to edit the draft alert
				break;
			case "saveAlert":		// set only by draft.jsp
				// In its post action, draft.jsp passes the updated capXml and new draft capFileName
				parms.put("capPathFileName",request.getParameter("capPathFileName"));
				parms.put("capXml",request.getParameter("capXml"));
				try {
					ParseCapElements parseCapElements = new ParseCapElements();
					HashMap<String, String> parmsUpdated = parseCapElements.getValues(parms);
					session.setAttribute("parms", parmsUpdated);
				} 
				catch (Exception parseEx) {
					errorMessage = LogMsg.append(parseEx.toString(),"Error in step: saveAlert."+
							"\n"+"Saving of draft alert now ending due to errors in XML processing.");
					break;
				}
				try {
					CapFileUtils capFileUtils = new CapFileUtils();
					capFileUtils.saveCapFileFromXML(parms.get("capPathFileName"), parms.get("capXml"));
				} 
				catch (Exception saveCapEx) {
					errorMessage = LogMsg.append(saveCapEx.toString(),"Error in step: saveAlert."+
							"\n"+"Now ending due to error in attempt to save CAP XML File.");
					break;
				}
				LogMsg.txt("step - saveAlert: Status - Draft alert has been parsed and saved.");
				nextJsp = "saved.jsp";				// JSP objective is to inform that draft alert was saved
				break;
			case "sendAlert":		// set only by saved.jsp
				try {
					SendMail sendMail = new SendMail();
					sendMail.withAttachment((HashMap<String, String>)session.getAttribute("parms"));
				} 
				catch (Exception sendMailEx) {
					errorMessage = LogMsg.append(sendMailEx.toString(),"Error in step: sendMail."+
							"\n"+"Now ending due to failure in sending draft alert to editor by e-mail.");
					break;
				}
				LogMsg.txt("step - saveAlert: Status - Draft alert was sent by e-mail.");
				nextJsp = "sent.jsp";				// JSP objective is to inform that the draft alert was sent
				break;
			case "publishAlert":	// set by sent.jsp
				LogMsg.txt("step - publishAlert: Status - Draft alert is to be published.");
				PublishAlert publishAlert = new PublishAlert();
				try {
					parseRssXml.getParms(parms);
				} 
				catch (Exception parseRssXmlEx) {
					errorMessage = LogMsg.append(parseRssXmlEx.toString(),"Error in step: publishAlert."+
							"\n"+"Publishing of CAP alerts RSS file now ending due to errors in XML processing.");
					break;
				}
				// Copy the alert from the drafts directory to the alerts directory and recreate the RSS file.
				try {
					publishAlert.postThis(parms); 
				} 
				catch (Exception publishAlertEx) {
					errorMessage = LogMsg.append(publishAlertEx.toString(),"Error in step: publishAlert."+
							"\n"+"Updating of RSS file now ending. Draft alert was not published.");
					break;
				}
				// Finally, push a notice to the Alert Hub to signify update of the RSS file.
				String hub = "https://alert-hub.appspot.com/publish";  // URL of the Google.Org Alert Hub
				try {
					PostAlertHub.execute(hub, parms.get("capAlertsRssLink"));
				}
				catch (Exception alertHubEx) {
					errorMessage = LogMsg.append(alertHubEx.toString(),"Exception caught "+
								"while attempting HTTP Post to the Alert Hub at "+hub);
					break;
				}
				LogMsg.txt("step - publishAlert: Status - Alert published, RSS updated, notice sent to Alert Hub at "+hub);
				nextJsp = "published.jsp";				// JSP objective is to inform that the draft alert was published
				break;
			case "endSession":		// set by any of the JSP's
				LogMsg.txt("step - endSession: Status - Editor has ended the session.");
				nextJsp = "logoff.jsp";
				break;
			case "fatalError":		// the 'errorMessage' string describes any error(s)
				nextJsp = "error.jsp";
				break;
			 default:				// this should not occur
				break;
		}
		if(nextJsp.equals("")) {
			nextJsp = "error.jsp";
		}
		session.setAttribute("errorMessage", errorMessage);
		RequestDispatcher view = request.getRequestDispatcher(nextJsp);
		view.forward(request, response);
		}
	}  // finished with synchronized session attributes

}
