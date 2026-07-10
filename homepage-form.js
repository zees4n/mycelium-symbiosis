/**
 * Multi-step onboarding form logic
 * Manages form step progression with validation and progress tracking
 */

class MultiStepForm {
  constructor() {
    this.form = document.getElementById('profile-form');
    this.currentStep = 1;
    this.totalSteps = 4;
    this.nextBtn = document.getElementById('next-step');
    this.prevBtn = document.getElementById('prev-step');
    this.submitBtn = document.getElementById('submit-step');
    this.progressFill = document.getElementById('progress-fill');
    
    this.init();
  }

  init() {
    this.nextBtn.addEventListener('click', () => this.nextStep());
    this.prevBtn.addEventListener('click', () => this.prevStep());
    this.submitBtn.addEventListener('click', (e) => this.submitForm(e));
    this.form.addEventListener('submit', (e) => this.submitForm(e));
    
    this.updateProgress();
  }

  nextStep() {
    if (this.validateStep(this.currentStep)) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateDisplay();
      }
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateDisplay();
    }
  }

  validateStep(step) {
    const fieldset = this.form.querySelector(`fieldset[data-step="${step}"]`);
    const requiredFields = fieldset.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    requiredFields.forEach(field => {
      if (!field.value) {
        isValid = false;
        field.classList.add('error');
      } else {
        field.classList.remove('error');
      }
    });
    
    return isValid;
  }

  updateDisplay() {
    // Hide all steps
    this.form.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
    });

    // Show current step
    this.form.querySelector(`fieldset[data-step="${this.currentStep}"]`).classList.add('active');

    // Update progress indicators
    this.updateProgress();

    // Update buttons
    this.prevBtn.style.display = this.currentStep > 1 ? 'inline-flex' : 'none';
    this.nextBtn.style.display = this.currentStep < this.totalSteps ? 'inline-flex' : 'none';
    this.submitBtn.style.display = this.currentStep === this.totalSteps ? 'inline-flex' : 'none';

    // Scroll to form
    this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  updateProgress() {
    const percentage = (this.currentStep / this.totalSteps) * 100;
    this.progressFill.style.width = percentage + '%';

    // Update step indicators
    document.querySelectorAll('.progress-step').forEach((step, index) => {
      const stepNum = index + 1;
      step.classList.remove('active', 'completed');
      
      if (stepNum === this.currentStep) {
        step.classList.add('active');
      } else if (stepNum < this.currentStep) {
        step.classList.add('completed');
      }
    });
  }

  submitForm(e) {
    e.preventDefault();
    
    if (this.validateStep(this.totalSteps)) {
      // Collect form data
      const formData = new FormData(this.form);
      const data = Object.fromEntries(formData);
      
      // Save to localStorage
      localStorage.setItem('astronautProfile', JSON.stringify(data));
      
      // Show success message
      const savedNote = document.getElementById('saved-profile-note');
      savedNote.removeAttribute('hidden');
      
      // Redirect after brief delay
      setTimeout(() => {
        window.location.href = 'food.html';
      }, 1500);
    }
  }
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new MultiStepForm();
  });
} else {
  new MultiStepForm();
}
