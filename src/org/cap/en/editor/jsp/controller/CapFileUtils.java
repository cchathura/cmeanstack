package org.cap.en.editor.jsp.controller;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.Reader;
import java.io.Writer;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;

public class CapFileUtils {

	public static File[] dirListByDescendingDate(File folder) {
		if (!folder.isDirectory()) {
			return null;
		}
		File files[] = folder.listFiles();
		Arrays.sort( files, new Comparator<Object>() {
			public int compare(final Object o1, final Object o2) {
				// ascending o1 compareTo o2 | descending o2 compareTo o1
				return new Long(((File)o2).lastModified()).compareTo(new Long(((File) o1).lastModified()));
			}
		}); 
		return files;
	}

	public void setCapXml(HashMap<String, String> parms) throws IOException {
		/* 
		 * Make a string of the CAP XML stored in the file at capPathFileName
		 * and store that into the capXML entry in the parms table. 
		 */
		
		FileInputStream inputStream = new FileInputStream(parms.get("capPathFileName"));
		InputStreamReader reader = new InputStreamReader(inputStream, "UTF8");
		Reader in = new BufferedReader(reader);
		StringBuffer fileData = new StringBuffer(100000);
		int ch;
		while ((ch = in.read()) > -1) { // int value -1 indicates end of data
			fileData.append((char)ch);
		}
		in.close();
		parms.put("capXml",fileData.toString());
	}

	
	public void saveCapFileFromXML(String capPathFileName, String capXml) throws IOException {
		File alertFile = new File(capPathFileName);
		Writer out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(alertFile), "UTF8"));
		out.append(capXml);
		out.flush();
		out.close();
	}

}
