/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Masonry from 'react-masonry-css';
// @ts-ignore
const avatarImg = "/assets/images/regenerated_image_1779402488740.jpg";
// @ts-ignore
const wechatQrCode = "/assets/images/wechat_qr_code_1779411325119.png";
// @ts-ignore
const skillImg5 = "/assets/images/regenerated_image_1779820977423.jpg";
// @ts-ignore
const skillImg4 = "/assets/images/regenerated_image_1779820981837.jpg";
// @ts-ignore
const skillsHeroImg = "/assets/images/regenerated_image_1779820983347.jpg";
// @ts-ignore
const grapeCoverImg = "/assets/images/regenerated_image_1779820977423.jpg";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowDown, 
  Menu, 
  Mail, 
  Download,
  ExternalLink,
  Instagram,
  Chrome,
  Play,
  Edit2,
  Save,
  Plus,
  Copy
} from 'lucide-react';
import { get, set } from 'idb-keyval';

// --- Helpers ---
const getGoogleDriveEmbedUrl = (url: string | undefined): string | null => {
  if (!url) return null;
  const s = url.trim();
  if (s.includes('drive.google.com') || s.includes('docs.google.com')) {
    const matchD = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
      return `https://drive.google.com/file/d/${matchD[1]}/preview`;
    }
    const matchId = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      return `https://drive.google.com/file/d/${matchId[1]}/preview`;
    }
  }
  return null;
};

const getGoogleDriveImageUrl = (url: string | undefined): string => {
  if (!url) return "";
  const s = url.trim();
  if (s.includes('drive.google.com') || s.includes('docs.google.com')) {
    const matchD = s.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (matchD && matchD[1]) {
      return `https://drive.google.com/thumbnail?id=${matchD[1]}&sz=w1600`;
    }
    const matchId = s.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (matchId && matchId[1]) {
      return `https://drive.google.com/thumbnail?id=${matchId[1]}&sz=w1600`;
    }
  }
  return s;
};

const getProductionVideoUrl = (url: string | undefined): string => {
  if (!url) return "";
  const s = url.trim();
  if (s.startsWith('/assets/videos/')) {
    const filename = s.substring('/assets/videos/'.length);
    return `https://ghfast.top/https://github.com/lxy33544416-cpu/LiangQianyi/releases/download/v1.0.0/${filename}`;
  }
  return s;
};

const IMAGE_MAPPINGS: Record<string, string> = {
  // Covers
  'huancai_cover.jpg': 'regenerated_image_1779820977423.jpg',
  'pinpai_xushi_cover.png': 'regenerated_image_1779820981837.jpg',
  'wangluo_qushi_cover.jpg': 'regenerated_image_1779820983347.jpg',
  'chuangyi_gongzuoliu_cover.jpg': 'grape_billboard_mockup_1779821815613.png',
  'guangying_zhixi_cover.jpg': 'regenerated_image_1779820977423.jpg',
  'saibo_mengjing_cover.png': 'regenerated_image_1779820981837.jpg',
  'jingmi_xushi_cover.png': 'regenerated_image_1779820983347.jpg',
  'jijian_shiyanshi_cover.png': 'grape_billboard_mockup_1779821815613.png',
  
  // Slide images for projects
  'huan_cai_1.png': 'regenerated_image_1779820977423.jpg',
  'huan_cai_2.png': 'regenerated_image_1779820981837.jpg',
  'huan_cai_3.png': 'regenerated_image_1779820983347.jpg',
  'huan_cai_4.png': 'yunduan_huxi_cover.png',
  'huan_cai_5.png': 'minimalist_symbol_cover.jpg',
  'huan_cai_6.png': 'weidu_zhedie_cover.jpg',
  'weidu_zhedie_1.png': 'weidu_zhedie_cover.jpg',
  'pinpai_xushi_1.png': 'regenerated_image_1779820981837.jpg',
  'pinpai_xushi_2.png': 'regenerated_image_1779820983347.jpg',
  'wangluo_qushi_1.png': 'regenerated_image_1779820983347.jpg',
  'wangluo_qushi_2.png': 'yunduan_huxi_cover.png',
  'wangluo_qushi_3.png': 'minimalist_symbol_cover.jpg',
  'wangluo_qushi_4.png': 'weidu_zhedie_cover.jpg',
  'wangluo_qushi_5.png': 'regenerated_image_1779820977423.jpg',
  'wangluo_qushi_6.png': 'regenerated_image_1779820981837.jpg',
  'chuangyi_gongzuoliu_1.png': 'grape_billboard_mockup_1779821815613.png',
  'yunduan_huxi_1.png': 'yunduan_huxi_cover.png',
  'yunduan_huxi_2.png': 'regenerated_image_1779820977423.jpg',
  'yunduan_huxi_3.png': 'regenerated_image_1779820981837.jpg',
  'guangying_zhixi_1.png': 'regenerated_image_1779820977423.jpg',
  'guangying_zhixi_2.png': 'regenerated_image_1779820983347.jpg',
  'jingmi_xushi_1.png': 'regenerated_image_1779820983347.jpg',
  'jijian_shiyanshi_1.png': 'grape_billboard_mockup_1779821815613.png',
  'saibo_mengjing_1.png': 'regenerated_image_1779820981837.jpg',
  'saibo_mengjing_2.png': 'regenerated_image_1779820983347.jpg',
  'saibo_mengjing_3.png': 'yunduan_huxi_cover.png',
  'saibo_mengjing_4.png': 'minimalist_symbol_cover.jpg',
  'minimalist_symbol_1.png': 'minimalist_symbol_cover.jpg',
  'minimalist_symbol_2.png': 'weidu_zhedie_cover.jpg',
  'minimalist_symbol_3.png': 'regenerated_image_1779820977423.jpg',
  'minimalist_symbol_4.png': 'regenerated_image_1779820981837.jpg',
};

const getProductionImageUrl = (url: string | undefined, projectId?: number): string => {
  if (!url) return "";
  const s = url.trim();
  
  if (s.includes('drive.google.com') || s.includes('docs.google.com')) {
    return getGoogleDriveImageUrl(s);
  }

  if (s.startsWith('/assets/images/') || s.startsWith('assets/images/') || s.includes('/assets/images/')) {
    const filename = s.split('/').pop() || "";
    
    // Check if it's the local avatar or WeChat QR code, which are static local files
    const LOCAL_UI_IMAGES = [
      'regenerated_image_1779402488740.jpg',
      'wechat_qr_code_1779411325119.png'
    ];
    if (LOCAL_UI_IMAGES.includes(filename)) {
      return `/assets/images/${filename}`;
    }

    // Direct proxy to CDN-accelerated Github Release for ALL core project/portfolio images (same as videos!)
    // This allows you to simply upload your project images to the Release and they will load perfectly!
    return `https://ghfast.top/https://github.com/lxy33544416-cpu/LiangQianyi/releases/download/v1.0.0/${filename}`;
  }

  return s;
};

// --- Types ---
interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  cover: string;
  images: string[];
  details: string;
  results?: string;
  link?: string;
  isVideo?: boolean;
  videoPages?: string[]; // 新增：用于存储每一页的视频路径
  hasSound?: boolean;
}

// --- Mock Data ---
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "幻彩呼吸 - 品牌视觉重构",
    category: "广告策划",
    description: "为新锐生活方案品牌打造的视觉体系，强调通透感与生命律动。",
    cover: "/assets/images/huancai_cover.jpg",
    images: [
      "/assets/images/huan_cai_1.png",
      "/assets/images/huan_cai_2.png",
      "/assets/images/huan_cai_3.png",
      "/assets/images/huan_cai_4.png",
      "/assets/images/huan_cai_5.png",
      "/assets/images/huan_cai_6.png"
    ],
    videoPages: [
      "/assets/videos/huan_cai_1.mp4",
      "/assets/videos/huan_cai_2.mp4",
      "/assets/videos/huan_cai_3.mp4",
      "/assets/videos/huan_cai_4.mp4",
      "/assets/videos/huan_cai_5.mp4",
      "/assets/videos/huan_cai_6.mp4"
    ],
    hasSound: true,
    isVideo: true,
    details: "我们利用极简的线条与大面积的留白，配合柔和的渐变莫兰迪色系。该项目旨在社交媒体端塑造一种'轻盈、呼吸、可感知'的高级审美意向。",
    results: "线上曝光量提升150%，品牌搜索指数环比增长40%。"
  },
  {
    id: 2,
    title: "维度折叠 - 活动建模设计",
    category: "空间建模",
    description: "数字化还原实体活动空间，通过高精度渲染重现光影质感。",
    cover: "/assets/images/weidu_zhedie_cover.jpg",
    images: [
      "/assets/images/weidu_zhedie_1.png"
    ],
    videoPages: [
      "/assets/videos/weidu_zhedie_1.mp4"
    ],
    isVideo: true,
    hasSound: true,
    details: "针对大型艺术策展进行的3D建模与预演。每一处光源的折射角度都经过精确调校，确保线下落地效果与设计稿高度一致。"
  },
  {
    id: 3,
    title: "品牌叙事 - 企业宣传册视觉体系",
    category: "品牌全案",
    description: "以品牌内核为线索重构故事，传递企业的战略高度与长期价值。",
    cover: "/assets/images/pinpai_xushi_cover.png",
    images: [
      "/assets/images/pinpai_xushi_1.png",
      "/assets/images/pinpai_xushi_2.png"
    ],
    videoPages: [
      "/assets/videos/pinpai_xushi_1.mp4",
      "/assets/videos/pinpai_xushi_2.mp4"
    ],
    hasSound: true,
    isVideo: true,
    details: "这是一次关于品牌深层逻辑的视觉重组。通过对网格系统、纸张肌理模拟与叙事性排版的极构，我们为企业打造了一套不仅限于纸媒介，而是能贯穿品牌多维触点的视觉索引系统。每一页都在探讨‘留白’与‘信息密度’的黄金平衡。"
  },
  {
    id: 4,
    title: "网络趋势 - 创意AI广告",
    category: "AI广告片",
    description: "利用生成式AI技术，构建一场关于未来城市的超现实迷梦。",
    cover: "/assets/images/wangluo_qushi_cover.jpg",
    images: [
      "/assets/images/wangluo_qushi_1.png",
      "/assets/images/wangluo_qushi_2.png",
      "/assets/images/wangluo_qushi_3.png",
      "/assets/images/wangluo_qushi_4.png",
      "/assets/images/wangluo_qushi_5.png",
      "/assets/images/wangluo_qushi_6.png"
    ],
    videoPages: [
      "/assets/videos/wangluo_qushi_1.mp4",
      "/assets/videos/wangluo_qushi_2.mp4",
      "/assets/videos/wangluo_qushi_3.mp4",
      "/assets/videos/wangluo_qushi_4.mp4",
      "/assets/videos/wangluo_qushi_5.mp4",
      "/assets/videos/wangluo_qushi_6.mp4"
    ],
    hasSound: true,
    details: "深度融合Midjourney、Runway与自主研发训练的LORA模型。影片以意识流的形式展现了人类记忆与数字鸿沟的交织。",
    isVideo: true
  },
  {
    id: 5,
    title: "创意工作流 - 深度美学构建",
    category: "活动执行",
    description: "一场突破维度界限的科技与商业艺术跨界大秀。",
    cover: "/assets/images/chuangyi_gongzuoliu_cover.jpg",
    images: [
      "/assets/images/chuangyi_gongzuoliu_1.png"
    ],
    details: "负责全场活动的统筹与数字化交互执行。利用巨型全屏模组与地屏交互，呈现出时空折叠的视觉奇观。",
    results: "到场率98%，主流行业媒体深度报道50+篇。"
  },
  {
    id: 6,
    title: "云端呼吸 - 高端网页美学系列",
    category: "网页设计",
    description: "从云顶意向出发，为三个不同维度的品牌构建极具通透感的数字交互空间。",
    cover: "/assets/images/yunduan_huxi_cover.png",
    images: [
      "/assets/images/yunduan_huxi_1.png",
      "/assets/images/yunduan_huxi_2.png",
      "/assets/images/yunduan_huxi_3.png"
    ],
    videoPages: [
      "/assets/videos/yunduan_huxi_1.mp4",
      "/assets/videos/yunduan_huxi_2.mp4",
      "/assets/videos/yunduan_huxi_3.mp4"
    ],
    hasSound: true,
    details: "该系列包含三套完整的响应式网页设计方案。1.【GreenHotel】https://rachelchim1996.wixsite.com/greenhotel；2.【即盛】https://lxy33544416.wixsite.com/my-site-2；3.【Maxim】https://lxy33544416.wixsite.com/my-site-1",
    results: "该系列网页设计模版已被多家高端民宿与艺术画廊采纳，平均用户停留时长提升200%。",
    isVideo: true
  },
  {
    id: 7,
    title: "光影之隙 - 海报宣传统筹",
    category: "策划执行",
    description: "将东方韵味与先锋表达完美融合的年度案例。",
    cover: "/assets/images/guangying_zhixi_cover.jpg",
    images: [
      "/assets/images/guangying_zhixi_1.png",
      "/assets/images/guangying_zhixi_2.png"
    ],
    videoPages: [
      "/assets/videos/guangying_zhixi_1.mp4",
      "/assets/videos/guangying_zhixi_2.mp4"
    ],
    hasSound: true,
    isVideo: true,
    details: "主导了线上社交媒体的病毒式传播策略。项目成功将小众非遗元素转化为具有当代感的时尚社交货币。"
  },
  {
    id: 11,
    title: "赛博梦境 - 创意AI影片",
    category: "核心方法论",
    description: "全链路数字美学工作流：从灵感到交付的极致追求。",
    cover: "/assets/images/saibo_mengjing_cover.png",
    images: [
      "/assets/images/saibo_mengjing_1.png",
      "/assets/images/saibo_mengjing_2.png",
      "/assets/images/saibo_mengjing_3.png",
      "/assets/images/saibo_mengjing_4.png"
    ],
    videoPages: [
      "/assets/videos/saibo_mengjing_1.mp4",
      "/assets/videos/saibo_mengjing_2.mp4",
      "",
      ""
    ],
    hasSound: true,
    isVideo: true,
    details: "我的创意流程遵循四个严苛阶段：\n01灵感触发：构建跨行业情绪板，确保品牌基因的独特性。\n02数字化预演：利用3D建模与AI辅助对构图进行微克级的校对。\n03负空间设计：在每一个像素点寻找呼吸感，拒绝视觉溢出。\n04跨平台闭环：确保从巨幕、网页到移动端的调性绝对统一。"
  },
  {
    id: 8,
    title: "静谧叙事 - 个人摄影展",
    category: "影像艺术",
    description: "捕捉那些不被察觉的瞬间，让沉默也拥有声音。",
    cover: "/assets/images/jingmi_xushi_cover.png",
    images: [
      "/assets/images/jingmi_xushi_1.png"
    ],
    videoPages: ["/assets/videos/jingmi_xushi_1.mp4"],
    isVideo: true,
    hasSound: true,
    details: "场景搭建与后期修图。这一系列影像是对光线在不同透明度载体下折射与散射的长期观察记录。"
  },
  {
    id: 9,
    title: "极简实验室 - 动态交互海报",
    category: "数字内容",
    description: "用代码与粒子效果重定义平面设计的静态边界。",
    cover: "/assets/images/jijian_shiyanshi_cover.png",
    images: [
      "/assets/images/jijian_shiyanshi_1.png"
    ],
    details: "通过算法生成的动态纹理，探讨人类情绪在虚拟空间中的投射。"
  },
  {
    id: 10,
    title: "极简符号 - 品牌Logo设计",
    category: "品牌标识",
    description: "去繁就简，用一个符号承载整个品牌的文化基因。",
    cover: "/assets/images/minimalist_symbol_cover.jpg",
    images: [
      "/assets/images/minimalist_symbol_1.png",
      "/assets/images/minimalist_symbol_2.png",
      "/assets/images/minimalist_symbol_3.png",
      "/assets/images/minimalist_symbol_4.png",
      "/assets/images/minimalist_symbol_5.jpg",
      "/assets/images/minimalist_symbol_6.jpg"
    ],
    videoPages: [
      "/assets/videos/minimalist_symbol_1.mp4",
      "/assets/videos/minimalist_symbol_2.mp4",
      "/assets/videos/minimalist_symbol_3.mp4",
      "/assets/videos/minimalist_symbol_4.mp4",
      "",
      ""
    ],
    isVideo: true,
    details: "拒绝冗余的修饰，回归几何美学。通过极致的负空间运用，使标志在微缩与巨幕尺寸下均保持极高的识别度。"
  }
];

// --- Components ---

interface VideoPlayerProps {
  src: string;
  hasSound: boolean;
  onReplay: (e: React.MouseEvent) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
}

const VideoPlayer = ({ src, hasSound, onReplay, videoRef }: VideoPlayerProps) => {
  const [loading, setLoading] = useState(true);

  // When src changes, force loading state to true immediately during render to avoid flickers
  const prevSrc = useRef(src);
  if (prevSrc.current !== src) {
    prevSrc.current = src;
    setLoading(true);
  }

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
      {/* Background ambient video */}
      <video 
        key={`bg-ambient-${src}`}
        src={src}
        className="absolute inset-0 w-full h-full object-cover opacity-25 blur-3xl scale-110 pointer-events-none select-none"
        autoPlay 
        muted 
        loop 
        playsInline
      />
      {/* Main interactive video */}
      <video 
        ref={videoRef}
        key={src}
        src={src}
        className="relative z-10 w-full h-full object-contain"
        autoPlay 
        muted={!hasSound} 
        loop 
        playsInline
        onLoadStart={() => setLoading(true)}
        onWaiting={() => setLoading(true)}
        onPlaying={() => setLoading(false)}
        onCanPlay={() => setLoading(false)}
        onLoadedData={() => setLoading(false)}
      />
      
      {/* Precise loading indicator overlay to prevent black screens */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950/85 backdrop-blur-xs z-30 transition-all pointer-events-none">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-white/10 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-400 animate-spin" />
          </div>
          <span className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/60 font-sans font-medium">
            视频载入中 · Loading Aesthetic Media...
          </span>
        </div>
      )}

      {/* Play/Replay hover overlays */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-opacity duration-300 z-20 animate-fade-in">
        <button 
          onClick={onReplay}
          className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl transition-all hover:scale-110 hover:bg-white/20 active:scale-95 cursor-pointer"
        >
          <Play size={32} fill="currentColor" className="ml-1 mb-1" />
          <span className="text-[9px] font-bold tracking-widest uppercase">重播 · Replay</span>
        </button>
      </div>
    </div>
  );
};

const Navbar = ({ 
  onToggleEdit, 
  isEditMode, 
  isEditAllowed, 
  onAvatarClick 
}: { 
  onToggleEdit?: () => void; 
  isEditMode?: boolean; 
  isEditAllowed?: boolean; 
  onAvatarClick?: () => void; 
}) => (
  <nav className="fixed top-0 left-0 w-full z-50 px-8 py-4 flex justify-between items-center bg-white/80 backdrop-blur-2xl border-b border-stone-200/50 shadow-sm">
    <div className="flex items-center gap-4">
      <div 
        onClick={onAvatarClick}
        title={isEditAllowed ? "双击或点击此头像进入/退出编辑模式" : "梁倩怡的作品集"}
        className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden border-2 border-purple-400 cursor-pointer hover:scale-105 active:scale-95 transition-transform flex items-center justify-center shadow-md relative"
      >
        <img src={avatarImg} alt="头像" className="w-full h-full object-cover" />
        {isEditMode && (
          <span className="absolute inset-0 bg-purple-500/20 flex items-center justify-center text-[10px] text-white font-bold uppercase tracking-wider">
            Edit
          </span>
        )}
      </div>
      <div>
        <span className="text-serif text-lg font-medium tracking-widest text-stone-900 block leading-none">梁倩怡</span>
        <span className="text-[9px] uppercase tracking-widest text-stone-400 font-bold font-mono">Creative Portfolio</span>
      </div>
    </div>
    <div className="hidden md:flex gap-12 text-[12px] tracking-[0.3em] font-medium text-stone-500 uppercase">
      <a href="#home" className="hover:text-purple-600 transition-colors">首页</a>
      <a href="#about" className="hover:text-purple-600 transition-colors">关于我</a>
      <a href="#portfolio" className="hover:text-purple-600 transition-colors">作品集</a>
      <a href="#skills" className="hover:text-purple-600 transition-colors">技能</a>
      <a href="#contact" className="hover:text-purple-600 transition-colors">联系我</a>
    </div>
    <div className="flex items-center gap-4">
      <button className="md:hidden p-2 text-stone-800">
        <Menu size={24} />
      </button>
    </div>
  </nav>
);

const Hero = () => {
  const [heroVideoUrl, setHeroVideoUrl] = useState<string>("");
  const [heroLoading, setHeroLoading] = useState(true);

  useEffect(() => {
    const loadHeroVideo = async () => {
      const savedBlob = await get('hero-video');
      if (savedBlob instanceof Blob) {
        setHeroVideoUrl(URL.createObjectURL(savedBlob));
      } else {
        setHeroVideoUrl("https://ghfast.top/https://github.com/lxy33544416-cpu/LiangQianyi/releases/download/v1.0.0/hero.mp4");
      }
    };
    loadHeroVideo();
  }, []);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setHeroVideoUrl(url);
      await set('hero-video', file);
    }
  };

  return (
    <section id="home" className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Animated Floating Glows */}
      <motion.div 
        animate={{ 
          x: [0, 50, -30, 0], 
          y: [0, -40, 20, 0],
          scale: [1, 1.1, 0.9, 1] 
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="glow-purple top-20 left-20 opacity-60 mix-blend-screen" 
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 40, 0], 
          y: [0, 50, -30, 0],
          scale: [1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="glow-blue bottom-20 right-20 opacity-50 mix-blend-screen" 
      />
      <div className="glow-silver top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full"
      >
        <motion.h2 
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-[10px] md:text-xs uppercase tracking-[1em] text-stone-400 mb-10 font-medium italic font-serif"
        >
          Creative · Vision · Digital Soul
        </motion.h2>
        
        <div className="relative inline-block w-full group mb-12">
          <label 
            htmlFor="hero-video-upload"
            className="block w-full max-w-6xl mx-auto aspect-[21/6] md:aspect-[21/5] max-h-[180px] md:max-h-[270px] overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center relative z-10 cursor-pointer hover:bg-white/10 transition-all group/slot"
          >
            <input 
              type="file" 
              id="hero-video-upload" 
              className="hidden" 
              accept="video/*"
              onChange={handleVideoUpload}
            />
            {heroVideoUrl ? (
              <div className="relative w-full h-full min-h-[120px] md:min-h-[220px]">
                <video 
                  key={heroVideoUrl}
                  src={heroVideoUrl}
                  className="w-full h-full object-contain"
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  onLoadStart={() => setHeroLoading(true)}
                  onWaiting={() => setHeroLoading(true)}
                  onPlaying={() => setHeroLoading(false)}
                  onCanPlay={() => setHeroLoading(false)}
                  onLoadedData={() => setHeroLoading(false)}
                />
                {heroLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-950/40 backdrop-blur-xs z-20 pointer-events-none rounded-xl">
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border border-white/10" />
                      <div className="absolute inset-0 rounded-full border border-transparent border-t-purple-400 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                <Play className="w-8 h-8 text-stone-500 opacity-20 group-hover/slot:opacity-60 transition-opacity" />
                <span className="text-[10px] tracking-[0.8em] text-stone-500 uppercase opacity-30 group-hover/slot:opacity-80 transition-opacity">点击上传视频动画</span>
              </div>
            )}
          </label>
          
          {/* Dynamic Shadow/Glow under video slot */}
          <motion.div 
             animate={{ 
               opacity: [0.1, 0.25, 0.1],
               scale: [0.85, 1.1, 0.85]
             }}
             transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[60%] h-12 bg-purple-400/20 blur-3xl -z-10 rounded-full"
          />
        </div>

        <p className="max-w-2xl mx-auto text-stone-500 text-base md:text-xl leading-relaxed font-light font-serif italic">
          追求极致的透明度与生命律动。<br className="hidden md:block" />
          在梦幻的光影叙事中，重定义数字化表达的感官维度。
        </p>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className="absolute bottom-16 cursor-pointer"
        onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.5em] text-stone-400 font-bold font-serif opacity-60">滚动探索 · Explore</span>
          <div className="w-px h-12 bg-gradient-to-b from-stone-200 via-stone-200 to-transparent shadow-[0_0_10px_white]" />
        </div>
      </motion.div>
    </section>
  );
};

const SKILLS_DATA = [
  {
    num: "01",
    title: "品牌策略与视觉策划",
    image: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?auto=format&fit=crop&q=80&w=600",
    desc: [
      "深耕品牌塑造领域，专注于将抽象的商业策略转化为极具感官冲击力的视觉语言。我始终坚信“美学即效率”，在信息爆炸的数字化时代，通过通透且具有呼吸感的排版系统，帮助品牌建立与用户之间的深度情感连接。",
      "核心服务包括完整的品牌身份系统（VI）构建、社交媒体视觉闭环策划以及跨平台的调性统一管理。我擅长运用极致的负空间处理与具有叙事性的网格布局，确保品牌在多样化的数字触点中依然保持高度的辨识度与高级感。"
    ],
    tags: ["市场洞察", "差异化视觉战略", "色彩心理建模", "数字排版"]
  },
  {
    num: "02",
    title: "实体活动导演与3D建模",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=600",
    desc: [
      "在大型发布会、艺术联展及线下商业空间的策划执行中，我开创性地引入了“数字孪生式”的预演工作流。通过Cinema 4D与Redshift/Octane的高精度渲染，实现在物理世界搭建之前，对光影走向、材质折射与人流动线进行精准的虚拟校读。",
      "特别关注“出片率”的极限设计，即在物理空间中预埋最适宜镜头记录的互动点。这种数字化辅助的审美判别能力，不仅能确保线下活动的震撼感，更能通过每一张现场图的完美传播，反哺品牌的二次数字流量增长。"
    ],
    tags: ["3D沉浸式建模", "数字舞美执行", "交互装置导演", "材质美学把控"]
  },
  {
    num: "03",
    title: "AI驱动创意内容生产",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600",
    desc: [
      "作为AIGC领域的早期实践者，我已将Midjourney、Stable Diffusion与Runway Gen-3深度整合至商业创作的第一线。这不仅大幅提升了创意概念的迭代速度，更为品牌提供了过去无法企及的超现实视觉方案。",
      "我致力于通过私有化模型训练（LoRA），让AI产出的素材能够精准对齐品牌的颗粒度调性，从而告别“AI感”明显的通用模版。在保障效率的同时，用人工的审美对AI进行二次编排，创造出具有灵魂、有呼吸感的数字艺术资产。"
    ],
    tags: ["AI氛围图迭代", "数字资产创作", "动态提示词工程", "降本增效"]
  },
  {
    num: "04",
    title: "社媒趋势与情感化传播",
    image: skillImg4,
    desc: [
      "通过对全球流行文化与数字审美的敏锐洞察，为品牌制定具备‘自发传播性’的社媒增长策略。不仅关注视觉的‘美’，更深入研究光影、色彩与负空间如何影响用户的潜意识决策。",
      "利用基于情感建模的创意工作流，我们将品牌信息包装成易于消化的视觉‘钩子’，在碎片化的注意力市场中锁定精准受众，让每一次点击都成为品牌忠诚度的点滴沉淀。"
    ],
    tags: ["趋势抓取", "情感化设计", "病毒化叙事", "社交矩阵"]
  },
  {
    num: "05",
    title: "全球化美学咨询与顾问",
    image: skillImg5,
    desc: [
      "打破地域美学的次元壁，为追求出海的企业提供具备国际通达度的审美指导。我深度调研各目标市场的文化敏感度与流行色彩体系，确保品牌的数字化转型直接对标国际顶尖奢侈品牌的美学高度。",
      "整合全球优质创意资源，从策展思维到全渠道视觉统筹，助力品牌在全球舞台上以轻盈、优雅的姿态发声，重拾品牌主权，构建极具通透感与议价权的品牌溢价空间。"
    ],
    tags: ["跨文化美学", "出海调性把控", "定制化顾问", "品牌主权重构"]
  }
];

export default function App() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [isSyncPanelOpen, setIsSyncPanelOpen] = useState(false);
  const [syncTab, setSyncTab] = useState<'export' | 'import'>('export');
  const [importJsonText, setImportJsonText] = useState("");
  const [projectVideoOverrides, setProjectVideoOverrides] = useState<Record<number, string[]>>({});
  const [projectImageOverrides, setProjectImageOverrides] = useState<Record<number, string[]>>({});
  const [projectCoverOverrides, setProjectCoverOverrides] = useState<Record<number, string>>({});
  const [projectTextOverrides, setProjectTextOverrides] = useState<Record<number, { title?: string; description?: string; details?: string; category?: string; results?: string }>>({});
  const [skillsOverrides, setSkillsOverrides] = useState<Record<string, { title: string; desc: string[]; tags: string[] }>>({});
  const [editingSkillNum, setEditingSkillNum] = useState<string | null>(null);
  const selectedProject = PROJECTS.find(p => p.id === selectedId);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const modalVideoRef = useRef<HTMLVideoElement>(null);


  useEffect(() => {
    // 检查URL中的 ?edit 参数或 localStorage 是否已授权编辑
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true' || localStorage.getItem('allow-edit') === 'true') {
      setIsEditAllowed(true);
      setIsEditMode(true);
    } else {
      setIsEditAllowed(false);
      setIsEditMode(false);
    }
  }, []);

  const handleAvatarClick = () => {
    setIsEditMode(prev => !prev);
  };

  useEffect(() => {
    const loadProjectVideos = async () => {
      const saved = await get('project-videos-v2'); // 使用新版本的 key 以防格式不统一
      if (saved && typeof saved === 'object') {
        const overrides: Record<number, string[]> = {};
        for (const [projectId, blobs] of Object.entries(saved)) {
          if (Array.isArray(blobs)) {
            overrides[Number(projectId)] = blobs
              .map(blob => {
                if (blob instanceof Blob) {
                  return URL.createObjectURL(blob);
                } else if (typeof blob === 'string' && !blob.startsWith("blob:")) {
                  return blob;
                }
                return "";
              })
              .filter(val => val !== "");
          }
        }
        setProjectVideoOverrides(overrides);
      }
    };
    const loadProjectImages = async () => {
      const saved = await get('project-images-v2');
      if (saved && typeof saved === 'object') {
        const overrides: Record<number, string[]> = {};
        for (const [projectId, blobs] of Object.entries(saved)) {
          if (Array.isArray(blobs)) {
            overrides[Number(projectId)] = blobs
              .map(blob => {
                if (blob instanceof Blob) {
                  return URL.createObjectURL(blob);
                } else if (typeof blob === 'string' && !blob.startsWith("blob:")) {
                  return blob;
                }
                return "";
              })
              .filter(val => val !== "");
          }
        }
        setProjectImageOverrides(overrides);
      }
    };
    const loadProjectCovers = async () => {
      const saved = await get('project-covers-v1');
      if (saved && typeof saved === 'object') {
        const overrides: Record<number, string> = {};
        for (const [projectId, blob] of Object.entries(saved)) {
          if (blob instanceof Blob) {
            overrides[Number(projectId)] = URL.createObjectURL(blob);
          } else if (typeof blob === 'string' && !blob.startsWith("blob:")) {
            overrides[Number(projectId)] = blob;
          }
        }
        setProjectCoverOverrides(overrides);
      }
    };
    const loadSkillsOverrides = async () => {
      const saved = await get('skills-overrides-v1');
      if (saved && typeof saved === 'object') {
        setSkillsOverrides(saved);
      }
    };
    const loadProjectTexts = async () => {
      const saved = await get('project-texts-v1');
      if (saved && typeof saved === 'object') {
        setProjectTextOverrides(saved);
      }
    };
    loadProjectVideos();
    loadProjectImages();
    loadProjectCovers();
    loadSkillsOverrides();
    loadProjectTexts();
  }, []);

  const handleUpdateText = async (projectId: number, field: string, value: string) => {
    setProjectTextOverrides(prev => {
      const current = prev[projectId] || {};
      const next = { ...prev, [projectId]: { ...current, [field]: value } };
      set('project-texts-v1', next);
      return next;
    });
  };

  const handleProjectCoverUpload = async (projectId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProjectCoverOverrides(prev => ({
        ...prev,
        [projectId]: url
      }));

      const currentFullStore = await get('project-covers-blobs') || {};
      currentFullStore[projectId] = file;
      await set('project-covers-blobs', currentFullStore);
      await set('project-covers-v1', currentFullStore);
    }
  };

  const handleImportConfig = async (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      
      if (parsed.projectTexts && typeof parsed.projectTexts === 'object') {
        const nextTexts = { ...projectTextOverrides, ...parsed.projectTexts };
        setProjectTextOverrides(nextTexts);
        await set('project-texts-v1', nextTexts);
      }

      if (parsed.skills && typeof parsed.skills === 'object') {
        const nextSkills = { ...skillsOverrides, ...parsed.skills };
        setSkillsOverrides(nextSkills);
        await set('skills-overrides-v1', nextSkills);
      }

      if (parsed.projectCoverLinks && typeof parsed.projectCoverLinks === 'object') {
        const nextCovers = { ...projectCoverOverrides };
        for (const [id, url] of Object.entries(parsed.projectCoverLinks)) {
          if (url && url !== "[Blob File - Please upload directly]") {
            nextCovers[Number(id)] = url as string;
          }
        }
        setProjectCoverOverrides(nextCovers);
        await set('project-covers-v1', nextCovers);
      }

      if (parsed.projectVideoLinks && typeof parsed.projectVideoLinks === 'object') {
        const nextVideos = { ...projectVideoOverrides };
        for (const [id, urls] of Object.entries(parsed.projectVideoLinks)) {
          if (Array.isArray(urls)) {
            nextVideos[Number(id)] = urls.map((u, i) => {
              if (u === "[Blob File - Please upload directly]") {
                return projectVideoOverrides[Number(id)]?.[i] || "";
              }
              return u as string;
            });
          }
        }
        setProjectVideoOverrides(nextVideos);
        await set('project-videos-v2', nextVideos);
      }

      if (parsed.projectImageLinks && typeof parsed.projectImageLinks === 'object') {
        const nextImages = { ...projectImageOverrides };
        for (const [id, urls] of Object.entries(parsed.projectImageLinks)) {
          if (Array.isArray(urls)) {
            nextImages[Number(id)] = urls.map((u, i) => {
              if (u === "[Blob File - Please upload directly]") {
                return projectImageOverrides[Number(id)]?.[i] || "";
              }
              return u as string;
            });
          }
        }
        setProjectImageOverrides(nextImages);
        await set('project-images-v2', nextImages);
      }

      alert("🎉 导入成功！已成功载入该配置，本地数据库已合并同步。");
    } catch (err) {
      alert("❌ 导入失败，配置格式有误或非法的 JSON 数据。");
    }
  };

  const handleSaveSkill = async (num: string, updated: { title: string; desc: string[]; tags: string[] }) => {
    const next = { ...skillsOverrides, [num]: updated };
    setSkillsOverrides(next);
    await set('skills-overrides-v1', next);
    setEditingSkillNum(null);
  };

  const handleReplay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      modalVideoRef.current.play();
    }
  };

  const handleProjectVideoUpload = async (projectId: number, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      
      // 更新状态
      setProjectVideoOverrides(prev => {
        const current = prev[projectId] || PROJECTS.find(p => p.id === projectId)?.videoPages || [];
        const next = [...current];
        next[index] = url;
        const newOverrides = { ...prev, [projectId]: next };
        
        // 异步保存到 IndexedDB
        // 注意：为了持久化，我们需要存储 Blob 本身，而不是 URL
        // 我们需要重新从当前状态中提取所有的 Blob 来保存
        // 这里的逻辑稍微复杂一点，因为 projectVideoOverrides 存的是 URL
        // 所以我们维护一个单独的 Blob store 比较好
        return newOverrides;
      });

      // 直接保存该文件的 Blob 到数据库
      const currentFullStore = await get('project-videos-blobs') || {};
      if (!currentFullStore[projectId]) currentFullStore[projectId] = [];
      currentFullStore[projectId][index] = file;
      await set('project-videos-blobs', currentFullStore);

      // 为了匹配上面的 useEffect load，我们也更新一下 project-videos-v2
      await set('project-videos-v2', currentFullStore);
    }
  };

  const handleProjectImageUpload = async (projectId: number, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      
      setProjectImageOverrides(prev => {
        const current = prev[projectId] || PROJECTS.find(p => p.id === projectId)?.images || [];
        const next = [...current];
        next[index] = url;
        const newOverrides = { ...prev, [projectId]: next };
        return newOverrides;
      });

      const currentFullStore = await get('project-images-blobs') || {};
      if (!currentFullStore[projectId]) currentFullStore[projectId] = [];
      currentFullStore[projectId][index] = file;
      await set('project-images-blobs', currentFullStore);
      await set('project-images-v2', currentFullStore);
    }
  };

  const breakpoints = {
    default: 3,
    1100: 3,
    700: 2,
    500: 1
  };

  const handleNext = useCallback(() => {
    if (!selectedId) return;
    const currentIndex = PROJECTS.findIndex(p => p.id === selectedId);
    const nextIndex = (currentIndex + 1) % PROJECTS.length;
    setSelectedId(PROJECTS[nextIndex].id);
    setCurrentImgIndex(0);
  }, [selectedId]);

  const handlePrev = useCallback(() => {
    if (!selectedId) return;
    const currentIndex = PROJECTS.findIndex(p => p.id === selectedId);
    const prevIndex = (currentIndex - 1 + PROJECTS.length) % PROJECTS.length;
    setSelectedId(PROJECTS[prevIndex].id);
    setCurrentImgIndex(0);
  }, [selectedId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedId) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, handleNext, handlePrev]);

  const getSyncJson = () => {
    const exportConfig = {
      projectVideoLinks: Object.fromEntries(
        Object.entries(projectVideoOverrides).map(([id, list]) => [
          id,
          (list as string[]).map((url: string) => (url && url.startsWith('blob:') ? "[Blob File - Please upload directly]" : url))
        ])
      ),
      projectImageLinks: Object.fromEntries(
        Object.entries(projectImageOverrides).map(([id, list]) => [
          id,
          (list as string[]).map((url: string) => (url && url.startsWith('blob:') ? "[Blob File - Please upload directly]" : url))
        ])
      ),
      projectCoverLinks: Object.fromEntries(
        Object.entries(projectCoverOverrides).map(([id, url]) => [
          id,
          (url as string) && (url as string).startsWith('blob:') ? "[Blob File - Please upload directly]" : url
        ])
      ),
      projectTexts: projectTextOverrides,
      skills: skillsOverrides
    };
    return JSON.stringify(exportConfig, null, 2);
  };

  return (
    <div className="w-full min-h-screen relative selection:bg-purple-100">
      <div className="dreamy-bg" />
      <Navbar 
        onToggleEdit={() => setIsEditMode(prev => !prev)} 
        isEditMode={isEditMode} 
        isEditAllowed={isEditAllowed}
        onAvatarClick={handleAvatarClick}
      />
      
      <Hero />

      {/* Portfolio Section */}
      <section id="portfolio" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-28 text-center">
          <h3 className="text-serif text-4xl md:text-5xl font-light text-stone-900 tracking-tight">精选作品</h3>
          <p className="font-serif text-stone-400 mt-6 font-light italic tracking-[0.3em] text-[12px] uppercase">Selected Creative Works</p>
        </div>

        <Masonry
          breakpointCols={breakpoints}
          className="masonry-grid"
          columnClassName="masonry-grid_column"
        >
          {PROJECTS.map((project) => {
            if (project.id === 9) {
              return <div key={project.id} className="invisible pointer-events-none select-none" aria-hidden="true" />;
            }
            const projTitle = projectTextOverrides[project.id]?.title || project.title;
            const projCategory = projectTextOverrides[project.id]?.category || project.category;
            const projDescription = projectTextOverrides[project.id]?.description || project.description;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                onClick={() => {
                  setSelectedId(project.id);
                  setCurrentImgIndex(0);
                }}
                className={`group cursor-pointer glass-card overflow-hidden hover:shadow-2xl hover:shadow-purple-200/30 transition-all duration-700 ${project.id === 11 ? 'bg-stone-900 text-white border-stone-800' : ''}`}
              >
                {project.id === 11 ? (
                  <div className="p-10 h-full flex flex-col">
                    <span className="text-[9px] uppercase tracking-[0.5em] text-purple-400 font-bold mb-6 block italic">{projCategory}</span>
                    <h4 className="text-serif text-2xl font-light tracking-tight mb-8 leading-tight italic uppercase">{projTitle}</h4>
                    <div className="space-y-6 text-[13px] text-stone-400 leading-relaxed font-light font-serif italic text-justify">
                      <p className="border-l border-purple-500/30 pl-4 py-1">01 灵感触发：跨行业情绪板构建</p>
                      <p className="border-l border-purple-500/30 pl-4 py-1">02 数字预演：3D建模与AI构图校准</p>
                      <p className="border-l border-purple-500/30 pl-4 py-1">03 负空间设计：寻找图像呼吸感</p>
                      <p className="border-l border-purple-500/30 pl-4 py-1">04 全端交付：视觉调性绝对统一</p>
                    </div>
                    <div className="mt-auto pt-10">
                      <div className="w-12 h-px bg-stone-700 group-hover:w-full transition-all duration-700" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-4 block">View Methodology · 点击探索</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="aspect-auto overflow-hidden relative">
                      <img 
                        src={getProductionImageUrl(projectCoverOverrides[project.id] || projectImageOverrides[project.id]?.[0] || project.cover, project.id)} 
                        alt={projTitle} 
                        className="w-full h-auto object-cover transition-transform duration-[1.5s] group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = "/assets/images/regenerated_image_1779820977423.jpg";
                        }}
                      />
                      {/* 更替封面选项 (已启用编辑模式) */}
                      {isEditMode && (
                        <label 
                          onClick={(e) => e.stopPropagation()} 
                          className="absolute top-4 right-4 z-30 transition-all duration-300 scale-100 hover:scale-105 cursor-pointer"
                        >
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={(e) => handleProjectCoverUpload(project.id, e)} 
                          />
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900/80 hover:bg-neutral-900 text-white border border-white/20 rounded-full backdrop-blur-md shadow-md">
                            <Edit2 size={9} />
                            <span className="text-[9px] font-bold tracking-widest uppercase text-white">更替封面 · Cover</span>
                          </div>
                        </label>
                      )}
                    </div>
                    <div className="p-8">
                      <span className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold mb-3 block italic">{projCategory}</span>
                      <h4 className="text-serif text-xl font-medium text-stone-800 tracking-tight group-hover:text-purple-600 transition-colors uppercase">{projTitle}</h4>
                      <p className="text-xs text-stone-500 mt-3 line-clamp-2 leading-relaxed font-light italic">{projDescription}</p>
                    </div>
                  </>
                )}
              </motion.div>
            );
          })}
        </Masonry>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center glass-card p-20 relative overflow-hidden">
          <div className="glow-purple -top-40 -left-40 opacity-30" />
          <h3 className="text-serif text-stone-400 text-[11px] uppercase tracking-[0.5em] mb-14 font-bold relative z-10 italic">关于我 / About Me</h3>
          <p className="text-serif text-3xl md:text-4xl text-stone-700 font-light leading-snug relative z-10 tracking-tight">
            “在这个像素堆砌的世界里，我依然追求那种能够触及灵魂的通透感。<br />
            好的设计不应是沉重的负担，而应像一阵轻柔的风。”
          </p>
          <div className="mt-20 flex justify-center gap-20 text-sm text-stone-500 relative z-10 font-serif italic">
            <div className="text-center">
              <span className="block text-stone-900 font-light text-4xl mb-2 tabular-nums">5+</span>
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">年实战经验</span>
            </div>
            <div className="text-center">
              <span className="block text-stone-900 font-light text-4xl mb-2 tabular-nums">200+</span>
              <span className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-60">创意方案库</span>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col gap-24 items-center">
          {/* Top: Large Visual Anchor (Now full width row) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
          >
            <div className="rounded-[3rem] overflow-hidden glass-card p-4 shadow-2xl shadow-purple-900/5">
              <div className="relative group overflow-hidden rounded-[2.5rem]">
                <img 
                  src={skillsHeroImg} 
                  alt="Professional Skills" 
                  className="w-full h-[400px] md:h-[600px] object-cover transition-transform duration-[2s] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-16 left-16 text-white">
                  <h4 className="text-serif text-4xl md:text-5xl font-light italic">Liang Qianyi</h4>
                  <p className="text-[12px] uppercase tracking-[0.6em] opacity-80 mt-4 font-bold">Creative Visionary · Aesthetic Strategist</p>
                </div>
              </div>
            </div>
            
            <div className="mt-16 flex justify-center">
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="flex items-center gap-8 text-stone-300"
              >
                <div className="w-24 h-px bg-stone-200" />
                <span className="text-[11px] uppercase tracking-[0.8em] font-bold text-stone-400">往下滚动阅读详细能力 · Professional Narrative</span>
                <div className="w-24 h-px bg-stone-200" />
              </motion.div>
            </div>
          </motion.div>

          {/* Bottom: Detailed Resume Style Content (Full width cards) */}
          <div className="w-full space-y-20">
            <div className="text-center mb-24">
              <span className="text-serif text-[12px] uppercase tracking-[0.8em] text-purple-400 font-bold mb-8 block italic">Expertise & Narrative</span>
              <h2 className="text-serif text-5xl md:text-7xl font-light text-stone-900 tracking-tighter leading-tight italic">
                跨领域创意实践与数字美学构筑
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-12 relative max-w-7xl mx-auto">
               {SKILLS_DATA.map((skill) => {
                 const currentTitle = skillsOverrides[skill.num]?.title ?? skill.title;
                 const currentDesc = skillsOverrides[skill.num]?.desc ?? skill.desc;
                 const currentTags = skillsOverrides[skill.num]?.tags ?? skill.tags;
                 const isCurrentlyEditing = editingSkillNum === skill.num;

                 return (
                   <motion.section 
                     key={skill.num}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, delay: Number(skill.num) * 0.1 }}
                     className="glass-card p-12 md:p-16 relative group flex flex-col border border-white/20 hover:border-white/50 transition-all hover:shadow-2xl hover:shadow-purple-100/10"
                   >
                     <div className="absolute -top-10 -right-10 w-60 h-60 bg-purple-100/10 blur-[80px] -z-10 group-hover:scale-150 transition-transform duration-1000" />
                     
                     <div className="flex flex-col md:flex-row gap-12 items-start relative z-10">
                       <div className="shrink-0 flex items-center md:flex-col gap-4">
                         <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center text-[13px] font-bold italic shadow-xl mb-2">
                           {skill.num}
                         </div>
                         {false && !isCurrentlyEditing && (
                           <button
                             onClick={() => setEditingSkillNum(skill.num)}
                             className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white border border-stone-800 rounded-full transition-all text-[10px] font-bold tracking-widest uppercase shadow-sm cursor-pointer"
                           >
                             <Edit2 size={10} />
                             编辑 · Edit
                           </button>
                         )}
                         <div className="h-px w-full bg-stone-100 hidden md:block mt-2" />
                       </div>
                       
                       <div className="flex-1 pr-0 md:pr-32">
                         {isCurrentlyEditing ? (
                           <div className="space-y-6">
                             <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">卡片标题 · Title</label>
                               <input 
                                 type="text"
                                 className="w-full text-serif text-xl md:text-2xl font-light text-stone-800 bg-white/60 border border-stone-200 rounded-lg p-3 font-serif"
                                 defaultValue={currentTitle}
                                 id={`edit-skill-title-${skill.num}`}
                               />
                             </div>

                             <div className="space-y-4">
                               {currentDesc.map((p, pIdx) => (
                                 <div key={pIdx} className="flex flex-col gap-1">
                                   <label className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">描述段落 {pIdx + 1} · Description Paragraph {pIdx + 1}</label>
                                   <textarea
                                     className="w-full text-[14px] text-stone-600 bg-white/60 border border-stone-200 rounded-lg p-3 min-h-[100px] font-serif italic"
                                     defaultValue={p}
                                     id={`edit-skill-desc-${skill.num}-${pIdx}`}
                                   />
                                 </div>
                                ))}
                             </div>

                             <div className="flex flex-col gap-1">
                               <label className="text-[10px] text-stone-400 font-bold tracking-wider uppercase">标签 (英文逗号分隔) · Tags (comma separated)</label>
                               <input 
                                 type="text"
                                 className="w-full text-xs font-serif text-stone-600 bg-white/60 border border-stone-200 rounded-lg p-3"
                                 defaultValue={currentTags.join(', ')}
                                 id={`edit-skill-tags-${skill.num}`}
                               />
                             </div>

                             <div className="flex gap-4 pt-6 border-t border-stone-100/50">
                               <button
                                 onClick={() => {
                                   const titleInput = document.getElementById(`edit-skill-title-${skill.num}`) as HTMLInputElement;
                                   const tagInput = document.getElementById(`edit-skill-tags-${skill.num}`) as HTMLInputElement;
                                   const updatedDesc = currentDesc.map((_, pIdx) => {
                                     const area = document.getElementById(`edit-skill-desc-${skill.num}-${pIdx}`) as HTMLTextAreaElement;
                                     return area?.value || "";
                                   });
                                   const updatedTags = tagInput?.value.split(',').map(t => t.trim()).filter(Boolean) || [];
                                   handleSaveSkill(skill.num, {
                                     title: titleInput?.value || currentTitle,
                                     desc: updatedDesc,
                                     tags: updatedTags
                                   });
                                 }}
                                 className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg hover:bg-stone-800 text-[11px] font-bold tracking-wider uppercase shadow-md transition-all active:scale-95 cursor-pointer"
                               >
                                 <Save size={12} />
                                 保存 · Save
                                </button>
                               <button
                                 onClick={() => setEditingSkillNum(null)}
                                 className="flex items-center gap-2 px-5 py-2.5 border border-stone-200 text-stone-500 rounded-lg hover:bg-stone-50 text-[11px] font-bold tracking-wider uppercase transition-all cursor-pointer"
                               >
                                 <X size={12} />
                                 取消 · Cancel
                               </button>
                             </div>
                           </div>
                         ) : (
                           <>
                             <h4 className="text-serif text-3xl md:text-4xl font-light text-stone-800 tracking-tight leading-tight uppercase mb-10 italic">
                               {currentTitle}
                             </h4>
                             
                             <div className="space-y-8 text-[16px] md:text-[17px] text-stone-500 leading-relaxed font-light font-serif italic text-justify">
                               {currentDesc.map((p, idx) => (
                                 <p key={idx}>{p}</p>
                               ))}
                             </div>
          
                             <div className="flex flex-wrap gap-3 pt-12 mt-10 border-t border-stone-50">
                               {currentTags.map(t => (
                                 <span key={t} className="text-[10px] px-4 py-1.5 bg-white/40 border border-white/60 text-stone-400 rounded-xl shadow-sm font-serif italic hover:bg-white transition-colors">
                                   # {t}
                                 </span>
                               ))}
                             </div>
                           </>
                         )}
                       </div>
                     </div>

                     {/* Floating Spherical Image */}
                     <motion.div 
                       animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                       transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                       className="absolute bottom-8 right-8 md:bottom-12 md:right-12 w-32 h-32 md:w-32 md:h-32 rounded-full overflow-hidden shadow-2xl border-4 border-white/50 z-20 group-hover:scale-110 transition-transform duration-700"
                     >
                       <img 
                         src={skill.image} 
                         alt={currentTitle} 
                         className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                       />
                       <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/20 to-transparent pointer-events-none" />
                     </motion.div>
                   </motion.section>
                 );
               })}
            </div>
          </div>
        </div>
      </section>
      <section id="contact" className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-20 items-center justify-between">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-4xl md:text-5xl font-bold text-stone-900 mb-8 tracking-tighter">期待与您共同创造<br />下一个通透之美。</h3>
            <p className="text-stone-500 mb-12 max-w-md italic font-light leading-relaxed">
              无论是商业合作、品牌咨询，亦或是单纯的美学探讨，我都随时待命。
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-5">
              <button className="flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 active:scale-95">
                <Mail size={18} />
                <span className="text-sm font-medium tracking-widest">发送邮件联系</span>
              </button>
              <button className="flex items-center gap-3 px-8 py-4 glass-card text-stone-900 rounded-xl hover:bg-white/60 transition-all active:scale-95">
                <Download size={18} />
                <span className="text-sm font-medium tracking-widest">简历/作品集下载</span>
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-[400px] flex flex-col gap-5">
             <div className="flex items-center gap-5 p-6 glass-card hover:bg-white/60 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-400">
                  <Instagram size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">社交平台</div>
                  <div className="text-[15px] font-semibold text-stone-800">@qianyi_creative</div>
                </div>
             </div>
             <div className="flex items-center gap-5 p-6 glass-card hover:bg-white/60 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-400">
                  <Chrome size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold mb-1">即时沟通</div>
                  <div className="text-[15px] font-semibold text-stone-800">微信：leung-xan-yi</div>
                </div>
             </div>
             <div className="p-6 glass-card mt-2">
                <img 
                  src={wechatQrCode} 
                  alt="WeChat QR Code" 
                  className="w-[120px] h-[120px] mx-auto hover:scale-105 transition-transform duration-300" 
                  referrerPolicy="no-referrer"
                />
                <p className="text-[10px] text-center text-stone-400 mt-4 uppercase tracking-[0.2em] font-bold">扫码添加微信</p>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center text-stone-400 text-[10px] border-t border-white/20">
        <p className="tracking-[0.4em] uppercase font-bold mb-3">© 2026 梁倩怡 LIANG QIANYI</p>
        <p className="tracking-[0.1em] font-light">LIGHTNESS · DREAMY · HIGH-END · VISION</p>
      </footer>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-hidden"
          >
            {/* Darkened Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" 
            />
            
            {/* Modal Container: Split Layout */}
            <motion.div
              layoutId={`modal-${selectedId}`}
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-7xl max-h-[100%] glass-card flex flex-col md:flex-row shadow-[0_32px_128px_rgba(0,0,0,0.5)] z-10 border border-white/20 select-none overflow-hidden"
            >
              {/* Close Button UI (Top Right Floating) */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(null);
                }}
                className="absolute top-6 right-6 z-[200] p-3 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all backdrop-blur-md active:scale-90 shadow-lg border border-white/20"
              >
                <X size={20} />
              </button>

              {/* Main Content Area (Left: Media, Right: Details) */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left Side: Images Viewport */}
                <div className="relative flex-1 bg-stone-100 flex items-center justify-center overflow-hidden min-h-[400px] md:min-h-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${selectedId}-${currentImgIndex}`}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="w-full h-full relative"
                    >
                      {(() => {
                        const projectVideo = projectVideoOverrides[selectedProject.id]?.[currentImgIndex] || selectedProject.videoPages?.[currentImgIndex];
                        const isPageVideo = !!projectVideo && !(selectedProject.id === 10 && (currentImgIndex === 4 || currentImgIndex === 5));
                        const googleDriveEmbed = getGoogleDriveEmbedUrl(projectVideo);
                        
                        return (
                          <div className="w-full h-full relative flex items-center justify-center bg-stone-900">
                            {isPageVideo ? (
                              <div className="w-full h-full relative flex items-center justify-center group/video">
                                {googleDriveEmbed ? (
                                  <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                                    <iframe 
                                      key={`iframe-${googleDriveEmbed}`}
                                      src={googleDriveEmbed}
                                      className="relative z-10 w-full h-[100%] border-0 shadow-2xl rounded-lg"
                                      style={{ aspectRatio: "16/9", maxHeight: "100%", maxWidth: "100%" }}
                                      allow="autoplay; encrypted-media; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                ) : (
                                  <VideoPlayer 
                                    src={getProductionVideoUrl(projectVideo)}
                                    hasSound={!!selectedProject.hasSound}
                                    onReplay={handleReplay}
                                    videoRef={modalVideoRef}
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="w-full h-full relative group/image flex items-center justify-center">
                                <img 
                                  id={`project-view-img-${selectedProject.id}-page-${currentImgIndex + 1}`}
                                  src={getProductionImageUrl(projectImageOverrides[selectedProject.id]?.[currentImgIndex] || selectedProject.images[currentImgIndex], selectedProject.id)} 
                                  className="w-full h-full object-contain p-6 md:p-12 mb-6" 
                                  alt={`${selectedProject.title} - Page ${currentImgIndex + 1}`} 
                                  onError={(e) => {
                                    e.currentTarget.src = "/assets/images/regenerated_image_1779820977423.jpg";
                                  }}
                                />
                              </div>
                            )}

                            {/* Unified Panel for Media Control (Only in Edit Mode) */}
                            {isEditMode && (
                              <div className="absolute inset-x-4 bottom-4 z-[90] flex flex-col gap-2.5 p-4 bg-stone-950/95 border border-white/10 text-white rounded-2xl max-w-[340px] mx-auto shadow-2xl backdrop-blur-md pointer-events-auto">
                                <span className="text-[10px] uppercase tracking-[0.2em] text-purple-400 font-bold text-center block mb-1">网页多媒体配置 · Slide Setup</span>
                                
                                <div className="flex gap-2 w-full">
                                  <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg cursor-pointer transition-all active:scale-[0.98]">
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="image/*" 
                                      onChange={(e) => handleProjectImageUpload(selectedProject.id, currentImgIndex, e)} 
                                    />
                                    <Plus size={12} className="text-purple-400" />
                                    <span className="text-[10px] font-bold">本地图片 Image</span>
                                  </label>
                                  <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white/10 hover:bg-white/20 border border-white/15 rounded-lg cursor-pointer transition-all active:scale-[0.98]">
                                    <input 
                                      type="file" 
                                      className="hidden" 
                                      accept="video/*" 
                                      onChange={(e) => handleProjectVideoUpload(selectedProject.id, currentImgIndex, e)} 
                                    />
                                    <Download size={12} className="rotate-180 text-purple-400" />
                                    <span className="text-[10px] font-bold">本地视频 Video</span>
                                  </label>
                                </div>

                                <div className="w-full flex flex-col gap-1.5 mt-1 text-left">
                                  <div>
                                    <span className="text-[9px] text-stone-400 uppercase font-semibold block mb-0.5">图片外链 URL:</span>
                                    <input 
                                      type="text"
                                      placeholder="粘贴图片直链"
                                      className="w-full bg-stone-900 border border-white/15 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 font-mono text-ellipsis overflow-hidden"
                                      value={projectImageOverrides[selectedProject.id]?.[currentImgIndex] || ""}
                                      onChange={async (e) => {
                                        const val = e.target.value;
                                        setProjectImageOverrides(prev => {
                                          const current = prev[selectedProject.id] || [...(PROJECTS.find(p => p.id === selectedProject.id)?.images || [])];
                                          const next = [...current];
                                          next[currentImgIndex] = val;
                                          return { ...prev, [selectedProject.id]: next };
                                        });
                                        const currentFullStore = await get('project-images-blobs') || {};
                                        if (!currentFullStore[selectedProject.id]) currentFullStore[selectedProject.id] = [];
                                        currentFullStore[selectedProject.id][currentImgIndex] = val;
                                        await set('project-images-blobs', currentFullStore);
                                        await set('project-images-v2', currentFullStore);
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-stone-400 uppercase font-semibold block mb-0.5">视频外链 URL:</span>
                                    <input 
                                      type="text"
                                      placeholder="粘贴视频 / Google Drive 链接"
                                      className="w-full bg-stone-900 border border-white/15 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 font-mono text-ellipsis overflow-hidden"
                                      value={projectVideoOverrides[selectedProject.id]?.[currentImgIndex] || ""}
                                      onChange={async (e) => {
                                        const val = e.target.value;
                                        setProjectVideoOverrides(prev => {
                                          const current = prev[selectedProject.id] || [...(PROJECTS.find(p => p.id === selectedProject.id)?.videoPages || [])];
                                          const next = [...current];
                                          next[currentImgIndex] = val;
                                          return { ...prev, [selectedProject.id]: next };
                                        });
                                        const currentFullStore = await get('project-videos-blobs') || {};
                                        if (!currentFullStore[selectedProject.id]) currentFullStore[selectedProject.id] = [];
                                        currentFullStore[selectedProject.id][currentImgIndex] = val;
                                        await set('project-videos-blobs', currentFullStore);
                                        await set('project-videos-v2', currentFullStore);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </motion.div>
                  </AnimatePresence>
                    {/* CONFIRMED_TAIL */}
                  {/* Top Left: Page Indicator */}
                  {selectedProject.images.length > 1 && (
                    <div className="absolute top-8 left-8 px-4 py-1.5 bg-black/20 backdrop-blur-xl text-white text-[10px] font-bold tracking-[0.3em] rounded-full z-20 border border-white/10">
                      {currentImgIndex + 1} / {selectedProject.images.length}
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  <div className="absolute inset-0 pointer-events-none flex justify-between items-center px-6 z-[60]">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev - 1 + selectedProject.images.length) % selectedProject.images.length); }}
                      className="pointer-events-auto p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-xl border border-white/20 active:scale-90 group"
                    >
                      <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setCurrentImgIndex((prev) => (prev + 1) % selectedProject.images.length); }}
                      className="pointer-events-auto p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-xl border border-white/20 active:scale-90 group"
                    >
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  {/* Bottom: Dots */}
                  {selectedProject.images.length > 1 && (
                    <div className="absolute bottom-8 flex justify-center gap-2 z-30">
                      {selectedProject.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImgIndex(idx)}
                          className={`h-1 rounded-full transition-all duration-500 ${idx === currentImgIndex ? 'w-10 bg-white shadow-lg' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-[420px] bg-white flex flex-col h-full max-h-[50vh] md:max-h-none overflow-y-auto border-l border-stone-100">
                  {(() => {
                    const pTitle = projectTextOverrides[selectedProject.id]?.title || selectedProject.title;
                    const pCategory = projectTextOverrides[selectedProject.id]?.category || selectedProject.category;
                    const pDescription = projectTextOverrides[selectedProject.id]?.description || selectedProject.description;
                    const pDetails = projectTextOverrides[selectedProject.id]?.details || selectedProject.details;
                    const pResults = projectTextOverrides[selectedProject.id]?.results || selectedProject.results || "";

                    return (
                      <div className="p-10 md:p-14 flex-1">
                        {isEditMode && (
                          <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-xl mb-6 shadow-sm flex flex-col gap-3 text-left">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-purple-600 block italic">🎉 卡片封面配置 · Cover Setup</span>
                              <span className="text-[9px] text-stone-400 font-serif">（在主页展示的卡片主图）</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-14 h-14 rounded-lg bg-stone-100 border border-stone-200 overflow-hidden relative shadow-inner shrink-0 leading-none flex items-center justify-center">
                                <img 
                                  src={getProductionImageUrl(projectCoverOverrides[selectedProject.id] || selectedProject.cover, selectedProject.id)} 
                                  className="w-full h-full object-cover" 
                                  alt="Current Cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/assets/images/regenerated_image_1779820977423.jpg";
                                  }}
                                />
                              </div>
                              <label className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg cursor-pointer transition-all active:scale-[0.98] text-[11px] font-bold text-center">
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*" 
                                  onChange={(e) => handleProjectCoverUpload(selectedProject.id, e)} 
                                />
                                <Download size={11} className="rotate-180" />
                                <span>更换封面图片 · Change Cover</span>
                              </label>
                            </div>
                          </div>
                        )}
                        <div className="flex flex-col gap-8 mb-10">
                          <div className="flex flex-col gap-2">
                            <span className="text-serif text-[10px] uppercase tracking-[0.3em] text-purple-400 font-bold block italic">
                              类别 · Category
                            </span>
                            {isEditMode ? (
                              <input 
                                type="text"
                                className="w-full bg-stone-50 border border-purple-200 rounded px-3 py-1.5 text-xs text-purple-600 focus:outline-none focus:border-purple-400 font-serif"
                                value={pCategory}
                                onChange={(e) => handleUpdateText(selectedProject.id, 'category', e.target.value)}
                              />
                            ) : (
                              <span className="text-serif text-[10px] uppercase tracking-[0.5em] text-purple-400 font-bold block italic">
                                {pCategory}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold block">作品名称 · Title</span>
                            {isEditMode ? (
                              <input 
                                type="text"
                                className="w-full bg-stone-50 border border-purple-200 rounded px-3 py-1.5 text-serif text-lg font-medium text-stone-800 focus:outline-none focus:border-purple-400"
                                value={pTitle}
                                onChange={(e) => handleUpdateText(selectedProject.id, 'title', e.target.value)}
                              />
                            ) : (
                              <h2 className="text-serif text-3xl md:text-4xl font-light text-stone-900 tracking-tighter leading-tight uppercase">
                                {pTitle}
                              </h2>
                            )}
                          </div>

                          {isEditMode && (
                            <div className="flex flex-col gap-2 mt-4">
                              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 block italic">列表简述 · Card Summary (2 lines)</span>
                              <textarea
                                className="w-full bg-stone-50 border border-purple-200 p-3 rounded text-xs text-stone-600 font-serif focus:outline-none focus:border-purple-400"
                                rows={2}
                                value={pDescription}
                                onChange={(e) => handleUpdateText(selectedProject.id, 'description', e.target.value)}
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-12">
                          <section>
                            <h4 className="text-serif text-[11px] font-bold uppercase tracking-[0.3em] text-stone-300 mb-4 block italic">项目介绍 / Introduction</h4>
                            {isEditMode ? (
                              <textarea 
                                className="w-full bg-stone-50 border border-purple-200 rounded p-3 text-sm text-stone-600 leading-relaxed font-light font-serif focus:outline-none focus:border-purple-400"
                                rows={6}
                                value={pDetails}
                                onChange={(e) => handleUpdateText(selectedProject.id, 'details', e.target.value)}
                              />
                            ) : (
                              <p className="text-[15px] text-stone-600 leading-relaxed font-light font-serif">
                                {pDetails}
                              </p>
                            )}
                          </section>

                          <section>
                            <h4 className="text-serif text-[11px] font-bold uppercase tracking-[0.3em] text-stone-300 mb-4 block italic">交付成果 / Results</h4>
                            {isEditMode ? (
                              <textarea 
                                className="w-full bg-stone-50 border border-purple-200 rounded p-3 text-sm text-stone-500 italic leading-relaxed font-serif focus:outline-none focus:border-purple-400"
                                rows={4}
                                value={pResults}
                                onChange={(e) => handleUpdateText(selectedProject.id, 'results', e.target.value)}
                              />
                            ) : pResults ? (
                              <div className="p-5 bg-stone-50/50 border border-stone-100 rounded-xl text-sm text-stone-500 italic leading-relaxed font-serif">
                                {pResults}
                              </div>
                            ) : (
                              <p className="text-xs text-stone-400 italic">暂无交付成果信息</p>
                            )}
                          </section>

                          <section>
                            <h4 className="text-serif text-[11px] font-bold uppercase tracking-[0.3em] text-stone-300 mb-4 block italic">核心技术 / Strategy</h4>
                            <div className="flex flex-wrap gap-2.5">
                              {["创意策划", "品牌故事", "视觉执行", "数字整合"].map(tag => (
                                <span key={tag} className="text-[10px] px-3 py-1.5 bg-stone-50 text-stone-400 border border-stone-100 rounded-md font-serif italic font-medium">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </section>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Bottom Bar */}
                  <div className="p-10 border-t border-stone-100 bg-stone-50/30 flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                       <button onClick={handlePrev} className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 group">
                         <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 上一个作品
                       </button>
                       <button onClick={handleNext} className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 group">
                         下一个作品 <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                    
                    <button className="w-full flex items-center justify-center gap-3 py-4 bg-stone-900 text-white rounded-xl text-[13px] font-medium tracking-[0.2em] hover:bg-stone-800 transition-all shadow-xl shadow-stone-900/10 active:scale-[0.98] uppercase">
                       <ExternalLink size={18} />
                       即刻浏览案例官网
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isEditMode && (
        <div className="fixed bottom-6 right-6 z-[300] flex flex-col items-end gap-3 pointer-events-auto">
          {isSyncPanelOpen ? (
            <div className="w-[360px] max-h-[550px] overflow-y-auto bg-stone-900 border border-white/10 text-white rounded-3xl shadow-2xl p-6 flex flex-col gap-4 backdrop-blur-2xl">
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-400">同步面板 · Sync Panel</span>
                </div>
                <button 
                  onClick={() => setIsSyncPanelOpen(false)}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Tabs */}
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-950 rounded-xl border border-white/5">
                <button
                  type="button"
                  onClick={() => setSyncTab('export')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${syncTab === 'export' ? 'bg-purple-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
                >
                  导出配置 · Export
                </button>
                <button
                  type="button"
                  onClick={() => setSyncTab('import')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${syncTab === 'import' ? 'bg-purple-600 text-white shadow-md' : 'text-stone-400 hover:text-stone-200'}`}
                >
                  导入配置 · Import
                </button>
              </div>

              {syncTab === 'export' ? (
                <>
                  <div className="text-[12px] text-stone-300 leading-relaxed space-y-2 text-left">
                    <p>📋 <strong className="text-white">如何同步我的修改并在正式网站中生效？</strong></p>
                    <p className="text-stone-400 leading-snug text-xs font-serif">由于网页上的“上传或粘贴链接"仅临时存储在您的本地浏览器数据库中。当发布 (Publish) 或他人访问时，他人是看不到这些本地修改的。</p>
                    <p className="text-stone-400 leading-snug text-xs font-serif">请点击下方的 <strong className="text-purple-400">「一键复制 · Copy」</strong> 按钮，然后将这段配置代码在聊天对话框发给我，我将立即永久固化写入系统源代码中！</p>
                  </div>

                  <div className="relative text-left flex flex-col gap-2">
                    <textarea 
                      readOnly
                      className="w-full h-40 bg-stone-950 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-stone-400 focus:outline-none"
                      value={getSyncJson()}
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getSyncJson());
                        alert("同步配置复制成功！请将它粘贴发给我，我会在系统源码中为您硬编码保存。");
                      }}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <Copy size={12} />
                      一键复制 · Copy
                    </button>
                  </div>

                  <div className="text-[10px] text-stone-400 font-bold bg-white/5 py-2 px-3 rounded-lg flex items-center justify-between text-left">
                    <span>网络外链: {
                      (Object.values(projectVideoOverrides).flatMap(x => x) as string[]).filter(u => u && !u.startsWith('blob:')).length +
                      (Object.values(projectImageOverrides).flatMap(x => x) as string[]).filter(u => u && !u.startsWith('blob:')).length
                    } 项</span>
                    <span>本地文件: {
                      (Object.values(projectVideoOverrides).flatMap(x => x) as string[]).filter(u => u && u.startsWith('blob:')).length +
                      (Object.values(projectImageOverrides).flatMap(x => x) as string[]).filter(u => u && u.startsWith('blob:')).length
                    } 项</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-[12px] text-stone-300 leading-relaxed space-y-1 text-left">
                    <p>📥 <strong className="text-white">导入已有配置 JSON</strong></p>
                    <p className="text-stone-400 leading-snug text-xs font-serif">您可以直接在下方框中粘贴您以前导出的 JSON 代码，点击「确认导入」以立即恢复所有修改过的文字和外链。</p>
                  </div>

                  <div className="relative text-left flex flex-col gap-3">
                    <textarea 
                      className="w-full h-40 bg-stone-950 border border-white/10 rounded-xl p-3 text-[11px] font-mono text-stone-300 focus:outline-none focus:border-purple-500/40"
                      placeholder='请在此处粘贴 JSON 配置...'
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        if (!importJsonText.trim()) {
                          alert("请输入有效的 JSON 配置！");
                          return;
                        }
                        handleImportConfig(importJsonText);
                      }}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-lg shadow-purple-600/20 text-center"
                    >
                      <Download size={13} />
                      确认导入配置 · Import Config
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsSyncPanelOpen(true)}
              className="px-5 py-3.5 bg-purple-600 hover:bg-purple-700 text-white border border-purple-500 rounded-full shadow-2xl flex items-center gap-2.5 font-bold text-[11px] tracking-widest uppercase transition-all duration-300 transform scale-100 hover:scale-105 active:scale-[0.96] animate-bounce"
            >
              <Save size={14} className="animate-pulse text-purple-200" />
              <span>同步我的网页修改 · Sync Website</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
