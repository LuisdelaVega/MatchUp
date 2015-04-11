--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
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


ALTER TABLE public.belongs_to OWNER TO edwinbadillo;

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


ALTER TABLE public.capacity_for OWNER TO edwinbadillo;

--
-- Name: captain_for; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE captain_for (
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE public.captain_for OWNER TO edwinbadillo;

--
-- Name: competes; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE competes (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    competitor_number integer NOT NULL
);


ALTER TABLE public.competes OWNER TO edwinbadillo;

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


ALTER TABLE public.competes_for OWNER TO edwinbadillo;

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


ALTER TABLE public.competitor OWNER TO edwinbadillo;

--
-- Name: competitor_goes_to; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE competitor_goes_to (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    past_round_number integer NOT NULL,
    past_round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    past_match integer NOT NULL,
    future_round_number integer NOT NULL,
    future_round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    future_match integer NOT NULL,
    is_winner boolean NOT NULL
);


ALTER TABLE public.competitor_goes_to OWNER TO edwinbadillo;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE customer (
    customer_username character varying(127) NOT NULL,
    customer_first_name character varying(127) NOT NULL,
    customer_last_name character varying(127) NOT NULL,
    customer_tag character varying(127) NOT NULL,
    customer_password character varying(255) NOT NULL,
    customer_salt character varying(255) NOT NULL,
    customer_paypal_info character varying(127),
    customer_profile_pic character varying(127),
    customer_cover_photo character varying(127),
    customer_bio character varying(255),
    customer_country character varying(32),
    customer_active boolean DEFAULT true NOT NULL,
    customer_email character varying(127) NOT NULL
);


ALTER TABLE public.customer OWNER TO edwinbadillo;

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
    event_end_date timestamp without time zone,
    event_registration_deadline timestamp without time zone,
    event_rules character varying(255),
    event_description character varying(255),
    event_active boolean DEFAULT true NOT NULL,
    event_deduction_fee numeric(10,2),
    event_is_online boolean,
    event_type character varying(31)
);


ALTER TABLE public.event OWNER TO edwinbadillo;

--
-- Name: game; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE game (
    game_name character varying(127) NOT NULL,
    game_image character varying(127) NOT NULL
);


ALTER TABLE public.game OWNER TO edwinbadillo;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE genre (
    genre_name character varying(127) NOT NULL,
    genre_image character varying(127) NOT NULL
);


ALTER TABLE public.genre OWNER TO edwinbadillo;

--
-- Name: group; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE "group" (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    group_number integer NOT NULL
);


ALTER TABLE public."group" OWNER TO edwinbadillo;

--
-- Name: has_a; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE has_a (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    group_number integer NOT NULL
);


ALTER TABLE public.has_a OWNER TO edwinbadillo;

--
-- Name: hosts; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE hosts (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    organization_name character varying(127) NOT NULL
);


ALTER TABLE public.hosts OWNER TO edwinbadillo;

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


ALTER TABLE public.is_a OWNER TO edwinbadillo;

--
-- Name: is_confirmed; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE is_confirmed (
    sponsor_name character varying(127) NOT NULL,
    sponsor_link character varying(127) NOT NULL,
    organization_name character varying(127) NOT NULL
);


ALTER TABLE public.is_confirmed OWNER TO postgres;

--
-- Name: is_in; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE is_in (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    group_number integer NOT NULL
);


ALTER TABLE public.is_in OWNER TO postgres;

--
-- Name: is_of; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE is_of (
    game_name character varying(127) NOT NULL,
    genre_name character varying(127) NOT NULL
);


ALTER TABLE public.is_of OWNER TO edwinbadillo;

--
-- Name: is_played_in; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE is_played_in (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    station_number integer NOT NULL
);


ALTER TABLE public.is_played_in OWNER TO edwinbadillo;

--
-- Name: is_set; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE is_set (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    set_seq integer NOT NULL,
    set_completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.is_set OWNER TO edwinbadillo;

--
-- Name: match; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE match (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    is_favourite boolean DEFAULT false NOT NULL,
    match_completed boolean DEFAULT false NOT NULL
);


ALTER TABLE public.match OWNER TO edwinbadillo;

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


ALTER TABLE public.meetup OWNER TO edwinbadillo;

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


ALTER TABLE public.news OWNER TO edwinbadillo;

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


ALTER TABLE public.organization OWNER TO edwinbadillo;

--
-- Name: owns; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE owns (
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE public.owns OWNER TO edwinbadillo;

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


ALTER TABLE public.pays OWNER TO edwinbadillo;

--
-- Name: plays_for; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE plays_for (
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE public.plays_for OWNER TO edwinbadillo;

--
-- Name: report; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE report (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    set_seq integer NOT NULL,
    report_number integer NOT NULL,
    report_description character varying(255) NOT NULL,
    report_image character varying(127) NOT NULL,
    report_date timestamp without time zone,
    report_type character varying(127) NOT NULL
);


ALTER TABLE public.report OWNER TO edwinbadillo;

--
-- Name: request; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE request (
    request_organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    request_description character varying(255),
    request_status character varying(32) DEFAULT 'Received'::character varying NOT NULL
);


ALTER TABLE public.request OWNER TO edwinbadillo;

--
-- Name: request_sponsor; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE request_sponsor (
    request_sponsor_link character varying(127) NOT NULL,
    request_sponsor_description character varying(255),
    organization_name character varying(127) NOT NULL,
    request_sponsor_status character varying(32) DEFAULT 'Received'::character varying NOT NULL
);


ALTER TABLE public.request_sponsor OWNER TO postgres;

--
-- Name: review; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE review (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    review_title character varying(127) NOT NULL,
    review_content character varying(255) NOT NULL,
    star_rating integer NOT NULL,
    review_date_created timestamp without time zone NOT NULL
);


ALTER TABLE public.review OWNER TO edwinbadillo;

--
-- Name: round; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE round (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    round_start_date timestamp without time zone NOT NULL,
    round_pause boolean DEFAULT false NOT NULL,
    round_completed boolean DEFAULT false NOT NULL,
    round_best_of integer
);


ALTER TABLE public.round OWNER TO edwinbadillo;

--
-- Name: shows; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE shows (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    sponsor_name character varying(127) NOT NULL
);


ALTER TABLE public.shows OWNER TO edwinbadillo;

--
-- Name: spectator_fee; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE spectator_fee (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    spec_fee_name character varying(127) NOT NULL,
    spec_fee_amount numeric(10,2) NOT NULL,
    spec_fee_description character varying(255),
    spec_fee_amount_available integer DEFAULT 1
);


ALTER TABLE public.spectator_fee OWNER TO edwinbadillo;

--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE sponsors (
    sponsor_name character varying(127) NOT NULL,
    sponsor_logo character varying(127) NOT NULL,
    sponsor_link character varying(127) NOT NULL
);


ALTER TABLE public.sponsors OWNER TO edwinbadillo;

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


ALTER TABLE public.station OWNER TO edwinbadillo;

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


ALTER TABLE public.stream OWNER TO edwinbadillo;

--
-- Name: submits; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE submits (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    round_number integer NOT NULL,
    round_of character varying(31) DEFAULT 'Winner'::character varying NOT NULL,
    match_number integer NOT NULL,
    set_seq integer NOT NULL,
    competitor_number integer NOT NULL,
    score integer NOT NULL
);


ALTER TABLE public.submits OWNER TO edwinbadillo;

--
-- Name: subscribed_to; Type: TABLE; Schema: public; Owner: edwinbadillo; Tablespace: 
--

CREATE TABLE subscribed_to (
    subscriber character varying(127) NOT NULL,
    interest character varying(127) NOT NULL
);


ALTER TABLE public.subscribed_to OWNER TO edwinbadillo;

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


ALTER TABLE public.team OWNER TO edwinbadillo;

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


ALTER TABLE public.to_play OWNER TO edwinbadillo;

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


ALTER TABLE public.tournament OWNER TO edwinbadillo;

--
-- Data for Name: belongs_to; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY belongs_to (organization_name, customer_username) FROM stdin;
NeptunoLabs	ollidab
Test Org papaluisre	papaluisre
Test Org ollidab	ollidab
NeptunoLabs	rapol
Test Org 01	test01
Test Org 02	test02
Test Org 03	test03
Test Org 01	test02
Test Org 02	test04
Test Org 03	test07
Test Org 01	test03
\.


--
-- Data for Name: capacity_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY capacity_for (event_name, event_start_date, event_location, tournament_name, station_number) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	5
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 01	1
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 01	2
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 02	3
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 02	4
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 03	5
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 03	6
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2
\.


--
-- Data for Name: captain_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY captain_for (customer_username, team_name) FROM stdin;
ollidab	NeptunoLabs
ollidab	Test_Team
test01	test team 01
test04	test team 04
test06	test team 06
test07	test team 07
test10	test team 10
\.


--
-- Data for Name: competes; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY competes (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	4
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	5
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	5
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	1	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2	4
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2	5
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	1	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	1	3
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	2	5
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	2	6
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	1	3
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2	6
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2	4
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	1	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	1	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2	4
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2	5
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	1	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	1	3
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	2	5
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	2	6
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	1	3
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	1	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2	6
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2	4
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	1	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	1	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2	4
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2	5
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	1	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	1	3
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	2	5
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	2	6
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	1	3
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	1	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2	6
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2	4
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
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	4	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	5	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	5	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	\N	0	0	0	f	f	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	5	\N	0	0	0	f	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	\N	0	0	0	f	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	\N	0	0	0	f	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	\N	0	0	0	f	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	\N	0	0	0	f	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	5	\N	0	0	0	f	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	6	\N	0	0	0	f	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	\N	0	0	0	f	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	\N	0	0	0	f	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	\N	0	0	0	f	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	4	\N	0	0	0	f	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	5	\N	0	0	0	f	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	6	\N	0	0	0	f	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	\N	0	0	0	f	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	\N	0	0	0	f	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	\N	0	0	0	f	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	4	\N	0	0	0	f	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	5	\N	0	0	0	f	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	6	\N	0	0	0	f	f	f
\.


--
-- Data for Name: competitor_goes_to; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY competitor_goes_to (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_of, past_match, future_round_number, future_round_of, future_match, is_winner) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	3	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3	Winner	1	t
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	1	4	Winner	1	t
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2	4	Winner	1	t
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	1	4	Winner	1	t
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2	4	Winner	1	t
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	1	4	Winner	1	t
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2	4	Winner	1	t
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY customer (customer_username, customer_first_name, customer_last_name, customer_tag, customer_password, customer_salt, customer_paypal_info, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_active, customer_email) FROM stdin;
ollidab	Edwin	Badillo	ollidab	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	edwin.o.badillo@gmail.com	http://neptunolabs.com/images/badillo.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Edwin, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	edwin.o.badillo@gmail.com
rapol	Rafael	Pol	rapol	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	rapol32@gmail.com	http://neptunolabs.com/images/rafa.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Rafael, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	rapol32@gmail.com
samdlt	Sam	de la Torre	samdlt	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	network.samdlt@gmail.com	http://neptunolabs.com/images/sam.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Sam, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	network.samdlt@gmail.com
test01	Fletcher	Brook	fbrook	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test01@neptunolabs.com	http://i.imgur.com/pSTPtbA.png	http://i.imgur.com/JK3C7Re.png	Description 01 hello dog monkey	United States	t	test01@neptunolabs.com
test02	Andre	York	york	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test02@neptunolabs.com	http://i.imgur.com/RTalBtW.png	http://i.imgur.com/I0kBfi1.png	Description 02 mad scientist hearthstone	United States	t	test02@neptunolabs.com
test03	Stacie	Fawn	fawn	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test03@neptunolabs.com	http://i.imgur.com/0Gl8WWF.png	http://i.imgur.com/pLdYiwr.png	Description 03 we are the world	Mexico	t	test03@neptunolabs.com
test04	Madlyn	Pris	pris	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test04@neptunolabs.com	http://i.imgur.com/ptNakXV.png	http://i.imgur.com/vrMHPer.png	Description 04 pool states, computer	Brazil	t	test04@neptunolabs.com
test05	Vicky	Lale	lale	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test05@neptunolabs.com	http://i.imgur.com/rQvLZSZ.png	http://i.imgur.com/X0RFakM.png	Description 05 mouse cellphone glasses	Mexico	t	test05@neptunolabs.com
papaluisre	Luis	de la Vega	FZN.PaPa	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	luisr.delavega@gmail.com	http://neptunolabs.com/images/luis.jpg	http://neptunolabs.com/images/cover.jpg	Hi, I am Luis, one of the creators of Match up.	Puerto Rico	t	luisr.delavega@gmail.com
jems9102	Juan	Miranda	jems9102	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	j.miranda0291@gmail.com	http://neptunolabs.com/images/juan.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Juan, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	j.miranda0291@gmail.com
test06	Kimberley	Honora	honora	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test06@neptunolabs.com	http://i.imgur.com/pSTPtbA.png	http://i.imgur.com/JK3C7Re.png	Description 01 hello dog monkey	United States	t	test06@neptunolabs.com
test07	Hellen	Emerson	emerson	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test07@neptunolabs.com	http://i.imgur.com/RTalBtW.png	http://i.imgur.com/I0kBfi1.png	Description 02 mad scientist hearthstone	United States	t	test07@neptunolabs.com
test08	Bentley	Patterson	patterson	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test08@neptunolabs.com	http://i.imgur.com/0Gl8WWF.png	http://i.imgur.com/pLdYiwr.png	Description 03 we are the world	Mexico	t	test08@neptunolabs.com
test09	Callahan	Jamison	jamison	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test09@neptunolabs.com	http://i.imgur.com/ptNakXV.png	http://i.imgur.com/vrMHPer.png	Description 04 pool states, computer	Brazil	t	test09@neptunolabs.com
test10	Jolyon	Sempers	sempers	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test10@neptunolabs.com	http://i.imgur.com/rQvLZSZ.png	http://i.imgur.com/X0RFakM.png	Description 05 mouse cellphone glasses	Mexico	t	test10@neptunolabs.com
test11	Eduard	Wilson	wilson	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test11@neptunolabs.com	http://i.imgur.com/pSTPtbA.png	http://i.imgur.com/JK3C7Re.png	Description 11 hello dog monkey	United States	t	test11@neptunolabs.com
hello	Hello	World	helloworld	ed685be09dfe9e81ade076d12710a9d60b1141526beeaa31a22c940690623d64d05a304bc651ac6e9b304f17003a5dc47bd130667356bf4b19fc69aed7dc4ee3debc0fac837d49a200472ced36a473ffaf80f75025e71258b61a71e054bb3480879c899769595832047ffd9fb0aae274fcbba87259f9e3a2d98c45b384f8e5	K7KQqHGmYUmkDN7JT18s0F9m/xRK0O1x8APPIoUeCCqB3IO+iY5RYOvTSPDQZglrZF6mp1Fpda/oyAviyumo2A8z6Vw1IJnpWG0U4VJtUJEq9f8IHEbhutrNqTI0XHnIczMwK75S+puAPIh82AhJ7uqlT/vW5OXC0PzuibOZYrsrFXwM9BSGopwg9VVpkqb9pDGekTg9K0KcvkkLko5wOXV4Xbxaday16QWVNbIQ8lfaMAgQfsl4v9t7Qvwy	\N	\N	\N	\N	\N	t	hello@gmail.com
cakeusername	first	last	cake	fdf0067e9a8acf719c4dbb0dfa9a880a98f5ddba724cfe97698eea6570c8eb918c54baa8155e2a102303eda1c13e30dab98c8985ebf19eb6af20fb4f4360ff0e6e93f707d7ab2e98f5b2d43c495f4e8a2f1c873c01c8fdb7b62ccba5199c5c93a3382f0674ee820e333764fa57470175744f1bcc99a2df1fe761df5d0ffaad	BVJ+akftNkTkcfJq3oT5KA50uoprbPrUgJIEdHbb7xeclsk63y6TSE0ZZprT0wVKfr/seMVGh5F0z/VTExxp9vz3U5y1Q5Akrkuk36hIsarI8fuHsx5dUhzHbxjoyI7eyYKROSexIECu+GbLlKAM7sS6jqRgpUwuIktJ39vTastrLYXoobn0JYVI61yuHcrRcFR3devfcEKgryJkjfDDiqrvdDL84kHfzFrtfPk8SykIlkxTSYY2yHI/GhXQ	\N	\N	\N	\N	\N	t	cake@yo.com
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY event (event_name, event_start_date, event_location, customer_username, event_venue, event_banner, event_logo, event_end_date, event_registration_deadline, event_rules, event_description, event_active, event_deduction_fee, event_is_online, event_type) FROM stdin;
Event 02	2015-05-05 09:00:00	miradero	rapol	Colosseum	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-05-07 22:00:00	2015-04-23 09:00:00	These would be the rules for a test event.	Event 02 event to make sure the SQL queries and server integration work	t	2.00	f	Local
Event 01	2015-03-25 09:00:00	miradero	ollidab	Student Center 3rd Floor	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-03-27 22:00:00	2015-03-23 09:00:00	These would be the rules for a test event.	Event 01 event to make sure the SQL queries for the tournament bracket and groups are working correctly	t	2.00	f	Local
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	Bosque 51	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2025-10-22 22:00:00	2025-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	4th Event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Event 05	2025-11-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test02	Brisas del Bosque	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2025-11-22 22:00:00	2025-11-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	4th Event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	rapol	Hilton Activity Room	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-11-20 09:00:00	2015-12-04 09:00:00	Some rules for testing stuff	Event 07 Just testing Round Robin	t	2.00	f	Local
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	test02	Activity Room	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-11-20 09:00:00	2015-11-05 09:00:00	Some rules for testing stuff	Event 09 Just filling	t	2.00	f	Local
Event 03	2015-03-27 09:00:00	miradero	rapol	Colosseum	http://neptunolabs.com/images/event-demo/Aftershock1.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-05-27 09:00:00	2015-03-25 09:00:00	These would be the rules for a test event.	Event 02 event to make sure the SQL queries and server integration work	t	2.00	f	Local
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	test02	Activity Room	http://neptunolabs.com/images/event-demo/First-Attack-scaled-440x183.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-11-20 09:00:00	2015-11-05 09:00:00	Some rules for testing stuff	Event 08 Just filling	t	2.00	f	Local
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	ollidab	Hilton Activity Room	http://neptunolabs.com/images/event-demo/WC.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-10-22 22:00:00	2015-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	Event 06 event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
First Test	2015-10-19 09:00:00	miradero	ollidab	S-113	http://neptunolabs.com/images/event-demo/Optic-FIber-Gaming-Event.png	http://neptunolabs.com/images/matchup-logo.png	2015-10-22 22:00:00	2015-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	First Test event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY game (game_name, game_image) FROM stdin;
Super Smash Bros. Melee	http://neptunolabs.com/images/games/Super_Smash_Bros_Melee_box_art.png
Mortal Kombat X	http://neptunolabs.com/images/games/MKX.png
Ultra Street Fighter IV	http://neptunolabs.com/images/games/USF4.jpg
Counter-Strike Global Offensive	http://neptunolabs.com/images/games/Counter-Strike Global Offensive.jpg
Dota 2	http://neptunolabs.com/images/games/Dota 2.jpg
Guilty Gear Xrd	http://neptunolabs.com/images/games/Guilty Gear Xrd.jpg
Hearthstone Heroes of Warcraft	http://neptunolabs.com/images/games/Hearthstone Heroes of Warcraft.jpg
Heroes of the Storm	http://neptunolabs.com/images/games/Heroes of the Storm.jpg
Killer Instinct (2013)	http://neptunolabs.com/images/games/Killer Instinct (2013).jpg
League of Legends	http://neptunolabs.com/images/games/League of Legends.jpg
Monster Hunter 4	http://neptunolabs.com/images/games/Monster Hunter 4.jpg
Persona 4 Arena Ultimax	http://neptunolabs.com/images/games/Persona 4 Arena Ultimax.jpg
Project M	http://neptunolabs.com/images/games/Project M.png
Super Smash Bros. Wii U	http://neptunolabs.com/images/games/Super Smash Bros. Wii U.jpg
Tekekn 7	http://neptunolabs.com/images/games/Tekekn 7.jpg
Ultimate Marvel vs. Capcom 3	http://neptunolabs.com/images/games/Ultimate Marvel vs. Capcom 3.png
\.


--
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY genre (genre_name, genre_image) FROM stdin;
Fighting	http://neptunolabs.com/images/fighting.png
MOBA	http://neptunolabs.com/images/matchup-logo.png
Visual novel	http://neptunolabs.com/images/matchup-logo.png
Digital CCG	http://neptunolabs.com/images/matchup-logo.png
FPS	http://neptunolabs.com/images/matchup-logo.png
Action RPG	http://neptunolabs.com/images/matchup-logo.png
\.


--
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY "group" (event_name, event_start_date, event_location, tournament_name, group_number) FROM stdin;
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2
\.


--
-- Data for Name: has_a; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY has_a (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, group_number) FROM stdin;
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	2	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	1	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	1	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	2	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	1	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	1	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	1	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	2	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	1	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2	2
\.


--
-- Data for Name: hosts; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY hosts (event_name, event_start_date, event_location, organization_name) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	NeptunoLabs
Event 01	2015-03-25 09:00:00	miradero	NeptunoLabs
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Org ollidab
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	NeptunoLabs
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Org 02
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Org 02
\.


--
-- Data for Name: is_a; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_a (event_name, event_start_date, event_location, tournament_name, competitor_number, customer_username) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	papaluisre
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	rapol
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	samdlt
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	4	jems9102
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	5	ollidab
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	papaluisre
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	rapol
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	samdlt
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	jems9102
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	5	ollidab
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	papaluisre
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	rapol
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	samdlt
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	jems9102
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	5	ollidab
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	papaluisre
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	rapol
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	test01
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	test02
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	5	test03
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	6	test04
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	test05
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	test04
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	test01
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	4	test10
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	5	ollidab
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	6	samdlt
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	test05
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	test04
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	test01
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	4	test10
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	5	ollidab
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	6	samdlt
\.


--
-- Data for Name: is_confirmed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY is_confirmed (sponsor_name, sponsor_link, organization_name) FROM stdin;
E-Sports PR	http://esportspr.com/	NeptunoLabs
Mario S. Fong Photography	https://www.facebook.com/MSFPhoto	NeptunoLabs
BANDI TECH	http://gobanditech.com/	NeptunoLabs
Fighting Games Arena	https://twitter.com/FGAPR	NeptunoLabs
See Puerto Rico	http://www.seepuertorico.com/	NeptunoLabs
American Petroleum	http://www.americanpetroleumpr.com/	NeptunoLabs
FIRST ATTACK	http://www.firstattackpr.com/	NeptunoLabs
Team RagnaroK	https://twitter.com/TeamRagnarokPR	NeptunoLabs
E-Sports PR	http://esportspr.com/	Test Org ollidab
American Petroleum	http://www.americanpetroleumpr.com/	Test Org ollidab
BANDI TECH	http://gobanditech.com/	Test Org ollidab
FIRST ATTACK	http://www.firstattackpr.com/	Test Org ollidab
\.


--
-- Data for Name: is_in; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY is_in (event_name, event_start_date, event_location, tournament_name, competitor_number, group_number) FROM stdin;
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	2
\.


--
-- Data for Name: is_of; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_of (game_name, genre_name) FROM stdin;
Super Smash Bros. Melee	Fighting
Mortal Kombat X	Fighting
Ultra Street Fighter IV	Fighting
Counter-Strike Global Offensive	FPS
Dota 2	MOBA
Guilty Gear Xrd	Fighting
Hearthstone Heroes of Warcraft	Digital CCG
Heroes of the Storm	MOBA
Killer Instinct (2013)	Fighting
League of Legends	MOBA
Monster Hunter 4	Action RPG
Persona 4 Arena Ultimax	Fighting
Persona 4 Arena Ultimax	Visual novel
Project M	Fighting
Super Smash Bros. Wii U	Fighting
Tekekn 7	Fighting
Ultimate Marvel vs. Capcom 3	Fighting
\.


--
-- Data for Name: is_played_in; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_played_in (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	2
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	2
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	1	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	1	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	1	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2	2
\.


--
-- Data for Name: is_set; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY is_set (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, set_completed) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	1	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	3	t
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	1	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	1	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	2	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	1	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	Winner	1	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	1	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	1	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	2	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	1	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	4	Winner	1	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	1	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	1	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	2	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	1	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	4	Winner	1	1	f
\.


--
-- Data for Name: match; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY match (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, is_favourite, match_completed) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	f	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	f	t
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	1	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	1	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	2	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	1	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2	f	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	4	Winner	1	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	1	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	1	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	2	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	1	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2	f	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	Winner	1	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	1	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	1	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	2	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	1	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2	f	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	4	Winner	1	f	f
\.


--
-- Data for Name: meetup; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY meetup (event_name, event_start_date, event_location, meetup_location, meetup_name, meetup_start_date, meetup_end_date, meetup_description, customer_username) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Room 301, Mayaguez Resort and Casino, Mayagüez, Puerto Rico	Puertoricans Party	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournament tomorrow hosted by the Puertorican Team	ollidab
First Test	2015-10-19 09:00:00	miradero	Room 401 Hilton Hotel	Mexican Party	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
First Test	2015-10-19 09:00:00	miradero	Room 456 Shady Hotel	Smash Party	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
First Test	2015-10-19 09:00:00	miradero	Room 123 Holiday Inn	Fighting Party	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
Event 01	2015-03-25 09:00:00	miradero	Activity Room Carribe Hotel	Expert Level Meetup	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
Event 01	2015-03-25 09:00:00	miradero	Student Center UPRM	UPRM Students	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
Event 01	2015-03-25 09:00:00	miradero	456, Micasa drive, Mayaguez, PR	Intel Party	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	8535, La post drive, San Juan, PR	Novice Players	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	4578, Calle de los puertoros, Salinas, PR	Los Tainos	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1458, Calle de los tainos, Utuado, PR, 45625	Expert Level	2015-03-24 13:00:00	2015-03-24 22:05:06	Practice Matches for the tournaments	ollidab
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY news (event_name, event_start_date, event_location, news_number, news_title, news_content, news_date_posted) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	1	Test News 01 Updated	This message has been updated. :D So this is a news article. So I think I am gonna go ahead and do that.	2015-03-26 09:00:00
Event 01	2015-03-25 09:00:00	miradero	2	Test News 02	This is a second news test, just making sure everything is right with the world	2015-03-27 04:00:00
Event 01	2015-03-25 09:00:00	miradero	3	Test News 03	Here we go again, just making sure everything is right with the world	2015-03-27 05:00:00
Event 01	2015-03-25 09:00:00	miradero	4	Test News 04	Do not worry just one more of these and i will stop	2015-03-27 06:00:00
Event 01	2015-03-25 09:00:00	miradero	5	Test News 05	I am gonna keep my word, this was the last one	2015-03-27 07:00:00
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1	Test News 01	Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,	2015-10-18 09:00:00
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2	Test News 02	Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,	2015-10-19 09:00:00
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3	Test News 03	Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis,	2015-10-22 09:00:00
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY organization (organization_name, organization_logo, organization_bio, organization_cover_photo, organization_active) FROM stdin;
NeptunoLabs	http://neptunolabs.com/images/matchup-logo.png	This is the organization that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org papaluisre	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org 01	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org 02	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org 03	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org ollidab	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
\.


--
-- Data for Name: owns; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY owns (organization_name, customer_username) FROM stdin;
NeptunoLabs	ollidab
Test Org papaluisre	papaluisre
Test Org ollidab	ollidab
Test Org 01	test01
Test Org 02	test02
Test Org 03	test03
Test Org 01	test03
\.


--
-- Data for Name: pays; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY pays (event_name, event_start_date, event_location, spec_fee_name, customer_username, check_in) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	test03	f
Event 01	2015-03-25 09:00:00	miradero	2-day Pass	test02	f
Event 01	2015-03-25 09:00:00	miradero	Opening Day Pass	test04	f
First Test	2015-10-19 09:00:00	miradero	3-day Pass	test05	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3-day Pass	test01	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3-day Pass	test02	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2-day Pass	test03	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1-day Pass	test04	f
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	test04	t
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	test10	t
\.


--
-- Data for Name: plays_for; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY plays_for (customer_username, team_name) FROM stdin;
ollidab	NeptunoLabs
ollidab	Test_Team
test01	test team 01
test04	test team 04
test06	test team 06
test07	test team 07
test10	test team 10
test02	test team 01
test05	test team 04
test08	test team 07
test11	test team 10
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY report (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, report_number, report_description, report_image, report_date, report_type) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	1	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	3	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	1	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	1	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	1	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	3	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY request (request_organization_name, customer_username, request_description, request_status) FROM stdin;
Test Request Organization	ollidab	A test organization request, this may or not be accepted	Received
Test Org 01	test01	Hi, Im looking to get my organization 01 set up.	Declined
Test Org 02	test02	Hi, Im looking to get my organization 02 set up.	Declined
Test Org papaluisre	papaluisre	Hi, Im looking to get my organization 04 set up.	Accepted
Test Org rapol	rapol	Hi, Im looking to get my organization 03 set up.	Pending
NeptunoLabs	ollidab	This is the organization that brought you this application!	Accepted
Test Org ollidab	ollidab	Hi, Im looking to get my organization ollidab set up.	Accepted
\.


--
-- Data for Name: request_sponsor; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY request_sponsor (request_sponsor_link, request_sponsor_description, organization_name, request_sponsor_status) FROM stdin;
http://www.americanpetroleumpr.com/	Hi i want this. Please contact me for more information.	NeptunoLabs	Accepted
twitch.tv	We have a new sponsor named twitch. 	Test Org papaluisre	Received
http://fake-sponsor-url-super-fake.com	Fake, fake sponsor	Test Org ollidab	Declined
http://fake-sponsor-test-01.com	Sponsor Test 01	Test Org ollidab	Received
http://fake-sponsor-test-02.com	Sponsor Test 02	Test Org papaluisre	Received
http://fake-sponsor-test-03.com	Sponsor Test 03	NeptunoLabs	Received
http://fake-sponsor-test-04.com	Sponsor Test 04	Test Org ollidab	Received
http://fake-sponsor-test-05.com	Sponsor Test 05	Test Org papaluisre	Received
http://fake-sponsor-test-06.com	Sponsor Test 06	NeptunoLabs	Received
http://gobanditech.com/	I have this new sponsor, please contact my organization to receive more information.	NeptunoLabs	Accepted
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY review (event_name, event_start_date, event_location, customer_username, review_title, review_content, star_rating, review_date_created) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	test01	Greatest Test Event Ever!	Best experience ever, if other events hosted by Neptuno Labs are like this then I am in	5	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test02	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	3	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test03	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	4	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test04	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	2	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test10	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	1	2015-03-25 09:00:00
\.


--
-- Data for Name: round; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY round (event_name, event_start_date, event_location, tournament_name, round_number, round_of, round_start_date, round_pause, round_completed, round_best_of) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	2015-03-25 11:00:00	f	f	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2015-03-25 11:00:00	f	f	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	2015-03-25 11:00:00	f	f	3
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	Winner	2015-12-01 11:00:00	f	f	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	Winner	2015-12-01 11:00:00	f	f	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	Winner	2015-12-01 11:00:00	f	f	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	Winner	2015-12-01 11:00:00	f	f	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	Winner	2015-11-02 09:00:00	f	f	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	Winner	2015-11-02 09:00:00	f	f	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	Winner	2015-11-02 09:00:00	f	f	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	4	Winner	2015-11-02 09:00:00	f	f	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	Winner	2015-11-02 09:00:00	f	f	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	Winner	2015-11-02 09:00:00	f	f	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	Winner	2015-11-02 09:00:00	f	f	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	4	Winner	2015-11-02 09:00:00	f	f	1
\.


--
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY shows (event_name, event_start_date, event_location, sponsor_name) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	E-Sports PR
First Test	2015-10-19 09:00:00	miradero	BANDI TECH
First Test	2015-10-19 09:00:00	miradero	Fighting Games Arena
First Test	2015-10-19 09:00:00	miradero	See Puerto Rico
First Test	2015-10-19 09:00:00	miradero	American Petroleum
First Test	2015-10-19 09:00:00	miradero	E-Sports PR
Event 01	2015-03-25 09:00:00	miradero	See Puerto Rico
Event 01	2015-03-25 09:00:00	miradero	American Petroleum
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	E-Sports PR
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	E-Sports PR
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	See Puerto Rico
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	BANDI TECH
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	BANDI TECH
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	American Petroleum
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	BANDI TECH
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	FIRST ATTACK
\.


--
-- Data for Name: spectator_fee; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY spectator_fee (event_name, event_start_date, event_location, spec_fee_name, spec_fee_amount, spec_fee_description, spec_fee_amount_available) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	1
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	25.00	General Admission to the first three days.	1
Event 01	2015-03-25 09:00:00	miradero	2-day Pass	18.00	General Admission to the first two days. Note: Does not Include Final Round	1
Event 01	2015-03-25 09:00:00	miradero	Opening Day Pass	10.00	General Admission to the first day.	1
Event 01	2015-03-25 09:00:00	miradero	Finals Day Pass	10.00	General Admission to the last day of the event where the final rounds will be held.	1
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2-day Pass	15.00	General Admission to the last two days. Note: Final Round does not included seating area	100
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1-day Pass	8.00	General Admission to the first day.	50
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	2-day Pass	15.00	General Admission to the last two days. Note: Final Round does not included seating area	100
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	1-day Pass	8.00	General Admission to the first day.	50
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
\.


--
-- Data for Name: sponsors; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY sponsors (sponsor_name, sponsor_logo, sponsor_link) FROM stdin;
E-Sports PR	http://esportspr.com/wp-content/uploads/2014/05/Esports-banner-2-tight-300x60.png	http://esportspr.com/
Mario S. Fong Photography	http://neptunolabs.com/images/sponsors/MSFP.png	https://www.facebook.com/MSFPhoto
BANDI TECH	http://neptunolabs.com/images/sponsors/Banditech1.png	http://gobanditech.com/
Fighting Games Arena	http://neptunolabs.com/images/sponsors/LogoFGA-440x1831.png	https://twitter.com/FGAPR
See Puerto Rico	http://neptunolabs.com/images/sponsors/Turismo-Logo.png	http://www.seepuertorico.com/
American Petroleum	http://neptunolabs.com/images/sponsors/American-Petroleum.png	http://www.americanpetroleumpr.com/
FIRST ATTACK	http://neptunolabs.com/images/sponsors/First-Attack-440x183-left.png	http://www.firstattackpr.com/
Team RagnaroK	http://neptunolabs.com/images/sponsors/Team-Ragnarok-440x183-right.png	https://twitter.com/TeamRagnarokPR
\.


--
-- Data for Name: station; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY station (event_name, event_start_date, event_location, station_number, station_in_use) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	5	f
First Test	2015-10-19 09:00:00	miradero	4	f
First Test	2015-10-19 09:00:00	miradero	3	f
First Test	2015-10-19 09:00:00	miradero	2	f
First Test	2015-10-19 09:00:00	miradero	1	f
Event 01	2015-03-25 09:00:00	miradero	1	f
Event 01	2015-03-25 09:00:00	miradero	2	f
Event 01	2015-03-25 09:00:00	miradero	3	f
Event 01	2015-03-25 09:00:00	miradero	4	f
Event 01	2015-03-25 09:00:00	miradero	5	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	6	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	5	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	4	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	1	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	2	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	1	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	2	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	1	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	2	f
\.


--
-- Data for Name: stream; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY stream (event_name, event_start_date, event_location, station_number, stream_link) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	4	http://www.twitch.tv/forsen
First Test	2015-10-19 09:00:00	miradero	2	http://www.twitch.tv/ollidab
Event 01	2015-03-25 09:00:00	miradero	1	http://www.twitch.tv/ollidab
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1	http://www.twitch.tv/imaqtpie
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3	http://www.twitch.tv/beyondthesummit
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	5	http://www.twitch.tv/summit1g
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	1	http://www.twitch.tv/imaqtpie
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	1	http://www.twitch.tv/imaqtpie
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	1	http://www.twitch.tv/imaqtpie
\.


--
-- Data for Name: submits; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY submits (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, competitor_number, score) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	1	4	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	1	5	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2	4	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2	5	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	3	4	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	3	5	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	1	1	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	1	5	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	2	1	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	2	5	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	1	2	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	1	3	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2	2	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2	3	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3	2	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3	3	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	1	1	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	1	3	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	2	1	0
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	2	3	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	3	1	1
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	3	3	0
\.


--
-- Data for Name: subscribed_to; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY subscribed_to (subscriber, interest) FROM stdin;
samdlt	ollidab
ollidab	test07
ollidab	test01
ollidab	rapol
ollidab	samdlt
ollidab	jems9102
ollidab	papaluisre
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY team (team_name, team_logo, team_bio, team_cover_photo, team_active) FROM stdin;
NeptunoLabs	http://neptunolabs.com/images/matchup-logo.png	This is a team that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test_Team	http://neptunolabs.com/images/matchup-logo.png	This is a team that brought you this application!	http://neptunolabs.com/images/logoPlain.png	f
test team 01	http://i.imgur.com/bBdFnYf.png	This is a test team 01. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 04	http://i.imgur.com/SlUSvZJ.png	This is a test team 04. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 06	http://i.imgur.com/pQOXLUQ.png	This is a test team 06. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 07	http://i.imgur.com/KIkVRFL.png	This is a test team 07. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 10	http://i.imgur.com/Yal1Pam.png	This is a test team 10. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	f
\.


--
-- Data for Name: to_play; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY to_play (event_name, event_start_date, event_location, meetup_location, meetup_start_date, game_name) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Room 301, Mayaguez Resort and Casino, Mayagüez, Puerto Rico	2015-03-24 13:00:00	Super Smash Bros. Melee
First Test	2015-10-19 09:00:00	miradero	Room 401 Hilton Hotel	2015-03-24 13:00:00	Super Smash Bros. Melee
First Test	2015-10-19 09:00:00	miradero	Room 401 Hilton Hotel	2015-03-24 13:00:00	Ultimate Marvel vs. Capcom 3
First Test	2015-10-19 09:00:00	miradero	Room 456 Shady Hotel	2015-03-24 13:00:00	Project M
First Test	2015-10-19 09:00:00	miradero	Room 123 Holiday Inn	2015-03-24 13:00:00	Monster Hunter 4
Event 01	2015-03-25 09:00:00	miradero	Activity Room Carribe Hotel	2015-03-24 13:00:00	Killer Instinct (2013)
Event 01	2015-03-25 09:00:00	miradero	Student Center UPRM	2015-03-24 13:00:00	Ultra Street Fighter IV
Event 01	2015-03-25 09:00:00	miradero	456, Micasa drive, Mayaguez, PR	2015-03-24 13:00:00	Tekekn 7
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	8535, La post drive, San Juan, PR	2015-03-24 13:00:00	Hearthstone Heroes of Warcraft
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	4578, Calle de los puertoros, Salinas, PR	2015-03-24 13:00:00	Hearthstone Heroes of Warcraft
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1458, Calle de los tainos, Utuado, PR, 45625	2015-03-24 13:00:00	Guilty Gear Xrd
\.


--
-- Data for Name: tournament; Type: TABLE DATA; Schema: public; Owner: edwinbadillo
--

COPY tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, is_team_based, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, tournament_active) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	f	2015-10-19 11:00:00	2015-10-19 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t
Event 02	2015-05-05 09:00:00	miradero	Smash Bros. Melee Weekly	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	f	2015-05-05 11:00:00	2015-05-05 10:00:00	10.00	32	100.00	Two Stage	Double Elimination	Match	4	2	t
Event 03	2015-03-27 09:00:00	miradero	USF4 Money Match	Ultra Street Fighter IV	Rules of the rules with rules comprised of rules	f	2015-03-27 09:00:00	2015-03-17 09:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	Ultra Street Fighter IV	Rules of the rules with rules comprised of rules	f	2015-03-25 11:00:00	2015-03-25 10:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	f	2015-06-05 11:00:00	2015-06-05 10:00:00	10.00	32	100.00	Two Stage	Double Elimination	Match	4	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	Mortal Kombat X	Rules of the rules with rules comprised of rules	f	2015-03-25 11:00:00	2015-03-25 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	0	0	t
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	Dota 2	Rules of the rules with rules comprised of rules	f	2025-10-19 11:00:00	2025-10-19 10:00:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t
Event 05	2025-11-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	Killer Instinct For Fun	Killer Instinct (2013)	Rules of the rules with rules comprised of rules	f	2025-11-19 11:00:00	2025-11-19 10:00:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 01	Project M	Rules of the rules with rules comprised of rules	f	2015-10-29 11:00:00	2015-10-29 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 02	Guilty Gear Xrd	Rules of the rules with rules comprised of rules	f	2015-10-29 11:00:00	2015-10-29 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 03	Ultimate Marvel vs. Capcom 3	Rules of the rules with rules comprised of rules	f	2015-10-29 11:00:00	2015-10-29 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	Project M	Rules of the rules with rules comprised of rules	f	2015-12-01 11:00:00	2015-11-25 10:00:00	10.00	32	100.00	Two Stage	Single Elimination	Match	3	1	t
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	Project M	Rules of the rules with rules comprised of rules	f	2015-11-02 09:00:00	2015-10-24 09:00:00	10.00	32	100.00	Two Stage	Single Elimination	Match	3	1	t
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	Project M	Rules of the rules with rules comprised of rules	f	2015-11-02 09:00:00	2015-10-24 09:00:00	10.00	32	100.00	Two Stage	Single Elimination	Match	3	1	t
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
    ADD CONSTRAINT "PK_competes" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number);


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
    ADD CONSTRAINT "PK_competitor_goes_to" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_of, past_match, future_round_number, future_round_of, future_match, is_winner);


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
    ADD CONSTRAINT "PK_group" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, group_number);


--
-- Name: PK_has_a; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY has_a
    ADD CONSTRAINT "PK_has_a" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, group_number);


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
-- Name: PK_is_confirmed; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY is_confirmed
    ADD CONSTRAINT "PK_is_confirmed" PRIMARY KEY (sponsor_name, organization_name);


--
-- Name: PK_is_in; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY is_in
    ADD CONSTRAINT "PK_is_in" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, group_number);


--
-- Name: PK_is_of; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "PK_is_of" PRIMARY KEY (game_name, genre_name);


--
-- Name: PK_is_played_in; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "PK_is_played_in" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number);


--
-- Name: PK_is_set; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY is_set
    ADD CONSTRAINT "PK_is_set" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq);


--
-- Name: PK_match; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY match
    ADD CONSTRAINT "PK_match" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number);


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
    ADD CONSTRAINT "PK_report" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, report_number);


--
-- Name: PK_request; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY request
    ADD CONSTRAINT "PK_request" PRIMARY KEY (request_organization_name, customer_username);


--
-- Name: PK_request_sponsor; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY request_sponsor
    ADD CONSTRAINT "PK_request_sponsor" PRIMARY KEY (organization_name, request_sponsor_link) WITH (fillfactor=100);


--
-- Name: PK_review; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "PK_review" PRIMARY KEY (event_name, event_start_date, event_location, customer_username);


--
-- Name: PK_round; Type: CONSTRAINT; Schema: public; Owner: edwinbadillo; Tablespace: 
--

ALTER TABLE ONLY round
    ADD CONSTRAINT "PK_round" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of);


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
    ADD CONSTRAINT "PK_submits" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, competitor_number) WITH (fillfactor=100);


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
    ADD CONSTRAINT "FK_belongs_to_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_belongs_to_organization; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "FK_belongs_to_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_capacity_for_station; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "FK_capacity_for_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_capacity_for_tournament; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "FK_capacity_for_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_captain_for_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "FK_captain_for_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_captain_for_team; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "FK_captain_for_team" FOREIGN KEY (team_name) REFERENCES team(team_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_comfirmed_organization; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY is_confirmed
    ADD CONSTRAINT "FK_comfirmed_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_comfirmed_sponsor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY is_confirmed
    ADD CONSTRAINT "FK_comfirmed_sponsor" FOREIGN KEY (sponsor_name) REFERENCES sponsors(sponsor_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_competes_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "FK_competes_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competes_for_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "FK_competes_for_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competes_for_team; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "FK_competes_for_team" FOREIGN KEY (team_name) REFERENCES team(team_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competes_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "FK_competes_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competitor_goes_to_future_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "FK_competitor_goes_to_future_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, future_round_number, future_round_of, future_match) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competitor_goes_to_past_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "FK_competitor_goes_to_past_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_of, past_match) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competitor_tournament; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT "FK_competitor_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_event_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY event
    ADD CONSTRAINT "FK_event_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_has_a_group; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY has_a
    ADD CONSTRAINT "FK_has_a_group" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, group_number) REFERENCES "group"(event_name, event_start_date, event_location, tournament_name, group_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_has_a_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY has_a
    ADD CONSTRAINT "FK_has_a_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_hosts_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "FK_hosts_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_hosts_organization; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "FK_hosts_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_a_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_a
    ADD CONSTRAINT "FK_is_a_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_a_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_a
    ADD CONSTRAINT "FK_is_a_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_in_competitor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY is_in
    ADD CONSTRAINT "FK_is_in_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_in_group; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY is_in
    ADD CONSTRAINT "FK_is_in_group" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, group_number) REFERENCES "group"(event_name, event_start_date, event_location, tournament_name, group_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_of_game; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "FK_is_of_game" FOREIGN KEY (game_name) REFERENCES game(game_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_of_genre; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "FK_is_of_genre" FOREIGN KEY (genre_name) REFERENCES genre(genre_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_played_in_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "FK_is_played_in_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_played_in_station; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "FK_is_played_in_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_set_match; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY is_set
    ADD CONSTRAINT "FK_is_set_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_match_round; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY match
    ADD CONSTRAINT "FK_match_round" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of) REFERENCES round(event_name, event_start_date, event_location, tournament_name, round_number, round_of) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_meetup_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "FK_meetup_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_meetup_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "FK_meetup_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_news_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY news
    ADD CONSTRAINT "FK_news_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_owns_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "FK_owns_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_owns_organization; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "FK_owns_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_pays_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "FK_pays_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_pays_spectator_fee; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "FK_pays_spectator_fee" FOREIGN KEY (event_name, event_start_date, event_location, spec_fee_name) REFERENCES spectator_fee(event_name, event_start_date, event_location, spec_fee_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_plays_for_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "FK_plays_for_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_plays_for_team_name; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "FK_plays_for_team_name" FOREIGN KEY (team_name) REFERENCES team(team_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_report_is_set; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY report
    ADD CONSTRAINT "FK_report_is_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) REFERENCES is_set(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_request_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY request
    ADD CONSTRAINT "FK_request_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_request_sponsor_organization; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY request_sponsor
    ADD CONSTRAINT "FK_request_sponsor_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_review_customer; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "FK_review_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_review_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "FK_review_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_round_tournament; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY round
    ADD CONSTRAINT "FK_round_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_shows_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "FK_shows_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_shows_sponsor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "FK_shows_sponsor" FOREIGN KEY (sponsor_name) REFERENCES sponsors(sponsor_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_spectator_fee_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY spectator_fee
    ADD CONSTRAINT "FK_spectator_fee_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_station_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY station
    ADD CONSTRAINT "FK_station_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_stream_station; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY stream
    ADD CONSTRAINT "FK_stream_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_submits_competitor; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "FK_submits_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_submits_is_set; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "FK_submits_is_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) REFERENCES is_set(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_subscribed_to_customer_interest; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "FK_subscribed_to_customer_interest" FOREIGN KEY (interest) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_subscribed_to_customer_subscriber; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "FK_subscribed_to_customer_subscriber" FOREIGN KEY (subscriber) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_to_play_game; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "FK_to_play_game" FOREIGN KEY (game_name) REFERENCES game(game_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_to_play_meetup; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "FK_to_play_meetup" FOREIGN KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date) REFERENCES meetup(event_name, event_start_date, event_location, meetup_location, meetup_start_date) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_event; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_game; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_game" FOREIGN KEY (game_name) REFERENCES game(game_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_group; Type: FK CONSTRAINT; Schema: public; Owner: edwinbadillo
--

ALTER TABLE ONLY "group"
    ADD CONSTRAINT "FK_tournament_group" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


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

