--
-- PostgreSQL database dump
--

\restrict 34BX4ljWLjFWlGV3YjGhQMVoJfCgezzAWjAV3a1n0tvMy7jDuqyTkuIE3hMrGcv

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-16 10:45:02

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
-- TOC entry 5349 (class 0 OID 0)
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
    section_id uuid NOT NULL,
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
-- TOC entry 5341 (class 0 OID 17871)
-- Dependencies: 221
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, name, capacity, type, created_at, updated_at) FROM stdin;
a6aa4ce4-4610-420c-a3a2-e84ae38f58fa	SAPPHIRE 1	40	Regular Classroom	2026-06-15 10:29:05.20989	2026-06-15 10:30:06.460166
3e5f5553-3f49-4f83-a70a-7553f5be06f1	DIAMOND 2	30	Regular Classroom	2026-06-15 10:44:58.719929	2026-06-15 10:45:05.962571
\.


--
-- TOC entry 5342 (class 0 OID 17885)
-- Dependencies: 222
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, room_id, subject, teacher, day_of_week, start_time, end_time, created_by, created_at, updated_at, section_id) FROM stdin;
4c9a1204-d5f6-4c1c-b8be-73a388db8ab6	3e5f5553-3f49-4f83-a70a-7553f5be06f1	FINANCIAL PLUS	Dr. Real	1	08:00:00	10:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-16 09:01:09.296704	2026-06-16 09:01:09.296704	18e3c8d9-66ea-4022-af19-63f47adc8732
\.


--
-- TOC entry 5343 (class 0 OID 17915)
-- Dependencies: 223
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, name, created_at, updated_at) FROM stdin;
77ae06d3-d5f7-40f5-9474-c439e80fa6d1	Default Section	2026-06-16 08:55:33.61262	2026-06-16 08:55:33.61262
18e3c8d9-66ea-4022-af19-63f47adc8732	BSBA - AURORA	2026-06-16 09:00:18.612268	2026-06-16 09:00:18.612268
\.


--
-- TOC entry 5340 (class 0 OID 17852)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, created_at, updated_at) FROM stdin;
496e52e5-616f-4a34-a0b1-16f4c62f5579	admin@school.edu	$2b$10$4.GWNqNEtTsrFyQaYrxaWO3ta3jG1r.HyxYAcO6mXN/XWFGv3jzBq	System	Admin	admin	2026-06-15 10:18:42.449257	2026-06-15 10:18:42.449257
e1fffa39-0f96-4e8f-b27d-e888c570eeb4	systemadmin@villaflorescollege.edu.ph	$2b$10$aePy.4fQFY0vqq499E1Zfei6lewWU.n5d6GfIUNwGnchnVd3KTgRK	System	Admin	admin	2026-06-15 10:22:07.688057	2026-06-15 10:22:07.688057
\.


--
-- TOC entry 5179 (class 2606 OID 17884)
-- Name: rooms rooms_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_name_key UNIQUE (name);


--
-- TOC entry 5181 (class 2606 OID 17882)
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- TOC entry 5185 (class 2606 OID 17904)
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- TOC entry 5187 (class 2606 OID 17926)
-- Name: sections sections_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_name_key UNIQUE (name);


--
-- TOC entry 5189 (class 2606 OID 17924)
-- Name: sections sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sections
    ADD CONSTRAINT sections_pkey PRIMARY KEY (id);


--
-- TOC entry 5175 (class 2606 OID 17870)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5177 (class 2606 OID 17868)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5182 (class 1259 OID 17933)
-- Name: idx_schedules_room_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_room_day ON public.schedules USING btree (room_id, day_of_week);


--
-- TOC entry 5183 (class 1259 OID 17934)
-- Name: idx_schedules_section_day; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_schedules_section_day ON public.schedules USING btree (section_id, day_of_week);


--
-- TOC entry 5190 (class 2606 OID 17910)
-- Name: schedules schedules_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5191 (class 2606 OID 17905)
-- Name: schedules schedules_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.rooms(id) ON DELETE CASCADE;


--
-- TOC entry 5192 (class 2606 OID 17928)
-- Name: schedules schedules_section_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_section_id_fkey FOREIGN KEY (section_id) REFERENCES public.sections(id) ON DELETE CASCADE;


-- Completed on 2026-06-16 10:45:02

--
-- PostgreSQL database dump complete
--

\unrestrict 34BX4ljWLjFWlGV3YjGhQMVoJfCgezzAWjAV3a1n0tvMy7jDuqyTkuIE3hMrGcv

