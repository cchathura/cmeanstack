cmeanstack
==========

before run this application install nodejs and mongodb

to run this application 
	first install depended modules
	cd to project directory and install by following command 
		npm install
		
	then run server by following command
		node server.js

you can access application by following url 
http://localhost:3000/list
http://localhost:3000/arrivals

to send put request I se RESTclient in firefox
save to databse
http://localhost:3000/flight/18/arrived

session store last view file 
go to 
http://localhost:3000/flight/18
then
http://localhost:3000/arrivals will display last viewed flight
