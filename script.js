document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenu');
    const nav = document.getElementById('nav');
    
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('show');
        
        const icon = this.querySelector('i');
        if (nav.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.style.overflow = 'hidden';
        } else {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#nav') && !e.target.closest('#mobileMenu') && nav.classList.contains('show')) {
            nav.classList.remove('show');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            document.body.style.overflow = '';
        }
    });

    // Header scroll effect
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll <= 0) {
            header.classList.remove('hide');
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('hide')) {
            header.classList.add('hide');
        } else if (currentScroll < lastScroll && header.classList.contains('hide')) {
            header.classList.remove('hide');
        }
        
        if (currentScroll > 50) {
            header.classList.add('shadow-lg');
        } else {
            header.classList.remove('shadow-lg');
        }
        
        lastScroll = currentScroll;
    });

    // Scroll progress bar
    const progressBar = document.getElementById('progressBar');
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollProgress = (scrollTop / scrollHeight) * 100;
        progressBar.style.width = scrollProgress + '%';
    });

    // Back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('opacity-0', 'invisible');
            backToTopBtn.classList.add('opacity-100', 'visible');
        } else {
            backToTopBtn.classList.add('opacity-0', 'invisible');
            backToTopBtn.classList.remove('opacity-100', 'visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Cart Functionality
    const cartModal = document.querySelector('.cart-modal');
    const cartBtn = document.querySelector('.cart-icon a');
    const fabBtn = document.getElementById('fab');
    const closeCart = document.querySelector('.close');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutForm = document.querySelector('.checkout-form');
    const closeForm = document.querySelector('.close-form');
    const orderForm = document.getElementById('order-form');
    const confirmation = document.querySelector('.confirmation');
    const closeConfirmation = document.querySelector('.close-confirmation');

    let cart = [];
    let totalPrice = 0;

    // Open Cart
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            cartModal.classList.add('flex');
        }, 10);
    });

    fabBtn.addEventListener('click', function(e) {
        e.preventDefault();
        cartModal.classList.remove('hidden');
        setTimeout(() => {
            cartModal.classList.add('flex');
        }, 10);
    });

    // Close Cart
    closeCart.addEventListener('click', function() {
        cartModal.classList.add('hidden');
        setTimeout(() => {
            cartModal.classList.remove('flex');
        }, 300);
    });

    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.classList.add('hidden');
            setTimeout(() => {
                cartModal.classList.remove('flex');
            }, 300);
        }
        if (e.target === checkoutForm) {
            checkoutForm.classList.add('hidden');
            setTimeout(() => {
                checkoutForm.classList.remove('flex');
            }, 300);
        }
        if (e.target === confirmation) {
            confirmation.classList.add('hidden');
            setTimeout(() => {
                confirmation.classList.remove('flex');
            }, 300);
        }
    });

    // Add to Cart
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = parseInt(this.getAttribute('data-price'));
            const qty = parseInt(this.parentElement.querySelector('.qty').value);
            
            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.qty += qty;
            } else {
                cart.push({ id, name, price, qty });
            }
            
            updateCart();
            showNotification(`${name} added to cart`);
        });
    });

    // Update Cart
    function updateCart() {
        totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-center py-5">Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item flex justify-between items-center py-5 border-b border-amber-200';
                cartItemElement.innerHTML = `
                    <img src="image/${item.id === '1' ? 'GabinChoco.jpg' : 'JellyBall.jpg'}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                    <div class="cart-item-info flex-1 ml-5 text-left">
                        <h4 class="text-lg font-bold mb-1">${item.name}</h4>
                        <p>${item.qty} x Rp${item.price.toLocaleString()}</p>
                    </div>
                    <p class="cart-item-price font-bold text-amber-800 min-w-[100px] text-right">Rp${(item.price * item.qty).toLocaleString()}</p>
                    <span class="cart-item-remove text-red-500 cursor-pointer ml-5 text-xl hover:scale-110 transition-all duration-300" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
        
        totalPriceElement.textContent = `Rp${Math.round(totalPrice).toLocaleString()}`;
        
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        cartCount.textContent = totalItems;
        
        if (totalItems > 0) {
            fabBtn.classList.remove('hidden');
            fabBtn.classList.add('flex');
        } else {
            fabBtn.classList.add('hidden');
            fabBtn.classList.remove('flex');
        }
    }

    // Remove item from cart
    cartItemsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-trash') || e.target.classList.contains('cart-item-remove')) {
            const itemId = e.target.closest('.cart-item-remove').getAttribute('data-id');
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
            showNotification('Item removed from cart');
        }
    });

    // Quantity controls
    document.querySelectorAll('.quantity .plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.quantity .minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.nextElementSibling;
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        });
    });

    // Checkout
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty', 'error');
            return;
        }

        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';

        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.remove('hidden');

        setTimeout(() => {
            cartModal.classList.add('hidden');
            setTimeout(() => {
                cartModal.classList.remove('flex');
                checkoutForm.classList.remove('hidden');
                setTimeout(() => {
                    checkoutForm.classList.add('flex');
                    checkoutBtn.disabled = false;
                    checkoutBtn.innerHTML = 'Proceed to Checkout';
                    loadingOverlay.classList.add('hidden');
                }, 10);
            }, 300);
        }, 1000);
    });

    // Close checkout form
    closeForm.addEventListener('click', function() {
        checkoutForm.classList.add('hidden');
        setTimeout(() => {
            checkoutForm.classList.remove('flex');
        }, 300);
    });

    // Submit order
    // Submit order
    orderForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Placing Order...';

        const loadingOverlay = document.querySelector('.loading-overlay');
        loadingOverlay.classList.remove('hidden');

        const name = document.getElementById('name').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

        // Format cart items as an array of objects
        const cartItems = cart.map(item => ({
            name: item.name,
            quantity: item.qty,
            price: item.price,
            subtotal: item.price * item.qty
        }));

        const orderData = {
            name: name,
            phone: phone,
            address: address,
            payment: paymentMethod,
            items: cartItems,
            total: totalPrice,
            timestamp: new Date().toISOString()
        };

        // Replace with your correct Google Apps Script Web App URL
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyQDMQjJvKnqGKhbtd1GpEmhH68-X3BYlFhugQmU7Wjz5cMNKTTshb3qNzxxT3nyG78/exec';

        // Add error handling for the POST request
        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(() => {
            checkoutForm.classList.add('hidden');
            confirmation.classList.remove('hidden');
            loadingOverlay.classList.add('hidden');
            cart = [];
            updateCart();
            orderForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Place Order';
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Failed to place order. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Place Order';
            loadingOverlay.classList.add('hidden');
        });
    });

    // Background Music Control
    const bgMusic = document.getElementById('bgMusic');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = playPauseBtn.querySelector('i');
    const musicAlert = document.getElementById('musicAlert');
    let isPlaying = false;

    // Set default volume
    bgMusic.volume = 0.3;

    // Function to toggle play/pause
    function togglePlayPause() {
        if (isPlaying) {
            bgMusic.pause();
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
        } else {
            bgMusic.play()
                .then(() => {
                    playIcon.classList.remove('fa-play');
                    playIcon.classList.add('fa-pause');
                })
                .catch(error => {
                    console.error("Playback failed:", error);
                    musicAlert.classList.remove('hidden');
                    setTimeout(() => {
                        musicAlert.classList.add('hidden');
                    }, 3000);
                });
        }
        isPlaying = !isPlaying;
    }

    // Event listeners for audio player
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Try to play on first user interaction
    function handleFirstInteraction() {
        bgMusic.play()
            .then(() => {
                isPlaying = true;
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
            })
            .catch(error => {
                console.log("Autoplay prevented:", error);
            });
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('scroll', handleFirstInteraction);
    }

    // Add event listeners for first interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('scroll', handleFirstInteraction, { once: true });

    // Contact Section Scroll Buttons
    const contactInfo = document.querySelector('.contact-info');
    const scrollLeftBtn = document.getElementById('scrollLeft');
    const scrollRightBtn = document.getElementById('scrollRight');
    
    if (contactInfo && scrollLeftBtn && scrollRightBtn) {
        // Scroll to right
        scrollRightBtn.addEventListener('click', () => {
            contactInfo.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
        
        // Scroll to left
        scrollLeftBtn.addEventListener('click', () => {
            contactInfo.scrollBy({
                left: -300,
                behavior: 'smooth'
            });
        });
        
        // Hide buttons when at ends
        const checkScrollButtons = () => {
            scrollLeftBtn.style.display = contactInfo.scrollLeft <= 10 ? 'none' : 'flex';
            scrollRightBtn.style.display = 
                contactInfo.scrollLeft >= contactInfo.scrollWidth - contactInfo.clientWidth - 10 ? 
                'none' : 'flex';
        };
        
        contactInfo.addEventListener('scroll', checkScrollButtons);
        checkScrollButtons(); // Initial check
    }

    // Notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Initialize cart
    updateCart();

    // Show FAB when scrolling down
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            fabBtn.classList.remove('hidden');
            fabBtn.classList.add('flex');
        } else {
            fabBtn.classList.add('hidden');
            fabBtn.classList.remove('flex');
        }
    });
});