
---------------------------------------------------
-- competitor 01
---------------------------------------------------
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
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042' AND tournament_name = 'Mortal Kombat X Qualifiers'),
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
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    (SELECT count(competitor_number)+1 AS next_competitor FROM competitor WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042' AND tournament_name = 'Mortal Kombat X Qualifiers'),
    'papaluisre' -- competitor forfeited?   
  );
