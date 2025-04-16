# Orgapi

Orgapi is an API whose purpose is to record affiliations of citizen in the game Star Citizen

## Installation and Initialisation

Download the repository in a folder. 

Import "schemaDB.sql" in your sql server

Create a file : env.config.js at the root of your folder. Replace parameters with your database informations

```javascript
export const creds = {
"host":"127.0.0.1",
"user":"root",
"password": "rootpassword",
"database": "orgapi"
};
```

Start the node server

```
pm2 start server.js
```
## Usage/Examples

### Get data from RSI website

The endpoint for this part is the following
```
/rsi
```

To get the informations about a citizen, from the LIVE website 
```
/rsi/citizen/:handle
```

```JSON
{
  "Handle": "handle",
  "UCR": "#000000",
  "Enlisted": "01/04/99",
  "Bio": "This is a bio",
  "mainOrg": "SID of main ORG",
  "mainOrgRank": "Rank in main org",
  "affiliations": [
    {
      "org": "SID of org 1",
      "rank": "Rank in org 1"
    },
    {
      "org": "SID of org 2",
      "rank": "Rank in org 2"
    }
  ]
}
```

To get the informations about an organization, from the LIVE website 

```
/rsi/org/:SID
```

```
{
  "SID": "SID of org",
  "orgName": "Name of org",
  "nbMembers": "42"
}
```
To get the informations about an organization, from the LIVE website, with the list of members :

```
/rsi/org/:SID/members
```
```JSON
{
  "SID": "SID of org",
  "orgName": "Name of org",
  "nbMembers": 3,
  "nbHidden": 0,
  "members": [
    "handle 1",
    "handle 2",
    "handle 3"
  ]
}
```

### Update data in database

The endpoint for this part is the following
```
/db/UPDATE
```

To update the characteristics of a citizen, including his affiliations. If the citizen is not included in the database, it is then added : 

```
/db/UPDATE/citizen/:handle
```

To update the characteristics of an organization, including the list of its members.
The affiliations of the members to other oganizations are not affected.
```
/db/UPDATE/org/:SID
```

Update all citizens (see /UPDATE/citizen/:handle) : 
```
/db/UPDATE/citizens
```

Update all organizations (see /UPDATE/org/:SID) :
```
/db/UPDATE/orgs
```

### Display formated informations from database

Get list of followed organizations (followed means that they are updated when /db/UPDATE/orgs is executed )
```
/db/STAT/followedOrgs
```

```
[
  {
    "SID": "SID of org 1",
    "orgName": "Name of org 1",
    "memberNB": 42
  },
  {
    "SID": "SID of org 2",
    "orgName": "Name of org 2",
    "memberNB": 42
  }
]
```
Display all citizens in database with their affiliation

```
/db/STAT/affiliations
```
```
 [{
    "Handle": "Accart",
    "affiliations": "FCU (RECRUE)"
  },
  {
    "Handle": "AdonisNox",
    "affiliations": "FCU (RECRUE), POLYTECH (Novice)"
  },
  {
    "Handle": "Adoxa18",
    "affiliations": "REDACTED (), ASAHEIM (unknow), ASAHEIM (unknow)"
  }]
```

Display all registered affiliations of citizen (current and past, since the start of recording by orgapi)

```
/db/STAT/historique/:handle
```
```
{
  "Handle": "Handle",
  "UCR": "#000000",
  "Enlisted": "2016-05-16T22:00:00.000Z",
  "Bio": "Bio of citizen",
  "currentAffiliations": [
    {
      "orgSID": "mainOrg SID",
      "rank": "Rank in org",
      "firstSight": "2025-04-15T22:00:00.000Z",
      "main": 1
    },
    {
      "orgSID": "other org SID",
      "rank": "Rank in org",
      "firstSight": "2025-04-15T22:00:00.000Z",
      "main": 0
    }
  ],
  "oldAffiliations": [
    {
      "orgSID": "old org SID",
      "rank": "rank in org",
      "firstSight": "2016-04-15T22:00:00.000Z",
      "LastSight": "2025-04-15T22:00:00.000Z",
      "main": 0
    }
  ]
}
```
