---------------------------------------------------
-- add stream to this station
---------------------------------------------------

UPDATE "stream" 
SET (stream_link) = ('http://www.twitch.tv/ollidab') 
WHERE 
    event_name = 'First Test' AND
    event_start_date = '2015-10-19 09:00:00' AND
    event_location = 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042' AND
    station_number = 2;
