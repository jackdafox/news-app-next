"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ArrowForwardSharpIcon from "@mui/icons-material/ArrowForwardSharp";
import { Button } from "@/components/ui/button";

export interface HeroFeature {
    category: string;
    slug: string;
    title: string;
    image: string | null;
    articleSlug: string;
}

export function AnimatedHero({ features }: { features: HeroFeature[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (!features || features.length === 0) return;

        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % features.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, [features]);

    return (
        <div className="relative w-full bg-background mt-[-1px]">
            {/* The Visual Container */}
            <div className="relative min-h-[calc(100vh-60px)] lg:min-h-0 lg:h-[calc(100vh-11em)] py-12 lg:py-0 flex flex-col lg:flex-row items-center container mx-auto z-10 overflow-hidden">

                {/* Left side: Text */}
                <div className="lg:w-7/12 w-full flex flex-col justify-center lg:pr-8 z-20 pb-2 lg:pb-0">
                    <h1 className="text-2xl md:text-4xl font-normal tracking-tighter text-foreground leading-none">
                        Find news about
                    </h1>
                    <div className="h-[70px] md:h-[120px] relative overflow-visible mb-3">
                        <AnimatePresence>
                            <motion.h2
                                key={activeIndex}
                                initial={{ y: 60, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -60, opacity: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="text-4xl sm:text-5xl md:text-[5.5rem] lg:text-[6.5rem] text-foreground leading-none absolute inset-0"
                                style={{ fontFamily: 'var(--font-eb-garamond), serif', letterSpacing: '-0.02em', paddingTop: '0.1em' }}
                            >
                                {features[activeIndex]?.category || "Various"}
                            </motion.h2>
                        </AnimatePresence>
                    </div>

                    <div className="flex gap-4">
                        <Button asChild className="rounded-none h-10 px-6 text-sm bg-foreground text-background hover:bg-foreground/90 font-bold tracking-wider mt-3 uppercase">
                            <Link href={`/headlines?category=${features[activeIndex]?.slug || ''}`}>
                                Follow {features[activeIndex]?.category || "More"} <ArrowForwardSharpIcon className="ml-3 w-4 h-4" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Right side: Animated Image block */}
                <div className="lg:w-5/12 w-full h-[50vh] lg:h-[80vh] flex items-center justify-center relative overflow-hidden my-6 lg:my-0">
                    {features.map((feature, idx) => {
                        let offset = idx - activeIndex;
                        // Wrap around logic for smooth circular loop
                        if (offset > features.length / 2) offset -= features.length;
                        if (offset < -features.length / 2) offset += features.length;

                        // Only render near items
                        if (Math.abs(offset) > 2) return null;

                        const isCenter = offset === 0;

                        return (
                            <motion.div
                                key={feature.slug}
                                initial={false}
                                animate={{
                                    y: `${offset * 105}%`,
                                    scale: isCenter ? 1 : 0.85,
                                    opacity: isCenter ? 1 : 0.3,
                                    zIndex: isCenter ? 40 : 20 - Math.abs(offset),
                                }}
                                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute w-[95%] sm:w-4/5 lg:w-[90%] lg:aspect-[4/3] aspect-video bg-muted overflow-hidden border border-border shadow-2xl cursor-pointer"
                                onClick={() => !isCenter && setActiveIndex(idx)}
                            >
                                <Link
                                    href={`/news/${feature.articleSlug}`}
                                    className={`group block w-full h-full ${!isCenter ? "pointer-events-none" : ""}`}
                                >
                                    {feature.image && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={feature.image}
                                            alt={feature.title}
                                            className="absolute inset-0 w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />

                                    <div className={`absolute bottom-0 left-0 p-6 md:p-8 w-full z-10 transition-opacity duration-500 ${isCenter ? 'opacity-100' : 'opacity-0'}`}>
                                        <h3 className="text-xl md:text-3xl font-bold text-white group-hover:text-primary transition-colors leading-[1.2] tracking-tight drop-shadow-md">
                                            {feature.title}
                                        </h3>
                                    </div>

                                    {!isCenter && <div className="absolute inset-0 bg-background/20 pointer-events-none" />}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <hr className="border-t border-foreground mx-4 md:mx-8 mb-12 relative z-20" />
        </div>
    );
}
