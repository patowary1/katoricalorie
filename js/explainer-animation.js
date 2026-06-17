/**
 * KatoriCalorie Explainer Animation System (Phase 2)
 * Isolated logic to manage the SVG interactive animation.
 */
(function () {
  'use strict';

  // DOM Elements
  const cursor = document.getElementById('explainer-cursor');
  const ripple = document.getElementById('explainer-ripple');
  const addBtn = document.getElementById('explainer-add-btn');
  const addBtnBg = document.getElementById('explainer-add-btn-bg');
  const addBtnText = document.getElementById('explainer-add-btn-text');
  const katori = document.getElementById('explainer-katori');
  const katoriRing = document.getElementById('explainer-katori-ring');
  const portionHud = document.getElementById('explainer-portion-hud');
  const hudStepBadge = document.getElementById('hud-step-badge');
  const hudCalCounter = document.getElementById('hud-cal-counter');
  const ringFill = document.getElementById('explainer-ring-fill');
  const ringPct = document.getElementById('explainer-ring-pct');
  const btnS = document.getElementById('hud-btn-s');
  const btnM = document.getElementById('hud-btn-m');
  const btnL = document.getElementById('hud-btn-l');
  
  const mobileToggle = document.getElementById('explainer-mobile-toggle');
  const toggleIcon = document.getElementById('explainer-toggle-icon');
  const toggleText = document.getElementById('explainer-toggle-text');
  const playPauseBtn = document.getElementById('btn-explainer-play-pause');

  // Animation constants & variables
  const CIRCUMFERENCE = 213.6; // 2 * pi * r (r = 34)
  let animationTimeout = null;
  let isPlaying = false;
  let currentStep = 0;
  let isMobileOverlayActive = true;

  // Coordinate mappings for simulated cursor pointer
  const coords = {
    start: { x: 180, y: 220 },
    addBtn: { x: 25 + 12 + 48, y: 60 + 90 + 13 }, // Center of "+ Add to Plate" button
    katori: { x: 230 + 70, y: 20 + 150 },        // Center of Katori bowl
    btnS: { x: 230 + 25 + 13, y: 20 + 58 + 4 + 9 },
    btnM: { x: 230 + 57 + 13, y: 20 + 58 + 4 + 9 },
    btnL: { x: 230 + 89 + 13, y: 20 + 58 + 4 + 9 }
  };

  // 1. Core State Handlers
  function updateRing(percent, color) {
    if (!ringFill) return;
    const offset = CIRCUMFERENCE * (1 - percent / 100);
    ringFill.style.strokeDashoffset = Math.max(0, Math.min(CIRCUMFERENCE, offset));
    ringFill.style.stroke = color;
    if (ringPct) {
      ringPct.textContent = `${percent}%`;
    }
  }

  function triggerRipple(x, y) {
    if (!ripple) return;
    ripple.setAttribute('cx', x);
    ripple.setAttribute('cy', y);
    ripple.setAttribute('r', '0');
    ripple.setAttribute('opacity', '1');
    
    // Animate ripple scale & opacity via Javascript intervals for high accuracy
    let radius = 0;
    let opacity = 1;
    const rippleInterval = setInterval(() => {
      radius += 2;
      opacity -= 0.1;
      ripple.setAttribute('r', radius);
      ripple.setAttribute('opacity', opacity);
      if (opacity <= 0) {
        clearInterval(rippleInterval);
        ripple.setAttribute('opacity', '0');
      }
    }, 20);
  }

  function moveCursor(x, y, durationMs = 800) {
    if (!cursor) return;
    cursor.style.transition = `transform ${durationMs}ms ease-in-out`;
    cursor.style.transform = `translate(${x}px, ${y}px)`;
  }

  // 2. Main Visual Sequencer (Self-Playing Loop)
  function resetDemo() {
    clearTimeout(animationTimeout);
    
    // Reset SVG states
    moveCursor(coords.start.x, coords.start.y, 0);
    updateRing(0, '#2ec4b6');
    
    if (katori) {
      katori.style.opacity = '0';
      katori.style.transform = 'scale(1.0)';
    }
    if (katoriRing) {
      katoriRing.style.stroke = '#2ec4b6';
    }
    if (portionHud) {
      portionHud.style.opacity = '0';
    }
    
    // Reset Add button style
    if (addBtnBg) addBtnBg.setAttribute('fill', '#ff6b35');
    if (addBtnText) addBtnText.textContent = '+ Add to Plate';
    if (addBtn) addBtn.classList.remove('click-active');
    
    // Reset HUD steps
    if (hudStepBadge) {
      hudStepBadge.textContent = '1. Get Calories';
      hudStepBadge.classList.remove('hud-warning');
    }
    if (hudCalCounter) {
      hudCalCounter.textContent = 'Target: 2000 kcal';
    }
    
    // Reset SML button highlights
    highlightHudButton(null);
  }

  function highlightHudButton(activeBtn) {
    const btns = [
      { el: btnS, activeColor: '#2ec4b6', textColor: '#000' },
      { el: btnM, activeColor: '#2ec4b6', textColor: '#000' },
      { el: btnL, activeColor: '#ef4444', textColor: '#000' }
    ];
    btns.forEach(btn => {
      if (!btn.el) return;
      const rect = btn.el.querySelector('rect');
      const text = btn.el.querySelector('text');
      if (btn.el === activeBtn) {
        if (rect) rect.setAttribute('fill', btn.activeColor);
        if (text) text.setAttribute('fill', btn.textColor);
      } else {
        if (rect) rect.setAttribute('fill', '#221513');
        if (text) text.setAttribute('fill', '#a79a97');
      }
    });
  }

  function runAnimationStep() {
    if (!isPlaying) return;

    switch (currentStep) {
      case 0:
        // Reset everything first
        resetDemo();
        currentStep = 1;
        animationTimeout = setTimeout(runAnimationStep, 800);
        break;

      case 1:
        // Move cursor to "Add to Plate" button
        moveCursor(coords.addBtn.x, coords.addBtn.y, 1000);
        currentStep = 2;
        animationTimeout = setTimeout(runAnimationStep, 1100);
        break;

      case 2:
        // Click "Add to Plate" button
        triggerRipple(coords.addBtn.x, coords.addBtn.y);
        if (addBtn) addBtn.classList.add('click-active');
        if (addBtnBg) addBtnBg.setAttribute('fill', '#2ec4b6');
        if (addBtnText) addBtnText.textContent = document.documentElement.lang === 'as' ? 'যোগ কৰা হ’ল' : 'Added';
        
        currentStep = 3;
        animationTimeout = setTimeout(runAnimationStep, 400);
        break;

      case 3:
        // Katori flies onto the plate
        if (addBtn) addBtn.classList.remove('click-active');
        if (katori) katori.style.opacity = '1';
        if (hudStepBadge) {
          hudStepBadge.textContent = '2. Food Placed!';
        }
        if (hudCalCounter) {
          hudCalCounter.textContent = 'Plate: 700 / 2000 kcal';
        }
        updateRing(35, '#2ec4b6'); // 35% capacity
        
        currentStep = 4;
        animationTimeout = setTimeout(runAnimationStep, 1200);
        break;

      case 4:
        // Move cursor to the Katori bowl on the plate
        moveCursor(coords.katori.x, coords.katori.y, 1000);
        currentStep = 5;
        animationTimeout = setTimeout(runAnimationStep, 1100);
        break;

      case 5:
        // Click Katori bowl to open portion toggle HUD
        triggerRipple(coords.katori.x, coords.katori.y);
        if (portionHud) portionHud.style.opacity = '1';
        if (hudStepBadge) {
          hudStepBadge.textContent = '3. Adjust Portion';
        }
        highlightHudButton(btnM); // Default portion is medium
        
        currentStep = 6;
        animationTimeout = setTimeout(runAnimationStep, 1200);
        break;

      case 6:
        // Move cursor to "Large" (L) portion selector button
        moveCursor(coords.btnL.x, coords.btnL.y, 800);
        currentStep = 7;
        animationTimeout = setTimeout(runAnimationStep, 900);
        break;

      case 7:
        // Click "L" button -> Exceed daily calorie target limit
        triggerRipple(coords.btnL.x, coords.btnL.y);
        highlightHudButton(btnL);
        
        // Visual-first cues showing red warning state
        if (katori) katori.style.transform = 'scale(1.35)'; // Bowl physically scales up
        if (katoriRing) katoriRing.style.stroke = '#ef4444'; // Red ring borders
        if (hudStepBadge) {
          hudStepBadge.textContent = document.documentElement.lang === 'as' ? '4. বাজেটৰ বাহিৰত! 🔴' : '4. Over Budget! 🔴';
          hudStepBadge.classList.add('hud-warning');
        }
        if (hudCalCounter) {
          hudCalCounter.textContent = 'Plate: 2200 / 2000 kcal';
        }
        updateRing(110, '#ef4444'); // Over-budget red fill

        currentStep = 8;
        animationTimeout = setTimeout(runAnimationStep, 3500); // Hold look for 3.5s
        break;

      case 8:
        // Reset and restart the loop
        currentStep = 0;
        runAnimationStep();
        break;
    }
  }

  function startAutoplay() {
    isPlaying = true;
    currentStep = 0;
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="ph ph-pause"></i>';
    }
    runAnimationStep();
  }

  function pauseAutoplay() {
    isPlaying = false;
    clearTimeout(animationTimeout);
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="ph ph-play"></i>';
    }
  }

  // 3. User Manual Override Event Handling
  function manualSetPortion(portionSize) {
    // Stop autoplay when user manually interacts
    pauseAutoplay();
    
    // Hide simulated cursor
    if (cursor) cursor.style.opacity = '0';
    
    // Force Katori to render on plate
    if (katori) katori.style.opacity = '1';
    if (portionHud) portionHud.style.opacity = '1';

    if (portionSize === 'S') {
      highlightHudButton(btnS);
      if (katori) katori.style.transform = 'scale(0.7)';
      if (katoriRing) katoriRing.style.stroke = '#2ec4b6';
      updateRing(20, '#2ec4b6');
      if (hudStepBadge) {
        hudStepBadge.textContent = 'Portion: Small';
        hudStepBadge.classList.remove('hud-warning');
      }
      if (hudCalCounter) hudCalCounter.textContent = 'Plate: 400 / 2000 kcal';
    } else if (portionSize === 'M') {
      highlightHudButton(btnM);
      if (katori) katori.style.transform = 'scale(1.0)';
      if (katoriRing) katoriRing.style.stroke = '#2ec4b6';
      updateRing(35, '#2ec4b6');
      if (hudStepBadge) {
        hudStepBadge.textContent = 'Portion: Medium';
        hudStepBadge.classList.remove('hud-warning');
      }
      if (hudCalCounter) hudCalCounter.textContent = 'Plate: 700 / 2000 kcal';
    } else if (portionSize === 'L') {
      highlightHudButton(btnL);
      if (katori) katori.style.transform = 'scale(1.35)';
      if (katoriRing) katoriRing.style.stroke = '#ef4444';
      updateRing(110, '#ef4444');
     if (hudStepBadge) {
      hudStepBadge.textContent = document.documentElement.lang === 'as' ? 'বাজেটৰ বাহিৰত! 🔴' : 'Over Budget! 🔴';
      hudStepBadge.classList.add('hud-warning');
      }
      if (hudCalCounter) hudCalCounter.textContent = 'Plate: 2200 / 2000 kcal';
    }
  }

  // 4. Setup Control Event Listeners
  function initEvents() {
    // Interactive button clicks (manual override)
    if (btnS) btnS.addEventListener('click', () => manualSetPortion('S'));
    if (btnM) btnM.addEventListener('click', () => manualSetPortion('M'));
    if (btnL) btnL.addEventListener('click', () => manualSetPortion('L'));
    
    // Play/Pause manual control button
    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
          pauseAutoplay();
        } else {
          // Restore cursor opacity
          if (cursor) cursor.style.opacity = '1';
          startAutoplay();
        }
      });
    }

    // Touch-safe Play Toggle for Mobile viewports
    if (mobileToggle) {
      mobileToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (isMobileOverlayActive) {
          // Hide overlay, start animation
          mobileToggle.style.opacity = '0';
          setTimeout(() => {
            mobileToggle.style.display = 'none';
          }, 300);
          isMobileOverlayActive = false;
          startAutoplay();
        }
      });
    }

    // Hover listeners for desktop (Pause on hover, Resume on leave)
    const windowEl = document.getElementById('explainer-animation-window');
    if (windowEl && window.innerWidth >= 768) {
      windowEl.addEventListener('mouseenter', () => {
        // Pause if running, but do not show overlay
        if (isPlaying) {
          pauseAutoplay();
        }
      });
      windowEl.addEventListener('mouseleave', () => {
        // Resume autoplay if overlay isn't active
        if (!isPlaying && !isMobileOverlayActive) {
          if (cursor) cursor.style.opacity = '1';
          startAutoplay();
        }
      });
    }
  }

  // Start initialization
  document.addEventListener('DOMContentLoaded', () => {
    initEvents();

    // Determine initial state: desktop autoplay starts immediately, mobile waits for touch overlay
    if (window.innerWidth >= 768) {
      // Desktop: remove overlay and play automatically
      if (mobileToggle) mobileToggle.style.display = 'none';
      isMobileOverlayActive = false;
      startAutoplay();
    } else {
      // Mobile: ensure overlay is displayed
      if (mobileToggle) {
        mobileToggle.style.display = 'flex';
        mobileToggle.style.opacity = '1';
      }
      resetDemo();
    }
  });

})();
