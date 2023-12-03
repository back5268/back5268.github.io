const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STRORAGE_KEY = 'PLAYER';

const player = $('.player');
const cd = $('.cd');
const header = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STRORAGE_KEY)) || {},
    songs: [
        {
            name: 'Về Nhà Ăn Tết',
            singer: 'BigDaddy ft. JustaTee ft. Onionn',
            path: 'assets/music/song1.mp3',
            img: 'assets/img/song1.jpg'
        },
        {
            name: 'Tết Đong Đầy',
            singer: 'Khoa x Kay Tran',
            path: 'assets/music/song2.mp3',
            img: 'assets/img/song2.jpg'
        },
        {
            name: 'Chuyến Xe Về Nhà',
            singer: 'Hữu Nhân ft. SanV',
            path: 'assets/music/song3.mp3',
            img: 'assets/img/song3.jpg'
        },
        {
            name: 'Đi Về Nhà',
            singer: 'Đen x Justatee',
            path: 'assets/music/song4.mp3',
            img: 'assets/img/song4.jpg'
        },
        {
            name: 'Trên Taxi Chẳng Muốn Về Nhà',
            singer: 'Hoàng Duyên',
            path: 'assets/music/song5.mp3',
            img: 'assets/img/song5.jpg'
        },
        {
            name: 'TRƯỚC KHI TUỔI TRẺ NÀY ĐÓNG LỐI',
            singer: 'Ngắn x Xám x Dick',
            path: 'assets/music/song6.mp3',
            img: 'assets/img/song6.jpg'
        },
        {
            name: 'SỐNG CHO HẾT ĐỜI THANH XUÂN 2',
            singer: 'BCTM x TNS',
            path: 'assets/music/song7.mp3',
            img: 'assets/img/song7.jpg'
        },
        {
            name: 'Ngày Nào',
            singer: 'Datmaniac ft. Cá Hồi Hoang',
            path: 'assets/music/song8.mp3',
            img: 'assets/img/song8.jpg'
        },
        {
            name: 'Cưới Thôi',
            singer: 'Masew x Masiu x B Ray x TAP',
            path: 'assets/music/song9.mp3',
            img: 'assets/img/song9.jpg'
        },
        {
            name: 'SỐNG CHO HẾT ĐỜI THANH XUÂN',
            singer: 'Dick x Xám x Tuyết',
            path: 'assets/music/song10.mp3',
            img: 'assets/img/song10.png'
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STRORAGE_KEY, JSON.stringify(this.config));
    },

    loadConfig: function() {
        this.isRandom = this.config.isRandom || false;
        this.isRepeat = this.config.isRepeat || false;
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        });
    },

    // Load bài hát hiện tại trên dashboad
    loadCurrentSong: function () {
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
        audio.src = this.currentSong.path;
    },

    handleEvents: function () {
        const _this = this;

        // Xử lý CD khi quay và dừng
        const cdTumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        });
        cdTumbAnimate.pause();

        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            };
        };

        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdTumbAnimate.play();
        };

        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdTumbAnimate.pause();
        };

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 1000);
                progress.value = progressPercent;
            };
        };

        // Xử lý khi kết thúc bài hát
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            };
        };

        // Xử lý khi tua
        progress.onchange = function (e) {
            const seekTime = e.target.value * audio.duration / 100;
            audio.currentTime = seekTime;
        };

        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            };
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            };
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };

        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        };

        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };

        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                };
            };
        };
    },

    // Chuyển bài hát
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <= 0) {
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },

    // Option random song
    playRandomSong: function () {
        let newIndex;

        // Xử lý để một bài hát không lặp lại nhiều lần
        let randomArray = JSON.parse(localStorage.getItem('randomArray')) || [0];
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (randomArray.includes(newIndex));
        randomArray.push(newIndex);
        if (randomArray.length === this.songs.length) {
            randomArray = [newIndex];
        };
        localStorage.setItem('randomArray', JSON.stringify(randomArray));

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    // Chuyển đến bài hát hiện tại trong danh sách
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            });
        }, 200);
    },

    render: function () {
        const htmls = this.songs.map((s, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index} >
                    <div class="thumb"
                        style="background-image: url('${s.img}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${s.name}</h3>
                        <p class="author">${s.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },

    start: function () {
        // Load config từ localstrorage
        this.loadConfig();

        // Định nghĩa thuộc tính cho object
        this.defineProperties();

        // Tải thông tin bài hát hiện tại
        this.loadCurrentSong();

        // Xử lý các sự kiện dashboad
        this.handleEvents();

        // Render playlist
        this.render();

        // Set option từ localstrorage
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    },
}

app.start();