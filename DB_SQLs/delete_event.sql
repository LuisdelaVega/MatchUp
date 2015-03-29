START TRANSACTION;
UPDATE "event" SET event_active = FALSE WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042';

-- Need to remove visibility of all tournaments
UPDATE "tournament" SET tournament_active = FALSE WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042';

COMMIT;