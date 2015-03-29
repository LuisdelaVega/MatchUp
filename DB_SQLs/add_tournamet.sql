---------------------------------------------------
-- adding a tournament
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
    'Event 04',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Super Smash Bros. Melee Qualifiers',
    'Super Smash Bros. Melee',
    'Rules of the rules with rules comprised of rules',
    FALSE,
    '2015-06-05 11:00:00',
    '2015-06-05 10:00:00',
    10.00,
    32,  
    100.00,
    'Two-Stage',
    'Double Elimination',
    'Match',
    4,
    2
  );

