START TRANSACTION;
 ---------------------------------------------------
 -- SQL Query for creating an event
 ---------------------------------------------------
INSERT INTO "event"
 (
    event_name,
    event_start_date,
    event_location,
    customer_username,
    event_venue,
    event_banner,
    event_logo,
    event_max_capacity,
    event_end_date,
    event_registration_deadline,
    event_rules,
    event_description,
    event_active,
    event_deduction_fee,
    event_is_online,
    event_type
 )
VALUES
(
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    'ollidab',
    'S-113',
    'http://neptunolabs.com/images/logoPlain.png',
    'http://neptunolabs.com/images/matchup-logo.png',
    '1024',
    '2015-10-22 22:00:00',
    '2015-10-15 09:00:00',
    'Rules, rules, rules, rules, rules, rules, rules, and rules',
    'First Test event to make sure the SQL queries and database is working correctly',
    TRUE,
    2.00,
    FALSE,
    'Local'
);
---------------------------------------------------
 -- Who are the Sponsors?
---------------------------------------------------
INSERT INTO "shows"
(
    event_name,
    event_start_date,
    event_location,
    sponsor_name
)
VALUES
( 
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    'E-Sports PR'
); 

 
---------------------------------------------------
-- if(organization)
---------------------------------------------------
  INSERT INTO "hosts"
 (
    event_name,
    event_start_date,
    event_location,
    organization_name
)
VALUES
( 
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    'NeptunoLabs'
); 

---------------------------------------------------
-- SPECTATOR FEE
---------------------------------------------------
 INSERT INTO "spectator_fee"
(
    event_name,
    event_start_date,
    event_location,
    spec_fee_name,
    spec_fee_amount,
    spec_fee_description
 )
 VALUES
 (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    '3-day Pass',
    25.00,
    'General Admission to the first three days. Note: Final Round does not included seating area'
 );

---------------------------------------------------
-- if adding a tournament
---------------------------------------------------
   INSERT INTO "tournament"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    game_name,
    tournament_rules,
    is_team_based,
    tournament_start_date,
    tournament_check_in_deadline,
    competitor_fee,
    tournament_max_capacity,
    seed_money,
    tournament_type,
    tournament_format,
    score_type,
    number_of_people_per_group,
    amount_of_winners_per_group)
  VALUES
  (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    'Super Smash Bros. Melee Qualifiers',
    'Super Smash Bros. Melee',
    'Rules of the rules with rules comprised of rules',
    FALSE,
    '2015-10-19 11:00:00',
    '2015-10-19 10:00:00',
    10.00,
    32,  
    100.00,
    'Single Stage',
    'Double Elimination',
    'Match',
    6,
    2
  );
      
 /* 
---------------------------------------------------
-- What type is the tournament?
-- 1 is Single Stage, 2 is Two Stage
---------------------------------------------------
---------------------------------------------------
-- What format is the tournament?
-- 1 is Single Elim, 2 is Double Elim, 3 is Round Robin
---------------------------------------------------

---------------------------------------------------
-- What score type does it have?
-- 1 is by Matches, 2 is by Points
---------------------------------------------------
*/

---------------------------------------------------
-- STATIONs( How many of them? then make them)
-- example we will say he wanted 5 of them so the first is 5,
-- then we go down until we are doing the 1st staion
---------------------------------------------------
INSERT INTO "station"
(
    event_name,
    event_start_date,
    event_location,
    station_number,
    station_in_use
)
VALUES
  (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
     5,
    FALSE
);

  
---------------------------------------------------
-- stream
-- he wanted station 2 to have a stream
---------------------------------------------------
   INSERT INTO "stream" 
(
    event_name,
    event_start_date,
    event_location,
    station_number,
    stream_link
)
VALUES
  (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
     2,
    'http://www.twitch.tv/ollidab'
);
  

---------------------------------------------------
-- capacity_for
-- which tournaments use this specific station?
---------------------------------------------------
INSERT INTO "capacity_for" 
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    station_number
)
VALUES
  (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    'Super Smash Bros. Melee Qualifiers',
    5
);

COMMIT;
