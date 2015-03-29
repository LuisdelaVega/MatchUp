--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: belongs_to; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE belongs_to (
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE belongs_to OWNER TO edwinbadillo;

--
-- Name: capacity_for; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE capacity_for (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    station_number integer NOT NULL
);


ALTER TABLE capacity_for OWNER TO edwinbadillo;

--
-- Name: captain_for; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE captain_for (
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE captain_for OWNER TO edwinbadillo;

--
-- Name: competes; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE competes (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    match_number integer NOT NULL,
    competitor_number integer NOT NULL
);


ALTER TABLE competes OWNER TO edwinbadillo;

--
-- Name: competes_for; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE competes_for (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE competes_for OWNER TO edwinbadillo;

--
-- Name: competitor; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE competitor (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    competitor_standing integer,
    competitor_seed integer NOT NULL,
    matches_won integer NOT NULL,
    matches_lost integer NOT NULL,
    competitor_has_forfeited boolean NOT NULL,
    competitor_check_in boolean DEFAULT false,
    competitor_paid boolean DEFAULT false NOT NULL
);


ALTER TABLE competitor OWNER TO edwinbadillo;

--
-- Name: competitor_goes_to; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE competitor_goes_to (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    past_round_number integer NOT NULL,
    past_round_is_winner boolean DEFAULT true NOT NULL,
    past_match integer NOT NULL,
    future_round_number integer NOT NULL,
    future_round_is_winner boolean DEFAULT true NOT NULL,
    future_match integer NOT NULL,
    is_winner boolean NOT NULL
);


ALTER TABLE competitor_goes_to OWNER TO edwinbadillo;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE customer (
    customer_username character varying(127) NOT NULL,
    customer_first_name character varying(127) NOT NULL,
    customer_last_name character varying(127) NOT NULL,
    customer_tag character varying(127) NOT NULL,
    customer_password character varying(32) NOT NULL,
    customer_salt character varying(32) NOT NULL,
    customer_paypal_info character varying(127),
    customer_profile_pic character varying(127),
    customer_cover_photo character varying(127),
    customer_bio character varying(255),
    customer_country character varying(32),
    customer_active boolean DEFAULT true NOT NULL
);


ALTER TABLE customer OWNER TO edwinbadillo;

--
-- Name: TABLE customer; Type: COMMENT; Schema: public; Owner: edwinbadillo
--

COMMENT ON TABLE customer IS 'customer:  Can  be a competitor, team member, event organizer, or a selection of the aforementioned.';


--
-- Name: event; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE event (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    event_venue character varying(127),
    event_banner character varying(127) NOT NULL,
    event_logo character varying(127) NOT NULL,
    event_max_capacity integer,
    event_end_date timestamp without time zone,
    event_registration_deadline timestamp without time zone,
    event_rules character varying(255),
    event_description character varying(255),
    event_active boolean DEFAULT true NOT NULL,
    event_deduction_fee numeric(10,2),
    event_is_online boolean,
    event_type character varying(31)
);


ALTER TABLE event OWNER TO edwinbadillo;

--
-- Name: game; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE game (
    game_name character varying(127) NOT NULL,
    game_image character varying(127) NOT NULL
);


ALTER TABLE game OWNER TO edwinbadillo;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE genre (
    genre_name character varying(127) NOT NULL,
    genre_image character varying(127) NOT NULL
);


ALTER TABLE genre OWNER TO edwinbadillo;

--
-- Name: group; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE "group" (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    group_number integer NOT NULL
);


ALTER TABLE "group" OWNER TO edwinbadillo;

--
-- Name: group_stage; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE group_stage (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true,
    match_number integer NOT NULL,
    competitor_number integer NOT NULL,
    group_number integer NOT NULL,
    group_placing integer NOT NULL
);


ALTER TABLE group_stage OWNER TO edwinbadillo;

--
-- Name: hosts; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE hosts (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    organization_name character varying(127) NOT NULL
);


ALTER TABLE hosts OWNER TO edwinbadillo;

--
-- Name: is_a; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE is_a (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE is_a OWNER TO edwinbadillo;

--
-- Name: is_of; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE is_of (
    game_name character varying(127) NOT NULL,
    genre_name character varying(127) NOT NULL
);


ALTER TABLE is_of OWNER TO edwinbadillo;

--
-- Name: is_played_in; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE is_played_in (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    match_number integer NOT NULL,
    station_number integer NOT NULL
);


ALTER TABLE is_played_in OWNER TO edwinbadillo;

--
-- Name: match; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE match (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    match_number integer NOT NULL,
    is_favourite boolean DEFAULT false NOT NULL,
    match_completed boolean DEFAULT false NOT NULL
);


ALTER TABLE match OWNER TO edwinbadillo;

--
-- Name: meetup; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE meetup (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    meetup_location character varying(127) NOT NULL,
    meetup_name character varying(127) NOT NULL,
    meetup_start_date timestamp without time zone NOT NULL,
    meetup_end_date timestamp without time zone NOT NULL,
    meetup_description character varying(255) NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE meetup OWNER TO edwinbadillo;

--
-- Name: news; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE news (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    news_number integer NOT NULL,
    news_title character varying(127),
    news_content character varying(255),
    news_date_posted timestamp without time zone
);


ALTER TABLE news OWNER TO edwinbadillo;

--
-- Name: of_email; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE of_email (
    customer_username character varying(127) NOT NULL,
    email_address character varying(127) NOT NULL
);


ALTER TABLE of_email OWNER TO edwinbadillo;

--
-- Name: organization; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE organization (
    organization_name character varying(127) NOT NULL,
    organization_logo character varying(127),
    organization_bio character varying(255),
    organization_cover_photo character varying(127),
    organization_active boolean DEFAULT true NOT NULL
);


ALTER TABLE organization OWNER TO edwinbadillo;

--
-- Name: owns; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE owns (
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE owns OWNER TO edwinbadillo;

--
-- Name: pays; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE pays (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    spec_fee_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    check_in boolean DEFAULT false NOT NULL
);


ALTER TABLE pays OWNER TO edwinbadillo;

--
-- Name: plays_for; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE plays_for (
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE plays_for OWNER TO edwinbadillo;

--
-- Name: report; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE report (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    match_number integer NOT NULL,
    set_seq integer NOT NULL,
    report_number integer NOT NULL,
    report_description character varying(255) NOT NULL,
    report_image character varying(127) NOT NULL,
    report_date timestamp without time zone,
    report_type character varying(127) NOT NULL
);


ALTER TABLE report OWNER TO edwinbadillo;

--
-- Name: request; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE request (
    request_organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    request_description character varying(255),
    request_status character varying(32) DEFAULT 'Received'::character varying NOT NULL
);


ALTER TABLE request OWNER TO edwinbadillo;

--
-- Name: review; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE review (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    review_number integer NOT NULL,
    review_title character varying(127) NOT NULL,
    review_content character varying(255) NOT NULL,
    star_rating integer NOT NULL,
    review_date_created timestamp without time zone NOT NULL
);


ALTER TABLE review OWNER TO edwinbadillo;

--
-- Name: round; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE round (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    round_start_date timestamp without time zone NOT NULL,
    round_pause boolean DEFAULT false NOT NULL,
    round_completed boolean DEFAULT false NOT NULL,
    round_best_of integer
);


ALTER TABLE round OWNER TO edwinbadillo;

--
-- Name: set; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE set (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    match_number integer NOT NULL,
    set_seq integer NOT NULL,
    set_completed boolean DEFAULT false NOT NULL
);


ALTER TABLE set OWNER TO edwinbadillo;

--
-- Name: shows; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE shows (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    sponsor_name character varying(127) NOT NULL
);


ALTER TABLE shows OWNER TO edwinbadillo;

--
-- Name: spectator_fee; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE spectator_fee (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    spec_fee_name character varying(127) NOT NULL,
    spec_fee_amount numeric(10,2) NOT NULL,
    spec_fee_description character varying(255)
);


ALTER TABLE spectator_fee OWNER TO edwinbadillo;

--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE sponsors (
    sponsor_name character varying(127) NOT NULL,
    sponsor_logo character varying(127) NOT NULL,
    sponsor_link character varying(127) NOT NULL
);


ALTER TABLE sponsors OWNER TO edwinbadillo;

--
-- Name: station; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE station (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    station_number integer NOT NULL,
    station_in_use boolean DEFAULT false NOT NULL
);


ALTER TABLE station OWNER TO edwinbadillo;

--
-- Name: stream; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE stream (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    station_number integer NOT NULL,
    stream_link character varying(127) NOT NULL
);


ALTER TABLE stream OWNER TO edwinbadillo;

--
-- Name: submits; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE submits (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_is_winner boolean DEFAULT true NOT NULL,
    match_number integer NOT NULL,
    set_seq integer NOT NULL,
    competitor_number integer NOT NULL,
    score integer NOT NULL
);


ALTER TABLE submits OWNER TO edwinbadillo;

--
-- Name: subscribed_to; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE subscribed_to (
    subscriber character varying(127) NOT NULL,
    interest character varying(127) NOT NULL
);


ALTER TABLE subscribed_to OWNER TO edwinbadillo;

--
-- Name: team; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE team (
    team_name character varying(127) NOT NULL,
    team_logo character varying(127) NOT NULL,
    team_bio character varying(255) NOT NULL,
    team_cover_photo character varying(127),
    team_active boolean DEFAULT true NOT NULL
);


ALTER TABLE team OWNER TO edwinbadillo;

--
-- Name: to_play; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE to_play (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    meetup_location character varying(127) NOT NULL,
    meetup_start_date timestamp without time zone NOT NULL,
    game_name character varying(127) NOT NULL
);


ALTER TABLE to_play OWNER TO edwinbadillo;

--
-- Name: tournament; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE tournament (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    game_name character varying(127) NOT NULL,
    tournament_rules character varying(127) NOT NULL,
    is_team_based boolean NOT NULL,
    tournament_start_date timestamp without time zone NOT NULL,
    tournament_check_in_deadline timestamp without time zone NOT NULL,
    competitor_fee numeric(10,2),
    tournament_max_capacity integer,
    seed_money numeric(10,2),
    tournament_type character varying(32) NOT NULL,
    tournament_format character varying(32) NOT NULL,
    score_type character varying(32) NOT NULL,
    number_of_people_per_group integer DEFAULT 0 NOT NULL,
    amount_of_winners_per_group integer DEFAULT 0 NOT NULL,
    tournament_active boolean DEFAULT true
);


ALTER TABLE tournament OWNER TO edwinbadillo;

--
-- Data for Name: belongs_to; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY belongs_to (organization_name, customer_username) FROM stdin;
NeptunoLabs	ollidab
\.


--
-- Data for Name: capacity_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY capacity_for (event_name, event_start_date, event_location, tournament_name, station_number) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	5
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	4
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	3
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	2
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	1
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	1
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	3
\.


--
-- Data for Name: captain_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY captain_for (customer_username, team_name) FROM stdin;
ollidab	NeptunoLabs
ollidab	Test_Team
\.


--
-- Data for Name: competes; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY competes (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, competitor_number) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	t	1	4
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	t	1	5
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	1	1
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	2	2
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	2	3
\.


--
-- Data for Name: competes_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY competes_for (event_name, event_start_date, event_location, tournament_name, competitor_number, team_name) FROM stdin;
\.


--
-- Data for Name: competitor; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY competitor (event_name, event_start_date, event_location, tournament_name, competitor_number, competitor_standing, competitor_seed, matches_won, matches_lost, competitor_has_forfeited, competitor_check_in, competitor_paid) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	3	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	4	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	5	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	1	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	2	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	3	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	4	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	5	\N	0	0	0	f	f	f
\.


--
-- Data for Name: competitor_goes_to; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY competitor_goes_to (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_is_winner, past_match, future_round_number, future_round_is_winner, future_match, is_winner) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	t	1	2	t	1	t
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	1	3	t	1	t
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	2	3	t	1	t
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY customer (customer_username, customer_first_name, customer_last_name, customer_tag, customer_password, customer_salt, customer_paypal_info, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_active) FROM stdin;
ollidab	Edwin	Badillo	ollidab	elbigotedealexis	somesalt	edwin.o.badillo@gmail.com	http://neptunolabs.com/images/badillo.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Edwin, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t
papaluisre	Luis	de la Vega	papaluisre	elbigotedealexis	somesalt	luisr.delavega@gmail.com	http://neptunolabs.com/images/luis.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Luis, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t
jems9102	Juan	Miranda	jems9102	elbigotedealexis	somesalt	j.miranda0291@gmail.com	http://neptunolabs.com/images/juan.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Juan, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t
samdlt	Sam	de la Torre	samdlt	elbigotedealexis	somesalt	network.samdlt@gmail.com	http://neptunolabs.com/images/sam.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Sam, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t
rapol	Rafael	Pol	rapol	elbigotedealexis	somesalt	rapol32@gmail.com	http://neptunolabs.com/images/rafa.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Rafael, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY event (event_name, event_start_date, event_location, customer_username, event_venue, event_banner, event_logo, event_max_capacity, event_end_date, event_registration_deadline, event_rules, event_description, event_active, event_deduction_fee, event_is_online, event_type) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	ollidab	S-113	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	1024	2015-10-22 22:00:00	2015-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	First Test event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	ollidab	Student Center 3rd Floor	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	1024	2015-03-27 22:00:00	2015-03-23 09:00:00	These would be the rules for a test event.	Event 01 event to make sure the SQL queries for the tournament bracket and groups are working correctly	t	2.00	f	Local
Event 02	2015-05-05 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	rapol	Colosseum	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	32	2015-05-07 22:00:00	2015-04-23 09:00:00	These would be the rules for a test event.	Event 02 event to make sure the SQL queries and server integration work	t	2.00	f	Local
Event 03	2015-03-27 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	rapol	Colosseum	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	32	2015-05-27 09:00:00	2015-03-25 09:00:00	These would be the rules for a test event.	Event 02 event to make sure the SQL queries and server integration work	t	2.00	f	Local
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY game (game_name, game_image) FROM stdin;
Super Smash Bros. Melee	http://neptunolabs.com/images/Super_Smash_Bros_Melee_box_art.png
Mortal Kombat X	http://neptunolabs.com/images/MKX.png
Ultra Street Fighter IV	http://neptunolabs.com/images/USF4.jpg
\.


--
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY genre (genre_name, genre_image) FROM stdin;
Fighting	http://neptunolabs.com/images/fighting.png
\.


--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY "group" (event_name, event_start_date, event_location, tournament_name, competitor_number, group_number) FROM stdin;
\.


--
-- Data for Name: group_stage; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY group_stage (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, competitor_number, group_number, group_placing) FROM stdin;
\.


--
-- Data for Name: hosts; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY hosts (event_name, event_start_date, event_location, organization_name) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	NeptunoLabs
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	NeptunoLabs
\.


--
-- Data for Name: is_a; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_a (event_name, event_start_date, event_location, tournament_name, competitor_number, customer_username) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	papaluisre
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	rapol
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	3	samdlt
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	4	jems9102
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	5	ollidab
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	1	papaluisre
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	2	rapol
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	3	samdlt
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	4	jems9102
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	5	ollidab
\.


--
-- Data for Name: is_of; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_of (game_name, genre_name) FROM stdin;
Super Smash Bros. Melee	Fighting
Mortal Kombat X	Fighting
Ultra Street Fighter IV	Fighting
\.


--
-- Data for Name: is_played_in; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, station_number) FROM stdin;
\.


--
-- Data for Name: match; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY match (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, is_favourite, match_completed) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	t	1	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	1	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	2	f	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	3	t	1	f	f
\.


--
-- Data for Name: meetup; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY meetup (event_name, event_start_date, event_location, meetup_location, meetup_name, meetup_start_date, meetup_end_date, meetup_description, customer_username) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Room 301, Mayaguez Resort and Casino, Mayagüez, Puerto Rico	Puertoricans Party	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournament tomorrow hosted by the Puertorican Team	ollidab
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY news (event_name, event_start_date, event_location, news_number, news_title, news_content, news_date_posted) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	1	Test News 01	So this is a news article. So I think I am gonna go ahead and do that.	2015-03-26 09:00:00
\.


--
-- Data for Name: of_email; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY of_email (customer_username, email_address) FROM stdin;
ollidab	edwin.o.badillo@gmail.com
papaluisre	luisr.delavega@gmail.com
jems9102	j.miranda0291@gmail.com
samdlt	network.samdlt@gmail.com
rapol	rapol32@gmail.com
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY organization (organization_name, organization_logo, organization_bio, organization_cover_photo, organization_active) FROM stdin;
NeptunoLabs	http://neptunolabs.com/images/matchup-logo.png	This is the organization that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
\.


--
-- Data for Name: owns; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY owns (organization_name, customer_username) FROM stdin;
NeptunoLabs	ollidab
\.


--
-- Data for Name: pays; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY pays (event_name, event_start_date, event_location, spec_fee_name, customer_username, check_in) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	ollidab	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	papaluisre	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	jems9102	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	samdlt	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	rapol	f
\.


--
-- Data for Name: plays_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY plays_for (customer_username, team_name) FROM stdin;
ollidab	NeptunoLabs
ollidab	Test_Team
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY report (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq, report_number, report_description, report_image, report_date, report_type) FROM stdin;
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY request (request_organization_name, customer_username, request_description, request_status) FROM stdin;
Test Request Organization	ollidab	A test organization request, this may or not be accepted	Received
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY review (event_name, event_start_date, event_location, customer_username, review_number, review_title, review_content, star_rating, review_date_created) FROM stdin;
\.


--
-- Data for Name: round; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY round (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, round_start_date, round_pause, round_completed, round_best_of) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	t	2015-03-25 11:00:00	f	f	3
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	2015-03-25 11:00:00	f	f	3
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	3	t	2015-03-25 11:00:00	f	f	3
\.


--
-- Data for Name: set; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY set (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq, set_completed) FROM stdin;
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	1	t	1	1	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	1	1	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	2	t	2	1	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	3	t	1	1	f
\.


--
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY shows (event_name, event_start_date, event_location, sponsor_name) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	E-Sports PR
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	E-Sports PR
\.


--
-- Data for Name: spectator_fee; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY spectator_fee (event_name, event_start_date, event_location, spec_fee_name, spec_fee_amount, spec_fee_description) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3-day Pass	25.00	General Admission to the first three days.
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	2-day Pass	18.00	General Admission to the first two days. Note: Does not Include Final Round
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Opening Day Pass	10.00	General Admission to the first day.
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Finals Day Pass	10.00	General Admission to the last day of the event where the final rounds will be held.
\.


--
-- Data for Name: sponsors; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY sponsors (sponsor_name, sponsor_logo, sponsor_link) FROM stdin;
E-Sports PR	http://esportspr.com/wp-content/uploads/2014/05/Esports-banner-2-tight-300x60.png	http://esportspr.com/
\.


--
-- Data for Name: station; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY station (event_name, event_start_date, event_location, station_number, station_in_use) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	5	f
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	4	f
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3	f
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	2	f
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	1	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	1	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	2	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	3	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	4	f
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	5	f
\.


--
-- Data for Name: stream; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY stream (event_name, event_start_date, event_location, station_number, stream_link) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	2	http://www.twitch.tv/ollidab
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	4	http://www.twitch.tv/forsen
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	1	http://www.twitch.tv/ollidab
\.


--
-- Data for Name: submits; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY submits (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq, competitor_number, score) FROM stdin;
\.


--
-- Data for Name: subscribed_to; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY subscribed_to (subscriber, interest) FROM stdin;
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY team (team_name, team_logo, team_bio, team_cover_photo, team_active) FROM stdin;
NeptunoLabs	http://neptunolabs.com/images/matchup-logo.png	This is a team that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test_Team	http://neptunolabs.com/images/matchup-logo.png	This is a team that brought you this application!	http://neptunolabs.com/images/logoPlain.png	f
\.


--
-- Data for Name: to_play; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY to_play (event_name, event_start_date, event_location, meetup_location, meetup_start_date, game_name) FROM stdin;
\.


--
-- Data for Name: tournament; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, tournament_active) FROM stdin;
First Test	2015-10-19 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	f	2015-10-19 11:00:00	2015-10-19 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Ultra Street Fighter IV Qualifiers	Ultra Street Fighter IV	Rules of the rules with rules comprised of rules	f	2015-03-25 11:00:00	2015-03-25 10:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Mortal Kombat X Qualifiers	Mortal Kombat X	Rules of the rules with rules comprised of rules	f	2015-03-25 11:00:00	2015-03-25 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	0	0	t
Event 01	2015-03-25 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Super Smash Bros. Melee Qualifiers	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	f	2015-06-05 11:00:00	2015-06-05 10:00:00	10.00	32	100.00	Two Stage	Double Elimination	Match	4	2	t
Event 02	2015-05-05 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	Smash Bros. Melee Weekly	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	f	2015-05-05 11:00:00	2015-05-05 10:00:00	10.00	32	100.00	Two Stage	Double Elimination	Match	4	2	t
Event 03	2015-03-27 09:00:00	University of Puerto Rico at Mayagüez, Mayaguez, PR 00681-9042	USF4 Money Match	Ultra Street Fighter IV	Rules of the rules with rules comprised of rules	f	2015-03-27 09:00:00	2015-03-17 09:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t
\.


--
-- Name: PK_belongs_to; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "PK_belongs_to" PRIMARY KEY (organization_name, customer_username);


--
-- Name: PK_capacity_for; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "PK_capacity_for" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, station_number);


--
-- Name: PK_captain_for; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "PK_captain_for" PRIMARY KEY (team_name, customer_username);


--
-- Name: PK_competes; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "PK_competes" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, competitor_number);


--
-- Name: PK_competes_for; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "PK_competes_for" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, team_name);


--
-- Name: PK_competitor; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT "PK_competitor" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: PK_competitor_goes_to; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "PK_competitor_goes_to" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_is_winner, past_match, future_round_number, future_round_is_winner, future_match, is_winner);


--
-- Name: PK_customer; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT "PK_customer" PRIMARY KEY (customer_username);


--
-- Name: PK_event; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY event
    ADD CONSTRAINT "PK_event" PRIMARY KEY (event_name, event_start_date, event_location);


--
-- Name: PK_game; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY game
    ADD CONSTRAINT "PK_game" PRIMARY KEY (game_name);


--
-- Name: PK_genre; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY genre
    ADD CONSTRAINT "PK_genre" PRIMARY KEY (genre_name);


--
-- Name: PK_group; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY "group"
    ADD CONSTRAINT "PK_group" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, group_number);


--
-- Name: PK_group_stage; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY group_stage
    ADD CONSTRAINT "PK_group_stage" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, group_number, group_placing);


--
-- Name: PK_hosts_id; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "PK_hosts_id" PRIMARY KEY (event_name, event_start_date, event_location, organization_name);


--
-- Name: PK_is_a; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY is_a
    ADD CONSTRAINT "PK_is_a" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, customer_username);


--
-- Name: PK_is_of; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "PK_is_of" PRIMARY KEY (game_name, genre_name);


--
-- Name: PK_is_played_in; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "PK_is_played_in" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, station_number);


--
-- Name: PK_match; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY match
    ADD CONSTRAINT "PK_match" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: PK_meetup; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "PK_meetup" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date);


--
-- Name: PK_news; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY news
    ADD CONSTRAINT "PK_news" PRIMARY KEY (event_name, event_start_date, event_location, news_number);


--
-- Name: PK_of_email; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY of_email
    ADD CONSTRAINT "PK_of_email" PRIMARY KEY (customer_username, email_address);


--
-- Name: PK_organization; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY organization
    ADD CONSTRAINT "PK_organization" PRIMARY KEY (organization_name);


--
-- Name: PK_owns; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "PK_owns" PRIMARY KEY (organization_name, customer_username);


--
-- Name: PK_pays; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "PK_pays" PRIMARY KEY (event_name, event_start_date, event_location, spec_fee_name, customer_username);


--
-- Name: PK_plays_for; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "PK_plays_for" PRIMARY KEY (team_name, customer_username);


--
-- Name: PK_report; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY report
    ADD CONSTRAINT "PK_report" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq, report_number);


--
-- Name: PK_request; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY request
    ADD CONSTRAINT "PK_request" PRIMARY KEY (request_organization_name, customer_username);


--
-- Name: PK_review_id; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "PK_review_id" PRIMARY KEY (event_name, event_start_date, event_location, review_number, customer_username);


--
-- Name: PK_round; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY round
    ADD CONSTRAINT "PK_round" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner);


--
-- Name: PK_set; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY set
    ADD CONSTRAINT "PK_set" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq);


--
-- Name: PK_shows; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "PK_shows" PRIMARY KEY (event_name, event_start_date, event_location, sponsor_name);


--
-- Name: PK_spec_fee; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY spectator_fee
    ADD CONSTRAINT "PK_spec_fee" PRIMARY KEY (event_name, event_start_date, event_location, spec_fee_name);


--
-- Name: PK_sponsor; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY sponsors
    ADD CONSTRAINT "PK_sponsor" PRIMARY KEY (sponsor_name);


--
-- Name: PK_station; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY station
    ADD CONSTRAINT "PK_station" PRIMARY KEY (event_name, event_start_date, event_location, station_number);


--
-- Name: PK_stream; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY stream
    ADD CONSTRAINT "PK_stream" PRIMARY KEY (event_name, event_start_date, event_location, station_number, stream_link);


--
-- Name: PK_submits; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "PK_submits" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq);


--
-- Name: PK_subscribed_to; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "PK_subscribed_to" PRIMARY KEY (subscriber, interest);


--
-- Name: PK_team; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY team
    ADD CONSTRAINT "PK_team" PRIMARY KEY (team_name);


--
-- Name: PK_to_play; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "PK_to_play" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date, game_name);


--
-- Name: PK_tournament_id; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "PK_tournament_id" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name);


--
-- Name: FK_belongs_to_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "FK_belongs_to_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_belongs_to_organization; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "FK_belongs_to_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name);


--
-- Name: FK_capacity_for_station; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "FK_capacity_for_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number);


--
-- Name: FK_capacity_for_tournament; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "FK_capacity_for_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name);


--
-- Name: FK_captain_for_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "FK_captain_for_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_captain_for_team; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "FK_captain_for_team" FOREIGN KEY (team_name) REFERENCES team(team_name);


--
-- Name: FK_competes_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "FK_competes_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: FK_competes_for_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "FK_competes_for_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: FK_competes_for_team; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "FK_competes_for_team" FOREIGN KEY (team_name) REFERENCES team(team_name);


--
-- Name: FK_competes_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "FK_competes_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: FK_competitor_goes_to_future_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "FK_competitor_goes_to_future_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, future_round_number, future_round_is_winner, future_match) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: FK_competitor_goes_to_past_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "FK_competitor_goes_to_past_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_is_winner, past_match) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: FK_competitor_tournament; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT "FK_competitor_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name);


--
-- Name: FK_event_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY event
    ADD CONSTRAINT "FK_event_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_group_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY "group"
    ADD CONSTRAINT "FK_group_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: FK_group_stage_group; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY group_stage
    ADD CONSTRAINT "FK_group_stage_group" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, group_number) REFERENCES "group"(event_name, event_start_date, event_location, tournament_name, competitor_number, group_number);


--
-- Name: FK_group_stage_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY group_stage
    ADD CONSTRAINT "FK_group_stage_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: FK_hosts_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "FK_hosts_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_hosts_organization; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "FK_hosts_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name);


--
-- Name: FK_is_a_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_a
    ADD CONSTRAINT "FK_is_a_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: FK_is_a_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_a
    ADD CONSTRAINT "FK_is_a_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_is_of_game; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "FK_is_of_game" FOREIGN KEY (game_name) REFERENCES game(game_name);


--
-- Name: FK_is_of_genre; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "FK_is_of_genre" FOREIGN KEY (genre_name) REFERENCES genre(genre_name);


--
-- Name: FK_is_played_in_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "FK_is_played_in_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: FK_is_played_in_station; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "FK_is_played_in_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number);


--
-- Name: FK_match_round; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY match
    ADD CONSTRAINT "FK_match_round" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner) REFERENCES round(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner);


--
-- Name: FK_meetup_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "FK_meetup_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_meetup_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "FK_meetup_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_news_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY news
    ADD CONSTRAINT "FK_news_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_of_email_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY of_email
    ADD CONSTRAINT "FK_of_email_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_owns_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "FK_owns_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_owns_organization; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "FK_owns_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name);


--
-- Name: FK_pays_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "FK_pays_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_pays_spectator_fee; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "FK_pays_spectator_fee" FOREIGN KEY (event_name, event_start_date, event_location, spec_fee_name) REFERENCES spectator_fee(event_name, event_start_date, event_location, spec_fee_name);


--
-- Name: FK_plays_for_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "FK_plays_for_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_plays_for_team_name; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "FK_plays_for_team_name" FOREIGN KEY (team_name) REFERENCES team(team_name);


--
-- Name: FK_report_set; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY report
    ADD CONSTRAINT "FK_report_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq) REFERENCES set(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq);


--
-- Name: FK_request_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY request
    ADD CONSTRAINT "FK_request_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_review_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "FK_review_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username);


--
-- Name: FK_review_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "FK_review_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_round_tournament; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY round
    ADD CONSTRAINT "FK_round_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name);


--
-- Name: FK_set_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY set
    ADD CONSTRAINT "FK_set_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number);


--
-- Name: FK_shows_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "FK_shows_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_shows_sponsor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "FK_shows_sponsor" FOREIGN KEY (sponsor_name) REFERENCES sponsors(sponsor_name);


--
-- Name: FK_spectator_fee_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY spectator_fee
    ADD CONSTRAINT "FK_spectator_fee_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_station_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY station
    ADD CONSTRAINT "FK_station_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_stream_station; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY stream
    ADD CONSTRAINT "FK_stream_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number);


--
-- Name: FK_submits_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "FK_submits_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: FK_submits_set; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "FK_submits_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq) REFERENCES set(event_name, event_start_date, event_location, tournament_name, round_number, round_is_winner, match_number, set_seq);


--
-- Name: FK_subscribed_to_customer_interest; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "FK_subscribed_to_customer_interest" FOREIGN KEY (interest) REFERENCES customer(customer_username);


--
-- Name: FK_subscribed_to_customer_subscriber; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "FK_subscribed_to_customer_subscriber" FOREIGN KEY (subscriber) REFERENCES customer(customer_username);


--
-- Name: FK_to_play_game; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "FK_to_play_game" FOREIGN KEY (game_name) REFERENCES game(game_name);


--
-- Name: FK_to_play_meetup; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "FK_to_play_meetup" FOREIGN KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date) REFERENCES meetup(event_name, event_start_date, event_location, meetup_location, meetup_start_date);


--
-- Name: FK_tournament_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location);


--
-- Name: FK_tournament_game; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_game" FOREIGN KEY (game_name) REFERENCES game(game_name);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

