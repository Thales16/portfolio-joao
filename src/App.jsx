import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { 
  Activity, Award, BookOpen, Clock, 
  Check, Copy, Stethoscope, Menu, X, ArrowUpRight, ChevronDown
} from 'lucide-react';

// --- COMPONENTE DE TEXTO REVEAL ---
const TextReveal = ({ children, className, delay = 0 }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay }}
      >
        {children}
      </motion.div>
    </div>
  );
};

// --- COMPONENTE DE IMAGEM PARALLAX COM ZOOM HOVER ---
const ParallaxImage = ({ className, src, alt, speed = 1 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]); 

  return (
    <div ref={ref} className={`overflow-hidden ${className} group`}>
      <motion.div 
        style={{ y }} 
        className="w-full h-[120%] bg-slate-800 relative"
      >
        <motion.div
            className="w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
        >
            {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-700" />
            ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-700 font-bold text-xl tracking-widest uppercase">
                {alt || "Imagem"}
            </div>
            )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const App = () => {
  // --- DADOS DO DR. JOÃO PEDRO ---
  const doctor = {
    name: "Dr. João Pedro Senczuk Clazer",
    shortName: "Dr. João Pedro",
    lastName: "Clazer",
    title: "Cirurgião-Dentista | CTBMF",
    email: "adm.joaopedroclazer@outlook.com",
    instagram: "@dr.joaopedroclazer.cirurgia"
  };

  // --- PRELOADER STATE ---
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- CURSOR STATE (CORRIGIDO: INSTANTÂNEO NO DOT, SUAVE NO RING) ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // O Ring segue o mouse com delay suave (Spring)
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const cursorXSpring = useSpring(mouseX, springConfig);
  const cursorYSpring = useSpring(mouseY, springConfig);

  useEffect(() => {
    const mouseMove = (e) => {
      // Atualiza valores brutos instantaneamente
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", mouseMove);
    return () => window.removeEventListener("mousemove", mouseMove);
  }, [mouseX, mouseY]);

  // --- NAVBAR SCROLL ---
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) setHidden(true);
    else setHidden(false);
  });

  // --- COPIAR EMAIL ---
  const [emailCopied, setEmailCopied] = useState(false);
  const copyEmail = () => {
      navigator.clipboard.writeText(doctor.email);
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2500);
  };

  // --- SCROLL TO FOOTER ---
  const scrollToFooter = (e) => {
      e.preventDefault();
      window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
      });
  };

  // --- BACKGROUND ANIMATION VARIANTS ---
  const blobVariants = {
    animate: {
      scale: [1, 1.2, 0.9, 1],
      opacity: [0.3, 0.5, 0.3],
      rotate: [0, 45, -45, 0],
      transition: { duration: 10, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
    }
  };

  return (
    <div className="font-sans text-slate-200 bg-slate-950 selection:bg-cyan-500/30 selection:text-cyan-100 cursor-none relative">
      
      {/* --- PRELOADER --- */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="fixed inset-0 z-[100] bg-slate-950 flex items-center justify-center flex-col"
            exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
          >
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
              className="text-4xl md:text-6xl font-bold tracking-tighter text-white"
            >
              JP<span className="text-cyan-500">.</span>
            </motion.div>
            <motion.div 
              initial={{ width: 0 }} animate={{ width: 200 }} 
              className="h-[1px] bg-slate-700 mt-4 overflow-hidden"
            >
              <motion.div 
                animate={{ x: [0, 200] }} 
                transition={{ duration: 1.5, repeat: Infinity }} 
                className="h-full w-20 bg-cyan-500 blur-[2px]" 
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- CURSOR MELHORADO (DUPLA CAMADA) --- */}
      {/* 1. O Ponto Central (Dot): Resposta Instantânea (usa mouseX direto) */}
      <motion.div 
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[70] mix-blend-difference hidden lg:block"
        style={{ x: mouseX, y: mouseY, translateX: "-50%", translateY: "-50%" }}
      />
      
      {/* 2. O Círculo Externo (Ring): Resposta Suave (usa cursorXSpring) */}
      <motion.div 
        className="fixed top-0 left-0 w-12 h-12 border border-white/30 rounded-full pointer-events-none z-[60] hidden lg:block"
        style={{ x: cursorXSpring, y: cursorYSpring, translateX: "-50%", translateY: "-50%" }}
      />

      {/* --- NOISE TEXTURE --- */}
      <div className="fixed inset-0 z-[50] pointer-events-none opacity-[0.06] mix-blend-overlay">
         <svg className='w-full h-full'>
            <filter id='noise'>
                <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch' />
            </filter>
            <rect width='100%' height='100%' filter='url(#noise)' />
         </svg>
      </div>

      {/* --- NAVBAR --- */}
      <motion.nav 
        variants={{ visible: { y: 0 }, hidden: { y: "-120%" } }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-6 left-0 right-0 mx-auto w-[92%] md:w-fit z-40 max-w-xl"
      >
        <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-full p-2 pl-6 shadow-2xl flex items-center justify-between">
          <a href="#" className="text-lg font-bold text-white tracking-tight mr-8 whitespace-nowrap">
            JP<span className="text-cyan-500">.</span>
          </a>
          
          <div className="hidden md:flex items-center gap-1">
            {['Início', 'Sobre', 'Atuação', 'Galeria'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all uppercase tracking-wide">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center ml-2">
            <a onClick={scrollToFooter} href="#contato" className="hidden md:flex w-10 h-10 bg-slate-100 rounded-full items-center justify-center text-slate-950 hover:scale-110 transition-transform cursor-pointer">
               <ArrowUpRight size={20} />
            </a>
            <button className="md:hidden p-2 text-white bg-slate-800 rounded-full" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-2xl p-4 shadow-xl md:hidden flex flex-col gap-2"
            >
               {['Início', 'Sobre', 'Atuação', 'Galeria', 'Contato'].map((item) => (
                  <a key={item} href={`#${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} onClick={() => setIsMobileMenuOpen(false)} className="block p-3 text-center text-slate-300 hover:bg-slate-800 rounded-xl">
                    {item}
                  </a>
               ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* --- CONTENT WRAPPER --- */}
      <div className="relative z-10 bg-slate-950 mb-[100vh] md:mb-[600px] shadow-2xl pb-10">
        
        {/* ================= HERO SECTION ================= */}
        <section id="inicio" className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
          <motion.div variants={blobVariants} animate="animate" className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />
          <motion.div variants={blobVariants} animate="animate" className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-blue-700/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto px-6 grid lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
            
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
              <TextReveal className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                    <Award size={12} /> Referência em CTBMF
                  </div>
              </TextReveal>

              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-[0.9] tracking-tighter mb-8">
                <TextReveal delay={0.1}>{doctor.shortName}</TextReveal>
                <TextReveal delay={0.2} className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 pb-2">
                   {doctor.lastName}
                </TextReveal>
              </h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-slate-400 mb-10 max-w-xl font-light leading-relaxed"
              >
                Cirurgia e Traumatologia Buco-Maxilo-Facial. <br className="hidden md:block"/>
                Foco em <span className="text-slate-100 font-medium border-b border-cyan-500/30">segurança</span>, <span className="text-slate-100 font-medium border-b border-cyan-500/30">raciocínio clínico-cirúrgico</span> e <span className="text-slate-100 font-medium border-b border-cyan-500/30">base científica</span>.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
              >
                <a onClick={scrollToFooter} href="#contato" className="group relative px-8 py-4 bg-slate-100 text-slate-950 rounded-full font-bold overflow-hidden cursor-pointer shadow-lg hover:shadow-cyan-500/20 transition-all">
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Agendar Consulta</span>
                  <div className="absolute inset-0 bg-slate-900 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[0.22,1,0.36,1]" />
                </a>
                <a href="#sobre" className="px-8 py-4 border border-slate-800 text-slate-400 hover:text-white rounded-full font-medium hover:border-slate-600 transition-all">
                  Conhecer Trajetória
                </a>
              </motion.div>
            </div>

            <div className="lg:col-span-5 relative order-1 lg:order-2 flex justify-center lg:justify-end mt-10 lg:mt-0">
               <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                 className="relative z-10 w-full max-w-[400px]"
               >
                  <ParallaxImage className="rounded-[2.5rem] shadow-2xl border border-white/10 aspect-[3/4]" alt="Dr. João Pedro" />
                  
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-6 -left-0 md:-left-12 bg-slate-900/90 backdrop-blur-xl p-4 pr-8 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4"
                  >
                      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl text-white shadow-lg shadow-cyan-500/20">
                         <Clock size={20} />
                      </div>
                      <div>
                         <p className="text-xl font-bold text-white leading-none">+5.500h</p>
                         <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-1">Prática Clínica</p>
                      </div>
                  </motion.div>
               </motion.div>
            </div>
          </div>
          
          <motion.div 
            style={{ x: "-50%" }}
            animate={{ y: [0, 10, 0] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="absolute bottom-10 left-1/2 text-slate-700 hidden md:block"
          >
            <ChevronDown size={24} />
          </motion.div>
        </section>

        {/* ================= MARQUEE INFINITO ================= */}
        <div className="w-full bg-slate-900/50 border-y border-white/5 py-4 overflow-hidden">
           <motion.div 
             animate={{ x: ["0%", "-50%"] }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="flex gap-12 whitespace-nowrap text-slate-500 font-bold uppercase tracking-widest text-sm"
           >
              {[...Array(10)].map((_, i) => (
                 <React.Fragment key={i}>
                    <span>Buco-Maxilo-Facial</span>
                    <span className="text-cyan-500">•</span>
                    <span>Implantes</span>
                    <span className="text-cyan-500">•</span>
                    <span>Cirurgia Oral</span>
                    <span className="text-cyan-500">•</span>
                    <span>Patologia</span>
                    <span className="text-cyan-500">•</span>
                 </React.Fragment>
              ))}
           </motion.div>
        </div>

        {/* ================= SOBRE ================= */}
        <section id="sobre" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-20 items-center">
              
              <div className="w-full lg:w-5/12 grid grid-cols-2 gap-6">
                  <div className="translate-y-12">
                     <ParallaxImage className="rounded-3xl h-64 md:h-80 w-full shadow-lg" alt="Cirurgia" speed={1.2} />
                  </div>
                  <div>
                     <ParallaxImage className="rounded-3xl h-64 md:h-80 w-full shadow-lg" alt="Atendimento" />
                  </div>
              </div>

              <div className="w-full lg:w-7/12">
                <TextReveal>
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                    Experiência Hospitalar & <br/> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      Excelência Técnica
                    </span>
                  </h2>
                </TextReveal>
                
                <div className="space-y-6 text-slate-400 text-lg leading-relaxed text-justify md:pl-8 border-l border-slate-800">
                  <p>
                    Minha experiência foi construída majoritariamente em ambientes cirúrgicos e hospitalares, incluindo atuação em hospital oncológico e serviços de referência em CTBMF.
                  </p>
                  <p>
                    Adoto uma <strong>abordagem centrada no paciente</strong>, considerando não apenas a condição local, mas também o contexto sistêmico, funcional e psicológico. O foco é sempre oferecer diagnóstico preciso e tratamento humanizado.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mt-12 md:pl-8">
                  {[
                      "Residência Hospitalar", 
                      "Cirurgias Complexas", 
                      "Pacientes Sistêmicos", 
                      "Atuação Multidisciplinar"
                  ].map((text, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400">
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className="text-sm font-medium text-slate-300 tracking-wide">{text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= ATUAÇÃO (CARDS) ================= */}
        <section id="atuacao" className="py-32 bg-slate-900/30 relative">
          <div className="container mx-auto px-6">
             <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
                <div>
                   <span className="text-cyan-500 font-bold tracking-widest text-xs uppercase mb-4 block">Especialidades</span>
                   <h2 className="text-4xl md:text-5xl font-bold text-white">Como posso ajudar?</h2>
                </div>
                <div className="hidden md:block w-1/3 h-[1px] bg-slate-800 mb-4"></div>
             </div>

             <div className="grid md:grid-cols-3 gap-8">
                {[
                  { 
                    icon: Activity, 
                    title: "Traumatologia Facial", 
                    desc: "Tratamento de fraturas e traumas de face, visando reabilitação funcional e estética." 
                  },
                  { 
                    icon: Stethoscope, 
                    title: "Exodontias Complexas", 
                    desc: "Remoção de terceiros molares (sisos) e dentes impactados com planejamento digital." 
                  },
                  { 
                    icon: BookOpen, 
                    title: "Patologia Oral", 
                    desc: "Diagnóstico, biópsias e tratamento de cistos, tumores odontogênicos e lesões." 
                  }
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="group bg-slate-950 border border-white/5 p-10 rounded-[2rem] hover:border-cyan-500/30 transition-colors relative overflow-hidden shadow-xl"
                  >
                      <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity text-cyan-500 rotate-12">
                         <card.icon size={120} strokeWidth={0.5} />
                      </div>
                      <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white mb-8 border border-white/10 group-hover:bg-cyan-500 transition-colors shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
                         <card.icon size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{card.title}</h3>
                      <p className="text-slate-400 leading-relaxed relative z-10">{card.desc}</p>
                  </motion.div>
                ))}
             </div>
          </div>
        </section>

        {/* ================= GALERIA (CLEAN) ================= */}
        <section id="galeria" className="py-32">
          <div className="container mx-auto px-6">
             <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl font-bold text-white">Galeria Clínica</h2>
                <a href={`https://instagram.com/${doctor.instagram.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    Ver Instagram <ArrowUpRight size={16} />
                </a>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                <div className="col-span-2 row-span-2 relative overflow-hidden rounded-3xl cursor-none">
                   <ParallaxImage className="w-full h-full" alt="Caso Cirúrgico" />
                </div>
                <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden"><ParallaxImage className="w-full h-full" alt="Procedimento" /></div>
                <div className="col-span-1 row-span-2 rounded-3xl overflow-hidden"><ParallaxImage className="w-full h-full" alt="Consultório" /></div>
                <div className="col-span-1 row-span-1 rounded-3xl overflow-hidden"><ParallaxImage className="w-full h-full" alt="Detalhe" /></div>
             </div>
          </div>
        </section>
      </div>

      {/* ================= FOOTER ATUALIZADO ================= */}
      <footer id="contato" className="fixed bottom-0 left-0 right-0 h-[100vh] md:h-[600px] z-0 flex flex-col justify-center bg-slate-950 border-t border-white/5 overflow-hidden">
         
         {/* -- Camada de Animação "Breathing Aurora" -- */}
         <div className="absolute inset-0 w-full h-full pointer-events-none">
             {/* Orbe 1 */}
             <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15],
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-cyan-600/20 blur-[100px]"
             />
             
             {/* Orbe 2 */}
             <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.1, 0.2, 0.1],
                    x: [0, -40, 0],
                    y: [0, 40, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] rounded-full bg-blue-800/20 blur-[120px]"
             />

             {/* Orbe 3 */}
             <motion.div
                animate={{
                    opacity: [0.05, 0.1, 0.05],
                    scale: [1, 1.1, 1]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-slate-800/30 blur-[120px]"
             />

             {/* Ruído */}
             <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`}}></div>
         </div>

         <div className="container mx-auto px-6 relative z-10 text-center mt-auto md:mt-0 flex-1 flex flex-col justify-center">
            
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
               className="mb-8 md:mb-12"
            >
               <h2 className="text-4xl md:text-7xl font-bold text-white tracking-tighter mb-6">
                 Vamos discutir seu caso?
               </h2>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 font-light">
                  Entre em contato para verificar disponibilidade de agenda e tirar dúvidas.
               </p>
               
               <button 
                 onClick={copyEmail}
                 className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-950 rounded-full font-bold text-lg md:text-xl hover:scale-105 transition-all shadow-[0_0_50px_-15px_rgba(255,255,255,0.3)]"
               >
                 {emailCopied ? (
                    <>
                        <Check className="text-emerald-600" size={24} />
                        <span className="text-emerald-900">E-mail Copiado!</span>
                    </>
                 ) : (
                    <>
                        <Copy className="text-cyan-600 group-hover:scale-110 transition-transform" size={24} />
                        <span>Copiar E-mail</span>
                    </>
                 )}
               </button>
               
               <p className="mt-6 text-slate-500 text-sm">{doctor.email}</p>
            </motion.div>
         </div>

         {/* -- Barra Inferior -- */}
         <div className="border-t border-white/10 bg-slate-950/30 backdrop-blur-sm relative z-20">
            <div className="container mx-auto px-6 py-8">
               <div className="flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 uppercase tracking-widest gap-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-cyan-500/50 animate-pulse"></span>
                     <span>Curitiba — PR</span>
                  </div>
                  
                  <span>© {new Date().getFullYear()} {doctor.shortName}</span>
                  
                  <div className="flex gap-6">
                     <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                        Instagram <ArrowUpRight size={10} />
                     </a>
                     <a href="#" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                        LinkedIn <ArrowUpRight size={10} />
                     </a>
                  </div>
               </div>
            </div>
         </div>
      </footer>

    </div>
  );
};

export default App;