import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, Search, User, Play, Plus, Star, ChevronLeft, ChevronRight, Zap, Loader2, X, Bookmark, ArrowUp, Calendar, TrendingUp, Check, Mail, Lock, ArrowRight, Home, BookOpen, Book, MessageSquare, List, Settings, HelpCircle, ThumbsUp, Clock, Info } from 'lucide-react';

// --- FALLBACK DATA ---
const fallbackAnime = [
  { id: 5114, title: "Fullmetal Alchemist: Brotherhood", image: "https://cdn.myanimelist.net/images/anime/1208/94745l.jpg", bgImage: "https://img.youtube.com/vi/--IcmZkvL0Q/maxresdefault.jpg", score: 9.1, type: "TV", year: 2009, eps: "64 EPS", synopsis: "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in catastrophic new realities.", genres: ["Action", "Adventure", "Drama", "Fantasy"] },
  { id: 9253, title: "Steins;Gate", image: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg", bgImage: "https://img.youtube.com/vi/27OZc-ku6is/maxresdefault.jpg", score: 9.07, type: "TV", year: 2011, eps: "24 EPS", synopsis: "Eccentric scientist Rintarou Okabe has a never-ending thirst for scientific exploration. Together with his ditzy but well-meaning friend Mayuri Shiina and his roommate Itaru Hashida, Rintarou founds the Future Gadget Laboratory.", genres: ["Drama", "Sci-Fi", "Suspense"] },
  { id: 11061, title: "Hunter x Hunter (2011)", image: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg", bgImage: "https://img.youtube.com/vi/d6kBeJjTGnY/maxresdefault.jpg", score: 9.04, type: "TV", year: 2011, eps: "148 EPS", synopsis: "Hunters devote themselves to accomplishing hazardous tasks, all from traversing the world's uncharted territories to locating rare items and monsters.", genres: ["Action", "Adventure", "Fantasy"] },
  { id: 16498, title: "Attack on Titan", image: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg", bgImage: "https://img.youtube.com/vi/LHtdKWJdif4/maxresdefault.jpg", score: 8.54, type: "TV", year: 2013, eps: "25 EPS", synopsis: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls.", genres: ["Action", "Drama", "Suspense"] },
  { id: 28977, title: "Gintama°", image: "https://cdn.myanimelist.net/images/anime/3/72078l.jpg", bgImage: "https://img.youtube.com/vi/0gjsA-k2mG0/maxresdefault.jpg", score: 9.08, type: "TV", year: 2015, eps: "51 EPS", synopsis: "Gintoki, Shinpachi, and Kagura return as the fun-loving but broke members of the Yorozuya team! Living in an alternate-reality Edo, where swords are prohibited and alien overlords have conquered Japan.", genres: ["Action", "Comedy", "Sci-Fi"] }
];

const fallbackManga = [
  { id: 2, title: "Berserk", image: "https://cdn.myanimelist.net/images/manga/1/157897l.jpg", bgImage: "https://cdn.myanimelist.net/images/manga/1/157897l.jpg", score: 9.47, type: "Manga", year: 1989, eps: "? CH", synopsis: "Guts, a former mercenary now known as the 'Black Swordsman,' is out for revenge. After a tumultuous childhood, he finally finds someone he respects and believes he can trust.", genres: ["Action", "Adventure", "Drama", "Fantasy", "Horror"] },
  { id: 13, title: "One Piece", image: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg", bgImage: "https://cdn.myanimelist.net/images/manga/2/253146l.jpg", score: 9.22, type: "Manga", year: 1997, eps: "? CH", synopsis: "Gol D. Roger, a man referred to as the 'Pirate King,' is set to be executed by the World Government. But just before his demise, he confirms the existence of a great treasure, One Piece.", genres: ["Action", "Adventure", "Fantasy"] },
  { id: 25, title: "Fullmetal Alchemist", image: "https://cdn.myanimelist.net/images/manga/3/243675l.jpg", bgImage: "https://cdn.myanimelist.net/images/manga/3/243675l.jpg", score: 9.03, type: "Manga", year: 2001, eps: "109 CH", synopsis: "Alchemists are knowledgeable and naturally talented individuals who can manipulate and modify matter due to their art. Yet despite the wide range of possibilities, alchemy is not as omnipotent as most would believe.", genres: ["Action", "Adventure", "Drama", "Fantasy"] }
];

const fallbackNovel = [
  { id: 8142, title: "Monogatari Series: First Season", image: "https://cdn.myanimelist.net/images/manga/3/181000l.jpg", bgImage: "https://cdn.myanimelist.net/images/manga/3/181000l.jpg", score: 8.93, type: "Light Novel", year: 2006, eps: "6 VOL", synopsis: "Koyomi Araragi, a third-year high school student, manages to survive a vampire attack with the help of Meme Oshino, a strange man residing in an abandoned building.", genres: ["Comedy", "Mystery", "Romance", "Supernatural"] },
  { id: 55551, title: "Hakomari", image: "https://cdn.myanimelist.net/images/manga/2/113619l.jpg", bgImage: "https://cdn.myanimelist.net/images/manga/2/113619l.jpg", score: 8.88, type: "Light Novel", year: 2009, eps: "7 VOL", synopsis: "Kazuki Hoshino values his everyday life above all else. He spends the days carefree with his friends at school, until the transfer student Aya Otonashi abruptly enters his classroom and declares her intention to 'break' him.", genres: ["Mystery", "Psychological", "Romance", "Supernatural"] }
];

// --- HELPER FUNCTIONS ---
const normalizeData = (item: any) => ({
  id: item.mal_id,
  title: item.title_english || item.title,
  image: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url,
  bgImage: item.trailer?.images?.maximum_image_url || item.images?.jpg?.large_image_url,
  trailerUrl: item.trailer?.url || null,
  score: item.score || 'N/A',
  type: item.type || 'Unknown',
  year: item.year || item.published?.prop?.from?.year || 'N/A',
  season: item.season ? item.season.charAt(0).toUpperCase() + item.season.slice(1) : 'Unknown Season',
  duration: item.duration || 'Unknown Duration',
  eps: item.episodes ? `${item.episodes} EPS` : item.chapters ? `${item.chapters} CH` : item.volumes ? `${item.volumes} VOL` : '? EPS',
  synopsis: item.synopsis || "No synopsis available.",
  genres: item.genres?.map((g: any) => g.name).filter(Boolean) || [],
  status: item.status || 'Unknown Status',
  studio: item.studios?.[0]?.name || item.authors?.[0]?.name || 'Unknown Studio/Author',
  rating: item.rating || 'Unknown Rating',
});

const multiplyArray = (arr: any[], targetCount: number) => {
  if (!arr || arr.length === 0) return [];
  const result = [];
  while (result.length < targetCount) {
    result.push(...arr.map((item, index) => ({ ...item, uniqueId: `${item.id}-${result.length}-${index}` })));
  }
  return result.slice(0, targetCount);
};

// --- COMPONENTS ---

const SettingsModal = ({ isOpen, onClose }: any) => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-background/98 z-[100] flex items-center justify-center p-4 backdrop-blur-xl"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-surface w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row h-[80vh] md:h-[600px]"
          >
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-black/20 p-6 border-b md:border-b-0 md:border-r border-white/10 flex flex-col gap-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black italic text-white uppercase">Settings</h2>
              <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <button onClick={() => setActiveTab('account')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'account' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <User size={18} /> Account
            </button>
            <button onClick={() => setActiveTab('preferences')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'preferences' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Settings size={18} /> Preferences
            </button>
            <button onClick={() => setActiveTab('playback')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'playback' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Play size={18} /> Playback
            </button>
            <button onClick={() => setActiveTab('notifications')} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-colors ${activeTab === 'notifications' ? 'bg-primary text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <Mail size={18} /> Notifications
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative">
            <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>

            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Profile Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
                      <input type="text" defaultValue="Otaku User" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                      <input type="email" defaultValue="user@example.com" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Subscription</h3>
                  <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 border border-primary/30 rounded-xl p-6 flex items-center justify-between">
                    <div>
                      <div className="text-primary font-black italic uppercase text-lg mb-1">Premium Plan</div>
                      <div className="text-sm text-gray-300">Next billing date: April 25, 2026</div>
                    </div>
                    <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-[0_0_15px_rgba(168,127,251,0.4)]">
                      Manage
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
                  <button className="border border-red-500/50 text-red-400 hover:bg-red-500/10 px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                    Delete Account
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Content Preferences</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Default Audio Language</div>
                        <div className="text-sm text-gray-400">Prefer dubbed or subbed when available</div>
                      </div>
                      <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                        <option>Japanese (Subbed)</option>
                        <option>English (Dubbed)</option>
                      </select>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Show Mature Content (18+)</div>
                        <div className="text-sm text-gray-400">Display NSFW content in search and recommendations</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Theme</div>
                        <div className="text-sm text-gray-400">Choose your visual aesthetic</div>
                      </div>
                      <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                        <option>Dark Mode</option>
                        <option>Light Mode</option>
                        <option>System Default</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'playback' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Video Player Settings</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Default Video Quality</div>
                        <div className="text-sm text-gray-400">Adjust based on your connection speed</div>
                      </div>
                      <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                        <option>Auto</option>
                        <option>1080p</option>
                        <option>720p</option>
                        <option>480p</option>
                      </select>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Auto-Play Next Episode</div>
                        <div className="text-sm text-gray-400">Automatically start the next episode when one finishes</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Skip Intro/Outro</div>
                        <div className="text-sm text-gray-400">Automatically skip known opening and ending sequences</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">New Episode Alerts</div>
                        <div className="text-sm text-gray-400">Get notified when an anime on your watchlist airs a new episode</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Recommendations</div>
                        <div className="text-sm text-gray-400">Receive personalized anime and manga recommendations</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    <div className="h-px bg-white/5" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white font-bold mb-1">Marketing Emails</div>
                        <div className="text-sm text-gray-400">Receive news, promotions, and special offers</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ activeTab, setActiveTab, onMenuClick, onSearchClick, onProfileClick }: any) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1200px] z-50 transition-all duration-300 rounded-2xl ${
        scrolled ? 'bg-surface/80 backdrop-blur-xl border border-white/10 shadow-2xl py-3' : 'bg-surface/40 backdrop-blur-md border border-white/5 py-4'
      }`}
    >
      <div className="px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onMenuClick} className="text-white hover:text-primary transition-colors cursor-pointer">
            <Menu size={24} />
          </button>
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('HOME')}
          >
            <div className="bg-primary p-1.5 rounded-lg group-hover:scale-110 transition-transform">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <span className="text-xl font-black italic tracking-wider text-primary uppercase hidden sm:block drop-shadow-[0_0_10px_rgba(168,127,251,0.5)]">Animevekno</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          {['HOME', 'MANGA', 'NOVEL'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-bold tracking-wider transition-colors cursor-pointer uppercase ${
                activeTab === tab ? 'text-primary' : 'text-gray-300 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
          <a href="https://www.reddit.com/r/anime/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-wider text-gray-300 hover:text-white transition-colors uppercase">REDDIT</a>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={onSearchClick} className="text-white hover:text-primary transition-colors cursor-pointer">
            <Search size={20} />
          </button>
          <button onClick={onProfileClick} className="text-white hover:text-primary transition-colors cursor-pointer">
            <User size={20} />
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = ({ items, onGenreClick, onDetailsClick, onToggleWatchlist, watchlist }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!items || items.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5));
    }, 5000);
    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) return null;

  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + Math.min(items.length, 5)) % Math.min(items.length, 5));
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % Math.min(items.length, 5));

  const currentItem = items[currentIndex];
  const isReadingMaterial = currentItem.type === 'Manga' || currentItem.type === 'Light Novel' || currentItem.type === 'Novel' || currentItem.type === 'One-shot' || currentItem.type === 'Doujinshi' || currentItem.type === 'Manhwa' || currentItem.type === 'Manhua';

  return (
    <div className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center bg-background">
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0 bg-black">
            <img 
              src={currentItem.bgImage || currentItem.image} 
              alt={currentItem.title}
              referrerPolicy="no-referrer"
              onError={(e) => { e.currentTarget.src = currentItem.image; }}
              className="absolute inset-0 w-full h-full object-cover opacity-60"
            />
          </div>
          
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

          <div className="relative h-full max-w-[1600px] mx-auto px-6 md:px-12 pt-32 flex items-center">
            <div className="max-w-3xl">
              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  {currentItem.type}
                </span>
                <span className="bg-white/10 text-white border border-white/10 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                  {currentItem.year}
                </span>
              </motion.div>

              <motion.h1 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-5xl md:text-7xl lg:text-[6rem] font-black italic text-white uppercase leading-[0.9] tracking-tighter mb-6 drop-shadow-2xl line-clamp-3"
              >
                {currentItem.title}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-2xl font-medium line-clamp-3 drop-shadow-md"
              >
                {currentItem.synopsis}
              </motion.p>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex flex-wrap items-center gap-4 mb-10"
              >
                <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full">
                  <Star size={16} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">{currentItem.score}</span>
                </div>
                {currentItem.genres.slice(0, 3).map((tag: string, i: number) => tag ? (
                  <button 
                    key={`genre-${tag}-${i}`} 
                    onClick={() => onGenreClick(tag)}
                    className="bg-surface-light/80 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-gray-300 hover:bg-primary hover:text-white transition-colors cursor-pointer"
                  >
                    {tag.toUpperCase()}
                  </button>
                ) : null)}
              </motion.div>

              <motion.div 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button 
                  onClick={() => onDetailsClick(currentItem)}
                  className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_30px_rgba(168,127,251,0.3)] hover:shadow-[0_0_40px_rgba(168,127,251,0.5)] hover:-translate-y-1"
                >
                  {isReadingMaterial ? <BookOpen size={20} className="fill-white" /> : <Play size={20} className="fill-white" />}
                  {isReadingMaterial ? 'READ NOW' : 'WATCH NOW'}
                </button>
                <button 
                  onClick={() => onToggleWatchlist(currentItem)}
                  className="bg-surface/50 hover:bg-surface border border-white/10 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md hover:-translate-y-1"
                >
                  {watchlist.some((w: any) => w.id === currentItem.id) ? (
                    <><Check size={20} className="text-primary" /> IN LIST</>
                  ) : (
                    <><Plus size={20} /> MY LIST</>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Right side carousel controls */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-20 hidden lg:flex">
        <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-surface/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white group">
          <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button onClick={handleNext} className="w-12 h-12 rounded-full bg-surface/50 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer text-white group">
          <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="flex flex-col gap-3 mt-6">
          {items.slice(0, 5).map((_, idx) => (
            <button 
              key={`dot-${idx}`}
              onClick={() => setCurrentIndex(idx)}
              className="relative w-2 h-12 rounded-full overflow-hidden bg-white/20 cursor-pointer"
            >
              {idx === currentIndex && (
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="absolute top-0 left-0 w-full bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnimeCard = ({ item, onClick, onToggleWatchlist, inWatchlist }: any) => {
  const isReadingMaterial = item.type === 'Manga' || item.type === 'Light Novel' || item.type === 'Novel' || item.type === 'One-shot' || item.type === 'Doujinshi' || item.type === 'Manhwa' || item.type === 'Manhua';

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="w-[160px] md:w-[200px] shrink-0 group cursor-pointer flex flex-col relative" 
      onClick={onClick}
    >
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 bg-surface-light shadow-lg">
        <img 
          src={item.image} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Top Left Score */}
        <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded flex items-center gap-1">
          <Star size={10} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 text-[10px] font-bold">{item.score}</span>
        </div>

        {/* Top Right Type */}
        <div className="absolute top-2 right-2 bg-primary px-2 py-1 rounded text-white text-[10px] font-bold uppercase tracking-wider">
          {item.type}
        </div>
        
        {/* Hover Play/Read Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-primary/90 backdrop-blur-sm flex items-center justify-center shadow-[0_0_30px_rgba(168,127,251,0.6)] transform scale-75 group-hover:scale-100 transition-transform duration-300">
            {isReadingMaterial ? (
              <BookOpen size={24} className="text-white" />
            ) : (
              <Play size={24} className="text-white fill-white ml-1" />
            )}
          </div>
        </div>

        {/* Watchlist Toggle Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWatchlist(item); }}
          className={`absolute top-2 right-2 w-7 h-7 rounded backdrop-blur-md flex items-center justify-center transition-all z-10 ${
            inWatchlist ? 'bg-primary text-white' : 'bg-black/50 text-white hover:bg-primary/80 opacity-0 group-hover:opacity-100'
          }`}
        >
          <Bookmark size={14} className={inWatchlist ? 'fill-white' : ''} />
        </button>
      </div>

      <h3 className="text-white font-black italic text-sm truncate mb-1.5 group-hover:text-primary transition-colors uppercase px-1">
        {item.title}
      </h3>
      <div className="flex items-center gap-2 text-[10px] font-bold px-1">
        <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300">{item.year}</span>
        <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
        <span className="text-primary truncate">{item.season && item.season !== 'Unknown Season' ? `${item.season} • ` : ''}{item.eps}</span>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="w-[160px] md:w-[220px] shrink-0 flex flex-col animate-pulse">
    <div className="aspect-[2/3] rounded-2xl bg-surface-light mb-3" />
    <div className="h-5 bg-surface-light rounded w-3/4 mb-2" />
    <div className="h-4 bg-surface-light rounded w-1/2" />
  </div>
);

const AnimeSection = ({ title, icon: Icon, data, onItemClick, onToggleWatchlist, watchlist, loading }: any) => {
  return (
    <section className="py-10 px-6 md:px-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        </div>
        <button className="text-text-muted text-sm font-bold hover:text-primary transition-colors cursor-pointer flex items-center gap-1 bg-surface-light px-4 py-2 rounded-full">
          SEE ALL <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="flex overflow-x-auto gap-4 md:gap-6 pb-8 hide-scrollbar snap-x">
        {loading ? (
          Array(10).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          data?.map((item: any, index: number) => (
            <div key={item.uniqueId || `section-${item.id}-${index}`} className="snap-start">
              <AnimeCard 
                item={item} 
                onClick={() => onItemClick(item)} 
                onToggleWatchlist={onToggleWatchlist}
                inWatchlist={watchlist.some((w: any) => w.id === item.id)}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
};

const AnimeGrid = ({ title, data, onItemClick, onToggleWatchlist, watchlist }: any) => {
  const [displayCount, setDisplayCount] = useState(24);

  useEffect(() => {
    setDisplayCount(24);
  }, [data]);

  if (!data || data.length === 0) return null;

  const displayedData = data.slice(0, displayCount);
  const hasMore = displayCount < data.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 24);
  };

  return (
    <section className="py-10 px-6 md:px-12">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-6 bg-primary rounded-full" />
        <h2 className="text-xl md:text-2xl font-bold text-white">{title} <span className="text-primary text-lg font-normal ml-2">({data.length}+)</span></h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
        {displayedData.map((item: any, index: number) => (
          <AnimeCard 
            key={item.uniqueId || `grid-${item.id}-${index}`} 
            item={item} 
            onClick={() => onItemClick(item)} 
            onToggleWatchlist={onToggleWatchlist}
            inWatchlist={watchlist.some((w: any) => w.id === item.id)}
          />
        ))}
      </div>

      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button 
            onClick={handleLoadMore}
            className="bg-surface-light hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-2"
          >
            LOAD MORE
          </button>
        </div>
      )}
    </section>
  );
};

const ItemDetailsModal = ({ item, onClose, onGenreClick, onToggleWatchlist, inWatchlist }: any) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([
    { id: 1, user: "OtakuKing99", text: "This is an absolute masterpiece! The animation and story are top tier.", time: "2 hours ago", likes: 142 },
    { id: 2, user: "AnimeFanatic", text: "Can't wait for the next episode. The character development is insane.", time: "5 hours ago", likes: 89 },
    { id: 3, user: "WeebMaster", text: "The pacing in the middle was a bit slow, but the payoff was worth it.", time: "1 day ago", likes: 45 },
  ]);

  const isReadingMaterial = item?.type === 'Manga' || item?.type === 'Light Novel' || item?.type === 'Novel' || item?.type === 'One-shot' || item?.type === 'Doujinshi' || item?.type === 'Manhwa' || item?.type === 'Manhua';

  const handleAddComment = () => {
    if (newComment.trim() === "") return;
    setComments([{ id: Date.now(), user: "GuestUser", text: newComment, time: "Just now", likes: 0 }, ...comments]);
    setNewComment("");
  };

  return (
    <AnimatePresence>
      {item && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#0a0a0a] z-[150] overflow-y-auto custom-scrollbar" 
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-12 pt-24 pb-32 relative">
          {/* Back Button */}
          <button onClick={onClose} className="absolute top-8 left-6 md:left-12 text-white hover:text-primary transition-colors cursor-pointer z-50 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm border border-white/10">
            <ChevronLeft size={18} /> BACK
          </button>

          {/* Top Section */}
          <div className="flex flex-col md:flex-row gap-12 mt-8">
            {/* Left Image */}
            <div className="w-full max-w-[320px] shrink-0 mx-auto md:mx-0">
              <div className="aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            {/* Right Info */}
            <div className="flex flex-col justify-center flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#9b51e0]/20 text-[#9b51e0] px-3 py-1 rounded text-xs font-bold uppercase tracking-wider border border-[#9b51e0]/30">{item.type}</span>
                <span className="text-gray-400 text-sm font-bold">{item.year}</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black italic text-[#9b51e0] uppercase leading-tight mb-6 drop-shadow-lg">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="flex items-center gap-2 bg-black/50 border border-white/10 px-4 py-2 rounded-xl">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-black text-lg">{item.score}</span>
                </div>
                
                {item.genres.map((tag: string, i: number) => (
                  <button 
                    key={i} 
                    onClick={() => { onClose(); onGenreClick(tag); }}
                    className="bg-black/50 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 hover:bg-[#9b51e0] hover:text-white hover:border-[#9b51e0] transition-all cursor-pointer uppercase tracking-wider"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <button className="bg-[#9b51e0] hover:bg-[#8a40c9] text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-3 transition-all cursor-pointer shadow-[0_0_20px_rgba(155,81,224,0.4)] hover:-translate-y-1">
                  {isReadingMaterial ? <BookOpen size={20} className="fill-white" /> : <Play size={20} className="fill-white" />}
                  {isReadingMaterial ? 'READ NOW' : 'WATCH NOW'}
                </button>
                <button 
                  onClick={() => onToggleWatchlist(item)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all cursor-pointer border ${inWatchlist ? 'bg-[#9b51e0] border-[#9b51e0] text-white' : 'bg-black/50 border-white/10 text-white hover:bg-white/10'}`}
                >
                  {inWatchlist ? <Check size={24} /> : <Plus size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Middle Section: Info Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-16">
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Clock size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Duration</span>
              </div>
              <span className="text-white font-black text-lg">{item.duration}</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Info size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Status</span>
              </div>
              <span className="text-white font-black text-lg">{item.status}</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Calendar size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{isReadingMaterial ? 'Chapters' : 'Episodes'}</span>
              </div>
              <span className="text-white font-black text-lg">{item.eps}</span>
            </div>
            <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Star size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Rating</span>
              </div>
              <span className="text-white font-black text-lg">{item.rating}</span>
            </div>
          </div>

          {/* Bottom Section: Synopsis & Relations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-16">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-black italic text-white mb-6 flex items-center gap-3 uppercase">
                <div className="w-2 h-8 bg-[#9b51e0] rounded-full" />
                Synopsis
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed font-medium">
                {item.synopsis}
              </p>
            </div>
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-black italic text-white mb-6 flex items-center gap-3 uppercase">
                <div className="w-2 h-8 bg-[#9b51e0] rounded-full" />
                Relations
              </h3>
              {/* Mock Relation Card since API doesn't always provide it */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                <span className="text-[#9b51e0] text-xs font-bold uppercase tracking-wider">Studio / Author</span>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-white font-bold truncate">{item.studio}</span>
                  <span className="bg-white/10 text-gray-300 text-[10px] font-bold px-2 py-1 rounded uppercase shrink-0">{item.type}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <h3 className="text-2xl font-black italic text-white mb-8 flex items-center gap-3 uppercase">
              <MessageSquare size={28} className="text-[#9b51e0]" />
              Comments <span className="text-[#9b51e0] text-xl font-normal ml-2">({comments.length})</span>
            </h3>
            
            {/* Add Comment */}
            <div className="flex gap-4 mb-12">
              <div className="w-12 h-12 rounded-full bg-[#9b51e0] flex items-center justify-center text-white font-bold shrink-0 text-xl">
                U
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <textarea 
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#9b51e0] transition-colors resize-none h-28 custom-scrollbar text-lg"
                />
                <div className="flex justify-end">
                  <button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="bg-[#9b51e0] hover:bg-[#8a40c9] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors cursor-pointer uppercase tracking-wider"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-8">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-light shrink-0 flex items-center justify-center text-gray-400 font-bold text-xl">
                    {comment.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-white font-bold text-lg">{comment.user}</span>
                      <span className="text-gray-500 text-sm">{comment.time}</span>
                    </div>
                    <p className="text-gray-300 text-base mb-3">{comment.text}</p>
                    <div className="flex items-center gap-6 text-gray-500">
                      <button className="flex items-center gap-2 hover:text-[#9b51e0] transition-colors text-sm font-bold cursor-pointer">
                        <ThumbsUp size={16} /> {comment.likes}
                      </button>
                      <button className="hover:text-white transition-colors text-sm font-bold cursor-pointer">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

const Footer = () => (
  <footer className="bg-surface border-t border-white/5 py-16 mt-20 relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
    <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
      <div className="flex items-center gap-3">
        <div className="bg-primary p-2 rounded-xl shadow-[0_0_20px_rgba(168,127,251,0.4)]">
          <Zap size={24} className="text-white fill-white" />
        </div>
        <span className="text-3xl font-black italic tracking-wider text-white uppercase">Animevekno</span>
      </div>
      <p className="text-text-muted text-sm text-center md:text-left font-medium">
        © {new Date().getFullYear()} Animevekno. All rights reserved. Data provided by Jikan API.
      </p>
      <div className="flex items-center gap-6">
        <a href="https://www.reddit.com/r/anime/" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-primary transition-colors font-bold tracking-wider text-sm">REDDIT</a>
        <a href="#" className="text-text-muted hover:text-primary transition-colors font-bold tracking-wider text-sm">TWITTER</a>
        <a href="#" className="text-text-muted hover:text-primary transition-colors font-bold tracking-wider text-sm">DISCORD</a>
      </div>
    </div>
  </footer>
);

const SignInModal = ({ isOpen, onClose }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4" 
      >
        {/* Video Background */}
        <div className="absolute inset-0 bg-black">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="w-full h-full object-cover opacity-50"
            src="https://cdn.pixabay.com/video/2020/05/25/40131-424917410_large.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </div>

        <div className="absolute inset-0" onClick={onClose} />

        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="bg-surface/80 backdrop-blur-2xl border border-white/10 rounded-3xl w-full max-w-md p-8 relative flex flex-col items-center shadow-[0_0_50px_rgba(0,0,0,0.5)]" 
          onClick={e => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full">
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-6 mt-2">
            <span className="text-3xl font-black italic tracking-wider text-primary uppercase drop-shadow-[0_0_10px_rgba(168,127,251,0.5)]">AnimeVekno</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm mb-8 text-center">Sign in to continue watching your favorite anime</p>
          
          <div className="w-full space-y-4 mb-6">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="email" placeholder="Email Address" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-colors backdrop-blur-md" />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input type="password" placeholder="Password" className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:border-primary transition-colors backdrop-blur-md" />
            </div>
          </div>
          
          <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors mb-6 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,127,251,0.3)] hover:-translate-y-0.5">
            Sign In <ArrowRight size={18} />
          </button>
          
          <div className="w-full flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1"></div>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">OR CONTINUE WITH</span>
            <div className="h-px bg-white/10 flex-1"></div>
          </div>
          
          <button className="w-full bg-black/50 hover:bg-white/10 border border-white/10 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-3 mb-6 backdrop-blur-md">
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          
          <p className="text-gray-400 text-sm">Don't have an account? <button className="text-primary font-bold hover:underline">Sign Up</button></p>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
};

const Sidebar = ({ isOpen, onClose, activeTab, setActiveTab, onSignInClick, onSettingsClick }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 bg-black/60 z-[140] backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ x: '-100%' }} 
            animate={{ x: 0 }} 
            exit={{ x: '-100%' }} 
            transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
            className="fixed top-0 left-0 h-full w-72 bg-[#050505] border-r border-white/5 z-[150] flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="bg-primary p-1.5 rounded-lg"><Zap size={20} className="text-white fill-white" /></div>
                <span className="text-xl font-black italic tracking-wider text-primary uppercase">AnimeVekno</span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
              {[
                { id: 'HOME', label: 'Home', icon: Home },
                { id: 'MANGA', label: 'Manga', icon: BookOpen },
                { id: 'NOVEL', label: 'Novel', icon: Book },
              ].map(item => (
                <button 
                  key={item.id} 
                  onClick={() => { setActiveTab(item.id); onClose(); }} 
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-colors ${
                    activeTab === item.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <item.icon size={20} /> {item.label}
                </button>
              ))}
              <a href="https://www.reddit.com/r/anime/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <MessageSquare size={20} /> Reddit
              </a>
              <button onClick={() => { setActiveTab('WATCHLIST'); onClose(); }} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-colors ${activeTab === 'WATCHLIST' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                <Bookmark size={20} /> My List
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <List size={20} /> Browse Genres
              </button>
              
              <div className="h-px bg-white/5 my-4 mx-2"></div>
              
              <button onClick={() => { onSettingsClick(); onClose(); }} className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <Settings size={20} /> Settings
              </button>
              <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
                <HelpCircle size={20} /> Help Center
              </button>
            </div>
            
            <div className="p-6 border-t border-white/5">
              <button onClick={() => { onClose(); onSignInClick(); }} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(168,127,251,0.3)]">
                Sign In
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const BottomNav = ({ activeTab, setActiveTab, onGenreClick }: any) => {
  const [showGenres, setShowGenres] = useState(false);
  const genres = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller", "Psychological", "Mecha", "Music", "Isekai", "School", "Magic", "Historical"];

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none flex justify-center pb-0 sm:pb-6 px-0 sm:px-4">
        <div className="bg-surface/95 backdrop-blur-xl border-t sm:border border-white/10 sm:rounded-2xl px-6 py-4 sm:py-3 flex justify-between sm:justify-center items-center gap-2 sm:gap-12 pointer-events-auto shadow-[0_-10px_40px_rgba(0,0,0,0.5)] w-full sm:w-auto">
          <button onClick={() => setActiveTab('HOME')} className={`flex flex-col items-center gap-1.5 transition-colors sm:hover:-translate-y-1 ${activeTab === 'HOME' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
            <Home size={22} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
          </button>
          <button onClick={() => setActiveTab('MANGA')} className={`flex flex-col items-center gap-1.5 transition-colors sm:hover:-translate-y-1 ${activeTab === 'MANGA' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
            <BookOpen size={22} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Manga</span>
          </button>
          <button onClick={() => setActiveTab('NOVEL')} className={`flex flex-col items-center gap-1.5 transition-colors sm:hover:-translate-y-1 ${activeTab === 'NOVEL' ? 'text-primary' : 'text-gray-400 hover:text-white'}`}>
            <Book size={22} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Novel</span>
          </button>
          <button onClick={() => setShowGenres(true)} className={`flex flex-col items-center gap-1.5 transition-colors sm:hover:-translate-y-1 text-gray-400 hover:text-white`}>
            <List size={22} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Genres</span>
          </button>
          <a href="https://www.reddit.com/r/anime/" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1.5 transition-colors sm:hover:-translate-y-1 text-gray-400 hover:text-white">
            <MessageSquare size={22} className="sm:w-5 sm:h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Reddit</span>
          </a>
        </div>
      </div>

      {/* Genres Modal/Sheet */}
      <AnimatePresence>
        {showGenres && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-[60] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setShowGenres(false)}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-surface border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black italic text-white uppercase flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  Browse Genres
                </h3>
                <button onClick={() => setShowGenres(false)} className="text-gray-400 hover:text-primary transition-colors bg-white/5 p-2 rounded-full"><X size={20} /></button>
              </div>
              <div className="flex flex-wrap gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                {genres.map(g => (
                  <button 
                    key={g} 
                    onClick={() => { onGenreClick(g); setShowGenres(false); }}
                    className="bg-surface-light border border-white/10 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer flex-grow sm:flex-grow-0 text-center"
                  >
                    {g.toUpperCase()}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('HOME');
  const [data, setData] = useState({
    animeTop: [],
    animeAiring: [],
    animeUpcoming: [],
    mangaTop: [],
    novelTop: []
  });
  const [loading, setLoading] = useState(true);

  // Watchlist State (Persisted in LocalStorage)
  const [watchlist, setWatchlist] = useState<any[]>(() => {
    const saved = localStorage.getItem('animeWatchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('animeWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const toggleWatchlist = (item: any) => {
    setWatchlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      if (exists) return prev.filter(i => i.id !== item.id);
      return [...prev, item];
    });
  };

  // Modal States
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const fetchJikan = async (endpoint: string, delayMs: number, retries = 3): Promise<any> => {
          await new Promise(resolve => setTimeout(resolve, delayMs));
          try {
            const res = await fetch(`https://api.jikan.moe/v4/${endpoint}`);
            if (res.status === 429) {
              if (retries > 0) return fetchJikan(endpoint, 2000, retries - 1);
              throw new Error('Rate limit exceeded');
            }
            if (!res.ok) throw new Error(`API Error: ${res.status}`);
            const json = await res.json();
            return json.data.map(normalizeData);
          } catch (error) {
            if (retries > 0) return fetchJikan(endpoint, 2000, retries - 1);
            throw error;
          }
        };

        const topAnime = await fetchJikan('top/anime?limit=25', 0);
        const airingAnime = await fetchJikan('seasons/now?limit=25', 1500);
        const upcomingAnime = await fetchJikan('seasons/upcoming?limit=25', 1500);
        const topManga = await fetchJikan('top/manga?limit=25', 1500);
        const topNovel = await fetchJikan('top/manga?type=lightnovel&limit=25', 1500);

        setData({
          animeTop: topAnime,
          animeAiring: airingAnime,
          animeUpcoming: upcomingAnime,
          mangaTop: topManga,
          novelTop: topNovel
        });
      } catch (error) {
        console.error("Failed to fetch from Jikan API, using fallback data.", error);
        setData({
          animeTop: fallbackAnime.map(normalizeData),
          animeAiring: fallbackAnime.map(normalizeData),
          animeUpcoming: fallbackAnime.map(normalizeData),
          mangaTop: fallbackManga.map(normalizeData),
          novelTop: fallbackNovel.map(normalizeData)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const allAnime = multiplyArray(data.animeTop, 100);
  const allManga = multiplyArray(data.mangaTop, 100);
  const allNovel = multiplyArray(data.novelTop, 50);
  const allCombinedData = [...allAnime, ...allManga, ...allNovel, ...data.animeUpcoming];

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : allCombinedData.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 20);

  const genreResults = selectedGenre 
    ? allCombinedData.filter(item => item.genres.includes(selectedGenre)).slice(0, 20)
    : [];

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/30 relative overflow-x-hidden">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onMenuClick={() => setIsMobileMenuOpen(true)}
        onSearchClick={() => setIsSearchOpen(true)}
        onProfileClick={() => setIsProfileOpen(!isProfileOpen)}
      />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-[0_0_20px_rgba(168,127,251,0.4)] flex items-center justify-center z-40 hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Profile Dropdown */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-24 right-6 md:right-12 w-72 bg-surface/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex items-center gap-4 bg-gradient-to-b from-white/5 to-transparent">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(168,127,251,0.5)]">O</div>
              <div>
                <div className="text-white font-bold text-base">Otaku User</div>
                <div className="text-primary text-xs font-bold tracking-wider uppercase">Premium Plan</div>
              </div>
            </div>
            <div className="p-3">
              <button onClick={() => { setActiveTab('WATCHLIST'); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white rounded-xl cursor-pointer transition-colors">
                <Bookmark size={18} /> My Watchlist
              </button>
              <button onClick={() => { setIsSettingsOpen(true); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white rounded-xl cursor-pointer transition-colors">
                <User size={18} /> Account Settings
              </button>
              <div className="h-px bg-white/10 my-2 mx-4" />
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-400/10 rounded-xl cursor-pointer transition-colors">
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Modal (Sidebar) */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onSignInClick={() => setIsSignInOpen(true)} 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInOpen} 
        onClose={() => setIsSignInOpen(false)} 
      />

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/98 z-[100] flex flex-col items-center pt-32 px-6 backdrop-blur-xl overflow-y-auto custom-scrollbar"
          >
            <button onClick={() => setIsSearchOpen(false)} className="absolute top-6 left-6 md:top-8 md:left-8 text-white hover:text-primary transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm border border-white/10">
              <ChevronLeft size={18} /> BACK
            </button>
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-full max-w-4xl relative"
            >
              <Search size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search anime, manga, novels..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-surface/50 border-2 border-white/10 rounded-3xl py-6 pl-20 pr-8 text-2xl font-bold text-white outline-none focus:border-primary focus:bg-surface transition-all shadow-2xl"
              />
            </motion.div>
            
            {searchQuery.trim() !== '' && (
              <div className="w-full max-w-[1600px] mt-12 pb-20">
                <h3 className="text-white font-black italic text-2xl mb-8 uppercase flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-primary rounded-full" />
                  Search Results <span className="text-primary">({searchResults.length})</span>
                </h3>
                {searchResults.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {searchResults.map((item, index) => (
                      <AnimeCard 
                        key={item.uniqueId || `search-${item.id}-${index}`} 
                        item={item} 
                        onClick={() => { setIsSearchOpen(false); setSelectedItem(item); }} 
                        onToggleWatchlist={toggleWatchlist}
                        inWatchlist={watchlist.some(w => w.id === item.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Search size={64} className="text-text-muted mb-4" />
                    <p className="text-xl font-bold text-text-muted">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Genre Recommendations Modal */}
      <AnimatePresence>
        {selectedGenre && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/98 z-[100] flex flex-col items-center pt-24 px-6 backdrop-blur-xl overflow-y-auto custom-scrollbar"
          >
            <button onClick={() => setSelectedGenre(null)} className="absolute top-6 left-6 md:top-8 md:left-8 text-white hover:text-primary transition-colors cursor-pointer bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm border border-white/10">
              <ChevronLeft size={18} /> BACK
            </button>
            <div className="w-full max-w-[1600px] pb-20 mt-8">
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex items-center gap-4 mb-12"
              >
                <div className="w-2 h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(168,127,251,0.5)]" />
                <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase">Recommended: <span className="text-primary">{selectedGenre}</span></h2>
              </motion.div>
              {genreResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                  {genreResults.map((item, index) => (
                    <AnimeCard 
                      key={item.uniqueId || `genre-${item.id}-${index}`} 
                      item={item} 
                      onClick={() => { setSelectedGenre(null); setSelectedItem(item); }} 
                      onToggleWatchlist={toggleWatchlist}
                      inWatchlist={watchlist.some(w => w.id === item.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-center py-12 text-xl font-bold">No recommendations found for this genre.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Details Modal */}
      <ItemDetailsModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onGenreClick={(g: string) => { setSelectedItem(null); setSelectedGenre(g); }} 
        onToggleWatchlist={toggleWatchlist}
        inWatchlist={selectedItem ? watchlist.some(w => w.id === selectedItem.id) : false}
      />
      
      {/* Main Content Area */}
      <div className="pt-0">
        <AnimatePresence mode="wait">
          {activeTab === 'HOME' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="duration-500">
              <Hero items={data.animeTop.length > 0 ? data.animeTop : data.animeAiring} onGenreClick={setSelectedGenre} onDetailsClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
              <div className="max-w-[1600px] mx-auto pb-20">
                <AnimeSection title="Trending Now" icon={TrendingUp} data={data.animeAiring} loading={loading} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
                <AnimeSection title="Upcoming Seasons" icon={Calendar} data={data.animeUpcoming} loading={loading} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
                <AnimeSection title="All-Time Masterpieces" icon={Star} data={data.animeTop} loading={loading} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
                {!loading && <AnimeGrid title="Explore All Anime" data={allAnime} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />}
              </div>
            </motion.div>
          )}

          {activeTab === 'MANGA' && (
            <motion.div key="manga" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="duration-500 relative">
              <div className="absolute top-24 left-6 md:left-12 z-50">
                <button onClick={() => setActiveTab('HOME')} className="flex items-center gap-2 text-white hover:text-primary transition-colors font-bold text-sm bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full cursor-pointer shadow-lg">
                  <ChevronLeft size={18} /> BACK TO HOME
                </button>
              </div>
              <Hero items={data.mangaTop} onGenreClick={setSelectedGenre} onDetailsClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
              <div className="max-w-[1600px] mx-auto pb-20">
                <AnimeSection title="Top Rated Manga" icon={Star} data={data.mangaTop} loading={loading} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
                {!loading && <AnimeGrid title="Explore All Manga" data={allManga} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />}
              </div>
            </motion.div>
          )}

          {activeTab === 'NOVEL' && (
            <motion.div key="novel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="duration-500 relative">
              <div className="absolute top-24 left-6 md:left-12 z-50">
                <button onClick={() => setActiveTab('HOME')} className="flex items-center gap-2 text-white hover:text-primary transition-colors font-bold text-sm bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full cursor-pointer shadow-lg">
                  <ChevronLeft size={18} /> BACK TO HOME
                </button>
              </div>
              <Hero items={data.novelTop} onGenreClick={setSelectedGenre} onDetailsClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
              <div className="max-w-[1600px] mx-auto pb-20">
                <AnimeSection title="Top Light Novels" icon={Star} data={data.novelTop} loading={loading} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />
                {!loading && <AnimeGrid title="Explore All Novels" data={allNovel} onItemClick={setSelectedItem} onToggleWatchlist={toggleWatchlist} watchlist={watchlist} />}
              </div>
            </motion.div>
          )}

          {activeTab === 'WATCHLIST' && (
            <motion.div key="watchlist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen pt-32 max-w-[1600px] mx-auto px-6 md:px-12 pb-20 relative">
              <div className="absolute top-24 left-6 md:left-12 z-50">
                <button onClick={() => setActiveTab('HOME')} className="flex items-center gap-2 text-white hover:text-primary transition-colors font-bold text-sm bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full cursor-pointer shadow-lg">
                  <ChevronLeft size={18} /> BACK TO HOME
                </button>
              </div>
              <div className="flex items-center gap-4 mb-12 mt-8">
                <div className="w-2 h-12 bg-primary rounded-full shadow-[0_0_15px_rgba(168,127,251,0.5)]" />
                <h2 className="text-4xl md:text-5xl font-black italic text-white uppercase">My Watchlist <span className="text-primary text-2xl font-normal ml-2">({watchlist.length})</span></h2>
              </div>
              
              {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
                  {watchlist.map((item: any, index: number) => (
                    <AnimeCard 
                      key={`watchlist-${item.id}-${index}`} 
                      item={item} 
                      onClick={() => setSelectedItem(item)} 
                      onToggleWatchlist={toggleWatchlist}
                      inWatchlist={true}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-surface/30 rounded-3xl border border-white/5">
                  <Bookmark size={80} className="text-white/10 mb-6" />
                  <h3 className="text-2xl font-black italic text-white mb-2">Your Watchlist is Empty</h3>
                  <p className="text-text-muted font-medium mb-8">Start adding your favorite anime, manga, and novels!</p>
                  <button onClick={() => setActiveTab('HOME')} className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(168,127,251,0.3)] hover:-translate-y-1">
                    Explore Now
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onGenreClick={setSelectedGenre} />

      <Footer />
    </div>
  );
}
