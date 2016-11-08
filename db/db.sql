--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.3
-- Dumped by pg_dump version 9.5.4

-- Started on 2016-11-08 23:46:36 AEDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "TravelBlog";
--
-- TOC entry 2137 (class 1262 OID 16384)
-- Name: TravelBlog; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "TravelBlog" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';


ALTER DATABASE "TravelBlog" OWNER TO postgres;

\connect "TravelBlog"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12361)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2140 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- TOC entry 187 (class 1255 OID 16442)
-- Name: update_modified_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION update_modified_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   IF row(NEW.*) IS DISTINCT FROM row(OLD.*) THEN
      NEW.modified = now(); 
      RETURN NEW;
   ELSE
      RETURN OLD;
   END IF;
END;
$$;


ALTER FUNCTION public.update_modified_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 181 (class 1259 OID 16385)
-- Name: blog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE blog (
    blog_id bigint NOT NULL,
    name name NOT NULL,
    description text,
    user_id bigint NOT NULL
);


ALTER TABLE blog OWNER TO postgres;

--
-- TOC entry 182 (class 1259 OID 16391)
-- Name: blog_blog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE blog_blog_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE blog_blog_id_seq OWNER TO postgres;

--
-- TOC entry 2141 (class 0 OID 0)
-- Dependencies: 182
-- Name: blog_blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE blog_blog_id_seq OWNED BY blog.blog_id;


--
-- TOC entry 183 (class 1259 OID 16393)
-- Name: entry; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE entry (
    markdown text,
    entry_id bigint NOT NULL,
    title name,
    blog_id bigint NOT NULL,
    modified timestamp without time zone,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE entry OWNER TO postgres;

--
-- TOC entry 184 (class 1259 OID 16399)
-- Name: entry_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE entry_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE entry_id_seq OWNER TO postgres;

--
-- TOC entry 2142 (class 0 OID 0)
-- Dependencies: 184
-- Name: entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE entry_id_seq OWNED BY entry.entry_id;


--
-- TOC entry 185 (class 1259 OID 16401)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE "user" (
    user_id bigint NOT NULL,
    email character varying(254) NOT NULL,
    user_name character varying(255) NOT NULL,
    display_name character varying(255),
    bio text,
    avatar_url character varying(2048),
    password_hash character varying(255) NOT NULL
);


ALTER TABLE "user" OWNER TO postgres;

--
-- TOC entry 186 (class 1259 OID 16407)
-- Name: user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE user_user_id_seq OWNER TO postgres;

--
-- TOC entry 2143 (class 0 OID 0)
-- Dependencies: 186
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_user_id_seq OWNED BY "user".user_id;


--
-- TOC entry 2001 (class 2604 OID 16409)
-- Name: blog_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY blog ALTER COLUMN blog_id SET DEFAULT nextval('blog_blog_id_seq'::regclass);


--
-- TOC entry 2002 (class 2604 OID 16410)
-- Name: entry_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry ALTER COLUMN entry_id SET DEFAULT nextval('entry_id_seq'::regclass);


--
-- TOC entry 2004 (class 2604 OID 16411)
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user" ALTER COLUMN user_id SET DEFAULT nextval('user_user_id_seq'::regclass);


--
-- TOC entry 2127 (class 0 OID 16385)
-- Dependencies: 181
-- Data for Name: blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY blog (blog_id, name, description, user_id) FROM stdin;
1	Alex's sweet blog	A blog about alex being a mad cunt	1
2	Alex's lame blog	A blog about knitting and embroidery	1
\.


--
-- TOC entry 2144 (class 0 OID 0)
-- Dependencies: 182
-- Name: blog_blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('blog_blog_id_seq', 2, true);


--
-- TOC entry 2129 (class 0 OID 16393)
-- Dependencies: 183
-- Data for Name: entry; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY entry (markdown, entry_id, title, blog_id, modified, created) FROM stdin;
\N	1	Awesome entry 4	1	2010-01-01 00:00:00	2010-01-01 00:00:00
{"entityMap":{},"blocks":[{"key":"54tgo","text":" gerg a","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":2,"length":3,"style":"BOLD"}],"entityRanges":[],"data":{}},{"key":"7q106","text":"","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}},{"key":"51bnc","text":"argerga","type":"unstyled","depth":0,"inlineStyleRanges":[{"offset":1,"length":3,"style":"BOLD"}],"entityRanges":[],"data":{}}]}	2	Awesome entry 2	1	2010-01-01 00:00:00	2010-01-01 00:00:00
\N	3	Lame entry 1	2	2010-01-01 00:00:00	2010-01-01 00:00:00
\N	4	Lame entry 2	2	2010-01-01 00:00:00	2010-01-01 00:00:00
{"entityMap":{},"blocks":[{"key":"84k3q","text":"This is new.","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}	12	New Entry	1	\N	\N
\.


--
-- TOC entry 2145 (class 0 OID 0)
-- Dependencies: 184
-- Name: entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('entry_id_seq', 12, true);


--
-- TOC entry 2131 (class 0 OID 16401)
-- Dependencies: 185
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY "user" (user_id, email, user_name, display_name, bio, avatar_url, password_hash) FROM stdin;
1	alex@alexgilleran.com	alex	alex	alex is good	https://avatars3.githubusercontent.com/u/900555?v=3&s=460	password
2						
3						
4	blahface@example.com	blahface	blahface	Bio	blahface.com	password
\.


--
-- TOC entry 2146 (class 0 OID 0)
-- Dependencies: 186
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_user_id_seq', 4, true);


--
-- TOC entry 2006 (class 2606 OID 16413)
-- Name: blog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (blog_id);


--
-- TOC entry 2008 (class 2606 OID 16415)
-- Name: entry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (entry_id);


--
-- TOC entry 2010 (class 2606 OID 16417)
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2011 (class 2606 OID 16418)
-- Name: blog_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY blog
    ADD CONSTRAINT blog_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2012 (class 2606 OID 16423)
-- Name: entry_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES blog(blog_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2139 (class 0 OID 0)
-- Dependencies: 7
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2016-11-08 23:46:36 AEDT

--
-- PostgreSQL database dump complete
--

