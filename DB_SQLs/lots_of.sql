START TRANSACTION;

INSERT INTO meetup (event_name, event_start_date, event_location, meetup_location, meetup_name, meetup_start_date, meetup_end_date, meetup_description, customer_username) VALUES ('Event 01', '2015-03-25 09:00:00', 'miradero', 'Room 301, Mayaguez Resort and Casino, Mayaguez, Puerto Rico', 'Project X', '2015-03-24 13:00:00', '2015-03-24 22:05:06', 'Practice Matches for the tournament tomorrow hosted by the Puertorican Team', 'papaluisre');


INSERT INTO "to_play" (event_name, event_start_date, event_location, meetup_location, meetup_start_date, game_name)
VALUES ('Event 01', '2015-03-25 09:00:00', 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042', 'Room 301, Mayaguez Resort and Casino, Mayaguez, Puerto Rico', '2015-03-24 13:00:00', 'Super Smash Bros. Melee');

COMMIT;

SELECT bool_and(customer_username IN (SELECT pays.customer_username FROM pays INNER JOIN event ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location AND event.event_name = 'Event 01' AND event.event_start_date = '2015-03-25 09:00:00' AND event.event_location = 'miradero' AND event.event_active) OR customer_username IN (SELECT distinct is_a.customer_username FROM is_a INNER JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location AND event.event_name = 'Event 01' AND event.event_start_date = '2015-03-25 09:00:00' AND event.event_location = 'miradero' AND event.event_active)) FROM customer WHERE customer_username = 'rapol'

select distinct is_a.customer_username, event.event_name, event.event_start_date, event.event_location from is_a inner join event on is_a.event_name = event.event_name and is_a.event_start_date = event.event_start_date and is_a.event_location = event.event_location;

SELECT distinct customer.customer_username, event.event_end_date FROM is_a join event on is_a.event_name = event.event_name and is_a.event_start_date = event.event_start_date and is_a.event_location = event.event_location join pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location join hosts on hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location join belongs_to on belongs_to.organization_name = hosts.organization_name join customer on customer.customer_username = pays.customer_username or customer.customer_username = is_a.customer_username or customer.customer_username = event.customer_username or customer.customer_username = belongs_to.customer_username where event.event_name = 'Event 01' AND event.event_start_date = '2015-03-25 09:00:00' AND event.event_location = 'miradero' AND customer.customer_username = 'test02' and event.event_active;

SELECT distinct customer.customer_username, event.event_end_date FROM is_a JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = pays.customer_username OR customer.customer_username = is_a.customer_username OR customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username where event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active

-- vvvvvvv Check if Event Organizer
SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = 'Event 01' AND event.event_start_date = '2015-03-25 09:00:00' AND event.event_location = 'miradero' AND customer.customer_username = 'papaluisre' AND event.event_active;

SELECT distinct customer.customer_username FROM hosts JOIN event ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active;
-- ^^^^^^^ Check if Event Organizer

-- vvvvvvv Check if Part of Event (Spectators, Competitors, Organizers)
SELECT distinct customer.customer_username, event.event_end_date FROM is_a JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = pays.customer_username OR customer.customer_username = is_a.customer_username OR customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = 'Event 01' AND event.event_start_date = '2015-03-25 09:00:00' AND event.event_location = 'miradero' AND customer.customer_username = 'papaluisre' AND event.event_active

SELECT distinct customer.customer_username, event.event_end_date FROM is_a JOIN event ON is_a.event_name = event.event_name AND is_a.event_start_date = event.event_start_date AND is_a.event_location = event.event_location JOIN pays ON pays.event_name = event.event_name AND pays.event_start_date = event.event_start_date AND pays.event_location = event.event_location JOIN hosts ON hosts.event_name = event.event_name AND hosts.event_start_date = event.event_start_date AND hosts.event_location = event.event_location JOIN belongs_to ON belongs_to.organization_name = hosts.organization_name JOIN customer ON customer.customer_username = pays.customer_username OR customer.customer_username = is_a.customer_username OR customer.customer_username = event.customer_username OR customer.customer_username = belongs_to.customer_username WHERE event.event_name = $1 AND event.event_start_date = $2 AND event.event_location = $3 AND customer.customer_username = $4 AND event.event_active
-- ^^^^^^^ Check if Part of Event (Spectators, Competitors, Organizers)