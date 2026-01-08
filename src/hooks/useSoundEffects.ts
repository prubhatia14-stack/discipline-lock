/**
 * Sound effects utility using Web Audio API
 * Creates subtle, premium sounds for UI interactions
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      return null;
    }
  }
  
  // Resume context if suspended (required for iOS)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
  
  return audioContext;
}

type SoundType = 'tap' | 'success' | 'hold-tick' | 'error';

const soundConfigs: Record<SoundType, {
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume: number;
  attack?: number;
  decay?: number;
}> = {
  tap: {
    frequency: 800,
    duration: 0.05,
    type: 'sine',
    volume: 0.08,
    attack: 0.005,
    decay: 0.03,
  },
  'hold-tick': {
    frequency: 600,
    duration: 0.03,
    type: 'sine',
    volume: 0.05,
    attack: 0.002,
    decay: 0.02,
  },
  success: {
    frequency: 880,
    duration: 0.25,
    type: 'sine',
    volume: 0.12,
    attack: 0.01,
    decay: 0.2,
  },
  error: {
    frequency: 220,
    duration: 0.15,
    type: 'triangle',
    volume: 0.1,
    attack: 0.01,
    decay: 0.1,
  },
};

export function playSound(type: SoundType = 'tap') {
  const ctx = getAudioContext();
  if (!ctx) return;

  const config = soundConfigs[type];
  const now = ctx.currentTime;

  // Create oscillator
  const oscillator = ctx.createOscillator();
  oscillator.type = config.type;
  oscillator.frequency.setValueAtTime(config.frequency, now);

  // Create gain node for envelope
  const gainNode = ctx.createGain();
  gainNode.gain.setValueAtTime(0, now);
  
  // Attack
  gainNode.gain.linearRampToValueAtTime(config.volume, now + (config.attack || 0.01));
  
  // Decay
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + config.duration);

  // For success sound, add a pleasant ascending arpeggio
  if (type === 'success') {
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.08); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.16); // G5
  }

  // Connect and play
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.start(now);
  oscillator.stop(now + config.duration);

  // Cleanup
  oscillator.onended = () => {
    oscillator.disconnect();
    gainNode.disconnect();
  };
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(freq, now);
    
    const noteStart = now + i * 0.08;
    const noteDuration = 0.3 - i * 0.05;
    
    gainNode.gain.setValueAtTime(0, noteStart);
    gainNode.gain.linearRampToValueAtTime(0.1 - i * 0.02, noteStart + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(noteStart);
    oscillator.stop(noteStart + noteDuration);
    
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  });
}

export function useSoundEffects() {
  return {
    tap: () => playSound('tap'),
    success: () => playSuccessChime(),
    holdTick: () => playSound('hold-tick'),
    error: () => playSound('error'),
    play: playSound,
  };
}
