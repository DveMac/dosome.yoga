SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE TYPE public.search_label AS ENUM (
    'yoga',
    'meditation'
);

--
-- Name: trigger_set_timestamp(); Type: FUNCTION; Schema: public;
--

CREATE FUNCTION public.trigger_set_timestamp() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

--
-- Name: feedback; Type: TABLE; Schema: public;
--

CREATE TABLE public.feedback (
    video_id character varying(24) NOT NULL,
    rate smallint NOT NULL,
    "position" integer NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    schedule_key character varying(100) NOT NULL
);


--
-- Name: schedules; Type: TABLE; Schema: public;
--

CREATE TABLE public.schedules (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    playlist character varying[] NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    tags character varying[] NOT NULL,
    duration smallint NOT NULL
);


--
-- Name: schedules_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.schedules_id_seq OWNED BY public.schedules.id;


--
-- Name: search; Type: TABLE; Schema: public;
--

CREATE TABLE public.search (
    id integer NOT NULL,
    etag character varying(64) NOT NULL,
    video_id character varying(24) NOT NULL,
    query character varying(200),
    label public.search_label
);

--
-- Name: search_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.search_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: search_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.search_id_seq OWNED BY public.search.id;


--
-- Name: tags; Type: TABLE; Schema: public;
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying(64) NOT NULL,
    "group" character varying(64) NOT NULL
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: video_tags; Type: TABLE; Schema: public;
--

CREATE TABLE public.video_tags (
    video_id character varying(24) NOT NULL,
    tag_name character varying(64) NOT NULL
);

--
-- Name: videos; Type: TABLE; Schema: public
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    etag character varying(64) NOT NULL,
    video_id character varying(24) NOT NULL,
    deleted boolean,
    snippet json,
    content_details json,
    statistics json,
    tsv tsvector,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);

--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public;
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public;
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- Name: videos_view; Type: MATERIALIZED VIEW; Schema: public;
--

CREATE MATERIALIZED VIEW public.videos_view AS
 SELECT v.video_id,
    (v.snippet ->> 'channelId'::text) AS channel_id,
    (v.snippet ->> 'title'::text) AS title,
    json_build_object('default', (((v.snippet -> 'thumbnails'::text) -> 'default'::text) ->> 'url'::text), 'medium', (((v.snippet -> 'thumbnails'::text) -> 'medium'::text) ->> 'url'::text), 'high', (((v.snippet -> 'thumbnails'::text) -> 'high'::text) ->> 'url'::text)) AS images,
    ((v.statistics ->> 'likeCount'::text))::integer AS like_count,
    ((v.statistics ->> 'viewCount'::text))::integer AS view_count,
    ((COALESCE(("substring"((v.content_details ->> 'duration'::text), 'PT(\d+)H.*'::text))::integer, 0) * 60) + COALESCE(("substring"((v.content_details ->> 'duration'::text), 'PT.*?(\d+)M.*'::text))::integer, 0)) AS duration,
    (((v.statistics ->> 'likeCount'::text))::double precision / ((((v.statistics ->> 'likeCount'::text))::integer + ((v.statistics ->> 'dislikeCount'::text))::integer))::double precision) AS like_perc,
    ( SELECT array_agg(vt.tag_name) AS array_agg
           FROM public.video_tags vt
          WHERE ((vt.video_id)::text = (v.video_id)::text)) AS tags
   FROM public.videos v
  WHERE ((((v.statistics ->> 'likeCount'::text))::integer >= 30) AND ((v.content_details ->> 'definition'::text) = 'hd'::text) AND (v.deleted IS NULL))
  WITH NO DATA;

--
-- Name: schedules id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.schedules ALTER COLUMN id SET DEFAULT nextval('public.schedules_id_seq'::regclass);


--
-- Name: search id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.search ALTER COLUMN id SET DEFAULT nextval('public.search_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: videos id; Type: DEFAULT; Schema: public;
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- Name: schedules schedules_key_key; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_key_key UNIQUE (key);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: search search_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.search
    ADD CONSTRAINT search_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: idx_feedback_video_id; Type: INDEX; Schema: public;
--

CREATE INDEX idx_feedback_video_id ON public.feedback USING btree (video_id);


--
-- Name: idx_unique_name; Type: INDEX; Schema: public;
--

CREATE UNIQUE INDEX idx_unique_name ON public.tags USING btree (name);


--
-- Name: idx_unique_video_id; Type: INDEX; Schema: public;
--

CREATE UNIQUE INDEX idx_unique_video_id ON public.search USING btree (video_id);


--
-- Name: idx_unique_video_tag; Type: INDEX; Schema: public;
--

CREATE UNIQUE INDEX idx_unique_video_tag ON public.video_tags USING btree (video_id, tag_name);


--
-- Name: idx_unique_videos_video_id; Type: INDEX; Schema: public;
--

CREATE UNIQUE INDEX idx_unique_videos_video_id ON public.videos USING btree (video_id);


--
-- Name: idx_video_tags_tag; Type: INDEX; Schema: public;
--

CREATE INDEX idx_video_tags_tag ON public.video_tags USING btree (tag_name);


--
-- Name: idx_video_tags_video; Type: INDEX; Schema: public;
--

CREATE INDEX idx_video_tags_video ON public.video_tags USING btree (video_id);


--
-- Name: idx_vv_duration; Type: INDEX; Schema: public;
--

CREATE INDEX idx_vv_duration ON public.videos_view USING btree (duration);


--
-- Name: idx_vv_like_perc; Type: INDEX; Schema: public;
--

CREATE INDEX idx_vv_like_perc ON public.videos_view USING btree (like_perc);


--
-- Name: idx_vv_tags; Type: INDEX; Schema: public;
--

CREATE INDEX idx_vv_tags ON public.videos_view USING btree (tags);


--
-- Name: tsv_idx; Type: INDEX; Schema: public;
--

CREATE INDEX tsv_idx ON public.videos USING gin (tsv);


--
-- Name: videos set_timestamp; Type: TRIGGER; Schema: public;
--

CREATE TRIGGER set_timestamp BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE PROCEDURE public.trigger_set_timestamp();


--
-- Name: video_tags video_tags_tag_name_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT video_tags_tag_name_fkey FOREIGN KEY (tag_name) REFERENCES public.tags(name) ON DELETE CASCADE;


--
-- Name: video_tags video_tags_video_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.video_tags
    ADD CONSTRAINT video_tags_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(video_id) ON DELETE CASCADE;


--
-- Name: videos videos_video_id_fkey; Type: FK CONSTRAINT; Schema: public;
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.search(video_id) ON DELETE CASCADE;
