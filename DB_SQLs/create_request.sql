 ---------------------------------------------------
 -- SQL Query for creating a request
 ---------------------------------------------------
INSERT INTO "request"
 (
    request_organization_name,
    customer_username,
    request_description,
    request_status
 )
VALUES
(
    'Test Request Organization',
    'ollidab',
    'A test organization request, this may or not be accepted',
    'Received'
);
