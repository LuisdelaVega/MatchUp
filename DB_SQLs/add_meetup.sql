START TRANSACTION;
INSERT INTO "meetup"
(
    event_name,
    event_start_date,
    event_location,
    meetup_location,
    spec_fee_amount,
    spec_fee_description
 )
 VALUES
 (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    '3-day Pass',
    25.00,
    'General Admission to the first three days. Note: Final Round does not included seating area'
 );
COMMIT;