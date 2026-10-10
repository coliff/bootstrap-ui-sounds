/*!
 * Bootstrap UI Sounds v0.1.0
 * Copyright 2026 C.Oliff
 * Licensed under MIT (https://github.com/coliff/bootstrap-ui-sounds)
 *
 * Web Audio API sound feedback for Bootstrap 6 components. Sounds are off by default;
 * enable via data-ui-sounds on <html>, <body>, or a component.
 */
(function () {
  'use strict';

  let audioContext = null;

  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  function isSoundsEnabled(element) {
    if (!element || !element.getAttribute) {return false;}
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
    return (
      onHtml === '' ||
      onHtml === 'true' ||
      onHtml === '1' ||
      onBody === '' ||
      onBody === 'true' ||
      onBody === '1'
    );
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
    tab: { freq: 600, duration: 0.045, type: 'sine', volume: 0.24 },
    carouselPrev: { freq: 500, duration: 0.055, type: 'sine', volume: 0.24 },
    carouselNext: { freq: 660, duration: 0.055, type: 'sine', volume: 0.24 },
    closeButton: { freq: 380, duration: 0.05, type: 'sine', volume: 0.24 },
    switchOn: { freq: 780, duration: 0.05, type: 'square', volume: 0.25 },
    switchOff: { freq: 420, duration: 0.055, type: 'triangle', volume: 0.23 },
    checkboxOn: { freq: 650, duration: 0.05, type: 'square', volume: 0.24 },
    checkboxOff: { freq: 400, duration: 0.06, type: 'triangle', volume: 0.22 },
    radio: { freq: 680, duration: 0.045, type: 'triangle', volume: 0.23 },
    range: { freq: 500, duration: 0.04, type: 'sine', volume: 0.22 },
    formInvalid: { freq: 280, duration: 0.1, type: 'triangle', volume: 0.2 },
    formValid: { freq: 520, duration: 0.1, type: 'triangle', volume: 0.22 },
    chipAdd: { freq: 720, duration: 0.045, type: 'triangle', volume: 0.22 },
    chipRemove: { freq: 360, duration: 0.05, type: 'triangle', volume: 0.22 },
    key: { freq: 900, duration: 0.025, type: 'sine', volume: 0.16 },
    complete: { freq: 880, duration: 0.09, type: 'triangle', volume: 0.22 },
    strengthWeak: { freq: 300, duration: 0.06, type: 'sine', volume: 0.18 },
    strengthFair: { freq: 440, duration: 0.06, type: 'sine', volume: 0.18 },
    strengthGood: { freq: 580, duration: 0.06, type: 'sine', volume: 0.18 },
    strengthStrong: { freq: 760, duration: 0.06, type: 'sine', volume: 0.2 }
  };

  // Bootstrap 6 buttons use variant classes (.btn-solid, .btn-outline, …) instead of .btn
  const BUTTON_CLASSES = ['.btn', '.btn-solid', '.btn-outline', '.btn-subtle', '.btn-text', '.btn-styled', '.btn-link', '.btn-icon'];
  const BUTTON_SELECTOR = BUTTON_CLASSES.flatMap((cls) => [
    `button${cls}`,
    `a${cls}`,
    `input[type="submit"]${cls}`,
    `input[type="button"]${cls}`
  ]).join(', ');

  function playSound(type, element, options) {
    if (!isSoundsEnabled(element)) {
      return;
    }
    const preset = soundPresets[type] || soundPresets.click;
    const volume =
      options && typeof options.volume === 'number'
        ? options.volume
        : preset.volume;
    if (volume <= 0) {
      return;
    }
    // Before any user gesture the AudioContext is suspended; scheduled sounds would
    // queue up and all play at once on the first interaction, so skip them.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) {
      return;
    }
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(function () {
          /* Ignore resume failures to avoid unhandled rejections */
        });
      }
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = preset.type;
      osc.frequency.setValueAtTime(preset.freq, now);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, now + preset.duration);
      osc.start(now);
      osc.stop(now + preset.duration);
    } catch (_) {
      /* Web Audio may be unavailable */
    }
  }

  function getTriggerFromTarget(target, selector) {
    if (!target || !target.id) {return null;}
    const escapedId = window.CSS && window.CSS.escape ? window.CSS.escape(target.id) : target.id.replace(/"/g, '\\"');
    const doc = target.ownerDocument || document;
    return doc.querySelector(
      `${selector}[data-bs-target="#${escapedId}"], ${
        selector
      }[href="#${escapedId}"]`,
    );
  }

  function getInteractionElement(event, fallbackElement) {
    if (event && event.relatedTarget && event.relatedTarget.nodeType === 1) {
      return event.relatedTarget;
    }
    if (event && event.clickEvent && event.clickEvent.target && event.clickEvent.target.closest) {
      const trigger = event.clickEvent.target.closest('[data-bs-toggle], [data-bs-dismiss], .btn-close, button, a, input, summary');
      if (trigger) {return trigger;}
    }
    return fallbackElement;
  }

  function getRangeVolume(element) {
    const min = Number(element.min || 0);
    const max = Number(element.max || 100);
    const value = Number(element.value);

    if (
      !Number.isFinite(min) ||
      !Number.isFinite(max) ||
      !Number.isFinite(value) ||
      max <= min
    ) {
      return soundPresets.range.volume;
    }

    const progress = Math.min(Math.max((value - min) / (max - min), 0), 1);
    return soundPresets.range.volume * progress;
  }

  function hasSemanticBootstrapSoundTrigger(element) {
    return Boolean(
      element && element.matches &&
      element.matches(
        '[data-bs-toggle="collapse"], [data-bs-toggle="dialog"], [data-bs-toggle="drawer"], [data-bs-toggle="menu"], [data-bs-toggle="popover"], [data-bs-toggle="tooltip"], [data-bs-toggle="tab"], [data-bs-toggle="combobox"], [data-bs-toggle="datepicker"], [data-bs-toggle="toggler"]'
      )
    );
  }

  // Close / dismiss (btn-close and data-bs-dismiss often lack .btn, so handle first)
  document.addEventListener('click', function (e) {
    const closeEl = e.target && e.target.closest ? e.target.closest('.btn-close, [data-bs-dismiss]') : null;
    if (closeEl) {
      playSound('closeButton', closeEl);
      return;
    }
  }, true);

  // Buttons (exclude menu toggles and carousel controls to avoid double sounds)
  document.addEventListener('click', function (e) {
    const btn = e.target && e.target.closest ? e.target.closest(BUTTON_SELECTOR) : null;
    if (!btn) {return;}
    if (btn.closest('.carousel') && btn.matches('[data-bs-slide], [data-bs-slide-to], .carousel-control-play-pause')) {return;}
    if (btn.classList.contains('btn-close') || btn.matches('[data-bs-dismiss]')) {return;}
    if (hasSemanticBootstrapSoundTrigger(btn)) {return;}
    playSound('click', btn);
  }, true);

  // Carousel prev / next (controls are usually not .btn, so handle explicitly)
  document.addEventListener('click', function (e) {
    const ctrl = e.target && e.target.closest ? e.target.closest('.carousel [data-bs-slide]') : null;
    if (!ctrl) {return;}
    const dir = ctrl.getAttribute('data-bs-slide');
    if (dir === 'prev') {playSound('carouselPrev', ctrl);}
    else if (dir === 'next') {playSound('carouselNext', ctrl);}
  }, true);

  // Carousel play / pause
  document.addEventListener('click', function (e) {
    const ctrl = e.target && e.target.closest ? e.target.closest('.carousel .carousel-control-play-pause') : null;
    if (ctrl) {playSound('click', ctrl);}
  }, true);

  // Carousel indicators
  document.addEventListener('click', function (e) {
    const ind = e.target && e.target.closest ? e.target.closest('.carousel-indicators [data-bs-slide-to]') : null;
    if (ind) {playSound('click', ind);}
  }, true);

  // Collapse – show/hide
  document.addEventListener('show.bs.collapse', function (e) {
    playSound('expand', getTriggerFromTarget(e.target, '[data-bs-toggle="collapse"]') || e.target);
  });
  document.addEventListener('hide.bs.collapse', function (e) {
    playSound('collapse', getTriggerFromTarget(e.target, '[data-bs-toggle="collapse"]') || e.target);
  });

  // Menu (replaces Dropdown in Bootstrap 6)
  document.addEventListener('show.bs.menu', function (e) {
    playSound('open', getInteractionElement(e, e.target));
  });
  document.addEventListener('hide.bs.menu', function (e) {
    playSound('close', getInteractionElement(e, e.target));
  });

  // Form inputs – focus (datepicker inputs open on focus, so they play the open sound instead)
  document.addEventListener('focusin', function (e) {
    const el = e.target;
    if (!el.matches || !el.matches('input:not([type="hidden"]), textarea, select')) {return;}
    if (el.matches('[data-bs-toggle="datepicker"]')) {return;}
    playSound('focus', el);
  });
  document.addEventListener('change', function (e) {
    const el = e.target;
    if (!el.matches('input, textarea, select')) {return;}
    if (el.matches('input[type="range"]')) {return;}
    if (el.matches('input[type="checkbox"]')) {
      const isSwitch = el.matches('[role="switch"], [switch]') || (el.closest && el.closest('.switch'));
      playSound(
        isSwitch ? (el.checked ? 'switchOn' : 'switchOff') : el.checked ? 'checkboxOn' : 'checkboxOff',
        el
      );
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
    if (el.matches && el.matches('input[type="range"]')) {
      playSound("range", el, { volume: getRangeVolume(el) });
    }
  });

  // Dialog (replaces Modal in Bootstrap 6)
  document.addEventListener('show.bs.dialog', function (e) {
    playSound('open', getInteractionElement(e, e.target));
  });
  document.addEventListener('hide.bs.dialog', function (e) {
    playSound('close', getInteractionElement(e, e.target));
  });

  // Drawer (replaces Offcanvas in Bootstrap 6)
  document.addEventListener('show.bs.drawer', function (e) {
    playSound('open', getInteractionElement(e, e.target));
  });
  document.addEventListener('hide.bs.drawer', function (e) {
    playSound('close', getInteractionElement(e, e.target));
  });

  // Combobox (opening and closing are covered by the Menu events it fires)
  document.addEventListener('change.bs.combobox', function (e) {
    playSound('change', e.target);
  });

  // Datepicker
  document.addEventListener('show.bs.datepicker', function (e) {
    playSound('open', e.target);
  });
  document.addEventListener('hide.bs.datepicker', function (e) {
    playSound('close', e.target);
  });
  document.addEventListener('change.bs.datepicker', function (e) {
    playSound('detail', e.target);
  });

  // Chips
  document.addEventListener('add.bs.chips', function (e) {
    playSound('chipAdd', e.target);
  });
  document.addEventListener('remove.bs.chips', function (e) {
    playSound('chipRemove', e.target);
  });

  // OTP input – a soft tick per character, then a chime when complete
  document.addEventListener('input.bs.otpInput', function (e) {
    playSound('key', e.target);
  });
  document.addEventListener('complete.bs.otpInput', function (e) {
    playSound('complete', e.target);
  });

  // Password strength – pitch rises with strength
  const strengthSounds = { weak: 'strengthWeak', fair: 'strengthFair', good: 'strengthGood', strong: 'strengthStrong' };
  document.addEventListener('strengthChange.bs.strength', function (e) {
    const soundType = strengthSounds[e.strength];
    if (soundType) {playSound(soundType, e.target);}
  });

  // Toggler
  document.addEventListener('toggled.bs.toggler', function (e) {
    playSound('click', e.target);
  });

  // Tabs / list groups
  document.addEventListener('show.bs.tab', function (e) {
    playSound('tab', e.target);
  });

  // Popovers
  document.addEventListener('show.bs.popover', function (e) {
    playSound('open', getInteractionElement(e, e.target));
  });
  document.addEventListener('hide.bs.popover', function (e) {
    playSound('close', getInteractionElement(e, e.target));
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
    playSound('open', getInteractionElement(e, e.target));
  });
  document.addEventListener('hide.bs.tooltip', function (e) {
    playSound('close', getInteractionElement(e, e.target));
  });

  // Details / Summary (capture so we run before any other handler; use document for enabled check)
  document.addEventListener('toggle', function (e) {
    if (!e.target || e.target.tagName.toUpperCase() !== 'DETAILS') {return;}
    const soundType = e.target.open ? 'expand' : 'collapse';
    playSound(soundType, e.target);
  }, true);

  // Form validation (one invalid sound per validation pass, not one per invalid field)
  let invalidSoundPending = false;
  document.addEventListener('invalid', function (e) {
    if (invalidSoundPending || !e.target || !e.target.matches('input, select, textarea')) {return;}
    invalidSoundPending = true;
    setTimeout(function () {
      invalidSoundPending = false;
    }, 0);
    playSound('formInvalid', e.target);
  }, true);
  document.addEventListener('submit', function (e) {
    const form = e.target;
    if (!form || !form.elements) {return;}
    // Check validity without form.checkValidity(), which would fire extra invalid events
    const isValid = Array.prototype.every.call(form.elements, function (el) {
      return !el.willValidate || !el.validity || el.validity.valid;
    });
    if (isValid) {playSound('formValid', form);}
  }, true);

  // Alerts – when appearing (new alert added to DOM)
  const alertObserver = new MutationObserver(function (mutations) {
    for (let i = 0; i < mutations.length; i++) {
      const nodes = mutations[i].addedNodes;
      for (let j = 0; j < nodes.length; j++) {
        const node = nodes[j];
        if (node.nodeType !== 1) {continue;}
        const alertEl = node.classList && node.classList.contains('alert') ? node : (node.querySelector && node.querySelector('.alert'));
        if (alertEl) {playSound('alert', alertEl);}
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

})();
