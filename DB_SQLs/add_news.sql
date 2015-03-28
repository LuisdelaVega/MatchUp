
INSERT INTO "news"
(
    event_name,
    event_start_date,
    event_location,
    news_number,
    news_title,
    news_content,
    news_date_posted
)
VALUES
  (
    'Event 01',
    '2015-03-25 09:00:00',
    'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042',
    (SELECT count(news_number)+1 AS next_news FROM news WHERE event_name = 'Event 01' AND event_start_date = '2015-03-25 09:00:00' AND event_location = 'University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042'),
    'Test News 01',
    'So this is a news article. So I think I am gonna go ahead and do that.',
    '2015-03-26 09:00:00'
);