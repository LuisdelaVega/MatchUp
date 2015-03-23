-- Table: "customer"
-- DROP TABLE "customer";

CREATE TABLE "customer"
(
    customer_username character varying(127) NOT NULL,
    customer_first_name character varying(127) NOT NULL,
    customer_last_name character varying(127) NOT NULL,
    customer_tag character varying(127) NOT NULL,
    customer_password character varying(32) NOT NULL,
    customer_salt character varying(32) NOT NULL,
    customer_paypal_info character varying(127) NOT NULL,
    customer_profile_pic character varying(127),
    customer_cover_photo character varying(127),
    customer_bio character varying(255),
    customer_country character varying(32),
    customer_active boolean NOT NULL,
    CONSTRAINT "PK_customer" PRIMARY KEY (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "customer"
  OWNER TO edwinbadillo;
COMMENT ON TABLE "customer"
  IS 'customer:  Can  be a competitor, team member, event organizer, or a selection of the aforementioned.';

 
-- Table: "organization"
-- DROP TABLE "organization";

CREATE TABLE "organization"
(
    organization_name character varying(127) NOT NULL,
    organization_logo character varying(127),
    organization_bio character varying(255),
    organization_cover_photo character varying(127),
    organization_active boolean NOT NULL,
    CONSTRAINT "PK_organization" PRIMARY KEY (organization_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "organization"
  OWNER TO edwinbadillo;


-- Table: "sponsors"
-- DROP TABLE "sponsors";
CREATE TABLE "sponsors"
(
  sponsor_name character varying(127) NOT NULL,
  sponsor_logo character varying(127) NOT NULL,
  sponsor_link character varying(127) NOT NULL,
  CONSTRAINT "PK_sponsor" PRIMARY KEY (sponsor_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "sponsors"
  OWNER TO edwinbadillo;


-- Table: "game"
-- DROP TABLE "game";

CREATE TABLE "game"
(
  game_name character varying(127) NOT NULL,
  game_image character varying(127) NOT NULL,
  CONSTRAINT "PK_game" PRIMARY KEY (game_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "game"
  OWNER TO edwinbadillo;

-- Table: "team"

-- DROP TABLE "team";

CREATE TABLE "team"
(
    team_name character varying(127) NOT NULL,
    team_logo character varying(127) NOT NULL,
    team_bio character varying(255) NOT NULL,
    team_cover_photo character varying(127),
    team_active boolean NOT NULL,
  CONSTRAINT "PK_team" PRIMARY KEY (team_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "team"
  OWNER TO edwinbadillo;

  

-- Table: "genre"
-- DROP TABLE "genre";

CREATE TABLE "genre"
(
  genre_name character varying(127) NOT NULL,
  genre_image character varying(127) NOT NULL,
  CONSTRAINT "PK_genre" PRIMARY KEY (genre_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "genre"
  OWNER TO edwinbadillo;


-- Table: "request"
-- DROP TABLE "request";
CREATE TABLE "request"
(
    request_organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    request_description character varying(255),
    CONSTRAINT "PK_request" PRIMARY KEY (request_organization_name, customer_username),
    CONSTRAINT "FK_request_customer" FOREIGN KEY (customer_username)
    REFERENCES "customer" (customer_username) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
    )
WITH (
  OIDS=FALSE
);
ALTER TABLE "request"
  OWNER TO edwinbadillo;


-- Table: "event"
-- DROP TABLE "event";

CREATE TABLE "event"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    customer_username character varying(127) NOT NULL,
    event_venue character varying(127),
    event_banner character varying(127) NOT NULL,
    event_logo character varying(127) NOT NULL,
    event_max_capacity integer,
    event_end_date timestamp,
    event_registration_deadline timestamp,
    event_rules character varying(255),
    event_description character varying(255),
    event_visibility boolean NOT NULL,
    event_deduction_fee numeric(10,2),
    event_is_online boolean,
    event_type  character varying(31),
    CONSTRAINT "PK_event" PRIMARY KEY (event_name, event_start_date, event_location),
    CONSTRAINT "FK_event_customer" FOREIGN KEY (customer_username)
    REFERENCES "customer" (customer_username) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "event"
  OWNER TO edwinbadillo;


-- Table: "review"
-- DROP TABLE "review";

CREATE TABLE "review"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    customer_username character varying(127),
    review_number int NOT NULL,
    review_title character varying(127) NOT NULL,
    review_content character varying(255) NOT NULL,
    star_rating integer NOT NULL,
    review_date_created timestamp NOT NULL,
    CONSTRAINT "PK_review_id" PRIMARY KEY (event_name, event_start_date, event_location, review_number, customer_username),
    CONSTRAINT "FK_review_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location),
    CONSTRAINT "FK_review_customer" FOREIGN KEY (customer_username) REFERENCES "customer" (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "review"
  OWNER TO edwinbadillo;




-- Table: "tournament"

-- DROP TABLE "tournament";

CREATE TABLE "tournament"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    game_name character varying(127) NOT NULL,
    tournament_rules character varying(127) NOT NULL,
    is_team_based boolean NOT NULL,
    tournament_start_date timestamp NOT NULL,
    tournament_check_in_deadline timestamp NOT NULL,
    competitor_fee numeric(10,2),
    tournament_max_capacity integer,    
    seed_money numeric(10,2),
    tournament_type character varying(32) NOT NULL,
    tournament_format character varying(32) NOT NULL,
    score_type character varying(32) NOT NULL,
    number_of_people_per_group integer,
    amount_of_winners_per_group integer,
    CONSTRAINT "PK_tournament_id" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name),
    CONSTRAINT "FK_tournament_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location),
    CONSTRAINT "FK_tournament_game" FOREIGN KEY (game_name) REFERENCES "game" (game_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "tournament"
  OWNER TO edwinbadillo;


-- Table: "round"
-- DROP TABLE "round";

CREATE TABLE "round"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    round_is_winner boolean NOT NULL,
    round_start_date timestamp NOT NULL,
    round_pause boolean NOT NULL,
    round_completed boolean NOT NULL,
    round_type character varying(32) NOT NULL,
    CONSTRAINT "PK_round" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number),
    CONSTRAINT "FK_round_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES "tournament" (event_name, event_start_date, event_location, tournament_name)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "round"
  OWNER TO edwinbadillo;



-- Table: "station"

-- DROP TABLE "station";

CREATE TABLE "station"
(
event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    station_number int NOT NULL,
    station_in_use boolean NOT NULL,
    CONSTRAINT "PK_station" PRIMARY KEY (event_name, event_start_date, event_location, station_number),
    CONSTRAINT "FK_station_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "station"
  OWNER TO edwinbadillo;





 -- Table: "match"

-- DROP TABLE "match";
-- TODO: This is missing the notification ID this has been left out since these tables may change in the future......
CREATE TABLE "match"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    match_number int NOT NULL,
    is_favourite boolean NOT NULL,
    match_completed boolean NOT NULL,
    CONSTRAINT "PK_match" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number),
    CONSTRAINT "FK_match_round" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number) REFERENCES "round" (event_name, event_start_date, event_location, tournament_name, round_number)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "match"
  OWNER TO edwinbadillo;


-- Table: "spectator_fee"
-- DROP TABLE "spectator_fee";

CREATE TABLE "spectator_fee"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    spec_fee_name character varying(127) NOT NULL,
    spec_fee_amount numeric(10,2) NOT NULL,
    spec_fee_description character varying(255),
  CONSTRAINT "PK_spec_fee" PRIMARY KEY (event_name, event_start_date, event_location, spec_fee_name),
    CONSTRAINT "FK_spectator_fee_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "spectator_fee"
  OWNER TO edwinbadillo;

 -- Table: "meetup"

-- DROP TABLE "meetup";

CREATE TABLE "meetup"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    meetup_location character varying(127) NOT NULL,
    meetup_name character varying(127) NOT NULL,
    meetup_start_date timestamp NOT NULL,
    meetup_description character varying(255) NOT NULL,
  CONSTRAINT "PK_meetup" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location),
    CONSTRAINT "FK_meetup_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "meetup"
  OWNER TO edwinbadillo;

-- Table: to_play

-- DROP TABLE to_play;

CREATE TABLE to_play
(
  event_name character varying(127) NOT NULL,
  event_start_date timestamp without time zone NOT NULL,
  event_location character varying(127) NOT NULL,
  meetup_location character varying(127) NOT NULL,
  game_name character varying(127) NOT NULL,
  CONSTRAINT "PK_to_play" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location, game_name),
  CONSTRAINT "FK_to_play_game" FOREIGN KEY (game_name)
      REFERENCES game (game_name) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_to_play_meetup" FOREIGN KEY (event_name, event_start_date, event_location, meetup_location)
      REFERENCES meetup (event_name, event_start_date, event_location, meetup_location) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE to_play
  OWNER TO edwinbadillo;

-- Table: "set"

-- DROP TABLE "set";

CREATE TABLE "set"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    match_number int NOT NULL,
    set_seq integer NOT NULL,
    set_completed boolean NOT NULL,
    CONSTRAINT "PK_set" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number, set_seq),
    CONSTRAINT "FK_set_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number) REFERENCES "match" (event_name, event_start_date, event_location, tournament_name, round_number, match_number)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "set"
  OWNER TO edwinbadillo;







-- Table: "stream"


CREATE TABLE "stream"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    station_number int NOT NULL,
    stream_link character varying(127) NOT NULL,
    CONSTRAINT "PK_stream" PRIMARY KEY (event_name, event_start_date, event_location, station_number, stream_link),
    CONSTRAINT "FK_stream_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES "station" (event_name, event_start_date, event_location, station_number)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "stream"
  OWNER TO edwinbadillo;




-- Table: "is_of"
-- DROP TABLE "is_of";
CREATE TABLE "is_of"
(
    game_name character varying(127) NOT NULL,
    genre_name character varying(127) NOT NULL,
    CONSTRAINT "PK_is_of" PRIMARY KEY (game_name, genre_name),
    CONSTRAINT "FK_is_of_game" FOREIGN KEY (game_name) REFERENCES "game" (game_name),
    CONSTRAINT "FK_is_of_genre" FOREIGN KEY (genre_name) REFERENCES "genre" (genre_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "is_of"
  OWNER TO edwinbadillo;

 -- Table: "belongs_to"
-- DROP TABLE "belongs_to";
CREATE TABLE "belongs_to"
(
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    CONSTRAINT "PK_belongs_to" PRIMARY KEY (organization_name, customer_username),
    CONSTRAINT "FK_belongs_to_organization" FOREIGN KEY (organization_name) REFERENCES "organization" (organization_name),
    CONSTRAINT "FK_belongs_to_customer" FOREIGN KEY (customer_username) REFERENCES "customer" (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "belongs_to"
  OWNER TO edwinbadillo;

-- Table: "owns"
-- DROP TABLE "owns";
CREATE TABLE "owns"
(
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    CONSTRAINT "PK_owns" PRIMARY KEY (organization_name, customer_username),
    CONSTRAINT "FK_owns_organization" FOREIGN KEY (organization_name) REFERENCES "organization" (organization_name),
    CONSTRAINT "FK_owns_customer" FOREIGN KEY (customer_username) REFERENCES "customer" (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "owns"
  OWNER TO edwinbadillo;


 -- Table: "plays_for"
-- DROP TABLE "plays_for";
CREATE TABLE "plays_for"
(
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL,
    CONSTRAINT "PK_plays_for" PRIMARY KEY (team_name, customer_username),
    CONSTRAINT "FK_plays_for_team_name" FOREIGN KEY (team_name) REFERENCES "team" (team_name),
    CONSTRAINT "FK_plays_for_customer" FOREIGN KEY (customer_username) REFERENCES "customer" (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "plays_for"
  OWNER TO edwinbadillo;


 -- Table: "captain_for"
-- DROP TABLE "captain_for";
CREATE TABLE "captain_for"
(
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL,
    CONSTRAINT "PK_captain_for" PRIMARY KEY (team_name, customer_username),
    CONSTRAINT "FK_captain_for_team" FOREIGN KEY (team_name) REFERENCES "team" (team_name),
    CONSTRAINT "FK_captain_for_customer" FOREIGN KEY (customer_username) REFERENCES "customer" (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "captain_for"
  OWNER TO edwinbadillo;


-- Table: "shows"
-- DROP TABLE "shows";
CREATE TABLE "shows"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    sponsor_name character varying(127) NOT NULL,
    CONSTRAINT "PK_shows" PRIMARY KEY (event_name, event_start_date, event_location, sponsor_name),
    CONSTRAINT "FK_shows_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location),
    CONSTRAINT "FK_shows_sponsor" FOREIGN KEY (sponsor_name) REFERENCES "sponsors" (sponsor_name)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "shows"
  OWNER TO edwinbadillo;

-- Table: "subscribed_to"
-- DROP TABLE "subscribed_to";
CREATE TABLE "subscribed_to"
(
    subscriber character varying(127) NOT NULL,
    interest character varying(127) NOT NULL,
    CONSTRAINT "PK_subscribed_to" PRIMARY KEY (subscriber, interest),
    CONSTRAINT "FK_subscribed_to_customer_subscriber" FOREIGN KEY (subscriber) REFERENCES "customer" (customer_username),
    CONSTRAINT "FK_subscribed_to_customer_interest" FOREIGN KEY (interest) REFERENCES "customer" (customer_username)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "subscribed_to"
  OWNER TO edwinbadillo;


-- Table: competitor

-- DROP TABLE competitor;

CREATE TABLE competitor
(
  event_name character varying(127) NOT NULL,
  event_start_date timestamp without time zone NOT NULL,
  event_location character varying(127) NOT NULL,
  tournament_name character varying(127) NOT NULL,
  competitor_number integer NOT NULL,
  competitor_standing integer NOT NULL,
  competitor_seed integer NOT NULL,
  matches_won integer NOT NULL,
  matches_lost integer NOT NULL,
  competitor_has_forfeited boolean NOT NULL,
  CONSTRAINT "PK_competitor" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number),
  CONSTRAINT "FK_competitor_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name)
      REFERENCES tournament (event_name, event_start_date, event_location, tournament_name) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE competitor
  OWNER TO edwinbadillo;

-- Table: capacity_for

-- DROP TABLE capacity_for;

CREATE TABLE capacity_for
(
  event_name character varying(127) NOT NULL,
  event_start_date timestamp without time zone NOT NULL,
  event_location character varying(127) NOT NULL,
  tournament_name character varying(127) NOT NULL,
  station_number integer NOT NULL,
  CONSTRAINT "PK_capacity_for" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, station_number),
  CONSTRAINT "FK_capacity_for_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number)
      REFERENCES station (event_name, event_start_date, event_location, station_number) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT "FK_capacity_for_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name)
      REFERENCES tournament (event_name, event_start_date, event_location, tournament_name) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE capacity_for
  OWNER TO edwinbadillo;


-- Table: capacity_for

-- DROP TABLE competes_for;

CREATE TABLE competes_for
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    team_name character varying(127) NOT NULL,
    CONSTRAINT "PK_competes_for" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, team_name),
    CONSTRAINT "FK_competes_for_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number)
    REFERENCES competitor (event_name, event_start_date, event_location, tournament_name, competitor_number) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT "FK_competes_for_team" FOREIGN KEY (team_name)
    REFERENCES team (team_name) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE competes_for
  OWNER TO edwinbadillo;


-- Table: is_a;
-- DROP TABLE is_a;

CREATE TABLE is_a
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    customer_username character varying(127) NOT NULL,
    CONSTRAINT "PK_is_a" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, customer_username),
    CONSTRAINT "FK_is_a_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number)
    REFERENCES competitor (event_name, event_start_date, event_location, tournament_name, competitor_number) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT "FK_is_a_customer" FOREIGN KEY (customer_username)
    REFERENCES customer (customer_username) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE is_a
  OWNER TO edwinbadillo;



-- Table: pays;
-- DROP TABLE pays;

CREATE TABLE pays
(
    
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    spec_fee_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    CONSTRAINT "PK_pays" PRIMARY KEY (event_name, event_start_date, event_location, spec_fee_name, customer_username),
    
    CONSTRAINT "FK_pays_spectator_fee" FOREIGN KEY (event_name, event_start_date, event_location, spec_fee_name) 
    REFERENCES "spectator_fee" (event_name, event_start_date, event_location, spec_fee_name) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION,
    

    CONSTRAINT "FK_pays_customer" FOREIGN KEY (customer_username)
    REFERENCES customer (customer_username) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE pays
  OWNER TO edwinbadillo;




-- Table: "tournament"

-- DROP TABLE "tournament";

CREATE TABLE "hosts"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    organization_name character varying(127) NOT NULL,

    CONSTRAINT "PK_hosts_id" PRIMARY KEY (event_name, event_start_date, event_location, organization_name),
    CONSTRAINT "FK_hosts_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES "event" (event_name, event_start_date, event_location),
    CONSTRAINT "FK_hosts_organization" FOREIGN KEY (organization_name) REFERENCES "organization" (organization_name)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "hosts"
  OWNER TO edwinbadillo;



-- Table: posts;
-- DROP TABLE posts;

CREATE TABLE posts
(
    
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    meetup_location character varying(127),
    customer_username character varying(127) NOT NULL,    
    CONSTRAINT "PK_posts" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location, customer_username),
    
    CONSTRAINT "FK_posts_meetup" FOREIGN KEY (event_name, event_start_date, event_location, meetup_location)
      REFERENCES meetup (event_name, event_start_date, event_location, meetup_location) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT "FK_posts_customer" FOREIGN KEY (customer_username)
    REFERENCES customer (customer_username) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE posts
  OWNER TO edwinbadillo;


-- Table: "competes"

-- DROP TABLE "competes";

CREATE TABLE "competes"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    match_number int NOT NULL,

    competitor_number integer NOT NULL,

    set_completed boolean NOT NULL,
    CONSTRAINT "PK_competes" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number, competitor_number),
    
    CONSTRAINT "FK_competes_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number) REFERENCES "match" (event_name, event_start_date, event_location, tournament_name, round_number, match_number),

    CONSTRAINT "FK_competes_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number)
    REFERENCES competitor (event_name, event_start_date, event_location, tournament_name, competitor_number) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "competes"
  OWNER TO edwinbadillo;





-- Table: "submits"

-- DROP TABLE "submits";

CREATE TABLE "submits"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    match_number int NOT NULL,
    set_seq integer NOT NULL,
    competitor_number integer NOT NULL,
    score integer NOT NULL,
    


    CONSTRAINT "PK_submits" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number, set_seq),
    CONSTRAINT "FK_submits_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number, set_seq) REFERENCES "set" (event_name, event_start_date, event_location, tournament_name, round_number, match_number, set_seq),

    CONSTRAINT "FK_submits_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES "competitor" (event_name, event_start_date, event_location, tournament_name, competitor_number)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "submits"
  OWNER TO edwinbadillo;




-- Table: "competitor_goes_to"
-- DROP TABLE "competitor_goes_to";
CREATE TABLE "competitor_goes_to"
(
	event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    past_match int NOT NULL,
    future_match int NOT NULL,
    is_winner boolean not NULL,
    
    CONSTRAINT "PK_competitor_goes_to" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, past_match, future_match, is_winner),
    CONSTRAINT "FK_competitor_goes_to_past_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, past_match) REFERENCES "match" (event_name, event_start_date, event_location, tournament_name, round_number, match_number),
    CONSTRAINT "FK_competitor_goes_to_future_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, future_match) REFERENCES "match" (event_name, event_start_date, event_location, tournament_name, round_number, match_number)

    
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "competitor_goes_to"
  OWNER TO edwinbadillo;


-- Table: "is_played_in"

-- DROP TABLE "is_played_in";

CREATE TABLE "is_played_in"
(
    
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    tournament_name character varying(127) NOT NULL,
    round_number int NOT NULL,
    match_number int NOT NULL,
        station_number int NOT NULL,

    CONSTRAINT "PK_is_played_in" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number, station_number),
    CONSTRAINT "FK_is_played_in_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, match_number) REFERENCES "match" (event_name, event_start_date, event_location, tournament_name, round_number, match_number),

    CONSTRAINT "FK_is_played_in_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES "station" (event_name, event_start_date, event_location, station_number)

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "is_played_in"
  OWNER TO edwinbadillo;



-- Table: "news"
-- DROP TABLE "news";

CREATE TABLE "news"
(
    event_name character varying(127) NOT NULL,
    event_start_date timestamp,
    event_location character varying(127),
    news_number integer,
    news_title character varying(127),
    news_content character varying(255),
    news_date_posted timestamp,
    CONSTRAINT "PK_news" PRIMARY KEY (event_name, event_start_date, event_location, news_number),
    CONSTRAINT "FK_news_event" FOREIGN KEY (event_name, event_start_date, event_location)
    REFERENCES "event" (event_name, event_start_date, event_location) MATCH SIMPLE
    ON UPDATE NO ACTION ON DELETE NO ACTION

)
WITH (
  OIDS=FALSE
);
ALTER TABLE "news"
  OWNER TO edwinbadillo;

-- Table: "of_email"
-- DROP TABLE "of_email";

CREATE TABLE "of_email"
(
   customer_username character varying(127) NOT NULL,
    email_address character varying(127) NOT NULL,
   CONSTRAINT "PK_of_email" PRIMARY KEY (customer_username, email_address),
   CONSTRAINT "FK_of_email_customer" FOREIGN KEY (customer_username) REFERENCES "customer" (customer_username)
)
WITH (
 OIDS=FALSE
);
ALTER TABLE "of_email"
 OWNER TO edwinbadillo; 

-- Table: "report"
