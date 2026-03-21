/**
 * Bootstrap UI Sounds - Web Audio API sound feedback for Bootstrap components.
 * Sounds are off by default; enable via data-ui-sounds on <html>, <body>, or a component.
 */
(function () {
  'use strict';

  let audioContext = null;
  let globalVolume = 1.0; // normalized 0–1, driven by data-ui-sounds-volume attribute (0–100)

  function readVolumeAttribute() {
    const html = document.documentElement;
    const body = document.body;
    const raw = (html && html.getAttribute('data-ui-sounds-volume')) ||
                (body && body.getAttribute('data-ui-sounds-volume'));
    if (raw !== null && raw !== '') {
      const num = Number(raw);
      if (!isNaN(num)) globalVolume = Math.max(0, Math.min(100, num)) / 100;
    }
  }

  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  function isSoundsEnabled(element) {
    if (!element || !element.getAttribute) return false;
    const el = element.closest ? element.closest('[data-ui-sounds]') : null;
    if (el) {
      const v = el.getAttribute('data-ui-sounds');
      return v === '' || v === 'true' || v === '1';
    }
    const doc = element.ownerDocument || document;
    const html = doc.documentElement;
    const body = doc.body;
    const onHtml = html && html.getAttribute('data-ui-sounds');
    const onBody = body && body.getAttribute('data-ui-sounds');
    const v = onHtml || onBody;
    return v === '' || v === 'true' || v === '1';
  }

  const soundPresets = {
    click: { freq: 800, duration: 0.05, type: 'sine', volume: 0.28 },
    open: { freq: 520, duration: 0.07, type: 'sine', volume: 0.26 },
    close: { freq: 320, duration: 0.06, type: 'sine', volume: 0.26 },
    expand: { freq: 600, duration: 0.06, type: 'sine', volume: 0.26 },
    collapse: { freq: 400, duration: 0.06, type: 'sine', volume: 0.26 },
    alert: { freq: 660, duration: 0.06, type: 'sine', volume: 0.24 },
    focus: { freq: 440, duration: 0.04, type: 'sine', volume: 0.2 },
    change: { freq: 550, duration: 0.045, type: 'sine', volume: 0.22 },
    toast: { freq: 580, duration: 0.06, type: 'sine', volume: 0.24 },
    detail: { freq: 500, duration: 0.055, type: 'sine', volume: 0.26 },
    closeButton: { freq: 380, duration: 0.05, type: 'sine', volume: 0.24 },
    switchOn: { freq: 780, duration: 0.05, type: 'square', volume: 0.25 },
    switchOff: { freq: 420, duration: 0.055, type: 'triangle', volume: 0.23 },
    checkbox: { freq: 620, duration: 0.045, type: 'square', volume: 0.24 },
    radio: { freq: 680, duration: 0.045, type: 'triangle', volume: 0.23 },
    range: { freq: 500, duration: 0.04, type: 'sine', volume: 0.22 },
    formInvalid: { freq: 240, duration: 0.12, type: 'sawtooth', volume: 0.22 },
    formValid: { freq: 520, duration: 0.1, type: 'triangle', volume: 0.22 }
  };

  function playSound(type, element) {
    if (!isSoundsEnabled(element)) return;
    if (globalVolume <= 0) return;
    const preset = soundPresets[type] || soundPresets.click;
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = preset.type;
      osc.frequency.setValueAtTime(preset.freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(preset.volume * globalVolume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + preset.duration);
      osc.start(now);
      osc.stop(now + preset.duration);
    } catch (_) {}
  }

  // Close / dismiss (btn-close and data-bs-dismiss often lack .btn, so handle first)
  document.addEventListener('click', function (e) {
    const closeEl = e.target && e.target.closest ? e.target.closest('.btn-close, [data-bs-dismiss]') : null;
    if (closeEl) {
      playSound('closeButton', closeEl);
      return;
    }
  }, true);

  // Buttons (exclude dropdown toggles and carousel controls to avoid double sounds)
  document.addEventListener('click', function (e) {
    const btn = e.target && e.target.closest ? e.target.closest('button.btn, input[type="submit"].btn, input[type="button"].btn, a.btn') : null;
    if (!btn) return;
    if (btn.matches('[data-bs-toggle="dropdown"]') || btn.closest('[data-bs-toggle="dropdown"]')) return;
    if (btn.closest('.carousel') && (btn.matches('[data-bs-slide]') || btn.closest('[data-bs-slide]'))) return;
    if (btn.classList.contains('btn-close') || btn.matches('[data-bs-dismiss]')) return;
    playSound('click', btn);
  }, true);

  // Carousel indicators
  document.addEventListener('click', function (e) {
    const ind = e.target && e.target.closest ? e.target.closest('.carousel-indicators [data-bs-slide-to]') : null;
    if (ind) playSound('click', ind);
  }, true);

  // Collapse – show/hide
  document.addEventListener('show.bs.collapse', function (e) {
    playSound('expand', e.target);
  });
  document.addEventListener('hide.bs.collapse', function (e) {
    playSound('collapse', e.target);
  });

  // Dropdown
  document.addEventListener('show.bs.dropdown', function (e) {
    playSound('open', e.target);
  });
  document.addEventListener('hide.bs.dropdown', function (e) {
    playSound('close', e.target);
  });

  // Form inputs – focus
  document.addEventListener('focusin', function (e) {
    const el = e.target;
    if (el.matches('input:not([type="hidden"]), textarea, select')) playSound('focus', el);
  });
  document.addEventListener('change', function (e) {
    const el = e.target;
    if (!el.matches('input, textarea, select')) return;
    if (el.matches('input[type="range"]')) return;
    if (el.matches('input[type="checkbox"]')) {
      const isSwitch = el.matches('[role="switch"]') || (el.closest && el.closest('.form-switch'));
      playSound(isSwitch ? (el.checked ? 'switchOn' : 'switchOff') : 'checkbox', el);
      return;
    }
    if (el.matches('input[type="radio"]')) {
      playSound('radio', el);
      return;
    }
    playSound('change', el);
  });
  document.addEventListener('input', function (e) {
    const el = e.target;
    if (el.matches && el.matches('input[type="range"]')) playSound('range', el);
  });

  // Modals
  document.addEventListener('show.bs.modal', function (e) {
    playSound('open', e.target);
  });
  document.addEventListener('hide.bs.modal', function (e) {
    playSound('close', e.target);
  });

  // Popovers
  document.addEventListener('show.bs.popover', function (e) {
    playSound('open', e.target);
  });
  document.addEventListener('hide.bs.popover', function (e) {
    playSound('close', e.target);
  });

  // Toast
  document.addEventListener('show.bs.toast', function (e) {
    playSound('toast', e.target);
  });
  document.addEventListener('hide.bs.toast', function (e) {
    playSound('close', e.target);
  });

  // Tooltips
  document.addEventListener('show.bs.tooltip', function (e) {
    playSound('open', e.target);
  });
  document.addEventListener('hide.bs.tooltip', function (e) {
    playSound('close', e.target);
  });

  // Details / Summary (capture so we run before any other handler; use document for enabled check)
  document.addEventListener('toggle', function (e) {
    if (!e.target || e.target.tagName.toUpperCase() !== 'DETAILS') return;
    const soundType = e.target.open ? 'expand' : 'collapse';
    playSound(soundType, document.body);
  }, true);

  // Form validation
  document.addEventListener('invalid', function (e) {
    if (e.target && e.target.matches('input, select, textarea')) playSound('formInvalid', e.target);
  }, true);
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (form && form.checkValidity && form.checkValidity()) playSound('formValid', form);
  }, true);

  // Alerts – when appearing (new alert added to DOM)
  const alertObserver = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const nodes = mutations[i].addedNodes;
      for (let j = 0; j < nodes.length; j++) {
        const node = nodes[j];
        if (node.nodeType !== 1) continue;
        const alertEl = node.classList && node.classList.contains('alert') ? node : (node.querySelector && node.querySelector('.alert'));
        if (alertEl) playSound('alert', alertEl);
      }
    }
  });
  if (document.body) {
    alertObserver.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      alertObserver.observe(document.body, { childList: true, subtree: true });
    });
  }

  // Volume – read data-ui-sounds-volume attribute and watch for changes
  readVolumeAttribute();
  const volumeObserver = new MutationObserver(readVolumeAttribute);
  volumeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-ui-sounds-volume'] });
  if (document.body) {
    volumeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ui-sounds-volume'] });
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      volumeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ui-sounds-volume'] });
    });
  }
})();
