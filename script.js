// Sample data for service providers (only declare once)
const providers = [
    // ... (keep your existing provider data)
];

// DOM Elements (with null checks)
const providersContainer = document.getElementById('providers-container');
const serviceFilter = document.getElementById('service-filter');
const locationFilter = document.getElementById('location-filter');
const ratingFilter = document.getElementById('rating-filter');
const contactForm = document.getElementById('contact-form');
const bookingForm = document.getElementById('booking-form');
const confirmationModal = document.getElementById('confirmation-modal');
const bookingModal = document.getElementById('booking-modal');
const modalMessage = document.getElementById('modal-message');
const bookingDetails = document.getElementById('booking-details');
const closeModals = document.querySelectorAll('.close-modal, #modal-ok, #booking-ok');

// Helper functions
function getServiceName(serviceType) {
    const services = {
        nanny: 'Nanny',
        handyman: 'Handyman',
        mover: 'Mover',
        cleaner: 'Cleaner'
    };
    return services[serviceType] || serviceType;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the providers page
    if (providersContainer) {
        filterProviders();
        
        // Add event listeners for filters
        if (serviceFilter) serviceFilter.addEventListener('change', filterProviders);
        if (locationFilter) locationFilter.addEventListener('change', filterProviders);
        if (ratingFilter) ratingFilter.addEventListener('change', filterProviders);
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Store contact in localStorage
            const contact = {
                name,
                email,
                message,
                date: new Date().toISOString()
            };
            
            let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            // Show confirmation
            if (modalMessage) modalMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            if (confirmationModal) confirmationModal.style.display = 'block';
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const serviceType = document.getElementById('service-type').value;
            const provider = document.getElementById('provider').value;
            const date = document.getElementById('booking-date').value;
            const time = document.getElementById('booking-time').value;
            const location = document.getElementById('location').value;
            const notes = document.getElementById('notes').value;
            
            // Create booking object
            const booking = {
                id: Date.now(),
                serviceType,
                provider: provider || 'Any available provider',
                date,
                time,
                location,
                notes: notes || 'No special instructions',
                status: 'confirmed',
                createdAt: new Date().toISOString()
            };
            
            // Store booking in localStorage
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Show booking details in modal
            if (bookingDetails) {
                bookingDetails.innerHTML = `
                    <p><strong>Service:</strong> ${getServiceName(serviceType)}</p>
                    <p><strong>Provider:</strong> ${booking.provider}</p>
                    <p><strong>Date:</strong> ${formatDate(date)} at ${time}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    ${notes ? <p><strong>Notes:</strong> ${notes}</p> : ''}
                `;
            }
            
            if (bookingModal) bookingModal.style.display = 'block';
            
            // Reset form
            bookingForm.reset();
        });
    }
    
    // Close modal events
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirmationModal) confirmationModal.style.display = 'none';
            if (bookingModal) bookingModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal && confirmationModal) {
            confirmationModal.style.display = 'none';
        }
        if (e.target === bookingModal && bookingModal) {
            bookingModal.style.display = 'none';
        }
    });
});

// Filter and display providers
function filterProviders() {
    const serviceValue = serviceFilter ? serviceFilter.value : 'all';
    const locationValue = locationFilter ? locationFilter.value : 'all';
    const ratingValue = ratingFilter ? parseFloat(ratingFilter.value) : 0;
    
    let filteredProviders = providers;
    
    if (serviceValue !== 'all') {
        filteredProviders = filteredProviders.filter(provider => provider.service === serviceValue);
    }
    
    if (locationValue !== 'all') {
        filteredProviders = filteredProviders.filter(provider => provider.location === locationValue);
    }
    
    if (ratingValue > 0) {
        filteredProviders = filteredProviders.filter(provider => provider.rating >= ratingValue);
    }
    
    displayProviders(filteredProviders);
}

// Display providers in the UI
function displayProviders(providersToDisplay) {
    if (!providersContainer) return;
    
    providersContainer.innerHTML = '';
    
    if (providersToDisplay.length === 0) {
        providersContainer.innerHTML = '<p class="no-results">No providers match your criteria. Try adjusting your filters.</p>';
        return;
    }
    
    providersToDisplay.forEach(provider => {
        const providerCard = document.createElement('div');
        providerCard.className = 'provider-card';
        providerCard.innerHTML = `
            <img src="${provider.image}" alt="${provider.name}">
            <h3>${provider.name}</h3>
            <p><strong>Service:</strong> ${provider.serviceName}</p>
            <p><strong>Rating:</strong> ${provider.rating} (${provider.reviews} reviews)</p>
            <p><strong>Location:</strong> ${provider.locationName}</p>
            <p><strong>Price:</strong> ${provider.price}</p>
            <p>${provider.description}</p>
            <button class="book-btn" data-id="${provider.id}">Book Now</button>
        `;
        
        providersContainer.appendChild(providerCard);
    });
    
    // Add event listeners to book buttons
    const bookButtons = document.querySelectorAll('.book-btn');
    bookButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const providerId = this.getAttribute('data-id');
            openBookingForm(providerId);
        });
    });
}