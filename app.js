import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, orderBy, where, writeBatch, getDocs, getDoc } from 'firebase/firestore';

// --- ICONS COMPONENT ---
const Icon = ({ name, size = 20, color = "currentColor", className = "" }) => {
    const paths = {
        plus: "M12 5v14M5 12h14", trash: "M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", trendingUp: "M23 6l-9.5 9.5-5-5L1 18", calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 0V2m-14 2V2", pieChart: "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z", chevronDown: "M6 9l6 6 6-6", chevronUp: "M18 15l-6-6-6 6", logOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7-7a4 4 0 0 1 4 4v3H8V8a4 4 0 0 1 4-4z", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", userCheck: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 11l2 2 4-4", userX: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M18 8l5 5 M23 8l-5 5", clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2", tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", check: "M20 6L9 17l-5-5", sparkles: "M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z", search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z", settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", merge: "M12 5v14M8 9l4-4 4 4", arrowRight: "M5 12h14M12 5l7 7-7 7", database: "M3 5c0-1.66 4.03-3 9-3s9 1.34 9 3V19c0 1.66-4.03 3-9 3s-9-1.34-9-3V5zm0 0v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5", link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
        coffee: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3", shoppingBag: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", 'shopping-bag': "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", car: "M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2", home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", more: "M12 12h.01M8 12h.01M16 12h.01", 'more-horizontal': "M12 12h.01M8 12h.01M16 12h.01"
    };
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={paths[name] || paths['tag']} /></svg>;
};

const ADMIN_EMAILS = ["akasheroor1@gmail.com"]; 
const firebaseConfig = { apiKey: "AIzaSyB-CFKSfq5sE_NyAUhUf9lviBFA3bIavLc", authDomain: "expenseapp-ff0eb.firebaseapp.com", projectId: "expenseapp-ff0eb", storageBucket: "expenseapp-ff0eb.firebasestorage.app", messagingSenderId: "823889701126", appId: "1:823889701126:web:cabaab6a25050d6baf9687", measurementId: "G-86FFS0N4S0" };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const DEFAULT_CATEGORIES = [{ label: 'Food', icon: 'coffee', color: 'bg-orange-500' }, { label: 'Shopping', icon: 'shoppingBag', color: 'bg-blue-500' }, { label: 'Transport', icon: 'car', color: 'bg-purple-500' }, { label: 'Housing', icon: 'home', color: 'bg-green-500' }, { label: 'Utilities', icon: 'zap', color: 'bg-yellow-500' }, { label: 'Other', icon: 'more', color: 'bg-gray-500' }];
const COLORS = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
const formatDate = (d) => d ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(d + 'T00:00:00')) : '';

// --- Settings Panel ---
const SettingsPanel = ({ onClose, user, categories }) => {
    const [sourceCat, setSourceCat] = useState('');
    const [targetCat, setTargetCat] = useState('');
    const [mergeLoading, setMergeLoading] = useState(false);
    const [recoverLoading, setRecoverLoading] = useState(false);
    const [fixLoading, setFixLoading] = useState(false);

    // 1. FIX BROKEN LINKS
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

            snapExp.forEach(doc => {
                const exp = doc.data();
                const isLinked = categories.some(c => c.id === exp.category);
                if (!isLinked) {
                    const oldLabel = pubIdToLabel[exp.category];
                    if (oldLabel && privCatMap[oldLabel]) {
                        batch.update(doc.ref, { category: privCatMap[oldLabel] });
                        updatedCount++;
                    }
                }
            });
            
            if (updatedCount > 0) {
                await batch.commit();
                alert(`Fixed links for ${updatedCount} expenses!`);
            } else {
                alert("No broken links found.");
            }
        } catch (e) { console.error(e); alert("Fix Error: " + e.message); }
        setFixLoading(false);
    }

    // 2. FULL RESTORE
    const handleFullRestore = async () => {
        if (!confirm("This will find ALL shared/public data (Expenses AND Categories) and copy them to your Private Account. Continue?")) return;
        setRecoverLoading(true);
        try {
            const batch = writeBatch(db);
            let totalCount = 0;
            const qExp = query(collection(db, 'family_expenses'), where('userId', '==', user.uid));
            const snapExp = await getDocs(qExp);
            snapExp.forEach(doc => {
                const newRef = doc(collection(db, 'users', user.uid, 'expenses'));
                batch.set(newRef, doc.data());
                totalCount++;
            });
            const qMyCats = query(collection(db, 'users', user.uid, 'categories'));
            const snapMyCats = await getDocs(qMyCats);
            const myCatLabels = snapMyCats.docs.map(d => d.data().label.toLowerCase());
            const qPubCats = query(collection(db, 'categories'));
            const snapPubCats = await getDocs(qPubCats);
            snapPubCats.forEach(doc => {
                const catData = doc.data();
                if (!myCatLabels.includes(catData.label.toLowerCase())) {
                    const newCatRef = doc(collection(db, 'users', user.uid, 'categories'));
                    batch.set(newCatRef, catData);
                    totalCount++;
                }
            });
            if (totalCount > 0) {
                await batch.commit();
                alert(`Success! Recovered ${totalCount} items.`);
                window.location.reload(); 
            } else {
                alert("No new data found to recover.");
            }
        } catch (e) { console.error(e); alert("Recovery Error: " + e.message); }
        setRecoverLoading(false);
    };

    // 3. MERGE
    const handleMerge = async () => {
        if (!sourceCat || !targetCat || sourceCat === targetCat) { alert("Select different categories"); return; }
        if (!confirm("Merge and delete source category?")) return;
        setMergeLoading(true);
        try {
            const q = query(collection(db, 'users', user.uid, 'expenses'), where('category', '==', sourceCat));
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            snapshot.forEach(doc => batch.update(doc.ref, { category: targetCat }));
            batch.delete(doc(db, 'users', user.uid, 'categories', sourceCat));
            await batch.commit();
            alert("Done!"); setSourceCat(''); setTargetCat('');
        } catch (error) { alert("Failed: " + error.message); }
        setMergeLoading(false);
    };

    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content glass-panel">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2"><Icon name="settings" size={24}/> Settings</h2>
                    <button onClick={onClose} className="btn-icon"><Icon name="check" size={20}/></button>
                </div>
                
                <div className="glass-card p-4 mb-4" style={{borderColor: 'rgba(139, 92, 246, 0.3)', background: 'rgba(139, 92, 246, 0.05)'}}>
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2" style={{color:'#a78bfa'}}><Icon name="link" size={16}/> Link Fixer</h3>
                    <p className="text-xs text-muted mb-3">Breakdown missing? Expenses appearing as "Unknown"? Click this.</p>
                    <button onClick={handleFixLinks} disabled={fixLoading} className="btn btn-primary w-full text-xs" style={{background: '#8b5cf6'}}>
                        {fixLoading ? "Fixing..." : "Fix Broken Category Links"}
                    </button>
                </div>
                
                <div className="glass-card p-4 mb-4" style={{borderColor: 'rgba(99, 102, 241, 0.3)', background: 'rgba(99, 102, 241, 0.05)'}}>
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary"><Icon name="database" size={16}/> Account Restore</h3>
                    <p className="text-xs text-muted mb-3">Missing Tags or Expenses? Import everything from the old Shared version.</p>
                    <button onClick={handleFullRestore} disabled={recoverLoading} className="btn btn-primary w-full text-xs">
                        {recoverLoading ? "Recovering..." : "Sync & Restore Everything"}
                    </button>
                </div>

                <div className="glass-card p-4 mb-4">
                    <h3 className="font-bold text-sm mb-2 flex items-center gap-2"><Icon name="merge" size={16}/> Merge Duplicates</h3>
                    <div className="flex flex-col gap-3">
                        <div>
                            <label className="text-xs text-muted uppercase font-bold mb-1 block">Remove:</label>
                            <select className="glass-input" value={sourceCat} onChange={e=>setSourceCat(e.target.value)}>
                                <option value="">Select Duplicate...</option>
                                {categories.map(c=><option key={c.id} value={c.id} style={{color:'black'}}>{c.label}</option>)}
                            </select>
                        </div>
                        <div className="text-center text-muted"><Icon name="chevronDown"/></div>
                        <div>
                            <label className="text-xs text-muted uppercase font-bold mb-1 block">Keep:</label>
                            <select className="glass-input" value={targetCat} onChange={e=>setTargetCat(e.target.value)}>
                                <option value="">Select Target...</option>
                                {categories.map(c=><option key={c.id} value={c.id} style={{color:'black'}}>{c.label}</option>)}
                            </select>
                        </div>
                        <button onClick={handleMerge} disabled={mergeLoading} className="btn btn-secondary w-full mt-2">{mergeLoading ? "Merging..." : "Merge & Delete"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Admin Panel ---
const AdminPanel = ({ onClose }) => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        const q1 = query(collection(db, 'user_meta'));
        const unsub1 = onSnapshot(q1, (snap) => setUsers(snap.docs.map(d => ({id: d.id, ...d.data()}))));
        return () => { unsub1(); };
    }, []);
    const updateUserStatus = async (uid, status) => await updateDoc(doc(db, 'user_meta', uid), { status });
    return (
        <div className="modal-overlay animate-fade-in">
            <div className="modal-content glass-panel">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2"><Icon name="shield" size={24}/> Admin</h2>
                    <button onClick={onClose} className="btn-icon"><Icon name="check" size={20}/></button>
                </div>
                <div style={{maxHeight: '60vh', overflowY: 'auto'}} className="flex flex-col gap-3">
                    {users.map(u => (
                        <div key={u.id} className="glass-card flex justify-between items-center p-4">
                            <div><div className="font-bold">{u.email}</div><div className={`text-xs uppercase font-bold mt-1 ${u.status==='approved'?'text-green':'text-warning'}`}>{u.status||'pending'}</div></div>
                            <div className="flex gap-2"><button onClick={()=>updateUserStatus(u.id,'approved')} className="btn-icon text-green"><Icon name="userCheck"/></button><button onClick={()=>updateUserStatus(u.id,'banned')} className="btn-icon text-red"><Icon name="userX"/></button></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Main App ---
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
        let monthTotal = 0, dailyTotal = 0, catMap = {};
        const todayStr = new Date().toISOString().split('T')[0];
        const currentMonthKey = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

        expenses.forEach(e => {
            const amt = parseFloat(e.amount)||0;
            const d = new Date(e.date + 'T00:00:00');
            const k = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!groups[k]) groups[k] = { title: k, total: 0, items: [], dateObj: d };
            groups[k].items.push(e);
            groups[k].total += amt;
            if (k === currentMonthKey) { monthTotal += amt; catMap[e.category] = (catMap[e.category] || 0) + amt; }
            if (e.date === todayStr) dailyTotal += amt;
        });
        const analytics = categories.map(c => ({ ...c, amount: catMap[c.id] || 0 })).sort((a,b) => b.amount - a.amount);
        return { groups: Object.values(groups).sort((a,b) => b.dateObj - a.dateObj), dailyTotal, monthTotal, analytics };
    }, [expenses, categories]);

    const handleAuth = async (e) => { e.preventDefault(); setAuthError(''); setAuthLoading(true); try { if (isLogin) await signInWithEmailAndPassword(auth, authEmail, authPass); else await createUserWithEmailAndPassword(auth, authEmail, authPass); } catch (err) { setAuthError(err.message.replace('Firebase:', '')); } setAuthLoading(false); };
    const handleGoogle = async () => { setAuthError(''); setAuthLoading(true); try { await signInWithPopup(auth, googleProvider); } catch (err) { setAuthError(err.message); } setAuthLoading(false); };
    const isAdmin = user && ADMIN_EMAILS.some(e => e.toLowerCase() === user.email.toLowerCase());
    
    const saveCategory = async () => { 
        if (!newCatName.trim()) return; 
        if(categories.some(c => c.label.toLowerCase() === newCatName.trim().toLowerCase())) { alert("Exists!"); return; } 
        const ref = await addDoc(collection(db, 'users', user.uid, 'categories'), { 
            label: newCatName, 
            icon: 'tag', 
            color: COLORS[Math.floor(Math.random()*COLORS.length)] 
        }); 
        setCat(ref.id); setIsAddingCat(false); setNewCatName(''); 
    };
    
    const addExpense = async () => {
        await addDoc(collection(db, 'users', user.uid, 'expenses'), { amount: parseFloat(amount), description: desc, category: cat, date, createdAt: serverTimestamp() });
        setAmount(''); setDesc(''); setIsFormOpen(false);
    };

    const getCat = (id) => categories.find(c => c.id === id) || { label: 'Unknown', color: 'bg-gray-500', icon: 'tag' };

    if (!user) return (
        <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'}}>
            <div className="glass-panel" style={{width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '1.5rem', textAlign:'center'}}>
                <div style={{marginBottom: '2rem'}}>
                    <Icon name="lock" size={32} color="#818cf8" style={{marginBottom:'1rem'}}/>
                    <h1 style={{fontSize: '2rem', fontWeight: 'bold'}}>ExpenseVibe</h1>
                    <p style={{color: 'var(--text-muted)'}}>Secure Family Tracking</p>
                </div>
                <button onClick={handleGoogle} className="btn btn-secondary" style={{width: '100%', background: 'white', color: 'black', marginBottom: '1.5rem'}}><span style={{color: '#4285F4', fontWeight: 'bold'}}>G</span> Sign in</button>
                <form onSubmit={handleAuth} className="flex flex-col gap-4"><input type="email" placeholder="Email" className="glass-input" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} required/><input type="password" placeholder="Password" className="glass-input" value={authPass} onChange={e=>setAuthPass(e.target.value)} required/>{authError && <div className="text-red text-sm">{authError}</div>}<button disabled={authLoading} className="btn btn-primary">{authLoading ? '...' : (isLogin ? 'Log In' : 'Sign Up')}</button></form>
                <button onClick={()=>setIsLogin(!isLogin)} className="text-sm mt-4 text-muted">{isLogin ? "Create account" : "Login"}</button>
            </div>
        </div>
    );

    if (userStatus === 'banned' || (userStatus === 'pending' && !isAdmin)) return <div style={{height:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}><h2>Pending Approval</h2><button onClick={()=>signOut(auth)} className="btn btn-secondary mt-4">Sign Out</button></div>;

    return (
        <div style={{paddingBottom: '100px'}}>
            <header className="glass-panel lg-sticky" style={{position:'sticky', top:0, zIndex:10, borderRadius: '0 0 1.5rem 1.5rem', borderTop:'none'}}>
                <div className="container flex justify-between items-center" style={{height: '80px'}}>
                    <div className="flex items-center gap-2 font-heading" style={{fontSize: '1.25rem', fontWeight: 'bold'}}><Icon name="sparkles" className="text-primary"/> ExpenseVibe</div>
                    <div className="flex gap-2">
                        <button onClick={()=>setIsSettingsOpen(true)} className="btn-icon"><Icon name="settings" size={20}/></button>
                        {isAdmin && <button onClick={()=>setIsAdminOpen(true)} className="btn btn-secondary text-xs py-1 px-3"><Icon name="shield"/> Admin</button>}
                        <button onClick={()=>signOut(auth)} className="btn-icon"><Icon name="logOut"/></button>
                    </div>
                </div>
            </header>

            <main className="container lg-grid" style={{marginTop: '1.5rem'}}>
                <div>
                    <div className="grid-cols-2" style={{marginBottom: '1rem'}}>
                        <div className="glass-card"><div className="flex justify-between mb-2 text-xs text-muted uppercase font-bold">Month</div><div className="font-heading" style={{fontSize: '1.5rem'}}>{formatCurrency(data.monthTotal)}</div></div>
                        <div className="glass-card"><div className="flex justify-between mb-2 text-xs text-muted uppercase font-bold">Today</div><div className="font-heading" style={{fontSize: '1.5rem'}}>{formatCurrency(data.dailyTotal)}</div></div>
                    </div>
                    {data.monthTotal > 0 && <div className="glass-card flex-col gap-2">
                        <div className="text-sm font-bold text-muted mb-2">Breakdown</div>
                        {data.analytics.map(c => c.amount > 0 && <div key={c.id}><div className="flex justify-between text-xs mb-1"><span>{c.label}</span><span className="font-mono">{formatCurrency(c.amount)}</span></div><div style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow:'hidden'}}><div style={{width: `${(c.amount/data.monthTotal)*100}%`, height:'100%'}} className={c.color}></div></div></div>)}
                    </div>}
                    <button onClick={()=>setIsFormOpen(true)} className="btn btn-primary desktop-btn"><Icon name="plus"/> Add Expense</button>
                </div>

                <div className="flex flex-col gap-3">
                    {data.groups.map(g => (
                        <div key={g.title} className="glass-card" style={{padding: 0, overflow: 'hidden'}}>
                            <div onClick={()=>setExpanded(p=>({...p, [g.title]:!p[g.title]}))} style={{padding: '1rem', background: 'rgba(255,255,255,0.02)', cursor:'pointer'}} className="flex justify-between items-center">
                                <div className="font-bold text-sm flex gap-2 items-center">{g.title}</div>
                                <div className="text-xs font-bold text-muted">{formatCurrency(g.total)}</div>
                            </div>
                            {expanded[g.title] && <div>{g.items.map(i => {
                                const c = getCat(i.category);
                                return (
                                    <div key={i.id} className="list-item hover:bg-white/5">
                                        <div className="flex gap-3 items-center">
                                            <div className={`category-icon ${c.color}`}><Icon name={c.icon || 'tag'} size={18}/></div>
                                            <div>
                                                <div className="font-bold text-sm">{i.description}</div>
                                                <div className="text-xs text-muted">{formatDate(i.date)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3"><span className="font-bold font-mono text-sm">{formatCurrency(i.amount)}</span>
                                        <button onClick={()=>deleteDoc(doc(db,'users',user.uid,'expenses',i.id))} className="btn-icon text-red"><Icon name="trash" size={16}/></button>
                                        </div>
                                    </div>
                                );
                            })}</div>}
                        </div>
                    ))}
                </div>
            </main>

            <button onClick={()=>setIsFormOpen(true)} className="fab"><Icon name="plus" size={28}/></button>
            {isFormOpen && <div className="modal-overlay"><div className="modal-content glass-panel"><div className="flex justify-between items-center mb-6"><h2 className="font-heading text-xl font-bold">Add Expense</h2><button onClick={()=>{setIsFormOpen(false);setIsAddingCat(false);}} className="btn-icon"><Icon name="chevronDown"/></button></div><div className="flex flex-col gap-4"><div className="relative"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-2xl">₹</span><input type="number" value={amount} onChange={e=>setAmount(e.target.value)} className="glass-input" style={{paddingLeft: '3rem', fontSize: '2rem', fontWeight: 'bold'}} placeholder="0.00" autoFocus/></div><input type="text" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="glass-input"/><div className="grid-cols-2">{!isAddingCat ? <div className="relative"><select value={cat} onChange={e => {if(e.target.value==='_NEW_')setIsAddingCat(true);else setCat(e.target.value);}} className="glass-input" style={{appearance: 'none'}}>{categories.map(c=><option key={c.id} value={c.id} style={{color:'black'}}>{c.label}</option>)}<option value="_NEW_" style={{color:'black'}}>✨ Create New...</option></select><Icon name="chevronDown" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted" size={16}/></div> : <div className="flex gap-2"><input type="text" placeholder="New Category" value={newCatName} onChange={e=>setNewCatName(e.target.value)} className="glass-input" autoFocus/><button onClick={saveCategory} className="btn btn-primary"><Icon name="check"/></button></div>}<input type="date" value={date} onChange={e=>setDate(e.target.value)} className="glass-input"/></div><button onClick={addExpense} className="btn btn-primary w-full" style={{marginTop: '1rem'}}>Save</button></div></div></div>}
            {isAdminOpen && <AdminPanel onClose={()=>setIsAdminOpen(false)} />}
            {isSettingsOpen && <SettingsPanel onClose={()=>setIsSettingsOpen(false)} user={user} categories={categories} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);