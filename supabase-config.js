// supabase-config.js - إعداد Supabase لـ Fast Cach

// هذه القيم ستكون مختلفة لكل مشروع
const SUPABASE_URL = 'https://your-project.supabase.co'; // استبدل برابط مشروعك
const SUPABASE_ANON_KEY = 'your-anon-key-here'; // استبدل بالمفتاح العام

// تهيئة Supabase
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة تسجيل الدخول بالبريد وكلمة المرور
async function loginWithEmail(email, password) {
    try {
        const { user, error } = await supabaseClient.auth.signIn({
            email: email,
            password: password
        });
        
        if (error) throw error;
        return { success: true, user };
    } catch (error) {
        console.error('خطأ في تسجيل الدخول:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة التسجيل ببريد جديد
async function signUpWithEmail(name, email, password) {
    try {
        const { user, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name,
                    balance: 1.00, // هدية ترحيب
                    level: 1
                }
            }
        });
        
        if (error) throw error;
        return { success: true, user };
    } catch (error) {
        console.error('خطأ في التسجيل:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة تسجيل الدخول بجوجل
async function loginWithGoogle() {
    try {
        const { user, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google'
        });
        
        if (error) throw error;
        return { success: true, user };
    } catch (error) {
        console.error('خطأ في تسجيل الدخول بجوجل:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة تسجيل الخروج
async function logoutUser() {
    try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('خطأ في تسجيل الخروج:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة الحصول على بيانات المستخدم الحالي
async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabaseClient.auth.getUser();
        if (error) throw error;
        return { success: true, user };
    } catch (error) {
        console.error('خطأ في جلب بيانات المستخدم:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة تحديث بيانات المستخدم
async function updateUserProfile(userId, updates) {
    try {
        const { data, error } = await supabaseClient
            .from('profiles')
            .update(updates)
            .eq('id', userId);
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في تحديث الملف:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة الحصول على العروض
async function getOffers() {
    try {
        const { data, error } = await supabaseClient
            .from('offers')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في جلب العروض:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة الحصول على الهدايا
async function getGifts() {
    try {
        const { data, error } = await supabaseClient
            .from('gifts')
            .select('*')
            .gt('stock', 0)
            .order('price', { ascending: true });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في جلب الهدايا:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة استبدال هدية
async function redeemGift(giftId, userId) {
    try {
        // 1. التحقق من رصيد المستخدم
        const { data: userData } = await supabaseClient
            .from('profiles')
            .select('balance')
            .eq('id', userId)
            .single();
            
        const { data: giftData } = await supabaseClient
            .from('gifts')
            .select('*')
            .eq('id', giftId)
            .single();
            
        if (userData.balance < giftData.price) {
            throw new Error('رصيدك غير كافي');
        }
        
        if (giftData.stock <= 0) {
            throw new Error('نفذت الكمية من هذه الهدية');
        }
        
        // 2. بدء معاملة
        const { data: transaction, error: transactionError } = await supabaseClient
            .from('transactions')
            .insert({
                user_id: userId,
                gift_id: giftId,
                amount: giftData.price,
                type: 'redemption',
                status: 'pending'
            })
            .select()
            .single();
            
        if (transactionError) throw transactionError;
        
        // 3. خصم من رصيد المستخدم
        const { error: balanceError } = await supabaseClient
            .from('profiles')
            .update({ balance: userData.balance - giftData.price })
            .eq('id', userId);
            
        if (balanceError) throw balanceError;
        
        // 4. تقليل المخزون
        const { error: stockError } = await supabaseClient
            .from('gifts')
            .update({ stock: giftData.stock - 1 })
            .eq('id', giftId);
            
        if (stockError) throw stockError;
        
        return { success: true, transaction };
    } catch (error) {
        console.error('خطأ في استبدال الهدية:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة إضافة عرض جديد (للإدارة)
async function addOffer(offerData) {
    try {
        const { data, error } = await supabaseClient
            .from('offers')
            .insert(offerData)
            .select();
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في إضافة عرض:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة إضافة هدية جديدة (للإدارة)
async function addGift(giftData) {
    try {
        const { data, error } = await supabaseClient
            .from('gifts')
            .insert(giftData)
            .select();
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في إضافة هدية:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة تحديث كود الإعلانات
async function updateAdCode(codeType, code) {
    try {
        const { data, error } = await supabaseClient
            .from('site_settings')
            .upsert({
                key: codeType,
                value: code
            });
            
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('خطأ في تحديث كود الإعلانات:', error.message);
        return { success: false, error: error.message };
    }
}

// دالة الحصول على كود الإعلانات
async function getAdCode(codeType) {
    try {
        const { data, error } = await supabaseClient
            .from('site_settings')
            .select('value')
            .eq('key', codeType)
            .single();
            
        if (error) throw error;
        return { success: true, code: data.value };
    } catch (error) {
        console.error('خطأ في جلب كود الإعلانات:', error.message);
        return { success: false, error: error.message };
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.supabaseFunctions = {
    loginWithEmail,
    signUpWithEmail,
    loginWithGoogle,
    logoutUser,
    getCurrentUser,
    updateUserProfile,
    getOffers,
    getGifts,
    redeemGift,
    addOffer,
    addGift,
    updateAdCode,
    getAdCode,
    supabaseClient
};
