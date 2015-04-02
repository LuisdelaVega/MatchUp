   INSERT INTO "competitor"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    -- competitor_standing, -- still unknown
    competitor_seed,
    matches_won, -- unknown
    matches_lost,
    competitor_has_forfeited
)
  VALUES
  (
    'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    0, -- no seeding
    0, -- matches won
    0, -- matches lost
    FALSE -- competitor forfeited?   
  );

---------------------------------------------------
-- who is this competitor
---------------------------------------------------
   INSERT INTO "is_a"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    customer_username
)
  VALUES
  (
'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    'papaluisre');
	
	
   INSERT INTO "competitor"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    -- competitor_standing, -- still unknown
    competitor_seed,
    matches_won, -- unknown
    matches_lost,
    competitor_has_forfeited
)
  VALUES
  (
    'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    0, -- no seeding
    0, -- matches won
    0, -- matches lost
    FALSE -- competitor forfeited?   
  );

---------------------------------------------------
-- who is this competitor
---------------------------------------------------
   INSERT INTO "is_a"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    customer_username
)
  VALUES
  (
'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    'rapol');
	
	
   INSERT INTO "competitor"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    -- competitor_standing, -- still unknown
    competitor_seed,
    matches_won, -- unknown
    matches_lost,
    competitor_has_forfeited
)
  VALUES
  (
    'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    0, -- no seeding
    0, -- matches won
    0, -- matches lost
    FALSE -- competitor forfeited?   
  );

---------------------------------------------------
-- who is this competitor
---------------------------------------------------
   INSERT INTO "is_a"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    customer_username
)
  VALUES
  (
'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    'test01');
	
	
   INSERT INTO "competitor"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    -- competitor_standing, -- still unknown
    competitor_seed,
    matches_won, -- unknown
    matches_lost,
    competitor_has_forfeited
)
  VALUES
  (
    'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    0, -- no seeding
    0, -- matches won
    0, -- matches lost
    FALSE -- competitor forfeited?   
  );

---------------------------------------------------
-- who is this competitor
---------------------------------------------------
   INSERT INTO "is_a"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    customer_username
)
  VALUES
  (
'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    'test02');
	
	
	
   INSERT INTO "competitor"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    -- competitor_standing, -- still unknown
    competitor_seed,
    matches_won, -- unknown
    matches_lost,
    competitor_has_forfeited
)
  VALUES
  (
    'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    0, -- no seeding
    0, -- matches won
    0, -- matches lost
    FALSE -- competitor forfeited?   
  );

---------------------------------------------------
-- who is this competitor
---------------------------------------------------
   INSERT INTO "is_a"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    customer_username
)
  VALUES
  (
'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    'test03');
	
	
   INSERT INTO "competitor"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    -- competitor_standing, -- still unknown
    competitor_seed,
    matches_won, -- unknown
    matches_lost,
    competitor_has_forfeited
)
  VALUES
  (
    'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    0, -- no seeding
    0, -- matches won
    0, -- matches lost
    FALSE -- competitor forfeited?   
  );

---------------------------------------------------
-- who is this competitor
---------------------------------------------------
   INSERT INTO "is_a"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    competitor_number,
    customer_username
)
  VALUES
  (
'Event 07',
    '2015-12-01 09:00:00',
    '30 Easton Ave, New Brunswick, NJ',
    'Test Groups 02',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 07' AND event_start_date = '2015-12-01 09:00:00' AND event_location = '30 Easton Ave, New Brunswick, NJ' AND tournament_name = 'Test Groups 02'),
    'test04');