'use client'

import { motion, type Variants } from 'framer-motion'
import CategoryCard from '@/components/product/CategoryCard'
import CategoryLineMarquee from '@/components/sections/CategoryLineMarquee'
import TwoLineKicker from '@/components/sections/TwoLineKicker'
import { lineasPorNicho } from '@/lib/catalogo'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function ProductsGrid() {
  const autos = lineasPorNicho('autos')
  const arquitectura = lineasPorNicho('arquitectura')

  return (
    <section className="px-6 pb-8 bg-[#F2F2F0]">
      <div className="max-w-[1160px] mx-auto">
        <TwoLineKicker
          className="mb-8"
          lines={[
            { text: 'Línea de productos' },
            { text: 'KRISTALL', bold: true },
          ]}
        />

        {/* Automotive */}
        <CategoryLineMarquee label="Automotive" lineas={autos} />
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {autos.map((linea) => (
            <motion.div key={linea.slug} variants={cardVariants} className="h-full">
              <CategoryCard linea={linea} />
            </motion.div>
          ))}
        </motion.div>

        {/* Architectural */}
        <div className="mt-14">
          <CategoryLineMarquee label="Architectural" lineas={arquitectura} />
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {arquitectura.map((linea) => (
              <motion.div key={linea.slug} variants={cardVariants} className="h-full">
                <CategoryCard linea={linea} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
