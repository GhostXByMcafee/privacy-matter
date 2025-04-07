'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../../i18n/useTranslation';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useParams } from 'next/navigation';

interface HeroSectionProps {
  customClass?: string;
}

export default function HeroSection({ customClass = '' }: HeroSectionProps) {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const { locale } = useParams() as { locale: string };
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const particles: Particle[] = [];
    let animationFrameId: number;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        
        const colors = ['#4f46e5', '#06b6d4', '#8b5cf6', '#3b82f6'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }
        
        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }
      
      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = 0.5;
        ctx.fill();
      }
    }
    
    const init = () => {
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
      }
    };
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.globalAlpha = 1 - (distance / 100);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    init();
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  useEffect(() => {
    if (!modelContainerRef.current) return;
    
    const container = modelContainerRef.current;
    
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 1;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 2.5);
    scene.add(ambientLight);
    
    const frontLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
    frontLight.position.set(5, 10, 10);
    scene.add(frontLight);
    
    const backLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    backLight.position.set(-5, 5, -10);
    scene.add(backLight);
    
    const loader = new GLTFLoader();
    
    const loadingManager = new THREE.LoadingManager();
    loadingManager.setURLModifier((url) => {
      if (url.endsWith('scene.bin')) {
        return '/broken-chains.bin';
      }
      return url;
    });
    
    loader.manager = loadingManager;
    
    loader.load('/broken-chains.gltf', (gltf) => {
      const model = gltf.scene;
      
      model.scale.set(4.0, 4.0, 4.0);
      
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            emissive: 0x1e3a8a,
            emissiveIntensity: 0.3,
            shininess: 30,
          });
        }
      });
      
      scene.add(model);
      
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x = model.position.x - center.x;
      model.position.y = model.position.y - center.y - 0.8;
      model.position.z = model.position.z - center.z;
      
      const size = box.getSize(new THREE.Vector3()).length();
      camera.position.z = size * 0.8;
    }, undefined, (error) => {
      console.error('Error loading model:', error);
    });
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      scene.rotation.y += 0.002;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
    };
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('privacy-tools');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleGetHelp = () => {
    const contactPath = `/${locale}/contact`;
    window.location.href = contactPath;
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-20 cipher-bg">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center min-h-[80vh] py-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left md:col-span-3 md:pl-8"
          >
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight decrypt-animation relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-700">
                {t('privacy.hero.title', 'Protecting Your Digital Privacy')}
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
            >
              {t('privacy.hero.subtitle', 'Tools and resources to protect your personal data in the digital era')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <a 
                href="#privacy-tools" 
                className="glow-effect" 
                onClick={handleSmoothScroll}
                aria-label={t('privacy.hero.cta.resources')}
              >
                <button className="gradient-button px-8 py-4 rounded-full w-full sm:w-auto">
                  {t('privacy.hero.cta.resources', 'View Services')}
                </button>
              </a>
              
              <button 
                onClick={handleGetHelp}
                className="gradient-button-outline px-8 py-4 rounded-full w-full sm:w-auto glow-effect"
                aria-label={t('privacy.hero.cta.help')}
              >
                {t('privacy.hero.cta.help', 'Get Help')}
              </button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden md:flex items-center justify-center relative md:col-span-2"
            ref={modelContainerRef}
            style={{ height: '500px' }}
          />
        </div>
      </div>
    </section>
  );
}