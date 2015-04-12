HOST: http://matchup.neptunolabs.com
API: http://matchup.neptunolabs.com/api

# MatchUp
MatchUp is an eSports management platform and social network for gaming enthusiast and event organizers.
The system aims to solve the biggest problem that event organizers face when producing an eSports event, the lack of a unified management tool.

# Search
MatchUp provides a "Global Search". By global we mean you can search for Users, Events (divided into Live(ongoing), Past, Regular Upcoming, and Hosted Upcoming), Teams, Organizations, Games, Genres, and ... wait, that's it
## Search MatchUp [/matchup/search/{parameter}]
### Search [GET]
+ Parameters
    + parameter (required, string, `uis d`) ... Whathever you want.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "users":
            [
                {
                    "customer_username": "test08",
                    "customer_first_name": "Bentley",
                    "customer_last_name": "Patterson",
                    "customer_tag": "patterson",
                    "customer_profile_pic": "http://i.imgur.com/0Gl8WWF.png",
                    "customer_country": "Mexico"
                },
                {
                    "customer_username": "test10",
                    "customer_first_name": "Jolyon",
                    "customer_last_name": "Sempers",
                    "customer_tag": "sempers",
                    "customer_profile_pic": "http://i.imgur.com/rQvLZSZ.png",
                    "customer_country": "Mexico"
                },
                {
                    "customer_username": "test11",
                    "customer_first_name": "Eduard",
                    "customer_last_name": "Wilson",
                    "customer_tag": "wilson",
                    "customer_profile_pic": "http://i.imgur.com/pSTPtbA.png",
                    "customer_country": "United States"
                }
            ],
            "events":
            {
                "live":
                [
                    {
                        "event_name": "Event 03",
                        "event_start_date": "2015-03-27T13:00:00.000Z",
                        "event_end_date": "2015-05-27T13:00:00.000Z",
                        "event_location": "miradero",
                        "event_venue": "Colosseum",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    }
                ],
                "past":
                [
                    {
                        "event_name": "Event 01",
                        "event_start_date": "2015-03-25T13:00:00.000Z",
                        "event_end_date": "2015-03-28T02:00:00.000Z",
                        "event_location": "miradero",
                        "event_venue": "Student Center 3rd Floor",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    }
                ],
                "regular":
                [
                    {
                        "event_name": "Event 02",
                        "event_start_date": "2015-05-05T13:00:00.000Z",
                        "event_end_date": "2015-05-08T02:00:00.000Z",
                        "event_location": "miradero",
                        "event_venue": "Colosseum",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    },
                    {
                        "event_name": "Event 04",
                        "event_start_date": "2025-10-19T13:00:00.000Z",
                        "event_end_date": "2025-10-23T02:00:00.000Z",
                        "event_location": "Calle Bosque, Mayaguez, PR 00681-9042",
                        "event_venue": "Bosque 51",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    }
                ],
                "hosted":
                [
                    {
                        "event_name": "Event 08",
                        "event_start_date": "2015-11-02T13:00:00.000Z",
                        "event_end_date": "2015-11-20T13:00:00.000Z",
                        "event_location": "30 Independence BLV, Warren, NJ",
                        "event_venue": "Activity Room",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    },
                    {
                        "event_name": "Event 09",
                        "event_start_date": "2015-11-02T13:00:00.000Z",
                        "event_end_date": "2015-11-20T13:00:00.000Z",
                        "event_location": "41 Independence BLV, Warren, NJ",
                        "event_venue": "Activity Room",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    },
                    {
                        "event_name": "Event 07",
                        "event_start_date": "2015-12-01T13:00:00.000Z",
                        "event_end_date": "2015-11-20T13:00:00.000Z",
                        "event_location": "30 Easton Ave, New Brunswick, NJ",
                        "event_venue": "Hilton Activity Room",
                        "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
                    }
                ]
            },
            "teams":
            [
                {
                    "team_name": "NeptunoLabs",
                    "team_logo": "http://neptunolabs.com/images/matchup-logo.png",
                    "team_bio": "This is a team that brought you this application!",
                    "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
                },
                {
                    "team_name": "test team 01",
                    "team_logo": "http://i.imgur.com/bBdFnYf.png",
                    "team_bio": "This is a test team 01. It was used to test this application.",
                    "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
                },
                {
                    "team_name": "test team 04",
                    "team_logo": "http://i.imgur.com/SlUSvZJ.png",
                    "team_bio": "This is a test team 04. It was used to test this application.",
                    "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
                },
                {
                    "team_name": "test team 06",
                    "team_logo": "http://i.imgur.com/pQOXLUQ.png",
                    "team_bio": "This is a test team 06. It was used to test this application.",
                    "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
                },
                {
                    "team_name": "test team 07",
                    "team_logo": "http://i.imgur.com/KIkVRFL.png",
                    "team_bio": "This is a test team 07. It was used to test this application.",
                    "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
                }
            ],
            "organizations":
            [
                {
                    "organization_name": "NeptunoLabs",
                    "organization_logo": "http://neptunolabs.com/images/matchup-logo.png"
                },
                {
                    "organization_name": "Test Org papaluisre",
                    "organization_logo": "http://neptunolabs.com/images/matchup-logo.png"
                },
                {
                    "organization_name": "Test Org 01",
                    "organization_logo": "http://neptunolabs.com/images/matchup-logo.png"
                }
            ],
            "games":
            [
                {
                    "game_name": "Super Ultra Alpha Poverty Fighter X: Retro Edition",
                    "game_image": "http://neptunolabs.com/images/games/Super_Ultra_Alpha_Poverty_Fighter_X:_Retro_Edition_box_art.png"
                },
                {
                    "game_name": "Defense of the Nexus",
                    "game_image": "http://neptunolabs.com/images/games/Defense_of_the_Nexus.jpg"
                }
            ],
            "genres":
            [
                {
                    "genre_name": "Visual novel",
                    "genre_image": "http://neptunolabs.com/images/matchup-logo.png"
                }
            ]
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

# User Accounts
These routes provide the necesary functionality to create a new account in MatchUp and to login to an existing account by providing a correct combination of username and password.
MatchUp has it's own token session service. When a user succesfully logs into the system, they are provided a token. This token is required to access the rest of the MatchUp API.
MatchUp's server makes use of tokens instead of sessions to be able for use with mobile devices (which don't have good support for cookies, i.e., cookie containers)

To learn more about token services we recomend:

http://jwt.io/

https://tools.ietf.org/html/draft-ietf-jose-json-web-signature-41

https://auth0.com/blog/2014/01/07/angularjs-authentication-with-cookies-vs-token/

## Create Account [/create/account]
Create a new account in the system. After the account is created, the server will respond with a token that corresponds to that new account.

### Create a new account [POST]
+ Request (application/json; charset=utf-8)

    + Body

            {
                "username": "apitest",
                "email": "apitest@gmail.com",
                "first_name": "Api",
                "last_name": "Test",
                "tag": "apitesttag",
                "password": "apitest1!"
            }
                

+ Response 201 (application/json; charset=utf-8)
        
        {
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs"
        }

+ Response 400 (application/json; charset=utf-8)
        
        {
            "error": "Incomplete or invalid parameters"
        }

## Login [/login]
Login to an existing account. If login is successful, the server will respond with a token that corresponds to the account.

### Login to your account [POST]
+ Request

    + Headers

            Authorization: Basic dGVzdDAxOnBvcnRhbDEh

+ Response 200 (application/json; charset=utf-8)

        {
            "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Basic realm=Authorization Required

    + Body
        
            Unauthorized

## My Profile [/matchup/profile]
Show your profile.

### Get my Profile [GET]
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        {
            "customer_username": "apitest",
            "customer_first_name": "ApiEdit",
            "customer_last_name": "TestEdit",
            "customer_tag": "Api.Edit",
            "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
            "customer_cover_photo": "http://neptunolabs.com/images/cover.jpg",
            "customer_bio": "Hi, I am a test account",
            "customer_country": "Puerto Rico",
            "customer_email": "apitestedit@gmail.com",
            "my_profile": true
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

### Edit my Profile [PUT]
+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

    + Body
            
            {
              "first_name": "ApiEdit",
              "last_name": "TestEdit",
              "tag": "Api.Edit",
              "profile_pic": "http://neptunolabs.com/images/luis.jpg",
              "cover": "http://neptunolabs.com/images/cover.jpg",
              "bio": "Hi, I am a test account",
              "country": "Puerto Rico",
              "email": "apitestedit@gmail.com"
            }

+ Response 200 (text/html; charset=utf-8)

        Your account has been updated

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

### Delete Account [DELETE]
If a user wants to delete his account, the user must first remove his titles as owner or captain of any organization/team he belongs to.
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        Can't delete account. Still captain or owner

## My Matchups [/matchup/profile/matchups{?state}]
See what we did there? Matchups are the matches you have played, or will play, in Tournaments.
This is serves as a quick way to know the matches that a user is scheduled to play, 
or to see your historical triumphs against those who have opposed you.

### Get my Matchups [GET]
+ Parameters
    + state (optional, string) ... Indicates whether to look for past matchups or current matchups.

        When value is not specified, or if the value isn't a valid one, the server will respond with the upcoming matchups
        + Values
            + `Upcoming`
            + `Past`

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg4MDEyMjd9.G8PuU2Lz4nDxM9TORIfRfX5eeTD-cv7CU9izCG0yGwY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "event_name": "Event 01",
                "event_start_date": "2015-03-25T13:00:00.000Z",
                "event_location": "miradero",
                "tournament_name": "Mortal Kombat X Qualifiers",
                "round_number": 1,
                "round_of": "Group",
                "match_number": 1,
                "is_team_based": false,
                "details":
                [
                    {
                        "customer_tag": "FZN.PaPa",
                        "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                        "score": 1
                    },
                    {
                        "customer_tag": "rapol",
                        "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                        "score": 0
                    }
                ]
            },
            {
                "event_name": "Event 01",
                "event_start_date": "2015-03-25T13:00:00.000Z",
                "event_location": "miradero",
                "tournament_name": "Mortal Kombat X Qualifiers",
                "round_number": 3,
                "round_of": "Group",
                "match_number": 1,
                "is_team_based": false,
                "details":
                [
                    {
                        "customer_tag": "FZN.PaPa",
                        "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                        "score": null
                    },
                    {
                        "customer_tag": "samdlt",
                        "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg",
                        "score": null
                    }
                ]
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## User Profiles [/matchup/profile/{username}]
Show the information of a specific User's profile.

### Get Profile [GET]
The my_profile parameter indicates whether or not the user requested it is looking at his own profile.
+ Parameters
    + username (required, string, `apitest`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

            {
                "customer_username": "apitest",
                "customer_first_name": "ApiEdit",
                "customer_last_name": "TestEdit",
                "customer_tag": "Api.Edit",
                "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
                "customer_cover_photo": "http://neptunolabs.com/images/cover.jpg",
                "customer_bio": "Hi, I am a test account",
                "customer_country": "Puerto Rico",
                "customer_email": "apitestedit@gmail.com",
                "my_profile": true
            }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        User: apitest was not not found

### Subscribe [POST]
+ Parameters
    + username (required, string, `apitest`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 201 (text/html; charset=utf-8)

        Subscribed to: apitest

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't subscribe to yourself

+ Response 404 (text/html; charset=utf-8)

        User: apitest was not not found

### Unsubscribe [DELETE]
If a User requests to unsubscribe from another User to whom he/she is not subscribed, or if the other User doesn't exist, the server will still respond with a 204 but nothing will happen.
+ Parameters
    + username (required, string, `apitest`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## Teams [/matchup/profile/{username}/teams]
Get the teams for which a specific User competes.

### Get Teams [GET]
+ Parameters
    + username (required, string, `ollidab`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "team_name": "NeptunoLabs",
                "team_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "team_name": "Team1",
                "team_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        User: ollidab was not not found

## Organizations [/matchup/profile/{username}/organizations]
Get the Organizations that a specific User belongs to.

### Get Organizations [GET]
+ Parameters
    + username (required, string, `ollidab`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "organization_name": "NeptunoLabs",
                "organization_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "organization_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "organization_name": "Organization1",
                "organization_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "organization_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        User: ollidab was not not found

## Events [/matchup/profile/{username}/events]
Get the Events that a user has created.

### Get Events [GET]
+ Parameters
    + username (required, string, `ollidab`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "event_name": "First Test",
                "event_start_date": "2015-10-19T13:00:00.000Z",
                "event_end_date": "2015-10-23T02:00:00.000Z",
                "event_location": "miradero",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "event_banner": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "event_name": "Event 01",
                "event_start_date": "2015-03-25T13:00:00.000Z",
                "event_end_date": "2015-03-28T02:00:00.000Z",
                "event_location": "miradero",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "event_banner": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "event_name": "Event 06",
                "event_start_date": "2015-10-29T13:00:00.000Z",
                "event_end_date": "2015-10-23T02:00:00.000Z",
                "event_location": "1234 Calle Paloma, Mayaguez, PR 00681-9042",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "event_banner": "http://neptunolabs.com/images/logoPlain.png"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        User: ollidab was not not found

## Events Registered [/matchup/profile/{username}/events/registered{?type}]
Get the Events where a specific User has registered to spectate or to compete.

### Get Events [GET]
+ Parameters
    + username (required, string, `ollidab`) ... The User's username.
    + type (required, string) ... The type of attendee the user yas for an Event.
        + Values
            + `spectator`
            + `competitor`
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "event_name": "First Test",
                "event_start_date": "2015-10-19T13:00:00.000Z",
                "event_end_date": "2015-10-23T02:00:00.000Z",
                "event_location": "miradero",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "event_banner": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "event_name": "Event 01",
                "event_start_date": "2015-03-25T13:00:00.000Z",
                "event_end_date": "2015-03-28T02:00:00.000Z",
                "event_location": "miradero",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "event_banner": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "event_name": "Event 06",
                "event_start_date": "2015-10-29T13:00:00.000Z",
                "event_end_date": "2015-10-23T02:00:00.000Z",
                "event_location": "1234 Calle Paloma, Mayaguez, PR 00681-9042",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "event_banner": "http://neptunolabs.com/images/logoPlain.png"
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        No type specified

+ Response 400 (text/html; charset=utf-8)

        No valid type specified. Posible values [spectator, competitor]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        User: ollidab was not not found

## Subscriptions [/matchup/profile/{username}/subscriptions]
Get the subscriptions of a given user.

### Get Subscriptions [GET]
The my_profile parameter indicates whether or not the user requested it is looking at his own profile.
+ Parameters
    + username (required, string, `ollidab`) ... The User's username.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "customer_username": "papaluisre",
                "customer_first_name": "Luis",
                "customer_last_name": "de la Vega",
                "customer_tag": "papaluisre",
                "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg"
            },
            {
                "customer_username": "rapol",
                "customer_first_name": "Rafael",
                "customer_last_name": "Pol",
                "customer_tag": "rapol",
                "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg"
            },
            {
                "customer_username": "samdlt",
                "customer_first_name": "Sam",
                "customer_last_name": "de la Torre",
                "customer_tag": "samdlt",
                "customer_profile_pic": "http://neptunolabs.com/images/sam.jpg"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        User: ollidab was not not found

# Organizations
Organizations represent real world Companies/Organizations that would like to host eSports Events using MatchUp. Users can send a request to create an Organization.
Organizations may have many members, and more than one member can be recognized as an owner for the Organization. 
All members of an Organization (owners included) are given Event Organizer privileges on any Event hosted by the Organization they belong.

## All Organizations [/matchup/organizations]
Act on all Organizations in the system.

### Get All Organizations [GET]
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "organization_name": "NeptunoLabs",
                "organization_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "organization_bio": "This is the organization that brought you this application!",
                "organization_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "organization_name": "Test Org",
                "organization_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "organization_bio": "This is a test organization from the people that brought you this application!",
                "organization_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "organization_name": "Test Org 01",
                "organization_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "organization_bio": "This is a test organization from the people that brought you this application!",
                "organization_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

### Request a new Organization [POST]
+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFwaXRlc3QiLCJpYXQiOjE0Mjg0NTU1NTJ9.3wGxr60FeepcJmk6R7zcdm8zdWC_VbQegxlDQ-6uGMs

    + Body
        
            {
                "name": "My Organization",
                "description": "Can I have Organization plz"
            }

+ Response 202 (text/html; charset=utf-8)

        Request sent

+ Response 400 (application/json; charset=utf-8)
        
        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## One Organization [/matchup/organizations/{organization}]
Act on a specific Organization in the system.

### Get Organization information [GET]
If the user that issued the request belongs to the Organization, the value for the parameter "is_member" will be set to true, else false.
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "organization_name": "NeptunoLabs",
            "organization_logo": "http://neptunolabs.com/images/matchup-logo.png",
            "organization_bio": "This is the organization that brought you this application!",
            "organization_cover_photo": "http://neptunolabs.com/images/logoPlain.png",
            "is_member": true
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Couldn't find the organization: NeptunoLabs

### Edit the details of an Organization [PUT]
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body
        
            {
                "cover": "http://neptunolabs.com/images/logoPlain.png",
                "logo": "http://neptunolabs.com/images/matchup-logo.png",
                "bio": "This is an edited message for the organization that brought you this application!"
            }

+ Response 200 (application/json; charset=utf-8)

        Organization info updated

+ Response 400 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't edit this event

### Remove an Organization [DELETE]
This request doesn't respond with a 403 even though only owners of an Organization are the only ones allowed to remove them. If this request is called by someone who isn't an owner or even a member of the Organization
it will respond with a 204 but will not remove the Organization.

+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## Members [/matchup/organizations/{organization}/members{?username,owner}]
Act on the members of an Organization.

### Get all Members [GET]
When a member of the Organization is also an owner the value for the parameter "is_owner" will be set to true, else false.
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "customer_username": "ollidab",
                "customer_first_name": "Edwin",
                "customer_last_name": "Badillo",
                "customer_tag": "ollidab",
                "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                "is_owner": true
            },
            {
                "customer_username": "rapol",
                "customer_first_name": "Rafael",
                "customer_last_name": "Pol",
                "customer_tag": "rapol",
                "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                "is_owner": false
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Couldn't find the organization: NeptunoLabs

### Add a Member [POST]
Owners of an Organization may add (or promote) other members to their Organization as owners and any member can add other users to their Organization.

+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.
    + username (required, string, `papaluisre`) ... The username of the User to be added.
    + owner (optional, boolean, `true`) ... Indicate if the user to be added also owns the Organizaiton.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (text/html; charset=utf-8)

        User: papaluisre has been promoted

+ Response 201 (text/html; charset=utf-8)

        User: papaluisre has been added

+ Response 400 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You don't own this Organization

+ Response 404 (text/html; charset=utf-8)

        Couldn't find user: papaluisre

### Remove a Member [DELETE]
Any member can remove another member from an Organization, exept for owners, only owners can remove other owners. You ca also remove yourself from an Organization. 
Owners that try to remove themselves from their Organization can do so unless if by doing so the Organization is to be left without a signle owner. In this case the server will respond with a 403. 
Owners in this situation must promote another member and try again. Removing every member from an Organization doesn't delete the Organization itself, in fact, an Organization can't be left with 0 members.

+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.
    + username (required, string, `papaluisre`) ... The username of the member to be added.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        Organizations must have at least one owner

+ Response 403 (text/html; charset=utf-8)

        You are not an owner of this Organization

+ Response 403 (text/html; charset=utf-8)

        User: papaluisre is not a member of this Organization

+ Response 403 (text/html; charset=utf-8)

        You are not a member of this Organization

## Events [/matchup/organizations/{organization}/events]
### Get All Events [GET]
Get all Events this Organization has hosted or is hosting.
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "event_name": "Event 07",
                "event_location": "30 Easton Ave, New Brunswick, NJ",
                "event_venue": "Hilton Activity Room",
                "event_start_date": "2015-12-01T13:00:00.000Z",
                "event_end_date": "2015-11-20T13:00:00.000Z",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
            },
            {
                "event_name": "First Test",
                "event_location": "miradero",
                "event_venue": "S-113",
                "event_start_date": "2015-10-19T13:00:00.000Z",
                "event_end_date": "2015-10-23T02:00:00.000Z",
                "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
            }
        ]

+ Response 404 (text/html; charset=utf-8)

        Couldn't find the organization: NeptunoLabs

# Teams
Teams are groups of players that compete together in Tournaments. Every team is composed of one captain, and other team members.

## All Teams [/matchup/teams]
Act on all Teams in the system.

### Get All Teams [GET]
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "team_name": "NeptunoLabs",
                "team_logo": "http://neptunolabs.com/images/matchup-logo.png",
                "team_bio": "This is a team that brought you this application!",
                "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "team_name": "test team 01",
                "team_logo": "http://i.imgur.com/bBdFnYf.png",
                "team_bio": "This is a test team 01. It was used to test this application.",
                "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            },
            {
                "team_name": "test team 04",
                "team_logo": "http://i.imgur.com/SlUSvZJ.png",
                "team_bio": "This is a test team 04. It was used to test this application.",
                "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

### Create a new Team [POST]
When a Team is created, the user that issued the request autometically becomes it's captain. He can then add othrer users to his team.
+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body
        
            {
                "name": "API Team",
                "bio": "Test team for MatchUp's API",
                "logo": "http://neptunolabs.com/images/matchup-logo.png",
                "cover": "http://neptunolabs.com/images/logoPlain.png"
            }

+ Response 201 (application/json; charset=utf-8)

        {
            "team_name": "API Team"
        }

+ Response 400 (application/json; charset=utf-8)
        
        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        Team: API Team already exists

## One Team [/matchup/teams/{team}]
Act on a specific Team in the system.

### Get Team information [GET]
If the user that issued the request belongs to the Team, the value for the parameter "is_member" will be set to true, else false.
+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "team_name": "NeptunoLabs",
            "team_logo": "http://neptunolabs.com/images/matchup-logo.png",
            "team_bio": "This is a team that brought you this application!",
            "team_cover_photo": "http://neptunolabs.com/images/logoPlain.png",
            "is_member": true
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Couldn't find the team: NeptunoLabs

### Edit the details of a Team [PUT]
When a user requests to edit a Team where he/she is not a member, the server will respond with a 204 but no Teams will be updated.
+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body
        
            {
                "bio": "This is the edited bio for the team that brought you this application!",
                "logo": "http://neptunolabs.com/images/matchup-logo.png",
                "cover": "http://neptunolabs.com/images/logoPlain.png"
            }

+ Response 200 (application/json; charset=utf-8)

        Team info updated

+ Response 400 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

### Remove a Team [DELETE]
When someone other than the Team's captain requests to delete a Team the server will respond with a 204 but no Teams will be removed.

+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## Members [/matchup/teams/{team}/members{?username}]
Act on the members of an Organization.

### Get all Members [GET]
When a member of the Organization is also a captain the value for the parameter "is_captain" will be set to true, else false.
+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "customer_username": "ollidab",
                "customer_first_name": "Edwin",
                "customer_last_name": "Badillo",
                "customer_tag": "ollidab",
                "customer_profile_pic": "http://neptunolabs.com/images/badillo.jpg",
                "is_captain": true
            },
            {
                "customer_username": "rapol",
                "customer_first_name": "Rafael",
                "customer_last_name": "Pol",
                "customer_tag": "rapol",
                "customer_profile_pic": "http://neptunolabs.com/images/rafa.jpg",
                "is_captain": false
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Couldn't find the team: NeptunoLabs

### Add a Member [POST]
Owners of an Organization may add (or promote) other members to their Organization as owners and any member can add other users to their Organization.

+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.
    + username (required, string, `papaluisre`) ... The username of the User to be added to the Team.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 201 (text/html; charset=utf-8)

        User: papaluisre has been added

+ Response 400 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You are not a member of this team

+ Response 404 (text/html; charset=utf-8)

        Couldn't find user: papaluisre

### Make Captain [PUT]
Captains may resign to their title and assign it to another member of their Team

+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.
    + username (required, string, `papaluisre`) ... The username of the future team captain.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 201 (text/html; charset=utf-8)

        User: papaluisre has been made captain

+ Response 400 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        User: papaluisre is not a member of this NeptunoLabs

+ Response 403 (text/html; charset=utf-8)

        You are not the captain of NeptunoLabs

+ Response 404 (text/html; charset=utf-8)

        Couldn't find user: papaluisre

### Remove a Member [DELETE]
Any member can remove another member from a Team, exept for captains, no member can remove the team captain. You can also remove yourself from a Team, exept if you're the captain.
Captains that try to exit their Teams can't do so unless they assign the title of captain to another team member.

+ Parameters
    + team (required, string, `NeptunoLabs`) ... The name of the Team.
    + username (required, string, `papaluisre`) ... The username of the member to be removed.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You are not a member of NeptunoLabs

+ Response 403 (text/html; charset=utf-8)

        User: papaluisre is not a member of NeptunoLabs

+ Response 403 (text/html; charset=utf-8)

        You can't remove user: papaluisre

# Games/Genres
MatchUp features eSport Events, and thus contains a list of video games to choose from. These games are also of a specific genre. When a Tournament is created it must specify which game is going to be played. 
By doing so, users can look for Events that feature specific games or genres.

## Games [/matchup/popular/games]
Act on all Games in the system.

### Get All Games [GET]
Games will be ordered by popularity. Popularity indicates how many Tournaments have featured a game.
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "game_name": "Project M",
                "game_image": "http://neptunolabs.com/images/games/Project M.png",
                "popularity": "4"
            },
            {
                "game_name": "Super Smash Bros. Melee",
                "game_image": "http://neptunolabs.com/images/games/Super_Smash_Bros_Melee_box_art.png",
                "popularity": "3"
            },
            {
                "game_name": "Ultra Street Fighter IV",
                "game_image": "http://neptunolabs.com/images/games/USF4.jpg",
                "popularity": "2"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## Genres [/matchup/popular/genres]
Act on all Genres in the system.

### Get All Genres [GET]
Genres will be ordered by popularity. Popularity indicates how many Tournaments have featured a game of that genre.
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "genre_name": "Fighting",
                "genre_image": "http://neptunolabs.com/images/fighting.png",
                "popularity": "4"
            },
            {
                "genre_name": "MOBA",
                "genre_image": "http://neptunolabs.com/images/matchup-logo.png",
                "popularity": "1"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

# Events
Events are the most important aspect of MatchUp. Users can create Events complete with their own set of rules, logo, banner, registration deadlines, etc. These Events feature Tournaments where other users compete against one
another in their favourite video games. Events may be hosted by Organizations. For now on, we'll call them Hosted Events when they are hosted by an Organization and Regular Events when not.
Hosted Events have extra features like multiple Tournaments, featuring of Sponsors, etc.

## All Events [/matchup/events{?type,filter,value,state,magnitude,online,hosted}]
Act on all Events in the system.

### Get All Events [GET]
The list of Events can be filtered by one or more parameters.
+ Parameters
    + type (optional, string) ... The type of Event.

        Events can be created/organized by a single customer or can be hosted by an organization. Organizations represent any group of people or “real world organizations” that would like to host Events.
        If an Event isn't hosted by an Organization it is denominated as a Regular Event.
        + Values
            + `regular`
            + `hosted`

    + filter (optional, string) ... Filter Events by the games that are played or by a genre of games.

        Events are composed of Tournaments where players compete in a specific Game. These Games are of specific Genres. After setting the value for the filter, you should specify the value of the filter (see below).
        + Values
            + `game`
            + `genre`

    + value (optional, string, `DOTA 2`) ... The value for the filter.

        Look for Events with Tournamnets that feature a specific game or games from a specific genre. If the filter is set (i.e., game) and the value is not specified the result will be an empty array.

    + state (optional, string) ... Filter Events by their current state.

        Indicate if the list of Events will show only ongoing Events, upcoming Events, or past Events.
        + Values
            + `live`
            + `past`
            + `upcoming`

    + magnitude (optional, string) ... Filter Events by their magnitude.

        + Values
            + `local`
            + `regional`
            + `national`

    + online (optional, boolean) ... Filter Events by how they are to be carried out.

        Indicate if the list of Events will show only Events that are carried out online.
        + Values
            + `true`
            + `false`

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
          {
            "event_name": "Event 01",
            "event_start_date": "2015-03-25T09:00:00.000Z",
            "event_end_date": "2015-03-27T22:00:00.000Z",
            "event_location": "miradero",
            "event_venue": "Student Center 3rd Floor",
            "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
          }, {
            "event_name": "Event 03",
            "event_start_date": "2015-03-27T09:00:00.000Z",
            "event_end_date": "2015-05-27T09:00:00.000Z",
            "event_location": "miradero",
            "event_venue": "Colosseum",
            "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
          }, {
            "event_name": "Event 02",
            "event_start_date": "2015-05-05T09:00:00.000Z",
            "event_end_date": "2015-05-07T22:00:00.000Z",
            "event_location": "miradero",
            "event_venue": "Colosseum",
            "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
          }, {
            "event_name": "Event 06",
            "event_start_date": "2015-10-29T09:00:00.000Z",
            "event_end_date": "2015-10-22T22:00:00.000Z",
            "event_location": "1234 Calle Paloma, Mayaguez, PR 00681-9042",
            "event_venue": "Hilton Activity Room",
            "event_logo": "http://neptunolabs.com/images/matchup-logo.png"
          }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Create a new Event [POST]
+ Parameters
    + hosted (optional, boolean) ... Specify if the Event will be hosted.

        Events can be created/organized by a single customer or can be hosted by an organization.
        + Values
            + `true`
            + `false`

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body
        
            {
                "event": {
                    "name": "Cool Name",
                    "start_date": "2022-11-11 12:34:56",
                    "location": "Enterprise",
                    "venue": "Captain's Quarters",
                    "banner": "http://neptunolabs.com/images/someBanner.jpg",
                    "logo": "http://neptunolabs.com/images/someLogo.jpg",
                    "end_date": "2022-11-12 12:34:56",
                    "registration_deadline": "2022-11-10 12:34:56",
                    "rules": "No touching of the hair or face... And THAT'S IT!",
                    "description": "Come and play video games for money!",
                    "deduction_fee": 25,
                    "is_online": false,
                    "type": "National"
                },
                "tournament": [
                    {
                        "name": "Ultra Street Fighter IV Qualifiers",
                        "game": "Ultra Street Fighter IV",
                        "rules": "Where we're playing we don't need rules",
                        "teams": false,
                        "start_date": "2022-11-11 13:34:56",
                        "deadline": "2022-11-11 12:56:56",
                        "fee": 3.50,
                        "capacity": 25,
                        "seed_money": 322,
                        "type": "Two-Stage",
                        "format": "Double Elimination",
                        "scoring": "Match",
                        "group_players": 4,
                        "group_winners": 2
                    }
                ],
                "host": "NeptunoLabs",
                "fees": [
                    {
                        "name": "One Day Pass",
                        "amount": 3.50,
                        "description": "Go the first day, miss out the best matches",
                        "available": 15
                    },
                    {
                        "name": "Two Day Pass",
                        "amount": 9.99,
                        "description": "Joke around the first day, miss pools, cheer on the second day!",
                        "available": 20
                    }
                ],
                "sponsors": ["BANDI TECH"]
            }

+ Response 201 (application/json; charset=utf-8)

        {
            "name": "Cool Name",
            "start_date": "2022-11-11 12:34:56",
            "location": "Enterprise"
        }

+ Response 400 (application/json; charset=utf-8)
        
        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (application/json; charset=utf-8)

        {
            "error": "You are not a member of: NeptunoLabs"
        }

+ Response 404 (application/json; charset=utf-8)

        {
            "error": "Couldn't find the game: Super Ultra Alpha Poverty Fighter X: Retro Edition"
        }

## One Event [/matchup/events/{event}{?date,location}]
Act on a specific Event in the system. 
Like in the real world, Events have names, a start date, and a location where it will be carried out. 
These aspects of Events are used to find the details of a desired Event

### Get Event information [GET]
If the user that issued the request belongs to the hosting Organization or created the Event, the value for the parameter "is_organizer" will be set to true, else false.
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "event_name": "Event 01",
            "event_start_date": "2015-03-25T13:00:00.000Z",
            "event_end_date": "2015-03-28T02:00:00.000Z",
            "event_location": "miradero",
            "event_venue": "Student Center 3rd Floor",
            "event_banner": "http://neptunolabs.com/images/logoPlain.png",
            "event_logo": "http://neptunolabs.com/images/matchup-logo.png",
            "event_registration_deadline": "2015-03-23T13:00:00.000Z",
            "event_rules": "These would be the rules for a test event.",
            "event_description": "Event 01 event to make sure the SQL queries for the tournament bracket and groups are working correctly",
            "event_deduction_fee": "2.00",
            "event_is_online": false,
            "event_type": "Local",
            "creator": "ollidab",
            "host": "NeptunoLabs",
            "is_organizer": true
        }

+ Response 400 (application/json; charset=utf-8)
        
        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Couldn't find the event: Event 01 starting on: 2015-03-25T13:00:00.000Z located at: miradero

### Add a Tournament [POST]
Only Hosted Events may be able to feature more than one Tournament.
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body        
            
            {
                "name": "Dota 2 Qualifiers",
                "rules": "Rules of the rules with rules comprised of rules",
                "teams": true,
                "start_date": "2015-03-25 11:00:00",
                "deadline": "2015-03-25 10:00:00",
                "fee": "10.00",
                "capacity": 32,
                "seed_money": "100.00",
                "type": "Single Stage",
                "format": "Single Elimination",
                "scoring": "Match",
                "group_players": 0,
                "group_winners": 0,
                "game": "Dota 2"
            }

+ Response 201 (application/json; charset=utf-8)

        {
            "event": {
                "name": "Cool Name",
                "start_date": "20XX-11-11T12:34:56.000Z",
                "location": "Enterprise"
            },
            "tournament": "Another Cool Name! Wow!"
        }

+ Response 400 (application/json; charset=utf-8)

        {
            "error" : "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't add this tournament

### Edit the details of an Event [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body
        
            {
                "name": "Event 01",
                "start_date": "2015-03-25T09:00:00.000Z",
                "location": "miradero",
                "venue": "Captain's Quarters",
                "banner": "http://neptunolabs.com/images/logoPlain.png",
                "logo": "http://neptunolabs.com/images/matchup-logo.png",
                "end_date": "2015-03-27T22:00:00.000Z",
                "registration_deadline": "2015-03-23T09:00:00.000Z",
                "rules": "No touching of the hair or face... And THAT'S IT!",
                "description": "Come and play video games for money!",
                "deduction_fee": 25,
                "is_online": false,
                "type": "National"
            }

+ Response 200 (application/json; charset=utf-8)

        {
            "name": "Event 01",
            "start_date": "2015-03-25T09:00:00.000Z",
            "location": "miradero"
        }

+ Response 400 (application/json; charset=utf-8)

        {
            "error" : "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't edit this event

### Remove an Event [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't delete this event

# Spectators
Like in all types of sports activities, the fans are the real MVPs. A user can sign up to spectate Hosted Events to watch and cheer the competitors from the sidelines.

## All Spectators [/matchup/events/{event}/spectators{?date,location}]
Act on all attendees of an Event that payed a spectator fee.

### Get all Spectators [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "customer_username": "thecap1"
                "customer_first_name": "James",
                "customer_last_name": "Kirk",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/kirk.png",
                "spec_fee_name": "2-day Pass",
                "check_in": true
            },
            {
                "customer_username": "thecap2",
                "customer_first_name": "Jean-Luc",
                "customer_last_name": "Picard",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/luc.png",
                "spec_fee_name": "3-day Pass",
                "check_in": false
            },
            {
                "customer_username": "thecap",
                "customer_first_name": "Jonathan",
                "customer_last_name": "Archer",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/Archer.png",
                "spec_fee_name": "Opening Day Pass",
                "check_in": false
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

## One Spectator [/matchup/events/{event}/spectators/{username}{?date,location}]
As an Event Organizer, you can check and un check Spectator in you Event. This helps keep track of who's
already in the Event.

### Check/Uncheck a Spectator [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, `test02`) ... The spectators username.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (text/html; charset=utf-8)
        
        Updated

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't check-in people for this event

# News
Event Organizers can post news about their Events. Any sudden changes or just updates before, during, and after the Event can be posted has news.

## All News [/matchup/events/{event}/news{?date,location}]
Act on all News posted for an Event.

### Get News for Event [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "news_number": 5,
                "news_title": "Test News 05",
                "news_content": "I am gonna keep my word, this was the last one",
                "news_date_posted": "2015-03-27T11:00:00.000Z"
            },
            {
                "news_number": 4,
                "news_title": "Test News 04",
                "news_content": "Do not worry just one more of these and i will stop",
                "news_date_posted": "2015-03-27T10:00:00.000Z"
            },
            {
                "news_number": 3,
                "news_title": "Test News 03",
                "news_content": "Here we go again, just making sure everything is right with the world",
                "news_date_posted": "2015-03-27T09:00:00.000Z"
            },
            {
                "news_number": 2,
                "news_title": "Test News 02",
                "news_content": "This is a second news test, just making sure everything is right with the world",
                "news_date_posted": "2015-03-27T08:00:00.000Z"
            },
            {
                "news_number": 1,
                "news_title": "Test News 01 Updated",
                "news_content": "This message has been updated. :D So this is a news article. So I think I am gonna go ahead and do that.",
                "news_date_posted": "2015-03-26T13:00:00.000Z"
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

### Create News [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY
            
    + Body
            
            {
                "title": "Mock News",
                "content": "Kapparino Cappuccino"
            }

+ Response 201 (application/json; charset=utf-8)
        
        {
            "event":
            {
                "name": "Event 01",
                "date": "2015-03-25 09:00:00",
                "location": "miradero"
            },
            "number": 6
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't post News to this event

## One News [/matchup/events/{event}/news/{news}{?date,location}]
Act on a single News posted for an Event.

### Get News details [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + news (required, int, `5`) ... The numeric news id.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "news_number": 5,
            "news_title": "Test News 05",
            "news_content": "I am gonna keep my word, this was the last one",
            "news_date_posted": "2015-03-27T11:00:00.000Z"
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        News not found

### Update News details [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + news (required, int, `5`) ... The numeric news id.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body

            {
                "title": "Test API News",
                "content": "Hello Edited"
            }

+ Response 200 (application/json; charset=utf-8)

        {
            "event":
            {
                "name": "Event 01",
                "date": "2015-03-25 09:00:00",
                "location": "miradero"
            },
            "number": 5
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers
        
            WWW-Authenticate: Bearer realm=Authorization Required

    + Body
        
            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't update news for this event

### Delete News [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + news (required, int, `5`) ... The numeric news id.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't delete news in this event

# Reviews
Participants of a Hosted Events (spectators and competitors) can post a review for an Event.

## All Reviews [/matchup/events/{event}/reviews{?date,location}]
Act on all reviews for an Event.

### Get Reviews for Event [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "review_title": "Greatest Test Event Ever!",
                "review_content": "Best experience ever, if other events hosted by Neptuno Labs are like this then I am in",
                "star_rating": 5,
                "review_date_created": "2015-03-25T13:00:00.000Z",
                "customer_username": "test01",
                "customer_first_name": "Fletcher",
                "customer_last_name": "Brook",
                "customer_tag": "fbrook",
                "customer_profile_pic": "http://i.imgur.com/pSTPtbA.png",
                "is_writer": false
            },
            {
                "review_title": "Lorem ipsum dolor sit amet!",
                "review_content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss",
                "star_rating": 1,
                "review_date_created": "2015-03-25T13:00:00.000Z",
                "customer_username": "test10",
                "customer_first_name": "Jolyon",
                "customer_last_name": "Sempers",
                "customer_tag": "sempers",
                "customer_profile_pic": "http://i.imgur.com/rQvLZSZ.png",
                "is_writer": false
            },
            {
                "review_title": "Lorem ipsum dolor sit amet!",
                "review_content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss",
                "star_rating": 2,
                "review_date_created": "2015-03-25T13:00:00.000Z",
                "customer_username": "test04",
                "customer_first_name": "Madlyn",
                "customer_last_name": "Pris",
                "customer_tag": "pris",
                "customer_profile_pic": "http://i.imgur.com/ptNakXV.png",
                "is_writer": false
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Create Review [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

    + Body

            {
                "title": "Greatest Test Event Ever!",
                "content": "Best experience ever, if other events hosted by Neptuno Labs are like this then I am in",
                "rating": 3
            }

+ Response 201 (application/json; charset=utf-8)

        {
            "event":
            {
                "name": "Event 01",
                "date": "2015-03-25 09:00:00",
                "location": "miradero"
            },
            "username": "papaluisre"
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't post a review for this event

+ Response 403 (text/html; charset=utf-8)

        Event not yet started

## One Review [/matchup/events/{event}/review/{username}{?date,location}]
Act on a single review for an Event.

### Get Review details [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, `papaluisre`) ... The username of the writer.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

+ Response 200 (application/json; charset=utf-8)

        {
            "review_title": "Greatest Test Event Ever!",
            "review_content": "Best experience ever, if other events hosted by Neptuno Labs are like this then I am in",
            "star_rating": 3,
            "review_date_created": "2015-03-25T13:00:00.000Z",
            "customer_username": "papaluisre",
            "customer_first_name": "Luis",
            "customer_last_name": "de la Vega",
            "customer_tag": "papaluisre",
            "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
            "is_writer": true
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Review not found

### Update Review [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, ``) ... The username of the writer.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

    + Body

            {
                "title": "Greatest Test Event Ever!",
                "content": "Best edited experience ever!",
                "rating": 5
            }

+ Response 200 (application/json; charset=utf-8)

        {
            "event":
            {
                "name": "Event 01",
                "date": "2015-03-25 09:00:00",
                "location": "miradero"
            },
            "username": "thecap1"
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't update this review

### Delete Review [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, `thecap2`) ... The username of the writer.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't delete this review

# Meetups
Participants of a Hosted Events (spectators and competitors) can create Meetups tied to that Event. A Meetup is an activity that happens, before and during an Event where attendees get together to play in there spare time.
A tipical scenario involves someone, or a group of people, posting that they will be playing X game in Room 626 at Rammiott Hotel from Saturday at 8:00pm until Sunday at 3:00am.
Players meet new people, sometimes even pros attend, and have a good time/practice.

## All Meetups [/matchup/events/{event}/meetups{?date,location}]
Act on all Meetups for an Event.

### Get Meetups for Event [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "meetup_name": "Expert Level Meetup",
                "meetup_start_date": "2015-03-24T17:00:00.000Z",
                "meetup_end_date": "2015-03-25T02:05:06.000Z",
                "meetup_location": "Activity Room Carribe Hotel",
                "customer_username": "thecap2",
                "customer_first_name": "Jean-Luc",
                "customer_last_name": "Picard",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/luc.png",
                "is_organizer": false
            },
            {
                "meetup_name": "Intel Party",
                "meetup_start_date": "2015-03-24T17:00:00.000Z",
                "meetup_end_date": "2015-03-25T02:05:06.000Z",
                "meetup_location": "456, Micasa drive, Mayaguez, PR",
                "customer_username": "thecap1",
                "customer_first_name": "James",
                "customer_last_name": "Kirk",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/kirk.png",
                "is_organizer": true
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Create Meetup [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

    + Body

            {
                "name": "Mock Meetup",
                "location": "Mock Location",
                "start_date": "2015-03-25 09:00:00",
                "end_date": "2015-03-25 16:00:00",
                "description": "Kapparino Cappuccino"
            }

+ Response 201 (application/json; charset=utf-8)

        {
            "event": {
                "name": "Event 01",
                "date": "2015-03-25 09:00:00",
                "location": "miradero"
            },
            "meetup": {
                "name": "Mock Meetup",
                "location": "Mock Location",
                "start_date": "2015-03-25 09:00:00",
                "end_date": "2015-03-25 16:00:00",
                "creator": "thecap2"
            }
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't create a Meetup for this event

## One Meetup [/matchup/events/{event}/meetups/{username}{?date,location,meetup_date,meetup_location}]
Act on a single review for an Event.

### Get Meetup details [GET]
When the User that created the meetup is the one that requested this route, the "is_organizer" parameter will be set true. Otherwise, false.
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, `papaluisre`) ... The username of the writer.
    + meetup_date (required, string, `2015-03-23 09:00:00`) ... The start date of the Meetup.
    + meetup_location (required, string, `Mock Location`) ... The location of the Meetup.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

+ Response 200 (application/json; charset=utf-8)

        {
            "meetup_name": "Mock Meetup",
            "meetup_start_date": "2015-03-23T13:00:00.000Z",
            "meetup_end_date": "2015-03-23T20:00:00.000Z",
            "meetup_location": "Mock Location",
            "meetup_description": "Kapparino Cappuccino",
            "customer_username": "papaluisre",
            "customer_first_name": "Luis",
            "customer_last_name": "de la Vega",
            "customer_tag": "papaluisre",
            "customer_profile_pic": "http://neptunolabs.com/images/luis.jpg",
            "is_organizer": true
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Meetup not found

### Update Meetup [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, `papaluisre`) ... The username of the writer.
    + meetup_date (required, string, `2015-03-23 09:00:00`) ... The username of the writer.
    + meetup_location (required, string, `Mock Location`) ... The username of the writer.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InBhcGFsdWlzcmUiLCJpYXQiOjE0Mjg0NjE0OTd9.2zkt3AswHdGGPZibS2mPWe-FqsksSXAPGnM_dFX2pPI

    + Body

            {
                "name": "Mock Meetup",
                "location": "Mock Location",
                "start_date": "2015-03-23 09:00:00",
                "end_date": "2015-03-23 16:00:00",
                "description": "Edited description"
            }

+ Response 200 (application/json; charset=utf-8)

        {
            "event":
            {
                "name": "Event 01",
                "date": "2015-03-25 09:00:00",
                "location": "miradero"
            },
            "username": "thecap1"
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't update this review

### Delete Meetup [DELETE]
Meetups can be removed by it creator, as well as by Organizers of the Event to which the Meetup is attached.
This is due to the fact that for some reason, an Event organizer may not want he's/her Event to be associated to what is going on in some Meetup.

+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + username (required, string, ``) ... The username of the writer.
    + meetup_date (required, string, ``) ... The username of the writer.
    + meetup_location (required, string, ``) ... The username of the writer.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't delete this review

# Sponsors
Hosted Events can display they sponsors. Sponsors are Companies and/or other types of Organizations that give money or resourses to make Events happen.

## Sponsors of an Organization [/matchup/organizations/{organization}/sponsors{?sponsor}]
Act on all sponsors for an Event.

### Get Sponsors [GET]
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "sponsor_name": "Sponsor #1",
                "sponsor_logo": "http://linktosponsor.com/logo.png",
                "sponsor_link": "http://linktosponsor.com/"
            },
            {
                "sponsor_name": "Sponsor #2",
                "sponsor_logo": "http://linktosponsor.com/logo.png",
                "sponsor_link": "http://linktosponsor.com/"
            },
            {
                "sponsor_name": "Sponsor #3",
                "sponsor_logo": "http://linktosponsor.com/logo.png",
                "sponsor_link": "http://linktosponsor.com/"
            }
        ]

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Coudn't find the organization: NeptunoLabs

### Request Sponsor [POST]
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.
    
+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body

            {
                "link": "http://neptunolabs.com/",
                "description": "I want this sponsor"
            }

+ Response 202 (text/html; charset=utf-8)

        Request sent

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You are not part of this organization

### Remove Sponsor [DELETE]
When someone who tries to delete a sponsor that is not attached to an Organization, the server will respond with a 204 but nothing will happen.
+ Parameters
    + organization (required, string, `NeptunoLabs`) ... The name of the Organization.
    + sponsor (required, string, `See Puerto Rico`) ... The name of the Sponsor.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You are not part of this organization

## Sponsors for an Event [/matchup/events/{event}/sponsors{?date,location,sponsor}]
Act on all sponsors for an Event.

### Get Sponsors [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "sponsor_name": "E-Sports PR",
                "sponsor_logo": "http://esportspr.com/wp-content/uploads/2014/05/Esports-banner-2-tight-300x60.png",
                "sponsor_link": "http://esportspr.com/"
            },
            {
                "sponsor_name": "See Puerto Rico",
                "sponsor_logo": "http://neptunolabs.com/images/sponsors/Turismo-Logo.png",
                "sponsor_link": "http://www.seepuertorico.com/"
            },
            {
                "sponsor_name": "American Petroleum",
                "sponsor_logo": "http://neptunolabs.com/images/sponsors/American-Petroleum.png",
                "sponsor_link": "http://www.americanpetroleumpr.com/"
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 404 (text/html; charset=utf-8)

        Event not found

### Add Sponsor [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + sponsor (required, string, `FIRST ATTACK`) ... The name of the Sponsor.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 201 (text/html; charset=utf-8)

        Sponsor: Sponsor #2 added

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't add sponsors to this Event
        
+ Response 404 (text/html; charset=utf-8)

        Sponsor #2 does not sponsor your Organization

### Remove Sponsor [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + sponsor (required, string, `FIRST ATTACK`) ... The name of the Sponsor.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't add sponsors to this Event

+ Response 404 (text/html; charset=utf-8)

        Sponsor #2 does not sponsor your Event

# Stations
A station is where a match takes place. Hosted Events may have multiple stations, while Regular Events have none. 
Real world stations in eSports are usually composed of a surface (table, desk, etc.) where a console/pc is set and runs a game. 
Sometimes the matches played in specific stations are streamed online for the fans to watch at home.
Stations may be shared between multiple Tournaments within the same Event.

## All Stations [/matchup/events/{event}/stations{?date,location,station}]
Act on all stations of a Hosted Event.

### Get Stations from Event [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "station_number": 1,
                "station_in_use": false,
                "stream_link": "http://www.twitch.tv/ollidab"
            },
            {
                "station_number": 2,
                "station_in_use": false,
                "stream_link": null
            },
            {
                "station_number": 3,
                "station_in_use": false,
                "stream_link": null
            },
            {
                "station_number": 4,
                "station_in_use": false,
                "stream_link": null
            },
            {
                "station_number": 5,
                "station_in_use": false,
                "stream_link": null
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Add Station to Event [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 201 (text/html; charset=utf-8)

        {
            "event": {
                "name": "Event 01",
                "date": "2015-03-25T09:00:00.000Z",
                "location": "miradero"
            },
            "number": 7
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't add stations to this event

### Remove Station from Event [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + station (required, int, `4`) ... The station number.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't remove stations from this event

## One Station [/matchup/events/{event}/stations/{station}{?date,location,station}]
Act on a single station of a Hosted Event.

### Get Station from Event [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + station (required, int, `4`) ... The station number.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "station_number": 4,
            "station_in_use": false,
            "stream_link": "http://www.streamserviceofchoice.tv/your_channel",
            "tournaments": [
                "Super Ultra Alpha Poverty Fighter X: Retro Edition Qualifiers", 
                "Defense of the Nexus Qualifiers"
            ]
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Add Stream to Station [POST]
The link for the stream will be stored so that Organizers know what matches are/will be streamed.
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + station (required, int, `4`) ... The station number.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body

            {
                "stream": "http://www.streamserviceofchoice.tv/your_channel"
            }

+ Response 201 (application/json; charset=utf-8)

        {
            "event": {
                "name": "Event 01",
                "date": "2015-03-25T09:00:00.000Z",
                "location": "miradero"
            },
            "number": 4
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't add streams in this event

### Edit Stream Link [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + station (required, int, `4`) ... The station number.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body

            {
                "stream": "http://www.otherstreamserviceofchoice.tv/your_channel"
            }

+ Response 200 (application/json; charset=utf-8)

        {
            "event": {
                "name": "Event 01",
                "date": "2015-03-25T09:00:00.000Z",
                "location": "miradero"
            },
            "number": 4
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't add stations to this event

### Remove Stream link from Station [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + station (required, int, `4`) ... The station number

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't remove streams in this event

# Tournaments
Tournaments are the heart and soul of Events. Players compete against one another to make their way to the top.
Tournaments feature a single game, but multiple tournaments within a single Event may feature the same game.
Hosted Events may be composed of several Tournaments, while Regular Events feature only one.

## All Tournaments [/matchup/events/{event}/tournaments{?date,location}]
Act on all Tournaments in a specific Event

### Get Tournaments [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "tournament_name": "Super Ultra Alpha Poverty Fighter X: Retro Edition Qualifiers",
                "tournament_rules": "Rules of the rules with rules comprised of rules",
                "is_team_based": false,
                "tournament_start_date": "20XX-11-11 13:34:56",
                "tournament_check_in_deadline": "20XX-11-11 12:56:56",
                "competitor_fee": "10.00",
                "tournament_max_capacity": 32,
                "seed_money": "100.00",
                "tournament_type": "Two Stage",
                "tournament_format": "Double Elimination",
                "score_type": "Match",
                "number_of_people_per_group": 4,
                "amount_of_winners_per_group": 2,
                "game_name": "Super Ultra Alpha Poverty Fighter X: Retro Edition",
                "game_image": "http://neptunolabs.com/images/games/Super_Ultra_Alpha_Poverty_Fighter_X_Retro_Edition_box_art.png"
            },
            {
                "tournament_name": "Defense of the Nexus Qualifiers",
                "tournament_rules": "Rules of the rules with rules comprised of rules",
                "is_team_based": true,
                "tournament_start_date": "20XX-11-11 13:34:56",
                "tournament_check_in_deadline": "20XX-11-11 12:56:56",
                "competitor_fee": "10.00",
                "tournament_max_capacity": 32,
                "seed_money": "100.00",
                "tournament_type": "Single Stage",
                "tournament_format": "Double Elimination",
                "score_type": "Match",
                "number_of_people_per_group": 0,
                "amount_of_winners_per_group": 0,
                "game_name": "Defense of the Nexus",
                "game_image": "http://neptunolabs.com/images/games/Defense_of_the_Nexus.png"
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

## One Tournament [/matchup/events/{event}/tournaments/{tournament}{?date,location,station}]
Act on a single Tournament from an Event.

### Get Tournament [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        {
            "tournament_name": "Super Ultra Alpha Poverty Fighter X: Retro Edition Qualifiers",
            "tournament_rules": "Rules of the rules with rules comprised of rules",
            "is_team_based": false,
            "tournament_start_date": "20XX-11-11 13:34:56",
            "tournament_check_in_deadline": "20XX-11-11 12:56:56",
            "competitor_fee": "10.00",
            "tournament_max_capacity": 32,
            "seed_money": "100.00",
            "tournament_type": "Two Stage",
            "tournament_format": "Double Elimination",
            "score_type": "Match",
            "number_of_people_per_group": 4,
            "amount_of_winners_per_group": 2,
            "game_name": "Super Ultra Alpha Poverty Fighter X: Retro Edition",
            "game_image": "http://neptunolabs.com/images/games/Super_Ultra_Alpha_Poverty_Fighter_X_Retro_Edition_box_art.png"
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Attach Station [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.
    + station (required, int, `4`) ... The station number.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 201 (text/html; charset=utf-8)

        Attached Station #4 to Super Smash Bros. Melee Qualifiers

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't attach stations to this tournament

+ Response 404 (text/html; charset=utf-8)

        Station not found

### Edit Tournament [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.

+ Request (application/json; charset=utf-8)

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body

            {
                "name": "Super Smash Bros. Melee Qualifiers",
                "game": "Super Smash Bros. Melee",
                "rules": "Where we're playing we don't need rules",
                "teams": false,
                "start_date": "2015-06-05 11:00:00",
                "deadline": "2015-06-05 10:00:00",
                "fee": 3.50,
                "capacity": 25,
                "seed_money": 322,
                "type": "Single Stage",
                "format": "Double Elimination",
                "scoring": "Match",
                "group_players": 0,
                "group_winners": 0
            }

+ Response 200 (application/json; charset=utf-8)

        {
            "event": {
                "name": "Cool Name",
                "start_date": "20XX-11-11T12:34:56.000Z",
                "location": "Enterprise"
            },
            "tournament": "Another Cool Name! Wow!"
        }

+ Response 400 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't edit this tournament

### Delete Tournament [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't delete this tournament

## Create Tournament [/matchup/events/{event}/tournaments/{tournament}/create{?date,location,station}]
Tournaments may consist of one or two stages (a Group Stage and/or a final stage i.e., Single/Double Elimination Bracket or Round Robin).
When the Organizer/s see fit to start a Tournament, they may ask MatchUp to create the stages.
MatchUp wil then look for all checked-in competitors and do everything for you. Cool, huh?

### Create Tournament Stages [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 201 (application/json; charset=utf-8)

        {
            "event": {
                "name": "Cool Name",
                "start_date": "20XX-11-11T12:34:56.000Z",
                "location": "Enterprise"
            },
            "tournament": "Another Cool Name! Wow!"
        }

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

## Stations [/matchup/events/{event}/tournaments/{tournament}/stations{?date,location,station}]
Act on all stations of a Tournament.

### Get attached Stations [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "station_number": 1,
                "station_in_use": false,
                "stream_link": "http://www.streamserviceofchoice.tv/your_channel"
            },
            {
                "station_number": 3,
                "station_in_use": false,
                "stream_link": null
            },
            {
                "station_number": 5,
                "station_in_use": false,
                "stream_link": null
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

### Detach Station [DELETE]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.
    + station (required, int, `4`) ... The station number.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 204

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't remove stations from this tournament

# Competitors
Competitors are the hard core gamers who spend hours practicing to better themselves and their opponents. They sign up to play in Tournaments.

## Competitors [/matchup/events/{event}/tournaments/{tournament}/competitors{?date,location}]
Act on all competitors of a Tournament.

### Get all Competitors [GET]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (application/json; charset=utf-8)

        [
            {
                "customer_username": "thecap1"
                "customer_first_name": "James",
                "customer_last_name": "Kirk",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/kirk.png",
                "competitor_fee": "10.00",
                "competitor_check_in": false,
                "competitor_seed": 2,
                "competitor_number": 3
            },
            {
                "customer_username": "thecap2",
                "customer_first_name": "Jean-Luc",
                "customer_last_name": "Picard",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/luc.png",
                "competitor_fee": "10.00",
                "competitor_check_in": false,
                "competitor_seed": 1,
                "competitor_number": 2
            },
            {
                "customer_username": "thecap",
                "customer_first_name": "Jonathan",
                "customer_last_name": "Archer",
                "customer_tag": "The Real Cap",
                "customer_profile_pic": "http://neptunolabs.com/images/Archer.png",
                "competitor_fee": "10.00",
                "competitor_check_in": false,
                "competitor_seed": 3,
                "competitor_number": 1
            }
        ]

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

## One Competitor [/matchup/events/{event}/tournaments/{tournament}/competitors/{competitor}{?date,location}]
Act on a single competitor of a Tournament.

### Check/Uncheck a Competitor [PUT]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.
    + competitor (required, int, `2`) ... The numeric id of the Competitor.

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

+ Response 200 (text/html; charset=utf-8)

        Updated

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't check-in people for this event

## Score Reporting [/matchup/events/{event}/tournaments/{tournament}/rounds/{round}/matches/{match}/{set}{?date,location,round_of}]
Submit the results of a Set.

### Report Score [POST]
+ Parameters
    + event (required, string, `Event 01`) ... The name of the Event.
    + date (required, string, `2015-03-25T09:00:00.000Z`) ... The start date of the Event.
    + location (required, string, `miradero`) ... The location of the Event.
    + tournament (required, string, `Super Smash Bros. Melee Qualifiers`) ... The name of the Tournament.
    + round_of (required, string, `Group`) ... Indicates where the round was/it to be played.

        + Values
            + `Group`
            + `Winner`
            + `Loser`
            + `Round Robin`

+ Request

    + Headers

            Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Im9sbGlkYWIiLCJpYXQiOjE0Mjg0NTY3NTF9.tvWGCFgqc7l199fWpEdq6mecsyoajU1wC-HEAB37PNY

    + Body

            {
                "score": 1
            }

+ Response 201 (text/html; charset=utf-8)

        Score reported

+ Response 400 (text/html; charset=utf-8)

        Invalid Date

+ Response 401 (text/html; charset=utf-8)

    + Headers

            WWW-Authenticate: Bearer realm=Authorization Required

    + Body

            Unauthorized

+ Response 403 (text/html; charset=utf-8)

        You can't submit score

+ Response 403 (application/json; charset=utf-8)

        {
            "error": "Incomplete or invalid parameters"
        }
