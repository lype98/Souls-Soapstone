# ds3messages
A Dark Souls III message simulator

(database currently offline, not working) Currently hosted in glitch.com (December 2020): https://dark-souls-messages.glitch.me/


TODO:
Reminder: make sure you can't submit edited messages to the DB (maybe by changing the sendToDB function in ds3.js)
<!-- 1. change the main page to localhost/ds3 so I can start adding submitted templates to the database -->
<!-- 2. a button to submit a template, creating a path number and sending it to the DB
2a. make sure there's no duplicate path or message -->
<!-- 2.b make sure ds3_front redirects to the template link when a repeat message is attempted. -->
<!-- 3. a way to enter a path in the URL and it loading a page with the message
3a. create a .ejs view that will be pretty much a copy of ds3.ejs but it shows just the template, being able to appraise and disparge
3b. in ds3.js, do something like a router.get('/:path',...) that will get that path from the database and fill the template in -->
<!-- 3.c Create logic to change medalion according to appraisals -->
4. create main page that has all messages with their corresponding URL paths
4.a create a container where all the mini templates will go to
4.b create a search box to look for messages

