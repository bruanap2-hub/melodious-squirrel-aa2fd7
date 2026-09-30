// A quiet, synthesized soundscape. No external audio or autoplay dependency.
class MagicAudio {
  context = null;
  master = null;
  enabled = false;
  async toggle() {
    if (!this.context) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return false;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = 0;
      this.master.connect(this.context.destination);
      [130.81, 196, 261.63, 329.63].forEach((frequency, i) => {
        const oscillator = this.context.createOscillator();
        const gain = this.context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.value = 0.045 / (i + 1);
        oscillator.connect(gain);
        gain.connect(this.master);
        oscillator.start();
        const lfo = this.context.createOscillator();
        const depth = this.context.createGain();
        lfo.frequency.value = 0.09 + i * 0.025;
        depth.gain.value = 0.01 / (i + 1);
        lfo.connect(depth);
        depth.connect(gain.gain);
        lfo.start();
      });
    }
    try {
      await this.context.resume();
    } catch {
      return false;
    }
    this.enabled = !this.enabled;
    this.master.gain.setTargetAtTime(
      this.enabled ? 0.6 : 0,
      this.context.currentTime,
      0.4,
    );
    return this.enabled;
  }
  chime(note = 659.25) {
    if (!this.enabled || !this.context) return;
    [note, note * 1.5, note * 2].forEach((frequency, i) => {
      const oscillator = this.context.createOscillator();
      const envelope = this.context.createGain();
      const now = this.context.currentTime + i * 0.12;
      oscillator.frequency.value = frequency;
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(0.07, now + 0.025);
      envelope.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
      oscillator.connect(envelope);
      envelope.connect(this.master);
      oscillator.start(now);
      oscillator.stop(now + 2.5);
      oscillator.onended = () => {
        oscillator.disconnect();
        envelope.disconnect();
      };
    });
  }
  pause() {
    if (this.context) this.context.suspend().catch(() => {});
  }
  resume() {
    if (this.context && this.enabled) this.context.resume().catch(() => {});
  }
}
export const magicAudio = new MagicAudio();
