'use client';

import { useEffect, useState, useRef } from 'react';

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
}

export default function CursorVibration() {
    const [particles, setParticles] = useState<Particle[]>([]);
    const [isPressed, setIsPressed] = useState(false);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const particleIdRef = useRef(0);

    useEffect(() => {
        const createParticles = (x: number, y: number) => {
            const newParticles: Particle[] = [];

            // Create 3-5 debris particles per frame (less per frame but continuous)
            const count = Math.floor(Math.random() * 3) + 3;

            for (let i = 0; i < count; i++) {
                // Random angle and speed to simulate debris flying off
                const angle = (Math.random() * Math.PI * 2);
                const speed = Math.random() * 3 + 1.5;

                newParticles.push({
                    id: particleIdRef.current++,
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    life: 1.0,
                });
            }

            setParticles(prev => [...prev, ...newParticles]);
        };

        const handleMouseMove = (e: MouseEvent) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = (e: MouseEvent | PointerEvent) => {
            setIsPressed(true);
            setCursorPos({ x: e.clientX, y: e.clientY });

            // Haptic vibration on press
            if ('vibrate' in navigator) {
                navigator.vibrate([20, 10, 20]);
            }
        };

        const handleMouseUp = () => {
            setIsPressed(false);
        };

        // Animate particles
        const animateParticles = () => {
            setParticles(prev => {
                return prev
                    .map(p => ({
                        ...p,
                        x: p.x + p.vx,
                        y: p.y + p.vy + 0.2, // Gravity effect
                        vy: p.vy + 0.1, // Gravity acceleration
                        life: p.life - 0.02,
                    }))
                    .filter(p => p.life > 0);
            });
        };

        // Continuously create particles while pressed
        let particleInterval: NodeJS.Timeout | undefined;
        if (isPressed) {
            particleInterval = setInterval(() => {
                createParticles(cursorPos.x, cursorPos.y);
            }, 50); // Create particles every 50ms while pressed
        }

        const animationInterval = setInterval(animateParticles, 16);

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mousedown', handleMouseDown as any);
        document.addEventListener('pointerdown', handleMouseDown as any);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('pointerup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mousedown', handleMouseDown as any);
            document.removeEventListener('pointerdown', handleMouseDown as any);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('pointerup', handleMouseUp);
            clearInterval(animationInterval);
            if (particleInterval) clearInterval(particleInterval);
        };
    }, [isPressed, cursorPos]);

    return (
        <>
            {/* Render debris particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    style={{
                        position: 'fixed',
                        left: particle.x,
                        top: particle.y,
                        width: '3px',
                        height: '3px',
                        borderRadius: '50%',
                        backgroundColor: `rgba(156, 163, 175, ${particle.life})`,
                        pointerEvents: 'none',
                        zIndex: 9999,
                        transform: 'translate(-50%, -50%)',
                        boxShadow: `0 0 2px rgba(156, 163, 175, ${particle.life * 0.5})`,
                    }}
                />
            ))}
        </>
    );
}
