if (!sessionStorage.getItem('adminAuthenticated')) {
    window.location.href = 'auth.html';
}

// Adds logout functionality
function setupAdminHeader() {
    const adminEmail = sessionStorage.getItem('adminEmail');
    if (adminEmail) {
        const adminProfile = document.querySelector('.admin-profile');
        if (adminProfile) {
            adminProfile.innerHTML += `
                <div class="admin-dropdown">
                    <span>${adminEmail}</span>
                    <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a>
                </div>
            `;
            
            document.getElementById('logout-btn').addEventListener('click', function(e) {
                e.preventDefault();
                sessionStorage.removeItem('adminAuthenticated');
                sessionStorage.removeItem('adminEmail');
                window.location.href = 'auth.html';
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Load all pending providers
    loadPendingProviders();
    
    // Setup event listeners
    document.getElementById('refresh-btn').addEventListener('click', loadPendingProviders);
    document.getElementById('approval-filter').addEventListener('change', filterProviders);
    
    // Modal close button
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    
    // Approval buttons
    document.getElementById('approve-btn').addEventListener('click', approveProvider);
    document.getElementById('reject-btn').addEventListener('click', rejectProvider);
    document.getElementById('hold-btn').addEventListener('click', putOnHold);
});

function loadPendingProviders() {
    const providers = JSON.parse(localStorage.getItem('providers')) || [];
    const pendingProviders = providers.filter(p => p.status === 'pending');
    
    // Update stats
    document.getElementById('pending-count').textContent = pendingProviders.length;
    document.getElementById('approved-count').textContent = 
        providers.filter(p => p.status === 'approved').length;
    document.getElementById('rejected-count').textContent = 
        providers.filter(p => p.status === 'rejected').length;
    
    // Render list
    const container = document.getElementById('pending-providers-list');
    container.innerHTML = '';
    
    if (pendingProviders.length === 0) {
        container.innerHTML = '<p class="no-results">No pending providers at this time.</p>';
        return;
    }
    
    pendingProviders.forEach(provider => {
        const card = document.createElement('div');
        card.className = 'provider-card';
        card.dataset.id = provider.id;
        card.innerHTML = `
            <img src="${provider.image || 'images/default-avatar.jpg'}" class="provider-avatar">
            <div class="provider-info">
                <h4>${provider.name}</h4>
                <p>${getServiceName(provider.service)} • ${provider.location}</p>
                <small>Applied: ${formatDate(provider.submissionDate)}</small>
            </div>
            <div class="provider-actions">
                <button class="btn-review"><i class="fas fa-eye"></i> Review</button>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Add review button events
    document.querySelectorAll('.btn-review').forEach(btn => {
        btn.addEventListener('click', function() {
            const providerId = parseInt(this.closest('.provider-card').dataset.id);
            openReviewModal(providerId);
        });
    });
}

function openReviewModal(providerId) {
    const providers = JSON.parse(localStorage.getItem('providers')) || [];
    const provider = providers.find(p => p.id === providerId);
    
    if (!provider) return;
    
    const modal = document.getElementById('approval-modal');
    const details = document.getElementById('provider-details');
    
    details.innerHTML = `
        <div class="provider-header">
            <img src="${provider.image || 'images/default-avatar.jpg'}" class="provider-avatar-large">
            <div>
                <h3>${provider.name}</h3>
                <p class="service-badge">${getServiceName(provider.service)}</p>
            </div>
        </div>
        
        <div class="provider-details-grid">
            <div>
                <h4>Contact Info</h4>
                <p><i class="fas fa-phone"></i> ${provider.phone || 'Not provided'}</p>
                <p><i class="fas fa-envelope"></i> ${provider.email || 'Not provided'}</p>
            </div>
            
            <div>
                <h4>Service Details</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${provider.location || 'Not specified'}</p>
                <p><i class="fas fa-money-bill-wave"></i> ₦${provider.rate || '0'}/hour</p>
            </div>
            
            <div class="full-width">
                <h4>About</h4>
                <p>${provider.bio || 'No bio provided.'}</p>
            </div>
        </div>
    `;
    
    // Store current provider ID in modal
    modal.dataset.providerId = providerId;
    modal.style.display = 'block';
}

function approveProvider() {
    const modal = document.getElementById('approval-modal');
    const providerId = parseInt(modal.dataset.providerId);
    
    let providers = JSON.parse(localStorage.getItem('providers')) || [];
    const providerIndex = providers.findIndex(p => p.id === providerId);
    
    if (providerIndex !== -1) {
        providers[providerIndex].status = 'approved';
        providers[providerIndex].approvalDate = new Date().toISOString();
        localStorage.setItem('providers', JSON.stringify(providers));
        
        // Send approval email
        sendProviderEmail(providerId, 'approval');
        
        closeModal();
        loadPendingProviders();
    }
}

// Similar functions for rejectProvider() and putOnHold()

function closeModal() {
    document.getElementById('approval-modal').style.display = 'none';
}

// Helper functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function getServiceName(serviceType) {
    // Your existing service name mapping
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

// Email notification simulation
function sendProviderEmail(providerId, type) {
    const providers = JSON.parse(localStorage.getItem('providers')) || [];
    const provider = providers.find(p => p.id === providerId);
    
    if (!provider) return;
    
    let email = {
        to: provider.email,
        subject: '',
        body: '',
        sent: new Date().toISOString()
    };
    
    switch(type) {
        case 'approval':
            email.subject = 'Your Provider Account Has Been Approved!';
            email.body = `Dear ${provider.name},\n\nWe're excited to inform you that your ${getServiceName(provider.service)} provider account has been approved!\n\nYou can now start receiving booking requests from clients.\n\nThank you,\nJusta-Call-Away Team`;
            break;
            
        case 'rejection':
            email.subject = 'Regarding Your Provider Application';
            email.body = `Dear ${provider.name},\n\nAfter reviewing your application, we need some additional information before we can approve your ${getServiceName(provider.service)} provider account.\n\nPlease login to your account to see the details.\n\nThank you,\nJusta-Call-Away Team`;
            break;
    }
    
    // Saves to "sent emails" (in real app would actually send)
    let emails = JSON.parse(localStorage.getItem('adminEmails')) || [];
    emails.push(email);
    localStorage.setItem('adminEmails', JSON.stringify(emails));
    
    console.log('Email sent:', email); // For demo purposes
}


// Email log functionality
function loadEmailLog() {
    const emails = JSON.parse(localStorage.getItem('adminEmails')) || [];
    const typeFilter = document.getElementById('email-type-filter').value;
    const dateFilter = document.getElementById('email-date-filter').value;
    
    let filteredEmails = emails;
    
    if (typeFilter !== 'all') {
        filteredEmails = filteredEmails.filter(e => e.subject.includes(typeFilter === 'approval' ? 'Approved' : 'Application'));
    }
    
    if (dateFilter) {
        filteredEmails = filteredEmails.filter(e => e.sent.startsWith(dateFilter));
    }
    
    const container = document.getElementById('email-list');
    container.innerHTML = '';
    
    if (filteredEmails.length === 0) {
        container.innerHTML = '<p class="no-results">No emails found matching your criteria.</p>';
        return;
    }
    
    filteredEmails.forEach(email => {
        const type = email.subject.includes('Approved') ? 'approval' : 'rejection';
        const emailDate = new Date(email.sent).toLocaleString();
        
        const emailEl = document.createElement('div');
        emailEl.className = 'email-item';
        emailEl.innerHTML = `
            <div class="email-header">
                <span>To: ${email.to}</span>
                <span class="email-type ${type}">${type === 'approval' ? 'Approval' : 'Rejection'}</span>
            </div>
            <div class="email-subject"><strong>${email.subject}</strong></div>
            <div class="email-date">${emailDate}</div>
            <div class="email-body">${email.body}</div>
        `;
        container.appendChild(emailEl);
    });
}

// Add event listeners for email log
document.getElementById('email-type-filter')?.addEventListener('change', loadEmailLog);
document.getElementById('email-date-filter')?.addEventListener('change', loadEmailLog);