// admin-script.js - دوال لوحة التحكم الإدارية

// بيانات الإدارة المؤقتة (ستستبدل بـ Supabase)
const adminCredentials = {
    username: 'admin',
    password: '2009bbh2009' // سيتم تشفيرها في الإصدار النهائي
};

// بيانات وهمية للعرض
let adminData = {
    gifts: [...sampleGifts],
    offers: [...sampleOffers],
    users: [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com', balance: 15.75, level: 3, joined: '2023-10-15', status: 'نشط' },
        { id: 2, name: 'سارة علي', email: 'sara@example.com', balance: 8.50, level: 2, joined: '2023-11-02', status: 'نشط' },
        { id: 3, name: 'خالد حسين', email: 'khaled@example.com', balance: 0.25, level: 1, joined: '2023-11-20', status: 'نشط' }
    ],
    transactions: [
        { id: 1, user: 'أحمد محمد', type: 'استبدال هدية', amount: '$5.00', date: '2023-11-15', status: 'مكتمل' },
        { id: 2, user: 'سارة علي', type: 'سحب PayPal', amount: '$10.00', date: '2023-11-18', status: 'قيد الانتظار' },
        { id: 3, user: 'خالد حسين', type: 'استبدال هدية', amount: '$1.00', date: '2023-11-20', status: 'مرفوض' }
    ]
};

// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من تسجيل الدخول
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        showAdminDashboard();
    } else {
        showLoginScreen();
    }
    
    // إعداد نموذج تسجيل الدخول
    const loginForm = document.getElementById('adminLoginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            
            // التحقق من بيانات الدخول
            if (username === adminCredentials.username && password === adminCredentials.password) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', username);
                showAdminDashboard();
            } else {
                alert('اسم المستخدم أو كلمة المرور غير صحيحة!');
            }
        });
    }
    
    // تحديث التاريخ الحالي
    updateCurrentDate();
});

// عرض شاشة تسجيل الدخول
function showLoginScreen() {
    document.getElementById('adminLoginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

// عرض لوحة التحكم
function showAdminDashboard() {
    document.getElementById('adminLoginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    
    // تحديث اسم المشرف
    const adminName = localStorage.getItem('adminUsername') || 'المشرف';
    document.getElementById('adminName').textContent = adminName;
    
    // تحميل البيانات
    loadDashboardStats();
    loadGiftsTable();
    loadOffersTable();
    loadUsersTable();
    loadTransactionsTable();
}

// تسجيل خروج المشرف
function adminLogout() {
    if (confirm('هل تريد تسجيل الخروج؟')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        showLoginScreen();
    }
}

// تحديث التاريخ الحالي
function updateCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = now.toLocaleDateString('ar-SA', options);
    document.getElementById('currentDate').textContent = dateString;
}

// تحميل إحصائيات لوحة التحكم
function loadDashboardStats() {
    // إحصائيات وهمية
    document.getElementById('totalUsers').textContent = adminData.users.length;
    document.getElementById('totalGifts').textContent = '1,250';
    document.getElementById('totalRevenue').textContent = '$5,845.75';
    document.getElementById('activeOffers').textContent = adminData.offers.length;
    
    // تحديث الجدول السريع
    const tableBody = document.querySelector('#quickStatsTable tbody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td>المستخدمون الجدد اليوم</td>
                <td>15</td>
                <td>+$75.00</td>
                <td><span style="color: green;">↑ 12%</span></td>
            </tr>
            <tr>
                <td>المهام المكتملة</td>
                <td>342</td>
                <td>+$856.50</td>
                <td><span style="color: green;">↑ 8%</span></td>
            </tr>
            <tr>
                <td>الهدياء المستبدلة</td>
                <td>89</td>
                <td>-$445.00</td>
                <td><span style="color: red;">↓ 5%</span></td>
            </tr>
            <tr>
                <td>السحوبات الناجحة</td>
                <td>23</td>
                <td>-$230.00</td>
                <td><span style="color: green;">↑ 15%</span></td>
            </tr>
        `;
    }
}

// تحميل جدول الهدايا
function loadGiftsTable() {
    const tableBody = document.getElementById('giftsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    adminData.gifts.forEach(gift => {
        const status = gift.stock > 0 ? 'متاح' : 'نفذ';
        const statusClass = gift.stock > 0 ? 'success' : 'danger';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${gift.image}" alt="${gift.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
            <td>${gift.title}</td>
            <td>${gift.category}</td>
            <td>${gift.price}</td>
            <td>${gift.stock}</td>
            <td><span class="badge badge-${statusClass}">${status}</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editGift(${gift.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteGift(${gift.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// تحميل جدول العروض
function loadOffersTable() {
    const tableBody = document.getElementById('offersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    adminData.offers.forEach(offer => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${offer.title}</td>
            <td>${offer.category}</td>
            <td>${offer.price}</td>
            <td>${offer.difficulty || 'متوسط'}</td>
            <td>${offer.duration || '5'} دقائق</td>
            <td><span class="badge badge-success">نشط</span></td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editOffer(${offer.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteOffer(${offer.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// تحميل جدول المستخدمين
function loadUsersTable() {
    const tableBody = document.getElementById('usersTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    adminData.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><i class="fas fa-user-circle" style="font-size: 1.5rem;"></i></td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>$${user.balance.toFixed(2)}</td>
            <td>${user.level}</td>
            <td><span class="badge badge-success">${user.status}</span></td>
            <td>${user.joined}</td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewUser(${user.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// تحميل جدول المعاملات
function loadTransactionsTable() {
    const tableBody = document.getElementById('transactionsTableBody');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    adminData.transactions.forEach(transaction => {
        let statusBadge = '';
        if (transaction.status === 'مكتمل') {
            statusBadge = '<span class="badge badge-success">مكتمل</span>';
        } else if (transaction.status === 'قيد الانتظار') {
            statusBadge = '<span class="badge badge-warning">قيد الانتظار</span>';
        } else {
            statusBadge = '<span class="badge badge-danger">مرفوض</span>';
        }
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${transaction.id.toString().padStart(6, '0')}</td>
            <td>${transaction.user}</td>
            <td>${transaction.type}</td>
            <td>${transaction.amount}</td>
            <td>${transaction.date}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="approveTransaction(${transaction.id})">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectTransaction(${transaction.id})">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// عرض تبويب معين
function showTab(tabId) {
    // إخفاء جميع التبويبات
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // إزالة النشط من جميع أزرار القائمة
    document.querySelectorAll('.admin-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // إظهار التبويب المطلوب
    const targetTab = document.getElementById(`${tabId}Tab`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // تفعيل زر القائمة المناسب
    const menuItem = document.querySelector(`.admin-menu a[onclick*="${tabId}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
    
    // إخفاء النماذج إذا كانت مفتوحة
    hideAllForms();
}

// إخفاء جميع النماذج
function hideAllForms() {
    document.getElementById('giftFormSection').style.display = 'none';
    document.getElementById('offerFormSection').style.display = 'none';
}

// عرض نموذج إضافة هدية
function showGiftForm(giftId = null) {
    const formSection = document.getElementById('giftFormSection');
    const formTitle = document.getElementById('giftFormTitle');
    const form = document.getElementById('giftForm');
    
    if (giftId) {
        // وضع التعديل
        formTitle.textContent = 'تعديل الهدية';
        const gift = adminData.gifts.find(g => g.id === giftId);
        if (gift) {
            document.getElementById('giftId').value = gift.id;
            document.getElementById('giftTitle').value = gift.title;
            document.getElementById('giftCategory').value = gift.category;
            document.getElementById('giftPrice').value = parseFloat(gift.price.replace('$', ''));
            document.getElementById('giftStock').value = gift.stock;
            document.getElementById('giftDescription').value = gift.description;
        }
    } else {
        // وضع الإضافة
        formTitle.textContent = 'إضافة هدية جديدة';
        form.reset();
        document.getElementById('giftImagesPreview').innerHTML = '';
    }
    
    formSection.style.display = 'block';
    formSection.scrollIntoView({ behavior: 'smooth' });
}

// إلغاء نموذج الهدية
function cancelGiftForm() {
    document.getElementById('giftFormSection').style.display = 'none';
    document.getElementById('giftForm').reset();
    document.getElementById('giftImagesPreview').innerHTML = '';
}

// معاينة صور الهدية
function previewGiftImages(event) {
    const previewContainer = document.getElementById('giftImagesPreview');
    const files = event.target.files;
    
    previewContainer.innerHTML = '';
    
    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'gift-image-item';
            imgContainer.innerHTML = `
                <img src="${e.target.result}" alt="معاينة">
                <button type="button" class="remove-image" onclick="this.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            `;
            previewContainer.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    }
}

// عرض نموذج إضافة عرض
function showOfferForm(offerId = null) {
    const formSection = document.getElementById('offerFormSection');
    const formTitle = document.getElementById('offerFormTitle');
    
    if (offerId) {
        // وضع التعديل
        formTitle.textContent = 'تعديل العرض';
        const offer = adminData.offers.find(o => o.id === offerId);
        if (offer) {
            document.getElementById('offerId').value = offer.id;
            document.getElementById('offerTitle').value = offer.title;
            document.getElementById('offerCategory').value = offer.category;
            document.getElementById('offerAmount').value = parseFloat(offer.price.replace('$', ''));
            document.getElementById('offerDescription').value = offer.description;
        }
    } else {
        // وضع الإضافة
        formTitle.textContent = 'إضافة عرض جديد';
        document.getElementById('offerForm').reset();
    }
    
    formSection.style.display = 'block';
    formSection.scrollIntoView({ behavior: 'smooth' });
}

// إلغاء نموذج العرض
function cancelOfferForm() {
    document.getElementById('offerFormSection').style.display = 'none';
    document.getElementById('offerForm').reset();
}

// حفظ الهدية
document.getElementById('giftForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const giftId = document.getElementById('giftId').value;
    const giftData = {
        title: document.getElementById('giftTitle').value,
        category: document.getElementById('giftCategory').value,
        price: `$${parseFloat(document.getElementById('giftPrice').value).toFixed(2)}`,
        stock: parseInt(document.getElementById('giftStock').value),
        description: document.getElementById('giftDescription').value,
        background: document.getElementById('giftBackground').value
    };
    
    if (giftId) {
        // تحديث الهدية
        const index = adminData.gifts.findIndex(g => g.id === parseInt(giftId));
        if (index !== -1) {
            adminData.gifts[index] = { ...adminData.gifts[index], ...giftData };
        }
    } else {
        // إضافة هدية جديدة
        const newId = adminData.gifts.length > 0 ? Math.max(...adminData.gifts.map(g => g.id)) + 1 : 1;
        giftData.id = newId;
        giftData.image = 'https://cdn-icons-png.flaticon.com/512/196/196578.png'; // صورة افتراضية
        adminData.gifts.push(giftData);
    }
    
    alert('تم حفظ الهدية بنجاح!');
    loadGiftsTable();
    cancelGiftForm();
});

// حفظ العرض
document.getElementById('offerForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const offerId = document.getElementById('offerId').value;
    const offerData = {
        title: document.getElementById('offerTitle').value,
        category: document.getElementById('offerCategory').value,
        price: `$${parseFloat(document.getElementById('offerAmount').value).toFixed(2)}`,
        description: document.getElementById('offerDescription').value,
        instructions: document.getElementById('offerInstructions').value,
        difficulty: document.getElementById('offerDifficulty').value,
        duration: document.getElementById('offerDuration').value,
        icon: document.getElementById('offerIcon').value,
        isActive: document.getElementById('offerIsActive').checked
    };
    
    if (offerId) {
        // تحديث العرض
        const index = adminData.offers.findIndex(o => o.id === parseInt(offerId));
        if (index !== -1) {
            adminData.offers[index] = { ...adminData.offers[index], ...offerData };
        }
    } else {
        // إضافة عرض جديد
        const newId = adminData.offers.length > 0 ? Math.max(...adminData.offers.map(o => o.id)) + 1 : 1;
        offerData.id = newId;
        adminData.offers.push(offerData);
    }
    
    alert('تم حفظ العرض بنجاح!');
    loadOffersTable();
    cancelOfferForm();
});

// حذف هدية
function deleteGift(giftId) {
    if (confirm('هل أنت متأكد من حذف هذه الهدية؟')) {
        adminData.gifts = adminData.gifts.filter(g => g.id !== giftId);
        loadGiftsTable();
        alert('تم حذف الهدية بنجاح!');
    }
}

// حذف عرض
function deleteOffer(offerId) {
    if (confirm('هل أنت متأكد من حذف هذا العرض؟')) {
        adminData.offers = adminData.offers.filter(o => o.id !== offerId);
        loadOffersTable();
        alert('تم حذف العرض بنجاح!');
    }
}

// تحرير هدية
function editGift(giftId) {
    showGiftForm(giftId);
}

// تحرير عرض
function editOffer(offerId) {
    showOfferForm(offerId);
}

// عرض تفاصيل المستخدم
function viewUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        alert(`تفاصيل المستخدم:\n\nالاسم: ${user.name}\nالبريد: ${user.email}\nالرصيد: $${user.balance}\nالمستوى: ${user.level}`);
    }
}

// تحرير المستخدم
function editUser(userId) {
    const user = adminData.users.find(u => u.id === userId);
    if (user) {
        const newBalance = prompt('أدخل الرصيد الجديد:', user.balance);
        if (newBalance !== null) {
            user.balance = parseFloat(newBalance);
            loadUsersTable();
            alert('تم تحديث رصيد المستخدم!');
        }
    }
}

// الموافقة على معاملة
function approveTransaction(transactionId) {
    const transaction = adminData.transactions.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = 'مكتمل';
        loadTransactionsTable();
        alert('تمت الموافقة على المعاملة!');
    }
}

// رفض معاملة
function rejectTransaction(transactionId) {
    const transaction = adminData.transactions.find(t => t.id === transactionId);
    if (transaction) {
        transaction.status = 'مرفوض';
        loadTransactionsTable();
        alert('تم رفض المعاملة!');
    }
}

// حفظ أكواد الإعلانات
function saveAdCodes() {
    const headerCode = document.getElementById('adCodeHeader').value;
    const sidebarCode = document.getElementById('adCodeSidebar').value;
    const footerCode = document.getElementById('adCodeFooter').value;
    
    // هنا سيتم حفظ الأكواد في قاعدة البيانات
    localStorage.setItem('adHeaderCode', headerCode);
    localStorage.setItem('adSidebarCode', sidebarCode);
    localStorage.setItem('adFooterCode', footerCode);
    
    alert('تم حفظ أكواد الإعلانات بنجاح!');
}

// حفظ كود العروض الخاصة
function saveSpecialOffer() {
    const offerCode = document.getElementById('specialOfferCode').value;
    const company = document.getElementById('offerCompany').value;
    
    if (!offerCode.trim()) {
        alert('يرجى إدخال كود العروض!');
        return;
    }
    
    // هنا سيتم حفظ الكود في قاعدة البيانات
    localStorage.setItem('specialOfferCode', offerCode);
    if (company) {
        localStorage.setItem('offerCompany', company);
    }
    
    alert('تم حفظ كود العروض الخاصة بنجاح!');
}

// اختبار كود العروض
function testOfferCode() {
    const offerCode = document.getElementById('specialOfferCode').value;
    
    if (!offerCode.trim()) {
        alert('لا يوجد كود لاختباره!');
        return;
    }
    
    try {
        // إنشاء iframe لاختبار الكود بأمان
        const iframe = document.createElement('iframe');
        iframe.style.width = '100%';
        iframe.style.height = '400px';
        iframe.style.border = '1px solid #ccc';
        
        const iframeDoc = iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>اختبار كود العروض</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .offer-test { background: #f8f9fa; padding: 20px; border-radius: 10px; }
                </style>
            </head>
            <body>
                <h3>معاينة كود العروض</h3>
                <div class="offer-test">
                    <script>
                        ${offerCode}
                    <\/script>
                </div>
                <p style="margin-top: 20px; color: green;">✓ تم تنفيذ الكود بنجاح</p>
            </body>
            </html>
        `);
        iframeDoc.close();
        
        // عرض النافذة المنبثقة
        const popup = window.open('', '_blank', 'width=800,height=600');
        popup.document.write(iframe.outerHTML);
        popup.document.close();
        
    } catch (error) {
        alert(`خطأ في تنفيذ الكود: ${error.message}`);
    }
}

// معاينة الإعلانات
function previewAds() {
    const headerCode = document.getElementById('adCodeHeader').value;
    const sidebarCode = document.getElementById('adCodeSidebar').value;
    const footerCode = document.getElementById('adCodeFooter').value;
    
    let previewHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>معاينة الإعلانات</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .ad-preview { margin: 20px 0; padding: 20px; border: 2px dashed #ccc; }
                .ad-label { font-weight: bold; color: #4361ee; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <h2>معاينة الإعلانات</h2>
    `;
    
    if (headerCode) {
        previewHtml += `
            <div class="ad-preview">
                <div class="ad-label">إعلان الهيدر:</div>
                <div>${headerCode}</div>
            </div>
        `;
    }
    
    if (sidebarCode) {
        previewHtml += `
            <div class="ad-preview">
                <div class="ad-label">إعلان الشريط الجانبي:</div>
                <div>${sidebarCode}</div>
            </div>
        `;
    }
    
    if (footerCode) {
        previewHtml += `
            <div class="ad-preview">
                <div class="ad-label">إعلان الفوتر:</div>
                <div>${footerCode}</div>
            </div>
        `;
    }
    
    previewHtml += `
            <p style="margin-top: 20px; color: #666;">ملاحظة: الإعلانات الفعلية قد تظهر بشكل مختلف حسب مزود الإعلانات.</p>
        </body>
        </html>
    `;
    
    const popup = window.open('', '_blank', 'width=800,height=600');
    popup.document.write(previewHtml);
    popup.document.close();
}

// حفظ الإعدادات
function saveSettings() {
    const siteName = document.getElementById('siteName').value;
    const siteDescription = document.getElementById('siteDescription').value;
    const withdrawLimit = document.getElementById('withdrawLimit').value;
    const referralBonus = document.getElementById('referralBonus').value;
    const vpnDetection = document.getElementById('vpnDetection').checked;
    const autoApprove = document.getElementById('autoApprove').checked;
    
    // هنا سيتم حفظ الإعدادات في قاعدة البيانات
    localStorage.setItem('siteSettings', JSON.stringify({
        siteName,
        siteDescription,
        withdrawLimit,
        referralBonus,
        vpnDetection,
        autoApprove
    }));
    
    // تحديث كلمة مرور المشرف إذا تم إدخالها
    const newPassword = document.getElementById('adminPassword').value;
    const confirmPassword = document.getElementById('confirmAdminPassword').value;
    
    if (newPassword && confirmPassword) {
        if (newPassword === confirmPassword) {
            // في الإصدار النهائي، سيتم تشفير كلمة المرور وحفظها في قاعدة البيانات
            alert('سيتم تحديث كلمة المرور في الإصدار النهائي مع Supabase');
        } else {
            alert('كلمات المرور غير متطابقة!');
            return;
        }
    }
    
    alert('تم حفظ الإعدادات بنجاح!');
}

// عرض نوع معين من المعاملات
function showTransactionType(type) {
    // تحديد الأزرار النشطة
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // تفعيل الزر المناسب
    event.target.classList.add('active');
    
    // هنا سيتم تصفية المعاملات حسب النوع
    // (في الإصدار النهائي مع Supabase)
    alert(`سيتم عرض المعاملات من نوع: ${type}`);
}
