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
('test01',
'test01',
'test01',
'test01',
'c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d',
 'MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt',
 'testemail@gmail.com',
 'http://neptunolabs.com/images/badillo.jpg',
 'http://neptunolabs.com/images/ckmagic.jpg',
 'Hi, I am a test user, one of the creators of Match up. Please enjoy the service!',
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
    'test01',
    'testemail@gmail.com'
); 
 
COMMIT;
