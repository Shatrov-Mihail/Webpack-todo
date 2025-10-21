import './styles/main.scss';

import rainAudioUrl from './assets/audio/rain.mp3';
import summerAudioUrl from './assets/audio/summer.mp3';
import winterAudioUrl from './assets/audio/winter.mp3';

import rainImageUrl from './assets/images/rainy-bg.jpg';
import summerImageUrl from './assets/images/summer-bg.jpg';
import winterImageUrl from './assets/images/winter-bg.jpg';

const SOUNDS = [
  { id: 'rain', label: 'Дождь', audio: rainAudioUrl, bg: rainImageUrl },
  { id: 'summer', label: 'Лето', audio: summerAudioUrl, bg: summerImageUrl },
  { id: 'winter', label: 'Осень', audio: winterAudioUrl, bg: winterImageUrl }
];

class SoundManager {
  constructor() {
    this.current = null;
    this.volume = 0.8;
    this.audioMap = new Map();
  }

    preload(soundList) {
    soundList.forEach(s => {
      if (!this.audioMap.has(s.id)) {
        const a = new Audio(s.audio);
        a.preload = 'auto';
        a.loop = true;
        a.volume = this.volume;
        this.audioMap.set(s.id, a);
      }
    });
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    for (const audio of this.audioMap.values()) {
    audio.volume = this.volume;
    }
    if (this.current && this.current.audio) {
      this.current.audio.volume = this.volume;
    }
  }

  async playSound(soundObj, buttonEl) {
    if (this.current && this.current.id === soundObj.id) {
      const a = this.current.audio;
      if (a.paused) {
        try {
          await a.play();
          buttonEl.classList.add('playing');
        } catch (err) {
          console.warn('play() rejected', err);
        }
      } else {
        a.pause();
        buttonEl.classList.remove('playing');
      }
      return;
    }

    this.stopCurrent();

    let audio = this.audioMap.get(soundObj.id);
    if (!audio) {
      audio = new Audio(soundObj.audio);
      audio.preload = 'auto';
      audio.loop = true;
      this.audioMap.set(soundObj.id, audio);
    }

    audio.volume = this.volume;

    try {
      await audio.play();
      this.current = { id: soundObj.id, audio, button: buttonEl };
      document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('playing'));
      buttonEl.classList.add('playing');
    } catch (err) {
      console.warn('Audio play failed', err);
    }

        audio.addEventListener('pause', () => {
      if (this.current && this.current.id === soundObj.id && audio.paused) {
        if (this.current.button) this.current.button.classList.remove('playing');
      }
    });

    audio.addEventListener('ended', () => {
      if (this.current && this.current.id === soundObj.id) {
        if (this.current.button) this.current.button.classList.remove('playing');
        this.current = null;
      }
    });
  }

  stopCurrent() {
    if (this.current && this.current.audio) {
      try {
        this.current.audio.pause();
        this.current.audio.currentTime = 0;
      } catch (e) {
        console.warn('stopCurrent failed', e);
      }
      if (this.current.button) this.current.button.classList.remove('playing');
      this.current = null;
    }
  }
}

function init() {
  const buttonsContainer = document.getElementById('buttonsContainer');
  const volumeInput = document.getElementById('volume');

  const sm = new SoundManager();
   sm.preload(SOUNDS);

   const initialVol = volumeInput && Number(volumeInput.value) ? Number(volumeInput.value) / 100 : 0.8;
  sm.setVolume(initialVol);

    SOUNDS.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'sound-btn';
    btn.type = 'button';
    btn.textContent = s.label;
    btn.dataset.sound = s.id;
    btn.setAttribute('aria-pressed', 'false');

    btn.addEventListener('click', async () => {
      await sm.playSound(s, btn);
            if (s.bg) {
        document.body.style.backgroundImage = `url(${s.bg})`;
      } else {
        document.body.style.backgroundImage = '';
      }
      const isPlaying = btn.classList.contains('playing');
      btn.setAttribute('aria-pressed', String(isPlaying));
    });

    buttonsContainer.appendChild(btn);
  });

    volumeInput.addEventListener('input', (e) => {
    const v = Number(e.target.value) / 100;
    sm.setVolume(v);
  });

    window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
    sm.stopCurrent();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
