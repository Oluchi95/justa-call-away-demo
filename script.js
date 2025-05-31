// Sample data for service providers (only declared once)
const providers = [
    // ... (your existing provider data)
];

// Nigerian states data
const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
    "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
    "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
    "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
    "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
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

// Helper functions
function getServiceName(serviceType) {
    const services = {
        nanny: 'Nanny',
        handyman: 'Handyman',
        mover: 'Mover',
        gardener: 'Gardener',
        electrician: 'Electrician',
        plumber: 'Plumber',
        painter: 'Painter',
        carpenter: 'Carpenter',
        mechanic: 'Mechanic',
        hairStylist: 'Hair Stylist',
        makeupArtist: 'Makeup Artist',
        tailor: 'Tailor',
        fitnessTrainer: 'Fitness Trainer',
        webDeveloper: 'Web Developer',
        graphicDesigner: 'Graphic Designer',
        interiorDesigner: 'Interior Designer',
        caterer: 'Caterer',
        photographer: 'Photographer',
        homeCleaner: 'Home Cleaner',       
        driver: 'Driver',
        fashionDesigner: 'Fashion Designer',
        barber: 'Barber',
        lessonTeacher: 'Lesson Teacher',
        laundry: 'Laundry Service',
        acRepair: 'AC Repair',
        carWash: 'Car Wash',
        pestControl: 'Pest Control',
        technician: 'Phone/Computer Technician',
        bouncer: 'Event Bouncer',
        security: 'Security Personnel',
        dj: 'DJ',
        eventPlanner: 'Event Planner'
    };
    return services[serviceType] || serviceType;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function filterProviders() {
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    const serviceValue = serviceParam || (serviceFilter ? serviceFilter.value : 'all');
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
    
    // Set the service filter dropdown to match URL parameter if it exists
    if (serviceParam && serviceFilter) {
        serviceFilter.value = serviceParam;
    }
    
    displayProviders(filteredProviders);
}

function displayProviders(providersToDisplay) {
    if (!providersContainer) return;
    
    providersContainer.innerHTML = '';
    
    // Check URL parameters for service filter
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    // If coming from featured services and no providers match
    if (serviceParam && providersToDisplay.length === 0) {
        providersContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-circle" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h3>No ${getServiceName(serviceParam)}s Available Yet</h3>
                <p>We don't have any ${getServiceName(serviceParam)}s registered in our platform currently.</p>
                <p>Check back later or <a href="provider-signup.html">sign up</a> as a ${getServiceName(serviceParam)}!</p>
            </div>
        `;
        return;
    }
    
    // Regular empty state
    if (providersToDisplay.length === 0) {
        providersContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--accent-color); margin-bottom: 20px;"></i>
                <h3>No Providers Match Your Criteria</h3>
                <p>Try adjusting your filters or check back later for more providers.</p>
            </div>
        `;
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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Populate Nigerian states in location filter
    if (locationFilter) {
        nigerianStates.forEach(state => {
            const option = document.createElement('option');
            option.value = state.toLowerCase().replace(' ', '-');
            option.textContent = state;
            locationFilter.appendChild(option);
        });
    }

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    
    // Check if we're on the providers page
    if (providersContainer) {
        if (serviceParam && serviceFilter) {
            serviceFilter.value = serviceParam;
        }
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
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            const contact = {
                name,
                email,
                message,
                date: new Date().toISOString()
            };
            
            let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
            contacts.push(contact);
            localStorage.setItem('contacts', JSON.stringify(contacts));
            
            if (modalMessage) modalMessage.textContent = 'Thank you for your message! We will get back to you soon.';
            if (confirmationModal) confirmationModal.style.display = 'block';
            
            contactForm.reset();
        });
    }
    
    // Booking form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const serviceType = document.getElementById('service-type').value;
            const provider = document.getElementById('provider').value;
            const date = document.getElementById('booking-date').value;
            const time = document.getElementById('booking-time').value;
            const location = document.getElementById('location').value;
            const notes = document.getElementById('notes').value;
            
            if (!serviceType || !date || !time || !location) {
                alert('Please fill in all required fields');
                return;
            }
            
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
            
            let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            bookings.push(booking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            if (bookingDetails) {
                bookingDetails.innerHTML = `
                    <p><strong>Service:</strong> ${getServiceName(serviceType)}</p>
                    <p><strong>Provider:</strong> ${booking.provider}</p>
                    <p><strong>Date:</strong> ${formatDate(date)} at ${time}</p>
                    <p><strong>Location:</strong> ${location}</p>
                    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
                `;
            }
            
            if (bookingModal) bookingModal.style.display = 'block';
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

// Function to generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '<i class="fas fa-star"></i>'.repeat(fullStars) +
        (halfStar ? '<i class="fas fa-star-half-alt"></i>' : '') +
        '<i class="far fa-star"></i>'.repeat(emptyStars);
}

// Open booking form with provider details
function openBookingForm(providerId) {
    const provider = providers.find(p => p.id === parseInt(providerId));
    if (!provider) return;

    // Get reference to provider info section
    const providerInfo = document.querySelector('.selected-provider-info');
    
    // Update and show provider info if the element exists
    if (providerInfo) {
        providerInfo.querySelector('.provider-name').textContent = provider.name;
        providerInfo.querySelector('.provider-service').textContent = provider.serviceName;
        providerInfo.querySelector('.provider-rating').innerHTML = generateStarRating(provider.rating);
        providerInfo.querySelector('.provider-location').textContent = provider.locationName;
        providerInfo.style.display = 'block'; // This makes it visible
    }

    // Set form values if on booking page
    const serviceTypeSelect = document.getElementById('service-type');
    const providerSelect = document.getElementById('provider');
    
    if (serviceTypeSelect) serviceTypeSelect.value = provider.service;
    if (providerSelect) providerSelect.value = provider.id;

    // If not on booking page, redirect there with provider ID
    if (!window.location.href.includes('booking.html')) {
        window.location.href = `booking.html?provider=${provider.id}`;
    } else if (providerInfo) {
        // Smooth scroll to form if already on booking page
        providerInfo.scrollIntoView({ behavior: 'smooth' });
    }
}

// Check if we're on the providers page
if (document.getElementById('providers-container')) {
    // Initialize providers display
    displayProviders(providers);
}
// Check if we're on the booking page
if (document.getElementById('booking-form')) {
    // Populate service type dropdown
    const serviceTypeSelect = document.getElementById('service-type');
    if (serviceTypeSelect) {
        const services = ['nanny', 'handyman', 'mover', 'cleaner'];
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = getServiceName(service);
            serviceTypeSelect.appendChild(option);
        });
    }
    
    // Populate provider dropdown
    const providerSelect = document.getElementById('provider');
    if (providerSelect) {
        providers.forEach(provider => {
            const option = document.createElement('option');
            option.value = provider.name;
            option.textContent = provider.name;
            providerSelect.appendChild(option);
        });
    }
}

// Initialize based on current page
function initPage() {
    if (document.getElementById('providers-container')) {
        displayProviders(providers);
        
        // Add event listeners for filters
        document.getElementById('service-filter')?.addEventListener('change', filterProviders);
        document.getElementById('location-filter')?.addEventListener('change', filterProviders);
        document.getElementById('rating-filter')?.addEventListener('change', filterProviders);
    }
    
    if (document.getElementById('booking-form')) {
        initBookingForm();
    }
}

// Initialize booking form specifically
function initBookingForm() {
    const serviceTypeSelect = document.getElementById('service-type');
    const providerSelect = document.getElementById('provider');
    
    // Get unique services from providers
    const uniqueServices = [...new Set(providers.map(p => p.service))];
    
    // Populate service types
    uniqueServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service;
        option.textContent = getServiceName(service);
        serviceTypeSelect?.appendChild(option);
    });
    
    // Populate providers
    providers.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.id;
        option.textContent = `${provider.name} (${provider.serviceName})`;
        providerSelect?.appendChild(option);
    });
    
    // Handle URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('service');
    const providerParam = urlParams.get('provider');
    
    if (serviceParam && serviceTypeSelect) {
        serviceTypeSelect.value = serviceParam;
    }
    
    if (providerParam && providerSelect) {
        providerSelect.value = providerParam;
    }
}

// Call initialization when DOM loads
document.addEventListener('DOMContentLoaded', initPage);

// Provider Signup Form Handling
if (document.getElementById('provider-signup-form')) {
    const signupForm = document.getElementById('provider-signup-form');
    const signupModal = document.getElementById('signup-modal');
    
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading spinner
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<div class="loading-spinner"></div> Processing...';
        
        // Collect form data
        const formData = {
            name: document.getElementById('full-name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            service: document.getElementById('service').value,
            experience: document.getElementById('experience').value,
            location: document.getElementById('location').value,
            bio: document.getElementById('bio').value,
            rate: document.getElementById('hourly-rate').value,
            availability: Array.from(document.querySelectorAll('input[name="availability"]:checked')).map(el => el.value)
        };
        
        // In a real app, you would send this to your backend
        console.log('Provider signup data:', formData);
        
        // Simulate API call
        setTimeout(() => {
            // Save to localStorage
            let providerApplications = JSON.parse(localStorage.getItem('providerApplications')) || [];
            providerApplications.push({
                ...formData,
                id: Date.now(),
                date: new Date().toISOString(),
                status: 'pending'
            });
            localStorage.setItem('providerApplications', JSON.stringify(providerApplications));
            
            // Show success modal
            signupModal.style.display = 'block';
            
            // Reset form
            signupForm.reset();
            submitBtn.disabled = false;
            submitBtn.textContent = 'Complete Registration';
        }, 1500);
    });
}

// Close modal for signup page
document.querySelectorAll('.close-modal, #modal-ok').forEach(btn => {
    btn.addEventListener('click', function() {
        document.getElementById('signup-modal').style.display = 'none';
    });
});

// Populate Nigerian states in signup form
if (document.getElementById('location')) {
    nigerianStates.forEach(state => {
        const option = document.createElement('option');
        option.value = state.toLowerCase().replace(' ', '-');
        option.textContent = state;
        document.getElementById('location').appendChild(option);
    });
}

// Enhanced Provider Display
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
            <div class="provider-img">
                <img src="${provider.image}" alt="${provider.name}" loading="lazy">
                ${provider.verified ? '<span class="provider-badge"><i class="fas fa-check-circle"></i> Verified</span>' : ''}
            </div>
            <div class="provider-info">
                <h3>${provider.name}</h3>
                <span class="service-type">${provider.serviceName}</span>
                <div class="rating">
                    ${generateStarRating(provider.rating)} (${provider.reviews} reviews)
                </div>
                <div class="location">
                    <i class="fas fa-map-marker-alt"></i> ${provider.locationName}
                </div>
                <div class="price">${provider.price}</div>
                <p class="description">${provider.description}</p>
                <a href="booking.html?service=${provider.service}&provider=${provider.name.toLowerCase().replace(' ', '-')}" class="btn btn-book">Book Now</a>
            </div>
        `;
        
        providersContainer.appendChild(providerCard);
    });
}

// Add this to your existing providers array for demo purposes:
providers.push({
    id: 1,
    name: "Amina Okafor",
    service: "hair-stylist",
    serviceName: "Hair Stylist",
    rating: 4.9,
    reviews: 47,
    location: "Ondo",
    locationName: "Ondo",
    price: "₦15,000/session",
    description: "Professional hairstylist specializing in braids, weaves, and natural hair care. 5 years experience with celebrity clients.",
    image: "images/hairstylist.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 2,
    name: "Chinedu Obi",
    service: "electrician",
    serviceName: "Electrician",
    rating: 4.8,
    reviews: 30,
    location: "fct-(abuja)",
    locationName: "Abuja",
    price: "₦10,000/hour",
    description: "Experienced electrician with over 10 years in residential and commercial wiring. Certified and insured.",
    image: "images/electrician.jpg",
    verified: true
});

// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 3,
    name: "Fatima Bello",
    service: "makeup-artist",
    serviceName: "Makeup Artist",
    rating: 4.7,
    reviews: 25,
    location: "osun",
    locationName: "Osogbo",
    price: "₦80,000/session",
    description: "Professional makeup artist with a passion for enhancing natural beauty. Specializes in bridal and event makeup.",
    image: "images/makeup_artist.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 4,
    name: "Emeka Nwosu",
    service: "plumber",
    serviceName: "Plumber",
    rating: 4.6,
    reviews: 20,
    location: "oyo",
    locationName: "Ibadan",
    price: "₦10,000/hour",
    description: "Expert plumber with over 15 years of experience in fixing leaks, installations, and repairs. Reliable and efficient.",
    image: "images/plumber.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 5,
    name: "Ngozi Uche",
    service: "caterer",
    serviceName: "Caterer",
    rating: 4.5,
    reviews: 15,
    location: "enugu",
    locationName: "Enugu",
    price: "₦3,000,000/event",
    description: "Experienced caterer specializing in Nigerian and continental dishes. Perfect for weddings, parties, and corporate events.",
    image: "images/caterer.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 6,
    name: "Yetunde Adeyemi",
    service: "photographer",
    serviceName: "Photographer",
    rating: 4.8,
    reviews: 35,
    location: "lagos",
    locationName: "Lagos",
    price: "₦150,000/session",
    description: "Professional photographer with a keen eye for detail. Specializes in portraits, events, and commercial photography.",
    image: "images/photographer.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 7,
    name: "Waheeb Musa",
    service: "fitness-trainer",
    serviceName: "Fitness Trainer",
    rating: 4.9,
    reviews: 50,
    location: "fct-(abuja)",
    locationName: "Abuja",
    price: "₦30,000/session",
    description: "Certified fitness trainer with a focus on personal training and group classes. Specializes in weight loss and strength training.",
    image: "images/fitness_trainer.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 8,
    name: "Chika Eze",
    service: "graphic-designer",
    serviceName: "Graphic Designer",
    rating: 4.7,
    reviews: 40,
    location: "rivers",
    locationName: "Port Harcourt",
    price: "₦100,000/project",
    description: "Creative graphic designer with expertise in branding, logo design, and digital marketing materials.",
    image: "images/graphic_designer.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 9,
    name: "Priscilla Ikeri",
    service: "web-developer",
    serviceName: "Web Developer",
    rating: 4.8,
    reviews: 45,
    location: "lagos",
    locationName: "Yaba",
    price: "₦400,000/project",
    description: "Full-stack web developer with a passion for creating responsive and user-friendly websites. Experienced in both front-end and back-end development.",
    image: "images/web_developer.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 10,
    name: "Adaobi Nwankwo",
    service: "interior-designer",
    serviceName: "Interior Designer",
    rating: 4.6,
    reviews: 30,
    location: "enugu",
    locationName: "Enugu",
    price: "₦1,000,000/project",
    description: "Professional interior designer with a flair for creating beautiful and functional spaces. Specializes in residential and commercial design.",
    image: "images/interior_designer.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 11,
    name: "Samuel Adeola",
    service: "carpenter",
    serviceName: "Carpenter",
    rating: 4.5,
    reviews: 20,
    location: "ogun",
    locationName: "Abeokuta",
    price: "₦10,000/hour",
    description: "Skilled carpenter with over 10 years of experience in furniture making, repairs, and custom woodwork.",
    image: "images/carpenter.jpg",
    verified: true
});
// Add event listener for the new provider
document.addEventListener('DOMContentLoaded', function() {
    // Re-display providers to include the new one
    displayProviders(providers);
});
// Add a new provider to the list
providers.push({
    id: 12,
    name: "John Okoro",
    service: "tailor",
    serviceName: "Tailor",
    rating: 4.7,
    reviews: 25,
    location: "ondo",
    locationName: "Akure",
    price: "₦15,000/outfit",
    description: "Experienced tailor specializing in custom clothing, alterations, and traditional attire. Known for attention to detail and quality.",
    image: "images/tailor.jpg",
    verified: true
});


// Carousel functionality
function initCarousel() {
    const carousel = document.querySelector('.services-grid');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    
    if (!carousel) return;
    
    let currentIndex = 0;
    const cards = document.querySelectorAll('.service-card');
    const cardCount = cards.length;
    
    // Update dots and scroll position
    function updateCarousel() {
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Scroll to current card
        cards[currentIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
    
    // Navigation functions
    function goToIndex(index) {
        currentIndex = (index + cardCount) % cardCount;
        updateCarousel();
    }
    
    function next() {
        goToIndex(currentIndex + 1);
    }
    
    function prev() {
        goToIndex(currentIndex - 1);
    }
    
    // Event listeners
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToIndex(index));
    });
    
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    
    // Auto-advance (optional)
    let autoScroll = setInterval(next, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoScroll));
    carousel.addEventListener('mouseleave', () => {
        autoScroll = setInterval(next, 5000);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initCarousel);