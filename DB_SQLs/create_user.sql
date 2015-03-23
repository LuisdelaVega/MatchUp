START TRANSACTION;
 ---------------------------------------------------
 -- SQL Query for creating a Team
 ---------------------------------------------------
INSERT INTO "customer"
 (
  customer_username,
  customer_first_name,
  customer_last_name,
  customer_tag,
  customer_password,
  customer_salt,
  customer_paypal_info,
  customer_profile_pic,
  customer_cover_photo ,
  customer_bio,
  customer_country,
  customer_active
 )
VALUES
('ollidab',
'Edwin',
'Badillo',
'ollidab',
'elbigotedealexis',
 'somesalt',
 'edwin.o.badillo@gmail.com',
 'http://neptunolabs.com/images/badillo.jpg',
 'http://neptunolabs.com/images/ckmagic.jpg',
 'Hi, I am Edwin, one of the creators of Match up. Please enjoy the service!',
 'Puerto Rico',
TRUE);

---------------------------------------------------
 -- This customers email address
---------------------------------------------------
INSERT INTO "of_email"
(
    customer_username,
    email_address
)
VALUES
( 
    'ollidab',
    'edwin.o.badillo@gmail.com'
); 
 
COMMIT;
