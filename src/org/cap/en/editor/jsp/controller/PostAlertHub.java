package org.cap.en.editor.jsp.controller;

import java.net.URL;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;

public class PostAlertHub {

	public static void execute(String hub, String topic_url) throws Exception {
		/* @throws IOException If an input or output exception occurred
		 * @param The Hub address you want to publish it to
		 * @param The topic_url you want to publish
		 * @return HTTP Response code. 200, 202, 204 is ok. Anything else smells like trouble
		 */
		if ((hub != null) && (topic_url != null)) {
			// URL should validate hub and topic_url are really URLs. 
			// Will throw Exception if either one isn't in URL format.
			@SuppressWarnings("unused")
			URL verifying_topic_url = new URL(topic_url);
			@SuppressWarnings("unused")
			URL hub_url = new URL(hub);

			HttpClient httpclient = new DefaultHttpClient();
			HttpPost httppost = new HttpPost(hub);
			List<NameValuePair> nvps = new ArrayList<NameValuePair>(1);
			nvps.add(new BasicNameValuePair("hub.mode", "publish"));
			nvps.add(new BasicNameValuePair("hub.url", topic_url));
			httppost.setEntity(new UrlEncodedFormEntity(nvps, "UTF-8"));
			HttpResponse httpresponse = httpclient.execute(httppost);
			Integer httpStatusCode = httpresponse.getStatusLine().getStatusCode();
			if(httpStatusCode != 200 && httpStatusCode != 202 && httpStatusCode != 204) {
				throw new Exception(LogMsg.append("","HTTP returned status code "+httpStatusCode+
							" from attempted HTTP Post to the Alert Hub at "+hub));
			}
			return;	
		}
		throw new Exception(LogMsg.append("","HTTP Post to the Alert Hub requires URLs for both "+
				" the hub [ " + hub + " ] and the RSS file just updated [ " + topic_url + " ]."));
	}
}
