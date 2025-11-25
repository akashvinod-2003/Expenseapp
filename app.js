import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, orderBy, where, writeBatch, getDocs, getDoc } from 'firebase/firestore';

// --- 1. ICON SYSTEM ---
const Icon = ({ name, size = 20, color = "currentColor", className = "" }) => {
    const paths = {
        plus: "M12 5v14M5 12h14", trash: "M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", trendingUp: "M23 6l-9.5 9.5-5-5L1 18", calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 0V2m-14 2V2", pieChart: "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z", chevronDown: "M6 9l6 6 6-6", chevronUp: "M18 15l-6-6-6 6", logOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7-7a4 4 0 0 1 4 4v3H8V8a4 4 0 0 1 4-4z", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", userCheck: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 11l2 2 4-4", userX: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M18 8l5 5 M23 8l-5 5", clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2", tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", check: "M20 6L9 17l-5-5", sparkles: "M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z", search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z", settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", merge: "M12 5v14M8 9l4-4 4 4", arrowRight: "M5 12h14M12 5l7 7-7 7", database: "M3 5c0-1.66 4.03-3 9-3s9 1.34 9 3V19c0 1.66-4.03 3-9 3s-9-1.34-9-3V5zm0 0v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5", link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
        coffee: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3", shoppingBag: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", car: "M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2", home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", more: "M12 12h.01M8 12h.01M16 12h.01"
    };
    const path = paths[name] || paths[name === 'shopping-bag' ? 'shoppingBag' : 'tag'] || paths['tag'];
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={path} /></svg>;
};

// --- 2. CONFIG ---
const ADMIN_EMAILS = ["akasheroor1@gmail.com"]; 
const firebaseConfig = { apiKey: "AIzaSyB-CFKSfq5sE_NyAUhUf9lviBFA3bIavLc", authDomain: "expenseapp-ff0eb.firebaseapp.com", projectId: "expenseapp-ff0eb", storageBucket: "expenseapp-ff0eb.firebasestorage.app", messagingSenderId: "823889701126", appId: "1:823889701126:web:cabaab6a25050d6baf9687", measurementId: "G-86FFS0N4S0" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const DEFAULT_CATEGORIES = [{ label: 'Food', icon: 'coffee', color: 'bg-yellow-600' }, { label: 'Shopping', icon: 'shoppingBag', color: 'bg-blue-600' }, { label: 'Transport', icon: 'car', color: 'bg-purple-600' }, { label: 'Housing', icon: 'home', color: 'bg-green-600' }, { label: 'Utilities', icon: 'zap', color: 'bg-yellow-500' }, { label: 'Other', icon: 'more', color: 'bg-gray-500' }];
const COLORS = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'];
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const formatDate = (d) => d ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(d + 'T00:00:00')) : '';

// --- 3. SETTINGS PANEL ---
const SettingsPanel = ({ onClose, user, categories, isAdmin }) => {
    const [sourceCat, setSourceCat] = useState('');
    const [targetCat, setTargetCat] = useState('');
    const [mergeLoading, setMergeLoading] = useState(false);
    const [recoverLoading, setRecoverLoading] = useState(false);
    const [fixLoading, setFixLoading] = useState(false);

    const handleFixLinks = async () => {
        setFixLoading(true);
        try {
            const qExp = query(collection(db, 'users', user.uid, 'expenses'));
            const snapExp = await getDocs(qExp);
            const privCatMap = {};
            categories.forEach(c => privCatMap[c.label.toLowerCase()] = c.id);
            const qPub = query(collection(db, 'categories'));
            const snapPub = await getDocs(qPub);
            const pubIdToLabel = {};
            snapPub.forEach(d => pubIdToLabel[d.id] = d.data().label.toLowerCase());
            const batch = writeBatch(db);
            let updatedCount = 0;
            snapExp.forEach(docSnapshot => {
                const exp = docSnapshot.data();
                const isLinked = categories.some(c => c.id === exp.category);
                if (!isLinked) {
                    const oldLabel = pubIdToLabel[exp.category];
                    if (oldLabel && privCatMap[oldLabel]) {
                        batch.update(docSnapshot.ref, { category: privCatMap[oldLabel] });
                        updatedCount++;
                    }
                }
            });
            if (updatedCount > 0) { await batch.commit(); alert(`Fixed ${updatedCount} links!`); } else { alert("No broken links found."); }
        } catch (e) { alert(e.message); }
        setFixLoading(false);
    }

    const handleFullRestore = async () => {
        if (!confirm("Restore shared data to private?")) return;
        setRecoverLoading(true);
        try {
            const batch = writeBatch(db);
            let totalCount = 0;
            const qExp = query(collection(db, 'family_expenses'), where('userId', '==', user.uid));
            const snapExp = await getDocs(qExp);
            snapExp.forEach(docSnapshot => { const newRef = doc(collection(db, 'users', user.uid, 'expenses')); batch.set(newRef, docSnapshot.data()); totalCount++; });
            const qPubCats = query(collection(db, 'categories'));
            const snapPubCats = await getDocs(qPubCats);
            const qMyCats = query(collection(db, 'users', user.uid, 'categories'));
            const snapMyCats = await getDocs(qMyCats);
            const myCatLabels = snapMyCats.docs.map(d => d.data().label.toLowerCase());
            snapPubCats.forEach(docSnapshot => { const catData = docSnapshot.data(); if (!myCatLabels.includes(catData.label.toLowerCase())) { const newCatRef = doc(collection(db, 'users', user.uid, 'categories')); batch.set(newCatRef, catData); totalCount++; } });
            if (totalCount > 0) { await batch.commit(); alert(`Recovered ${totalCount} items.`); window.location.reload(); } else { alert("No data found."); }
        } catch (e) { alert(e.message); }
        setRecoverLoading(false);
    };

    const handleMerge = async () => {
        if (!sourceCat || !targetCat || sourceCat === targetCat) return;
        setMergeLoading(true);
        try {
            const q = query(collection(db, 'users', user.uid, 'expenses'), where('category', '==', sourceCat));
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.forEach(docSnapshot => { batch.update(docSnapshot.ref, { category: targetCat }); });
            batch.delete(doc(db, 'users', user.uid, 'categories', sourceCat));
            await batch.commit();
            alert("Merged!"); setSourceCat(''); setTargetCat('');
        } catch (error) { alert(error.message); }
        setMergeLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-panel w-full max-w-md rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-white"><Icon name="settings" size={24}/> Settings</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 text-gray-400"><Icon name="check"/></button>
                </div>
                <div className="glass-card p-4 mb-4 bg-indigo-900 bg-opacity-20 border-indigo-500 border-opacity-30">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-indigo-400"><Icon name="link" size={16}/> Data Tools</h3>
                    <div className="flex gap-2">
                        <button onClick={handleFixLinks} disabled={fixLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-xs font-bold flex-1 transition">{fixLoading?"...":"Fix Links"}</button>
                        <button onClick={handleFullRestore} disabled={recoverLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-xs font-bold flex-1 transition">{recoverLoading?"...":"Restore Shared"}</button>
                    </div>
                </div>
                <div className="glass-card p-4 mb-4">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-gray-300"><Icon name="merge" size={16}/> Merge Duplicates</h3>
                    <div className="flex flex-col gap-2">
                        <select className="glass-input p-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={sourceCat} onChange={e=>setSourceCat(e.target.value)}><option value="">Remove...</option>{categories.map(c=><option key={c.id} value={c.id} className="text-black">{c.label}</option>)}</select>
                        <select className="glass-input p-2 rounded-lg bg-gray-800 text-white border border-gray-700" value={targetCat} onChange={e=>setTargetCat(e.target.value)}><option value="">Keep...</option>{categories.map(c=><option key={c.id} value={c.id} className="text-black">{c.label}</option>)}</select>
                        <button onClick={handleMerge} disabled={mergeLoading} className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg w-full transition">{mergeLoading?"Merging...":"Merge"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- ADMIN PANEL ---
const AdminPanel = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const q1 = query(collection(db, 'user_meta'));
        const unsub1 = onSnapshot(q1, (snap) => setUsers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
        return () => { unsub1(); };
    }, []);
    const updateUserStatus = async (uid, status) => await updateDoc(doc(db, 'user_meta', uid), { status });
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="glass-panel w-full max-w-2xl rounded-2xl p-6 h-3/4 flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2 text-white"><Icon name="shield" size={24}/> Admin</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 text-gray-400"><Icon name="check"/></button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                    {users.map(u => (
                        <div key={u.id} className="glass-card flex justify-between items-center p-4 rounded-xl">
                            <div>
                                <div className="font-bold text-white">{u.email}</div>
                                <div className={`text-xs uppercase font-bold mt-1 ${u.status==='approved'?'text-green-400':'text-yellow-500'}`}>{u.status||'pending'}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={()=>updateUserStatus(u.id,'approved')} className="p-2 rounded-full bg-green-900 text-green-400 hover:bg-green-800"><Icon name="userCheck"/></button>
                                <button onClick={()=>updateUserStatus(u.id,'banned')} className="p-2 rounded-full bg-red-900 text-red-400 hover:bg-red-800"><Icon name="userX"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---
const App = () => {
    const [user, setUser] = useState(null);
    const [userStatus, setUserStatus] = useState('loading');
    const [isAdminOpen, setIsAdminOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [desc, setDesc] = useState('');
    const [cat, setCat] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState('expense'); 

    const [expanded, setExpanded] = useState({});
    const [isAddingCat, setIsAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    
    const [authEmail, setAuthEmail] = useState('');
    const [authPass, setAuthPass] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u) {
                const metaRef = doc(db, 'user_meta', u.uid);
                const unsubMeta = onSnapshot(metaRef, (docSnap) => {
                    if (docSnap.exists()) setUserStatus(docSnap.data().status || 'pending');
                    else { setDoc(metaRef, { email: u.email, status: 'pending', createdAt: serverTimestamp() }); setUserStatus('pending'); }
                });
                return () => unsubMeta();
            } else setUserStatus('loading');
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, 'users', user.uid, 'categories'), orderBy('label'));
        const unsub = onSnapshot(q, async (snap) => {
            if (snap.empty) for (const def of DEFAULT_CATEGORIES) await addDoc(collection(db, 'users', user.uid, 'categories'), def);
            else { const c = snap.docs.map(d => ({id: d.id, ...d.data()})); setCategories(c); if (!cat && c.length > 0) setCat(c[0].id); }
        });
        return () => unsub();
    }, [user, cat]);

    useEffect(() => {
        if (!user || userStatus !== 'approved') return;
        const q = query(collection(db, 'users', user.uid, 'expenses'));
        const unsub = onSnapshot(q, (snap) => {
            setExpenses(snap.docs.map(d => ({id: d.id, ...d.data()})).sort((a,b) => new Date(b.date) - new Date(a.date)));
        });
        return () => unsub();
    }, [user, userStatus]);

    const data = useMemo(() => {
        const groups = {};
        let monthTotal = 0, dailyTotal = 0, totalIncome = 0, totalExpensesAllTime = 0;
        const todayStr = new Date().toISOString().split('T')[0];
        const currentMonthKey = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
        expenses.forEach(e => {
            const amt = parseFloat(e.amount)||0;
            const d = new Date(e.date + 'T00:00:00');
            const k = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            const isIncome = e.type === 'income';

            if (!groups[k]) groups[k] = { title: k, total: 0, items: [], dateObj: d };
            groups[k].items.push(e);
            
            if (isIncome) {
                totalIncome += amt;
            } else {
                totalExpensesAllTime += amt;
                groups[k].total += amt; 
                if (k === currentMonthKey) monthTotal += amt;
                if (e.date === todayStr) dailyTotal += amt;
            }
        });

        const balance = totalIncome - totalExpensesAllTime;
        const analytics = []; // Add back if needed
        return { groups: Object.values(groups).sort((a,b) => b.dateObj - a.dateObj), dailyTotal, monthTotal, balance, totalIncome };
    }, [expenses]);

    const handleAuth = async (e) => { e.preventDefault(); setAuthError(''); setAuthLoading(true); try { if (isLogin) await signInWithEmailAndPassword(auth, authEmail, authPass); else await createUserWithEmailAndPassword(auth, authEmail, authPass); } catch (err) { setAuthError(err.message.replace('Firebase:', '')); } setAuthLoading(false); };
    const handleGoogle = async () => { setAuthError(''); setAuthLoading(true); try { await signInWithPopup(auth, googleProvider); } catch (err) { setAuthError(err.message); } setAuthLoading(false); };
    const isAdmin = user && ADMIN_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase());
    
    const saveCategory = async () => { 
        if (!newCatName.trim()) return; 
        if(categories.some(c => c.label.toLowerCase() === newCatName.trim().toLowerCase())) { alert("Exists!"); return; } 
        const ref = await addDoc(collection(db, 'users', user.uid, 'categories'), { label: newCatName, icon: 'tag', color: COLORS[Math.floor(Math.random()*COLORS.length)] }); 
        setCat(ref.id); setIsAddingCat(false); setNewCatName(''); 
    };
    
    const addTransaction = async () => { 
        await addDoc(collection(db, 'users', user.uid, 'expenses'), { amount: parseFloat(amount), description: desc, category: type === 'income' ? 'income_source' : cat, date, type, createdAt: serverTimestamp() }); 
        setAmount(''); setDesc(''); setIsFormOpen(false); 
    };
    
    const getCat = (id) => {
        if (id === 'income_source') return { label: 'Income', color: 'bg-green-600', icon: 'trendingUp' };
        return categories.find(c => c.id === id) || { label: 'Unknown', color: 'bg-gray-500', icon: 'tag' };
    };

    if (!user) return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="glass-panel w-full max-w-sm p-8 rounded-3xl text-center">
                 <div className="mx-auto mb-6 bg-indigo-500/20 text-indigo-400 w-16 h-16 flex items-center justify-center rounded-2xl"><Icon name="lock" size={32}/></div>
                <h1 className="text-3xl font-bold mb-2 font-heading text-white">ExpenseVibe</h1>
                <p className="text-gray-400 mb-8">Secure Family Tracking</p>
                <button onClick={handleGoogle} className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded-xl mb-6 flex items-center justify-center gap-2 transition hover:bg-gray-100">
                    <span className="text-blue-600 text-xl">G</span> Sign in with Google
                </button>
                <form onSubmit={handleAuth} className="flex flex-col gap-4">
                    <input className="glass-input p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none transition" placeholder="Email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)}/>
                    <input className="glass-input p-3 rounded-xl bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none transition" type="password" placeholder="Password" value={authPass} onChange={e=>setAuthPass(e.target.value)}/>
                    {authError && <div className="text-red-400 text-sm">{authError}</div>}
                    <button disabled={authLoading} className="btn-primary py-3 rounded-xl font-bold text-white w-full transition">{authLoading?'Processing...':(isLogin?'Log In':'Sign Up')}</button>
                </form>
                <button onClick={()=>setIsLogin(!isLogin)} className="text-sm mt-6 text-indigo-400 hover:text-indigo-300 transition">{isLogin?"Create an account":"Log in"}</button>
            </div>
        </div>
    );

    if (userStatus !== 'approved' && !isAdmin) return <div className="h-screen flex flex-col items-center justify-center text-center"><div className="bg-yellow-500/20 text-yellow-500 w-20 h-20 flex items-center justify-center rounded-full mb-6"><Icon name="clock" size={40}/></div><h2 className="text-2xl font-bold text-white mb-2">Approval Pending</h2><p className="text-gray-400">Ask admin to approve: {user.email}</p><button onClick={()=>signOut(auth)} className="mt-8 bg-gray-700 hover:bg-gray-600 text-white py-2 px-6 rounded-full transition">Sign Out</button></div>;

    return (
        <div className="container mx-auto px-4 pb-32 max-w-3xl">
            <div className="glass-panel sticky top-0 z-50 rounded-b-3xl mb-6 border-t-0 border-x-0">
                <div className="h-20 flex items-center justify-between px-6">
                    <div className="flex items-center gap-2 font-heading text-xl font-bold text-white"><Icon name="sparkles" className="text-indigo-500"/> ExpenseVibe</div>
                    <div className="flex gap-2">
                        <button onClick={()=>setIsSettingsOpen(true)} className="p-2 rounded-full text-gray-400 hover:bg-white/10 transition"><Icon name="settings" size={20}/></button>
                        {isAdmin && <button onClick={()=>setIsAdminOpen(true)} className="flex items-center gap-1 bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-indigo-500/30 transition"><Icon name="shield" size={14}/> Admin</button>}
                        <button onClick={()=>signOut(auth)} className="p-2 rounded-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"><Icon name="logOut" size={20}/></button>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 rounded-3xl mb-4 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30">
                 <div className="text-sm text-indigo-300 font-bold uppercase tracking-wider mb-1">Available Balance</div>
                 <div className="font-heading text-4xl font-bold text-white">{formatCurrency(data.balance)}</div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-5 rounded-3xl">
                    <div className="flex justify-between mb-2 text-xs text-gray-400 uppercase font-bold tracking-wider">Month Spend</div>
                    <div className="font-heading text-2xl font-bold text-white">{formatCurrency(data.monthTotal)}</div>
                </div>
                <div className="glass-card p-5 rounded-3xl">
                    <div className="flex justify-between mb-2 text-xs text-gray-400 uppercase font-bold tracking-wider">Today</div>
                    <div className="font-heading text-2xl font-bold text-white">{formatCurrency(data.dailyTotal)}</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider lg:hidden">Recent Activity</div>
                {data.groups.map(g => (
                    <div key={g.title} className="glass-card rounded-3xl overflow-hidden p-0">
                        <div onClick={()=>setExpanded(p=>({...p, [g.title]:!p[g.title]}))} className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition">
                            <div className="font-bold text-sm flex gap-3 items-center text-gray-200">
                                <div className="bg-gray-800 p-2 rounded-xl text-gray-400"><Icon name="calendar" size={16}/></div>
                                {g.title}
                            </div>
                            <div className="text-xs font-bold bg-gray-800 px-3 py-1 rounded-lg text-gray-400">{formatCurrency(g.total)}</div>
                        </div>
                        {expanded[g.title] && <div className="border-t border-gray-700/50">
                            {g.items.map(i => {
                                const c = getCat(i.category);
                                const isIncome = i.type === 'income';
                                return (
                                    <div key={i.id} className="p-4 flex justify-between items-center hover:bg-white/5 transition">
                                        <div className="flex gap-4 items-center">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm ${c.color}`}>
                                                <Icon name={c.icon || 'tag'} size={18}/>
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-white">{i.description}</div>
                                                <div className="text-xs text-gray-400 font-medium">{formatDate(i.date)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`font-bold font-heading text-sm ${isIncome ? 'text-emerald-400' : 'text-gray-200'}`}>
                                                {isIncome ? '+' : ''}{formatCurrency(i.amount)}
                                            </span>
                                            <button onClick={()=>deleteDoc(doc(db,'users',user.uid,'expenses',i.id))} className="p-2 rounded-full text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition"><Icon name="trash" size={16}/></button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>}
                    </div>
                ))}
            </div>

            <button onClick={()=>setIsFormOpen(true)} className="fixed bottom-8 right-6 w-14 h-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:scale-110 transition z-40 lg:hidden"><Icon name="plus" size={28}/></button>
            <button onClick={()=>setIsFormOpen(true)} className="hidden lg:flex w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-2xl shadow-lg items-center justify-center gap-2 transition"><Icon name="plus"/> Add Transaction</button>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in">
                    <div className="glass-panel w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-8 animate-slide-up bg-[#0f172a]">
                        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
                            <h2 className="font-heading text-2xl font-bold text-white">Add Transaction</h2>
                            <button onClick={()=>setIsFormOpen(false)} className="p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white"><Icon name="chevronDown"/></button>
                        </div>
                        
                        <div className="flex bg-gray-800 p-1 rounded-xl mb-6">
                            <button onClick={()=>setType('expense')} className={`flex-1 py-3 rounded-lg font-bold transition ${type==='expense' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Expense</button>
                            <button onClick={()=>setType('income')} className={`flex-1 py-3 rounded-lg font-bold transition ${type==='income' ? 'bg-emerald-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>Income</button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="relative">
                                <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold text-2xl ${type==='income'?'text-emerald-500':'text-red-500'}`}>₹</span>
                                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="w-full bg-transparent border-b border-gray-700 text-5xl font-bold text-white pl-10 py-4 outline-none focus:border-indigo-500 transition placeholder-gray-800" placeholder="0" autoFocus/>
                            </div>
                            <input type="text" placeholder={type==='income'?"Source (e.g. Salary)":"Description (e.g. Lunch)"} value={desc} onChange={e=>setDesc(e.target.value)} className="glass-input p-4 rounded-2xl bg-gray-800 text-white border border-gray-700 focus:border-indigo-500 outline-none transition text-lg"/>
                            
                            <div className="grid grid-cols-2 gap-4">
                                {type === 'expense' && (
                                    !isAddingCat ? (
                                        <div className="relative">
                                            <select value={cat} onChange={e => {if(e.target.value==='NEW')setIsAddingCat(true);else setCat(e.target.value);}} className="w-full p-4 rounded-2xl bg-gray-800 text-white border border-gray-700 appearance-none outline-none focus:border-indigo-500 transition">
                                                {categories.map(c=><option key={c.id} value={c.id} className="text-black">{c.label}</option>)}
                                                <option value="NEW" className="text-black font-bold">+ Create New...</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"><Icon name="chevronDown" size={16}/></div>
                                        </div>
                                    ) : (
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="New Tag" value={newCatName} onChange={e=>setNewCatName(e.target.value)} className="glass-input p-4 rounded-2xl bg-gray-800 text-white border border-gray-700 outline-none transition w-full" autoFocus/>
                                            <button onClick={saveCategory} className="bg-indigo-600 text-white p-4 rounded-2xl shadow-lg hover:scale-105 transition"><Icon name="check"/></button>
                                        </div>
                                    )
                                )}
                                <input type="date" value={date} onChange={e=>setDate(e.target.value)} className={`glass-input p-4 rounded-2xl bg-gray-800 text-white border border-gray-700 outline-none transition ${type==='income'?'col-span-2':''}`}/>
                            </div>
                        </div>
                        <button onClick={addTransaction} className={`w-full font-bold py-4 rounded-2xl shadow-lg mt-8 transition transform active:scale-95 text-lg ${type==='income'?'bg-emerald-600 hover:bg-emerald-700 text-white':'bg-red-600 hover:bg-red-700 text-white'}`}>
                            {type === 'income' ? 'Add Credit' : 'Add Expense'}
                        </button>
                    </div>
                </div>
            )}

            {isAdminOpen && <AdminPanel onClose={()=>setIsAdminOpen(false)} />}
            {isSettingsOpen && <SettingsPanel onClose={()=>setIsSettingsOpen(false)} user={user} categories={categories} isAdmin={isAdmin}/>}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);