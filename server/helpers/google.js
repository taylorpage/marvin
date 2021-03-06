const google = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const request = require('request');
const googleController = require('../db/controllers/tokenController');


const CLIENT_ID = '4395616523-imnbjk054edvhhb4hjn57dp0n0927tfn.apps.googleusercontent.com';
const CLIENT_SECRET = 'xyg2EeaLdOpBHgj9IYLWhwy2';
const REDIRECT_URL = 'http://localhost:3000/process';

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

function getAccessToken(oauth2Client, cb) {
  // generate consent page url
  const url = oauth2Client.generateAuthUrl({
    // will return a refresh token
    access_type: 'offline',

    // can be a space-delimited string or an array of scopes
    scope: 'https://www.googleapis.com/auth/calendar'
  });

  cb(url);

}

exports.queryToken = function(cb){
   googleController.checkToken(function(storedToken){
    if(storedToken){
      oauth2Client.setCredentials(storedToken);
      cb(oauth2Client)
    }
   });
}

exports.getGoogleToken = function(code, cb){

  googleController.checkToken(function(storedToken){

    if(storedToken){
      oauth2Client.setCredentials(storedToken);
      cb(oauth2Client);
    } else {
      oauth2Client.getToken(code, function(err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if(!err) {
          oauth2Client.setCredentials(tokens);
          googleController.storeToken(tokens);
          cb(oauth2Client);
        }
      });
    }

  });

}

exports.getGoogleAuth = function(cb){

  getAccessToken(oauth2Client, function(url){
    cb(url);
  });

}

exports.saveToCalendar = function(auth, params, cb){

  var event = {
    'summary': params.event.name.text,
    'description': params.event.description.text,
    'start': {
      'dateTime': params.event.start.local,
      'timeZone': params.event.start.timezone
    },
    'end': {
      'dateTime': params.event.start.local,
      'timeZone': params.event.start.timezone
    },
    'reminders': {
      'useDefault': false,
      'overrides': [
        {'method': 'email', 'minutes': 24 * 60},
        {'method': 'popup', 'minutes': 10}
      ]
    }
  };

  const calendar = google.calendar('v3');

  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    cb(response);

  });

}

exports.listEvents = function(auth, cb) {
  const calendar = google.calendar('v3');
  calendar.events.list({
    auth: auth,
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    const events = response.items;

    cb(events);

  });
}