UPDATE "news" 
SET (news_title, news_content) = 
    (
     'Test News 01 Updated',
     'This message has been updated. :D So this is a news article. So I think I am gonna go ahead and do that.'
    )
WHERE event_name = 'Event 01' 
  AND event_start_date = '2015-03-25 09:00:00' 
  AND event_location = 'University of Puerto Rico at Mayaguez, Mayaguez, PR 00681-9042' 
  AND news_number = 1;

