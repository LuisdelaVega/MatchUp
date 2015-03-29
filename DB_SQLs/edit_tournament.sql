---------------------------------------------------
-- if adding a tournament
---------------------------------------------------
UPDATE "tournament"
SET (
    tournament_name,
    tournament_rules,
    tournament_start_date,
    tournament_check_in_deadline, -- new deadline > current deadline
    competitor_fee,
    tournament_max_capacity,    -- new capacity > current capacity
    seed_money, -- 
    score_type,
    number_of_people_per_group,
    amount_of_winners_per_group)
  VALUES
  (
    'Super Smash Bros. Melee Qualifiers',
    'Rules of the rules with rules comprised of rules',
    '2015-06-05 11:00:00',
    '2015-06-05 10:00:00',
    10.00,
    32,  
    100.00,
    'Match',
    4,
    2
  )
WHERE
    event_name = 'First Test' AND
    event_start_date = '2015-10-19 09:00:00' AND -- check that event_start_date < event_end_date
    event_location =  'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042' AND
    tournament_name = 'Super Smash Bros. Melee Qualifiers';
