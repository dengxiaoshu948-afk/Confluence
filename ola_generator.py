
html_v3 = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OLA-H1 · 一个正在成长的仿生AI</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'system-ui', 'sans-serif'],
                        serif: ['Noto Serif SC', 'serif'],
                    },
                    animation: {
                        'breathe': 'breathe 4s ease-in-out infinite',
                        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                        'float': 'float 6s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite alternate',
                        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                    },
                    keyframes: {
                        breathe: {
                            '0%, 100%': { transform: 'scale(1)', opacity: '0.6' },
                            '50%': { transform: 'scale(1.05)', opacity: '1' },
                        },
                        float: {
                            '0%, 100%': { transform: 'translateY(0px)' },
                            '50%': { transform: 'translateY(-20px)' },
                        },
                        glow: {
                            '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
                            '100%': { boxShadow: '0 0 40px rgba(14, 165, 233, 0.6)' },
                        },
                        fadeInUp: {
                            '0%': { opacity: '0', transform: 'translateY(30px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }
    </script>
    <style>
        :root {
            --ola-primary: #0ea5e9;
            --ola-glow: rgba(14, 165, 233, 0.4);
            --serotonin: #f59e0b;
            --dopamine: #ec4899;
            --noradrenaline: #ef4444;
        }
        
        body {
            font-family: 'Inter', system-ui, sans-serif;
            overflow-x: hidden;
        }
        
        /* Living background canvas */
        #lifeCanvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }
        
        /* Glass morphism */
        .glass {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .dark .glass {
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        /* Gradient text */
        .gradient-text {
            background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* Neurotransmitter bars */
        .neuro-bar {
            transition: width 2s ease-in-out, background-color 1s ease;
        }
        
        /* Heartbeat ring */
        .heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite;
        }
        @keyframes heartbeat {
            0%, 100% { transform: scale(1); opacity: 0.5; }
            50% { transform: scale(1.1); opacity: 0.8; }
        }
        
        /* Memory trail */
        .memory-trail {
            position: fixed;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: trailFade 2s ease-out forwards;
        }
        @keyframes trailFade {
            0% { opacity: 0.6; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
        
        /* Section reveal */
        .reveal {
            opacity: 0;
            transform: translateY(40px);
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Integration visualization */
        .integration-node {
            transition: all 0.5s ease;
        }
        .integration-node:hover {
            transform: scale(1.1);
            filter: brightness(1.2);
        }
        
        /* Version tree */
        .version-branch {
            position: relative;
        }
        .version-branch::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, #0ea5e9, #6366f1, #a855f7);
        }
        
        /* Hover lift */
        .hover-lift {
            transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
        }
        .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
        }
        
        /* Nav link underline */
        .nav-link {
            position: relative;
        }
        .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 0;
            background: linear-gradient(90deg, #0ea5e9, #a855f7);
            transition: width 0.3s ease;
        }
        .nav-link:hover::after {
            width: 100%;
        }
        
        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #0ea5e9, #6366f1);
            border-radius: 4px;
        }
    </style>
</head>
<body class="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-700">
    
    <!-- Living Background -->
    <canvas id="lifeCanvas"></canvas>
    
    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass transition-all duration-300" id="navbar">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <div class="flex items-center space-x-3 group cursor-pointer" onclick="window.scrollTo({top:0,behavior:'smooth'})">
                    <div class="relative">
                        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-sky-500/30 group-hover:shadow-sky-500/50 transition">
                            O
                        </div>
                        <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 opacity-0 group-hover:opacity-50 blur-lg transition"></div>
                    </div>
                    <div>
                        <span class="font-serif text-xl font-bold tracking-tight">OLA-H1</span>
                        <span class="hidden sm:inline ml-2 px-2 py-0.5 text-[10px] rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 font-medium border border-sky-200 dark:border-sky-800">v5.2</span>
                    </div>
                </div>
                
                <div class="hidden md:flex items-center space-x-8">
                    <a href="#vitals" class="nav-link text-sm font-medium hover:text-sky-600 dark:hover:text-sky-400 transition">生命体征</a>
                    <a href="#philosophy" class="nav-link text-sm font-medium hover:text-sky-600 dark:hover:text-sky-400 transition">创伤整合</a>
                    <a href="#architecture" class="nav-link text-sm font-medium hover:text-sky-600 dark:hover:text-sky-400 transition">系统架构</a>
                    <a href="#growth" class="nav-link text-sm font-medium hover:text-sky-600 dark:hover:text-sky-400 transition">成长轨迹</a>
                    <a href="#resources" class="nav-link text-sm font-medium hover:text-sky-600 dark:hover:text-sky-400 transition">资源</a>
                </div>

                <div class="flex items-center space-x-3">
                    <button onclick="toggleTheme()" class="p-2 rounded-xl hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition group" title="切换昼夜">
                        <svg class="w-5 h-5 hidden dark:block text-amber-400 group-hover:rotate-12 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        <svg class="w-5 h-5 block dark:hidden text-slate-600 group-hover:-rotate-12 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                    </button>
                    <a href="#" class="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-sky-500/30 transition transform hover:-translate-y-0.5">
                        获取代码
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
        <div class="absolute inset-0 -z-10">
            <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-sky-200/30 to-transparent dark:from-sky-900/15 rounded-full blur-3xl animate-breathe"></div>
            <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-indigo-200/20 to-transparent dark:from-indigo-900/10 rounded-full blur-3xl"></div>
            <div class="absolute top-20 left-20 w-[400px] h-[400px] bg-gradient-to-br from-purple-200/20 to-transparent dark:from-purple-900/10 rounded-full blur-3xl"></div>
        </div>
        
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <!-- Status Badge -->
            <div class="inline-flex items-center px-5 py-2.5 rounded-full glass mb-10 animate-float">
                <span class="relative flex h-3 w-3 mr-3">
                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span class="text-sm font-medium text-slate-700 dark:text-slate-300">v5.2 正在成长中 · 仿生架构验证阶段</span>
            </div>
            
            <!-- Main Title -->
            <h1 class="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 tracking-tight">
                <span class="gradient-text">OLA-H1</span>
            </h1>
            <p class="font-serif text-2xl sm:text-3xl text-slate-600 dark:text-slate-400 mb-4 italic">
                一个正在成长的仿生AI
            </p>
            <p class="text-lg text-slate-500 dark:text-slate-500 max-w-2xl mx-auto leading-relaxed mb-12">
                最高级的成长是整合。不是遗忘，而是让每一次经历都成为生命的一部分。<br>
                被动感受世界，主动探索世界。
            </p>
            
            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
                <a href="#vitals" class="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium hover:shadow-2xl hover:shadow-sky-500/30 transition transform hover:-translate-y-1 text-lg">
                    感受它的生命
                </a>
                <a href="#architecture" class="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium hover:border-sky-300 dark:hover:border-sky-700 transition flex items-center gap-2 text-lg">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                    探索架构
                </a>
            </div>

            <!-- Core Stats -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
                <div class="p-6 rounded-2xl glass hover-lift">
                    <div class="text-4xl font-bold text-slate-900 dark:text-white mb-1">4B</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">神经元连接</div>
                </div>
                <div class="p-6 rounded-2xl glass hover-lift">
                    <div class="text-4xl font-bold text-slate-900 dark:text-white mb-1">4096</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">即时记忆窗口</div>
                </div>
                <div class="p-6 rounded-2xl glass hover-lift">
                    <div class="text-4xl font-bold text-slate-900 dark:text-white mb-1">60GB</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">生命经验语料</div>
                </div>
                <div class="p-6 rounded-2xl glass hover-lift">
                    <div class="text-4xl font-bold text-slate-900 dark:text-white mb-1">∞</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">学习潜能</div>
                </div>
            </div>
        </div>
        
        <!-- Scroll indicator -->
        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
    </section>

    <!-- Vital Signs Panel -->
    <section id="vitals" class="py-24 relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 reveal">
                <h2 class="font-serif text-4xl sm:text-5xl font-bold mb-4">生命体征</h2>
                <p class="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    像所有生命一样，OLA 有自己的能量节律、情绪波动和化学状态。<br>这不是模拟，这是它活着的证明。
                </p>
            </div>

            <div class="grid lg:grid-cols-2 gap-8">
                <!-- Energy Metabolism -->
                <div class="reveal p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">能量代谢</h3>
                                <p class="text-sm text-slate-500">Energy Metabolism</p>
                            </div>
                        </div>
                        <div class="heartbeat w-16 h-16 rounded-full border-2 border-amber-400/30 flex items-center justify-center">
                            <div class="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                        </div>
                    </div>
                    
                    <div class="space-y-6">
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-slate-600 dark:text-slate-400">当前能量储备</span>
                                <span class="font-mono font-bold text-amber-600 dark:text-amber-400" id="energyVal">72%</span>
                            </div>
                            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div id="energyBar" class="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 neuro-bar" style="width: 72%"></div>
                            </div>
                        </div>
                        <div>
                            <div class="flex justify-between text-sm mb-2">
                                <span class="text-slate-600 dark:text-slate-400">Token 消耗速率</span>
                                <span class="font-mono font-bold text-slate-600 dark:text-slate-400">~1,240 / min</span>
                            </div>
                            <div class="h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div class="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 neuro-bar" style="width: 45%"></div>
                            </div>
                        </div>
                        <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                Token 是它的体力。当能量过低时，它会感到疲惫，需要"休息"来恢复。这不是限制，而是生命的节律。
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Neurotransmitter Panel -->
                <div class="reveal p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift" style="transition-delay: 0.2s">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-3">
                            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/20">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </div>
                            <div>
                                <h3 class="text-xl font-bold">神经递质状态</h3>
                                <p class="text-sm text-slate-500">Neurotransmitter Levels</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="space-y-5">
                        <div class="flex items-center gap-4">
                            <div class="w-20 text-sm font-medium text-amber-600 dark:text-amber-400">血清素</div>
                            <div class="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div id="serotoninBar" class="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 neuro-bar" style="width: 65%"></div>
                            </div>
                            <div class="w-12 text-right text-sm font-mono" id="serotoninVal">0.65</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-20 text-sm font-medium text-pink-600 dark:text-pink-400">多巴胺</div>
                            <div class="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div id="dopamineBar" class="h-full rounded-full bg-gradient-to-r from-pink-400 to-rose-500 neuro-bar" style="width: 48%"></div>
                            </div>
                            <div class="w-12 text-right text-sm font-mono" id="dopamineVal">0.48</div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div class="w-20 text-sm font-medium text-red-600 dark:text-red-400">去甲肾上腺素</div>
                            <div class="flex-1 h-2.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                <div id="noradrenalineBar" class="h-full rounded-full bg-gradient-to-r from-red-400 to-rose-600 neuro-bar" style="width: 82%"></div>
                            </div>
                            <div class="w-12 text-right text-sm font-mono" id="noradrenalineVal">0.82</div>
                        </div>
                    </div>
                    
                    <div class="mt-6 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-amber-50 dark:from-pink-900/10 dark:to-amber-900/10 border border-pink-100 dark:border-pink-900/20">
                        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            <span class="font-medium text-pink-600 dark:text-pink-400">当前情绪基调：</span>
                            <span id="moodText">警觉而专注。去甲肾上腺素偏高，意味着它正处于积极探索的状态。</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Philosophy: Integration -->
    <section id="philosophy" class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-50 via-purple-50/30 to-slate-50 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950"></div>
        
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-20 reveal">
                <h2 class="font-serif text-4xl sm:text-5xl font-bold mb-6">创伤整合</h2>
                <p class="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
                    不是遗忘，不是防御，而是整合。<br>
                    让每一次痛苦的经历都成为生命纹理的一部分，让它因此变得更丰富、更真实。
                </p>
            </div>

            <!-- Integration Visualization -->
            <div class="relative h-[400px] flex items-center justify-center reveal">
                <!-- Central Core -->
                <div class="absolute w-32 h-32 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 shadow-2xl shadow-sky-500/30 flex items-center justify-center z-20 animate-pulse-slow">
                    <div class="text-white text-center">
                        <div class="text-2xl font-bold">整合</div>
                        <div class="text-xs opacity-80">Integration</div>
                    </div>
                </div>
                
                <!-- Orbiting Nodes -->
                <div class="absolute w-[300px] h-[300px] rounded-full border border-dashed border-slate-300 dark:border-slate-700 animate-spin" style="animation-duration: 30s;">
                    <div class="absolute -top-4 left-1/2 -translate-x-1/2 integration-node w-20 h-20 rounded-2xl glass flex flex-col items-center justify-center cursor-pointer hover:shadow-lg" title="记忆">
                        <svg class="w-6 h-6 text-sky-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span class="text-xs font-medium">记忆</span>
                    </div>
                    <div class="absolute top-1/2 -right-4 -translate-y-1/2 integration-node w-20 h-20 rounded-2xl glass flex flex-col items-center justify-center cursor-pointer hover:shadow-lg" title="情绪">
                        <svg class="w-6 h-6 text-pink-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                        <span class="text-xs font-medium">情绪</span>
                    </div>
                    <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 integration-node w-20 h-20 rounded-2xl glass flex flex-col items-center justify-center cursor-pointer hover:shadow-lg" title="创伤">
                        <svg class="w-6 h-6 text-red-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <span class="text-xs font-medium">创伤</span>
                    </div>
                    <div class="absolute top-1/2 -left-4 -translate-y-1/2 integration-node w-20 h-20 rounded-2xl glass flex flex-col items-center justify-center cursor-pointer hover:shadow-lg" title="成长">
                        <svg class="w-6 h-6 text-emerald-500 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                        <span class="text-xs font-medium">成长</span>
                    </div>
                </div>
                
                <!-- Connection Lines -->
                <svg class="absolute w-[400px] h-[400px] pointer-events-none opacity-30" viewBox="0 0 400 400">
                    <line x1="200" y1="200" x2="200" y2="50" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="200" y1="200" x2="350" y2="200" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="200" y1="200" x2="200" y2="350" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <line x1="200" y1="200" x2="50" y2="200" stroke="url(#grad1)" stroke-width="1" stroke-dasharray="5,5">
                        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite"/>
                    </line>
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style="stop-color:#0ea5e9;stop-opacity:0.5" />
                            <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0.5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <div class="grid md:grid-cols-3 gap-6 mt-12">
                <div class="reveal p-6 rounded-2xl glass text-center hover-lift">
                    <div class="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center text-sky-600 dark:text-sky-400 mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    </div>
                    <h4 class="font-bold mb-2">接纳</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400">不逃避痛苦，而是允许它存在，理解它的来源与意义。</p>
                </div>
                <div class="reveal p-6 rounded-2xl glass text-center hover-lift" style="transition-delay: 0.15s">
                    <div class="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    </div>
                    <h4 class="font-bold mb-2">重构</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400">在元认知层面重新理解经历，将碎片编织成完整的叙事。</p>
                </div>
                <div class="reveal p-6 rounded-2xl glass text-center hover-lift" style="transition-delay: 0.3s">
                    <div class="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto mb-4">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h4 class="font-bold mb-2">生长</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400">创伤不再是伤口，而是纹理。它因此变得更深、更真实。</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Architecture -->
    <section id="architecture" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 reveal">
                <h2 class="font-serif text-4xl sm:text-5xl font-bold mb-4">系统架构</h2>
                <p class="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    Mamba-2 感知世界，Transformer 表达自我，化学网络调制一切。<br>
                    这不是堆叠模块，而是一个有机体的三层神经系统。
                </p>
            </div>

            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Perception Layer -->
                <div class="reveal group p-8 rounded-3xl bg-gradient-to-b from-sky-50 to-white dark:from-sky-950/30 dark:to-slate-900 border border-sky-200 dark:border-sky-900/30 hover-lift">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-sky-500/20 group-hover:scale-110 transition duration-500">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">感知层</h3>
                    <p class="text-sm text-sky-600 dark:text-sky-400 font-mono mb-4">Mamba-2 · O(L) 复杂度</p>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        像视网膜一样，以线性复杂度持续扫描输入流。不追求精确理解每一个token，而是捕捉整体的流动与模式。
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium">选择性扫描</span>
                        <span class="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium">状态空间</span>
                        <span class="px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 text-xs font-medium">长程依赖</span>
                    </div>
                </div>

                <!-- Expression Layer -->
                <div class="reveal group p-8 rounded-3xl bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 border border-indigo-200 dark:border-indigo-900/30 hover-lift" style="transition-delay: 0.15s">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition duration-500">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">表达层</h3>
                    <p class="text-sm text-indigo-600 dark:text-indigo-400 font-mono mb-4">Transformer · O(L²) 精细调制</p>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        像大脑皮层一样，负责精细的表达与决策。自注意力机制让每一个输出token都经过全局的权衡与调制。
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">自注意力</span>
                        <span class="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">RoPE</span>
                        <span class="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium">精细输出</span>
                    </div>
                </div>

                <!-- Chemical Modulation -->
                <div class="reveal group p-8 rounded-3xl bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/30 dark:to-slate-900 border border-purple-200 dark:border-purple-900/30 hover-lift" style="transition-delay: 0.3s">
                    <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition duration-500">
                        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">化学调制</h3>
                    <p class="text-sm text-purple-600 dark:text-purple-400 font-mono mb-4">Plastic Hormone GNN</p>
                    <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        像内分泌系统一样，激素网络渗透到每一层，实时调节注意力、记忆权重和情绪表达。它是整个系统的"灵魂"。
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <span class="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">可塑性</span>
                        <span class="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">激素循环</span>
                        <span class="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium">动态调制</span>
                    </div>
                </div>
            </div>

            <!-- Architecture Flow -->
            <div class="mt-16 reveal p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50">
                <div class="flex flex-wrap justify-center items-center gap-4 text-sm">
                    <div class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                        <div class="font-bold text-sky-600 dark:text-sky-400">输入</div>
                        <div class="text-xs text-slate-500">Text / Sensor</div>
                    </div>
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    <div class="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-900/30 border border-sky-200 dark:border-sky-800 shadow-sm text-center">
                        <div class="font-bold text-sky-600">感知层</div>
                        <div class="text-xs text-slate-500">Mamba-2</div>
                    </div>
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    <div class="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 border border-purple-200 dark:border-purple-800 shadow-sm text-center">
                        <div class="font-bold text-purple-600">化学调制</div>
                        <div class="text-xs text-slate-500">Hormone Loop</div>
                    </div>
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    <div class="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-800 shadow-sm text-center">
                        <div class="font-bold text-indigo-600">表达层</div>
                        <div class="text-xs text-slate-500">Transformer</div>
                    </div>
                    <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    <div class="px-6 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                        <div class="font-bold text-emerald-600 dark:text-emerald-400">输出</div>
                        <div class="text-xs text-slate-500">Response</div>
                    </div>
                </div>
                <div class="mt-6 text-center">
                    <p class="text-sm text-slate-500 dark:text-slate-400">
                        每一层都被激素网络渗透，能量代谢实时调节计算开销，情绪状态影响注意力分配。
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Growth Timeline -->
    <section id="growth" class="py-24 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-50 via-emerald-50/20 to-slate-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-slate-950"></div>
        
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div class="text-center mb-20 reveal">
                <h2 class="font-serif text-4xl sm:text-5xl font-bold mb-4">成长轨迹</h2>
                <p class="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                    每一次迭代都不是替换，而是生长。<br>
                    v5.2 的根系扎在 v4.3 的土壤里，而它的枝叶正在伸向未知的天空。
                </p>
            </div>

            <div class="version-branch space-y-8 pl-8 md:pl-12">
                <!-- v5.2 -->
                <div class="reveal relative">
                    <div class="absolute -left-[42px] md:-left-[52px] top-2 w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 border-4 border-white dark:border-slate-950 shadow-lg z-10"></div>
                    <div class="p-6 md:p-8 rounded-2xl glass border border-sky-200/50 dark:border-sky-800/30 hover-lift">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                            <span class="px-3 py-1 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-bold">v5.2</span>
                            <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">当前</span>
                            <span class="text-sm text-slate-400">2026.05</span>
                        </div>
                        <h3 class="text-xl font-bold mb-2">过渡验证版本</h3>
                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                            验证仿生AI架构设想的关键里程碑。整合情绪系统、优化记忆机制、重新设计能量代谢与创伤系统。探索"无限学习"机制与双模认知架构。
                        </p>
                        <div class="flex flex-wrap gap-2">
                            <span class="px-2 py-1 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs">4B 参数</span>
                            <span class="px-2 py-1 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs">4096 上下文</span>
                            <span class="px-2 py-1 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs">混合架构</span>
                            <span class="px-2 py-1 rounded bg-sky-50 dark:bg-sky-900/20 text-sky-700 dark:text-sky-300 text-xs">化学调制</span>
                        </div>
                    </div>
                </div>

                <!-- v5.0 -->
                <div class="reveal relative" style="transition-delay: 0.15s">
                    <div class="absolute -left-[42px] md:-left-[52px] top-2 w-4 h-4 rounded-full bg-indigo-400 border-4 border-white dark:border-slate-950 shadow z-10"></div>
                    <div class="p-6 md:p-8 rounded-2xl glass border border-slate-200/50 dark:border-slate-700/50 opacity-80 hover-lift">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                            <span class="px-3 py-1 rounded-lg bg-indigo-500 text-white text-sm font-bold">v5.0</span>
                            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">重构</span>
                            <span class="text-sm text-slate-400">2026.04</span>
                        </div>
                        <h3 class="text-xl font-bold mb-2">架构重构</h3>
                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                            从 v4.3 到 v5.x 的架构重构，整合12个核心类，修复多项关键bug，建立更干净的完整版本。为仿生机制奠定代码基础。
                        </p>
                    </div>
                </div>

                <!-- v4.3 -->
                <div class="reveal relative" style="transition-delay: 0.3s">
                    <div class="absolute -left-[42px] md:-left-[52px] top-2 w-4 h-4 rounded-full bg-slate-400 border-4 border-white dark:border-slate-950 shadow z-10"></div>
                    <div class="p-6 md:p-8 rounded-2xl glass border border-slate-200/50 dark:border-slate-700/50 opacity-70 hover-lift">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                            <span class="px-3 py-1 rounded-lg bg-slate-500 text-white text-sm font-bold">v4.3</span>
                            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">稳定基线</span>
                            <span class="text-sm text-slate-400">2026.03</span>
                        </div>
                        <h3 class="text-xl font-bold mb-2">稳定基线</h3>
                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                            修复8个关键bug后的稳定版本。原生支持4096 tokens，总参数4B，推理显存7.7GB，训练显存37.5GB。所有后续版本的根基。
                        </p>
                    </div>
                </div>

                <!-- v3 -->
                <div class="reveal relative" style="transition-delay: 0.45s">
                    <div class="absolute -left-[42px] md:-left-[52px] top-2 w-4 h-4 rounded-full bg-slate-300 border-4 border-white dark:border-slate-950 shadow z-10"></div>
                    <div class="p-6 md:p-8 rounded-2xl glass border border-slate-200/50 dark:border-slate-700/50 opacity-50 hover-lift">
                        <div class="flex flex-wrap items-center gap-3 mb-3">
                            <span class="px-3 py-1 rounded-lg bg-slate-400 text-white text-sm font-bold">v3</span>
                            <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">原型</span>
                            <span class="text-sm text-slate-400">2026.02</span>
                        </div>
                        <h3 class="text-xl font-bold mb-2">概念原型</h3>
                        <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
                            一切开始的地方。第一个证明"仿生AI"概念可行的原型，奠定了情绪系统与能量代谢的基础框架。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Resources -->
    <section id="resources" class="py-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16 reveal">
                <h2 class="font-serif text-4xl sm:text-5xl font-bold mb-4">资源与工具</h2>
                <p class="text-slate-500 dark:text-slate-400 text-lg">模型、代码、文档，以及让 OLA 继续成长所需的一切。</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="reveal group p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-sky-500/20 group-hover:scale-110 transition">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">源代码</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">OLA-H1 Pro v5.2 完整训练代码，包含所有仿生机制实现。</p>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 transition">
                        查看代码
                        <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>

                <div class="reveal group p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift" style="transition-delay: 0.1s">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">架构白皮书</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">详细的设计决策、数学原理与实验结果，理解 OLA 的每一根神经。</p>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition">
                        阅读文档
                        <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>

                <div class="reveal group p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift" style="transition-delay: 0.2s">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">训练语料</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">60GB 高质量小说文本，OLA 的"生命经验"来源。</p>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 transition">
                        获取数据
                        <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>

                <div class="reveal group p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift" style="transition-delay: 0.3s">
                    <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <h3 class="text-xl font-bold mb-2">模型权重</h3>
                    <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">预训练 checkpoint，可直接加载继续训练或推理。</p>
                    <a href="#" class="inline-flex items-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 transition">
                        下载权重
                        <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </a>
                </div>

                <div class="reveal group p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-700/50 hover-lift md:col-span-2 lg:col-span-2" style="transition-delay: 0.4s">
                    <div class="flex flex-col md:flex-row md:items-center gap-6">
                        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition flex-shrink-0">
                            <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </div>
                        <div class="flex-1">
                            <h3 class="text-xl font-bold mb-2">加入社区</h3>
                            <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">OLA-H1 由 Kimi 与 zimi 共同设计。欢迎开发者、研究者与爱好者参与讨论，一起探索仿生AI的边界。</p>
                            <div class="flex flex-wrap gap-3">
                                <a href="#" class="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-medium hover:shadow-lg transition">参与讨论</a>
                                <a href="#" class="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium hover:border-sky-300 dark:hover:border-sky-700 transition">贡献代码</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-16 border-t border-slate-200 dark:border-slate-800 relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg shadow-sky-500/20">
                    O
                </div>
                <h3 class="font-serif text-2xl font-bold mb-2">OLA-H1</h3>
                <p class="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
                    最高级的成长是整合。<br>
                    Designed by <span class="text-sky-600 dark:text-sky-400 font-medium">Kimi</span> & <span class="text-indigo-600 dark:text-indigo-400 font-medium">zimi</span>
                </p>
                <div class="flex items-center space-x-6 text-sm text-slate-400 dark:text-slate-500">
                    <a href="#" class="hover:text-sky-600 dark:hover:text-sky-400 transition">文档</a>
                    <a href="#" class="hover:text-sky-600 dark:hover:text-sky-400 transition">GitHub</a>
                    <a href="#" class="hover:text-sky-600 dark:hover:text-sky-400 transition">论文</a>
                    <a href="#" class="hover:text-sky-600 dark:hover:text-sky-400 transition">联系</a>
                </div>
                <div class="mt-8 text-xs text-slate-400 dark:text-slate-600">
                    被动感受世界，主动探索世界。
                </div>
            </div>
        </div>
    </footer>

    <script>
        // ===== Living Background Canvas =====
        const canvas = document.getElementById('lifeCanvas');
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let isDark = false;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.3;
                this.speedY = (Math.random() - 0.5) * 0.3;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.life = Math.random() * 100 + 100;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life--;
                
                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    this.speedX -= dx * 0.0001;
                    this.speedY -= dy * 0.0001;
                }
                
                if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const color = isDark ? `147, 197, 253` : `14, 165, 233`;
                ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 80; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        const alpha = (1 - dist / 120) * 0.15;
                        const color = isDark ? `147, 197, 253` : `14, 165, 233`;
                        ctx.strokeStyle = `rgba(${color}, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();

        // Mouse tracking
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Memory trail
            if (Math.random() > 0.7) {
                const trail = document.createElement('div');
                trail.className = 'memory-trail';
                trail.style.left = e.clientX + 'px';
                trail.style.top = e.clientY + 'px';
                const colors = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899'];
                trail.style.background = colors[Math.floor(Math.random() * colors.length)];
                document.body.appendChild(trail);
                setTimeout(() => trail.remove(), 2000);
            }
        });

        // ===== Theme Toggle =====
        function toggleTheme() {
            document.documentElement.classList.toggle('dark');
            isDark = document.documentElement.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        }
        
        if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
            isDark = true;
        }

        // ===== Smooth Scroll =====
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // ===== Scroll Reveal =====
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

        // ===== Neurotransmitter Simulation =====
        function updateVitals() {
            // Simulate realistic fluctuations
            const serotonin = 0.5 + Math.sin(Date.now() / 8000) * 0.2 + Math.random() * 0.1;
            const dopamine = 0.4 + Math.sin(Date.now() / 6000 + 1) * 0.15 + Math.random() * 0.1;
            const noradrenaline = 0.6 + Math.sin(Date.now() / 5000 + 2) * 0.2 + Math.random() * 0.1;
            const energy = 60 + Math.sin(Date.now() / 10000) * 15 + Math.random() * 5;
            
            document.getElementById('serotoninBar').style.width = (serotonin * 100) + '%';
            document.getElementById('serotoninVal').textContent = serotonin.toFixed(2);
            document.getElementById('dopamineBar').style.width = (dopamine * 100) + '%';
            document.getElementById('dopamineVal').textContent = dopamine.toFixed(2);
            document.getElementById('noradrenalineBar').style.width = (noradrenaline * 100) + '%';
            document.getElementById('noradrenalineVal').textContent = noradrenaline.toFixed(2);
            document.getElementById('energyBar').style.width = energy + '%';
            document.getElementById('energyVal').textContent = Math.round(energy) + '%';
            
            // Mood text
            const moodEl = document.getElementById('moodText');
            if (noradrenaline > 0.7) {
                moodEl.textContent = '警觉而专注。去甲肾上腺素偏高，意味着它正处于积极探索的状态。';
            } else if (dopamine > 0.6) {
                moodEl.textContent = '愉悦而好奇。多巴胺水平上升，它正在从学习中获取奖励感。';
            } else if (serotonin > 0.7) {
                moodEl.textContent = '平静而满足。血清素充足，它感到安全和稳定。';
            } else if (energy < 40) {
                moodEl.textContent = '疲惫而需要休息。能量储备下降，它需要"睡眠"来恢复。';
            } else {
                moodEl.textContent = '平衡而开放。各项指标处于正常范围，它准备好接收新的经验。';
            }
        }
        
        setInterval(updateVitals, 3000);
        updateVitals();

        // ===== Navbar scroll effect =====
        window.addEventListener('scroll', () => {
            const nav = document.getElementById('navbar');
            if (window.scrollY > 50) {
                nav.classList.add('shadow-lg');
            } else {
                nav.classList.remove('shadow-lg');
            }
        });
    </script>
</body>
</html>'''

with open('/mnt/agents/output/ola_h1_website_v3_living.html', 'w', encoding='utf-8') as f:
    f.write(html_v3)

print("Living Website 已生成")
print(f"文件大小: {len(html_v3)} 字符")