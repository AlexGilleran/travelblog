--
-- PostgreSQL database dump
--

-- Dumped from database version 9.4.2
-- Dumped by pg_dump version 9.4.0
-- Started on 2015-06-09 14:26:36 EDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

DROP DATABASE "TravelBlog";
--
-- TOC entry 2292 (class 1262 OID 16540)
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

--
-- TOC entry 6 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2293 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- TOC entry 178 (class 3079 OID 12123)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2295 (class 0 OID 0)
-- Dependencies: 178
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 172 (class 1259 OID 16541)
-- Name: blog; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE blog (
    blog_id bigint NOT NULL,
    name name NOT NULL,
    description text,
    user_id bigint NOT NULL
);


ALTER TABLE blog OWNER TO postgres;

--
-- TOC entry 173 (class 1259 OID 16547)
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
-- TOC entry 2296 (class 0 OID 0)
-- Dependencies: 173
-- Name: blog_blog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE blog_blog_id_seq OWNED BY blog.blog_id;


--
-- TOC entry 174 (class 1259 OID 16549)
-- Name: entry; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
--

CREATE TABLE entry (
    markdown text NOT NULL,
    entry_id bigint NOT NULL,
    title name,
    blog_id bigint NOT NULL
);


ALTER TABLE entry OWNER TO postgres;

--
-- TOC entry 175 (class 1259 OID 16555)
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
-- TOC entry 2297 (class 0 OID 0)
-- Dependencies: 175
-- Name: entry_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE entry_id_seq OWNED BY entry.entry_id;


--
-- TOC entry 176 (class 1259 OID 16557)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres; Tablespace: 
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
-- TOC entry 177 (class 1259 OID 16563)
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
-- TOC entry 2298 (class 0 OID 0)
-- Dependencies: 177
-- Name: user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE user_user_id_seq OWNED BY "user".user_id;


--
-- TOC entry 2162 (class 2604 OID 16565)
-- Name: blog_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY blog ALTER COLUMN blog_id SET DEFAULT nextval('blog_blog_id_seq'::regclass);


--
-- TOC entry 2163 (class 2604 OID 16566)
-- Name: entry_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry ALTER COLUMN entry_id SET DEFAULT nextval('entry_id_seq'::regclass);


--
-- TOC entry 2164 (class 2604 OID 16567)
-- Name: user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY "user" ALTER COLUMN user_id SET DEFAULT nextval('user_user_id_seq'::regclass);


--
-- TOC entry 2282 (class 0 OID 16541)
-- Dependencies: 172
-- Data for Name: blog; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO blog (blog_id, name, description, user_id) VALUES (1, 'Alex''s sweet blog', 'A blog about alex being a mad cunt', 1);
INSERT INTO blog (blog_id, name, description, user_id) VALUES (2, 'Alex''s lame blog', 'A blog about knitting and embroidery', 1);


--
-- TOC entry 2299 (class 0 OID 0)
-- Dependencies: 173
-- Name: blog_blog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('blog_blog_id_seq', 2, true);


--
-- TOC entry 2284 (class 0 OID 16549)
-- Dependencies: 174
-- Data for Name: entry; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO entry (markdown, entry_id, title, blog_id) VALUES ('Blah blah blah', 1, 'Awesome entry 1', 1);
INSERT INTO entry (markdown, entry_id, title, blog_id) VALUES ('Blah blah 2', 2, 'Awesome entry 2', 1);
INSERT INTO entry (markdown, entry_id, title, blog_id) VALUES ('Lame blah 1', 3, 'Lame entry 1', 2);
INSERT INTO entry (markdown, entry_id, title, blog_id) VALUES ('Lame blah 2', 4, 'Lame entry 2', 2);


--
-- TOC entry 2300 (class 0 OID 0)
-- Dependencies: 175
-- Name: entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('entry_id_seq', 4, true);


--
-- TOC entry 2286 (class 0 OID 16557)
-- Dependencies: 176
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "user" (user_id, email, user_name, display_name, bio, avatar_url, password_hash) VALUES (1, 'alex@alexgilleran.com', 'alex', 'alex', 'alex is good', 'https://avatars3.githubusercontent.com/u/900555?v=3&s=460', 'password');


--
-- TOC entry 2301 (class 0 OID 0)
-- Dependencies: 177
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('user_user_id_seq', 1, true);


--
-- TOC entry 2166 (class 2606 OID 16569)
-- Name: blog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY blog
    ADD CONSTRAINT blog_pkey PRIMARY KEY (blog_id);


--
-- TOC entry 2168 (class 2606 OID 16571)
-- Name: entry_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_pkey PRIMARY KEY (entry_id);


--
-- TOC entry 2170 (class 2606 OID 16573)
-- Name: user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres; Tablespace: 
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- TOC entry 2171 (class 2606 OID 16589)
-- Name: blog_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY blog
    ADD CONSTRAINT blog_user_id_fkey FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2172 (class 2606 OID 16584)
-- Name: entry_blog_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY entry
    ADD CONSTRAINT entry_blog_id_fkey FOREIGN KEY (blog_id) REFERENCES blog(blog_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2294 (class 0 OID 0)
-- Dependencies: 6
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2015-06-09 14:26:36 EDT

--
-- PostgreSQL database dump complete
--

