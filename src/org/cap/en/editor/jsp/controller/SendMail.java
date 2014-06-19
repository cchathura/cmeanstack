package org.cap.en.editor.jsp.controller;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.*;

import javax.mail.*;
import javax.mail.internet.*;
import javax.mail.util.ByteArrayDataSource;
import javax.activation.*;

public class SendMail {
	// This function is based on http://en.wikipedia.org/wiki/JavaMail
	// Customized configuration is accomplished in Initialize.java
	public void withAttachment(HashMap<String, String> parms) throws Exception {
		String capPathFileName = parms.get("capPathFileName");
		File capFile = new File(capPathFileName);
		String capFileName = capFile.getName();
		String mailSubject = "CAP Alert: "+capFileName;
		String mailFrom = parms.get("capAdminEmail");
		String mailTo = parms.get("editorEmail");
		String bodyText = "The attached CAP alert was stored at "+capPathFileName+"\n"+
				" by "+parms.get("capAdminEmail")+"\n\n"+
				"Headline:     "+parms.get("capHeadline")+"\n\n"+
				"  Severity:   "+parms.get("capSeverity")+"\n"+
				"  Certainty:  "+parms.get("capCertainty")+"\n"+
				"  Urgency:    "+parms.get("capUrgency")+"\n\n"+
				"Description:  "+parms.get("capDescription")+"\n\n"+
				"Instruction:  "+parms.get("capInstruction")+"\n";

		Properties properties = new Properties(); 
		//Note: These properties are always set as strings
		properties.put("mail.debug", "false"); // set 'true' to see what is going on behind the scenes
		if(parms.get("mailDeliveryMethod").equals("immediate")) {
			// As we are using "smtps" protocol to access SMTP over SSL, 
			// all properties are named "mail.smtps.*"
			//properties.put("mail.smtps.debug", "true");
			properties.put("mail.smtps.ssl.enable", "true");
			properties.put("mail.smtps.timeout", "15000"); // socket timeout, in milliseconds
			properties.put("mail.smtps.auth", "true");
		}
		Session mailSession = Session.getInstance(properties,null);
		Message message = new MimeMessage(mailSession);
		// Set message attributes
		message.setFrom(new InternetAddress(mailFrom));
		message.setReplyTo(InternetAddress.parse(mailFrom));
		InternetAddress[] addressTo = {new InternetAddress(mailTo)};
		message.setRecipients(Message.RecipientType.TO, addressTo);
		message.setSubject(mailSubject);
		message.setSentDate(new Date());
		
		// Set message content
		setFileAsAttachment(message, bodyText, capPathFileName, capFileName);
		message.saveChanges();
		if(parms.get("mailDeliveryMethod").equals("immediate")) {
			String smtpHost = parms.get("mailSmtpHost");
			Integer smtpPort = Integer.parseInt(parms.get("mailSmtpPort"));
			String username = parms.get("mailSubmitterUsername");
			String password = parms.get("mailSubmitterPassword");
			Transport smtpTransport = mailSession.getTransport("smtps");
			try {
				// Connect only once here, Transport.send() disconnects after each send
				smtpTransport.connect(smtpHost,smtpPort,username,password);
				smtpTransport.sendMessage(message, addressTo);
			}	
			catch (Exception mailImmediateEx) {
				throw new Exception(LogMsg.append(mailImmediateEx.toString(),"Problem "+
						"in connecting to mail server or sending mail."));
			} // end catch
			finally {
				smtpTransport.close();
			}
		}	
		else {
			// parms.get("mailDeliveryMethod").equals("pickup")
			// Here the message as a string is copied to the SMTP server queue file for
			// delivery, known as the pickupDirectory. This file must have the extension
			// "eml". Other requirements for using the pickup directory are described
			// at http://technet.microsoft.com/en-us/library/bb124230.aspx
			String mailFileName = UUID.randomUUID().toString()+".eml";
			try {
				ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
				// copy MIME message to byte array stream
				message.writeTo(byteArrayOutputStream);
				String mailPickupFileName = parms.get("mailPickupDirectoryName")+"/"+mailFileName;
				OutputStream pickupFile = new FileOutputStream(mailPickupFileName);
				byteArrayOutputStream.writeTo(pickupFile);
			}	
			catch (Exception mailPickupEx) {
				throw new Exception(LogMsg.append(mailPickupEx.toString(),"Problem in copying "+
						mailFileName+" to pickup directory: "+parms.get("mailPickupDirectoryName")));
			} // end catch
		} // end if/else
	} // end withAttachment

	// Set a file as an attachment.  Uses JAF (JavaBeans Activation Framework) FileDataSource.
	public static void setFileAsAttachment(Message message, 
				String bodyText, String capPathFileName, String capFileName)
			throws Exception {
		// Create the Multipart.  Add BodyParts to it.
		Multipart multipart = new MimeMultipart("mixed"); //body is plain text, attachment is xml &, UTF8
		// Create first part, containing the body text
		MimeBodyPart bodyTextPart = new MimeBodyPart();
		bodyTextPart.setText(bodyText);
		multipart.addBodyPart(bodyTextPart);
		// Create second part, which is the attached file
		MimeBodyPart attachedXMLPart = new MimeBodyPart();
		// Put the CAP alert file in the second part
		FileInputStream xmlStream = new FileInputStream(capPathFileName);
		attachedXMLPart.setDataHandler(new DataHandler(new ByteArrayDataSource(xmlStream, "text/xml")));
		attachedXMLPart.setFileName(capFileName);
		attachedXMLPart.setContentID("<xml>");
		attachedXMLPart.setHeader("Content-Transfer-Encoding", "base64");
		attachedXMLPart.setHeader("Content-Type", "text/xml;charset=UTF-8");
		multipart.addBodyPart(attachedXMLPart);
		// Set Multipart as the message's content
		message.setContent(multipart);
	}
}
