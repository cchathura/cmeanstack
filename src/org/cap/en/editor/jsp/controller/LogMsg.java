package org.cap.en.editor.jsp.controller;

import java.util.logging.Logger;

public class LogMsg {

	private static final Logger log =
			Logger.getLogger(EditController.class.getName());
	// Note: The log.info text shows on the Tomcat console.

	public static String append(String priorMsg, String thisMsg) {
		String combinedMsg = "";
		if(priorMsg.isEmpty()) {
			combinedMsg = "\n"+thisMsg;
		} else {
			combinedMsg = priorMsg+"\n"+thisMsg;
		}
		log.info(combinedMsg);
		return combinedMsg;
	}

	public static void txt(String thisMsg) {
		log.info(thisMsg);
		return;
	}

}
