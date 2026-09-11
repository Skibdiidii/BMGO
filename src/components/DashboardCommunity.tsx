import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  MessageSquare,
  Download,
  Share2,
  Search,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  Plus
} from 'lucide-react';
import { StorageService } from '../services/storage';
import { CommunityPost } from '../types';

interface DashboardCommunityProps {
  onLoadScriptToExecutor: (code: string) => void;
  onOpenExecutor: () => void;
}

export const DashboardCommunity: React.FC<DashboardCommunityProps> = ({
  onLoadScriptToExecutor,
  onOpenExecutor
}) => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [search, setSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [importedId, setImportedId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setPosts(StorageService.getCommunityPosts());
  };

  const handleLike = (postId: string) => {
    StorageService.toggleLikeCommunityPost(postId);
    loadPosts();
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInput[postId]?.trim();
    if (!text) return;
    StorageService.addCommentToPost(postId, text);
    setCommentInput((prev) => ({ ...prev, [postId]: '' }));
    loadPosts();
  };

  const handleImportToLibrary = (post: CommunityPost) => {
    if (post.code) {
      StorageService.addScript({
        title: post.title,
        description: post.description,
        code: post.code,
        category: 'Hacks',
        tags: ['Community', post.category],
        author: post.author,
        favorite: false
      });
      setImportedId(post.id);
      setTimeout(() => setImportedId(null), 2000);
    }
  };

  const filteredPosts = posts.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'All' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" />
            <h2 className="text-xl font-extrabold text-white">COMMUNITY HUB</h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              Verified Creators
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Discover community scripts, battle-tested PvP configs, and AI-generated presets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search community..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {['All', 'BedWars', 'PvP', 'UI Presets', 'Automation'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCat === cat
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPosts.map((post) => {
          const isCommentsOpen = !!expandedComments[post.id];
          return (
            <div
              key={post.id}
              className="bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="w-9 h-9 rounded-full object-cover border border-cyan-500/40"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{post.author}</span>
                        {post.badge && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
                            {post.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500">{post.createdAt}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {post.category}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100">{post.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{post.description}</p>
                </div>

                {post.code && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-200 max-h-24 overflow-hidden relative">
                    <pre className="line-clamp-3">{post.code}</pre>
                    <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 font-semibold transition-colors cursor-pointer ${
                        post.isLiked ? 'text-red-400' : 'text-slate-400 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-400' : ''}`} />
                      <span>{post.likes}</span>
                    </button>
                    <button
                      onClick={() => handleToggleComments(post.id)}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-200 font-semibold cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments.length}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {post.code && (
                      <>
                        <button
                          onClick={() => handleImportToLibrary(post)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          {importedId === post.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Download className="w-3 h-3" />
                          )}
                          <span>{importedId === post.id ? 'Saved' : 'Import'}</span>
                        </button>
                        <button
                          onClick={() => {
                            onLoadScriptToExecutor(post.code!);
                            onOpenExecutor();
                          }}
                          className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Run</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isCommentsOpen && (
                  <div className="pt-3 border-t border-slate-800/80 space-y-2.5 animate-fade-in">
                    <div className="space-y-2 max-h-36 overflow-y-auto custom-scrollbar pr-1">
                      {post.comments.length === 0 ? (
                        <div className="text-[11px] text-slate-500 text-center py-2">
                          No comments yet. Be the first!
                        </div>
                      ) : (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="p-2 rounded-lg bg-slate-950 text-xs flex gap-2">
                            <img
                              src={comment.avatar}
                              alt={comment.author}
                              className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-300 text-[10px]">{comment.author}</span>
                                <span className="text-[9px] text-slate-600">{comment.createdAt}</span>
                              </div>
                              <p className="text-slate-400 text-[11px]">{comment.text}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentInput[post.id] || ''}
                        onChange={(e) =>
                          setCommentInput((prev) => ({ ...prev, [post.id]: e.target.value }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        placeholder="Write a comment..."
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500/50"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="p-1.5 rounded-xl bg-cyan-500 text-slate-950 hover:brightness-110 cursor-pointer shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
