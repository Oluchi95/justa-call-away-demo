// Sample data for service providers
const providers = [
    {
        id: 1,
        name: "Sarah Johnson",
        service: "nanny",
        serviceName: "Nanny",
        rating: 4.8,
        reviews: 42,
        location: "downtown",
        locationName: "Downtown",
        price: "$15/hr",
        description: "Experienced nanny with 8 years of childcare experience. CPR and first aid certified. Specializes in infant care and early childhood development.",
        image: "https://images.unsplash.com/photo-1551218372-a32e6e9e71b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
        id: 2,
        name: "Mike Rodriguez",
        service: "handyman",
        serviceName: "Handyman",
        rating: 4.5,
        reviews: 36,
        location: "westside",
        locationName: "Westside",
        price: "$45/hr",
        description: "Skilled handyman with expertise in plumbing, electrical work, and general home repairs. 15 years of experience serving the local community.",
        image: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
    },
    {
        id: 3,
        name: "Lisa Chen",
        service: "cleaner",
        serviceName: "Cleaner",
        rating: 4.9,
        reviews: 58,
        location: "eastend",
        locationName: "East End",
        price: "$30/hr",
        description: "Professional cleaning service with attention to detail. Uses eco-friendly products. Specializes in deep cleaning and organization.",
        image: "https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
        id: 4,
        name: "James Wilson",
        service: "mover",
        serviceName: "Mover",
        rating: 4.7,
        reviews: 27,
        location: "northside",
        locationName: "Northside",
        price: "$75/hr",
        description: "Full-service moving company with a team of professionals. We handle packing, loading, transportation, and unloading with care.",
        image: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80"
    },
    {
        id: 5,
        name: "Maria Garcia",
        service: "nanny",
        serviceName: "Nanny",
        rating: 4.6,
        reviews: 31,
        location: "southside",
        locationName: "Southside",
        price: "$18/hr",
        description: "Bilingual childcare provider with experience in after-school programs. Creative, patient, and loves organizing educational activities.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    },
    {
        id: 6,
        name: "David Kim",
        service: "handyman",
        serviceName: "Handyman",
        rating: 4.4,
        reviews: 23,
        location: "central",
        locationName: "Central District",
        price: "$50/hr",
        description: "Specializes in carpentry and furniture assembly. Also offers painting and minor home improvement services. Prompt and reliable.",
        image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
    }
];

// DOM Elements
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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the providers page
    if (providersContainer) {
        filterProviders();
        
        // Add event listeners for filters
        serviceFilter.addEventListener('change', filterProviders);
        locationFilter.addEventListener('change', filterProviders);
        ratingFilter.addEventListener('change', filterProviders);
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
            modalMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            confirmationModal.style.display = 'block';
            
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
                notes,
                status: 'confirmed',
                createdAt: new Date().toISOString()
            };
            
            // Store booking in localStorage
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            // Show booking details in modal
            bookingDetails.innerHTML = `
                <p><strong>Service:</strong> ${getServiceName(serviceType)}</p>
                <p><strong>Provider:</strong> ${booking.provider}</p>
                <p><strong>Date:</strong> ${formatDate(date)} at ${time}</p>
                <p><strong>Location:</strong> ${location}</p>
                ${notes ? <p><strong>Notes:</strong> ${notes}</p> : ''}
            `;
            
            bookingModal.style.display = 'block';
            
            // Reset form
            bookingForm.reset();
        });
    }
    
    // Close modal events
    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            confirmationModal.style.display = 'none';
            bookingModal.style.display = 'none';
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
        if (e.target === bookingModal) {
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
function displayProviders(providers) {
    providersContainer.innerHTML = '';
    
    if (providers.length === 0) {
        providersContainer.innerHTML = '<p>No providers found.</p>';
        return;
    }
    
    providers.forEach(provider => {
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