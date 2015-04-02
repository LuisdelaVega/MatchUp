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
    'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
    'test05');
	
	
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
    'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
    'test04');
	
	
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
    'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
    'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
    'test10');
	
	
	
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
    'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
    'ollidab');
	
	
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
    'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
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
'Event 08',
    '2015-11-02 09:00:00',
    '30 Independence BLV, Warren, NJ',
    'Test Groups 03',
    (SELECT count(competitor_number) AS next_competitor FROM competitor WHERE event_name = 'Event 08' AND event_start_date = '2015-11-02 09:00:00' AND event_location = '30 Independence BLV, Warren, NJ' AND tournament_name = 'Test Groups 03'),
    'samdlt');