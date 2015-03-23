START TRANSACTION;
 ---------------------------------------------------
 -- SQL Query for creating an organization
 ---------------------------------------------------
INSERT INTO "organization"
 (
     organization_name,
     organization_logo,
     organization_bio,
     organization_cover_photo,
     organization_active
 )
VALUES
(
    'NeptunoLabs',
    'http://neptunolabs.com/images/matchup-logo.png',
    'This is the organization that brought you this application!',
    'http://neptunolabs.com/images/logoPlain.png',
    TRUE
);
---------------------------------------------------
 -- This customer is a organization member
---------------------------------------------------
INSERT INTO "belongs_to"
(
    organization_name,
    customer_username
    
)
VALUES
( 
    'NeptunoLabs',
    'ollidab'
    
); 

---------------------------------------------------
 -- This customer is one of the owners
---------------------------------------------------
INSERT INTO "owns"
(
    organization_name,
    customer_username
)
VALUES
( 
    'NeptunoLabs',
    'ollidab'
); 
   
COMMIT;
