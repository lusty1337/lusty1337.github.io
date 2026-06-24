document.addEventListener('DOMContentLoaded', () => {
    
    const themeToggleBtn = document.getElementById('theme-toggle');
    const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');
    const darkIcon = document.getElementById('theme-toggle-dark-icon');
    const lightIcon = document.getElementById('theme-toggle-light-icon');
    const mobileDarkIcon = document.getElementById('mobile-theme-toggle-dark-icon');
    const mobileLightIcon = document.getElementById('mobile-theme-toggle-light-icon');

    const userTheme = localStorage.getItem('creator_theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const applyTheme = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            darkIcon.classList.add('hidden');
            lightIcon.classList.remove('hidden');
            mobileDarkIcon.classList.add('hidden');
            mobileLightIcon.classList.remove('hidden');
        } else {
            document.documentElement.classList.remove('dark');
            darkIcon.classList.remove('hidden');
            lightIcon.classList.add('hidden');
            mobileDarkIcon.classList.remove('hidden');
            mobileLightIcon.classList.add('hidden');
        }
    };

    if (userTheme === 'dark' || (!userTheme && systemTheme)) {
        applyTheme(true);
    } else {
        applyTheme(false);
    }

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        applyTheme(!isDark);
        localStorage.setItem('creator_theme', !isDark ? 'dark' : 'light');
    };

    themeToggleBtn.addEventListener('click', toggleTheme);
    mobileThemeToggleBtn.addEventListener('click', toggleTheme);

    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const line1 = document.getElementById('line1');
    const line2 = document.getElementById('line2');
    const line3 = document.getElementById('line3');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    let isMenuOpen = false;

    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            mobileMenu.classList.remove('opacity-0', 'pointer-events-none');
            mobileMenu.classList.add('opacity-100', 'pointer-events-auto');
            
            line1.classList.add('translate-y-[8px]', 'rotate-45');
            line2.classList.add('opacity-0');
            line3.classList.add('-translate-y-[8px]', '-rotate-45');
            document.body.style.overflow = 'hidden'; 
        } else {
            mobileMenu.classList.add('opacity-0', 'pointer-events-none');
            mobileMenu.classList.remove('opacity-100', 'pointer-events-auto');
            
            // реверс анимации кнопки
            line1.classList.remove('translate-y-[8px]', 'rotate-45');
            line2.classList.remove('opacity-0');
            line3.classList.remove('-translate-y-[8px]', '-rotate-45');
            document.body.style.overflow = ''; 
        }
    };

    hamburger.addEventListener('click', toggleMenu);
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (isMenuOpen) toggleMenu();
        });
    });

    const cards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalImg = document.getElementById('modal-img');
    const modalContent = modal.querySelector('.modal-content');

    let modalCloseTimeout1;
    let modalCloseTimeout2;

    const openModal = (title, desc, imgSrc) => {
        clearTimeout(modalCloseTimeout1);
        clearTimeout(modalCloseTimeout2);
        
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        
        if (imgSrc) {
            modalImg.src = imgSrc;
            if (modalImg.complete) {
                modalImg.classList.remove('opacity-0');
            } else {
                modalImg.onload = () => {
                    modalImg.classList.remove('opacity-0');
                };
            }
        }
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modal.classList.add('opacity-100', 'pointer-events-auto');
        
        setTimeout(() => {
            modalContent.classList.remove('scale-95');
            modalContent.classList.add('scale-100');
        }, 10);
        
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modalContent.classList.remove('scale-100');
        modalContent.classList.add('scale-95');
        
        modal.classList.remove('opacity-100', 'pointer-events-auto');
        modal.classList.add('opacity-0', 'pointer-events-none');
        
        modalCloseTimeout1 = setTimeout(() => {
            document.body.style.overflow = '';
            modalImg.classList.add('opacity-0');
            modalCloseTimeout2 = setTimeout(() => { modalImg.src = ''; }, 300);
        }, 300);
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const desc = card.getAttribute('data-desc');
            const imgSrc = card.getAttribute('data-img');
            openModal(title, desc, imgSrc);
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // закрытие по esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('opacity-0')) {
            closeModal();
        }
    });

    const contactForm = document.getElementById('contact-form');
    const messageTextarea = document.getElementById('message');

    // автовысота под контент
    messageTextarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = `<span class="relative z-10">Отправлено!</span>`;
        btn.classList.add('bg-green-600', 'text-white', 'dark:bg-green-500', 'dark:text-white');
        
        contactForm.reset();
        messageTextarea.style.height = 'auto'; 
        
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.classList.remove('bg-green-600', 'text-white', 'dark:bg-green-500', 'dark:text-white');
        }, 3000);
    });

    const toastContainer = document.getElementById('toast-container');
    const viewLiveBtn = document.getElementById('view-live-btn');

    const showToast = (message) => {
        const toast = document.createElement('div');
        toast.className = 'w-full max-w-sm flex items-center gap-4 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-[0_10px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-2xl p-4 transform transition-all duration-500 ease-expo translate-y-10 opacity-0 pointer-events-auto';
        
        const iconHtml = `
            <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#1da1f2] text-white">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
        `;
        
        const textHtml = `<p class="text-sm font-medium text-dark dark:text-light leading-snug">${message}</p>`;
        
        toast.innerHTML = iconHtml + textHtml;
        toastContainer.appendChild(toast);
        
        // форсим перерисовку для анимации
        toast.offsetHeight;
        
        toast.classList.remove('translate-y-10', 'opacity-0');

        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 500); 
        }, 4000);
    };

    if (viewLiveBtn) {
        viewLiveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Эта функция недоступна, так как это один из проектов портфолио, а не полноценный ресурс 😉');
        });
    }
});
