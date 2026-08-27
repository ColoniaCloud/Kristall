'use client'

import { motion, type Variants } from 'framer-motion'

interface KickerLine {
  text: string
  bold?: boolean
}

interface TwoLineKickerProps {
  lines: [KickerLine, KickerLine]
  className?: string
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const wordVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
}

/**
 * Título de dos líneas con look de wordmark (Clash Display, negrita en la
 * palabra "marca" y regular en la descriptiva) que entra palabra por palabra
 * desde la derecha. Usado como encabezado de sección en BrandStory y
 * ProductsGrid — misma tipografía/tamaño/animación en ambos.
 */
export default function TwoLineKicker({ lines, className }: TwoLineKickerProps) {
  return (
    <motion.h2
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      style={{ fontFamily: 'var(--font-display)' }}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="flex flex-wrap text-[1.75rem] md:text-[2.25rem] leading-[1.1] tracking-tight text-[#0A0A0A]"
          style={{ fontWeight: line.bold ? 700 : 400 }}
        >
          {line.text.split(' ').map((word, j) => (
            <motion.span key={j} variants={wordVariants} className="inline-block mr-[0.28em]">
              {word}
            </motion.span>
          ))}
        </div>
      ))}
    </motion.h2>
  )
}
