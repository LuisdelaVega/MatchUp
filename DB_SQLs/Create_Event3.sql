START TRANSACTION;
 ---------------------------------------------------
 -- SQL Query for creating an event
 ---------------------------------------------------
INSERT INTO "event"
 (event_name,
  event_venue,
  event_location,
  event_banner,
  event_logo,
  event_max_capacity,
  event_start_date,
  event_end_date,
  event_registration_deadline,
  event_rules,
  event_description,
  event_visibility,
  event_deduction_fee)
VALUES
('First Test',
'UPRM',
'S-123',
'http://neptunolabs.com/images/logoPlain.png',
'http://neptunolabs.com/images/matchup-logo.png',
'1024',
'2015-03-15 09:00:00',
'2015-05-22 22:00:00',
'2015-04-20 09:00:00',
'Rules, hello, rules, hello, rules, hello, rules, and hello',
'First Test for a live event to make sure the SQL queries and database is working correctly',
TRUE,
2.00);
---------------------------------------------------
 -- Is it Onsite or Online?
 --1 is On-Site, 2 is online
---------------------------------------------------
INSERT INTO has_presence
(event_id,
event_type_id)
VALUES
( currval('"event_event_id_seq"'),
1); 

---------------------------------------------------
 -- Who created this event?
---------------------------------------------------
INSERT INTO "creates"
 (customer_id,
 event_id) 
 VALUES 
 (1,
 currval('"event_event_id_seq"')); 
 
---------------------------------------------------
-- if(organization)
---------------------------------------------------
  INSERT INTO "hosts"
  (event_id,
  organization_id)
  VALUES 
  (currval('"event_event_id_seq"'),
  1); --Must look for organizations a user belongs to. Need other query for this.
 
---------------------------------------------------
-- SPECTATOR FEE
---------------------------------------------------
 INSERT INTO "spectator_fee"
 (spec_fee_amount,
 spec_fee_description)
 VALUES
 (25.00,
 'General Admission');

 ---------------------------------------------------
-- What event uses this spectator fee?
---------------------------------------------------
 INSERT INTO "contains" 
 (event_id,
 spec_fee_id)
 VALUES 
 (currval('"event_event_id_seq"'),
 currval('"spectator_fee_spec_fee_id_seq"'));
 
---------------------------------------------------
-- SPONSORS
---------------------------------------------------
  INSERT INTO "sponsors"
  (sponsor_logo,
  sponsor_priority,
  sponsor_link)
  VALUES
  ('http://neptunolabs.com/images/logoPlain.png',
  1,
  'http://neptunolabs.com');

---------------------------------------------------
-- Who has these sponsors
---------------------------------------------------
 INSERT INTO "shows" 
 (event_id,
 sponsor_id)
 VALUES 
 (currval('"event_event_id_seq"'), 
 currval('"sponsors_sponsor_id_seq"'));

---------------------------------------------------
-- if adding a tournament
---------------------------------------------------
   INSERT INTO "tournament"
  (tournament_name,
  tournament_rules,
  is_team_based,
  tournament_start_date,
  tournament_check_in_deadline,
  competitor_fee,
  seed_money,
  tournament_max_capacity)
  VALUES
  ('Smash 1v1',
  'Rules of the rules with rules comprised of rules',
  FALSE,
  '2015-10-19 11:00:00',
  '2015-10-19 10:00:00',
  10.00,
  100.00,
  32 
  );
---------------------------------------------------
-- In what event is this tournament?
-- 1 is Single Stage, 2 is Two Stage
---------------------------------------------------
   INSERT INTO "has"
   (event_id,
   tournament_id)
   VALUES 
   (currval('"event_event_id_seq"'), 
   currval('"tournament_tournament_id_seq"')); 
---------------------------------------------------
-- What type is the tournament?
-- 1 is Single Stage, 2 is Two Stage
---------------------------------------------------
   INSERT INTO "has_tourn_type"
   (tournament_type_id,
   tournament_id)
   VALUES 
   (2, --Format id of the tournament. Need other query for this
   currval('"tournament_tournament_id_seq"')); 
   
---------------------------------------------------
-- What format is the tournament?
-- 1 is Single Elim, 2 is Double Elim, 3 is Round Robin
---------------------------------------------------
   INSERT INTO "has_tourn_format"
   (tournament_format_id,
   tournament_id)
   VALUES 
   (3, --Format id of the tournament. Need other query for this
   currval('"tournament_tournament_id_seq"')); 

---------------------------------------------------
-- What score type does it have?
-- 1 is by Matches, 2 is by Points
---------------------------------------------------
  INSERT INTO "of_score_type"
   (score_type_id,
   tournament_id)
   VALUES 
   (1, --Score type id of the tournament. Need other query for this
   currval('"tournament_tournament_id_seq"')); 

---------------------------------------------------
-- What game does it feature?
---------------------------------------------------
   INSERT INTO "features"
   (game_id,
   tournament_id)
   VALUES 
   (2, --Game id of game being played. Need other query for this
   currval('"tournament_tournament_id_seq"')); 
	
---------------------------------------------------
-- STATIONS (main)
---------------------------------------------------
   INSERT INTO "station"
   ( station_name,
  station_stream,
  station_in_use)
  VALUES
  ('Main station',
  'http://www.twitch.tv/ollidab',
  FALSE);
  
---------------------------------------------------
-- Whose station?
---------------------------------------------------
   INSERT INTO "capacity_for" 
   (tournament_id,
   station_id)
   VALUES 
   (currval('"tournament_tournament_id_seq"'), --Changes to the actual tournament you want! Need other Query for this
   currval('"station_station_id_seq"'));

---------------------------------------------------
-- STATIONS (Not-main)
---------------------------------------------------
   INSERT INTO "station"
   ( station_name,
  station_in_use)
  VALUES
  ('station 01',
  FALSE);
  
---------------------------------------------------
-- Whose station? (Not-main)
---------------------------------------------------
   INSERT INTO "capacity_for" 
   (tournament_id,
   station_id)
   VALUES 
   (currval('"tournament_tournament_id_seq"'), --Changes to the actual tournament you want! Need other Query for this
   currval('"station_station_id_seq"'));
   
COMMIT;
