class SoundManager {
    // Convert an AudioBuffer to a WAV file Blob
    bufferToWave(abuffer, len) {
        const numOfChan = abuffer.numberOfChannels;
        const length = len * numOfChan * 2 + 44;
        const buffer = new ArrayBuffer(length);
        const view = new DataView(buffer);
        let offset = 0;
        const writeString = (str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset + i, str.charCodeAt(i));
            }
        };

        // Write WAV header
        writeString('RIFF');
        offset += 4;
        view.setUint32(offset, length - 8, true);
        offset += 4;
        writeString('WAVE');
        offset += 4;
        writeString('fmt ');
        offset += 4;
        view.setUint32(offset, 16, true);
        offset += 4;
        view.setUint16(offset, 1, true);
        offset += 2;
        view.setUint16(offset, numOfChan, true);
        offset += 2;
        view.setUint32(offset, abuffer.sampleRate, true);
        offset += 4;
        view.setUint32(offset, abuffer.sampleRate * 2 * numOfChan, true);
        offset += 4;
        view.setUint16(offset, numOfChan * 2, true);
        offset += 2;
        view.setUint16(offset, 16, true);
        offset += 2;
        writeString('data');
        offset += 4;
        view.setUint32(offset, length - offset - 4, true);
        offset += 4;

        // Write PCM data
        const channelData = abuffer.getChannelData(0);
        for (let i = 0; i < len; i++) {
            view.setInt16(offset, channelData[i] * 0x7FFF, true);
            offset += 2;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    }

    constructor() {
        this.sounds = {
            lifeChange: null,
            lifeGain: null,
            lifeLoss: null,
            reset: null,
            poison: null,
            commander: null,
            monarch: null,
            initiative: null,
            ascend: null,
            playerSelect: null,
            click: null,
            celebrate: null
        };
        this.enabled = true;
    }

    init() {
        // Create a click sound using the Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const clickBuffer = audioContext.createBuffer(1, 1000, audioContext.sampleRate);
        const channelData = clickBuffer.getChannelData(0);
        
        // Generate a simple click sound
        for (let i = 0; i < clickBuffer.length; i++) {
            // Quick attack, quick decay
            channelData[i] = Math.sin(i * 0.05) * Math.exp(-i * 0.01);
        }

        // Convert the buffer to an Audio element
        const clickBlob = this.bufferToWave(clickBuffer, clickBuffer.length);
        this.sounds.click = new Audio(URL.createObjectURL(clickBlob));
        this.sounds.click.volume = 0.2; // Lower volume for click

        // Create a celebration sound
        const celebrationBuffer = audioContext.createBuffer(1, 44100, audioContext.sampleRate);
        const celebrationData = celebrationBuffer.getChannelData(0);
        
        // Generate a celebratory sound (ascending tones with some randomness)
        for (let i = 0; i < celebrationBuffer.length; i++) {
            const t = i / audioContext.sampleRate;
            const frequency = 440 + (t * 200); // Rising pitch
            celebrationData[i] = (
                Math.sin(2 * Math.PI * frequency * t) * 0.5 + // Base tone
                Math.sin(4 * Math.PI * frequency * t) * 0.25 + // Harmonic
                Math.random() * 0.1 // Sparkle
            ) * Math.exp(-t * 4); // Decay
        }

        // Convert the buffer to an Audio element
        const celebrationBlob = this.bufferToWave(celebrationBuffer, celebrationBuffer.length);
        this.sounds.celebrate = new Audio(URL.createObjectURL(celebrationBlob));
        this.sounds.celebrate.volume = 0.3; // Moderate volume for celebration


        // Set volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = 0.5;
            }
        });
    }

    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    play(soundName) {
        if (!this.enabled) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            // Stop and reset the sound if it's already playing
            sound.pause();
            sound.currentTime = 0;
            // Play the sound
            sound.play().catch(error => {
                console.log('Error playing sound:', error);
            });
        }
    }

    playLifeChange(amount) {
        if (!this.enabled) return;
        this.play('click');
    }
}

// Create and add to window object
window.soundManager = new SoundManager();