--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: balance_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.balance_records (
    id integer NOT NULL,
    user_id integer NOT NULL,
    money double precision,
    date date DEFAULT now()
);


ALTER TABLE public.balance_records OWNER TO postgres;

--
-- Name: balance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.balance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.balance_records_id_seq OWNER TO postgres;

--
-- Name: balance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.balance_records_id_seq OWNED BY public.balance_records.id;


--
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    user_id integer NOT NULL,
    item_id integer NOT NULL,
    item_quantity integer NOT NULL
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- Name: item_sizes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.item_sizes (
    item_id integer NOT NULL,
    name character varying(6) NOT NULL,
    quantity integer NOT NULL,
    id integer NOT NULL
);


ALTER TABLE public.item_sizes OWNER TO postgres;

--
-- Name: items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.items (
    id integer NOT NULL,
    name character varying(70) NOT NULL,
    image_path text NOT NULL,
    material character varying(70) NOT NULL,
    price double precision NOT NULL,
    user_id integer
);


ALTER TABLE public.items OWNER TO postgres;

--
-- Name: locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.locations (
    user_id integer NOT NULL,
    street character varying(64),
    place character varying(64),
    psc character varying(10)
);


ALTER TABLE public.locations OWNER TO postgres;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    order_id integer NOT NULL,
    item_id integer NOT NULL,
    quantity integer NOT NULL,
    seller_id integer NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    order_date date DEFAULT now() NOT NULL,
    delivery_date date,
    state integer DEFAULT 0
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    user_id integer NOT NULL,
    item_id integer NOT NULL,
    rating integer NOT NULL,
    text text NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id integer NOT NULL,
    user_id integer,
    token character varying(64),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: session_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.session_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.session_id_seq OWNER TO postgres;

--
-- Name: session_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.session_id_seq OWNED BY public.sessions.id;


--
-- Name: t_shirt_sizes_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_shirt_sizes_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_shirt_sizes_item_id_seq OWNER TO postgres;

--
-- Name: t_shirt_sizes_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_shirt_sizes_item_id_seq OWNED BY public.item_sizes.id;


--
-- Name: t_shirts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.t_shirts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.t_shirts_id_seq OWNER TO postgres;

--
-- Name: t_shirts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.t_shirts_id_seq OWNED BY public.items.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name character varying(32) NOT NULL,
    last_name character varying(32) NOT NULL,
    email character varying(256) NOT NULL,
    password character varying(32) NOT NULL,
    access_allowed boolean DEFAULT true NOT NULL,
    role integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: balance_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.balance_records ALTER COLUMN id SET DEFAULT nextval('public.balance_records_id_seq'::regclass);


--
-- Name: item_sizes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_sizes ALTER COLUMN id SET DEFAULT nextval('public.t_shirt_sizes_item_id_seq'::regclass);


--
-- Name: items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items ALTER COLUMN id SET DEFAULT nextval('public.t_shirts_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.session_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: balance_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.balance_records (id, user_id, money, date) FROM stdin;
\.


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart (user_id, item_id, item_quantity) FROM stdin;
\.


--
-- Data for Name: item_sizes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.item_sizes (item_id, name, quantity, id) FROM stdin;
28	XS	0	50
29	XS	1	51
29	L	5	52
29	XL	3	53
30	XS	12	54
30	S	2	55
30	XL	5	56
30	XXXL	1	58
32	S	1	61
32	XXXL	1	62
35	XS	10	65
35	L	51	66
35	XL	214	67
36	XS	11	69
36	L	5	70
37	XS	1	71
38	XS	3	72
39	L	5	73
39	XL	35	74
39	XXL	2	75
40	XS	11	76
40	S	5	77
40	L	1	78
40	XL	1	79
40	XXL	1	80
40	XXXL	1	81
41	S	2	82
41	L	4	83
41	XL	3	84
41	XXL	5	85
42	XS	1	86
42	S	1	87
42	XXL	3	88
43	XS	15	89
43	XXL	4	90
43	XXXL	2	91
22	XXL	0	43
23	XXL	0	46
23	XL	0	45
23	S	0	44
44	XS	2	92
44	XL	5	93
44	XXL	1	94
27	XL	0	49
44	XXXL	5	95
45	S	5	96
46	XS	24545224	97
47	XS	132	98
48	XS	1	99
49	XS	5	100
50	XS	1	101
51	XS	4	102
52	XS	4	103
33	XS	0	63
34	XS	0	64
53	XS	1	104
54	L	1	105
30	XXL	0	57
35	XXL	0	68
\.


--
-- Data for Name: items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.items (id, name, image_path, material, price, user_id) FROM stdin;
22	234	image-1759647939928-859428999.jpg	Material	234	288
23	Woof	image-1759652894056-260004179.jpg	Woof	23	288
27	123123	image-1759736558710-642754925.jpg	14	141	288
28	12341	image-1759739377190-979494793.jpg	412	5	288
29	412421	image-1759747527977-569904583.png	524152	1	288
30	413	image-1759747541752-877531264.jpg	5135	5	288
32	132	image-1759747563151-281207023.png	312	5	288
33	4512	image-1759747572750-903366266.jpg	1	5	288
34	321	image-1759747580864-882312090.jpg	5	2	288
35	142	image-1759747597916-354665918.jpg	142	55	288
36	4125	image-1759747612836-217839307.png	531	521	288
37	513	image-1759747623526-13737253.jpg	5	153	288
38	412	image-1759747632385-398126879.jpg	55	21	288
39	412	image-1759747645039-773789719.jpg	51	5	288
40	421	image-1759747657069-750627803.jpg	5	23	288
41	513	image-1759747676898-416732004.jpg	54	5	288
42	531	image-1759747692533-584705859.jpg	1	5	288
43	Name 	image-1759747711841-11175631.jpg	4	5	288
44	Cool Shirt	image-1759747726743-543888940.jpg	2	5	288
45	Sharie Noren	image-1759748590327-654531977.jpg	431	1	288
46	123	image-1760206721266-873732597.jpg	653	653653536	288
47	312	image-1760207227977-270933609.jpg	312	132	288
48	132	image-1760207259432-22138998.jpg	312	132	288
49	132	image-1760207291566-842128059.jpg	1	55151	288
50	312	image-1760207563368-115361661.jpg	23	32	288
51	1	image-1760207703592-720850400.jpg	2	3	288
52	1	image-1760207911732-680312829.jpg	2	3	288
53	123	image-1760279695055-480980412.jpg	material	5	288
54	1	image-1760279731945-149789645.jpg	material	5	288
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.locations (user_id, street, place, psc) FROM stdin;
287	541514	431413	431
289	12312312	123123	1231332132
290	21312	42425	123123
288	Street	2222233333	123
292	\N	\N	\N
293	\N	\N	\N
294	\N	\N	\N
295	\N	\N	\N
296	\N	\N	\N
266	Nimp312312313	Simp322321312321232312	1111111131
297	4311	321	213
286	\N	\N	\N
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (order_id, item_id, quantity, seller_id) FROM stdin;
13	43	1	288
13	46	1	288
13	45	10	288
13	44	5	288
14	43	1	288
14	46	1	288
14	45	10	288
14	44	5	288
15	43	1	288
15	46	1	288
15	45	10	288
15	44	5	288
16	43	1	288
16	46	1	288
17	43	1	288
17	46	1	288
17	45	10	288
17	44	5	288
18	49	1	288
19	49	1	288
20	49	-1	288
21	50	1	288
22	63	1	288
22	64	2	288
23	57	5	288
23	68	512	288
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, order_date, delivery_date, state) FROM stdin;
13	266	2025-10-06	\N	0
14	266	2025-10-06	\N	0
15	266	2025-10-06	\N	0
16	266	2025-10-06	\N	0
17	266	2025-10-06	\N	0
18	266	2025-10-06	\N	0
19	266	2025-10-06	\N	0
20	266	2025-10-06	\N	0
21	266	2025-10-06	\N	0
22	266	2025-10-12	\N	0
23	297	2025-11-16	\N	0
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (user_id, item_id, rating, text) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, token, created_at) FROM stdin;
100	249	4cc7dca2e48dc3af435d6f88a7fb082057da636f543a588aff3adb1b1fcfc387	2025-09-21 10:27:01.844924
102	251	e395f1f03868ed59df8d46ba8f14857c504980965c02fd3c3260f3eb95e42074	2025-09-21 20:06:18.415603
104	253	25adb7e8c93181ee8e3b76c25daa4e914626b5e07f6a4bac61e7517695d3db22	2025-09-27 16:02:37.757352
109	258	e5b6591d67eb6d67b3edc6420962100f2dbe09a093bdb02ce1cb7fe187dd3ea3	2025-09-27 17:46:55.023143
111	261	75809bd405b31a3d5d4db89dc800206f59db0c3f030f076ffff4002f93e0274a	2025-09-27 17:49:58.294697
113	264	eb34980d080fd925ad441fa1b948849a8bda98c276ea71925f2d16ba26afaeeb	2025-09-27 17:52:52.234096
115	266	491e08d0d205b33f0909a96fda613f0a2e913ed7396ac4680d85256abca2e088	2025-09-27 17:56:20.85599
117	268	d5d203c264801e4d5aba7cbf4ee89807f8da98f4f51698b73fa0e48e1b8b4a07	2025-09-27 18:22:16.112787
119	272	ed029377b6fa44013f031fbdef1f6ee9a59092bd012fc0b5123b98668e152829	2025-09-27 18:24:07.024152
121	276	1f2ac8e17eb54f1491d049937cef5a24194c70816614d94b7f51fde57fdf8db1	2025-09-27 18:24:56.047657
122	277	e0bfcd709ae4068b328411395fae3d4ae297db24ddfd531ba3da2ead107ad849	2025-09-27 18:25:02.829686
124	266	d88a53d850ca6b9d9dbc70625eaa622553f2634131f0980225afab1dd29c4571	2025-09-27 19:12:27.981445
126	266	5f8dda4290e2e24db389f6ed6fd9832c88ca08830ee3b8e27773e316f39ff543	2025-09-27 19:14:07.597424
128	266	8f5363fc49b5401a70f80847b54ffbeceddf3e30ea0a7179a47bda980dffd9ef	2025-09-27 19:14:40.586544
130	266	4b600513eb673daf344bf4fc6f4a0405eae59cbaf529c8c6eb44620d583e3543	2025-09-27 19:17:56.352273
132	266	9d66589713fce878ae29f97d6abd8296d08d596ee1a0d49b688bdc8aab3c2559	2025-09-28 14:49:11.175822
134	266	d6977d5ba89434228c4e151d05abce7b40028c6759c9b8513636c58286308db8	2025-09-28 21:12:00.582475
136	279	5505e7ccd31d79ce52aaa233d66f9fc3758af9ee23f48df195fb7343690209f6	2025-09-28 21:19:36.02923
138	284	191b304ac164378b34db91ef0691e41f58a96b422487de22f494bbb116c09b86	2025-09-28 21:20:29.612747
140	286	8a5b1db9cc2c42b545efbb57c7a7dbe5519a6c450f2ebedf0a5863b3f9a86e83	2025-09-28 21:21:51.514497
142	287	fe072427144f1ef112993527445e8e21dc7aa8b6b41c001eecbf1d8e31dab96c	2025-09-28 21:23:29.104999
144	266	75eea295dc3cd38e4aa181afe6e754837f801d76f61c2fc214f79a2c6b4187cb	2025-09-28 21:38:49.410902
146	266	f06db159bd71201e416c7351369d8d32a2bdc5a2b0f448f6cfe12eb5dcd86fab	2025-09-29 16:25:17.164422
147	288	c222936d5746bdc3662c06a96b0c31bdf4a86b421800b045c48fb9f4c0fe7788	2025-09-29 16:25:26.505508
149	288	4d695c0c63173bb31473348cbb9112056135ffeea04f9c05f96ddc9ab9fa178a	2025-09-29 20:16:59.670657
151	266	be0548a3cbda723e47a347ba36ae13a9be3387172df79cc427ec07bd1dc5b5fc	2025-09-29 20:19:00.042668
152	288	780d85356abc7df8762d51a4cd3d2ba010bf4a7b448c2ef40e54097cf46bac1b	2025-09-29 20:19:16.619834
155	288	3daf28115b343b4ff157b5516937c2ffe036d9a86009ae4ce20ba17957796629	2025-09-29 20:20:54.007069
157	266	35ec16aa14defa8d5c56bed514882a8540ceccce6fffdc1957036a990c8039db	2025-09-29 20:23:50.284868
159	266	2b32e913610601882023ff4d54acf2aa68ae0fcc73990137457255465ceb57e3	2025-09-29 20:24:17.031218
161	290	1faa79671f6685b1ed3b33e813df94127588dc0d08190995497479984ff10e9d	2025-09-29 20:24:42.120529
163	266	c22ad2bb39222a3e1072ec6eaec59d6136784716174c3eaa57646829c44034d3	2025-10-04 20:53:01.743828
165	288	305b9379e11bd3b78784e4e60e93f8f64f7cd434c66b0a253cd0f8043a246952	2025-10-05 09:04:27.016942
167	288	ea114a54b75cedf6c60a5363fb812dabf3081c1bdbea82e9d972d7d7d89ab62d	2025-10-05 09:05:03.596332
169	266	a3f178f25b320d6209b59b5561fcbbe2501ee33e0af39cd95f499db9084ac233	2025-10-05 10:39:39.190124
171	266	830ac5ac0fb3b21a637499689a0f0794c063953520ba7f54219eab1610249b3a	2025-10-05 10:42:30.924798
173	266	21b00f383fe3d6c6a4dee477e765052aa63df50b4433f3a1965a20e00cd2b555	2025-10-05 17:38:22.574322
175	266	4130723624d69893cbd5fde04e561a94ec43896888e9a4801e647dfceb8b2465	2025-10-06 09:56:36.888686
177	266	4014fbd901d1566f20021092a40fba62173fd1369ff8acc94d83facfe1a0f12c	2025-10-06 10:37:18.477221
179	288	1f6cf9a2e3687553936083c6c50d7c4474d38d5df3737c763f23d48eba176ae6	2025-10-06 12:44:14.799758
181	288	b86bb6bc663d7827e73f0a07e696ab44341cd869339c92550417a1e27066e263	2025-10-06 13:44:10.197878
183	288	a5b653181e79973a94f61cacabf4e0a17b41b7bd0cbaec05eccd45dbb7219d35	2025-10-06 16:16:34.45932
185	266	487ee4ba4f9fc9732bcbdc93648e81e059604c89b1481ce77855bfa4ed8f27ca	2025-10-06 17:05:13.612372
187	292	ea9abef68f0d42734e8ccb9f5949d10f3a9ef7341cad04aff708651d16886082	2025-10-12 07:32:29.225523
189	294	d9372873364a26402c04fba3095d09de36fb1417a71c4f2901ce83bdebd78321	2025-10-12 09:27:06.461808
191	296	d6062ca6420bcec4d29024a768f6f47cc25fc73a02cafa80bb7255e8928537cc	2025-10-12 13:35:10.247312
193	266	31d30f7bcf3f1cd9f0031266e6f0640b478f4a8b2edea1efddfa3aa47c39f8c2	2025-10-12 15:25:58.107587
195	266	76f2228c00734347429175fc3c85ea63921c3ec6fa2d44dd11653b9f71bbb13a	2025-10-12 16:31:58.649829
197	292	d2f62e7f2b6d1dbe3b29c1c029b77a447fda6066d822a4d54c518660907dc0ff	2025-10-12 16:35:48.31486
101	250	42f3da13716db7381641f466724fa8ffa93b705c4bdd0ee1f98e8dc68ee7756d	2025-09-21 10:41:45.561875
103	252	65b9b66cd21488c5279872c3b6b3033ea0739a6d06fc53b187d659da97c9d5e2	2025-09-27 15:36:44.399227
105	254	a3eba2249b6913c4366427e93b7f1b7d18876c09144cfb8054f4413c382aa21b	2025-09-27 16:12:44.328642
108	257	b45450bf3c624548573dd806f5fca2b83c4f0ccb090ac17fbf5aa841392cf4ee	2025-09-27 16:36:32.266278
110	259	64ac55ef189db11bd31632aca71aeba4143a0e987cb4249b8aec5876e66d3011	2025-09-27 17:49:27.79055
112	262	3b50c3f49e4c34ddcd14b66c29053e36f8c55fd91e091cbfefbacb7a21ab2bad	2025-09-27 17:52:16.477523
114	265	f0581a78316ec6c43a539fa18d4614edfccc5712bf4a6d02e9b6e3e60621cbbc	2025-09-27 17:53:20.040007
116	267	0af692b4d48cd885c3b0b8b0cc5aa85555077a2ce7baa66a9f242bfbec80ccee	2025-09-27 18:20:36.131526
118	269	7d38fa7b5a91c810a1631af26462ef7b186630657fc03a44f61958acffb62488	2025-09-27 18:22:52.518069
120	273	538e42ba71b3d6cd1709843982ee040b1beedefcdf1a11bc491e61336b0df383	2025-09-27 18:24:35.109718
123	278	9f3c6bea13493a236ba418b1a113a59e6dc1eded234117190aa119a11b7095e3	2025-09-27 19:01:45.9274
125	266	4930eddb0cd831f21c87de3ff72f0c1df4b60dd6ff28534c8b2a5289379973ae	2025-09-27 19:13:09.76996
127	266	9f60657465f4045e9dc119f5aefe4f63036d887dc53139bd5a48b7afe18fc7b3	2025-09-27 19:14:18.731588
129	266	e76a134f2acdf80262324b2f348c0adb07ecb4c66b0a55518bcd20a9296c5a58	2025-09-27 19:17:40.989398
131	266	43f215ec53f1955f670490fc8d663e5be17005954a2864bd59fffa428d8bcfb5	2025-09-27 19:40:33.267668
133	266	583fc7867659f143abf11013d6994c26b7fb7d84dc39748c53525f053c5e3f97	2025-09-28 21:11:45.138848
135	266	7bdb672cbf0a3ec17116d96a451770e0426885c312471b8557f232fe4ae3dc85	2025-09-28 21:12:11.978164
137	283	c56c738ee5e86374f65875215c5c74f9d18c61f598f523151bff5fc8bf9ad8f4	2025-09-28 21:19:55.758968
139	285	cdc82e5f797db65d4072298cd49366e341e383ed88ff4f41b3353e37af875058	2025-09-28 21:21:03.411194
141	266	130031a43dc287eda82fd8545b31f66e6d211dbb36817178ba333e2c974146a4	2025-09-28 21:22:09.100187
143	266	d76e2278c13799a00d2aedfe1976888f9008faebd819ee29117044f613180f3c	2025-09-28 21:37:48.34718
145	288	b04e6115f3ddf461ca19a556b07bed774b0ab0e664dbbf6410f029e697692a9d	2025-09-29 16:19:07.22352
148	266	85c1cccbf2bf1ee2928f33b76958ac5e6630eaff4e6f9f986c5e0d181d1e903f	2025-09-29 20:16:34.835395
150	289	34ee5c29cbcc8c9bb8a3a26d93f0cbfe148b3d71cac1f1fbd22649e376c7cca9	2025-09-29 20:18:41.793835
153	266	8fc1581451fbb0652e87f889549bfd91b6e132ec1158ef17680a849c27fe6dc7	2025-09-29 20:20:30.859078
154	266	c102d7f30c61a9e92fd03158c40399e12bee2903472e54494cd004f2c213f3b6	2025-09-29 20:20:42.257568
156	266	3227a22add2fb53b5ae79f0928a878cba436ef4efddb216733aaa0854b957000	2025-09-29 20:23:37.294484
99	248	55224097e8ac82db0cd3fddc54c32311ddcc71ae71bb28eb35db095ae028fa25	2025-09-21 10:25:55.96967
158	288	39296bd338e7f3c2468de284f61c5f21fe4fc6e0b5caa81b498822e17321f322	2025-09-29 20:23:59.812481
160	266	0b2784e91558de9ea98f77198dbbcf35dbaaa4108d69818f0d7504ac13539bc1	2025-09-29 20:24:30.832611
162	288	7de6eb920674b80627bf7f605fcac77168d1f4587379807998c43b17ec426110	2025-09-29 20:24:57.31562
164	288	98a16eb6584c344a0aeda00e9cf13f6ac8889537f7a7117a8a10d3353718084c	2025-10-04 20:58:05.357719
166	266	cbffef71c0b1b77c64e98601ddd8e863feca4a5eaf78a7e6ae91fad03b94283b	2025-10-05 09:04:45.232605
168	266	20312d9a3acfbfce7224f7119e8eaf5e0fee2390559c68238efc7757405e0c37	2025-10-05 10:28:32.17138
170	288	48ed98a7087af1145d69f8a0720a615420e13b107690f37b4329b093fa7791ed	2025-10-05 10:39:52.147641
172	288	a3ce9427993b7e42ba584fcf1ef2ec80ff25772f82f8e38c8eb904b8639235cb	2025-10-05 14:50:36.724188
174	288	f3e30afc49ece6cd7c34c3db4d254dea4b0516aaff0a9a2e6fd55bbb3d248207	2025-10-06 09:21:14.120818
176	288	b6361ba9b50e3c5bb45024b330572a44ef8a3a1a5dd19421c8932fcf6fff166a	2025-10-06 10:29:25.97697
178	266	c436ae47e00992b1ddcf253e614ab765538c6be48c489e64dfab4cb98f37faea	2025-10-06 10:38:29.063187
180	266	3b86361198c18dd5e0366a74dd872fc3af91102bd0b9f2667017eb0a62a9c578	2025-10-06 13:42:51.311744
182	266	49115baece3bee33f8b0547a841a9759d1a945d3ec3a095d69bc39d67643db0d	2025-10-06 14:08:13.40609
184	266	5e6c83075a72ea473fc2018ee625cdcc7a8e648eb4a0f118ba8812138f77cab9	2025-10-06 16:23:50.475251
186	288	3afa3f37dae36c703f81c02b64c20b0be5c6948c29dad4866dc01d888402889f	2025-10-11 20:18:16.517709
188	293	fa426b1e74d46a610d503343afb9f497a1487c22066f5d3e0bf2881dbe766465	2025-10-12 09:12:22.913732
190	295	a87cf8a8bf9132fb7a43717635ff307d3ed108e21fa8713a65884f25541dc18b	2025-10-12 09:28:00.230402
192	266	2441ae17b52b5705e122ba6af6f01735a5e399b961b9f3ba350acc3c4343137f	2025-10-12 15:20:45.796448
194	288	9a5c125c8f7366bb366305fa9f0a0d0a8b8232b51475d805f9cd8e0e62c915c7	2025-10-12 15:29:56.106846
196	288	9a878e2791bbf7e304ca7f6b9369235bc933f0525ebd45e795f234adb2a50c33	2025-10-12 16:34:32.724469
198	257	7adcfed0751cd49b67828ea36c733389253bfdb8ad34150bd026222d05000d25	2025-10-12 16:43:29.837179
199	297	d1e2e6cdfdb2e096a37da0478d8aa8f4e8cefedf3c3b5f47b703b5d768a1d145	2025-11-16 09:40:42.515189
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, first_name, last_name, email, password, access_allowed, role) FROM stdin;
128	1	1	1@q	e	t	0
130	1	1	1@q4	2	t	0
132	1	1	1@q45	2	t	0
133	2	2	2@e	2	t	0
199	412241	421214	EW2@Gm52	1	t	0
200	12321	2113231	3212313@ewew	2	t	0
201	12321	2113231	3212313@ewew2	2	t	0
202	12321	2113231	3212313@ewew25	5	t	0
203	12321	2113231	3212313@ewew254	3	t	0
204	12321	2113231	3212313@ewew2544	4	t	0
205	412	421	421@g	213	t	0
207	412	421	421@g5	132	t	0
209	412	421	421@g52	2	t	0
210	41221	42112	421@g522	41214	t	0
211	41221	42112	421@g5222	32	t	0
212	41221	42112	421@g52222	2	t	0
213	41221	42112	421@g522222	123	t	0
214	412211	42112	421@g5222222	12	t	0
215	412211	42112	421@g52222221	2	t	0
216	4122115	42112	421@g522222215	53	t	0
217	4122115	42112	421@g5222222152	2	t	0
219	4122115	42112	421@g52222221521	1	t	0
220	4122115	42112	421@g522222215212	1232	t	0
111	413	431	2@s	222	t	0
112	12	12	12@g	232	t	0
222	4122115	42112	421@g522222215212231312312	231	t	0
113	12	12	12@g2	232	t	0
115	12	12	12@g25	232	t	0
224	4122115	42112	421@g522222215212221331312312	231132	t	0
225	4122115	42112	421@g5222222152122213313123122	321	t	0
117	12	12	12@g251	232	t	0
118	431	341	2@eq	1	t	0
161	1	1	1@e2	2	t	0
226	4122115	421122	421@g52222221521222133123123122	2	t	0
120	413341	341431	314431134@q	314314	t	0
163	5	5	5@e	5	t	0
122	132	123	412@q	412	t	0
123	132	1231	412@q2	412	t	0
227	4122115	4211222121	421@g5222222152122213312312321122	1	t	0
165	4	4	4@eee2	2	t	0
125	412	421	2@gm	weqe	t	0
126	41221	421	2@gm2	weqe	t	0
232	12	121	12421142121224142124124124@1232	132	t	0
177	31	31	2@e22e	2	t	0
179	124	12424112441	241124@sew21e12	12323132	t	0
180	123321	123123321	2@ewqewe	weqew	t	0
241	12	121	12421142121224142124124124@12232		t	0
242	12	121	12421142121224142124124141224@12232		t	0
243	413341	134341	134134@ewqew	134413	t	0
244	12	121	1242114212122414212412114141224@12232	1	t	0
245	1	1	1@3	1	t	0
246	1	1	1@33	1	t	0
247	1	1	1@332	2	t	0
189	412241	421214	EW2@Gm	1	t	0
248	1	1	1@3322	2	t	0
249	1	1	1@33221	1	t	0
250	Name	Last name	nice@gmail.ru	123123	t	0
251	1Name	2LastName	123l1321@gmail	12341234	t	0
252	120	123	123@3	3231	t	0
195	412241	421214	EW2@Gm5	1	t	0
253	314	413	431@e21e	412	t	0
254	143413	43114343	123@gmail	421	t	0
261	1	1111111111111111111111234	341@ewqw3234232224323	1212	t	0
262	1	11111111111111111111112345	341@ewqw32342322243235	5	t	0
264	12	111111111111111111111123425	341@ewqw3234232224323542	3242	t	0
265	12	111111111111111111111123425	341@ewqw32342322243235425	5	t	0
267	123123123	123123123	2313212@32	213	t	0
268	123	Tsiz	513531531@ewqew	41343143	t	0
269	321	23	32@e	32421	t	0
272	312	32	1@e	2	t	0
273	32	ew	ew2@e	2	t	0
276	3	2	32@e322332	12222	t	0
277	3	22	3411341@2ewqewq	eqwqewqwweqe	t	0
278	321322	422424	2@3232232332	12343433434	t	0
279	123123123@1323	323242	12312312423@2	42142142	t	0
283	123123123@1323	323242	12312312423@22	42142142	t	0
284	134@231	3213	321232@341	53253	t	0
285	41341@@ewqe	43143	13@ewqeq	eqweweq	t	0
286	413	431	341@ew1	431431	t	0
266	123	123	123@123	123	t	0
258	1	111111111111111111111123	341@ewqw32342322232	224233	t	1
259	1	1111111111111111111111234	341@ewqw323423222432	3	t	1
257	1	111111111111111111111123	341@ewqw323232	143413	t	1
287	431433	5154	531@412421	412142421	t	0
288	234	234	234@234	234	t	1
289	1231231232132	31231221	2133@4124	412412	t	0
290	123@123123123	123123123	324242@323	323232	t	0
291	4122141	124241124	241124@421	421214	t	0
292	345	345	345@345	345	t	2
230	12	121	12421142121224142124124124@12	14142112	t	2
293	413	43141	232@3213	321	t	0
294	321321	132231	213213123@3232	123321321123	t	0
295	123@123	123	123@123123	123	t	0
296	123123	123123	123@123123123	124133513r4ezdrcdvWTADVZ=T==T	t	0
297	4314143	4314134	123@31241	431	t	0
\.


--
-- Name: balance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.balance_records_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 23, true);


--
-- Name: session_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.session_id_seq', 199, true);


--
-- Name: t_shirt_sizes_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_shirt_sizes_item_id_seq', 105, true);


--
-- Name: t_shirts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.t_shirts_id_seq', 54, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 297, true);


--
-- Name: item_sizes item_sizes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_sizes
    ADD CONSTRAINT item_sizes_pkey PRIMARY KEY (id);


--
-- Name: items items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (id);


--
-- Name: item_sizes unique_ts_id_size; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.item_sizes
    ADD CONSTRAINT unique_ts_id_size UNIQUE (item_id, name);


--
-- Name: cart user_item_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT user_item_unique UNIQUE (user_id, item_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart cart_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item_sizes(id);


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: items items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.items
    ADD CONSTRAINT items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: locations location_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT location_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: order_items order_items_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.item_sizes(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

