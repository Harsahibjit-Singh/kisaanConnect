'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogPosts } from './data';
import { FaClock, FaUser, FaTag, FaArrowRight } from 'react-icons/fa';

export default function BlogList() {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans pt-24 pb-20">
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-20 text-center">
        <motion.span 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400 font-bold tracking-widest uppercase text-sm mb-4 block"
        >
          Kisaan Connect Editorial
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold mb-6"
        >
          Insights for the <br/> Modern <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Mandi Market</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto text-lg"
        >
          Expert analysis, policy updates, and growth strategies for Arthiyas and Farmers.
        </motion.p>
      </div>

      {/* Blog Grid */}
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogPosts.map((post, i) => (
            <motion.article 
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-gray-900 rounded-3xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all hover:shadow-[0_0_30px_rgba(34,197,94,0.1)] flex flex-col h-full"
            >
              {/* Image */}
              <div className="h-56 overflow-hidden relative">
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white z-10 flex items-center gap-2">
                  <FaTag className="text-green-400" /> {post.category}
                </div>
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><FaUser className="text-green-500" /> {post.author}</span>
                  <span className="flex items-center gap-1"><FaClock className="text-green-500" /> {post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold mb-4 group-hover:text-green-400 transition-colors line-clamp-2">
                  <Link href={`/blog/${post.id}`}>
                    {post.title}
                  </Link>
                </h2>
                
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                <Link href={`/blog/${post.id}`}>
                  <span className="inline-flex items-center gap-2 text-green-400 font-bold text-sm hover:gap-3 transition-all">
                    Read Article <FaArrowRight />
                  </span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}