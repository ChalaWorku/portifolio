const contactForm = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');

function validateEmail(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

async function submitContactForm(event) {
  event.preventDefault();
  if (!contactForm) return;

  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();

  if (!name || !email || !message) {
    feedback.textContent = 'Please complete every field before sending.';
    return;
  }
  if (!validateEmail(email)) {
    feedback.textContent = 'Please enter a valid email address.';
    return;
  }

  feedback.textContent = 'Sending message...';

  try {
    if (window.db) {
      await db.collection('messages').add({
        name,
        email,
        message,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    contactForm.reset();
    feedback.textContent = 'Message sent successfully. I will reply soon!';
  } catch (error) {
    feedback.textContent = 'Unable to send message at the moment. Please try again later.';
    console.error('Contact form submission failed', error);
  }
}

if (contactForm) {
  contactForm.addEventListener('submit', submitContactForm);
}
