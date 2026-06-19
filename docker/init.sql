--
-- PostgreSQL database dump
--

\restrict dH2PHg2daLJ4ezbhgpsHuX385EkZbcw02xEB8Y3ApUbTTVZZYCFaQ4sidKxnAVA

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-19 11:26:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 17126)
-- Name: btree_gist; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;


--
-- TOC entry 5377 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 224 (class 1259 OID 17935)
-- Name: instructors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instructors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.instructors OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 17871)
-- Name: rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rooms (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    capacity integer DEFAULT 30,
    type character varying(50) DEFAULT 'Regular'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.rooms OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 17885)
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    room_id uuid NOT NULL,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    section_id uuid NOT NULL,
    instructor_id uuid NOT NULL,
    subject_id uuid NOT NULL,
    CONSTRAINT schedules_check CHECK (((end_time > start_time) AND (end_time <= '21:00:00'::time without time zone))),
    CONSTRAINT schedules_day_of_week_check CHECK (((day_of_week >= 1) AND (day_of_week <= 6))),
    CONSTRAINT schedules_start_time_check CHECK (((start_time >= '07:00:00'::time without time zone) AND (start_time <= '21:00:00'::time without time zone)))
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 17915)
-- Name: sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sections (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sections OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17954)
-- Name: subjects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subjects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.subjects OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 17852)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['admin'::character varying, 'public'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 5370 (class 0 OID 17935)
-- Dependencies: 224
-- Data for Name: instructors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.instructors (id, name, created_at, updated_at) FROM stdin;
d9e027a5-8515-49f9-b458-ea84ec85e45f	Default Instructor	2026-06-19 09:29:44.856758	2026-06-19 09:29:44.856758
87e7bb79-31e5-4573-a161-a61e3bcca341	Dr. Vincente Real	2026-06-19 10:09:23.205862	2026-06-19 10:09:23.205862
1bcbb96a-0c99-46a5-9850-11773312867b	Dr. Aninon	2026-06-19 10:57:37.16857	2026-06-19 10:57:37.16857
b5940fed-f998-4612-b50e-f525f76d00e3	Sir Alonso	2026-06-19 10:57:45.505774	2026-06-19 10:57:45.505774
\.


--
-- TOC entry 5367 (class 0 OID 17871)
-- Dependencies: 221
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, name, capacity, type, created_at, updated_at) FROM stdin;
c5cc7d66-a7e0-40f2-9c85-ebaae70cb6be	S1	40	Regular Classroom	2026-06-19 10:08:59.222458	2026-06-19 10:10:19.902404
\.


--
-- TOC entry 5368 (class 0 OID 17885)
-- Dependencies: 222
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, room_id, day_of_week, start_time, end_time, created_by, created_at, updated_at, section_id, instructor_id, subject_id) FROM stdin;
071dfa3b-83e8-4568-8621-625743a02a2e	c5cc7d66-a7e0-40f2-9c85-ebaae70cb6be	1	07:00:00	09:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 11:24:23.421488	2026-06-19 11:24:23.421488	da5ccbd1-4a4e-430d-a29a-3643b0eb91af	87e7bb79-31e5-4573-a161-a61e3bcca341	258f8489-0e6c-4dbb-8a98-5de98b7d86e1
\.


--
-- TOC entry 5369 (class 0 OID 17915)
-- Dependencies: 223
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, name, created_at, updated_at) FROM stdin;
77ae06d3-d5f7-40f5-9474-c439e80fa6d1	Default Section	2026-06-16 08:55:33.61262	2026-06-16 08:55:33.61262
da5ccbd1-4a4e-430d-a29a-3643b0eb91af	CRIMINOLOGY - ALPHA	2026-06-19 10:10:09.86494	2026-06-19 10:10:09.86494
636b6f20-9c6a-4c95-9ae6-cd381bee63a8	GRADE 7 - AMARYLLIS	2026-06-19 10:57:13.231714	2026-06-19 10:57:13.231714
1155ee18-6966-430f-9ebd-6c7ff92d2c22	GRADE 7 - AZALEA	2026-06-19 10:57:21.834943	2026-06-19 10:57:21.834943
\.


--
-- TOC entry 5371 (class 0 OID 17954)
-- Dependencies: 225
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, created_at, updated_at) FROM stdin;
10647979-2c99-4f6c-a662-261fbc8b290b	Default Subject	2026-06-19 11:14:51.93918	2026-06-19 11:14:51.93918
258f8489-0e6c-4dbb-8a98-5de98b7d86e1	CRIM - 5	2026-06-19 11:24:05.755378	2026-06-19 11:24:05.755378
ea35ec86-c50f-4ff6-adc5-d2d295400e6f	SPEC - 1	2026-06-19 11:24:11.66722	2026-06-19 11:24:11.66722
\.


--
-- TOC entry 5366 (class 0 OID 17852)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, created_at, updated_at) FROM stdin;
496e52e5-616f-4a34-a0b1-16f4c62f5579	admin@school.edu	$2b$10$4.GWNqNEtTsrFyQaYrxaWO3ta3jG1r.HyxYAcO6mXN/XWFGv3jzBq	System	Admin	admin	2026-06-15 10:18:42.449257	2026-06-15 10:18:42.449257
e1fffa39-0f96-4e8f-b27d-e888c570eeb4	systemadmin@villaflorescollege.edu.ph	$2b$10$aePy.4fQFY0vqq499E1Zfei6lewWU.n5d6GfIUNwGnchnVd3KTgRK	System	Admin	admin	2026-06-15 10:22:07.688057	2026-06-15 10:22:07.688057
\.


--
-- TOC entry 5207 (class 2606 OID 17946)
-- Name: instructors instructors_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructors
    ADD CONSTRAINT instructors_name_key UNIQUE (name);


--
-- TOC entry 5209 (class 2606 OID 17944)
-- Name: instructors instructors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructors
    ADD CONSTRAINT instructors_pkey PRIMARY KEY (id);


--
-- TOC entry 5193 (class 2606 OID 17884)
-- Name: rooms rooms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_name_key UNIQUE (name);


--
-- TOC entry 5195 (class 2606 OID 17882)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 5201 (class 2606 OID 17904)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5203 (class 2606 OID 17926)
-- Name: sections sections_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_name_key UNIQUE (name);


--
-- TOC entry 5205 (class 2606 OID 17924)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 5211 (class 2606 OID 17965)
-- Name: subjects subjects_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_name_key UNIQUE (name);


--
-- TOC entry 5213 (class 2606 OID 17963)
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- TOC entry 5189 (class 2606 OID 17870)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5191 (class 2606 OID 17868)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5196 (class 1259 OID 17953)
-- Name: idx_schedules_instructor_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_instructor_day ON public.schedules USING btree (instructor_id, day_of_week);


--
-- TOC entry 5197 (class 1259 OID 17933)
-- Name: idx_schedules_room_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_room_day ON public.schedules USING btree (room_id, day_of_week);


--
-- TOC entry 5198 (class 1259 OID 17934)
-- Name: idx_schedules_section_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_section_day ON public.schedules USING btree (section_id, day_of_week);


--
-- TOC entry 5199 (class 1259 OID 17972)
-- Name: idx_schedules_subject_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_subject_day ON public.schedules USING btree (subject_id, day_of_week);


--
-- TOC entry 5214 (class 2606 OID 17910)
-- Name: schedules schedules_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5215 (class 2606 OID 17948)
-- Name: schedules schedules_instructor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_instructor_id_fkey FOREIGN KEY (instructor_id) REFERENCES public.instructors(id) ON DELETE CASCADE;


--
-- TOC entry 5216 (class 2606 OID 17905)
-- Name: schedules schedules_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- TOC entry 5217 (class 2606 OID 17928)
-- Name: schedules schedules_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


--
-- TOC entry 5218 (class 2606 OID 17967)
-- Name: schedules schedules_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE CASCADE;


-- Completed on 2026-06-19 11:26:10

--
-- PostgreSQL database dump complete
--

\unrestrict dH2PHg2daLJ4ezbhgpsHuX385EkZbcw02xEB8Y3ApUbTTVZZYCFaQ4sidKxnAVA

