// script.js - الدوال العامة لـ Fast Cach

// بيانات أولية للعروض والهدايا (ستستبدل بـ Supabase لاحقًا)
const sampleOffers = [
    {
        id: 1,
        title: "سجل في التطبيق X",
        description: "سجل في تطبيق جديد واحصل على $5.00",
        price: "$5.00",
        category: "تطبيقات",
        icon: "fas fa-mobile-alt"
    },
    {
        id: 2,
        title: "أكمل استبيان سريع",
        description: "أجِب على استبيان لمدة 5 دقائق",
        price: "$2.50",
        category: "استبيانات",
        icon: "fas fa-clipboard-list"
    },
    {
        id: 3,
        title: "شاهد فيديو إعلاني",
        description: "شاهد فيديو إعلاني واحصل على $0.25",
        price: "$0.25",
        category: "فيديوهات",
        icon: "fas fa-video"
    },
    {
        id: 4,
        title: "تحميل لعبة",
        description: "حمل اللعبة واجتاز المستوى الأول",
        price: "$7.00",
        category: "ألعاب",
        icon: "fas fa-gamepad"
    }
];

const sampleGifts = [
    {
        id: 1,
        title: "بطاقة Visa 1$",
        description: "بطاقة فيزا مسبقة الدفع بقيمة 1 دولار",
        price: "$1.00",
        stock: 984,
        category: "بطاقات",
        image: "https://cdn-icons-png.flaticon.com/512/196/196578.png"
    },
    {
        id: 2,
        title: "بطاقة Free Fire 100 ماسة",
        description: "بطاقة لعبة فري فاير بقيمة 100 ماسة",
        price: "$0.99",
        stock: 754,
        category: "ألعاب",
        image: "https://cdn-icons-png.flaticon.com/512/3067/3067256.png"
    },
    {
        id: 3,
        title: "PayPal $5",
        description: "سحب مباشر لـ PayPal بقيمة 5 دولارات",
        price: "$5.00",
        stock: 1200,
        category: "سحب",
        image: "https://cdn-icons-png.flaticon.com/512/196/196561.png"
    },
    {
        id: 4,
        title: "بطاقة Netflix شهر",
        description: "اشتراك شهري في Netflix",
        price: "$12.99",
        stock: 356,
        category: "ترفيه",
        image: "https://cdn-icons-png.flaticon.com/512/732/732228.png"
    }
];

// دالة تهيئة الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // عرض العروض
    displayOffers();
    
    // عرض الهدايا
    displayGifts();
    
    // إعداد النوافذ المنبثقة
    setupModals();
    
    // تحديث رصيد المستخدم
    updateUserBalance();
});

// عرض العروض في الصفحة الرئيسية
function displayOffers() {
    const offersGrid = document.getElementById('offersGrid');
    if (!offersGrid) return;
    
    offersGrid.innerHTML = '';
    
    sampleOffers.slice(0, 4).forEach(offer => {
        const offerCard = document.createElement('div');
        offerCard.className = 'offer-card';
        offerCard.innerHTML = `
            <div class="offer-header" style="background: linear-gradient(135deg, #4361ee, #7209b7); padding: 20px; text-align: center;">
                <i class="${offer.icon}" style="font-size: 3rem; color: white;"></i>
            </div>
            <div class="offer-content">
                <h3 class="offer-title">${offer.title}</h3>
                <p>${offer.description}</p>
                <div class="offer-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="offer-price">${offer.price}</span>
                    <button class="btn btn-primary btn-sm" onclick="startOffer(${offer.id})">
                        <i class="fas fa-play"></i> ابدأ
                    </button>
                </div>
                <span class="offer-stock">متاح الآن</span>
            </div>
        `;
        offersGrid.appendChild(offerCard);
    });
}

// عرض الهدايا في الصفحة الرئيسية
function displayGifts() {
    const giftsGrid = document.getElementById('giftsGrid');
    if (!giftsGrid) return;
    
    giftsGrid.innerHTML = '';
    
    sampleGifts.slice(0, 4).forEach(gift => {
        const giftCard = document.createElement('div');
        giftCard.className = 'gift-card';
        giftCard.innerHTML = `
            <img src="${gift.image}" alt="${gift.title}">
            <div class="gift-content">
                <h3 class="gift-title">${gift.title}</h3>
                <p>${gift.description}</p>
                <div class="gift-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                    <span class="gift-price">${gift.price}</span>
                    <button class="btn btn-accent btn-sm" onclick="redeemGift(${gift.id})" ${gift.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> استبدال
                    </button>
                </div>
                <span class="gift-stock">المتبقي: ${gift.stock}</span>
            </div>
        `;
        giftsGrid.appendChild(giftCard);
    });
}

// إعداد النوافذ المنبثقة
function setupModals() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            registerModal.style.display = 'flex';
        });
    }
    
    if (showRegister) {
        showRegister.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });
    
    // إغلاق النوافذ عند النقر خارجها
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });
    
    // معالجة تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // محاكاة تسجيل الدخول (ستستبدل بـ Supabase)
            simulateLogin(email, password);
        });
    }
    
    // معالجة التسجيل
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            if (password !== confirmPassword) {
                alert('كلمات المرور غير متطابقة!');
                return;
            }
            
            // محاكاة التسجيل (ستستبدل بـ Supabase)
            simulateRegister(name, email, password);
        });
    }
}

// محاكاة تسجيل الدخول
function simulateLogin(email, password) {
    // هذا جزء مؤقت - سيتم استبداله بـ Supabase
    console.log('تسجيل الدخول:', email);
    
    // عرض رسالة نجاح
    alert('تم تسجيل الدخول بنجاح!');
    
    // تحديث واجهة المستخدم
    updateUserBalance();
    
    // إغلاق النافذة
    document.getElementById('loginModal').style.display = 'none';
    
    // تغيير أزرار المستخدم
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
            </button>
            <button class="btn btn-primary" onclick="window.location.href='dashboard.html'">
                <i class="fas fa-user-circle"></i> لوحة التحكم
            </button>
        `;
    }
}

// محاكاة التسجيل
function simulateRegister(name, email, password) {
    console.log('تسجيل جديد:', name, email);
    
    // عرض رسالة نجاح
    alert('تم إنشاء حسابك بنجاح! تم إضافة $1.00 هدية ترحيب.');
    
    // إغلاق النافذة
    document.getElementById('registerModal').style.display = 'none';
    
    // تحديث الرصيد
    updateUserBalance();
}

// تحديث رصيد المستخدم
function updateUserBalance() {
    const balanceDisplay = document.getElementById('userBalance');
    if (balanceDisplay) {
        // محاكاة رصيد (ستستبدل بـ Supabase)
        const simulatedBalance = "$5.75";
        balanceDisplay.textContent = simulatedBalance;
    }
}

// بدء عرض
function startOffer(offerId) {
    const offer = sampleOffers.find(o => o.id === offerId);
    if (offer) {
        if (confirm(`هل تريد بدء العرض: ${offer.title} بمكافأة ${offer.price}؟`)) {
            alert('تم بدء العرض! أكمل المهمة واحصل على مكافأتك.');
            // هنا سيتم إضافة منطق المتابعة
        }
    }
}

// استبدال هدية
function redeemGift(giftId) {
    const gift = sampleGifts.find(g => g.id === giftId);
    if (gift) {
        if (gift.stock <= 0) {
            alert('نفذت الكمية من هذه الهدية!');
            return;
        }
        
        if (confirm(`هل تريد استبدال ${gift.title} مقابل ${gift.price}؟`)) {
            alert('تم طلب الهدية بنجاح! ستظهر في لوحة التحكم خلال دقائق.');
            // هنا سيتم إضافة منطق الاستبدال
        }
    }
}

// تسجيل الخروج
function logout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        // إعادة تعيين واجهة المستخدم
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <button id="loginBtn" class="btn btn-outline"><i class="fas fa-sign-in-alt"></i> تسجيل الدخول</button>
                <button id="registerBtn" class="btn btn-primary"><i class="fas fa-user-plus"></i> إنشاء حساب</button>
            `;
            // إعادة إعداد الأزرار
            setTimeout(() => setupModals(), 100);
        }
        
        // إعادة تعيين الرصيد
        const balanceDisplay = document.getElementById('userBalance');
        if (balanceDisplay) {
            balanceDisplay.textContent = "$0.00";
        }
        
        alert('تم تسجيل الخروج بنجاح');
    }
}

// دالة المساعدة لإضافة فئة CSS
function addCSSClass(element, className) {
    if (element && !element.classList.contains(className)) {
        element.classList.add(className);
    }
}

// دالة المساعدة لإزالة فئة CSS
function removeCSSClass(element, className) {
    if (element && element.classList.contains(className)) {
        element.classList.remove(className);
    }
  }
