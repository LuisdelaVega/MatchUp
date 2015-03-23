START TRANSACTION;
 ---------------------------------------------------
 -- SQL Query for creating a Team
 ---------------------------------------------------
INSERT INTO "team"
 (
     team_name,
     team_logo,
     team_bio,
     team_cover_photo,
     team_active
 )
VALUES
(
'NeptunoLabs',
'http://neptunolabs.com/images/matchup-logo.png',
'This is a team that brought you this application!',
'http://neptunolabs.com/images/logoPlain.png',
TRUE
);
---------------------------------------------------
 -- This customer is a team member
---------------------------------------------------
INSERT INTO "plays_for"
(
    customer_username,
    team_name
)
VALUES
( 
    'ollidab',
    'NeptunoLabs'
); 

---------------------------------------------------
 -- This customer is the captain
---------------------------------------------------
INSERT INTO "captain_for"
(
    customer_username,
    team_name
)
VALUES
( 
    'ollidab',
    'NeptunoLabs'
); 
   
COMMIT;
