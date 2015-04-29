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
-- Name: belongs_to; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE belongs_to (
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE public.belongs_to OWNER TO root;

--
-- Name: capacity_for; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE capacity_for (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    station_number integer NOT NULL
);


ALTER TABLE public.capacity_for OWNER TO root;

--
-- Name: captain_for; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE captain_for (
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE public.captain_for OWNER TO root;

--
-- Name: competes; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.competes OWNER TO root;

--
-- Name: competes_for; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE competes_for (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE public.competes_for OWNER TO root;

--
-- Name: competitor; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.competitor OWNER TO root;

--
-- Name: competitor_goes_to; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.competitor_goes_to OWNER TO root;

--
-- Name: customer; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE customer (
    customer_username character varying(127) NOT NULL,
    customer_first_name character varying(127) NOT NULL,
    customer_last_name character varying(127) NOT NULL,
    customer_tag character varying(127) NOT NULL,
    customer_password character varying(255) NOT NULL,
    customer_salt character varying(255) NOT NULL,
    customer_paypal_info character varying(127),
    customer_profile_pic character varying(127) DEFAULT 'http://i.imgur.com/vH5hiFw.jpg'::character varying,
    customer_cover_photo character varying(127) DEFAULT 'http://i.imgur.com/XvTEBuN.jpg'::character varying,
    customer_bio character varying(255),
    customer_country character varying(32),
    customer_active boolean DEFAULT true NOT NULL,
    customer_email character varying(127) NOT NULL
);


ALTER TABLE public.customer OWNER TO root;

--
-- Name: TABLE customer; Type: COMMENT; Schema: public; Owner: root
--

COMMENT ON TABLE customer IS 'customer:  Can  be a competitor, team member, event organizer, or a selection of the aforementioned.';


--
-- Name: event; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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
    event_rules character varying(511),
    event_description character varying(255),
    event_active boolean DEFAULT true NOT NULL,
    event_deduction_fee numeric(10,2),
    event_is_online boolean,
    event_type character varying(31)
);


ALTER TABLE public.event OWNER TO root;

--
-- Name: game; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE game (
    game_name character varying(127) NOT NULL,
    game_image character varying(127) NOT NULL
);


ALTER TABLE public.game OWNER TO root;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE genre (
    genre_name character varying(127) NOT NULL,
    genre_image character varying(127) NOT NULL
);


ALTER TABLE public.genre OWNER TO root;

--
-- Name: group; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE "group" (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    group_number integer NOT NULL
);


ALTER TABLE public."group" OWNER TO root;

--
-- Name: has_a; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.has_a OWNER TO root;

--
-- Name: hosts; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE hosts (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    organization_name character varying(127) NOT NULL
);


ALTER TABLE public.hosts OWNER TO root;

--
-- Name: is_a; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE is_a (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    competitor_number integer NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE public.is_a OWNER TO root;

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
-- Name: is_of; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE is_of (
    game_name character varying(127) NOT NULL,
    genre_name character varying(127) NOT NULL
);


ALTER TABLE public.is_of OWNER TO root;

--
-- Name: is_played_in; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.is_played_in OWNER TO root;

--
-- Name: is_set; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.is_set OWNER TO root;

--
-- Name: match; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.match OWNER TO root;

--
-- Name: meetup; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.meetup OWNER TO root;

--
-- Name: news; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.news OWNER TO root;

--
-- Name: organization; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE organization (
    organization_name character varying(127) NOT NULL,
    organization_logo character varying(127),
    organization_bio character varying(255),
    organization_cover_photo character varying(127),
    organization_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.organization OWNER TO root;

--
-- Name: owns; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE owns (
    organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL
);


ALTER TABLE public.owns OWNER TO root;

--
-- Name: pays; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE pays (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    spec_fee_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    check_in boolean DEFAULT false NOT NULL
);


ALTER TABLE public.pays OWNER TO root;

--
-- Name: plays_for; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE plays_for (
    customer_username character varying(127) NOT NULL,
    team_name character varying(127) NOT NULL
);


ALTER TABLE public.plays_for OWNER TO root;

--
-- Name: prize_distribution; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE prize_distribution (
    prize_distribution_name character varying(32) NOT NULL,
    first integer NOT NULL,
    second integer NOT NULL,
    third integer NOT NULL
);


ALTER TABLE public.prize_distribution OWNER TO root;

--
-- Name: report; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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
    report_type character varying(127) NOT NULL,
    report_status character varying(30) DEFAULT 'Received'::character varying
);


ALTER TABLE public.report OWNER TO root;

--
-- Name: request; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE request (
    request_organization_name character varying(127) NOT NULL,
    customer_username character varying(127) NOT NULL,
    request_description character varying(255),
    request_status character varying(32) DEFAULT 'Received'::character varying NOT NULL
);


ALTER TABLE public.request OWNER TO root;

--
-- Name: request_sponsor; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE request_sponsor (
    request_sponsor_link character varying(127) NOT NULL,
    request_sponsor_description character varying(511),
    organization_name character varying(127) NOT NULL,
    request_sponsor_status character varying(32) DEFAULT 'Received'::character varying NOT NULL
);


ALTER TABLE public.request_sponsor OWNER TO postgres;

--
-- Name: review; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.review OWNER TO root;

--
-- Name: round; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.round OWNER TO root;

--
-- Name: shows; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE shows (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    sponsor_name character varying(127) NOT NULL
);


ALTER TABLE public.shows OWNER TO root;

--
-- Name: spectator_fee; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.spectator_fee OWNER TO root;

--
-- Name: sponsors; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE sponsors (
    sponsor_name character varying(127) NOT NULL,
    sponsor_logo character varying(127) NOT NULL,
    sponsor_link character varying(127) NOT NULL
);


ALTER TABLE public.sponsors OWNER TO root;

--
-- Name: station; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE station (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    station_number integer NOT NULL,
    station_in_use boolean DEFAULT false NOT NULL
);


ALTER TABLE public.station OWNER TO root;

--
-- Name: stream; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE stream (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    station_number integer NOT NULL,
    stream_link character varying(127) NOT NULL
);


ALTER TABLE public.stream OWNER TO root;

--
-- Name: submits; Type: TABLE; Schema: public; Owner: root; Tablespace: 
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


ALTER TABLE public.submits OWNER TO root;

--
-- Name: subscribed_to; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE subscribed_to (
    subscriber character varying(127) NOT NULL,
    interest character varying(127) NOT NULL
);


ALTER TABLE public.subscribed_to OWNER TO root;

--
-- Name: team; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE team (
    team_name character varying(127) NOT NULL,
    team_logo character varying(127) NOT NULL,
    team_bio character varying(255) NOT NULL,
    team_cover_photo character varying(127),
    team_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.team OWNER TO root;

--
-- Name: to_play; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE to_play (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    meetup_location character varying(127) NOT NULL,
    meetup_start_date timestamp without time zone NOT NULL,
    game_name character varying(127) NOT NULL
);


ALTER TABLE public.to_play OWNER TO root;

--
-- Name: tournament; Type: TABLE; Schema: public; Owner: root; Tablespace: 
--

CREATE TABLE tournament (
    event_name character varying(127) NOT NULL,
    event_start_date timestamp without time zone NOT NULL,
    event_location character varying(127) NOT NULL,
    tournament_name character varying(127) NOT NULL,
    game_name character varying(127) NOT NULL,
    tournament_rules character varying(511) NOT NULL,
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
    tournament_active boolean DEFAULT true,
    team_size integer DEFAULT 1 NOT NULL,
    prize_distribution_name character varying(32) DEFAULT 'None'::character varying NOT NULL
);


ALTER TABLE public.tournament OWNER TO root;

--
-- Data for Name: belongs_to; Type: TABLE DATA; Schema: public; Owner: root
--

COPY belongs_to (organization_name, customer_username) FROM stdin;
Test Org papaluisre	papaluisre
Test Org 01	test01
Test Org 03	test03
Test Org 02	test04
Test Org 03	test07
Test Org 01	test03
E-Sports PR	espr_mari
NeptunoLabs	ollidab
E-Sports PR	test08
E-Sports PR	test04
E-Sports PR	samdlt
E-Sports PR	test01
NeptunoLabs	jems9102
NeptunoLabs	papaluisre
Test Org ollidab	test01
Test Org ollidab	rapol
\.


--
-- Data for Name: capacity_for; Type: TABLE DATA; Schema: public; Owner: root
--

COPY capacity_for (event_name, event_start_date, event_location, tournament_name, station_number) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	16
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
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4
Event 01	2015-03-25 09:00:00	miradero	Twisted Tree Line	10
\.


--
-- Data for Name: captain_for; Type: TABLE DATA; Schema: public; Owner: root
--

COPY captain_for (customer_username, team_name) FROM stdin;
ollidab	Test_Team
test01	test team 01
test04	test team 04
test06	test team 06
test10	test team 10
ollidab	NeptunoLabs
test07	test team 07
test07	Team Delete
test07	Team Delete 2
test07	Team Delete 3
rapol	Team Playground
rapol	last delete
thisWillWork	LTLP
\.


--
-- Data for Name: competes; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	4
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	5
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	4
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	5
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	5
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	4
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	5
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	4
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	4
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	4
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	4
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	5
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	2
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	4
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	2
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	2
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	4
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	2
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	4
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	3
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	2
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	6
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	9
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	12
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	5
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	10
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	8
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	14
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	9
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	13
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	12
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	7
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	8
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	11
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	13
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	6
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	7
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	5
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	11
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	10
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	2
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	3
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	1	1
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	1	3
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	4
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	3
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	1
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	2
\.


--
-- Data for Name: competes_for; Type: TABLE DATA; Schema: public; Owner: root
--

COPY competes_for (event_name, event_start_date, event_location, tournament_name, competitor_number, team_name) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	test team 04
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	test team 01
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	test team 07
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	NeptunoLabs
Second Premium	2015-04-25 04:00:00	Online	Tourney 2	1	NeptunoLabs
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	LTLP
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	test team 04
Team Test	2015-04-28 02:55:00	hey	tourney 1	3	NeptunoLabs
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	test team 06
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	test team 04
Team test	2015-05-01 04:00:00	Hey	Another Tourney	3	test team 01
Team test	2015-05-01 04:00:00	Hey	Another Tourney	4	NeptunoLabs
\.


--
-- Data for Name: competitor; Type: TABLE DATA; Schema: public; Owner: root
--

COPY competitor (event_name, event_start_date, event_location, tournament_name, competitor_number, competitor_standing, competitor_seed, matches_won, matches_lost, competitor_has_forfeited, competitor_check_in, competitor_paid) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	\N	0	0	0	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	\N	0	0	0	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	\N	0	0	0	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	4	\N	0	0	0	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	5	\N	0	0	0	f	t	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1	\N	0	0	0	f	t	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2	\N	0	0	0	f	t	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	3	\N	0	0	0	f	t	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	4	\N	0	0	0	f	t	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	5	\N	0	0	0	f	t	f
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	6	\N	0	0	0	f	t	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1	\N	0	0	0	f	t	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2	\N	0	0	0	f	t	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	3	\N	0	0	0	f	t	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	4	\N	0	0	0	f	t	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	5	\N	0	0	0	f	t	f
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	6	\N	0	0	0	f	t	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1	\N	0	0	0	f	t	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2	\N	0	0	0	f	t	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	3	\N	0	0	0	f	t	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	4	\N	0	0	0	f	t	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	5	\N	0	0	0	f	t	f
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	6	\N	0	0	0	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	6	0	0	0	0	f	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	2	2	4	2	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	3	4	3	2	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	5	4	3	1	3	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	1	1	4	1	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	5	5	0	4	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	5	\N	2	0	0	f	t	f
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	2	0	0	0	0	f	f	t
sdaf	2015-04-25 13:05:00	Online	sdf	2	0	0	0	0	f	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	\N	0	0	0	f	f	f
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	4	0	0	0	0	f	f	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	0	1	0	0	f	t	t
Test Event	2015-05-15 23:00:00	Event Location	Test Tournament	1	0	0	0	0	f	f	t
Event 02	2015-05-05 09:00:00	miradero	Smash Bros. Melee Weekly	2	0	0	0	0	f	f	t
Second Premium	2015-04-25 04:00:00	Online	Tourney 2	1	0	0	0	0	f	f	t
Second Premium	2015-04-25 04:00:00	Online	Hearth Tourney	1	0	0	0	0	f	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	\N	3	0	2	f	t	f
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	6	0	0	0	0	f	f	t
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 02	1	0	0	0	0	f	f	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	4	0	1	0	0	f	t	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	0	3	0	0	f	t	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	2	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	8	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	10	0	0	0	0	f	f	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	0	2	0	0	f	t	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	0	3	0	0	f	t	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	0	4	0	0	f	t	t
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	1	0	0	0	0	f	f	t
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	2	0	0	0	0	f	f	t
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	First Visual Novel Tournament	1	0	0	0	0	f	f	t
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	1	0	0	0	0	f	f	t
sdaf	2015-04-25 13:05:00	Online	sdf	1	0	0	0	0	f	f	t
Event 02	2015-05-05 09:00:00	miradero	Smash Bros. Melee Weekly	1	0	0	0	0	f	f	t
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	First Visual Novel Tournament	2	0	0	0	0	f	f	t
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	3	0	0	0	0	f	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	\N	1	1	1	f	t	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	\N	4	3	1	f	t	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	6	0	1	1	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	13	0	3	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	0	6	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	7	0	9	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	10	0	10	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	8	0	11	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	11	0	12	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	9	0	2	0	1	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	0	4	0	1	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	12	0	5	1	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	0	8	0	1	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	0	7	1	0	f	t	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	0	2	0	0	f	t	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	3	0	4	0	0	f	t	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	1	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	3	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	5	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	7	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	9	0	0	0	0	f	f	t
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	11	0	0	0	0	f	f	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	0	0	0	0	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	0	13	0	1	f	t	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	14	0	14	1	0	f	t	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	0	0	0	1	f	t	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	3	0	0	1	0	f	t	t
\.


--
-- Data for Name: competitor_goes_to; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	2	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	1	Loser	1	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	3	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	2	Loser	1	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	3	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	1	Loser	1	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	4	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	3	Loser	1	f
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	2	Loser	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	3	Loser	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	4	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	2	Winner	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	1	Loser	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Loser	1	2	Loser	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Loser	1	3	Loser	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Loser	1	2	Winner	1	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	2	Winner	1	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	2	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	2	Winner	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	1	Loser	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	2	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	1	Loser	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	1	3	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	1	2	Loser	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2	3	Winner	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2	2	Loser	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	3	3	Winner	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	3	1	Loser	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	4	3	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	4	1	Loser	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	1	4	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	1	3	Loser	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2	4	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2	3	Loser	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	1	5	Winner	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	1	5	Loser	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	1	2	Loser	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2	2	Loser	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	1	3	Loser	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	2	3	Loser	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	1	4	Loser	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	2	4	Loser	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Loser	1	5	Loser	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Loser	1	5	Winner	1	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	2	Winner	1	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	2	Winner	1	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	2	Winner	1	t
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: public; Owner: root
--

COPY customer (customer_username, customer_first_name, customer_last_name, customer_tag, customer_password, customer_salt, customer_paypal_info, customer_profile_pic, customer_cover_photo, customer_bio, customer_country, customer_active, customer_email) FROM stdin;
test01	Fletcher	Brook	fbrook	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test01@neptunolabs.com	http://i.imgur.com/pSTPtbA.png	http://i.imgur.com/JK3C7Re.png	Description 01 hello dog monkey	United States	t	test01@neptunolabs.com
test02	Andre	York	york	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test02@neptunolabs.com	http://i.imgur.com/RTalBtW.png	http://i.imgur.com/I0kBfi1.png	Description 02 mad scientist hearthstone	United States	t	test02@neptunolabs.com
test03	Stacie	Fawn	fawn	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test03@neptunolabs.com	http://i.imgur.com/0Gl8WWF.png	http://i.imgur.com/pLdYiwr.png	Description 03 we are the world	Mexico	t	test03@neptunolabs.com
test04	Madlyn	Pris	pris	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test04@neptunolabs.com	http://i.imgur.com/ptNakXV.png	http://i.imgur.com/vrMHPer.png	Description 04 pool states, computer	Brazil	t	test04@neptunolabs.com
test05	Vicky	Lale	lale	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test05@neptunolabs.com	http://i.imgur.com/rQvLZSZ.png	http://i.imgur.com/X0RFakM.png	Description 05 mouse cellphone glasses	Mexico	t	test05@neptunolabs.com
rapol	Rafael	Pol	rapol	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	rapol32@gmail.com	http://i.imgur.com/oNGVGP3.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Rafael, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	rapol32@gmail.com
jems9102	Juan	Miranda	jems9102	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	j.miranda0291@gmail.com	http://i.imgur.com/eLh5Ex0.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Juan, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	j.miranda0291@gmail.com
ollidab	Edwin	Badillo	ollidab	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	edwin.o.badillo@gmail.com	http://i.imgur.com/egWZYqh.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Edwin, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	edwin.o.badillo@gmail.com
samdlt	Sam	De La Torre	samdlt	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	network.samdlt@gmail.com	http://i.imgur.com/xiOQqxL.jpg	http://neptunolabs.com/images/ckmagic.jpg	Hi, I am Sam, one of the creators of Match up. Please enjoy the service!	Puerto Rico	t	network.samdlt@gmail.com
test06	Kimberley	Honora	honora	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test06@neptunolabs.com	http://i.imgur.com/pSTPtbA.png	http://i.imgur.com/JK3C7Re.png	Description 01 hello dog monkey	United States	t	test06@neptunolabs.com
test07	Hellen	Emerson	emerson	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test07@neptunolabs.com	http://i.imgur.com/RTalBtW.png	http://i.imgur.com/I0kBfi1.png	Description 02 mad scientist hearthstone	United States	t	test07@neptunolabs.com
test08	Bentley	Patterson	patterson	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test08@neptunolabs.com	http://i.imgur.com/0Gl8WWF.png	http://i.imgur.com/pLdYiwr.png	Description 03 we are the world	Mexico	t	test08@neptunolabs.com
test09	Callahan	Jamison	jamison	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test09@neptunolabs.com	http://i.imgur.com/ptNakXV.png	http://i.imgur.com/vrMHPer.png	Description 04 pool states, computer	Brazil	t	test09@neptunolabs.com
test10	Jolyon	Sempers	sempers	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test10@neptunolabs.com	http://i.imgur.com/rQvLZSZ.png	http://i.imgur.com/X0RFakM.png	Description 05 mouse cellphone glasses	Mexico	t	test10@neptunolabs.com
test11	Eduard	Wilson	wilson	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	test11@neptunolabs.com	http://i.imgur.com/pSTPtbA.png	http://i.imgur.com/JK3C7Re.png	Description 11 hello dog monkey	United States	t	test11@neptunolabs.com
papaluisre	Luis	de la Vega	FZN.PaPa	c79505c3d781d0fc54f06349dbbfed7ddb15d2fab5c13cf483cc9cc9e7d57af28d5fce412a8abc701ff312891546ba1b76d9b3dcedbdcf3e93059586309b8220296377bd25902c6ed1c29213a8e0ef5d8f9a08f46b00c00902166a45449d17b97dd8a28b7dbdac2adbfd0919bd85211faf0409edf3b2a96949a9817a12c99d	MRlulYwZbCmI1axGfJsG+aH1xUmVsk1a6V1L5V8GZ+KPr/ODT6pu2/MoHfLdwwaJVv45+/fVfU559cPhC+UyNhSB2YRL9IabymQEaDO8vv2WJZX78PLZWk4273Rm6r4HmmGDjJh/rNZLPYiVR/Y2UM6LrW6CRYr+cIV283mP1VlRhYEVjcmJA4/yn14Z8FO+Dms5ms4iJ6iVYab6s7Zbm6nJ6ObQmpwV+jUKNsHE6XfiWlbWmo/3+AxfeFFt	luisr.delavega@gmail.com	http://i.imgur.com/rOL2WGa.png	http://i.imgur.com/LIJcNna.jpg	HOHO HAHA!	Puerto Rico	t	luisr.delavega@gmail.com
espr_mari	Maricarmen	Vargas	ESPR.Mari	5bfa85c80a6f270919a86958771a06179ceee7e5579b0612a66f77e053dd2a7a30c220af8b2e5867148866c52aaca10c8bdaba443b09bde90f0d3c50266d0046adda88378ef9086d52f63859b0c92d1fa6a2a5ef7e4425d10bd029e865320cdcef5130e7e0ab3e5fdff2ce835e40750155d00a914921c2e58d96dbd08a4e5e	PZhU9XudJxwd/Dj2Q3jHxFcsflpVkvXTQAIEayyaUjT74EnlCEEkZOb6pCCflGmA1hNOu+yJGYCPZRvrRiGpntfXTiOxR/jhsSQxxJqBt/Ptc96UviMNgi+htk0TXkg5xPf+FRBNiT61j/WVRYgOIKHaBTXEI1WC/BUZH6UgKGK44VCpkMePRePrTYPKDgwivPv4kKT8lUaSQlKFUkadbx09p7tSWL47nZxuB22iTHOdqzH5fe/lm8QKC5Pn	\N	http://i.imgur.com/pTeS8YL.jpg	http://i.imgur.com/ArCA5df.jpg	Hello, this is a test account created to show Maricamen the current features available in MatchUp.	Puerto Rico	t	esportspr@gmail.com
hello	Hello	World	helloworld	ed685be09dfe9e81ade076d12710a9d60b1141526beeaa31a22c940690623d64d05a304bc651ac6e9b304f17003a5dc47bd130667356bf4b19fc69aed7dc4ee3debc0fac837d49a200472ced36a473ffaf80f75025e71258b61a71e054bb3480879c899769595832047ffd9fb0aae274fcbba87259f9e3a2d98c45b384f8e5	K7KQqHGmYUmkDN7JT18s0F9m/xRK0O1x8APPIoUeCCqB3IO+iY5RYOvTSPDQZglrZF6mp1Fpda/oyAviyumo2A8z6Vw1IJnpWG0U4VJtUJEq9f8IHEbhutrNqTI0XHnIczMwK75S+puAPIh82AhJ7uqlT/vW5OXC0PzuibOZYrsrFXwM9BSGopwg9VVpkqb9pDGekTg9K0KcvkkLko5wOXV4Xbxaday16QWVNbIQ8lfaMAgQfsl4v9t7Qvwy	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	Hello	Puerto Rico	t	hello@gmail.com
cakeusername	first	last	cake	fdf0067e9a8acf719c4dbb0dfa9a880a98f5ddba724cfe97698eea6570c8eb918c54baa8155e2a102303eda1c13e30dab98c8985ebf19eb6af20fb4f4360ff0e6e93f707d7ab2e98f5b2d43c495f4e8a2f1c873c01c8fdb7b62ccba5199c5c93a3382f0674ee820e333764fa57470175744f1bcc99a2df1fe761df5d0ffaad	BVJ+akftNkTkcfJq3oT5KA50uoprbPrUgJIEdHbb7xeclsk63y6TSE0ZZprT0wVKfr/seMVGh5F0z/VTExxp9vz3U5y1Q5Akrkuk36hIsarI8fuHsx5dUhzHbxjoyI7eyYKROSexIECu+GbLlKAM7sS6jqRgpUwuIktJ39vTastrLYXoobn0JYVI61yuHcrRcFR3devfcEKgryJkjfDDiqrvdDL84kHfzFrtfPk8SykIlkxTSYY2yHI/GhXQ	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	HOHO HAHA!	Puerto Rico	t	cake@yo.com
test_acc	Testerino	Kapparino	Kappa.Tester	1669f684d7ba42bff795fb9fe7c1db6ec1baea5ee4ace90026214b5ac82d156fba11799f22850a76626f785a00f5c498d95a145cc1a00af59105d71e667d4840d7b6af701214f703058eee8a03d406662487774a3bec4e1f376451b0ad6ae1880ba16ada4672fd054f0deafd0f2547fba1dcb41f79081679d5da2ff4d90095	NauBk7Ti3f5Jl6kIepmDX8ldS+uhY6kASsNZePu/yiEaXSJTiJaZi+F9FEbdjelPARDNsqglOADyMV5tLRxLclAVhIAppcGoAwZjQlrIcsLQ6elmc64o6TR5s2DcahvVmVrgO/aGQNRwUrnRbSa2UNj1XkxmOPAZnfX+r4oakoFRY+qduMNQx/2w1kqghlebtLJ0tqa3x6qrM7Cp5zc8Moyv/AKZtJcXLU+rrh3H/8r05gAkjJ/2N5GTC9jk	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	Lorem blahblah	Afghanistan	t	test.kappa@gmail.com
qwe	qwe	qwe	qwe	8a3fdc5b34975bd17aebaff83d5b1c4b549f269d13ecaa1b48d755e2f00263ed93ea16c6e303d0a9a5383a25f1076e81dbd255895d59a1acde251ce6f8aac0445107f3d1b396a7a538ac2236d0c77d769fc9462c7bbff9211d848c5314d276b400e722af5293a70e7fda8b8d43d9f212ac5a8459b1183842bedcf5c0f81a97	3GuyABAxpHQyGR9mrWN+9rqwGNg5cIy0CeeXL1SDt3oMwkOcWERQqRCvxpso97Bo8S4Kzdf+GH8u5yGZXWbzJq4hMLowAXqFtAGRXIJBkbpA+1+HMly0MXkvJvuYdpycnweZczomY5uSlf0hukP8UcPX/SjwpUrlkk4pXc34uAeFvGhdDlbob8SvJ1kLRcQlE8d3r1MBLlFRpVOpfNfCL5GfCggmHgQwBGX4tGU2gVI+RMsiEI5Wl5hng0Zb	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	sdf	Albania	t	qwe@qwe.qwe
popupTestAgain	popo	pipo	papo	b317ff62e40e184290d53c1716e2c0a6126791815d2ff6fd4fb3a0a4f909f08e9979a9248341e45f3b8eed4d28b288d48ff90438f7059bf8a1e111b638105cea85bf4ef4093c308cdabbd816756a0513aa9f9e42b354aaf80a1bac5d06ada21e63331b01c6b9c45763a270b7055b4bb5a130839fc9a8ce53601b378767c3e8	u9BuDV/8j+LzBpJdRnXVxrlR3nPM0UM5HSNxK3oLID2GBfgWb20QlRh6y1ZU8dofsT8xviBjgTqfRRov/W4uPoaBv+ULJd3NcQ/NMchrh+4xxmIEhTpz1YxJY8FkYLiS3ulp+w3JSBnCCntYwdeyHjzJAQMi6maeuGGRxesuhmi3GiFkWL9q6sC0VKEKW12bwzW7RPWfDahCwFRn3sP5UHFxu42gNaGHIiQxcGE7NIsb38uzHzqQ/mWmg7+N	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	Hello	Puerto Rico	t	popup@gmail.com
FZN.rosa	Rosa	Merleño	rosa_merleño	b997a22d1abfbefb5799ef60c742333e5b5db643c55758874e617b62f291a62cf7b9e4251c7cbb327f5fd1d3dfe3a9cb35c8712cc8251532cd340df589191a867ee77c8cc53a47f97a8e518b68105c68beb398abb995a31266d1ee4e8837ecfde22e17074c0999786c049bd136dd886344eb132fd707797327e4e7b198d29b	W23hhsYy+QCcv7aY6ClJPzgSMexPLgzuYvDsOuIV7I09jZzOuKbseYyO59rljWYXN6EBaK5weVq2aKL30knT1NkGQTdPNx/5ggsVfq4tDT90Zyo+qCrRoQv9MDfCDJzwgS3GhPTdCbYVlYfz7txbI5Fqys/2Vs8MEx7qNweKGMOqrLm2mzlfBYtbzFzAJfmDJNywodBCovC8NPXCw8ok1tTvISxTy4efCla/4JZizdX6VkICsPofO0nXULKS	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	HOHO HAHA!	Puerto Rico	t	rosa.merleno@gmail.com
thisWillWork	Yes	No	YesMan	ba5b7a899f8aa58b590a810c9ed15e209d61f006e69f761b7d1981ea68fe7f9f62e711824ca2ae73cdc6dc11c57648b8c2a5e80d0617907871978962ab0c4b7df24d686ce949408b8be754585354902532a1dd656614c4033559348ca6ae5ab80711880b429d63a3e3342ddf5e3f56b512cdb27b58da37990f5dd7039d9fbf	luGvZRMzZEZY+0/+Mwm2T9r3CPsYfb+KpU5/N1w2vRtFd4QFuFjdbMNSOf5oEabMV3REo6XemUZIws9HY1YctJCKhDMHUrdKp8mGFH7r1GUX0c5VKYVe9RWWMggtEB9n/qHC4rY3Gz/7/0AZ9wuC1OeteM7R1Yxy/glxvWXSe/aaADxqVpog0yYfpTO5RCXO4a7Kn+p8YKQLWpHWjDV9YCNgnVz96oF33JxTR4nbfwZjOc7FFBi6MckmF1Mx	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	HOHO HAHA!	Puerto Rico	t	working@gmail.com
mobileTestSam	Sam	Sam Sam	Tester201	516880f8210bb0a0ce50492aaf827c87d38083a513f6230c8b9b5583f09a287a3e2674984daa081588b8cc1c38e33f5b20cd5760bf2bf282f9c90c50f7f8136805c5b5e4e99fae0167a2ebb7edc422abfe56f04d8170e8b34510068b33e4b56c8894d8662828e55fe13dbf9a3a93ef4eef9b07a68873a958074a00e57ccb01	AljEH5YkPUGeU1Ms2GOpKFUIQO3UTtRqUoff34Xwc+rTHtjUbSIVLNsrlM+7TdyCpgT+t00ndGM9dHfgiWSEEvzt7LoshqeVpTwCnlUjl0bKSg3HBv7M1HqdjfsW9E8QH11JV9eCv8qj4HSqiSuxPmi1Gw2GsB9s/0PhUGXhNGUS6lJehKAwQebq2WCGWsyVErISiavqhBleVK+rkpg4icUR3jFXqzJ4r+bUXuSBAzOLAASm9Z57KaBxeGya	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	Hello	Puerto Rico	t	testytest@gmail.com
rodolfo	Rodolfo	Inoa	Fufo	886a0e4118470b5dd29b831f42250e2bac6196fa430862ec1d9f6a2337684624e954be3e42d4294c7c4d6673422a6aec662e18d593f040cd017f53e0e681eeea318500e1fd63ffd724fdf979c38bc26b7703f6b810cdcbfdf6c3d41839f9daa760771f3525dc1e5e017f528571f8fb003540ea6b43f026715c3c97212b13df	uiNvcXs+5HibNCmu2CdXSWwDu0el4whOmAYntDTPUz96Y4yDAjhhp7jHH+c/55kyTpRaOoT4A0bBBHYu6A9BCB5PFlR01Pa2RxwbFzclQiVfxnwDoNZkMbO6Qo4A4Dmv1tNYNkcnN5BY8M/2tF/N62GouuAyykbWD6M4ik/Uxv0zK+KuCCHpkg7+iAPsmi5SPIJPqXAP/CTn+nLzxshcMA9QkyPUZhJoLzuysUOqWCfLiK3Wv1m9SIAFbUSE	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	HOHO HAHA!	Mexico	t	paudbb@gmail.com
testing_acc	Test	Tester	FZN.test	32efda2381ae33e1481b8b97a8147795f400af9143b8202aa986b93214111c43cb89f7acb37eeaefb3c4212de16d599a6290644e54221e57c384be63eb778c5f287ccd70a7d8e2196a8633de650a7e21f91dafc7470e1374be256f5e9aae786f695e2dfbf338f682f499fd5bb22ba85dd7f58e8c7e9648a2541df683be89e5	VGCaUGzZs/txtHYH+j9ZmW0Cy+0lUphNaj0ZU827b6bR1arHboBFFbqqLkMgmT7053HbOeTS752NkKykEAn8z/c+O1uOT3iKAhWPc1jJ4eWxMSuCK7k9HqO7owGVv7ytIMQO+RUgOIQo3dB7VrfeXmSOeQRb+QvTdMjVjzLA0f8051EvFI9EEl1pCkGos4LKY8tELWO/qzI/R+iV0+6k7CNhK3DoVLz4a+NmvsbkW6DfGPwG+NPmiK/RQEqy	\N	http://i.imgur.com/rQvLZSZ.png	http://i.imgur.com/9FMqsQN.jpg	Hello	Puerto Rico	t	test@gmail.com
popupTestAccount	Popo	Papa	Pipo	bf9c59c30a30110c0595040d2084cd1edb96d5ed88a9c3e350afed6ff0b9c30bb619bc8f9c0352e168c9692f5e27a643a3a604fd23683f144a7153d2a8f18bbb181f529a7a336a04ab0de06d6c8e31328998eb4db6940ed78bc6c3d13704d4ae426da64be2527e00c568caad22cdd6f707b8eab6c5a70d15f3a05bd1d60d68	W5AAxQapfN8Lrv7DA+SRjCAjTbOHZ7Re0Ek5NOv4fzddFi0okhDLk9M0nRTWJUd6Ryqit4JS0DPJGg8MRkmk+T+z0Ppjx56aCpnilMDrPHndMj0Uf8gMhGtKgDBcOnF736KNHdfDlUIZ4SlPA1K6TH8xl3rJB8/6g7MqBWUYSvHUbH+DZwsy7Vx1vZC3y0qq5L8ClD+7LvjP9BvjuhpNK/+9Dzzq0PtibYUHrmVj9sgKAWRjjTOIq8CkR9ip	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	Hello	Puerto Rico	t	popping@gmail.com
testingNewLine	Bienve	Velez	La Bestia	1518571befc946fd8a517fe3870d86546d0675dfddc438ca2cf9af397a35140cae452b7622c6146f58aaccd37c8d1c0a031c3dbaabf10e1c4f386bc1304465200181773555eb20bb079f603fdd629e007b3f6cea7a2f6b0d2c7bbc1eac30f9233c72e1782a6eb6d258f320b9e410896d2fca6c3fc219c981de2b0002ce1820	NJG+/Q75i7hb2rFmzxFAiwth0HIG7R9MJM+mgVRKavWv/saCsEWPXxjpSOGRzUwhkW+vARE0q3y44t+eR9DVjBr4X7xVF6xOA+TA3U3UrSIsWJD3JLuzvH9wxsdvQt9KMcrdXpZJM685iX2e4BH3BKxphxVBH7+D6m/nFM37L+C6MeRI7z1K2346+WNPfy2DaNiDgjeOjW0hS6dy1KMt/gHF2faV14bmr5f85WcO6ljtrMgdaTRH+H+fqVRf	\N	http://i.imgur.com/vH5hiFw.jpg	http://i.imgur.com/XvTEBuN.jpg	Hello	Puerto Rico	t	lines@gmail.com
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: root
--

COPY event (event_name, event_start_date, event_location, customer_username, event_venue, event_banner, event_logo, event_end_date, event_registration_deadline, event_rules, event_description, event_active, event_deduction_fee, event_is_online, event_type) FROM stdin;
Event 02	2015-05-05 09:00:00	miradero	rapol	Colosseum	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-05-07 22:00:00	2015-04-23 09:00:00	These would be the rules for a test event.	Event 02 event to make sure the SQL queries and server integration work	t	2.00	f	Local
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	Bosque 51	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2025-10-22 22:00:00	2025-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	4th Event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Event 05	2025-11-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test02	Brisas del Bosque	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2025-11-22 22:00:00	2025-11-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	4th Event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	rapol	Hilton Activity Room	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-11-20 09:00:00	2015-12-04 09:00:00	Some rules for testing stuff	Event 07 Just testing Round Robin	t	2.00	f	Local
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	test02	Activity Room	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-11-20 09:00:00	2015-11-05 09:00:00	Some rules for testing stuff	Event 09 Just filling	t	2.00	f	Local
Event 03	2015-03-27 09:00:00	miradero	rapol	Colosseum	http://neptunolabs.com/images/event-demo/Aftershock1.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-05-27 09:00:00	2015-03-25 09:00:00	These would be the rules for a test event.	Event 02 event to make sure the SQL queries and server integration work	t	2.00	f	Local
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	test02	Activity Room	http://neptunolabs.com/images/event-demo/First-Attack-scaled-440x183.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-11-20 09:00:00	2015-11-05 09:00:00	Some rules for testing stuff	Event 08 Just filling	t	2.00	f	Local
First Test	2015-10-19 09:00:00	miradero	ollidab	S-113	http://neptunolabs.com/images/event-demo/Optic-FIber-Gaming-Event.png	http://neptunolabs.com/images/matchup-logo.png	2015-10-22 22:00:00	2015-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	First Test event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Event 01	2015-03-25 09:00:00	miradero	ollidab	Student Center 3rd Floor	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-05-25 09:00:00	2015-03-23 09:00:00	These would be the rules for a test event.	Event 01 event to make sure the SQL queries for the tournament bracket and groups are working correctly	t	2.00	f	Local
First Regular Event	2015-04-25 04:00:00	Darude Sandstorm	ollidab	Radiant	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-26 04:00:00	2015-04-24 22:30:00	No rules. RIP in pepperoni Prise :(	Very short Description	t	0.00	f	Regional
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	ollidab	Mr. Willie	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-27 03:55:00	2015-04-24 15:15:00	No plebs	This is a boring description	t	5.00	f	National
Second Premium	2015-04-25 04:00:00	Online	ollidab	Online	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-27 03:55:00	2015-04-24 18:30:00	adsfasdfasdfasdf	sadfasdf	t	10.00	t	National
Testing Github Regular	2015-04-24 04:00:00	Online	ollidab	Online	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-26 03:55:00	2015-04-24 03:00:00	Rules Rules Rules Rules Rules Rules	Description Description Description Description Description	t	0.00	t	Regional
sdaf	2015-04-25 13:05:00	Online	rapol	Online	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-27 03:00:00	2015-04-25 05:05:00	dsf	sdf	t	0.00	t	Local
SPACE	2015-04-29 04:00:00	Online	ollidab	Online	http://i.imgur.com/dcCO3dQ.jpg	http://i.imgur.com/oNEDvcF.jpg	2015-05-01 03:55:00	2015-04-28 22:50:00	IN-TER-STE-LLAR	SO MUCH SPACE	t	0.00	t	Local
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	espr_mari	Teatro Braulio Castillo	http://i.imgur.com/UYqlKOo.jpg	http://i.imgur.com/nk9nni8.png	2015-06-08 01:00:00	2015-06-02 04:00:00	Reglas Detalladas de LCPR: http://goo.gl/wxjrVt\n\nReglas Detalladas de Beta Collegiate League: http://goo.gl/PvbLHf	El torneo presencial llamado RETRIBUTION, consistirá de los mejores 4 equipos de Puerto Rico, escogidos mediante torneos clasificatorios bajo estas dos ligas:	t	10.00	f	Regional
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	ollidab	Centro de estudiantes	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-28 03:55:00	2015-04-25 04:00:00	Where we're going there are no rules	Something something something dark side	t	25.00	f	Local
Regular Event Playground EDIT 3	2015-04-29 04:00:00	Location	test02	Venue	http://i.imgur.com/r5n59uKl.jpg	http://i.imgur.com/tcy7rY3b.jpg	2015-04-30 04:00:00	2015-04-27 04:00:00	Rules EDIT 1	Description EDIT 1	f	0.00	f	Regional
FIRST TEST	2015-04-27 04:35:00	sdf	test01	sdf	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-29 04:00:00	2015-04-27 04:34:44	sdf	sdf	t	0.00	t	Local
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	ollidab	Hilton Activity Room	http://neptunolabs.com/images/event-demo/WC.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-10-22 22:00:00	2015-10-15 09:00:00	Rules, rules, rules, rules, rules, rules, rules, and rules	Event 06 event to make sure the SQL queries and database is working correctly	t	2.00	f	Local
Input test	2015-04-27 22:00:00	UPR Mayaguez	papaluisre	Redes	http://neptunolabs.com/images/ckmagic.jpg	http://i.imgur.com/xUIMYox.jpg	2015-04-30 22:00:00	2015-04-27 21:55:00	HOHO HAHA!	HOHO HAHA!	t	8.00	f	National
Test Event	2015-05-15 23:00:00	Event Location	test02	Event Venue	http://neptunolabs.com/images/logoPlain.png	http://neptunolabs.com/images/matchup-logo.png	2015-05-17 21:00:00	2015-05-15 02:00:00	Event Rules	Event Description	t	5.00	f	National
Team Test	2015-04-28 02:55:00	hey	ollidab	yo	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-04-29 03:00:00	2015-04-28 02:50:00	this is how	Hey	t	0.00	f	Local
Test Competitor	2015-05-02 17:00:00	Miradero	papaluisre	Casa de Luis	http://i.imgur.com/0A5dRXB.png	http://i.imgur.com/No0hmde.png	2015-05-06 17:00:00	2015-05-02 16:00:00	Lorem blahblah	Lorem blahblah	t	25.00	f	National
Team test	2015-05-01 04:00:00	Hey	rapol	yo	http://neptunolabs.com/images/ckmagic.jpg	http://neptunolabs.com/images/matchup-logo.png	2015-05-03 03:55:00	2015-05-01 02:50:00	Rules	Description	t	0.00	f	Local
Test Spectator	2015-05-02 17:00:00	UPRM	papaluisre	Lab de Redes	http://i.imgur.com/mH4l2Gb.png	http://i.imgur.com/MAxilrE.png	2015-05-06 17:00:00	2015-05-02 16:00:00	Here would be the rules	Event for testing	t	15.00	f	Regional
\.


--
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: root
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
Ultimate Marvel vs. Capcom 3	http://neptunolabs.com/images/games/Ultimate Marvel vs. Capcom 3.png
Tekken 7	http://neptunolabs.com/images/games/Tekekn 7.jpg
\.


--
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: root
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
-- Data for Name: group; Type: TABLE DATA; Schema: public; Owner: root
--

COPY "group" (event_name, event_start_date, event_location, tournament_name, group_number) FROM stdin;
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	1
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	2
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	1
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	2
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	1
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5
\.


--
-- Data for Name: has_a; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	2
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	5
\.


--
-- Data for Name: hosts; Type: TABLE DATA; Schema: public; Owner: root
--

COPY hosts (event_name, event_start_date, event_location, organization_name) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	NeptunoLabs
Event 01	2015-03-25 09:00:00	miradero	NeptunoLabs
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Org ollidab
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	NeptunoLabs
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Org 02
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Org 02
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	Test Org ollidab
Second Premium	2015-04-25 04:00:00	Online	Test Org ollidab
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	E-Sports PR
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	NeptunoLabs
Input test	2015-04-27 22:00:00	UPR Mayaguez	NeptunoLabs
Test Event	2015-05-15 23:00:00	Event Location	Test Org 01
Test Spectator	2015-05-02 17:00:00	UPRM	NeptunoLabs
Test Competitor	2015-05-02 17:00:00	Miradero	NeptunoLabs
\.


--
-- Data for Name: is_a; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	6	test02
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	test04
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	test05
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	test01
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	test02
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	test07
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	test08
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	papaluisre
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	samdlt
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	First Visual Novel Tournament	1	rapol
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	1	rapol
sdaf	2015-04-25 13:05:00	Online	sdf	1	test02
Event 02	2015-05-05 09:00:00	miradero	Smash Bros. Melee Weekly	1	test02
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	First Visual Novel Tournament	2	test02
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	2	test02
sdaf	2015-04-25 13:05:00	Online	sdf	2	test03
Event 02	2015-05-05 09:00:00	miradero	Smash Bros. Melee Weekly	2	test04
Second Premium	2015-04-25 04:00:00	Online	Tourney 2	1	test02
Second Premium	2015-04-25 04:00:00	Online	Tourney 2	1	samdlt
Second Premium	2015-04-25 04:00:00	Online	Tourney 2	1	papaluisre
Second Premium	2015-04-25 04:00:00	Online	Hearth Tourney	1	test04
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 02	1	samdlt
Team test	2015-05-01 04:00:00	Hey	Another Tourney	4	jems9102
Team test	2015-05-01 04:00:00	Hey	Another Tourney	4	samdlt
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	2	test03
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	4	test05
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	6	samdlt
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	8	test06
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	10	test10
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	1	test02
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	2	ollidab
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	3	papaluisre
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	testing_acc
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	rapol
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	test02
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	test01
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	test04
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	6	test03
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	7	test05
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	8	test06
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	9	test07
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	10	test08
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	11	test09
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	12	test10
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	13	test11
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	14	samdlt
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	1	test01
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	3	test02
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	5	test04
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	7	test07
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	9	test09
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	11	test11
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	papaluisre
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	rapol
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	test04
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	test05
Team Test	2015-04-28 02:55:00	hey	tourney 1	3	ollidab
Team Test	2015-04-28 02:55:00	hey	tourney 1	3	samdlt
Test Event	2015-05-15 23:00:00	Event Location	Test Tournament	1	samdlt
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	test06
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	test08
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	test04
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	test05
Team test	2015-05-01 04:00:00	Hey	Another Tourney	3	test01
Team test	2015-05-01 04:00:00	Hey	Another Tourney	3	papaluisre
\.


--
-- Data for Name: is_confirmed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY is_confirmed (sponsor_name, sponsor_link, organization_name) FROM stdin;
Mario S. Fong Photography	https://www.facebook.com/MSFPhoto	NeptunoLabs
BANDI TECH	http://gobanditech.com/	NeptunoLabs
Fighting Games Arena	https://twitter.com/FGAPR	NeptunoLabs
See Puerto Rico	http://www.seepuertorico.com/	NeptunoLabs
American Petroleum	http://www.americanpetroleumpr.com/	NeptunoLabs
FIRST ATTACK	http://www.firstattackpr.com/	NeptunoLabs
Team RagnaroK	https://twitter.com/TeamRagnarokPR	NeptunoLabs
E-Sports PR	http://esportspr.com/	Test Org ollidab
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	2
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	5	2
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	4	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	5	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	6	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	9	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	13	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	12	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	7	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	10	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	8	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	11	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	5
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	14	5
\.


--
-- Data for Name: is_of; Type: TABLE DATA; Schema: public; Owner: root
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
Ultimate Marvel vs. Capcom 3	Fighting
Tekken 7	Fighting
\.


--
-- Data for Name: is_played_in; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	2
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	1	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2	4
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	1
\.


--
-- Data for Name: is_set; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Loser	1	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Loser	1	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Loser	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Loser	1	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Loser	1	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Loser	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Loser	1	1	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Loser	1	2	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Loser	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	1	t
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	1	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	2	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	3	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	1	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	2	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	3	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	1	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	2	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	3	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	2	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	3	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	2	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	3	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	1	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	2	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	3	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	3	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	3	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	1	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	3	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	3	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	3	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	3	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	4	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	4	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	4	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Winner	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Winner	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Winner	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	2	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	2	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	2	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	2	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	3	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Loser	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Loser	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Loser	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Loser	1	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Loser	1	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Loser	1	3	f
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	1	1	f
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	1	2	f
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	1	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	1	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	1	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	2	t
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	3	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	1	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	2	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	3	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	1	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	2	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	3	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	Winner	1	1	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	Winner	1	2	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	Winner	1	3	f
\.


--
-- Data for Name: match; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	1	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Loser	1	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Loser	1	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Loser	1	f	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	1	f	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2	f	f
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	1	f	f
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	f	t
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	f	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	4	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	3	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	4	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	3	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	4	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	f	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	f	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	f	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	f	t
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	3	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	4	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Winner	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	2	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Loser	1	f	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Loser	1	f	f
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	1	f	f
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	f	t
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	1	f	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2	f	f
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	Winner	1	f	f
\.


--
-- Data for Name: meetup; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Test	edit	2015-03-24 09:00:00	2015-03-24 11:00:00	Test	test02
Event 01	2015-03-25 09:00:00	miradero	sdf	sddfe	2015-04-29 15:35:00	2015-05-08 14:25:00	sdf	test04
Event 01	2015-03-25 09:00:00	miradero	zxczxczxc	dfgzxc	2015-04-30 22:30:00	2015-05-20 17:30:00	dfg	test04
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	dfs	Testing	2015-04-14 13:25:00	2015-04-23 18:10:00	HOOOHO HAHAHA	ollidab
Input test	2015-04-27 22:00:00	UPR Mayaguez	sdaf	sdf	2015-04-28 04:00:00	2015-04-28 04:00:00	sdf	rapol
\.


--
-- Data for Name: news; Type: TABLE DATA; Schema: public; Owner: root
--

COPY news (event_name, event_start_date, event_location, news_number, news_title, news_content, news_date_posted) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	1	Test News 01 Updated	This message has been updated. :D So this is a news article. So I think I am gonna go ahead and do that.	2015-03-26 09:00:00
Event 01	2015-03-25 09:00:00	miradero	2	Test News 02	This is a second news test, just making sure everything is right with the world	2015-03-27 04:00:00
Event 01	2015-03-25 09:00:00	miradero	3	Test News 03	Here we go again, just making sure everything is right with the world	2015-03-27 05:00:00
Event 01	2015-03-25 09:00:00	miradero	4	Test News 04	Do not worry just one more of these and i will stop	2015-03-27 06:00:00
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2	Heydf ddf sdfs dfsdf	yoo d	2015-10-19 09:00:00
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	4	This is an update	First created	2015-04-22 14:36:13
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3	This is an update. Again	First created #1 update	2015-04-22 14:11:42
Event 01	2015-03-25 09:00:00	miradero	5	Edit	HELLLOOOOOOOO!!!	2015-03-27 07:00:00
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	5	im at it again	GEOOFF GEOOFF	2015-04-27 01:10:02
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: root
--

COPY organization (organization_name, organization_logo, organization_bio, organization_cover_photo, organization_active) FROM stdin;
Test Org papaluisre	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org 01	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org 02	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org 03	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test Org ollidab	http://neptunolabs.com/images/matchup-logo.png	This is a test organization from the people that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
NeptunoLabs	http://neptunolabs.com/images/matchup-logo.png	This is the organization that brought you this applicati	http://neptunolabs.com/images/logoPlain.png	t
E-Sports PR	http://i.imgur.com/MfNfQqT.png	EsportsPR is the biggest organization that promotes competitive gaming in Puerto Rico	http://i.imgur.com/f6csGBg.png	t
\.


--
-- Data for Name: owns; Type: TABLE DATA; Schema: public; Owner: root
--

COPY owns (organization_name, customer_username) FROM stdin;
Test Org papaluisre	papaluisre
Test Org 01	test01
Test Org 03	test03
Test Org 01	test03
E-Sports PR	espr_mari
NeptunoLabs	ollidab
NeptunoLabs	jems9102
NeptunoLabs	papaluisre
Test Org ollidab	rapol
Test Org 02	test04
\.


--
-- Data for Name: pays; Type: TABLE DATA; Schema: public; Owner: root
--

COPY pays (event_name, event_start_date, event_location, spec_fee_name, customer_username, check_in) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Opening Day Pass	test04	f
First Test	2015-10-19 09:00:00	miradero	3-day Pass	test05	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3-day Pass	test01	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3-day Pass	test02	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2-day Pass	test03	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1-day Pass	test04	f
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	test04	t
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	test10	t
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	test03	t
Second Premium	2015-04-25 04:00:00	Online	Fee 2	test04	f
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	Fee 1	rapol	f
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	All Access Pass	rapol	f
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	All Access Pass	papaluisre	f
Event 01	2015-03-25 09:00:00	miradero	2-day Pass	test02	t
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	Two-day Pass	jems9102	f
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	All Access Pass	test02	f
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	All Access Pass	ollidab	f
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2-day Pass	samdlt	f
Event 01	2015-03-25 09:00:00	miradero	Finals Day Pass	samdlt	f
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	All Access Pass	samdlt	f
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	Two-day Pass	testing_acc	f
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	One-day Pass	samdlt	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	lkhjbasfde	rapol	t
First Test	2015-10-19 09:00:00	miradero	test2	test01	t
First Test	2015-10-19 09:00:00	miradero	Testing sold again	test04	f
First Test	2015-10-19 09:00:00	miradero	fgd	test03	f
\.


--
-- Data for Name: plays_for; Type: TABLE DATA; Schema: public; Owner: root
--

COPY plays_for (customer_username, team_name) FROM stdin;
ollidab	NeptunoLabs
ollidab	Test_Team
test01	test team 01
test04	test team 04
test06	test team 06
test07	test team 07
test10	test team 10
test05	test team 04
test11	test team 10
papaluisre	NeptunoLabs
jems9102	NeptunoLabs
test08	test team 06
test08	test team 07
test07	Team Delete
test08	Team Delete
test07	Team Delete 2
test08	Team Delete 2
test07	Team Delete 3
test08	Team Playground
rapol	Team Playground
rapol	last delete
papaluisre	test team 01
thisWillWork	LTLP
samdlt	LTLP
\.


--
-- Data for Name: prize_distribution; Type: TABLE DATA; Schema: public; Owner: root
--

COPY prize_distribution (prize_distribution_name, first, second, third) FROM stdin;
None	0	0	0
Standard	70	20	10
First and Second	70	30	0
Winner Takes All	100	0	0
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: root
--

COPY report (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, report_number, report_description, report_image, report_date, report_type, report_status) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	2	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station	Received
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	1	1	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station	Received
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	1	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score	Received
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	2	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station	Received
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	1	1	hello rafa	null	2015-04-29 16:07:33	Missing Competitor	Resolved
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	2	1	got mad and left :(	null	2015-04-29 15:31:41	Missing Competitor	Attending
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	1	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station	Resolved
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	1	3	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score	Resolved
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2	3	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score	Resolved
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	1	1	The stations Gamecube isnt Working.	http://neptunolabs.com/images/gc.jpg	2015-03-25 09:00:00	Station	Attending
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	1	3	1	Incorrect Score Submitted.	http://neptunolabs.com/images/score.png	2015-03-25 09:00:00	Score	Resolved
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	1	4	fvdsafasdasd	null	2015-04-29 17:27:51	Station	Resolved
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	1	2	test Station Malfunction from client	null	2015-04-29 17:18:35	Station	Resolved
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	1	3	Test Score Dispute from client	null	2015-04-29 17:18:45	Score	Resolved
\.


--
-- Data for Name: request; Type: TABLE DATA; Schema: public; Owner: root
--

COPY request (request_organization_name, customer_username, request_description, request_status) FROM stdin;
Test Request Organization	ollidab	A test organization request, this may or not be accepted	Received
Test Org 01	test01	Hi, Im looking to get my organization 01 set up.	Declined
Test Org 02	test02	Hi, Im looking to get my organization 02 set up.	Declined
Test Org papaluisre	papaluisre	Hi, Im looking to get my organization 04 set up.	Accepted
Test Org rapol	rapol	Hi, Im looking to get my organization 03 set up.	Pending
NeptunoLabs	ollidab	This is the organization that brought you this application!	Accepted
Test Org ollidab	ollidab	Hi, Im looking to get my organization ollidab set up.	Accepted
League of Legends PR	espr_mari	fuhiksdfuh jho'asdfjklb hlasdjh sdfuh jho'asdfjklb hlasdjhl	Received
E-Sports PR	espr_mari	EsportsPR is the biggest organization that promotes competitive gaming in Puerto Rico.	Accepted
Test Fake Organization	ollidab	fake organization used for testing the request feature	Received
wer	ollidab	wer	Received
sdf	ollidab	sdf	Received
My first org	test08	this is a test I WANT TO SHOW YOU THE WOORLLD SHINNING SHIMMERING EXPLENDID OMY GAUUUD NO SCOOPE	Received
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
http://google.com	gjhigdwsklfcboklj asdljbjkl	NeptunoLabs	Received
http://facebook.com	yup... facebook wants to sponsor me	NeptunoLabs	Received
http://doihaveintert.com	sponsor with big money	E-Sports PR	Received
\.


--
-- Data for Name: review; Type: TABLE DATA; Schema: public; Owner: root
--

COPY review (event_name, event_start_date, event_location, customer_username, review_title, review_content, star_rating, review_date_created) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	test01	Greatest Test Event Ever!	Best experience ever, if other events hosted by Neptuno Labs are like this then I am in	5	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test02	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	3	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test03	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	4	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test04	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	2	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	test10	Lorem ipsum dolor sit amet!	Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at lacus lacinia, pulvinar orci ac, elementum ligula. Donec gravida elementum tortor, vitae lacinia turpis finibus tincidunt. Suspendiss	1	2015-03-25 09:00:00
Event 01	2015-03-25 09:00:00	miradero	papaluisre	Testing	edit	3	2015-04-18 07:18:38
\.


--
-- Data for Name: round; Type: TABLE DATA; Schema: public; Owner: root
--

COPY round (event_name, event_start_date, event_location, tournament_name, round_number, round_of, round_start_date, round_pause, round_completed, round_best_of) FROM stdin;
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	2015-03-25 11:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	2015-03-25 11:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	2015-03-25 11:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2015-06-05 11:00:00	t	f	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2015-06-05 11:00:00	t	f	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Loser	2015-06-05 11:00:00	t	f	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Loser	2015-06-05 11:00:00	t	f	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Loser	2015-06-05 11:00:00	t	f	3
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2015-10-19 11:00:00	t	f	3
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	2015-10-19 11:00:00	t	f	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	2015-04-29 01:31:38	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Winner	2015-04-29 05:47:34	f	f	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	3	Winner	2015-03-25 11:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	2	Winner	2015-03-25 11:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	1	Winner	2015-03-25 11:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2015-06-05 11:00:00	t	t	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Group	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Winner	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Winner	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Winner	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Winner	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Winner	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Loser	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	2	Loser	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Loser	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	4	Loser	2015-04-27 23:00:00	t	f	3
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	5	Loser	2015-04-27 23:00:00	t	f	3
Team Test	2015-04-28 02:55:00	hey	tourney 1	2	Winner	2015-04-28 03:00:00	t	f	3
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	2015-04-28 03:00:00	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	2015-04-29 01:50:35	t	t	3
Team test	2015-05-01 04:00:00	Hey	Another Tourney	1	Winner	2015-04-29 20:55:00	t	f	3
Team test	2015-05-01 04:00:00	Hey	Another Tourney	2	Winner	2015-04-29 20:55:00	t	f	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	2015-04-29 01:52:41	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	2015-04-29 02:54:59	f	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	2015-04-29 05:43:24	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2015-04-29 05:43:37	f	t	3
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2015-04-29 05:44:01	t	t	3
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Winner	2015-04-29 05:47:28	t	f	3
\.


--
-- Data for Name: shows; Type: TABLE DATA; Schema: public; Owner: root
--

COPY shows (event_name, event_start_date, event_location, sponsor_name) FROM stdin;
First Test	2015-10-19 09:00:00	miradero	BANDI TECH
First Test	2015-10-19 09:00:00	miradero	See Puerto Rico
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	E-Sports PR
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	E-Sports PR
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	See Puerto Rico
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	BANDI TECH
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	BANDI TECH
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	BANDI TECH
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	FIRST ATTACK
Second Premium	2015-04-25 04:00:00	Online	FIRST ATTACK
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	BANDI TECH
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	See Puerto Rico
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	American Petroleum
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	Team RagnaroK
First Test	2015-10-19 09:00:00	miradero	Mario S. Fong Photography
First Test	2015-10-19 09:00:00	miradero	FIRST ATTACK
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	American Petroleum
Event 01	2015-03-25 09:00:00	miradero	BANDI TECH
Input test	2015-04-27 22:00:00	UPR Mayaguez	Mario S. Fong Photography
Input test	2015-04-27 22:00:00	UPR Mayaguez	See Puerto Rico
Input test	2015-04-27 22:00:00	UPR Mayaguez	American Petroleum
Input test	2015-04-27 22:00:00	UPR Mayaguez	FIRST ATTACK
Test Spectator	2015-05-02 17:00:00	UPRM	BANDI TECH
Test Spectator	2015-05-02 17:00:00	UPRM	Fighting Games Arena
Test Spectator	2015-05-02 17:00:00	UPRM	See Puerto Rico
Event 01	2015-03-25 09:00:00	miradero	FIRST ATTACK
Event 01	2015-03-25 09:00:00	miradero	Fighting Games Arena
Event 01	2015-03-25 09:00:00	miradero	American Petroleum
Event 01	2015-03-25 09:00:00	miradero	Team RagnaroK
Test Competitor	2015-05-02 17:00:00	Miradero	Mario S. Fong Photography
Test Competitor	2015-05-02 17:00:00	Miradero	Fighting Games Arena
Test Competitor	2015-05-02 17:00:00	Miradero	See Puerto Rico
Test Competitor	2015-05-02 17:00:00	Miradero	American Petroleum
Test Competitor	2015-05-02 17:00:00	Miradero	FIRST ATTACK
Test Competitor	2015-05-02 17:00:00	Miradero	Team RagnaroK
\.


--
-- Data for Name: spectator_fee; Type: TABLE DATA; Schema: public; Owner: root
--

COPY spectator_fee (event_name, event_start_date, event_location, spec_fee_name, spec_fee_amount, spec_fee_description, spec_fee_amount_available) FROM stdin;
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	2-day Pass	15.00	General Admission to the last two days. Note: Final Round does not included seating area	100
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1-day Pass	8.00	General Admission to the first day.	50
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	2-day Pass	15.00	General Admission to the last two days. Note: Final Round does not included seating area	100
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	1-day Pass	8.00	General Admission to the first day.	50
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	200
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	Fee 1	12.12	ONLY 12 TICKETS AT $12.12	12
Second Premium	2015-04-25 04:00:00	Online	Fee 1	10.00	lsjdflj oisfosi jfo	123
Second Premium	2015-04-25 04:00:00	Online	Fee 2	322.00	dsfga sdg	23
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	All Access Pass	15.00	Incluye participación en varios sorteos \nLos 4 equipos que clasifican NO tienen que pagar registro de espectador por 5 miembros del equipo. \n**ESPACIOS LIMITADOS **	300
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	One-day Pass	15.00	Go the first day. Miss the good stuff.	100
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	Two-day Pass	25.00	Some descri[pkjhbsdgryiugfrve	100
Input test	2015-04-27 22:00:00	UPR Mayaguez	lkhjbasfde	3.50	ojuhbvgewarf	100
Test Event	2015-05-15 23:00:00	Event Location	General admission	20.00	Fee Description	300
Event 01	2015-03-25 09:00:00	miradero	Opening Day Pass	10.00	General Admission to the first day.	100
Event 01	2015-03-25 09:00:00	miradero	Finals Day Pass	10.00	General Admission to the last day of the event where the final rounds will be held.	100
Event 01	2015-03-25 09:00:00	miradero	3-day Pass	25.00	General Admission to the first three days.	100
Event 01	2015-03-25 09:00:00	miradero	2-day Pass	18.00	General Admission to the first two days. Note: Does not Include Final Round	100
First Test	2015-10-19 09:00:00	miradero	test2	12.10	djsflkj	1
First Test	2015-10-19 09:00:00	miradero	Testing sold again	12.12	Hey	1
First Test	2015-10-19 09:00:00	miradero	3-day Pass	25.00	General Admission to the first three days. Note: Final Round does not included seating area	1
First Test	2015-10-19 09:00:00	miradero	fgd	123.00	sd	1
Test Spectator	2015-05-02 17:00:00	UPRM	One-Day Pass	10.00	Attend only for one day	100
Test Spectator	2015-05-02 17:00:00	UPRM	Two-Day Pass	15.00	Attend two days	100
Test Spectator	2015-05-02 17:00:00	UPRM	Complete Event Pass	25.00	Full Event	75
Test Spectator	2015-05-02 17:00:00	UPRM	VIP Pass	30.00	VIP only	20
Test Competitor	2015-05-02 17:00:00	Miradero	One-Day Pass	15.00	Lorem blahblah	100
Test Competitor	2015-05-02 17:00:00	Miradero	Complete Event Pass	30.00	Lorem blahblah	50
\.


--
-- Data for Name: sponsors; Type: TABLE DATA; Schema: public; Owner: root
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
-- Data for Name: station; Type: TABLE DATA; Schema: public; Owner: root
--

COPY station (event_name, event_start_date, event_location, station_number, station_in_use) FROM stdin;
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
First Test	2015-10-19 09:00:00	miradero	7	f
First Test	2015-10-19 09:00:00	miradero	8	f
First Test	2015-10-19 09:00:00	miradero	10	f
First Test	2015-10-19 09:00:00	miradero	13	f
First Test	2015-10-19 09:00:00	miradero	15	f
First Test	2015-10-19 09:00:00	miradero	16	f
Event 01	2015-03-25 09:00:00	miradero	7	f
Event 01	2015-03-25 09:00:00	miradero	9	f
Event 01	2015-03-25 09:00:00	miradero	10	f
Event 01	2015-03-25 09:00:00	miradero	11	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	1	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	2	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	3	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	4	f
Input test	2015-04-27 22:00:00	UPR Mayaguez	5	f
Event 01	2015-03-25 09:00:00	miradero	12	f
\.


--
-- Data for Name: stream; Type: TABLE DATA; Schema: public; Owner: root
--

COPY stream (event_name, event_start_date, event_location, station_number, stream_link) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	1	http://www.twitch.tv/ollidab
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1	http://www.twitch.tv/imaqtpie
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	3	http://www.twitch.tv/beyondthesummit
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	5	http://www.twitch.tv/summit1g
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	1	http://www.twitch.tv/imaqtpie
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	1	http://www.twitch.tv/imaqtpie
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	1	http://www.twitch.tv/imaqtpie
Input test	2015-04-27 22:00:00	UPR Mayaguez	1	http://www.twitch.tv/dendi
First Test	2015-10-19 09:00:00	miradero	8	qweqweqweqweqwe
First Test	2015-10-19 09:00:00	miradero	15	asdasdasdasd
First Test	2015-10-19 09:00:00	miradero	16	sad
\.


--
-- Data for Name: submits; Type: TABLE DATA; Schema: public; Owner: root
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
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	1	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	2	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	1	2	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	1	5	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	1	4	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	2	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	2	5	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	3	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Group	2	3	5	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	2	2	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	2	3	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	3	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Group	1	3	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	1	1	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	2	3	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	2	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	3	1	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Group	1	3	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	1	5	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	1	4	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	2	4	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Winner	1	2	5	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	1	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	2	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	2	2	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	1	5	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	2	5	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Winner	1	2	3	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	1	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	2	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	1	Loser	1	2	2	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	1	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	1	3	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	2	3	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Winner	1	2	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	1	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	1	5	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	2	5	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	2	Loser	1	2	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	1	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	1	3	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	2	3	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	3	Loser	1	2	4	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	1	1	1
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	1	4	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	2	4	0
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	4	Winner	1	2	1	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	1	4	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	3	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	3	4	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	2	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	2	2	2	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	1	5	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	2	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	1	2	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	2	2	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	2	Group	2	2	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	1	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	1	4	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	2	3	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	2	4	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	3	3	0
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	3	Group	1	3	4	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	2	3	1
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	1	Group	1	2	4	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	1	9	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	1	6	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	2	6	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	2	9	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	3	6	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	1	3	9	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	1	12	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	1	2	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	2	12	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	2	2	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	3	12	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	2	3	2	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	1	4	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	1	5	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	2	5	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	2	4	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	3	4	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	3	3	5	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	1	14	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	1	1	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	2	14	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	2	1	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	3	14	1
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	1	Group	5	3	1	0
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	1	3	1
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	1	2	0
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	2	3	0
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	2	2	1
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	3	3	1
Team Test	2015-04-28 02:55:00	hey	tourney 1	1	Winner	1	3	2	0
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	3	Group	2	1	3	1
\.


--
-- Data for Name: subscribed_to; Type: TABLE DATA; Schema: public; Owner: root
--

COPY subscribed_to (subscriber, interest) FROM stdin;
ollidab	test07
ollidab	jems9102
ollidab	test01
rapol	ollidab
rapol	samdlt
samdlt	rapol
samdlt	papaluisre
samdlt	jems9102
rapol	test05
\.


--
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: root
--

COPY team (team_name, team_logo, team_bio, team_cover_photo, team_active) FROM stdin;
NeptunoLabs	http://neptunolabs.com/images/matchup-logo.png	This is a team that brought you this application!	http://neptunolabs.com/images/logoPlain.png	t
Test_Team	http://neptunolabs.com/images/matchup-logo.png	This is a team that brought you this application!	http://neptunolabs.com/images/logoPlain.png	f
test team 01	http://i.imgur.com/bBdFnYf.png	This is a test team 01. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 04	http://i.imgur.com/SlUSvZJ.png	This is a test team 04. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 06	http://i.imgur.com/pQOXLUQ.png	This is a test team 06. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 07	http://i.imgur.com/KIkVRFL.png	This is a test team 07. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	t
test team 10	http://i.imgur.com/Yal1Pam.png	This is a test team 10. It was used to test this application.	http://neptunolabs.com/images/logoPlain.png	f
Team Delete	http://i.imgur.com/KIkVRFL.png	Bio is big	http://neptunolabs.com/images/logoPlain.png	f
Team Delete 2	http://i.imgur.com/KIkVRFL.png	Bio is not thatbig	http://neptunolabs.com/images/logoPlain.png	f
Team Delete 3	http://i.imgur.com/KIkVRFL.png	Bio	http://neptunolabs.com/images/logoPlain.png	f
Team Playground	http://neptunolabs.com/images/matchup-logo.png	ugh	http://neptunolabs.com/images/logoPlain.png	f
last delete	http://neptunolabs.com/images/matchup-logo.png	yes this si the last one	http://neptunolabs.com/images/logoPlain.png	f
LTLP	http://neptunolabs.com/images/matchup-logo.png	Ya tu sae	http://neptunolabs.com/images/logoPlain.png	t
\.


--
-- Data for Name: to_play; Type: TABLE DATA; Schema: public; Owner: root
--

COPY to_play (event_name, event_start_date, event_location, meetup_location, meetup_start_date, game_name) FROM stdin;
Event 01	2015-03-25 09:00:00	miradero	Room 301, Mayaguez Resort and Casino, Mayagüez, Puerto Rico	2015-03-24 13:00:00	Super Smash Bros. Melee
First Test	2015-10-19 09:00:00	miradero	Room 401 Hilton Hotel	2015-03-24 13:00:00	Super Smash Bros. Melee
First Test	2015-10-19 09:00:00	miradero	Room 401 Hilton Hotel	2015-03-24 13:00:00	Ultimate Marvel vs. Capcom 3
First Test	2015-10-19 09:00:00	miradero	Room 456 Shady Hotel	2015-03-24 13:00:00	Project M
First Test	2015-10-19 09:00:00	miradero	Room 123 Holiday Inn	2015-03-24 13:00:00	Monster Hunter 4
Event 01	2015-03-25 09:00:00	miradero	Activity Room Carribe Hotel	2015-03-24 13:00:00	Killer Instinct (2013)
Event 01	2015-03-25 09:00:00	miradero	Student Center UPRM	2015-03-24 13:00:00	Ultra Street Fighter IV
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	8535, La post drive, San Juan, PR	2015-03-24 13:00:00	Hearthstone Heroes of Warcraft
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	4578, Calle de los puertoros, Salinas, PR	2015-03-24 13:00:00	Hearthstone Heroes of Warcraft
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	1458, Calle de los tainos, Utuado, PR, 45625	2015-03-24 13:00:00	Guilty Gear Xrd
Event 01	2015-03-25 09:00:00	miradero	456, Micasa drive, Mayaguez, PR	2015-03-24 13:00:00	Tekken 7
\.


--
-- Data for Name: tournament; Type: TABLE DATA; Schema: public; Owner: root
--

COPY tournament (event_name, event_start_date, event_location, tournament_name, game_name, tournament_rules, tournament_start_date, tournament_check_in_deadline, competitor_fee, tournament_max_capacity, seed_money, tournament_type, tournament_format, score_type, number_of_people_per_group, amount_of_winners_per_group, tournament_active, team_size, prize_distribution_name) FROM stdin;
Event 02	2015-05-05 09:00:00	miradero	Smash Bros. Melee Weekly	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	2015-05-05 11:00:00	2015-05-05 10:00:00	10.00	32	100.00	Two Stage	Double Elimination	Match	4	2	t	1	None
Event 03	2015-03-27 09:00:00	miradero	USF4 Money Match	Ultra Street Fighter IV	Rules of the rules with rules comprised of rules	2015-03-27 09:00:00	2015-03-17 09:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Event 01	2015-03-25 09:00:00	miradero	Ultra Street Fighter IV Qualifiers	Ultra Street Fighter IV	Rules of the rules with rules comprised of rules	2015-03-25 11:00:00	2015-03-25 10:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Event 01	2015-03-25 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	2015-06-05 11:00:00	2015-06-05 10:00:00	10.00	32	100.00	Two Stage	Double Elimination	Match	4	2	t	1	None
Event 04	2025-10-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	test01	Dota 2	Rules of the rules with rules comprised of rules	2025-10-19 11:00:00	2025-10-19 10:00:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Event 05	2025-11-19 09:00:00	Calle Bosque, Mayaguez, PR 00681-9042	Killer Instinct For Fun	Killer Instinct (2013)	Rules of the rules with rules comprised of rules	2025-11-19 11:00:00	2025-11-19 10:00:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 01	Project M	Rules of the rules with rules comprised of rules	2015-10-29 11:00:00	2015-10-29 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t	1	None
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 02	Guilty Gear Xrd	Rules of the rules with rules comprised of rules	2015-10-29 11:00:00	2015-10-29 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t	1	None
Event 06	2015-10-29 09:00:00	1234 Calle Paloma, Mayaguez, PR 00681-9042	Test Tournament 03	Ultimate Marvel vs. Capcom 3	Rules of the rules with rules comprised of rules	2015-10-29 11:00:00	2015-10-29 10:00:00	10.00	32	100.00	Single Stage	Double Elimination	Match	6	2	t	1	None
Event 01	2015-03-25 09:00:00	miradero	Mortal Kombat X Qualifiers	Mortal Kombat X	Where we're playing we don't need rules	2015-03-25 11:00:00	2015-03-25 10:00:00	3.50	32	322.00	Two Stage	Double Elimination	Match	3	3	t	1	None
First Regular Event	2015-04-25 04:00:00	Darude Sandstorm	Tourney 1	Dota 2	Rules Rules Im filling SPACE! Rules Rules Im filling SPACE! Rules Rules	2015-04-25 17:00:00	2015-04-25 15:00:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	4	None
First Premium	2015-04-25 04:00:00	DUDUDUDUDUDUDUDUDU	First Visual Novel Tournament	Persona 4 Arena Ultimax	THIS IS THE FIRST VISUAL NOVEL TOURNAMENT IN THE HISTORY OF THE UNIVERSE	2015-04-25 18:30:00	2015-04-25 17:00:00	20.00	200	100.00	Two Stage	Double Elimination	Match	4	2	t	1	None
Second Premium	2015-04-25 04:00:00	Online	Hearth Tourney	Hearthstone Heroes of Warcraft	sdfsdf	2015-04-25 18:50:00	2015-04-25 12:20:00	12.00	12	1000.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Second Premium	2015-04-25 04:00:00	Online	Tourney 2	Monster Hunter 4	Who plays Monster Hunter?	2015-04-25 22:50:00	2015-04-25 16:40:00	0.00	200	20.01	Two Stage	Double Elimination	Match	100	3	t	3	None
Testing Github Regular	2015-04-24 04:00:00	Online	tourney	Killer Instinct (2013)	Rules Rules  Rules  Rules  Rules  Rules	2015-04-24 18:30:00	2015-04-24 16:20:00	0.00	32	0.00	Two Stage	Double Elimination	Match	4	1	t	1	None
Event 07	2015-12-01 09:00:00	30 Easton Ave, New Brunswick, NJ	Test Groups 02	Project M	Rules of the rules with rules comprised of rules	2015-12-01 11:00:00	2015-11-25 10:00:00	10.00	32	100.00	Two Stage	Single Elimination	Match	3	1	f	1	None
Event 08	2015-11-02 09:00:00	30 Independence BLV, Warren, NJ	Test Groups 03	Project M	Rules of the rules with rules comprised of rules	2015-11-02 09:00:00	2015-10-24 09:00:00	10.00	32	100.00	Two Stage	Single Elimination	Match	3	1	f	1	None
Event 09	2015-11-02 09:00:00	41 Independence BLV, Warren, NJ	Test Groups 04	Project M	Rules of the rules with rules comprised of rules	2015-11-02 09:00:00	2015-10-24 09:00:00	10.00	32	100.00	Two Stage	Single Elimination	Match	3	1	f	1	None
sdaf	2015-04-25 13:05:00	Online	sdf	Project M	sdf	2015-04-25 18:50:00	2015-04-25 17:00:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Retribution	2015-06-06 14:00:00	Teatro Braulio Castillo, Carretera Puerto Rico 2, Bayamón, 00959	Retribution	League of Legends	s	2015-06-06 15:00:00	2015-06-06 14:30:00	75.00	20	3000.00	Single Stage	Single Elimination	Match	0	0	t	5	Standard
Google Hangout tournament	2015-04-26 04:00:00	UPR Mayaguez	MKX 1v1	Mortal Kombat X	HIJUGvtyigsadvfalsuhkdjvb	2015-04-26 05:00:00	2015-04-26 04:05:00	10.00	124	100.00	Single Stage	Single Elimination	Match	0	0	t	1	Standard
SPACE	2015-04-29 04:00:00	Online	Aliens	Counter-Strike Global Offensive	SO MUCH SPACE	2015-04-29 22:50:00	2015-04-29 12:20:00	0.00	32	0.00	Single Stage	Round Robin	Match	0	0	t	4	None
Event 01	2015-03-25 09:00:00	miradero	fgh	Counter-Strike Global Offensive	gjh	2015-05-09 15:30:00	2015-05-05 13:25:00	56.00	65	56.00	Two Stage	Double Elimination	Points	32	3	f	34	First and Second
Event 01	2015-03-25 09:00:00	miradero	sdf	Heroes of the Storm	sdf	2015-05-09 07:20:00	2015-05-08 10:10:00	234.00	234	234.00	Two Stage	Double Elimination	Points	234	23	f	23	First and Second
Event 01	2015-03-25 09:00:00	miradero	Twisted Tree Line	League of Legends	No Rules	2015-04-27 14:00:00	2015-04-27 13:00:00	300.00	32	1000000.00	Two Stage	Double Elimination	Match	4	2	t	3	Standard
FIRST TEST	2015-04-27 04:35:00	sdf	Tourney 1	Tekken 7	sdf	2015-04-27 04:45:00	2015-04-27 04:40:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	1	None
Test Event	2015-05-15 23:00:00	Event Location	Test Tournament	Super Smash Bros. Melee	Tournament rules	2015-05-15 23:30:00	2015-05-15 23:15:00	30.00	16	1000.00	Two Stage	Single Elimination	Match	4	2	t	1	Standard
Regular Event Playground EDIT 3	2015-04-29 04:00:00	Location	Tourney 1	Super Smash Bros. Wii U	Rules	2015-04-28 22:30:00	2015-04-28 12:20:00	0.00	32	0.00	Single Stage	Round Robin	Match	0	0	t	2	None
First Test	2015-10-19 09:00:00	miradero	Super Smash Bros. Melee Qualifiers	Super Smash Bros. Melee	Rules of the rules with rules comprised of rules	2015-04-28 02:05:00	2015-04-28 02:00:00	10.00	32	100.00	Single Stage	Single Elimination	Match	0	0	t	2	None
Input test	2015-04-27 22:00:00	UPR Mayaguez	Dota 2 scrub tier	Dota 2	This are the new rules	2015-04-27 22:05:00	2015-04-27 22:00:00	0.00	42	0.00	Two Stage	Double Elimination	Match	3	2	t	1	Standard
Team Test	2015-04-28 02:55:00	hey	tourney 1	Hearthstone Heroes of Warcraft	rer	2015-04-28 03:00:00	2015-04-28 02:55:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	2	None
Team test	2015-05-01 04:00:00	Hey	Another Tourney	Persona 4 Arena Ultimax	Rules	2015-04-29 20:55:00	2015-04-29 20:50:00	0.00	32	0.00	Single Stage	Single Elimination	Match	0	0	t	2	None
Test Spectator	2015-05-02 17:00:00	UPRM	Tekken 7 Tournament	Tekken 7	Here would be the rules of the tournament	2015-05-02 19:00:00	2015-05-02 18:00:00	15.00	50	200.00	Single Stage	Single Elimination	Match	0	0	t	1	Standard
Test Competitor	2015-05-02 17:00:00	Miradero	Mortal Kombat X Tournament	Mortal Kombat X	Lorem blahblah	2015-05-02 19:00:00	2015-05-02 18:00:00	25.00	60	300.00	Two Stage	Double Elimination	Match	4	2	t	1	Standard
Test Competitor	2015-05-02 17:00:00	Miradero	Dota 2 Tournament	Dota 2	Lorem blahblah	2015-05-02 19:00:00	2015-05-02 18:00:00	30.00	50	5000.00	Single Stage	Double Elimination	Match	0	0	t	5	Standard
Test Competitor	2015-05-02 17:00:00	Miradero	Hearthstone Tournament	Hearthstone Heroes of Warcraft	Lorem blahblah	2015-05-02 19:00:00	2015-05-02 18:00:00	20.00	30	2000.00	Single Stage	Double Elimination	Match	0	0	t	1	First and Second
\.


--
-- Name: PK_belongs_to; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "PK_belongs_to" PRIMARY KEY (organization_name, customer_username);


--
-- Name: PK_capacity_for; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "PK_capacity_for" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, station_number);


--
-- Name: PK_captain_for; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "PK_captain_for" PRIMARY KEY (team_name, customer_username);


--
-- Name: PK_competes; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "PK_competes" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, competitor_number);


--
-- Name: PK_competes_for; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "PK_competes_for" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number, team_name);


--
-- Name: PK_competitor; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT "PK_competitor" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, competitor_number);


--
-- Name: PK_competitor_goes_to; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "PK_competitor_goes_to" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_of, past_match, future_round_number, future_round_of, future_match, is_winner);


--
-- Name: PK_customer; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT "PK_customer" PRIMARY KEY (customer_username);


--
-- Name: PK_event; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY event
    ADD CONSTRAINT "PK_event" PRIMARY KEY (event_name, event_start_date, event_location);


--
-- Name: PK_game; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY game
    ADD CONSTRAINT "PK_game" PRIMARY KEY (game_name);


--
-- Name: PK_genre; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY genre
    ADD CONSTRAINT "PK_genre" PRIMARY KEY (genre_name);


--
-- Name: PK_group; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY "group"
    ADD CONSTRAINT "PK_group" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, group_number);


--
-- Name: PK_has_a; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY has_a
    ADD CONSTRAINT "PK_has_a" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, group_number);


--
-- Name: PK_hosts_id; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "PK_hosts_id" PRIMARY KEY (event_name, event_start_date, event_location, organization_name);


--
-- Name: PK_is_a; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
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
-- Name: PK_is_of; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "PK_is_of" PRIMARY KEY (game_name, genre_name);


--
-- Name: PK_is_played_in; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "PK_is_played_in" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, station_number);


--
-- Name: PK_is_set; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY is_set
    ADD CONSTRAINT "PK_is_set" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq);


--
-- Name: PK_match; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY match
    ADD CONSTRAINT "PK_match" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number);


--
-- Name: PK_meetup; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "PK_meetup" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date);


--
-- Name: PK_news; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY news
    ADD CONSTRAINT "PK_news" PRIMARY KEY (event_name, event_start_date, event_location, news_number);


--
-- Name: PK_organization; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY organization
    ADD CONSTRAINT "PK_organization" PRIMARY KEY (organization_name);


--
-- Name: PK_owns; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "PK_owns" PRIMARY KEY (organization_name, customer_username);


--
-- Name: PK_pays; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "PK_pays" PRIMARY KEY (event_name, event_start_date, event_location, spec_fee_name, customer_username);


--
-- Name: PK_plays_for; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "PK_plays_for" PRIMARY KEY (team_name, customer_username);


--
-- Name: PK_prize_distribution; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY prize_distribution
    ADD CONSTRAINT "PK_prize_distribution" PRIMARY KEY (prize_distribution_name);


--
-- Name: PK_report; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY report
    ADD CONSTRAINT "PK_report" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, report_number);


--
-- Name: PK_request; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY request
    ADD CONSTRAINT "PK_request" PRIMARY KEY (request_organization_name, customer_username);


--
-- Name: PK_request_sponsor; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY request_sponsor
    ADD CONSTRAINT "PK_request_sponsor" PRIMARY KEY (organization_name, request_sponsor_link) WITH (fillfactor=100);


--
-- Name: PK_review; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "PK_review" PRIMARY KEY (event_name, event_start_date, event_location, customer_username);


--
-- Name: PK_round; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY round
    ADD CONSTRAINT "PK_round" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of);


--
-- Name: PK_shows; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "PK_shows" PRIMARY KEY (event_name, event_start_date, event_location, sponsor_name);


--
-- Name: PK_spec_fee; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY spectator_fee
    ADD CONSTRAINT "PK_spec_fee" PRIMARY KEY (event_name, event_start_date, event_location, spec_fee_name);


--
-- Name: PK_sponsor; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY sponsors
    ADD CONSTRAINT "PK_sponsor" PRIMARY KEY (sponsor_name);


--
-- Name: PK_station; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY station
    ADD CONSTRAINT "PK_station" PRIMARY KEY (event_name, event_start_date, event_location, station_number);


--
-- Name: PK_stream; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY stream
    ADD CONSTRAINT "PK_stream" PRIMARY KEY (event_name, event_start_date, event_location, station_number, stream_link);


--
-- Name: PK_submits; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "PK_submits" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq, competitor_number) WITH (fillfactor=100);


--
-- Name: PK_subscribed_to; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "PK_subscribed_to" PRIMARY KEY (subscriber, interest);


--
-- Name: PK_team; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY team
    ADD CONSTRAINT "PK_team" PRIMARY KEY (team_name);


--
-- Name: PK_to_play; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "PK_to_play" PRIMARY KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date, game_name);


--
-- Name: PK_tournament; Type: CONSTRAINT; Schema: public; Owner: root; Tablespace: 
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "PK_tournament" PRIMARY KEY (event_name, event_start_date, event_location, tournament_name);


--
-- Name: FK_belongs_to_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "FK_belongs_to_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_belongs_to_organization; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY belongs_to
    ADD CONSTRAINT "FK_belongs_to_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_capacity_for_station; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "FK_capacity_for_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_capacity_for_tournament; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY capacity_for
    ADD CONSTRAINT "FK_capacity_for_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_captain_for_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY captain_for
    ADD CONSTRAINT "FK_captain_for_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_captain_for_team; Type: FK CONSTRAINT; Schema: public; Owner: root
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
-- Name: FK_competes_competitor; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "FK_competes_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competes_for_competitor; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "FK_competes_for_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competes_for_team; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competes_for
    ADD CONSTRAINT "FK_competes_for_team" FOREIGN KEY (team_name) REFERENCES team(team_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competes_match; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competes
    ADD CONSTRAINT "FK_competes_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competitor_goes_to_future_match; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "FK_competitor_goes_to_future_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, future_round_number, future_round_of, future_match) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competitor_goes_to_past_match; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competitor_goes_to
    ADD CONSTRAINT "FK_competitor_goes_to_past_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, past_round_number, past_round_of, past_match) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_competitor_tournament; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY competitor
    ADD CONSTRAINT "FK_competitor_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_event_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY event
    ADD CONSTRAINT "FK_event_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_has_a_group; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY has_a
    ADD CONSTRAINT "FK_has_a_group" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, group_number) REFERENCES "group"(event_name, event_start_date, event_location, tournament_name, group_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_has_a_match; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY has_a
    ADD CONSTRAINT "FK_has_a_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_hosts_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "FK_hosts_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_hosts_organization; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY hosts
    ADD CONSTRAINT "FK_hosts_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_a_competitor; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY is_a
    ADD CONSTRAINT "FK_is_a_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_a_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
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
-- Name: FK_is_of_game; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "FK_is_of_game" FOREIGN KEY (game_name) REFERENCES game(game_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_of_genre; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY is_of
    ADD CONSTRAINT "FK_is_of_genre" FOREIGN KEY (genre_name) REFERENCES genre(genre_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_is_played_in_match; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "FK_is_played_in_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_played_in_station; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY is_played_in
    ADD CONSTRAINT "FK_is_played_in_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_is_set_match; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY is_set
    ADD CONSTRAINT "FK_is_set_match" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) REFERENCES match(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_match_round; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY match
    ADD CONSTRAINT "FK_match_round" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of) REFERENCES round(event_name, event_start_date, event_location, tournament_name, round_number, round_of) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_meetup_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "FK_meetup_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_meetup_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY meetup
    ADD CONSTRAINT "FK_meetup_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_news_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY news
    ADD CONSTRAINT "FK_news_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_owns_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "FK_owns_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_owns_organization; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY owns
    ADD CONSTRAINT "FK_owns_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_pays_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "FK_pays_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_pays_spectator_fee; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY pays
    ADD CONSTRAINT "FK_pays_spectator_fee" FOREIGN KEY (event_name, event_start_date, event_location, spec_fee_name) REFERENCES spectator_fee(event_name, event_start_date, event_location, spec_fee_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_plays_for_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "FK_plays_for_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_plays_for_team_name; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY plays_for
    ADD CONSTRAINT "FK_plays_for_team_name" FOREIGN KEY (team_name) REFERENCES team(team_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_report_is_set; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY report
    ADD CONSTRAINT "FK_report_is_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) REFERENCES is_set(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_request_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY request
    ADD CONSTRAINT "FK_request_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_request_sponsor_organization; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY request_sponsor
    ADD CONSTRAINT "FK_request_sponsor_organization" FOREIGN KEY (organization_name) REFERENCES organization(organization_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_review_customer; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "FK_review_customer" FOREIGN KEY (customer_username) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_review_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY review
    ADD CONSTRAINT "FK_review_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_round_tournament; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY round
    ADD CONSTRAINT "FK_round_tournament" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_shows_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "FK_shows_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_shows_sponsor; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY shows
    ADD CONSTRAINT "FK_shows_sponsor" FOREIGN KEY (sponsor_name) REFERENCES sponsors(sponsor_name) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_spectator_fee_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY spectator_fee
    ADD CONSTRAINT "FK_spectator_fee_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_station_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY station
    ADD CONSTRAINT "FK_station_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_stream_station; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY stream
    ADD CONSTRAINT "FK_stream_station" FOREIGN KEY (event_name, event_start_date, event_location, station_number) REFERENCES station(event_name, event_start_date, event_location, station_number) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_submits_competitor; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "FK_submits_competitor" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, competitor_number) REFERENCES competitor(event_name, event_start_date, event_location, tournament_name, competitor_number) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_submits_is_set; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY submits
    ADD CONSTRAINT "FK_submits_is_set" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) REFERENCES is_set(event_name, event_start_date, event_location, tournament_name, round_number, round_of, match_number, set_seq) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_subscribed_to_customer_interest; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "FK_subscribed_to_customer_interest" FOREIGN KEY (interest) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_subscribed_to_customer_subscriber; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY subscribed_to
    ADD CONSTRAINT "FK_subscribed_to_customer_subscriber" FOREIGN KEY (subscriber) REFERENCES customer(customer_username) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FK_to_play_game; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "FK_to_play_game" FOREIGN KEY (game_name) REFERENCES game(game_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_to_play_meetup; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY to_play
    ADD CONSTRAINT "FK_to_play_meetup" FOREIGN KEY (event_name, event_start_date, event_location, meetup_location, meetup_start_date) REFERENCES meetup(event_name, event_start_date, event_location, meetup_location, meetup_start_date) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_event; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_event" FOREIGN KEY (event_name, event_start_date, event_location) REFERENCES event(event_name, event_start_date, event_location) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_game; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_game" FOREIGN KEY (game_name) REFERENCES game(game_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_group; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY "group"
    ADD CONSTRAINT "FK_tournament_group" FOREIGN KEY (event_name, event_start_date, event_location, tournament_name) REFERENCES tournament(event_name, event_start_date, event_location, tournament_name) ON UPDATE CASCADE ON DELETE CASCADE DEFERRABLE INITIALLY DEFERRED;


--
-- Name: FK_tournament_prize_distribution; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY tournament
    ADD CONSTRAINT "FK_tournament_prize_distribution" FOREIGN KEY (prize_distribution_name) REFERENCES prize_distribution(prize_distribution_name) ON UPDATE CASCADE ON DELETE SET DEFAULT;


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

