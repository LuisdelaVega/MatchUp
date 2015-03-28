DELETE FROM capacity_for 
WHERE
    event_name = 'First Test' AND
    event_start_date = '2015-10-19 09:00:00' AND -- check that event_start_date < event_end_date
    event_location =  'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042' AND
    tournament_name = 'Super Smash Bros. Melee Qualifiers' AND
    station_number = 4;
