import React, { useState, useEffect, useRef, useContext, createContext } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, MotionConfig, useScroll, useTransform, useSpring, useReducedMotion, useMotionValueEvent, useAnimationFrame, useInView } from 'framer-motion';
import { ArrowUpRight, ArrowDown, ArrowRight, Play, X, Menu, Mail, Phone, MapPin, Instagram, Youtube, Download, Pause, Search, Plus, Minus, ChevronLeft, ChevronRight, ExternalLink, Github, MousePointer2 } from 'lucide-react';
import archive from './data/projects.json';
import brands from './data/brands.json';
import './styles.css';

const MotionContext = createContext(true);
const EASE = [0.22, 1, 0.36, 1];
const categories = ['Semua', 'Website', 'Aplikasi', 'UI/UX', 'Latihan'];
const featured = archive.slice(0, 3);
const experiences = [
  { date: 'SAAT INI', title: 'Mahasiswa', place: 'UIN Syech Mdjamil Djambek · Bukittinggi', text: 'Sedang menempuh pendidikan di UIN Syech Mdjamil Djambek.' },
];
const certificates = [];
const awards = [];

function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const enabled = useContext(MotionContext);
  const Component = motion[as];
  return <Component className={className} initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.12 }} transition={{ duration: enabled ? 0.75 : 0, delay, ease: EASE }}>{children}</Component>;
}

function MediaImage({ src, alt, className = '', priority = false, ...props }) {
  const [state, setState] = useState('loading');
  const imgRef = useRef(null);
  useEffect(() => {
    const img = imgRef.current;
    // Cached images can finish before React attaches onLoad.
    setState(img?.complete ? (img.naturalWidth ? 'loaded' : 'error') : 'loading');
  }, [src]);
  return <span className={`media-image ${state} ${className}`}>
    {state === 'error' && <span className="image-fallback"><span className="display">T.</span><span>Pratinjau tidak tersedia</span></span>}
    <img ref={imgRef} src={src} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} width="960" height="600" onLoad={() => setState('loaded')} onError={e => {
      if (e.currentTarget.src.includes('maxresdefault.jpg')) e.currentTarget.src = e.currentTarget.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
      else setState('error');
    }} {...props} />
  </span>;
}

function Magnetic({ children, className = '', ...props }) {
  const enabled = useContext(MotionContext);
  const x = useSpring(0, { stiffness: 220, damping: 20 });
  const y = useSpring(0, { stiffness: 220, damping: 20 });
  return <motion.a className={className} style={{ x, y }} onPointerMove={e => {
    if (!enabled || e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.12); y.set((e.clientY - r.top - r.height / 2) * 0.2);
  }} onPointerLeave={() => { x.set(0); y.set(0); }} {...props}>{children}</motion.a>;
}

function Header({ enabled, onToggle, onReplaySwarm }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }), { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main > section[id]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <header className="site-header">
    <a className="wordmark" href="#home" aria-label="Teja Lesmana, beranda">TEJA LESMANA<span></span></a>
    <nav className="desktop-nav" aria-label="Navigasi utama">{[['portfolio', 'Karya'], ['awards', 'Awards'], ['about', 'Tentang'], ['experience', 'Perjalanan'], ['contact', 'Kontak']].map(([id, label]) => <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>{label}</a>)}</nav>
    <div className="header-actions"><button className="motion-toggle" onClick={onToggle} aria-label={enabled ? 'Jeda animasi' : 'Aktifkan animasi'} aria-pressed={!enabled}>{enabled ? <Pause size={13} /> : <Play size={13} />}<span>Motion {enabled ? 'on' : 'off'}</span></button><button className="swarm-trigger" onClick={onReplaySwarm} aria-label="Putar animasi banyak kursor"><MousePointer2 size={15}/><span>Swarm</span></button><a className="header-contact" href="#contact">Let’s talk <ArrowUpRight size={16} /></a><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Tutup menu' : 'Buka menu'}>{open ? <X /> : <Menu />}</button></div>
    <AnimatePresence>{open && <motion.nav id="mobile-menu" className="mobile-menu" aria-label="Navigasi mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}>{[['home', 'Beranda'], ['portfolio', 'Karya'], ['awards', 'Awards'], ['about', 'Tentang'], ['experience', 'Perjalanan'], ['contact', 'Kontak']].map(([id, label], i) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}><span>0{i + 1}</span>{label}<ArrowUpRight size={18} /></a>)}</motion.nav>}</AnimatePresence>
  </header>;
}

function Hero({ onProject }) {
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 85]);
  const portraitScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return <section id="home" className="hero" ref={ref}>
    <div className="hero-top"><span>MAHASISWA<br/><span className="muted">MAHASISWA · CODING</span></span><span className="availability"><i />TERBUKA UNTUK BELAJAR</span></div>
    <motion.div className="hero-title display" aria-hidden="true" style={enabled ? { y: titleY } : {}} initial={enabled ? { clipPath: 'inset(0 0 100% 0)' } : false} animate={{ clipPath: 'inset(0 0 0% 0)' }} transition={{ duration: 1.4, ease: EASE }}>PORTFOLIO</motion.div>
    <motion.div className="hero-portrait" style={enabled ? { y: portraitY, scale: portraitScale } : {}} initial={enabled ? { opacity: 0 } : false} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.2 }}><img src="./Asset/img/teja-portrait.png" alt="Teja Lesmana mengenakan topi hitam dan kemeja gelap dengan pencahayaan biru" width="1022" height="1538" fetchPriority="high" /></motion.div>
    <motion.div className="hero-intro" style={enabled ? { y: copyY } : {}} initial={enabled ? { opacity: 0, x: -35 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.35, ease: EASE }}>
      <p className="handwriting">Hello, I’m</p><h1 className="display">TEJA LESMANA<span>.</span></h1><p className="hero-role">MAHASISWA<br />PELAJAR</p><p className="hero-description">Belajar, mencoba, dan terus berkembang.<br />Saya Teja Lesmana, mahasiswa di UIN Syech Mdjamil Djambek, Bukittinggi.</p>
      <Magnetic href="#portfolio" className="primary-link">Lihat karya saya <ArrowDown size={17}/></Magnetic>
      <span className="hero-location"><MapPin size={12} /> BUKITTINGGI, INDONESIA</span>
    </motion.div>
    <motion.div className="hero-side" initial={enabled ? { opacity: 0, x: 30 } : false} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, delay: 0.55, ease: EASE }}>
      <div className="hero-manifesto"><span className="crosshair" aria-hidden="true">✳</span><p>Belajar setiap hari.<br />Membangun langkah berikutnya.</p></div>
      <div className="hero-stats"><div><span className="display">UIN</span><p>MAHASISWA<br/>BUKITTINGGI</p></div><div><span className="display">CODE</span><p>MINAT<br/>CODING</p></div><div className="hero-award-stat"><span className="display">TEJA</span><a href="#about">TENTANG SAYA<ArrowUpRight size={12}/></a></div><a href="#contact"><Mail size={16}/><span>HUBUNGI SAYA</span></a></div></motion.div>
    <div className="hero-bottom"><button className="reel-button" onClick={() => document.querySelector("#portfolio")?.scrollIntoView({behavior:"smooth"})}><span className="play-circle"><Play size={12} fill="currentColor" /></span>LIHAT GALERI<span className="muted">KARYA TEJA</span></button><span className="hero-scroll">SCROLL TO DISCOVER <ArrowDown size={13}/></span><span className="edition">PORTOFOLIO / TEJA LESMANA</span></div>
  </section>;
}

function ProjectCard({ project, index, onOpen }) {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const video = ['youtube', 'drive'].includes(project.type);
  return <motion.article ref={ref} className="project-card" layout initial={enabled ? { opacity: 0, y: 32 } : false} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.08 }} transition={{ duration: enabled ? 0.6 : 0, delay: (index % 3) * 0.06, ease: EASE }} exit={{ opacity: 0, scale: 0.96 }}>
    <button className="project-open" onClick={() => onOpen(project)} aria-label={`Lihat ${project.title}`}><motion.div className="project-picture" style={enabled ? { y } : {}}><MediaImage src={project.image} alt={project.title}/></motion.div><span className="project-type">{project.type === 'render' ? '3D BREAKDOWN' : video ? 'FILM / VIDEO' : project.type === 'website' ? 'WEBSITE' : 'STILL / IMAGE'}</span><span className="project-hover">{video ? <Play fill="currentColor" size={18}/> : <ArrowUpRight size={22}/>}</span><span className="project-frame" aria-hidden="true" /></button>
    <button className="project-caption" onClick={() => onOpen(project)}><span className="project-number display">{String(index + 1).padStart(2, '0')}</span><span><h3>{project.title}</h3><span className="project-category">{project.category}{project.year ? ` / ${project.year}` : ''}</span></span><ArrowUpRight size={20}/></button>
  </motion.article>;
}

function BrandStrip() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const loopWidth = useRef(0);
  const inView = useInView(ref);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!ref.current || showAll) return;
    const update = () => { loopWidth.current = ref.current?.querySelector('.brand-set')?.getBoundingClientRect().width || 0; };
    const observer = new ResizeObserver(update);
    observer.observe(ref.current); update();
    return () => observer.disconnect();
  }, [showAll]);
  useAnimationFrame((time, delta) => {
    if (!enabled || paused || interacting || !inView || showAll || !ref.current || !loopWidth.current) return;
    const el = ref.current;
    el.scrollLeft += Math.min(delta, 40) * 0.038;
    if (el.scrollLeft >= loopWidth.current) el.scrollLeft -= loopWidth.current;
  });
  const move = direction => { setPaused(true); ref.current?.scrollBy({ left: direction * ref.current.clientWidth * .7, behavior: enabled ? 'smooth' : 'instant' }); };
  return <Reveal className="brand-section"><div className="brand-heading"><p>PORTOFOLIO<br/><strong>TEJA LESMANA.</strong></p>{brands.length > 0 && <div><button className="brand-all" onClick={() => setShowAll(v => !v)} aria-expanded={showAll} aria-controls="brand-collection">{showAll ? 'TAMPILKAN DERET' : `LIHAT SEMUA (${brands.length})`}{showAll ? <Minus size={14}/> : <Plus size={14}/>}</button>{!showAll && <><button className="icon-button brand-pause" aria-label={paused ? 'Putar animasi logo' : 'Jeda animasi logo'} aria-pressed={paused} onClick={() => setPaused(v => !v)}>{paused ? <Play size={13}/> : <Pause size={13}/>}</button><button className="icon-button" onClick={() => move(-1)} aria-label="Logo sebelumnya"><ChevronLeft size={17}/></button><button className="icon-button" onClick={() => move(1)} aria-label="Logo selanjutnya"><ChevronRight size={17}/></button></>}</div>}</div><div id="brand-collection" className={showAll ? 'brand-full-grid' : 'brand-viewport'} ref={ref} onPointerEnter={e => { if(e.pointerType==='mouse') setInteracting(true); }} onPointerLeave={() => setInteracting(false)} onPointerDown={() => setPaused(true)} onFocusCapture={() => setInteracting(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setInteracting(false); }} tabIndex={showAll ? undefined : 0} role={showAll ? 'list' : 'region'} aria-label="Logo kolaborasi yang akan ditambahkan nanti">
      {brands.length === 0 ? <p className="brand-empty">Kolaborasi akan ditambahkan di sini saat sudah ada.</p> : showAll ? brands.map(b => <div className="brand-logo" key={b.file} role="listitem"><img src={`./Asset/svg/brand/${b.file}`} alt={b.name} title={b.name} width="150" height="60" loading="lazy"/><span>{b.name}</span></div>) : <div className="brand-rail">{[0,1].map(copy => <div className="brand-set" key={copy} aria-hidden={copy === 1 ? true : undefined}>{brands.map(b => <div className="brand-logo" key={b.file}><img src={`./Asset/svg/brand/${b.file}`} alt={copy ? '' : b.name} title={b.name} width="150" height="60" loading="lazy" draggable="false"/></div>)}</div>)}</div>}
    </div></Reveal>;
}

function Portfolio({ onProject }) {
  const [category, setCategory] = useState('Semua');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [limit, setLimit] = useState(9);
  const results = archive.filter(p => (category === 'Semua' || p.category === category) && `${p.title} ${p.category} ${p.role}`.toLowerCase().includes(query.toLowerCase()));
  const projects = expanded || category !== 'Semua' || query ? results.slice(0, limit) : featured;
  return <section id="portfolio" className="portfolio section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">01 / SELECTED WORK</span><h2>KONSEP & LATIHAN<span className="accent">.</span></h2></div><button className="text-link" onClick={() => { if (expanded) { setExpanded(false); setCategory('Semua'); setQuery(''); } else { setExpanded(true); setLimit(9); } }}>{expanded ? 'KARYA PILIHAN' : 'SEMUA KARYA'}<ArrowRight size={21}/></button></Reveal>
    <Reveal className="portfolio-toolbar">
      <div className="filters" role="group" aria-label="Kategori karya">
        {categories.map(c => <button key={c} className={category === c ? 'selected' : ''} aria-pressed={category === c} onClick={() => { setCategory(c); setExpanded(true); setLimit(9); }}>{c}{c === category && <motion.span className="filter-line" layoutId="filter-line"/>}</button>)}
      </div>
      <label className="search-box"><Search size={15}/><span>Cari</span><input aria-label="Cari karya" type="search" placeholder="Judul atau kategori…" value={query} onChange={e => { setQuery(e.target.value); setExpanded(true); setLimit(9); }}/></label>
    </Reveal>
    <motion.div className="project-grid" layout><AnimatePresence mode="popLayout">{projects.map((p, i) => <ProjectCard key={p.category + p.title + p.media} project={p} index={i} onOpen={onProject}/>)}</AnimatePresence></motion.div>
    {projects.length === 0 && <div className="empty-state"><p>{query ? `Belum ada karya yang cocok untuk “${query}”.` : "Berikut beberapa ide latihan sebagai titik awal portofolio."}</p><button className="text-link" onClick={() => { setQuery(''); setCategory('Semua'); }}>Reset pencarian <X size={15}/></button></div>}
    {expanded && results.length > limit && <div className="load-more"><button className="outline-button" onClick={() => setLimit(v => v + 9)}>Tampilkan karya lainnya <Plus size={16}/></button><span>{projects.length} dari {results.length} karya</span></div>}
    <BrandStrip/>
  </section>;
}

const processSteps = [
  ['01', 'BELAJAR', 'Memulai dari dasar dan memahami konsep coding.'],
  ['02', 'MENCOBA', 'Berlatih melalui contoh dan latihan kecil.'],
  ['03', 'MEMBANGUN', 'Menerapkan hal yang dipelajari ke dalam proyek.'],
  ['04', 'MENGUJI', 'Mengecek hasil dan memperbaiki bagian yang belum berjalan.'],
  ['05', 'BERKEMBANG', 'Terus belajar dan menambah karya ke portofolio.'],
];
function Awards({onProject}) {
  const [expanded,setExpanded] = useState(false);
  const laurelPath = 'M48 94C8 68 9 30 35 5M22 61C8 60 3 49 3 44c12 0 19 6 19 17zm-5-19C5 35 6 23 8 19c11 5 13 14 9 23zm7-20C15 12 20 3 24 0c7 8 6 16 0 22zM31 79C17 79 8 70 7 64c13-2 22 4 24 15zm-3-18c-5-10-2-19 7-25 5 11 1 20-7 25zm10 24c-6-11-4-20 5-27 6 9 5 20-5 27z';
  return <section id="awards" className={`recognition section-wrap ${expanded ? 'awards-expanded' : ''}`}>
    <Reveal className="recognition-intro">
      <span className="eyebrow">PENCAPAIAN</span>
      <h2 className="display">PENCAPAIAN<br/><span className="accent">AKAN MENYUSUL.</span></h2>
      <div className="award-total">
        <svg viewBox="0 0 60 100" aria-hidden="true"><path d={laurelPath} fill="currentColor"/></svg>
        <span className="display">—</span>
        <svg viewBox="0 0 60 100" aria-hidden="true"><g transform="translate(60 0) scale(-1 1)"><path d={laurelPath} fill="currentColor"/></g></svg>
        <span className="award-total-label">PENCAPAIAN</span>
      </div>
      <p>Bagian ini siap diisi saat ada penghargaan atau sertifikat yang ingin ditampilkan.</p>
      
    </Reveal>
    <div className="recognition-list">
      <div className="recognition-list-head"><span>PENCAPAIAN</span><span>BELUM DIISI</span></div>
      <ol id="recognition-list">{awards.length ? awards.map((award,i)=><Reveal as="li" className={`recognition-row ${i>2?'additional-award':''}`} key={award.year} delay={i*.045}><span className="award-index">0{i+1}</span><div><h3>{award.title}</h3><p>{award.event}</p></div><span className="award-year display">{award.year}</span></Reveal>) : <li className="recognition-row"><div><h3>Belum ada pencapaian ditambahkan</h3><p>Daftar ini bisa diperbarui kapan saja.</p></div></li>}</ol>
      {awards.length > 3 && <button className="award-expand" aria-expanded={expanded} aria-controls="recognition-list" onClick={()=>setExpanded(v=>!v)}>{expanded?'Ringkas pencapaian':'Lihat pencapaian lainnya'}{expanded?<Minus size={16}/>:<Plus size={16}/>}</button>}
    </div>
  </section>;
}
function Breakdown() {
  const scene = featured.find(p => p.type === 'render');
  const ref = useRef(null);
  const enabled = useContext(MotionContext);
  const [manual, setManual] = useState(false);
  const [cut, setCut] = useState(65);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  useMotionValueEvent(scrollYProgress, 'change', v => { if (!manual && enabled) setCut(Math.round(90 - v * 80)); });
  const titleX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  if (!scene) return null;
  const resize = url => url.replace('/upload/', '/upload/c_scale,w_1200,q_auto,f_auto/');
  return <section className="breakdown section-wrap" ref={ref} aria-labelledby="breakdown-title"><Reveal className="breakdown-copy"><span className="eyebrow">TENTANG PORTOFOLIO</span><motion.h2 id="breakdown-title" className="display" style={enabled ? { x: titleX } : {}}>PROSES<br/><span className="accent">BELAJAR.</span></motion.h2><p>Bagian ini siap menampilkan proses atau hasil karya saat proyek pertama ditambahkan.</p><span className="breakdown-credit">RUANG UNTUK PROSES KARYA</span></Reveal><Reveal className="comparison"><div className="comparison-stage" style={{'--cut': `${enabled || manual ? cut : 50}%`}}><MediaImage src={resize(scene.renders[0].solid)} alt="Cyberpunk environment sebelum material dan pencahayaan"/><div className="comparison-final"><MediaImage src={resize(scene.renders[0].final)} alt="Cyberpunk environment hasil render akhir"/></div><span className="comparison-label raw-label">SOLID VIEW</span><span className="comparison-label final-label">FINAL RENDER</span><div className="comparison-divider"><span><ChevronLeft size={14}/><ChevronRight size={14}/></span></div><input aria-label="Perbandingan sebelum dan sesudah render" aria-valuetext={`${cut}% solid, ${100-cut}% final render`} type="range" min="0" max="100" value={cut} onChange={e => { setManual(true); setCut(Number(e.target.value)); }}/></div><div className="comparison-caption"><span>GESER UNTUK MELIHAT PROSESNYA</span><span>DRAG / SCROLL</span></div></Reveal></section>;
}
function About() {
  const enabled = useContext(MotionContext);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 75%'] });
  return <section id="about" className="about section-wrap" ref={ref}>
    <Reveal className="about-lead"><div><span className="eyebrow">02 / TENTANG SAYA</span><h2 className="display">MAHASISWA DI<br/><span className="accent">BUKITTINGGI.</span></h2></div><p>Saya Teja Lesmana, mahasiswa di UIN Syech Mdjamil Djambek, Bukittinggi.</p></Reveal>
    <div className="studio-grid">
      <Reveal className="education-panel"><h3 className="panel-heading">PENDIDIKAN & MINAT</h3><p className="eyebrow accent">PENDIDIKAN</p><div className="education-row"><strong>UIN Syech Mdjamil Djambek</strong><span>Mahasiswa</span><p>Bukittinggi.</p></div><div className="education-row"><strong>Kursus</strong><span>Detail menyusul</span><p>Informasi kursus akan ditambahkan.</p></div><div className="education-row"><strong>Coding</strong><p>Minat belajar coding.</p></div><p className="eyebrow accent skills-heading">MINAT</p><div className="skill-tags">{['Coding'].map(s => <span key={s}>{s}</span>)}</div><div className="software-row">{[].map(([file, name]) => <img key={file} src={`./Asset/svg/${file}.svg`} alt={name} title={name} loading="lazy" width="28" height="28"/>)}</div></Reveal>
      <div className="process-panel"><Reveal><h3 className="panel-heading">LANGKAH BELAJAR</h3></Reveal><div className="process-list"><div className="process-track"><motion.div style={{ scaleY: enabled ? scrollYProgress : 1 }}/></div>{processSteps.map(([num, title, text], i) => <Reveal key={num} className="process-row" delay={i * 0.035}><span className="process-num display">{num}</span><span className="process-node"/><div><h4>{title}</h4><p>{text}</p></div></Reveal>)}</div></div>
      <Reveal className="quote-panel"><span className="quote-mark display">“</span><blockquote>Coding<br/>sebagai langkah<br/><em>belajar.</em></blockquote><span className="handwriting">Teja</span><div className="quote-bottom">LET’S MAKE<br/>THE NEXT FRAME COUNT.<span className="quote-symbol" aria-hidden="true">✳</span></div></Reveal>
    </div>
  </section>;
}

function Journey({ onProject }) {
  const [open, setOpen] = useState(0);
  return <section id="experience" className="journey section-wrap">
    <Reveal className="section-heading"><div><span className="eyebrow">03 / THE JOURNEY</span><h2>TERUS BERGERAK. TERUS BERKARYA<span className="accent">.</span></h2></div><a className="text-link" href="#contact">HUBUNGI SAYA<ArrowUpRight size={16}/></a></Reveal>
    <div className="journey-grid"><div className="experience-list">{experiences.map((job, i) => <Reveal className={`experience-row ${open === i ? 'is-open' : ''}`} key={job.title}><button aria-expanded={open === i} aria-controls={`job-${i}`} onClick={() => setOpen(open === i ? null : i)}><span className="experience-date">{job.date}</span><span><h3>{job.title}</h3><span className="experience-place">{job.place}</span></span>{open === i ? <Minus size={18}/> : <Plus size={18}/>}</button><AnimatePresence initial={false}>{open === i && <motion.div id={`job-${i}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}><p>{job.text}</p></motion.div>}</AnimatePresence></Reveal>)}</div>
    <Reveal className="awards-panel"><p className="eyebrow">SERTIFIKAT & KURSUS</p><h3 className="display">DOKUMEN<br/><span className="accent">AKAN MENYUSUL.</span></h3><div className="award-list">{certificates.length ? certificates.map((cert, i) => <button key={cert.title} onClick={() => onProject({ ...cert, type: 'image', media: cert.image, category: 'Certificate', description: cert.title })}><span>{String(i + 1).padStart(2, '0')}</span><span>{cert.title}<small>{cert.year}</small></span><ArrowUpRight size={19}/></button>) : <p>Data sertifikat atau kursus akan ditambahkan di sini.</p>}</div></Reveal></div>
  </section>;
}

function Contact({ onProject }) {
  const [sent, setSent] = useState(false);
  const send = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = `Halo Teja, saya ${data.get('name')}.\n\nJenis proyek: ${data.get('type')}\n${data.get('message')}`;
    window.open(`https://wa.me/6283139985208?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setSent(true);
  };
  return <section id="contact" className="contact section-wrap">
    <div className="contact-grid"><Reveal className="contact-intro"><span className="eyebrow">04 / KONTAK</span><h2 className="display">MARI<br/>TERHUBUNG<span className="accent">.</span></h2><p>Hubungi saya melalui email atau WhatsApp.</p><Magnetic href="https://wa.me/6283139985208" target="_blank" rel="noopener noreferrer" className="contact-cta"><span className="round-arrow"><ArrowUpRight size={21}/></span>MULAI PERCAKAPAN</Magnetic></Reveal>
    <Reveal className="contact-links" delay={0.1}><a href="mailto:tejalesmanazuhridrf05@gmail.com"><Mail/><span><small>EMAIL</small>tejalesmanazuhridrf05@gmail.com</span><ArrowUpRight size={16}/></a><a href="https://wa.me/6283139985208" target="_blank" rel="noopener noreferrer"><Phone/><span><small>WHATSAPP</small>+62 831 3998 5208</span><ArrowUpRight size={16}/></a><a href="tel:+6283139985208"><Phone/><span><small>TELEPON</small>+62 831 3998 5208</span><ArrowUpRight size={16}/></a><div><MapPin/><span><small>BASED IN</small>Bukittinggi, Indonesia</span></div></Reveal>
    <Reveal className="contact-reel" delay={0.2}><button onClick={() => document.querySelector("#portfolio")?.scrollIntoView({behavior:"smooth"})} aria-label="Lihat galeri Teja"><div className="reel-screen"><span className="reel-screen-top">TEJA LESMANA<span>PORTOFOLIO</span></span><MediaImage src={featured[0]?.image} alt="Karya Teja"/><span className="reel-screen-title display">BELAJAR<br/><span>MEMBANGUN.</span></span><span className="play-circle"><Play size={18} fill="currentColor"/></span></div><span className="reel-caption">LIHAT GALERI SAYA</span></button></Reveal></div>
    <Reveal><details className="project-brief"><summary>Ceritakan proyek Anda <Plus size={19}/></summary><form onSubmit={send}><label>Nama Anda<input name="name" required placeholder="Nama atau brand" autoComplete="name" maxLength="100"/></label><label>Jenis proyek<select name="type"><option>Proyek coding</option><option>Website</option><option>Aplikasi</option><option>Diskusi belajar</option><option>Kolaborasi lainnya</option></select></label><label className="brief-message">Tentang proyek<textarea name="message" required rows="3" placeholder="Ceritakan ide, kebutuhan, dan perkiraan waktunya…" maxLength="3000"/></label><button className="solid-button" type="submit">Lanjut ke WhatsApp <ArrowUpRight size={18}/></button><p className="form-note" role="status">{sent ? 'Draft pesan siap di WhatsApp. Tekan Kirim di sana untuk memulai percakapan.' : 'Brief akan dibuka sebagai draft pesan di WhatsApp.'}</p></form></details></Reveal>
  </section>;
}

function ProjectDialog({ project, onClose }) {
  const ref = useRef(null);
  const [renderMode, setRenderMode] = useState('final');
  const [shot, setShot] = useState(0);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);
  const [retried, setRetried] = useState(0);
  const enabled = useContext(MotionContext);
  const activeShot = project.type === 'render' ? project.renders[shot] : null;
  const embedType = activeShot?.video ? 'youtube' : activeShot?.drive ? 'drive' : project.type;
  const embedMedia = activeShot?.video || activeShot?.drive?.match(/\/d\/([^/]+)/)?.[1] || project.media;
  const isVideo = ['youtube', 'drive'].includes(embedType);
  const availableModes = [['layout', 'Layout'], ['solid', 'Solid'], ['material', 'Material'], ['lighting', 'Lighting'], ['final', 'Final render']].filter(([mode]) => activeShot?.[mode] && !(mode === 'solid' && activeShot.hideSolidMode));
  const effectiveMode = activeShot?.[renderMode] ? renderMode : availableModes[0]?.[0];
  const rendered = activeShot?.[effectiveMode] || activeShot?.image || project.image;
  const sourceUrl = embedType === 'youtube' ? `https://www.youtube.com/watch?v=${embedMedia}` : embedType === 'drive' ? `https://drive.google.com/file/d/${embedMedia}/view` : project.type === 'render' ? rendered : project.media || project.image;
  const changeShot = next => { setMediaLoaded(false); setMediaFailed(false); setShot(next); };
  useEffect(() => {
    const previous = document.activeElement;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    const listener = e => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button, a[href], input, select, textarea, iframe')].filter(n => !n.disabled && n.getClientRects().length);
        const first = nodes[0]; const last = nodes.at(-1);
        if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', listener);
    return () => { document.body.style.overflow = old; window.removeEventListener('keydown', listener); previous?.focus(); };
  }, [onClose]);
  useEffect(() => {
    if (!isVideo) return;
    const timer = setTimeout(() => { if (!mediaLoaded) setMediaFailed(true); }, 14000);
    return () => clearTimeout(timer);
  }, [mediaLoaded, retried, isVideo, embedMedia]);
  return <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <motion.div ref={ref} className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex="-1" initial={enabled ? { y: 45, scale: 0.97 } : false} animate={{ y: 0, scale: 1 }} exit={{ y: 20, opacity: 0 }} transition={{ duration: 0.35, ease: EASE }}>
      <div className="dialog-heading"><span className="eyebrow">{project.category} {project.year && ` / ${project.year}`}</span><button onClick={onClose} className="icon-button" aria-label="Tutup karya"><X/></button></div>
      <div className={`dialog-media ${!isVideo ? 'still' : ''}`}>
        {isVideo ? <>{!mediaLoaded && <div className="media-loading" role="status">{mediaFailed ? <><p>Preview belum bisa dimuat. Buka sumber aslinya untuk menonton.</p><button className="outline-button" onClick={() => { setMediaFailed(false); setMediaLoaded(false); setRetried(v => v + 1); }}>Coba lagi</button></> : <><span className={enabled ? 'loading-ring' : 'loading-ring paused'}/><p>Memuat film…</p></>}</div>}<iframe key={`${embedMedia}-${retried}`} src={embedType === 'youtube' ? `https://www.youtube-nocookie.com/embed/${embedMedia}?autoplay=1&rel=0` : `https://drive.google.com/file/d/${embedMedia}/preview`} title={project.title} width="1280" height="720" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen onLoad={() => { setMediaLoaded(true); setMediaFailed(false); }} onError={() => setMediaFailed(true)}/></> : <MediaImage src={rendered} alt={project.title} priority/>}
      </div>
      {project.type === 'render' && (availableModes.length > 0 || project.renders.length > 1) && <div className="render-controls"><div role="group" aria-label="Tahap render">{availableModes.map(([mode, label]) => <button key={mode} className={effectiveMode === mode ? 'selected' : ''} onClick={() => setRenderMode(mode)} aria-pressed={effectiveMode === mode}>{label}</button>)}</div>{project.renders.length > 1 && <div className="shot-controls"><button className="icon-button" aria-label="Shot sebelumnya" onClick={() => changeShot((shot - 1 + project.renders.length) % project.renders.length)}><ChevronLeft/></button><span>SHOT {shot + 1} / {project.renders.length}</span><button className="icon-button" aria-label="Shot selanjutnya" onClick={() => changeShot((shot + 1) % project.renders.length)}><ChevronRight/></button></div>}</div>}
      <div className="dialog-description"><div><h2 id="dialog-title">{project.title}</h2>{project.role && <span className="accent">{project.role}</span>}<p>{project.description}</p></div>{sourceUrl && !project.role?.toLowerCase().includes('latihan') && <a className="outline-button" href={sourceUrl} target="_blank" rel="noopener noreferrer">{project.type === 'website' ? 'Kunjungi website' : 'Buka sumber asli'}<ExternalLink size={15}/></a>}</div>
      {isVideo && <p className="embed-note">Jika video dibatasi oleh pemiliknya, gunakan “Buka sumber asli”.</p>}
    </motion.div>
  </motion.div>;
}

const swarmNames = ['Ari','Nara','Bima','Sora','Dira','Raka','Mika','Awan','Tara','Kian','Niko','Luna','Fara','Rumi','Zia','Reno','Aksa','Naya','Rio','Tio','Vina','Kara','Danu','Mira'];
function SwarmIntro({ onClose }) {
  useEffect(() => { const old = document.body.style.overflow; document.body.style.overflow = 'hidden'; const key = e => { if (e.key === 'Escape') onClose(); }; window.addEventListener('keydown', key); return () => { document.body.style.overflow = old; window.removeEventListener('keydown', key); }; }, [onClose]);
  const cursors = swarmNames.map((name, i) => ({ name, sx: (i * 37 + 4) % 92, sy: (i * 61 + 8) % 84, tx: 18 + (i * 23) % 66, ty: 20 + (i * 31) % 59, delay: (i % 8) * 0.16, hue: 205 + (i * 19) % 105 }));
  return <div className="swarm-overlay" role="dialog" aria-modal="true" aria-label="Animasi Swarm Rebuild">
    <div className="swarm-frame">
      <div className="swarm-topline"><span><i/> TEJA LESMANA / PORTFOLIO REBUILD</span><button onClick={onClose}>Lewati animasi <span aria-hidden="true">×</span></button></div>
      <div className="swarm-canvas" aria-hidden="true">
        <div className="swarm-build-head"><span className="eyebrow">DARI IDE MENJADI TAMPILAN</span><strong>TEJA<br/><em>LESMANA.</em></strong><span>MAHASISWA · CODING · BUKITTINGGI</span></div>
        <div className="swarm-build-photo"><div className="swarm-photo-glow"/></div>
        <div className="swarm-build-panels"><i/><i/><i/></div>
        {cursors.map((c,i)=><span key={c.name} className="swarm-cursor" style={{'--sx':c.sx+'%','--sy':c.sy+'%','--tx':c.tx+'%','--ty':c.ty+'%','--delay':c.delay+'s','--hue':c.hue}}><svg viewBox="0 0 20 24" aria-hidden="true"><path d="M2 1v19l5-5 4 8 3-1-4-8h7L2 1z" fill="currentColor" stroke="#070916" strokeWidth="1.2"/></svg><b>{c.name}</b></span>)}
        <div className="swarm-build-footer"><span>LAYOUT</span><span>TYPE</span><span>COLOR</span><span>PORTRAIT</span><span>READY</span></div>
      </div>
      <div className="swarm-status"><span>MENYUSUN HALAMAN</span><div><i/></div><b>24 CURSOR AKTIF</b></div>
    </div>
  </div>;
}

function ScrollSwarm({ enabled }) {
  const [section, setSection] = useState('home');
  useEffect(() => {
    if (!enabled) return;
    const sections = [...document.querySelectorAll('main > section')];
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setSection(visible.target.id || visible.target.className.split(' ')[0]);
    }, { rootMargin: '-38% 0px -38% 0px', threshold: 0 });
    sections.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);
  const label = ({home:'BERANDA',portfolio:'GALERI',awards:'PENGHARGAAN',breakdown:'PROSES',about:'TENTANG',experience:'PERJALANAN',contact:'KONTAK'})[section] || 'PORTOFOLIO';
  if (!enabled) return null;
  return <div className="scroll-swarm" key={section} aria-hidden="true">
    <span className="scroll-swarm-status">SWARM / {label}</span>
    {swarmNames.slice(0, 12).map((name, i) => <span className="scroll-swarm-cursor" key={name} style={{'--sx':`${(i * 29 + 3) % 96}vw`,'--sy':`${(i * 41 + 5) % 86}vh`,'--tx':`${(i * 17 + 12) % 84 + 8}vw`,'--ty':`${(i * 23 + 13) % 72 + 10}vh`,'--delay':`${(i % 6) * .07}s`,'--hue':205 + (i * 19) % 105}}><svg viewBox="0 0 20 24"><path d="M2 1v19l5-5 4 8 3-1-4-8h7L2 1z" fill="currentColor" stroke="#070916" strokeWidth="1.2"/></svg><b>{name}</b></span>)}
  </div>;
}

function App() {
  const reduced = useReducedMotion();
  const [motionOn, setMotionOn] = useState(() => { try { return localStorage.getItem('teja-motion') !== 'off'; } catch { return true; } });
  const enabled = motionOn && !reduced;
  const [project, setProject] = useState(null);
  const [swarmOpen, setSwarmOpen] = useState(() => { try { return localStorage.getItem('teja-swarm-seen') !== 'yes'; } catch { return true; } });
  useEffect(() => { if (!swarmOpen) return; if (reduced) { setSwarmOpen(false); try { localStorage.setItem('teja-swarm-seen','yes'); } catch {} return; } const timer = setTimeout(() => { setSwarmOpen(false); try { localStorage.setItem('teja-swarm-seen','yes'); } catch {} }, 9200); return () => clearTimeout(timer); }, [swarmOpen, reduced]);
  const replaySwarm = () => { window.scrollTo({ top: 0, behavior: 'instant' }); setSwarmOpen(true); };
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 28, restDelta: 0.001 });
  useEffect(() => { document.documentElement.dataset.motion = enabled ? 'on' : 'off'; }, [enabled]);
  const toggle = () => { setMotionOn(!motionOn); try { localStorage.setItem('teja-motion', motionOn ? 'off' : 'on'); } catch {} };
  const close = React.useCallback(() => setProject(null), []);
  return <MotionContext.Provider value={enabled}>
    <MotionConfig reducedMotion={enabled ? 'user' : 'always'} transition={{ ease: EASE }}>
      <a className="skip-link" href="#portfolio">Lewati ke karya</a>
      <motion.div className="reading-progress" style={{ scaleX: enabled ? progress : scrollYProgress }}/>
      <ScrollSwarm enabled={enabled}/>
      <Header enabled={enabled} onToggle={toggle} onReplaySwarm={replaySwarm}/>
      <main>
        <Hero onProject={setProject}/>
        <Portfolio onProject={setProject}/>
        <Awards onProject={setProject}/>
        <Breakdown/>
        <About/>
        <Journey onProject={setProject}/>
        <Contact onProject={setProject}/>
      </main>
      <footer className="footer">
        <a className="wordmark" href="#home">TEJA LESMANA<span></span></a>
        <span>© {new Date().getFullYear()} TEJA LESMANA. </span>
        <div>
          <a href="mailto:tejalesmanazuhridrf05@gmail.com" aria-label="Email Teja Lesmana"><Mail size={17}/></a>
          <a href="https://wa.me/6283139985208" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Teja Lesmana"><Phone size={17}/></a>
          <a href="https://github.com/Teja-dev-alt" target="_blank" rel="noopener noreferrer" aria-label="GitHub Teja Lesmana"><Github size={17}/></a>
          <button type="button" className="swarm-replay" onClick={replaySwarm}>Putar ulang Swarm</button><a href="#home" aria-label="Kembali ke atas"><ArrowUpRight size={18}/></a>
        </div>
      </footer>
      <AnimatePresence>{project && <ProjectDialog key={project.title} project={project} onClose={close}/>}</AnimatePresence>
    </MotionConfig>
    {swarmOpen && <SwarmIntro onClose={() => { setSwarmOpen(false); try { localStorage.setItem('teja-swarm-seen','yes'); } catch {} }}/>}
  </MotionContext.Provider>;
}

createRoot(document.getElementById('root')).render(<App/>);
