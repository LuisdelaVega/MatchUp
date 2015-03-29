 ---------------------------------------------------
 -- SQL Query for creating a game
 ---------------------------------------------------
INSERT INTO "review"
 ( 
    event_name,
    event_start_date,
    event_location,
    customer_username,
    review_title,
    review_content,
    star_rating,
    review_date_created
 )
VALUES
(
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042',
    'ollidab',
    'Greatest Test Event Ever!',
    'Best experience ever, if other events hosted by Neptuno Labs are like this then I am in',
    5,
    '2015-03-25 09:00:00' -- check if now()>event_start_date
);