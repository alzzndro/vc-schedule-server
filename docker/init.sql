--
-- PostgreSQL database dump
--

\restrict lQkBoZcP01ZNFS3puBND8fsD2iY5v9EvXm49WF2twp6lLEHQ8fsjhGSnrgAMrgh

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-15 15:51:37

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
-- TOC entry 5334 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION btree_gist; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION btree_gist IS 'support for indexing common datatypes in GiST';


SET default_tablespace = '';

SET default_table_access_method = heap;

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
    subject character varying(255) NOT NULL,
    teacher character varying(255) NOT NULL,
    day_of_week integer NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    created_by uuid,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT schedules_check CHECK (((end_time > start_time) AND (end_time <= '21:00:00'::time without time zone))),
    CONSTRAINT schedules_day_of_week_check CHECK (((day_of_week >= 1) AND (day_of_week <= 6))),
    CONSTRAINT schedules_start_time_check CHECK (((start_time >= '07:00:00'::time without time zone) AND (start_time <= '21:00:00'::time without time zone)))
);


ALTER TABLE public.schedules OWNER TO postgres;

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
-- TOC entry 5327 (class 0 OID 17871)
-- Dependencies: 221
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, name, capacity, type, created_at, updated_at) FROM stdin;
a6aa4ce4-4610-420c-a3a2-e84ae38f58fa	SAPPHIRE 1	40	Regular Classroom	2026-06-15 10:29:05.20989	2026-06-15 10:30:06.460166
3e5f5553-3f49-4f83-a70a-7553f5be06f1	DIAMOND 2	30	Regular Classroom	2026-06-15 10:44:58.719929	2026-06-15 10:45:05.962571
\.


--
-- TOC entry 5328 (class 0 OID 17885)
-- Dependencies: 222
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, room_id, subject, teacher, day_of_week, start_time, end_time, created_by, created_at, updated_at) FROM stdin;
4f74db94-9311-426d-816b-56b15c5fb9e9	a6aa4ce4-4610-420c-a3a2-e84ae38f58fa	CS 1	Dr. Real	1	07:00:00	09:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-15 10:43:23.02439	2026-06-15 10:43:23.02439
dda8206e-af1e-46cf-bf98-f9a5b6a6ebea	a6aa4ce4-4610-420c-a3a2-e84ae38f58fa	BSED 1	Dr. Aninon	1	09:20:00	10:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-15 10:43:47.942742	2026-06-15 10:43:47.942742
7c05e822-f104-449e-a6c3-56c04e1a1279	3e5f5553-3f49-4f83-a70a-7553f5be06f1	CRIM 1	Dr. Nelissa	1	08:00:00	10:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-15 10:45:29.947152	2026-06-15 10:45:29.947152
1a3b8d97-44de-49dc-9d2d-bd6049907a52	3e5f5553-3f49-4f83-a70a-7553f5be06f1	INFOMAN	Doms Del	3	19:00:00	21:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-15 10:54:49.105681	2026-06-15 10:54:49.105681
dad44e6f-f486-43ba-b6ff-3e62c1ee65de	a6aa4ce4-4610-420c-a3a2-e84ae38f58fa	CS 2	Dr. Alan	2	08:15:00	10:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-15 10:57:17.591373	2026-06-15 10:57:17.591373
\.


--
-- TOC entry 5326 (class 0 OID 17852)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, created_at, updated_at) FROM stdin;
496e52e5-616f-4a34-a0b1-16f4c62f5579	admin@school.edu	$2b$10$4.GWNqNEtTsrFyQaYrxaWO3ta3jG1r.HyxYAcO6mXN/XWFGv3jzBq	System	Admin	admin	2026-06-15 10:18:42.449257	2026-06-15 10:18:42.449257
e1fffa39-0f96-4e8f-b27d-e888c570eeb4	systemadmin@villaflorescollege.edu.ph	$2b$10$aePy.4fQFY0vqq499E1Zfei6lewWU.n5d6GfIUNwGnchnVd3KTgRK	System	Admin	admin	2026-06-15 10:22:07.688057	2026-06-15 10:22:07.688057
\.


--
-- TOC entry 5172 (class 2606 OID 17884)
-- Name: rooms rooms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_name_key UNIQUE (name);


--
-- TOC entry 5174 (class 2606 OID 17882)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 5176 (class 2606 OID 17904)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5168 (class 2606 OID 17870)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5170 (class 2606 OID 17868)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5177 (class 2606 OID 17910)
-- Name: schedules schedules_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5178 (class 2606 OID 17905)
-- Name: schedules schedules_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


-- Completed on 2026-06-15 15:51:37

--
-- PostgreSQL database dump complete
--

\unrestrict lQkBoZcP01ZNFS3puBND8fsD2iY5v9EvXm49WF2twp6lLEHQ8fsjhGSnrgAMrgh

