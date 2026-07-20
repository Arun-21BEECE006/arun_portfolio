import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCloseLine, RiTimeLine, RiArrowRightLine } from "react-icons/ri";
import { useContent } from "../context/ContentContext";
import { img } from "../utils/images";

function BlogModal({ post, onClose }) {
  if (!post) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-ink-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-ink-600 bg-ink-900"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="sticky top-4 float-right mr-4 z-10 w-10 h-10 grid place-items-center rounded-full bg-ink-800 border border-ink-600 hover:text-amber-400 transition-colors"
        >
          <RiCloseLine size={20} />
        </button>
        {post.coverImage && (
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img src={img(post.coverImage)} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6 sm:p-8">
          <p className="font-mono text-[11px] uppercase tracking-wider text-amber-400 mb-2">
            {post.category} · {post.readTime}
          </p>
          <h3 className="font-display text-2xl sm:text-3xl font-semibold">{post.title}</h3>
          <p className="text-xs text-muted mt-2">{post.date}</p>
          <div className="mt-6 space-y-4 text-muted leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {post.tags.map((t) => (
                <span key={t} className="px-3 py-1 rounded-full text-xs border border-ink-600 bg-ink-800/60">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Blog() {
  const { content } = useContent();
  const posts = (content.blogPosts || []).filter((p) => p.published !== false);
  const [selected, setSelected] = useState(null);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="section-pad py-24 lg:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow mb-3">Writing</p>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
            Notes from the build.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              onClick={() => setSelected(post)}
              className="group cursor-pointer rounded-2xl border border-ink-600 bg-ink-800/40 overflow-hidden hover:border-ink-500 hover:-translate-y-1 transition-all duration-300"
            >
              {post.coverImage && (
                <div className="aspect-[16/9] overflow-hidden bg-ink-700">
                  <img
                    src={img(post.coverImage)}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="font-mono text-[11px] uppercase tracking-wider text-amber-400 mb-2">
                  {post.category}
                </p>
                <h3 className="font-display font-semibold text-base mb-2">{post.title}</h3>
                <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <RiTimeLine size={13} /> {post.readTime}
                  </span>
                  <span className="inline-flex items-center gap-1 text-teal-300">
                    Read <RiArrowRightLine size={13} />
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && <BlogModal post={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
