document.addEventListener('DOMContentLoaded', () => {
    
    // --- NUEVO EFECTO MOUSE: MARIPOSAS ---
    let colorToggle = false; 

    document.addEventListener('mousemove', (e) => {
        // Reducimos frecuencia para no saturar
        if(Math.random() > 0.2) return;

        // Crear mariposa
        const butterfly = document.createElement('div');
        butterfly.classList.add('magic-butterfly');
        
        // Alternar color (dorado por defecto, azul si tiene clase .blue)
        if (colorToggle) {
            butterfly.classList.add('blue');
        }
        colorToggle = !colorToggle; 

        // Posición mouse
        butterfly.style.left = e.pageX + 'px';
        butterfly.style.top = e.pageY + 'px';
        
        document.body.appendChild(butterfly);

        // Eliminar después de 1 segundo
        setTimeout(() => {
            butterfly.remove();
        }, 1000);
    });

    // --- ELEMENTOS PRINCIPALES ---
    const enterScreen = document.getElementById('enter-screen');
    const enterBtn = document.getElementById('enter-btn');
    const mainLayout = document.getElementById('main-layout');
    const typingText = document.getElementById('typing-text');
    const audio = document.getElementById('audio');
    const vinyl = document.getElementById('vinyl');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');

    // --- ENTRADA ---
    if(enterBtn) {
        enterBtn.addEventListener('click', () => {
            enterScreen.style.opacity = '0';
            
            setTimeout(() => {
                enterScreen.style.display = 'none';
                mainLayout.classList.remove('hidden-layout');
                
                setTimeout(() => {
                    const navMenu = document.querySelector('.nav-menu');
                    if(navMenu) navMenu.classList.add('animate-buttons');
                }, 300);

                initTypewriter();
                playMusic();
            }, 800);
        });
    }

    // --- MAQUINA DE ESCRIBIR ---
    const welcomeMsg = "La elegancia no es solo belleza, es también la forma de pensar, la forma de moverte.";
    function initTypewriter() {
        if(!typingText) return;
        let i = 0;
        typingText.innerHTML = "";
        function type() {
            if (i < welcomeMsg.length) {
                typingText.innerHTML += welcomeMsg.charAt(i);
                i++;
                setTimeout(type, 50); 
            }
        }
        type();
    }

    // --- GESTIÓN DE MODALES ---
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) {
            modal.classList.add('active');
            mainLayout.style.filter = "blur(10px) grayscale(50%)";
            mainLayout.style.transform = "scale(0.98)";
            
            if(modalId === 'modal-gallery') {
                setTimeout(() => {
                    updateGallery3D();
                }, 50);
            }
        }
    };

    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if(modal) modal.classList.remove('active');
        mainLayout.style.filter = "none";
        mainLayout.style.transform = "scale(1)";
    };
    
    window.onclick = (e) => {
        if (e.target.classList.contains('modal')) closeModal(e.target.id);
    };

    // --- GALERÍA 3D ---
    const galleryImages = [
        "https://xatimg.com/image/UCQwTE98gue9.jpg",
        "https://xatimg.com/image/IgoLKiYoP4US.jpg",
        "https://xatimg.com/image/zW5u9rAT5bGG.jpg",
        "https://xatimg.com/image/PvR3iKQx9OaC.jpg",
        "https://xatimg.com/image/BNX5ggQBfmVQ.jpg",
        "https://xatimg.com/image/eqCh9ZG6GvqM.jpg",
    ];
    
    const carouselTrack = document.getElementById('carousel-3d-track');
    let galleryIndex = 0; 

    if(carouselTrack) {
        carouselTrack.innerHTML = "";
        galleryImages.forEach((src, i) => {
            const card = document.createElement('div');
            card.className = 'card-3d-gold';
            card.innerHTML = `<img src="${src}" alt="Img ${i}" style="width:100%;height:100%;object-fit:cover;">`;
            card.onclick = () => { galleryIndex = i; updateGallery3D(); };
            carouselTrack.appendChild(card);
        });
    }

    window.updateGallery3D = () => {
        const cards = document.querySelectorAll('#carousel-3d-track .card-3d-gold');
        if(!cards.length) return;
        
        cards.forEach(c => c.classList.remove('active'));
        if(cards[galleryIndex]) cards[galleryIndex].classList.add('active');

        const container = document.querySelector('.gallery-container-3d');
        if(!container) return;
        
        const containerWidth = container.offsetWidth;
        const cardWidth = cards[0].offsetWidth; 
        const cardMargin = 40; 
        const fullCardSpace = cardWidth + cardMargin;

        const centerPosition = (containerWidth / 2) - (galleryIndex * fullCardSpace) - (cardWidth / 2) - 20;

        if(carouselTrack) carouselTrack.style.transform = `translateX(${centerPosition}px)`;
    };

    window.moveGallery = (dir) => {
        galleryIndex += dir;
        if(galleryIndex < 0) galleryIndex = galleryImages.length - 1;
        if(galleryIndex >= galleryImages.length) galleryIndex = 0;
        updateGallery3D();
    };

    // --- MÚSICA ---
    const playlist = [
        { title: "Ivonny Bonita", artist: "Karol G", src: "audio/KAROL G - Ivonny Bonita.mp3" },
    ];
    let sIdx = 0; let isPlaying = false; let pInt;

    function loadMusic(i) {
        audio.src = playlist[i].src;
        const titleEl = document.getElementById('song-title');
        const artistEl = document.getElementById('song-artist');
        if(titleEl) titleEl.innerText = playlist[i].title;
        if(artistEl) artistEl.innerText = playlist[i].artist;
    }
    
    window.playMusic = () => {
        audio.play().then(() => {
            isPlaying = true;
            if(vinyl) vinyl.classList.add('vinyl-spin');
            if(playIcon) playIcon.className = "fas fa-pause";
            if(pInt) clearInterval(pInt);
            pInt = setInterval(() => {
                if(progressBar && audio.duration) {
                    progressBar.style.width = (audio.currentTime/audio.duration)*100 + "%";
                }
            }, 100);
        }).catch(() => {});
    };
    
    window.togglePlay = () => {
        if(isPlaying) {
            audio.pause(); isPlaying = false;
            if(vinyl) vinyl.classList.remove('vinyl-spin');
            if(playIcon) playIcon.className = "fas fa-play";
            clearInterval(pInt);
        } else {
            playMusic();
        }
    };
    
    window.nextSong = () => { sIdx=(sIdx+1)%playlist.length; loadMusic(sIdx); playMusic(); };
    window.prevSong = () => { sIdx=(sIdx-1+playlist.length)%playlist.length; loadMusic(sIdx); playMusic(); };
    
    if(audio) loadMusic(0);

    window.addEventListener('resize', () => {
        updateGallery3D();
    });

    // --- PROTECCIÓN (BLOQUEO DE INSPECTOR) ---
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    document.addEventListener('keydown', (e) => {
        // Bloquear F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            return false;
        }
        // Bloquear Ctrl+Shift+I, J, C
        if (e.ctrlKey && e.shiftKey && 
           (e.key === 'I' || e.key === 'J' || e.key === 'C' || e.key === 'i' || e.key === 'j' || e.key === 'c')) {
            e.preventDefault();
            return false;
        }
        // Bloquear Ctrl+U
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
            e.preventDefault();
            return false;
        }
    });

}); // <-- ESTE ERA EL CIERRE QUE FALTABA O ESTABA MAL PUESTO
