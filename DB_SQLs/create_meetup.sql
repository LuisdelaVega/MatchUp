START TRANSACTION;

INSERT INTO "meetup"
(
    event_name,
    event_start_date,
    event_location,
    meetup_location,
    meetup_name,
    meetup_start_date,
    meetup_end_date,
    meetup_description,
    customer_username
)
VALUES
  (
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Room 301, Mayaguez Resort and Casino, Mayaguez, Puerto Rico',
    'Puertoricans Party',
    '2015-03-24 13:00:00',
    '2015-03-24 22:05:06',
    'Practice Matches for the tournament tomorrow hosted by the Puertorican Team',
    'ollidab'
);


INSERT INTO "to_play"
(
    event_name,
    event_start_date,
    event_location,
    meetup_location,
    meetup_start_date,
    game_name
)
VALUES
  (
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'Room 301, Mayaguez Resort and Casino, Mayaguez, Puerto Rico',
    '2015-03-24 13:00:00',
    'Super Smash Bros. Melee'
);

COMMIT;