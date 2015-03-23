START TRANSACTION;
 ---------------------------------------------------
 -- SQL Query for creating a game
 ---------------------------------------------------
INSERT INTO "game"
 ( 
    game_name,
    game_image
 )
VALUES
(
    'Super Smash Bros. Melee',
    'http://neptunolabs.com/images/Super_Smash_Bros_Melee_box_art.png'
);
---------------------------------------------------
 -- Who genre is it
---------------------------------------------------
INSERT INTO "is_of"
(
    game_name,
    genre_name
)
VALUES
( 
    'Super Smash Bros. Melee',
    'Fighting'
); 
COMMIT;
