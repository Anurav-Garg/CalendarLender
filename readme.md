# CalendarLender

A calendar API made using Express.js and Typescript, with a PostgreSQL + Redis backend, for CrUX inductions round 3. This is not hosted anywhere, and will probably never be updated after the inductions.

## API Reference

Prepend the backend URL before these routes, of course.

### /users

<details>
  <summary> <strong> POST: register new user </strong> </summary>  
  Sample Request Body:

```JSON
{
  "username":"username",
  "password":"password",
  "email":"example@email.com",
  "name":"full name"
}
```

</details>

<details>
  <summary><strong>GET: get user account details  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated

</details>

<details>
  <summary><strong>DELETE: delete user account and all associated calendars/events  </strong></summary>
  (Empty body) <br> <br>
  
  **Notes**:
  + User must be authenticated

</details>

<details>
  <summary><strong>PATCH: update user account details  </strong></summary>
  Sample Request Body:

```JSON
{
  "username":"username",
  "password":"password",
  "name":"full name"
}
```
  
  **Notes**:
  + User must be authenticated
  + Updating email ID is not supported
  + All parameters are optional, only entered values will be updated
</details>

#### /users/login

<details>
  <summary><strong>POST: log in  </strong></summary>
    Sample Request Body:

```JSON
{
  "email":"example@email.com",
  "password":"password"
}
```

</details>
<details>
  <summary><strong>DELETE: log out  </strong></summary>
  (Empty body) <br> <br>
  
  **Notes**:
  + User must be authenticated
</details>

### /my-calendars

<details>
  <summary><strong>POST: create new calendar  </strong></summary>
  Sample Request Body:

```JSON
{
  "name":"calendar name"
}
```
  
  **Notes**:
  + User must be authenticated
</details>
<details>
  <summary><strong>GET: get list of all owned calendars  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
</details>

#### /my-calendars/\[calendar-id\]

<details>
  <summary><strong>GET: get calendar metadata  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>
<details>
  <summary><strong>DELETE: delete calendar  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>
<details>
  <summary><strong>PATCH: rename calendar  </strong></summary>
  Sample Request Body:

```JSON
{
  "name":"calendar name"
}
```
  
  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>

#### /my-calendars/\[calendar-id\]/share

<details>
  <summary><strong>POST: share calendar with another user  </strong></summary>
  Sample Request Body:

```JSON
{
  "email":"example@email.com"
}
```
  
  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>
<details>
  <summary><strong>DELETE: remove a user from calendar share list  </strong></summary>
  Sample Request Body:

```JSON
{
  "email":"example@email.com"
}
```
  
  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>

#### /my-calendars/\[calendar-id\]/events

<details>
  <summary><strong>GET: get details of all events in calendar  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>
<details>
  <summary><strong>POST: create a new event  </strong></summary>
  Sample Request Body:

```JSON
{
  "title": "event title",
  "description": "detailed description of the event",
  "startTime": "2023-01-01T12:00:00.000Z",
  "endTime":"2012-01-01T12:30:00.000Z"
}
```
  
  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>
<details>
  <summary><strong>DELETE: delete an event  </strong></summary>
  Sample Request Body:

```JSON
{
  "id": "xxxxxxxxxxxxxxxxxxxxxxxx"
}
```
  
  **Notes**:
  + User must be authenticated
  + User must own the calendar
</details>
<details>
  <summary><strong>PATCH: update details of an event  </strong></summary>
  Sample Request Body:

```JSON
{
  "id": "xxxxxxxxxxxxxxxxxxxxxxxx",
  "title": "event title",
  "description": "detailed description of the event",
  "startTime": "2023-01-01T12:00:00.000Z",
  "endTime":"2023-01-01T12:30:00.000Z"
}
```
  
  **Notes**:
  + User must be authenticated
  + User must own the calendar
  + All parameters besides ID are optional
  + Event ID cannot be changed
</details>

### /shared-calendars

<details>
  <summary><strong>GET: get list of all calendars shared to user  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
</details>

#### /shared-calendars/\[calendar-id\]

<details>
  <summary><strong>GET: get calendar details and events  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
  + User must be in the calendar's share list
</details>
<details>
  <summary><strong>DELETE: remove self from calendar's share list  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
  + User must be in the calendar's share list
</details>

<p>&nbsp;</p>
(The following two routes are usually accessed via emailed links instead of being used directly. They contain a token in their query strings.)  

### /verify

<details>
  <summary><strong>GET: verify email ID after registration  </strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + Server generated token must be present in query string
</details>

### /accept-invite

<details>
  <summary><strong>GET: agree to having a calendar shared with you</strong></summary>
  (Empty body) <br> <br>

  **Notes**:
  + User must be authenticated
  + Server generated token must be present in query string
</details>
