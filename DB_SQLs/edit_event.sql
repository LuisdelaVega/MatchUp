START TRANSACTION;
 ---------------------------------------------------
 -- UPDATING AN EVENT SHOULD SEND A NOTIFICATION TO ALL USERS SIGNED UP
 ---------------------------------------------------

-- IF UPDATING GENERAL INFO
UPDATE "event"
SET (
    event_name,
    event_start_date, -- check that event_start_date < event_end_date
    event_location,
    event_venue,
    event_banner,
    event_logo,
    event_end_date,
    event_registration_deadline, -- check that event_registration_deadline < event_start_date
    event_rules,
    event_description,
    event_deduction_fee,
    event_is_online,
    event_type
 ) = 
(
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    'S-113',
    'http://neptunolabs.com/images/logoPlain.png',
    'http://neptunolabs.com/images/matchup-logo.png',
    '2015-10-22 22:00:00',
    '2015-10-15 09:00:00',
    'Rules, rules, rules, rules, rules, rules, rules, and rules',
    'First Test event to make sure the SQL queries and database is working correctly',
    2.00,
    FALSE,
    'Local'
)
WHERE
    event_name = 'First Test' AND
    event_start_date = '2015-10-19 09:00:00' AND -- check that event_start_date < event_end_date
    event_location =  'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042';


---------------------------------------------------
-- Add a SPECTATOR FEE
---------------------------------------------------
 INSERT INTO "spectator_fee"
(
    event_name,
    event_start_date,
    event_location,
    spec_fee_name,
    spec_fee_amount,
    spec_fee_description,
    spec_fee_amount_available
 )
 VALUES
 (
    'First Test',
    '2015-10-19 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    '3-day Pass',
    25.00,
    'General Admission to the first three days. Note: Final Round does not included seating area',
     500
 );

---------------------------------------------------
-- Edit a SPECTATOR FEE
---------------------------------------------------
UPDATE "spectator_fee"
SET ( spec_fee_amount, spec_fee_amount_available )= ( 25.00, 200) -- new amount_available >= current amount_available
WHERE
    event_name = 'First Test' AND
    event_start_date = '2015-10-19 09:00:00' AND -- check that event_start_date < event_end_date
    event_location =  'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042';

---------------------------------------------------
-- remove a SPECTATOR FEE
---------------------------------------------------

UPDATE "spectator_fee"
SET (spec_fee_amount_available)=
 ((SELECT count(spec_fee_name) AS tickets_bought FROM pays WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042' AND spec_fee_name = '3-day Pass'))
WHERE
    event_name = 'First Test' AND
    event_start_date = '2015-10-19 09:00:00' AND -- check that event_start_date < event_end_date
    event_location =  'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042';

COMMIT;
