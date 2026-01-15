'use client';

import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useSpring } from 'framer-motion';
import { blogPosts } from '../data';
import { FaArrowLeft, FaCalendarAlt, FaUser, FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

export default function BlogPost() {
  const { id } = useParams();
  
  // Find post from data
  const post = blogPosts.find((p) => p.id === id);

  // Scroll Progress Bar Logic
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
           <h2 className="text-4xl font-bold mb-4">Post Not Found</h2>
           <Link href="/blog" className="text-green-500 hover:underline">Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans">
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-green-500 origin-left z-50"
        style={{ scaleX }}
      />

      {/* Hero Image */}
      <div className="h-[60vh] relative w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent z-10"></div>
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-20">
          <div className="container mx-auto">
             <Link href="/blog">
               <span className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-6 transition-colors cursor-pointer backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full border border-white/10">
                 <FaArrowLeft /> Back to Blog
               </span>
             </Link>
             <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight max-w-4xl">
               {post.title}
             </h1>
             <div className="flex flex-wrap gap-6 text-sm md:text-base text-gray-300">
               <span className="flex items-center gap-2"><FaUser className="text-green-500" /> {post.author}</span>
               <span className="flex items-center gap-2"><FaCalendarAlt className="text-green-500" /> {post.date}</span>
               <span className="bg-green-600 px-3 py-1 rounded text-white text-xs font-bold self-center uppercase">{post.category}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="container mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Main Text */}
        <article className="lg:w-2/3 prose prose-invert prose-lg prose-green max-w-none">
          {/* We use dangerouslySetInnerHTML because we are storing HTML in the data file. 
              In a real app, use a sanitizer or a proper CMS renderer. */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </article>

        {/* Sidebar */}
        <aside className="lg:w-1/3 space-y-12">
          
          {/* Author Card */}
          <div className="bg-gray-900 p-8 rounded-3xl border border-white/5">
            <h3 className="text-xl font-bold mb-4">About Author</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-xl font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{post.author}</p>
                <p className="text-sm text-gray-400">Senior Market Analyst</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">Expert in agricultural economics with experience in the Indian Mandi system.</p>
          </div>

          {/* Share Links */}
          <div className="bg-gray-900 p-8 rounded-3xl border border-white/5">
             <h3 className="text-xl font-bold mb-6">Share this article</h3>
             <div className="flex gap-4">
               {[FaFacebookF, FaTwitter, FaLinkedinIn].map((Icon, i) => (
                 <button key={i} className="w-12 h-12 rounded-full bg-white/5 hover:bg-green-500 hover:text-white transition-all flex items-center justify-center text-gray-400">
                   <Icon />
                 </button>
               ))}
             </div>
          </div>

          {/* Related Tags */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {['Agriculture', 'Technology', 'Finance', 'Government Policy', 'MSP'].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-gray-900 rounded-lg text-sm text-gray-400 border border-white/5 hover:border-green-500 cursor-pointer transition-colors">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

        </aside>
      </div>

    </div>
  );
}