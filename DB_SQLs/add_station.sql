
INSERT INTO "station"
(
    event_name,
    event_start_date,
    event_location,
    station_number,
    station_in_use
)
VALUES
  (
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
     (SELECT count(station_number)+1 AS next_station FROM station WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042'),
    FALSE
);