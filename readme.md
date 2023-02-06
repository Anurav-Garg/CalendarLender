# CalendarLender

A calendar API made using Express.js and Typescript, with a PostgreSQL + Redis backend, for CrUX inductions round 3. This will probably never be updated after the inductions.

## API Reference

### /users

POST: register new user  
GET: get user account details  
DELETE: delete user account and all associated calendars/events  
PATCH: update user account details  
**/users/login**  
POST: log in  
DELETE: log out  

### /my-calendars

POST: create new calendar  
GET: get list of all owned calendars  
**/my-calendars/\[calendar-id\]**  
GET: get calendar metadata  
DELETE: delete calendar  
PATCH: rename calendar  
**/my-calendars/\[calendar-id\]/share**  
POST: share calendar with another user  
DELETE: remove a user from calendar share list  
**/my-calendars/\[calendar-id\]/events**  
GET: get details of all events in calendar  
POST: create a new event  
DELETE: delete an event  
PATCH: update details of an event  

### /shared-calendars

GET: get list of all calendars shared to user  
**/shared-calendars/\[calendar-id\]**  
GET: get calendar details and events  
DELETE: remove self from calendar's share list  

(The following two routes are usually accessed via emailed links instead of being used directly. They contain a token in their query strings.)  
**/verify**: GET: verify email ID after registration  
**/accept-invite**: GET: agree to having a calendar shared with you
