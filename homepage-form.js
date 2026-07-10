/**
 * Premium Onboarding Form - Notion-like Experience
 * Smooth step transitions, organic animations, living feedback
 */

class PremiumOnboardingForm {
  constructor() {
    this.form = document.getElementById('profile-form');
    this.currentStep = 1;
    this.totalSteps = 4;
    this.nextBtn = document.getElementById('next-step');
    this.prevBtn = document.getElementById('prev-step');
    this.submitBtn = document.getElementById('submit-step');
    this.progressFill = document.getElementById('progress-fill');
    this.formSteps = this.form.querySelectorAll('.form-step');
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.updateProgress();
    this.addMicroInteractions();
  }

  setupEventListeners() {
    this.nextBtn?.addEventListener('click', () => this.nextStep());
    this.prevBtn?.addEventListener('click', () => this.prevStep());
    this.submitBtn?.addEventListener('click', (e) => this.submitForm(e));
    this.form?.addEventListener('submit', (e) => this.submitForm(e));

    // Add enter key support for inputs
    const inputs = this.form.querySelectorAll('input, select');
    inputs.forEach(input => {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && this.currentStep < this.totalSteps) {
          e.preventDefault();
          this.nextStep();
        }
      });
    });
  }

  addMicroInteractions() {
    // Animate input focus states
    const formInputs = this.form.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
      input.addEventListener('focus', (e) => {
        e.target.style.animation = 'inputFocus 300ms ease-out';
      });

      input.addEventListener('blur', (e) => {
        e.target.style.animation = 'none';
      });

      // Real-time validation feedback
      input.addEventListener('change', () => {
        this.validateField(input);
      });
    });
  }

  validateField(field) {
    if (field.hasAttribute('required')) {
      if (field.value.trim()) {
        field.classList.remove('error');
        field.classList.add('success');
        
        // Organic success feedback
        const checkmark = document.createElement('div');
        checkmark.className = 'field-check';
        checkmark.innerHTML = '✓';
        
        if (field.nextElementSibling?.classList.contains('field-check')) {
          field.nextElementSibling.remove();
        }
        field.parentNode.appendChild(checkmark);
      } else {
        field.classList.remove('success');
        field.classList.add('error');
      }
    }
  }

  validateStep(step) {
    const fieldset = this.form.querySelector(`fieldset[data-step="${step}"]`);
    const requiredFields = fieldset.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    let focusField = null;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        field.classList.remove('success');
        
        if (!focusField) focusField = field;
        
        // Show error message
        this.showFieldError(field);
      } else {
        field.classList.remove('error');
        field.classList.add('success');
      }
    });

    if (!isValid && focusField) {
      focusField.focus();
      focusField.parentElement?.classList.add('shake');
      setTimeout(() => focusField.parentElement?.classList.remove('shake'), 500);
    }
    
    return isValid;
  }

  showFieldError(field) {
    const label = field.previousElementSibling;
    if (label && label.classList.contains('form-label')) {
      label.classList.add('error-label');
      setTimeout(() => label.classList.remove('error-label'), 2000);
    }
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.transitionStep('forward');
        this.currentStep++;
        this.updateDisplay();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.transitionStep('backward');
      this.currentStep--;
      this.updateDisplay();
    }
  }

  transitionStep(direction) {
    const currentFieldset = this.form.querySelector(`fieldset[data-step="${this.currentStep}"]`);
    
    if (currentFieldset) {
      currentFieldset.style.animation = direction === 'forward' 
        ? 'slideOutLeft 400ms ease-in-out forwards'
        : 'slideOutRight 400ms ease-in-out forwards';
    }
  }

  updateDisplay() {
    // Hide all steps with animation
    this.formSteps.forEach((step, index) => {
      const stepNum = index + 1;
      if (stepNum === this.currentStep) {
        step.classList.add('active');
        step.style.animation = 'slideInUp 500ms cubic-bezier(0.23, 1, 0.32, 1) forwards';
      } else {
        step.classList.remove('active');
      }
    });

    // Update progress indicators with animation
    this.updateProgress();

    // Update buttons with smooth transitions
    this.updateButtons();

    // Scroll to form smoothly
    this.form.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Trigger step entrance animation
    this.animateStepEntrance();
  }

  updateButtons() {
    const showPrev = this.currentStep > 1;
    const showNext = this.currentStep < this.totalSteps;
    const showSubmit = this.currentStep === this.totalSteps;

    if (this.prevBtn) {
      this.prevBtn.style.display = showPrev ? 'inline-flex' : 'none';
      if (showPrev) this.prevBtn.style.animation = 'fadeInUp 400ms ease-out';
    }

    if (this.nextBtn) {
      this.nextBtn.style.display = showNext ? 'inline-flex' : 'none';
      if (showNext) this.nextBtn.style.animation = 'fadeInUp 400ms ease-out';
    }

    if (this.submitBtn) {
      this.submitBtn.style.display = showSubmit ? 'inline-flex' : 'none';
      if (showSubmit) {
        this.submitBtn.style.animation = 'scaleIn 400ms cubic-bezier(0.23, 1, 0.32, 1)';
      }
    }
  }

  updateProgress() {
    const percentage = (this.currentStep / this.totalSteps) * 100;
    
    if (this.progressFill) {
      this.progressFill.style.transition = 'width 600ms cubic-bezier(0.23, 1, 0.32, 1)';
      this.progressFill.style.width = percentage + '%';
    }

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNum = index + 1;
      const isActive = stepNum === this.currentStep;
      const isCompleted = stepNum < this.currentStep;

      step.classList.remove('active', 'completed');
      
      if (isActive) {
        step.classList.add('active');
        step.style.animation = 'pulse 2s ease-in-out infinite';
      } else if (isCompleted) {
        step.classList.add('completed');
        step.style.animation = 'none';
      }
    });
  }

  animateStepEntrance() {
    const currentFieldset = this.form.querySelector(`fieldset[data-step="${this.currentStep}"]`);
    if (currentFieldset) {
      const title = currentFieldset.querySelector('.form-step__title');
      const description = currentFieldset.querySelector('.form-step__description');
      const fields = currentFieldset.querySelectorAll('.form-group');

      if (title) title.style.animation = 'slideInUp 500ms ease-out 100ms both';
      if (description) description.style.animation = 'slideInUp 500ms ease-out 150ms both';
      
      fields.forEach((field, i) => {
        field.style.animation = `slideInUp 500ms ease-out ${200 + i * 50}ms both`;
      });
    }
  }

  submitForm(e) {
    e.preventDefault();
    
    if (this.validateStep(this.totalSteps)) {
      // Add submission animation
      this.submitBtn.style.pointerEvents = 'none';
      this.submitBtn.classList.add('submitting');
      this.submitBtn.textContent = '⏳ Saving...';

      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);
      
      // Simulate API call with premium feedback
      setTimeout(() => {
        localStorage.setItem('astronautProfile', JSON.stringify(data));
        
        // Show success state
        this.showSuccessState();

        // Redirect after success animation
        setTimeout(() => {
          window.location.href = 'food.html';
        }, 2000);
      }, 1200);
    }
  }

  showSuccessState() {
    const savedNote = document.getElementById('saved-profile-note');
    if (savedNote) {
      savedNote.removeAttribute('hidden');
      savedNote.style.animation = 'slideInUp 600ms cubic-bezier(0.23, 1, 0.32, 1)';
    }

    if (this.submitBtn) {
      this.submitBtn.textContent = '✓ Profile saved!';
      this.submitBtn.style.animation = 'pulse 600ms ease-out';
      this.submitBtn.style.background = '#6e8b74';
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PremiumOnboardingForm();
  });
} else {
  new PremiumOnboardingForm();
}
