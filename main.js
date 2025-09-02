// ============================================================================
// メインJavaScriptファイル - ポートフォリオ機能実装
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // GSAP プラグイン登録
    gsap.registerPlugin(TextPlugin, ScrollTrigger, ScrollToPlugin);
    
    // ============================================================================
    // モバイルナビゲーション機能
    // ============================================================================
    
    class MobileNavigation {
        constructor() {
            this.toggleButton = document.querySelector('.nav__toggle');
            this.menu = document.querySelector('.nav__menu');
            this.menuItems = document.querySelectorAll('.nav__link');
            this.isMenuOpen = false;
            
            this.init();
        }
        
        init() {
            if (this.toggleButton && this.menu) {
                this.toggleButton.addEventListener('click', (e) => this.toggleMenu(e));
                this.menuItems.forEach(item => {
                    item.addEventListener('click', () => this.closeMenu());
                });
                
                // ESCキーでメニュー閉じる
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isMenuOpen) {
                        this.closeMenu();
                    }
                });
                
                // 外側クリックでメニュー閉じる
                document.addEventListener('click', (e) => {
                    if (this.isMenuOpen && 
                        !this.menu.contains(e.target) && 
                        !this.toggleButton.contains(e.target)) {
                        this.closeMenu();
                    }
                });
            }
        }
        
        toggleMenu(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (this.isMenuOpen) {
                this.closeMenu();
            } else {
                this.openMenu();
            }
        }
        
        openMenu() {
            this.isMenuOpen = true;
            this.toggleButton.setAttribute('aria-expanded', 'true');
            this.menu.classList.add('nav__menu--active');
            
            // 최初のメニューアイテムにフォーカス
            const firstMenuItem = this.menu.querySelector('.nav__link');
            if (firstMenuItem) {
                setTimeout(() => firstMenuItem.focus(), 100);
            }
        }
        
        closeMenu() {
            this.isMenuOpen = false;
            this.toggleButton.setAttribute('aria-expanded', 'false');
            this.menu.classList.remove('nav__menu--active');
        }
    }
    
    // ============================================================================
    // スムーススクロール機能
    // ============================================================================
    
    class SmoothScroll {
        constructor() {
            this.init();
        }
        
        init() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => this.handleClick(e, anchor));
            });
        }
        
        handleClick(e, anchor) {
            e.preventDefault();
            
            const targetId = anchor.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (!targetElement) return;
            
            // ヘッダー高さ分のオフセット計算
            const header = document.querySelector('.header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            gsap.to(window, {
                duration: 0.8,
                scrollTo: { y: targetPosition },
                ease: "power2.inOut"
            });
        }
    }
    
    // ============================================================================
    // スクロールインジケーター機能
    // ============================================================================
    
    class ScrollIndicator {
        constructor() {
            this.indicator = document.querySelector('.scroll-indicator');
            this.init();
        }
        
        init() {
            if (!this.indicator) return;
            
            window.addEventListener('scroll', () => this.handleScroll());
            this.handleScroll(); // 初期状態設定
        }
        
        handleScroll() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // ページ下部に近づいたら隠す
            const hideThreshold = documentHeight - windowHeight - 200;
            
            if (scrollTop > windowHeight * 0.5 && scrollTop < hideThreshold) {
                this.indicator.classList.remove('scroll-indicator--hidden');
            } else {
                this.indicator.classList.add('scroll-indicator--hidden');
            }
        }
    }
    
    // ============================================================================
    // ヘッダー動作制御
    // ============================================================================
    
    class HeaderController {
        constructor() {
            this.header = document.querySelector('.header');
            this.lastScrollTop = 0;
            this.init();
        }
        
        init() {
            if (!this.header) return;
            
            window.addEventListener('scroll', () => this.handleScroll());
            this.handleScroll(); // 初期状態設定
        }
        
        handleScroll() {
            const scrollTop = window.pageYOffset;
            
            // スクロール時の背景変更
            if (scrollTop > 100) {
                this.header.classList.add('header--scrolled');
            } else {
                this.header.classList.remove('header--scrolled');
            }
            
            // 上方向スクロール時にヘッダー表示、下方向で隠す（オプション）
            if (scrollTop > this.lastScrollTop && scrollTop > 200) {
                // 下方向スクロール
                this.header.classList.add('header--hidden');
            } else {
                // 上方向スクロール
                this.header.classList.remove('header--hidden');
            }
            
            this.lastScrollTop = scrollTop;
        }
    }
    
    // ============================================================================
    // アクティブナビゲーション制御
    // ============================================================================
    
    class ActiveNavigation {
        constructor() {
            this.navLinks = document.querySelectorAll('.nav__link[href^="#"]');
            this.sections = [];
            this.init();
        }
        
        init() {
            // セクションIDを取得
            this.navLinks.forEach(link => {
                const targetId = link.getAttribute('href').substring(1);
                const section = document.getElementById(targetId);
                if (section) {
                    this.sections.push({
                        id: targetId,
                        element: section,
                        link: link
                    });
                }
            });
            
            window.addEventListener('scroll', () => this.updateActiveLink());
            this.updateActiveLink(); // 初期状態設定
        }
        
        updateActiveLink() {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            let currentSection = '';
            
            this.sections.forEach(section => {
                const sectionTop = section.element.offsetTop - 150;
                const sectionHeight = section.element.offsetHeight;
                
                if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                    currentSection = section.id;
                }
            });
            
            // アクティブクラスを更新
            this.navLinks.forEach(link => {
                link.classList.remove('nav__link--active');
                const linkTarget = link.getAttribute('href').substring(1);
                if (linkTarget === currentSection) {
                    link.classList.add('nav__link--active');
                }
            });
        }
    }
    
    // ============================================================================
    // アニメーション機能
    // ============================================================================
    
    class AnimationController {
        constructor() {
            this.init();
        }
        
        init() {
            this.initScrollAnimations();
            this.initCounterAnimations();
        }
        
        initScrollAnimations() {
            // フェードインアニメーション
            gsap.utils.toArray('.skill-card, .project-card').forEach(element => {
                gsap.fromTo(element, 
                    {
                        opacity: 0,
                        y: 50
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: element,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
            
            // セクションタイトルのアニメーション
            gsap.utils.toArray('.section-title').forEach(title => {
                gsap.fromTo(title,
                    {
                        opacity: 0,
                        y: 30
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: title,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }
        
        initCounterAnimations() {
            // 数値カウンターアニメーション（プロジェクト数など）
            const counters = document.querySelectorAll('[data-counter]');
            counters.forEach(counter => {
                const targetNumber = parseInt(counter.dataset.counter);
                
                gsap.fromTo(counter,
                    { textContent: 0 },
                    {
                        textContent: targetNumber,
                        duration: 2,
                        ease: "power2.out",
                        snap: { textContent: 1 },
                        scrollTrigger: {
                            trigger: counter,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }
    }
    
    // ============================================================================
    // パフォーマンス最適化
    // ============================================================================
    
    class PerformanceOptimizer {
        constructor() {
            this.init();
        }
        
        init() {
            this.lazyLoadImages();
            this.prefetchLinks();
        }
        
        lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    });
                });
                
                images.forEach(img => imageObserver.observe(img));
            } else {
                // フォールバック: IntersectionObserverが使えない場合
                images.forEach(img => {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                });
            }
        }
        
        prefetchLinks() {
            // 外部リンクの先読み（オプション）
            const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
            externalLinks.forEach(link => {
                link.setAttribute('rel', 'noopener noreferrer');
            });
        }
    }
    
    // ============================================================================
    // 初期化処理
    // ============================================================================
    
    // すべての機能を初期化
    const mobileNav = new MobileNavigation();
    const smoothScroll = new SmoothScroll();
    const scrollIndicator = new ScrollIndicator();
    const headerController = new HeaderController();
    const activeNavigation = new ActiveNavigation();
    const animationController = new AnimationController();
    const performanceOptimizer = new PerformanceOptimizer();
    
    // Reduced motionを優先するユーザーの場合、アニメーションを無効化
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.clear();
        gsap.set("*", {clearProps: "all"});
    }
    
    console.log('📱 포트폴리오 초기화 완료');
});