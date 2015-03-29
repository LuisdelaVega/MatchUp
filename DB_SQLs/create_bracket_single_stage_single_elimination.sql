START TRANSACTION;


---------------------------------------------------
-- Winner Round 01
---------------------------------------------------
   INSERT INTO "round"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    round_is_winner,
    round_start_date,
    round_pause,
    round_completed,
    round_best_of
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    1, -- Round 01
    TRUE, -- is winners round?
    '2015-03-25 11:00:00',
    FALSE, -- paused?
    FALSE, -- completed?
    3 -- best of   
  );
---------------------------------------------------
-- Match 01
---------------------------------------------------
   INSERT INTO "match"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    is_favourite,
    match_completed
)
  VALUES
  (
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    1, -- Round 01
    1, -- Match 01
    FALSE,   -- is_ favourite
    FALSE -- completed?
  );
--------------------------------------------------
-- Setting up the intial set for this match
----------------------------------------------------
INSERT INTO "set"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    set_seq,
    set_completed
)
VALUES
(
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    1, -- Round 01
    1, -- Match 01
    1, -- Set
    FALSE -- set completed?
    
);
---------------------------------------------------
-- setting up players
---------------------------------------------------
-- Who competes here????
---------------------------------------------------
INSERT INTO "competes"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    competitor_number
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    1, -- Round 01
    1, -- Match 01
    (SELECT competitor_number FROM is_a WHERE customer_username = 'jems9102') -- competitor
  );
---------------------------------------------------
-- Who competes here????
---------------------------------------------------
INSERT INTO "competes"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    competitor_number
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    1, -- Round 01
    1, -- Match 01
    (SELECT competitor_number FROM is_a WHERE customer_username = 'ollidab') -- competitor
  );


---------------------------------------------------
-- Winner Round 02
---------------------------------------------------
INSERT INTO "round"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    round_is_winner,
    round_start_date,
    round_pause,
    round_completed,
    round_best_of
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round 
    TRUE, -- is winners round?
    '2015-03-25 11:00:00',
    FALSE, -- paused?
    FALSE, -- completed?
    3 -- best of   
  );

---------------------------------------------------
-- Match 01
---------------------------------------------------
INSERT INTO "match"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    is_favourite,
    match_completed
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round 
    1, -- Match 
    FALSE,   -- is_ favourite
    FALSE -- completed?
  );


--------------------------------------------------
-- Setting up the intial set for this match
----------------------------------------------------
INSERT INTO "set"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    set_seq,
    set_completed
)
VALUES
(
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round
    1, -- Match
    1, -- Set
    FALSE -- set completed?
    
);
---------------------------------------------------
-- Who competes here????
---------------------------------------------------
INSERT INTO "competes"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    competitor_number
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round  
    1, -- Match  
    (SELECT competitor_number FROM is_a WHERE customer_username = 'papaluisre') -- competitor
  );





---------------------------------------------------
-- Match 02
---------------------------------------------------
   INSERT INTO "match"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    is_favourite,
    match_completed
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round 
    2, -- Match  
    FALSE,   -- is_ favourite
    FALSE -- completed?
  );


--------------------------------------------------
-- Setting up the intial set for this match
----------------------------------------------------
INSERT INTO "set"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    set_seq,
    set_completed
)
VALUES
(
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round
    2, -- Match
    1, -- Set
    FALSE -- set completed?
);
---------------------------------------------------
-- Who competes here????
---------------------------------------------------
   INSERT INTO "competes"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    competitor_number
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round
    2, -- Match 
    (SELECT competitor_number FROM is_a WHERE customer_username = 'rapol') -- competitor
  );
---------------------------------------------------
-- Who competes here????
---------------------------------------------------
   INSERT INTO "competes"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    competitor_number
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- Round  
    2, -- Match 
    (SELECT competitor_number FROM is_a WHERE customer_username = 'samdlt') -- competitor
  );


---------------------------------------------------
-- Winner Round 03
---------------------------------------------------
   INSERT INTO "round"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    round_is_winner,
    round_start_date,
    round_pause,
    round_completed,
    round_best_of
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    3, -- Round 03
    TRUE, -- is winners round?
    '2015-03-25 11:00:00',
    FALSE, -- paused?
    FALSE, -- completed?
    3 -- best of   
  );

---------------------------------------------------
-- Match 01
---------------------------------------------------
   INSERT INTO "match"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    is_favourite,
    match_completed
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    3, -- Round 01
    1, -- Match 01
    FALSE,   -- is_ favourite
    FALSE -- completed?
  );


--------------------------------------------------
-- Setting up the intial set for this match
----------------------------------------------------
INSERT INTO "set"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    round_number,
    match_number,
    set_seq,
    set_completed
)
VALUES
(
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    3, -- Round
    1, -- Match
    1, -- Set
    FALSE -- set completed?
    
);


---------------------------------------------------
-- Time to assign where people go to :D 
---------------------------------------------------
-- Round 01 Match 01 Winner goes to?
---------------------------------------------------
   INSERT INTO "competitor_goes_to"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    past_round_number,
    past_match,
    future_round_number,
    future_match,
    is_winner
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    1, -- past Round 01
    1, -- past Match 01
    2, -- future Round 01
    1, -- future Match 01   
    TRUE -- is_winner?
  );

---------------------------------------------------
-- Round 02 Match 01 Winner goes to?
---------------------------------------------------
   INSERT INTO "competitor_goes_to"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    past_round_number,
    past_match,
    future_round_number,
    future_match,
    is_winner
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- past Round 01
    1, -- past Match 01
    3, -- future Round 01
    1, -- future Match 01    
    TRUE -- is_winner?
  );

---------------------------------------------------
-- Round 02 Match 02 Winner goes to?
---------------------------------------------------
   INSERT INTO "competitor_goes_to"
(
    event_name,
    event_start_date,
    event_location,
    tournament_name,
    past_round_number,
    past_match,
    future_round_number,
    future_match,
    is_winner
)
  VALUES
  (
     'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Ultra Street Fighter IV Qualifiers',
    2, -- past Round  
    2, -- past Match 
    3, -- future Round  
    1, -- future Match      
    TRUE -- is_winner?
  );

COMMIT;