import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, query, serverTimestamp, setDoc, updateDoc, orderBy, where, writeBatch, getDocs, getDoc } from 'firebase/firestore';

// --- 1. ICON SYSTEM ---
const Icon = ({ name, size = 20, color = "currentColor", className = "" }) => {
    const paths = {
        plus: "M12 5v14M5 12h14", trash: "M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", trendingUp: "M23 6l-9.5 9.5-5-5L1 18", calendar: "M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 0V2m-14 2V2", pieChart: "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z", chevronDown: "M6 9l6 6 6-6", chevronUp: "M18 15l-6-6-6 6", logOut: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9", lock: "M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zm-7-7a4 4 0 0 1 4 4v3H8V8a4 4 0 0 1 4-4z", shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", userCheck: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M16 11l2 2 4-4", userX: "M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M18 8l5 5 M23 8l-5 5", clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2", tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z", check: "M20 6L9 17l-5-5", sparkles: "M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3z", search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z", settings: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", merge: "M12 5v14M8 9l4-4 4 4", arrowRight: "M5 12h14M12 5l7 7-7 7", database: "M3 5c0-1.66 4.03-3 9-3s9 1.34 9 3V19c0 1.66-4.03 3-9 3s-9-1.34-9-3V5zm0 0v4c0 1.66 4.03 3 9 3s9-1.34 9-3V5", link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
        coffee: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3", shoppingBag: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", 'shopping-bag': "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0", car: "M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2", home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", more: "M12 12h.01M8 12h.01M16 12h.01", 'more-horizontal': "M12 12h.01M8 12h.01M16 12h.01"
    };
    return <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d={paths[name] || paths['tag']} /></svg>;
};

// --- 2. CONFIG ---
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

// --- 3. SETTINGS PANEL ---
const SettingsPanel = ({ onClose, user, categories }) => {
    const [sourceCat, setSourceCat] = useState('');
    const [targetCat, setTargetCat] = useState('');
    const [mergeLoading, setMergeLoading] = useState(false);
    const [recoverLoading, setRecoverLoading] = useState(false);
    const [fixLoading, setFixLoading] = useState(false);

    // FIX LINKS
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

            snapExp.forEach(docSnapshot => { // FIX: Renamed doc to docSnapshot
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
            if (updatedCount > 0) { await batch.commit(); alert(`Fixed ${updatedCount} links!`); } else { alert("No broken links."); }
        } catch (e) { alert(e.message); }
        setFixLoading(false);
    }

    // RECOVERY
    const handleFullRestore = async () => {
        if (!confirm("Restore all data from Shared?")) return;
        setRecoverLoading(true);
        try {
            const batch = writeBatch(db);
            let totalCount = 0;
            const qExp = query(collection(db, 'family_expenses'), where('userId', '==', user.uid));
            const snapExp = await getDocs(qExp);
            
            snapExp.forEach(docSnapshot => { // FIX: Renamed doc to docSnapshot
                const newRef = doc(collection(db, 'users', user.uid, 'expenses')); 
                batch.set(newRef, docSnapshot.data()); 
                totalCount++; 
            });
            
            const qPubCats = query(collection(db, 'categories'));
            const snapPubCats = await getDocs(qPubCats);
            const qMyCats = query(collection(db, 'users', user.uid, 'categories'));
            const snapMyCats = await getDocs(qMyCats);
            const myCatLabels = snapMyCats.docs.map(d => d.data().label.toLowerCase());

            snapPubCats.forEach(docSnapshot => { // FIX: Renamed doc to docSnapshot
                const catData = docSnapshot.data();
                if (!myCatLabels.includes(catData.label.toLowerCase())) {
                    const newCatRef = doc(collection(db, 'users', user.uid, 'categories')); 
                    batch.set(newCatRef, catData); 
                    totalCount++; 
                }
            });
            if (totalCount > 0) { await batch.commit(); alert(`Recovered ${totalCount} items.`); window.location.reload(); } else { alert("No data."); }
        } catch (e) { alert(e.message); }
        setRecoverLoading(false);
    };

    // MERGE
    const handleMerge = async () => {
        if (!sourceCat || !targetCat || sourceCat === targetCat) return;
        setMergeLoading(true);
        try {
            const q = query(collection(db, 'users', user.uid, 'expenses'), where('category', '==', sourceCat));
            const snapshot = await getDocs(q);
            const batch = writeBatch(db);
            
            snapshot.forEach(docSnapshot => { // FIX: Renamed doc to docSnapshot
                batch.update(docSnapshot.ref, { category: targetCat });
            });
            
            batch.delete(doc(db, 'users', user.uid, 'categories', sourceCat));
            await batch.commit();
            alert("Merged!"); setSourceCat(''); setTargetCat('');
        } catch (error) { alert(error.message); }
        setMergeLoading(false);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px', alignItems:'center'}}>
                    <h2 style={{fontSize:'20px', fontWeight:'700'}}>Settings</h2>
                    <button onClick={onClose} className="btn-icon"><Icon name="check"/></button>
                </div>
                <div className="input-group">
                    <button onClick={handleFixLinks} disabled={fixLoading} className="btn btn-primary">{fixLoading?"Fixing...":"Fix Broken Category Links"}</button>
                </div>
                <div className="input-group">
                    <button onClick={handleFullRestore} disabled={recoverLoading} className="btn btn-primary">{recoverLoading?"Restoring...":"Restore Shared Data"}</button>
                </div>
                <div className="input-group" style={{borderTop:'1px solid #333', paddingTop:'20px'}}>
                    <label className="section-title">Merge Duplicates</label>
                    <select className="input-field" value={sourceCat} onChange={e=>setSourceCat(e.target.value)} style={{marginBottom:'10px'}}><option value="">Remove...</option>{categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
                    <select className="input-field" value={targetCat} onChange={e=>setTargetCat(e.target.value)} style={{marginBottom:'10px'}}><option value="">Keep...</option>{categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}</select>
                    <button onClick={handleMerge} disabled={mergeLoading} className="btn btn-secondary" style={{width:'100%'}}>{mergeLoading?"Merging...":"Merge"}</button>
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
        <div className="modal-overlay">
            <div className="modal-content">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                    <h2 style={{fontSize:'20px', fontWeight:'700'}}>Admin</h2>
                    <button onClick={onClose} className="btn-icon"><Icon name="check"/></button>
                </div>
                {users.map(u => (
                    <div key={u.id} className="card" style={{display:'flex', justifyContent:'space-between', marginBottom:'10px', padding:'15px'}}>
                        <div><div style={{fontWeight:'bold'}}>{u.email}</div><div style={{fontSize:'12px', color:'#888'}}>{u.status||'pending'}</div></div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <button onClick={()=>updateUserStatus(u.id,'approved')} className="btn-icon" style={{color:'#10b981'}}><Icon name="userCheck"/></button>
                            <button onClick={()=>updateUserStatus(u.id,'banned')} className="btn-icon" style={{color:'#ef4444'}}><Icon name="userX"/></button>
                        </div>
                    </div>
                ))}
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
        const ref = await addDoc(collection(db, 'users', user.uid, 'categories'), { label: newCatName, icon: 'tag', color: COLORS[Math.floor(Math.random()*COLORS.length)] }); 
        setCat(ref.id); setIsAddingCat(false); setNewCatName(''); 
    };
    const addExpense = async () => { await addDoc(collection(db, 'users', user.uid, 'expenses'), { amount: parseFloat(amount), description: desc, category: cat, date, createdAt: serverTimestamp() }); setAmount(''); setDesc(''); setIsFormOpen(false); };
    const getCat = (id) => categories.find(c => c.id === id) || { label: 'Unknown', color: 'bg-gray', icon: 'tag' };

    if (!user) return (
        <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'20px'}}>
            <div className="card" style={{width:'100%', maxWidth:'400px', textAlign:'center'}}>
                <h1 style={{marginBottom:'20px'}}>ExpenseVibe</h1>
                <button onClick={handleGoogle} className="btn btn-secondary" style={{width:'100%', background:'white', color:'black', marginBottom:'20px'}}>G Sign In</button>
                <form onSubmit={handleAuth}>
                    <input className="input-field" placeholder="Email" value={authEmail} onChange={e=>setAuthEmail(e.target.value)} style={{marginBottom:'10px'}}/>
                    <input className="input-field" type="password" placeholder="Password" value={authPass} onChange={e=>setAuthPass(e.target.value)} style={{marginBottom:'10px'}}/>
                    <button className="btn btn-primary">{authLoading?'...':(isLogin?'Login':'Sign Up')}</button>
                </form>
                <p onClick={()=>setIsLogin(!isLogin)} style={{marginTop:'20px', color:'#6366f1', cursor:'pointer'}}>{isLogin?"Create Account":"Login"}</p>
            </div>
        </div>
    );

    if (userStatus !== 'approved' && !isAdmin) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><h2>Waiting for Approval...</h2></div>;

    return (
        <div className="container">
            <div className="app-header">
                <div className="header-content">
                    <div className="logo"><Icon name="sparkles" size={20} color="#6366f1"/> ExpenseVibe</div>
                    <div className="header-actions">
                        <button onClick={()=>setIsSettingsOpen(true)} className="btn-icon"><Icon name="settings"/></button>
                        {isAdmin && <button onClick={()=>setIsAdminOpen(true)} className="btn-icon"><Icon name="shield"/></button>}
                        <button onClick={()=>signOut(auth)} className="btn-icon"><Icon name="logOut"/></button>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="card">
                    <div className="stat-label">Month</div>
                    <div className="stat-value">{formatCurrency(data.monthTotal)}</div>
                </div>
                <div className="card">
                    <div className="stat-label">Today</div>
                    <div className="stat-value">{formatCurrency(data.dailyTotal)}</div>
                </div>
            </div>

            {data.monthTotal > 0 && (
                <div className="card" style={{marginBottom:'20px'}}>
                    <div className="section-title">Breakdown</div>
                    {data.analytics.map(c => c.amount > 0 && (
                        <div key={c.id} style={{marginBottom:'10px'}}>
                            <div style={{display:'flex', justifyContent:'space-between', fontSize:'12px', marginBottom:'5px'}}>
                                <span>{c.label}</span>
                                <span>{formatCurrency(c.amount)}</span>
                            </div>
                            <div style={{height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'3px', overflow:'hidden'}}>
                                <div style={{height:'100%', width:`${(c.amount/data.monthTotal)*100}%`}} className={c.color}></div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {data.groups.map(g => (
                <div key={g.title} className="expense-group">
                    <div className="group-header" onClick={()=>setExpanded(p=>({...p, [g.title]:!p[g.title]}))}>
                        <div>{g.title}</div>
                        <div>{formatCurrency(g.total)}</div>
                    </div>
                    {expanded[g.title] && g.items.map(i => {
                        const c = getCat(i.category);
                        return (
                            <div key={i.id} className="expense-item">
                                <div className="item-left">
                                    <div className={`icon-box ${c.color}`}><Icon name={c.icon || 'tag'}/></div>
                                    <div className="item-details">
                                        <h4>{i.description}</h4>
                                        <p>{formatDate(i.date)}</p>
                                    </div>
                                </div>
                                <div className="item-right">
                                    <div className="item-amount">{formatCurrency(i.amount)}</div>
                                    <button onClick={()=>deleteDoc(doc(db,'users',user.uid,'expenses',i.id))} style={{color:'#ef4444', background:'none', border:'none', cursor:'pointer'}}><Icon name="trash" size={16}/></button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}

            <button className="fab" onClick={()=>setIsFormOpen(true)}><Icon name="plus" size={28}/></button>

            {isFormOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                            <h2>Add Expense</h2>
                            <button onClick={()=>setIsFormOpen(false)} className="btn-icon"><Icon name="chevronDown"/></button>
                        </div>
                        <div className="input-group">
                            <input type="number" className="input-field big-input" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)} autoFocus/>
                        </div>
                        <div className="input-group">
                            <input type="text" className="input-field" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)}/>
                        </div>
                        <div className="input-group" style={{display:'flex', gap:'10px'}}>
                            {!isAddingCat ? (
                                <select className="input-field" value={cat} onChange={e=>{if(e.target.value==='NEW')setIsAddingCat(true);else setCat(e.target.value);}}>
                                    {categories.map(c=><option key={c.id} value={c.id} style={{color:'black'}}>{c.label}</option>)}
                                    <option value="NEW" style={{color:'black'}}>+ New...</option>
                                </select>
                            ) : (
                                <div style={{display:'flex', gap:'10px', width:'100%'}}>
                                    <input className="input-field" placeholder="New Category" value={newCatName} onChange={e=>setNewCatName(e.target.value)}/>
                                    <button onClick={saveCategory} className="btn btn-secondary"><Icon name="check"/></button>
                                </div>
                            )}
                            <input type="date" className="input-field" value={date} onChange={e=>setDate(e.target.value)}/>
                        </div>
                        <button onClick={addExpense} className="btn btn-primary">Save Expense</button>
                    </div>
                </div>
            )}

            {isAdminOpen && <AdminPanel onClose={()=>setIsAdminOpen(false)} />}
            {isSettingsOpen && <SettingsPanel onClose={()=>setIsSettingsOpen(false)} user={user} categories={categories} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);