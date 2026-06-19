--
-- PostgreSQL database dump
--

\restrict t7RjCf6eL8azTxxcK7nvayKnMBpWTP47G3q2sJr0TeZnw25ezfgHzGVbq1ZlLbg

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-06-19 22:21:32

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
fd440ae0-ab65-441c-ac23-3df1ce991974	Ms. Aguilar	2026-06-19 14:11:04.958581	2026-06-19 14:11:04.958581
bad2170e-2173-486a-ad49-670c4b3884ed	Mr. Alonso	2026-06-19 14:38:32.864404	2026-06-19 14:38:32.864404
d4be831a-595c-43a7-966c-9e92d77bd49d	Ms. Sido	2026-06-19 14:38:45.267047	2026-06-19 14:38:45.267047
e713ecfc-6ff0-4de6-9b5c-117b875b92ef	Ms. Labe	2026-06-19 14:38:53.212119	2026-06-19 14:38:53.212119
dcb43aae-9616-43b8-ad09-07f9df8aa1b7	Mrs. Ebora	2026-06-19 14:39:49.461859	2026-06-19 14:39:49.461859
90dffa60-39ca-4726-b347-1ddd989890ea	Mrs. Calunsag	2026-06-19 14:40:09.12881	2026-06-19 14:40:09.12881
99d8814a-16e9-46a1-88d7-af4c81ead47a	Ms. Sagun	2026-06-19 14:40:19.052255	2026-06-19 14:40:19.052255
7c33d4c4-ba45-4312-a75d-e228ecc69be9	Ms. Escora	2026-06-19 14:40:27.731208	2026-06-19 14:40:27.731208
13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	Mr. Rendon	2026-06-19 14:40:43.75608	2026-06-19 14:40:43.75608
46359a73-dd9b-4f10-9c29-4f30e0abbab9	Mr. Dael	2026-06-19 14:40:49.754122	2026-06-19 14:40:49.754122
\.


--
-- TOC entry 5367 (class 0 OID 17871)
-- Dependencies: 221
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rooms (id, name, capacity, type, created_at, updated_at) FROM stdin;
75c10069-e62f-45c6-beeb-7ff91f897c99	D19	40	Regular Classroom	2026-06-19 14:10:39.578094	2026-06-19 14:10:39.578094
6d36524a-25b6-4150-ab21-ecf8276864b3	COMPLAB	40	Regular Classroom	2026-06-19 14:16:40.391503	2026-06-19 14:16:40.391503
\.


--
-- TOC entry 5368 (class 0 OID 17885)
-- Dependencies: 222
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, room_id, day_of_week, start_time, end_time, created_by, created_at, updated_at, section_id, instructor_id, subject_id) FROM stdin;
bc675c6f-0f47-4ae7-946d-3a214ed233f1	6d36524a-25b6-4150-ab21-ecf8276864b3	3	10:00:00	11:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:08:35.413284	2026-06-19 15:08:35.413284	67de0360-09db-4a4a-9607-a42bd897c29e	d4be831a-595c-43a7-966c-9e92d77bd49d	c5b6afb7-6802-4350-9f16-9957065ea988
9f046516-491f-458b-aacb-b58de273eb12	6d36524a-25b6-4150-ab21-ecf8276864b3	2	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:10:24.729547	2026-06-19 15:10:58.819491	632401b8-2014-469c-b585-4bc1083657ef	e713ecfc-6ff0-4de6-9b5c-117b875b92ef	c5b6afb7-6802-4350-9f16-9957065ea988
27c3b11b-56b4-4a67-96b8-9026ad9319a9	6d36524a-25b6-4150-ab21-ecf8276864b3	5	11:00:00	12:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:11:39.097119	2026-06-19 15:11:39.097119	9d1558a6-1a56-48d5-a2fa-62196dd1e284	dcb43aae-9616-43b8-ad09-07f9df8aa1b7	c5b6afb7-6802-4350-9f16-9957065ea988
a3608631-8fff-4343-bc71-518e00e239c3	6d36524a-25b6-4150-ab21-ecf8276864b3	5	10:00:00	11:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:29:42.585269	2026-06-19 15:29:42.585269	fbe13824-e1d7-4d6c-a574-52c604896eec	90dffa60-39ca-4726-b347-1ddd989890ea	592d8e98-89fb-4dd5-bb4c-19e54a66f10c
b7f0cea2-496c-4eb9-ad87-9e684a2c19ee	6d36524a-25b6-4150-ab21-ecf8276864b3	5	13:00:00	14:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:30:38.922638	2026-06-19 15:30:38.922638	f0a1546b-975b-46ca-a397-c988f60497bf	90dffa60-39ca-4726-b347-1ddd989890ea	592d8e98-89fb-4dd5-bb4c-19e54a66f10c
3d6765f4-5e66-426a-8eda-1f68462ab5c7	6d36524a-25b6-4150-ab21-ecf8276864b3	5	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:31:15.746512	2026-06-19 15:31:15.746512	78a8467d-eeed-490f-90ef-82e87d99163d	7c33d4c4-ba45-4312-a75d-e228ecc69be9	592d8e98-89fb-4dd5-bb4c-19e54a66f10c
93838468-72b3-4c2b-b020-d70bc36d4c81	6d36524a-25b6-4150-ab21-ecf8276864b3	4	13:00:00	14:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:32:04.566895	2026-06-19 15:32:04.566895	fbe13824-e1d7-4d6c-a574-52c604896eec	99d8814a-16e9-46a1-88d7-af4c81ead47a	66f5e957-263f-4d28-82e9-f298087874f8
a132381e-87f2-4a74-8957-e0c8c9b6d051	75c10069-e62f-45c6-beeb-7ff91f897c99	1	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 14:11:55.005253	2026-06-19 14:11:55.005253	3564e656-832a-4297-9d77-e682381ff943	fd440ae0-ab65-441c-ac23-3df1ce991974	c5b6afb7-6802-4350-9f16-9957065ea988
70719313-80ee-445d-b029-af8755f0d8fe	75c10069-e62f-45c6-beeb-7ff91f897c99	2	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 14:12:06.500039	2026-06-19 14:12:06.500039	3564e656-832a-4297-9d77-e682381ff943	fd440ae0-ab65-441c-ac23-3df1ce991974	c5b6afb7-6802-4350-9f16-9957065ea988
2fd9bcf6-8dc0-48ca-b85d-90b5f2eb300a	75c10069-e62f-45c6-beeb-7ff91f897c99	3	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 14:12:34.279939	2026-06-19 14:12:34.279939	3564e656-832a-4297-9d77-e682381ff943	fd440ae0-ab65-441c-ac23-3df1ce991974	c5b6afb7-6802-4350-9f16-9957065ea988
46f0a7e3-dc85-450f-a6ca-10c20ae1ebd3	6d36524a-25b6-4150-ab21-ecf8276864b3	4	10:00:00	11:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:03:56.01006	2026-06-19 15:03:56.01006	b7fc3e11-bb7b-4028-b716-21342def9607	bad2170e-2173-486a-ad49-670c4b3884ed	c5b6afb7-6802-4350-9f16-9957065ea988
4540f4b2-12c7-4734-b2c4-836fea9aa0e5	6d36524a-25b6-4150-ab21-ecf8276864b3	4	11:00:00	12:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:04:26.957192	2026-06-19 15:04:26.957192	6e5b1465-448f-4e0f-b7bf-761b59f89d40	bad2170e-2173-486a-ad49-670c4b3884ed	c5b6afb7-6802-4350-9f16-9957065ea988
355dcdfc-40e5-49d4-bfbe-8309eae81d6a	6d36524a-25b6-4150-ab21-ecf8276864b3	4	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:07:39.201761	2026-06-19 15:07:39.201761	3564e656-832a-4297-9d77-e682381ff943	fd440ae0-ab65-441c-ac23-3df1ce991974	c5b6afb7-6802-4350-9f16-9957065ea988
68087b48-7ff2-43b6-9e1c-746df20c9944	6d36524a-25b6-4150-ab21-ecf8276864b3	3	14:00:00	15:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:08:08.134658	2026-06-19 15:08:08.134658	dccb9d18-c0b7-4ec2-9c48-229cc6f16909	d4be831a-595c-43a7-966c-9e92d77bd49d	c5b6afb7-6802-4350-9f16-9957065ea988
bddd8f49-3783-41f1-83aa-d859aee0d09b	6d36524a-25b6-4150-ab21-ecf8276864b3	4	16:00:00	17:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:33:54.124321	2026-06-19 15:33:54.124321	f0a1546b-975b-46ca-a397-c988f60497bf	99d8814a-16e9-46a1-88d7-af4c81ead47a	66f5e957-263f-4d28-82e9-f298087874f8
1e0628c0-1166-4cc6-bff6-59bae03eea04	6d36524a-25b6-4150-ab21-ecf8276864b3	4	15:00:00	16:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:34:19.751233	2026-06-19 15:34:19.751233	78a8467d-eeed-490f-90ef-82e87d99163d	99d8814a-16e9-46a1-88d7-af4c81ead47a	66f5e957-263f-4d28-82e9-f298087874f8
6b2d306d-7503-42b7-a54f-ecbb7451bf7a	6d36524a-25b6-4150-ab21-ecf8276864b3	2	16:00:00	17:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:05:46.894001	2026-06-19 15:35:09.226631	3376e0a3-b188-4df9-b297-a06f035da902	fd440ae0-ab65-441c-ac23-3df1ce991974	c5b6afb7-6802-4350-9f16-9957065ea988
bd263a9a-7637-4eaf-8589-fd52f3ce5ebc	6d36524a-25b6-4150-ab21-ecf8276864b3	1	16:00:00	17:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:36:07.694132	2026-06-19 15:36:07.694132	1fb1ff93-ba91-4150-8a77-968e9ffea845	46359a73-dd9b-4f10-9c29-4f30e0abbab9	2ac82795-6f0c-43ec-9ed1-10bc59e06129
5407bc41-ac0f-4384-9110-664565b30a35	6d36524a-25b6-4150-ab21-ecf8276864b3	3	16:00:00	17:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:36:31.314109	2026-06-19 15:36:31.314109	fbe13824-e1d7-4d6c-a574-52c604896eec	46359a73-dd9b-4f10-9c29-4f30e0abbab9	2ac82795-6f0c-43ec-9ed1-10bc59e06129
280a3986-b6d9-4435-b06a-5ba67d4e364a	6d36524a-25b6-4150-ab21-ecf8276864b3	2	08:45:00	09:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:37:22.838362	2026-06-19 15:37:54.82586	f0a1546b-975b-46ca-a397-c988f60497bf	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
07e93bee-5ddc-434b-a279-641751ba99f1	6d36524a-25b6-4150-ab21-ecf8276864b3	4	08:45:00	09:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:38:27.467673	2026-06-19 15:38:27.467673	f0a1546b-975b-46ca-a397-c988f60497bf	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
fae99c05-3707-4c32-a776-3eece1ffaa0d	6d36524a-25b6-4150-ab21-ecf8276864b3	1	11:00:00	12:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:38:49.668971	2026-06-19 15:38:59.806106	e2d5a448-2283-410b-8836-751ee1791b22	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
d2d4db4a-0b30-455d-ab6e-40eb944a0798	6d36524a-25b6-4150-ab21-ecf8276864b3	3	11:00:00	12:00:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:39:16.678036	2026-06-19 15:39:16.678036	e2d5a448-2283-410b-8836-751ee1791b22	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
c7a33cf9-ece6-41c3-a5a9-5d5a6638423a	6d36524a-25b6-4150-ab21-ecf8276864b3	3	07:45:00	08:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:09:36.712568	2026-06-19 15:41:05.589781	00ca4541-f6b2-4339-8ad9-8b96d04134b8	e713ecfc-6ff0-4de6-9b5c-117b875b92ef	c5b6afb7-6802-4350-9f16-9957065ea988
a4d23139-2141-495d-a50a-d7c595296ee8	6d36524a-25b6-4150-ab21-ecf8276864b3	2	07:45:00	08:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:41:38.252333	2026-06-19 15:41:38.252333	a18b6159-7419-49db-8f2b-9f591b20dec0	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
dba07b84-8ac9-48c5-a0aa-d2a22821800c	6d36524a-25b6-4150-ab21-ecf8276864b3	5	07:45:00	08:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:42:31.476476	2026-06-19 15:42:31.476476	a18b6159-7419-49db-8f2b-9f591b20dec0	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
948dc8d0-4483-4f0a-83d8-81af4551bee8	6d36524a-25b6-4150-ab21-ecf8276864b3	1	08:45:00	09:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:43:36.124979	2026-06-19 15:43:36.124979	9a197dcf-b381-4267-82c3-6636c6e03349	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
c725c9ed-8733-4373-b027-9ebffcb241d0	6d36524a-25b6-4150-ab21-ecf8276864b3	3	08:45:00	09:45:00	e1fffa39-0f96-4e8f-b27d-e888c570eeb4	2026-06-19 15:44:17.565679	2026-06-19 15:44:17.565679	9a197dcf-b381-4267-82c3-6636c6e03349	13e91c5d-ff8e-4ae9-9e3d-c2c260a52cac	0a648a56-c04c-4e30-aa3c-239605a7d0ca
\.


--
-- TOC entry 5369 (class 0 OID 17915)
-- Dependencies: 223
-- Data for Name: sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sections (id, name, created_at, updated_at) FROM stdin;
77ae06d3-d5f7-40f5-9474-c439e80fa6d1	Default Section	2026-06-16 08:55:33.61262	2026-06-16 08:55:33.61262
3564e656-832a-4297-9d77-e682381ff943	GRADE 8 - LOTUS	2026-06-19 14:10:52.893544	2026-06-19 14:17:28.027695
b7fc3e11-bb7b-4028-b716-21342def9607	GRADE 7 - AZALEA	2026-06-19 14:17:37.206245	2026-06-19 14:17:37.206245
6e5b1465-448f-4e0f-b7bf-761b59f89d40	GRADE 7 - ASTER	2026-06-19 14:18:09.35671	2026-06-19 14:18:09.35671
dccb9d18-c0b7-4ec2-9c48-229cc6f16909	GRADE 7 - AMARYLLIS	2026-06-19 14:18:21.017698	2026-06-19 14:18:21.017698
3376e0a3-b188-4df9-b297-a06f035da902	GRADE 8 - LILY	2026-06-19 14:37:13.661065	2026-06-19 14:37:13.661065
67de0360-09db-4a4a-9607-a42bd897c29e	GRADE 9 - MARIGOLD	2026-06-19 14:37:27.828446	2026-06-19 14:37:27.828446
9d1558a6-1a56-48d5-a2fa-62196dd1e284	GRADE 9 - MAGNOLIA	2026-06-19 14:37:54.50924	2026-06-19 14:37:54.50924
00ca4541-f6b2-4339-8ad9-8b96d04134b8	GRADE 10 - SAMPAGUITA	2026-06-19 14:38:10.357505	2026-06-19 14:38:10.357505
632401b8-2014-469c-b585-4bc1083657ef	GRADE 10 - SUNFLOWER	2026-06-19 14:38:18.405295	2026-06-19 14:38:18.405295
f0a1546b-975b-46ca-a397-c988f60497bf	GRADE 11 - STEM B	2026-06-19 15:14:24.441619	2026-06-19 15:14:24.441619
78a8467d-eeed-490f-90ef-82e87d99163d	GRADE 11 - BE & ASSH	2026-06-19 15:14:44.90357	2026-06-19 15:14:44.90357
fbe13824-e1d7-4d6c-a574-52c604896eec	GRADE 11 - STEM A	2026-06-19 15:14:11.768191	2026-06-19 15:15:27.450312
1fb1ff93-ba91-4150-8a77-968e9ffea845	GRADE 12 - STEM A	2026-06-19 15:17:18.512685	2026-06-19 15:17:18.512685
1f573ecd-ee10-49e7-b32d-940501bde68c	GRADE 12 - STEM B	2026-06-19 15:17:27.01949	2026-06-19 15:17:27.01949
e2d5a448-2283-410b-8836-751ee1791b22	GRADE 12 - GAS	2026-06-19 15:17:35.115079	2026-06-19 15:17:35.115079
a18b6159-7419-49db-8f2b-9f591b20dec0	GRADE 12 - ABM	2026-06-19 15:17:53.691993	2026-06-19 15:17:53.691993
9a197dcf-b381-4267-82c3-6636c6e03349	GRADE 12 - HUMSS	2026-06-19 15:18:05.40498	2026-06-19 15:18:05.40498
\.


--
-- TOC entry 5371 (class 0 OID 17954)
-- Dependencies: 225
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, created_at, updated_at) FROM stdin;
10647979-2c99-4f6c-a662-261fbc8b290b	Default Subject	2026-06-19 11:14:51.93918	2026-06-19 11:14:51.93918
c5b6afb7-6802-4350-9f16-9957065ea988	ESP	2026-06-19 14:11:11.384144	2026-06-19 14:11:11.384144
66f5e957-263f-4d28-82e9-f298087874f8	Bookkeeping 1	2026-06-19 14:42:08.458949	2026-06-19 14:42:08.458949
592d8e98-89fb-4dd5-bb4c-19e54a66f10c	Elective 1	2026-06-19 14:42:28.875121	2026-06-19 14:42:28.875121
0a648a56-c04c-4e30-aa3c-239605a7d0ca	PE and Health	2026-06-19 14:42:45.364212	2026-06-19 14:42:45.364212
2ac82795-6f0c-43ec-9ed1-10bc59e06129	General Physics	2026-06-19 14:42:57.347873	2026-06-19 14:42:57.347873
657cf82d-27c8-4da6-8401-bf8a9d927e8e	COMPLAB	2026-06-19 14:44:38.094237	2026-06-19 14:44:38.094237
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


-- Completed on 2026-06-19 22:21:32

--
-- PostgreSQL database dump complete
--

\unrestrict t7RjCf6eL8azTxxcK7nvayKnMBpWTP47G3q2sJr0TeZnw25ezfgHzGVbq1ZlLbg

