import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import {
  Users, Award, Wallet, Clock, Play, Upload, LogOut, Settings, Shield, Eye, EyeOff,
  CheckCircle, XCircle, AlertCircle, TrendingUp, FileText, Plus, Minus, UserPlus,
  Lock, Phone, CreditCard, Banknote, MessageSquare, ChevronDown, ChevronUp, X,
  Loader, Image, Copy, CopyCheck, FileSpreadsheet, BarChart2, Share2,
  Gift, Star, ArrowUpRight, ArrowDownLeft, Send, QrCode, PhoneCall, Zap, Trophy, Crown,
  MessageCircle, Bot, HelpCircle, Activity
} from 'lucide-react';

// ===== UI COMPONENTS =====
const InputGroup = memo(({ label, children, error }) => (
  <div className="mb-4" key={`input-group-${label}`}>
    {label && (
      <label className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
    )}
    {children}
    {error && (
      <p className="mt-1 text-sm text-red-400 flex items-center min-h-[20px]">
        <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" /> {error}
      </p>
    )}
  </div>
));

const Button = memo(({ children, loading, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
      props.disabled || loading
        ? 'bg-gray-700 cursor-not-allowed text-gray-500'
        : props.danger
        ? 'bg-red-700 hover:bg-red-800 text-white focus:ring-red-600'
        : 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-90 text-white focus:ring-teal-600'
    }`}
    key={`button-${children}`}
  >
    {loading ? (
      <span className="flex items-center">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Processing...
      </span>
    ) : children}
  </button>
));

const Notification = memo(({ message, type }) => (
  <div className={`fixed top-4 right-4 z-50 max-w-xs w-full shadow-lg rounded-lg p-4 flex items-center ${
    type === 'success' ? 'bg-teal-900 border border-teal-700 text-teal-100' : 'bg-amber-900 border border-amber-700 text-amber-100'
  }`} key={`notification-${message}`}>
    {type === 'success' ? (
      <CheckCircle className="h-5 w-5 mr-3 text-teal-400 flex-shrink-0" />
    ) : (
      <AlertCircle className="h-5 w-5 mr-3 text-amber-400 flex-shrink-0" />
    )}
    <p className="flex-1 text-sm font-medium">{message}</p>
    <button
      onClick={() => {}}
      className="ml-2 text-current hover:opacity-80"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
));

const Header = memo(({ session, handleLogout, joinWhatsAppGroup, setAuthMode, setError, setSuccess }) => (
  <header className="bg-gray-900 shadow-sm border-b border-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16 items-center">
        <div className="flex items-center">
          <div className="flex-shrink-0 flex items-center">
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg p-1.5">
              <Zap className="h-7 w-7 text-white" />
            </div>
            <span className="ml-2 text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-300">
              TaskPay
            </span>
          </div>
        </div>
        {session ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <div className="text-sm font-medium text-gray-200">{session.name}</div>
              <div className="text-xs text-teal-400 capitalize flex items-center">
                {session.premium ? <Crown className="h-3 w-3 mr-1 text-amber-400" /> : null}
                {session.role === 'admin' ? 'Admin' : session.premium ? 'Premium' : 'Free'}
              </div>
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold">
              {session.name.charAt(0)}
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={joinWhatsAppGroup}
              className="flex items-center px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              WhatsApp
            </button>
            <button
              onClick={() => {
                setAuthMode('login');
                setError('');
                setSuccess('');
              }}
              className="px-4 py-2 text-sm font-medium text-teal-400 hover:text-teal-300"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setError('');
                setSuccess('');
              }}
              className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Join Now
            </button>
          </div>
        )}
      </div>
    </div>
  </header>
));

const StatCard = memo(({ title, value, icon: Icon, color = 'bg-gradient-to-br from-teal-700 to-emerald-800' }) => (
  <div className="bg-gray-800 rounded-xl shadow-md p-5 border border-gray-700 hover:shadow-lg transition-shadow" key={`stat-card-${title}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <p className="text-xl font-bold mt-1 text-gray-100">{value}</p>
      </div>
      <div className={`${color} p-3 rounded-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
));

const AuthCard = ({ children, title, subtitle }) => (
  <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-gray-700">
    <div className="bg-gradient-to-r from-teal-700 to-emerald-800 p-6 text-white text-center">
      <Shield className="h-12 w-12 mx-auto mb-3" />
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="opacity-95 mt-1 text-base">{subtitle}</p>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

// ===== LIVE FEED COMPONENT =====
const LiveFeed = memo(({ users, transactions }) => {
  const feedItems = useMemo(() => {
    const items = [];

    // Add withdrawal events
    const withdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'approved');
    withdrawals.slice(-3).forEach(txn => {
      const user = users.find(u => u.id === txn.userId || u.id === txn.id?.split('_')[1]);
      if (user) {
        items.push({
          id: txn.id,
          text: `🎉 ${user.name} just withdrew ${formatNaira(txn.amount)}!`,
          time: new Date(txn.date),
          type: 'withdrawal'
        });
      }
    });

    // Add premium upgrades
    const upgrades = transactions.filter(t => t.description === 'Premium Access Fee' && t.status === 'approved');
    upgrades.slice(-2).forEach(txn => {
      const user = users.find(u => u.id === txn.userId || u.id === txn.id?.split('_')[1]);
      if (user) {
        items.push({
          id: txn.id + '_up',
          text: `✨ ${user.name} just upgraded to Premium!`,
          time: new Date(txn.date),
          type: 'premium'
        });
      }
    });

    // Add check-in & ad tasks
    const tasks = transactions.filter(t => t.type === 'task' && t.status === 'completed');
    tasks.slice(-3).forEach(txn => {
      const user = users.find(u => u.id === txn.userId || u.id === txn.id?.split('_')[1]);
      if (user) {
        const desc = txn.description.includes('Check-In') ? 'daily check-in' : 'ad';
        items.push({
          id: txn.id + '_task',
          text: `✅ ${user.name} earned ${formatNaira(txn.amount)} from ${desc}`,
          time: new Date(txn.date),
          type: 'task'
        });
      }
    });

    return items.sort((a, b) => b.time - a.time).slice(0, 8);
  }, [users, transactions]);

  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-4 overflow-hidden">
      <h3 className="font-bold text-gray-100 mb-3 flex items-center">
        <Activity className="h-5 w-5 text-teal-400 mr-2" />
        Live Activity Feed
      </h3>
      <div className="h-12 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          {feedItems.map(item => (
            <span key={item.id} className="mx-6 inline-block">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mr-2 ${
                item.type === 'withdrawal' ? 'bg-red-900/30 text-red-300' :
                item.type === 'premium' ? 'bg-amber-900/30 text-amber-300' :
                'bg-teal-900/30 text-teal-300'
              }`}>
                {item.type === 'withdrawal' ? '💸' : item.type === 'premium' ? '👑' : '✅'}
              </span>
              <span className="text-gray-300">{item.text}</span>
            </span>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
});

// ===== AI LIVE CHAT BUTTON =====
const AiChatButton = memo(() => {
  const openChat = () => {
    // Simulated AI live chat (would integrate Crisp/Chatwoot in production)
    alert("💬 AI Assistant: Hello! How can I help?\n\nI can answer:\n• How to withdraw\n• Minimum balance\n• Referral bonuses\n• Task limits\n\nType your question!");
  };

  return (
    <button
      onClick={openChat}
      className="fixed bottom-6 right-6 z-40 flex items-center justify-center h-14 w-14 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
      title="AI Live Chat"
    >
      <Bot className="h-6 w-6" />
    </button>
  );
});

// ===== AUTH FORM COMPONENTS =====
const LoginForm = memo((
  {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    onLogin,
    loading,
    error,
    setAuthMode,
    setError,
    setSuccess
  }
) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  useEffect(() => {
    if (emailRef.current) {
      setTimeout(() => emailRef.current.focus(), 100);
    }
  }, []);
  const handleSubmit = (e) => { e.preventDefault(); onLogin(e); };
  const handleEmailChange = useCallback((e) => { setEmail(e.target.value); }, [setEmail]);
  const handlePasswordChange = useCallback((e) => { setPassword(e.target.value); }, [setPassword]);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputGroup label="Email Address" error={error?.includes('email') ? error : ''}>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="you@example.com"
          required
          autoComplete="email"
          key="login-email-input"
        />
      </InputGroup>
      <InputGroup label="Password" error={error?.includes('password') ? error : ''}>
        <div className="relative">
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            key="login-password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <div className="flex justify-end mt-1">
          <button
            type="button"
            onClick={() => { setError(''); setSuccess(''); }}
            className="text-xs text-teal-400 hover:text-teal-300"
          >
            Forgot password?
          </button>
        </div>
      </InputGroup>
      <Button loading={loading} type="submit">
        Sign In
      </Button>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            setAuthMode('signup');
            setError('');
            setSuccess('');
          }}
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          Don't have an account? Create one
        </button>
      </div>
    </form>
  );
});

const SignupForm = memo((
  {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    referralCode,
    setReferralCode,
    showPassword,
    setShowPassword,
    onSignup,
    loading,
    error,
    setAuthMode,
    setError,
    setSuccess
  }
) => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const referralRef = useRef(null);
  useEffect(() => {
    if (nameRef.current) {
      setTimeout(() => nameRef.current.focus(), 100);
    }
  }, []);
  const handleSubmit = (e) => { e.preventDefault(); onSignup(e); };
  const handleNameChange = useCallback((e) => { setName(e.target.value); }, [setName]);
  const handleEmailChange = useCallback((e) => { setEmail(e.target.value); }, [setEmail]);
  const handlePhoneChange = useCallback((e) => { setPhone(e.target.value); }, [setPhone]);
  const handlePasswordChange = useCallback((e) => { setPassword(e.target.value); }, [setPassword]);
  const handleReferralCodeChange = useCallback((e) => { setReferralCode(e.target.value); }, [setReferralCode]);
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <InputGroup label="Full Name" error={error?.includes('name') ? error : ''}>
        <input
          ref={nameRef}
          type="text"
          value={name}
          onChange={handleNameChange}
          className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Chike Obi"
          required
          autoComplete="name"
          key="signup-name-input"
        />
      </InputGroup>
      <InputGroup label="Email Address" error={error?.includes('email') ? error : ''}>
        <input
          ref={emailRef}
          type="email"
          value={email}
          onChange={handleEmailChange}
          className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="chike@example.com"
          required
          autoComplete="email"
          key="signup-email-input"
        />
      </InputGroup>
      <InputGroup label="Phone Number" error={error?.includes('phone') ? error : ''}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 text-sm">+234</span>
          </div>
          <input
            ref={phoneRef}
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className="appearance-none block w-full pl-12 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="8012345678"
            required
            autoComplete="tel"
            key="signup-phone-input"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">Nigerian phone number starting with 08, 09, or 07</p>
      </InputGroup>
      <InputGroup label="Password" error={error?.includes('password') ? error : ''}>
        <div className="relative">
          <input
            ref={passwordRef}
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="••••••••"
            required
            autoComplete="new-password"
            key="signup-password-input"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
      </InputGroup>
      <InputGroup label="Referral Code (Optional)">
        <div className="relative">
          <input
            ref={referralRef}
            type="text"
            value={referralCode}
            onChange={handleReferralCodeChange}
            className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder="CHIKE9876"
            autoComplete="off"
            key="signup-referral-input"
          />
          <button
            type="button"
            onClick={() => { }}
            className="absolute right-3 top-2.5 text-teal-400 hover:text-teal-300 text-sm font-medium"
          >
            How it works?
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Get ₦200 welcome bonus when you use a valid referral code
        </p>
      </InputGroup>
      <Button loading={loading} type="submit">
        Create Account
      </Button>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            setAuthMode('login');
            setError('');
            setSuccess('');
          }}
          className="text-sm font-medium text-teal-400 hover:text-teal-300"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
});

const ReferralCard = memo(({ user, users }) => {
  const [copiedReferral, setCopiedReferral] = useState(false);
  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2000);
  };
  const shareViaWhatsApp = () => {
    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
    const message = `Join me on TaskPay and earn real money with simple tasks! Use my referral code ${user.referralCode} or click this link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };
  const shareViaSMS = () => {
    const referralLink = `${window.location.origin}?ref=${user.referralCode}`;
    const message = `Join TaskPay with my referral code ${user.referralCode} and get ₦200 bonus! Link: ${referralLink}`;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };
  const referrals = users.filter(u => u.referredBy === user.id);
  const totalReferralEarnings = referrals.reduce((sum, ref) =>
    sum + (ref.premium ? 500 : 0), 0
  ) + (user.referralEarnings || 0);
  const premiumReferrals = referrals.filter(r => r.premium).length;
  const tierLabels = [
    { min: 0, name: 'Bronze', color: 'bg-yellow-900 text-yellow-200' },
    { min: 5, name: 'Silver', color: 'bg-gray-700 text-gray-200' },
    { min: 10, name: 'Gold', color: 'bg-yellow-500 text-yellow-900' },
    { min: 20, name: 'Diamond', color: 'bg-blue-900 text-blue-200' }
  ];
  const currentTier = tierLabels
    .filter(t => premiumReferrals >= t.min)
    .sort((a, b) => b.min - a.min)[0] || tierLabels[0];
  return (
    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-5">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center">
            <Gift className="h-5 w-5 text-purple-400 mr-2" />
            My Referrals
          </h2>
          <p className="text-gray-400 mt-1 text-sm">
            Earn ₦500 for each friend who upgrades to premium
          </p>
        </div>
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${currentTier.color}`}>
          {currentTier.name} Tier
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
        <div>
          <p className="text-sm text-gray-500">Total Referrals</p>
          <p className="font-bold text-gray-200 text-lg">{referrals.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Premium Upgrades</p>
          <p className="font-bold text-teal-400 text-lg">{premiumReferrals}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Pending Bonuses</p>
          <p className="font-bold text-amber-400 text-lg">{referrals.filter(r => !r.premium).length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Earnings</p>
          <p className="font-bold text-purple-400 text-lg">{`₦${totalReferralEarnings.toLocaleString()}`}</p>
        </div>
      </div>
      <div className="mt-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-3 border border-purple-800/50">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-2">
            <Share2 className="h-4 w-4 text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-200">Your Referral Code</p>
            <p className="text-sm text-purple-400 font-mono font-medium">{user.referralCode}</p>
          </div>
          <button
            onClick={copyReferralLink}
            className="p-1 text-purple-400 hover:text-purple-200 transition-colors"
            title={copiedReferral ? "Copied!" : "Copy referral link"}
          >
            {copiedReferral ? (
              <CopyCheck className="h-4 w-4 text-teal-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={shareViaWhatsApp}
          className="flex items-center justify-center px-3 py-2 bg-teal-900/30 text-teal-300 rounded-lg text-sm font-medium hover:bg-teal-800/40 transition-colors"
        >
          <Send className="h-4 w-4 mr-1" />
          WhatsApp
        </button>
        <button
          onClick={shareViaSMS}
          className="flex items-center justify-center px-3 py-2 bg-blue-900/30 text-blue-300 rounded-lg text-sm font-medium hover:bg-blue-800/40 transition-colors"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          SMS
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <p className="text-xs text-gray-500">
          <span className="font-medium">How it works:</span> Share your referral code with friends. When they sign up and upgrade to premium, you both get bonuses - ₦500 for you, ₦200 for them!
        </p>
      </div>
    </div>
  );
});

// ===== HELPER FUNCTIONS =====
const formatNaira = (amount) => {
  return `₦${Number(amount).toLocaleString('en-NG')}`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-NG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getElapsedTime = (dateStr) => {
  const now = new Date();
  const past = new Date(dateStr);
  const diff = now - past;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)} mins ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
  return formatDate(dateStr);
};

const canCheckIn = (user) => {
  if (!user.lastCheckIn) return true;
  const last = new Date(user.lastCheckIn);
  const next = new Date(last);
  next.setDate(last.getDate() + 1);
  next.setHours(0, 0, 0, 0);
  return Date.now() >= next.getTime();
};

const canWatchAd = (user) => {
  const today = new Date().toISOString().split('T')[0];
  const adsToday = user.adsHistory?.filter(a => a.date.startsWith(today)).length || 0;
  return adsToday < 5;
};

const generateReferralCode = (name, id) => {
  const cleanName = name.replace(/\s+/g, '').toUpperCase().slice(0, 4);
  const uniqueId = id.slice(-4);
  return `${cleanName}${uniqueId}`;
};

export default function App() {
  // ===== PERSISTENT STATE =====
  const [session, setSession] = useState(() => {
    try {
      const saved = sessionStorage.getItem('taskpay_session');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  
  const [users, setUsers] = useState(() => {
    try {
      const saved = sessionStorage.getItem('taskpay_users');
      if (saved) return JSON.parse(saved);
    } catch { }
    return [
      {
        id: 'admin_001',
        email: 'miracleekeoha07@outlook.com',
        name: 'Eugene Ekeoha',
        role: 'admin',
        passwordHash: '',
        passwordSet: false,
        balance: 2450000,
        premium: true,
        joined: '2025-12-01',
        referralCode: 'ADMIN001',
        referrals: ['user_9876'],
        referralEarnings: 500
      },
      {
        id: 'user_9876',
        email: 'user@example.com',
        name: 'Test User',
        role: 'user',
        passwordHash: 'password123',
        premium: true,
        balance: 12500,
        phone: '08012345678',
        joined: '2025-12-15',
        lastCheckIn: '2025-12-21',
        referralCode: 'CHIKE9876',
        referredBy: 'ADMIN001',
        referralBonus: 200,
        adsHistory: [
          { adId: 'ad_001', title: 'MTN Nigeria', date: '2025-12-21', amount: 100 },
          { adId: 'ad_003', title: 'GTBank', date: '2025-12-21', amount: 100 }
        ],
        transactions: [
          { id: 'txn_001', type: 'task', description: 'Daily Check-In', amount: 100, date: '2025-12-21T10:30:00', status: 'completed' },
          { id: 'txn_002', type: 'task', description: 'Watched Ad: MTN Nigeria', amount: 100, date: '2025-12-21T11:15:00', status: 'completed' },
          { id: 'txn_003', type: 'task', description: 'Watched Ad: GTBank', amount: 100, date: '2025-12-21T14:22:00', status: 'completed' },
          { id: 'txn_004', type: 'payment', description: 'Premium Access Fee', amount: 18000, date: '2025-12-15T09:45:00', status: 'approved' },
          { id: 'txn_005', type: 'bonus', description: 'Referral Welcome Bonus', amount: 200, date: '2025-12-15T10:00:00', status: 'completed' },
          { id: 'txn_006', type: 'withdrawal', description: 'Bank Transfer Request', amount: 5000, date: '2025-12-20T16:30:00', status: 'approved' }
        ]
      }
    ];
  });

  const [payments, setPayments] = useState(() => {
    try {
      const saved = sessionStorage.getItem('taskpay_payments');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [withdrawals, setWithdrawals] = useState(() => {
    try {
      const saved = sessionStorage.getItem('taskpay_withdrawals');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // ===== UI STATE =====
  const [authMode, setAuthMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTaskModal, setShowTaskModal] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);
  const [adminTab, setAdminTab] = useState('overview');
  const [reviewMode, setReviewMode] = useState(null);
  const [reviewItemId, setReviewItemId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [showReferralSuccess, setShowReferralSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState(5000);
  const [accountNumber, setAccountNumber] = useState('8034848106');
  const [bankName, setBankName] = useState('Moniepoint');
  const [paymentProof, setPaymentProof] = useState(null);
  const [fileName, setFileName] = useState('');

  // ===== EFFECTS =====
  useEffect(() => {
    if (session) {
      try {
        sessionStorage.setItem('taskpay_session', JSON.stringify(session));
      } catch { }
    }
  }, [session]);

  useEffect(() => {
    try {
      sessionStorage.setItem('taskpay_users', JSON.stringify(users));
      sessionStorage.setItem('taskpay_payments', JSON.stringify(payments));
      sessionStorage.setItem('taskpay_withdrawals', JSON.stringify(withdrawals));
    } catch { }
  }, [users, payments, withdrawals]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError('');
        setSuccess('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  useEffect(() => {
    if (showReferralSuccess) {
      const timer = setTimeout(() => setShowReferralSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showReferralSuccess]);

  // ===== CORE FUNCTIONS =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await new Promise(r => setTimeout(r, 800));
      const user = users.find(u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        (u.passwordHash === password || (u.role === 'admin' && !u.passwordSet))
      );
      if (!user) throw new Error('Invalid email or password');
      if (user.role === 'admin' && !user.passwordSet && password) {
        const updatedUsers = users.map(u =>
          u.id === user.id
            ? { ...u, passwordHash: password, passwordSet: true }
            : u
        );
        setUsers(updatedUsers);
        setSession({ ...user, passwordSet: true });
        setSuccess('Admin password set successfully!');
      } else if (user.role === 'admin' && !user.passwordSet) {
        throw new Error('Please set your admin password first');
      } else {
        setSession(user);
        setSuccess(`Welcome back, ${user.name.split(' ')[0]}!`);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (!name.trim()) throw new Error('Full name is required');
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw new Error('Invalid email format');
      }
      if (password.length < 6) throw new Error('Password must be at least 6 characters');
      if (!/^0[789]\d{9}$/.test(phone)) {
        throw new Error('Invalid Nigerian phone number format. Must start with 07, 08, or 09');
      }
      if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email already registered');
      }
      await new Promise(r => setTimeout(r, 1000));
      const newReferralCode = generateReferralCode(name, Date.now().toString());
      let referrer = null;
      let referralBonus = 0;
      if (referralCode.trim()) {
        referrer = users.find(u =>
          u.referralCode?.toLowerCase() === referralCode.trim().toLowerCase()
        );
        if (referrer) {
          referralBonus = 200;
        } else {
          throw new Error('Invalid referral code. Please check and try again.');
        }
      }
      const newUser = {
        id: `user_${Date.now()}`,
        email: email.toLowerCase(),
        name,
        phone,
        passwordHash: password,
        role: 'user',
        premium: false,
        balance: referralBonus,
        joined: new Date().toISOString().split('T')[0],
        referralCode: newReferralCode,
        referredBy: referrer ? referrer.id : null,
        referralBonus: referralBonus,
        adsHistory: [],
        transactions: referralBonus > 0 ? [{
          id: `txn_${Date.now()}`,
          type: 'bonus',
          description: 'Referral Welcome Bonus',
          amount: referralBonus,
          date: new Date().toISOString(),
          status: 'completed'
        }] : []
      };
      if (referrer) {
        const updatedUsers = users.map(u => {
          if (u.id === referrer.id) {
            return {
              ...u,
              balance: (u.balance || 0) + 500,
              referrals: [...(u.referrals || []), newUser.id],
              referralEarnings: (u.referralEarnings || 0) + 500,
              transactions: [
                {
                  id: `txn_${Date.now() + 1}`,
                  type: 'bonus',
                  description: `Referral Bonus - ${newUser.name}`,
                  amount: 500,
                  date: new Date().toISOString(),
                  status: 'completed'
                },
                ...(u.transactions || [])
              ]
            };
          }
          return u;
        });
        setUsers(updatedUsers);
        setSuccess(`Account created with ₦${referralBonus} welcome bonus!`);
        setShowReferralSuccess(true);
      } else {
        setSuccess('Account created successfully!');
      }
      setUsers(prev => [...prev, newUser]);
      setSession(newUser);
      setName(''); setEmail(''); setPassword(''); setPhone(''); setReferralCode('');
      setAuthMode('login');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setSession(null);
    setActiveTab('dashboard');
    setError('');
    setSuccess('');
    sessionStorage.removeItem('taskpay_session');
  };

  const handleCompleteCheckIn = () => {
    if (!session || !session.premium) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedUsers = users.map(u => {
      if (u.id === session.id) {
        return {
          ...u,
          balance: u.balance + 100,
          lastCheckIn: today,
          transactions: [
            {
              id: `txn_${Date.now()}`,
              type: 'task',
              description: 'Daily Check-In',
              amount: 100,
              date: new Date().toISOString(),
              status: 'completed'
            },
            ...(u.transactions || [])
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setSession(prev => ({
      ...prev,
      balance: prev.balance + 100,
      lastCheckIn: today
    }));
    setSuccess('Check-in successful! ₦100 has been credited.');
    setShowTaskModal(null);
  };

  const handleWatchAd = (adId) => {
    if (!session || !session.premium) return;
    const ad = mockAds.find(a => a.id === adId);
    if (!ad) return;
    const today = new Date().toISOString().split('T')[0];
    const updatedUsers = users.map(u => {
      if (u.id === session.id) {
        const adsHistory = [
          { adId, title: ad.title, date: today, amount: 100 },
          ...(u.adsHistory || [])
        ];
        return {
          ...u,
          balance: u.balance + 100,
          adsHistory,
          transactions: [
            {
              id: `txn_${Date.now()}`,
              type: 'task',
              description: `Watched Ad: ${ad.title}`,
              amount: 100,
              date: new Date().toISOString(),
              status: 'completed'
            },
            ...(u.transactions || [])
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setSession(prev => ({
      ...prev,
      balance: prev.balance + 100,
      adsHistory: [
        { adId, title: ad.title, date: today, amount: 100 },
        ...(prev.adsHistory || [])
      ]
    }));
    setSuccess(`Ad watched! ₦100 credited.`);
    setShowTaskModal(null);
    setSelectedAd(null);
  };

  const handleSubmitPayment = () => {
    if (!session || !paymentProof) return;
    const payment = {
      id: `pay_${Date.now()}`,
      userId: session.id,
      userName: session.name,
      amount: 18000,
      purpose: 'Premium Access',
      proof: URL.createObjectURL(paymentProof),
      date: new Date().toISOString(),
      status: 'pending'
    };
    setPayments(prev => [payment, ...prev]);
    const updatedUsers = users.map(u => {
      if (u.id === session.id) {
        return {
          ...u,
          transactions: [
            {
              id: `txn_${Date.now()}`,
              type: 'payment',
              description: 'Premium Access Fee',
              amount: 18000,
              date: new Date().toISOString(),
              status: 'pending'
            },
            ...(u.transactions || [])
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setShowPaymentModal(false);
    setPaymentProof(null);
    setFileName('');
    setSuccess('Payment proof submitted! Admin will review.');
  };

  const handleRequestWithdrawal = () => {
    if (!session || session.balance < withdrawalAmount) return;
    const withdrawal = {
      id: `wd_${Date.now()}`,
      userId: session.id,
      userName: session.name,
      amount: withdrawalAmount,
      accountName: session.name,
      accountNumber,
      bank: bankName,
      date: new Date().toISOString(),
      status: 'pending'
    };
    setWithdrawals(prev => [withdrawal, ...prev]);
    const updatedUsers = users.map(u => {
      if (u.id === session.id) {
        return {
          ...u,
          balance: u.balance - withdrawalAmount,
          transactions: [
            {
              id: `txn_${Date.now()}`,
              type: 'withdrawal',
              description: `Withdrawal Request: ${formatNaira(withdrawalAmount)}`,
              amount: withdrawalAmount,
              date: new Date().toISOString(),
              status: 'pending'
            },
            ...(u.transactions || [])
          ]
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setSession(prev => ({
      ...prev,
      balance: prev.balance - withdrawalAmount
    }));
    setShowWithdrawalModal(false);
    setSuccess(`Withdrawal request for ${formatNaira(withdrawalAmount)} submitted!`);
  };

  const handleApprovePayment = (paymentId) => {
    setPayments(prev =>
      prev.map(p =>
        p.id === paymentId ? { ...p, status: 'approved' } : p
      )
    );
    const payment = payments.find(p => p.id === paymentId);
    if (!payment) return;
    const updatedUsers = users.map(u => {
      if (u.id === payment.userId) {
        const user = { ...u, premium: true };
        if (!u.premium) {
          const referrer = users.find(r => r.id === u.referredBy);
          if (referrer) {
            user.balance = (user.balance || 0) + 500;
            user.transactions = [
              {
                id: `txn_${Date.now() + 1}`,
                type: 'bonus',
                description: 'Referral Upgrade Bonus',
                amount: 500,
                date: new Date().toISOString(),
                status: 'completed'
              },
              ...(user.transactions || [])
            ];
          }
        }
        return {
          ...user,
          transactions: user.transactions.map(t =>
            t.description.includes('Premium Access Fee') && t.status === 'pending'
              ? { ...t, status: 'approved' }
              : t
          )
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    if (session?.id === payment.userId) {
      setSession(prev => ({ ...prev, premium: true }));
    }
    setReviewMode(null);
    setReviewItemId(null);
    setSuccess(`Payment approved for ${payment.userName}!`);
  };

  const handleApproveWithdrawal = (withdrawalId) => {
    setWithdrawals(prev =>
      prev.map(w =>
        w.id === withdrawalId ? { ...w, status: 'approved' } : w
      )
    );
    const withdrawal = withdrawals.find(w => w.id === withdrawalId);
    if (!withdrawal) return;
    const updatedUsers = users.map(u => {
      if (u.id === withdrawal.userId) {
        return {
          ...u,
          transactions: u.transactions.map(t =>
            t.description.includes('Withdrawal Request') && t.status === 'pending'
              ? { ...t, status: 'approved' }
              : t
          )
        };
      }
      return u;
    });
    setUsers(updatedUsers);
    setReviewMode(null);
    setReviewItemId(null);
    setSuccess(`Withdrawal approved for ${withdrawal.userName}!`);
  };

  const copyAccountDetails = () => {
    navigator.clipboard.writeText('8034848106');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const joinWhatsAppGroup = () => {
    window.open('https://chat.whatsapp.com/J3ZjL2GEzLNAqdnSB828nG', '_blank');
  };

  const joinWhatsAppSupport = () => {
    window.open('https://wa.me/2349076004075?text=Hi%20Admin,%20I%20need%20help%20with%20TaskPay', '_blank');
  };

  // ===== MOCK DATA =====
  const mockAds = useMemo(() => [
    { id: 'ad_001', title: 'MTN Nigeria', duration: 30, category: 'Telecom', reward: 100 },
    { id: 'ad_002', title: 'Dangote Cement', duration: 45, category: 'Construction', reward: 100 },
    { id: 'ad_003', title: 'GTBank', duration: 35, category: 'Banking', reward: 100 },
    { id: 'ad_004', title: 'Jumia', duration: 25, category: 'E-commerce', reward: 100 },
    { id: 'ad_005', title: 'Indomie', duration: 20, category: 'Food', reward: 100 }
  ], []);

  // All transactions for live feed
  const allTransactions = useMemo(() => {
    return [
      ...payments.map(p => ({ ...p, type: 'payment' })),
      ...withdrawals.map(w => ({ ...w, type: 'withdrawal', userId: w.userId })),
      ...users.flatMap(u => (u.transactions || []).map(t => ({ ...t, userId: u.id })))
    ];
  }, [payments, withdrawals, users]);

  // ===== RENDER =====
  if (!session && (authMode === 'login' || authMode === 'signup')) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <Header
          session={session}
          handleLogout={handleLogout}
          joinWhatsAppGroup={joinWhatsAppGroup}
          setAuthMode={setAuthMode}
          setError={setError}
          setSuccess={setSuccess}
        />
        <div className="sm:mx-auto sm:w-full sm:max-w-md mt-8 px-4">
          {error && <Notification message={error} type="error" />}
          {success && <Notification message={success} type="success" />}
          <AuthCard
            title={authMode === 'signup' ? 'Create Account' : 'Sign In'}
            subtitle={authMode === 'signup' ? 'Join Nigeria\'s premium earning platform' : 'Access your TaskPay account'}
          >
            {authMode === 'signup' ? (
              <SignupForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                password={password}
                setPassword={setPassword}
                referralCode={referralCode}
                setReferralCode={setReferralCode}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onSignup={handleSignup}
                loading={loading}
                error={error}
                setAuthMode={setAuthMode}
                setError={setError}
                setSuccess={setSuccess}
              />
            ) : (
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                onLogin={handleLogin}
                loading={loading}
                error={error}
                setAuthMode={setAuthMode}
                setError={setError}
                setSuccess={setSuccess}
              />
            )}
          </AuthCard>
          <div className="mt-8 text-center">
            <div className="text-sm text-gray-400">
              By continuing, you agree to our{' '}
              <a href="#" className="font-medium text-teal-400 hover:text-teal-300">Terms of Service</a>
              {' and '}
              <a href="#" className="font-medium text-teal-400 hover:text-teal-300">Privacy Policy</a>
            </div>
          </div>
        </div>
        <AiChatButton />
      </div>
    );
  }

  if (session?.role === 'admin') {
    const activeUsers = users.filter(u => u.role === 'user');
    const premiumUsers = activeUsers.filter(u => u.premium).length;
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
    const totalPlatformValue = users.reduce((sum, u) => sum + (u.balance || 0), 0);
    const todayEarnings = payments
      .filter(p => p.status === 'approved' && new Date(p.date).toDateString() === new Date().toDateString())
      .reduce((sum, p) => sum + p.amount, 0);

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Header
          session={session}
          handleLogout={handleLogout}
          joinWhatsAppGroup={joinWhatsAppGroup}
          setAuthMode={setAuthMode}
          setError={setError}
          setSuccess={setSuccess}
        />
        {error && <Notification message={error} type="error" />}
        {success && <Notification message={success} type="success" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard
              title="Total Users"
              value={activeUsers.length}
              icon={Users}
              color="bg-gradient-to-br from-teal-700 to-teal-800"
            />
            <StatCard
              title="Premium Users"
              value={premiumUsers}
              icon={Award}
              color="bg-gradient-to-br from-amber-700 to-amber-800"
            />
            <StatCard
              title="Pending Reviews"
              value={pendingPayments.length + pendingWithdrawals.length}
              icon={FileText}
              color="bg-gradient-to-br from-yellow-700 to-yellow-800"
            />
            <StatCard
              title="Platform Value"
              value={formatNaira(totalPlatformValue)}
              icon={Wallet}
              color="bg-gradient-to-br from-teal-700 to-emerald-800"
            />
          </div>

          <LiveFeed users={users} transactions={allTransactions} />

          <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 overflow-hidden mt-6">
            <div className="border-b border-gray-700">
              <nav className="flex space-x-4 px-4" aria-label="Tabs">
                {[
                  { id: 'overview', name: 'Overview', icon: BarChart2 },
                  { id: 'users', name: 'Users', icon: Users },
                  { id: 'payments', name: 'Payments', icon: CreditCard },
                  { id: 'withdrawals', name: 'Withdrawals', icon: Banknote },
                  { id: 'tasks', name: 'Tasks', icon: FileSpreadsheet }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    className={`group inline-flex items-center px-3 py-3 border-b-2 font-medium text-sm ${
                      adminTab === tab.id
                        ? 'border-teal-500 text-teal-300'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600'
                    }`}
                  >
                    <tab.icon
                      className={`mr-2 h-5 w-5 ${
                        adminTab === tab.id ? 'text-teal-400' : 'text-gray-500 group-hover:text-gray-400'
                      }`}
                      aria-hidden="true"
                    />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
            <div className="p-6">
              {adminTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center">
                        <TrendingUp className="h-5 w-5 text-teal-400 mr-2" />
                        Daily Performance
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">New Users</span>
                          <span className="font-medium">{activeUsers.filter(u => {
                            const joinDate = new Date(u.joined);
                            return joinDate.toDateString() === new Date().toDateString();
                          }).length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Premium Upgrades</span>
                          <span className="font-medium">{premiumUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payments Processed</span>
                          <span className="font-medium text-teal-400">+{formatNaira(todayEarnings)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Withdrawals Approved</span>
                          <span className="font-medium text-red-400">-{formatNaira(withdrawals.filter(w =>
                            w.status === 'approved' &&
                            new Date(w.date).toDateString() === new Date().toDateString()
                          ).reduce((sum, w) => sum + w.amount, 0))}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center">
                        <AlertCircle className="h-5 w-5 text-yellow-400 mr-2" />
                        Pending Actions
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Payment Reviews</span>
                          <span className={`font-medium ${
                            pendingPayments.length > 0 ? 'text-yellow-400' : 'text-teal-400'
                          }`}>
                            {pendingPayments.length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Withdrawal Reviews</span>
                          <span className={`font-medium ${
                            pendingWithdrawals.length > 0 ? 'text-yellow-400' : 'text-teal-400'
                          }`}>
                            {pendingWithdrawals.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-100 mb-4">Recent Activity</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-800">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Action</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                          {[...payments, ...withdrawals]
                            .sort((a, b) => new Date(b.date) - new Date(a.date))
                            .slice(0, 5)
                            .map((item) => (
                              <tr key={item.id} className="hover:bg-gray-750">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-teal-900/30 flex items-center justify-center">
                                      <span className="text-teal-300 font-medium text-sm">{item.userName.charAt(0)}</span>
                                    </div>
                                    <div className="ml-3">
                                      <div className="font-medium text-gray-200">{item.userName}</div>
                                      <div className="text-xs text-gray-500">{item.userId}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                    item.status === 'approved'
                                      ? 'bg-teal-900/30 text-teal-300'
                                      : item.status === 'rejected'
                                        ? 'bg-red-900/30 text-red-300'
                                        : 'bg-yellow-900/30 text-yellow-300'
                                  }`}>
                                    {item.purpose || (item.amount ? 'Withdrawal' : 'Payment')}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                                  {item.amount ? formatNaira(item.amount) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {getElapsedTime(item.date)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                    item.status === 'approved'
                                      ? 'bg-teal-900/30 text-teal-300'
                                      : item.status === 'rejected'
                                        ? 'bg-red-900/30 text-red-300'
                                        : 'bg-yellow-900/30 text-yellow-300'
                                  }`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {adminTab === 'users' && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Referrals</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {activeUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-gray-750">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-teal-900/30 flex items-center justify-center">
                                <span className="text-teal-300 font-medium">{u.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="font-medium text-gray-200">{u.name}</div>
                                <div className="text-sm text-gray-500">{u.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{u.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{formatDate(u.joined)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{formatNaira(u.balance)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {u.referrals?.length || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                              u.premium
                                ? 'bg-teal-900/30 text-teal-300'
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {u.premium ? 'Premium' : 'Free'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => {
                                const updatedUsers = users.map(user =>
                                  user.id === u.id ? {...user, premium: !user.premium} : user
                                );
                                setUsers(updatedUsers);
                              }}
                              className={`px-3 py-1 rounded-md text-xs font-medium ${
                                u.premium
                                  ? 'bg-red-900/30 text-red-300 hover:bg-red-800/40'
                                  : 'bg-teal-900/30 text-teal-300 hover:bg-teal-800/40'
                              }`}
                            >
                              {u.premium ? 'Deactivate' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {adminTab === 'payments' && (
                <div className="space-y-4">
                  {payments.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="h-12 w-12 text-gray-600 mx-auto" />
                      <h3 className="mt-2 text-sm font-medium text-gray-200">No payments found</h3>
                      <p className="mt-1 text-sm text-gray-500">Payments will appear here when users submit payment proofs.</p>
                    </div>
                  ) : (
                    payments.map((p) => (
                      <div
                        key={p.id}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          p.status === 'pending' ? 'border-yellow-800 bg-yellow-900/10' :
                          p.status === 'approved' ? 'border-teal-800 bg-teal-900/10' : 'border-red-800 bg-red-900/10'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="mb-3 md:mb-0">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-teal-900/30 flex items-center justify-center mr-3">
                                <span className="text-teal-300 font-medium text-sm">{p.userName.charAt(0)}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-200">{p.userName}</h3>
                                <p className="text-sm text-gray-500">{p.email || 'user@example.com'}</p>
                              </div>
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Amount:</span> {formatNaira(p.amount)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Purpose:</span> {p.purpose}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Submitted: {formatDate(p.date)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              p.status === 'approved'
                                ? 'bg-teal-900/30 text-teal-300'
                                : p.status === 'rejected'
                                  ? 'bg-red-900/30 text-red-300'
                                  : 'bg-yellow-900/30 text-yellow-300'
                            }`}>
                              {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                            </span>
                            {p.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApprovePayment(p.id)}
                                  className="p-1.5 text-teal-400 hover:bg-teal-800/40 rounded-full transition-colors"
                                  title="Approve payment"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setPayments(prev => prev.map(payment =>
                                      payment.id === p.id ? {...payment, status: 'rejected'} : payment
                                    ));
                                    setSuccess(`Payment rejected for ${p.userName}`);
                                  }}
                                  className="p-1.5 text-red-400 hover:bg-red-800/40 rounded-full transition-colors"
                                  title="Reject payment"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                            <button
                              onClick={() => window.open(p.proof, '_blank')}
                              className="text-xs text-teal-400 hover:text-teal-300 flex items-center"
                            >
                              <Image className="h-3 w-3 mr-1" />
                              View Proof
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {adminTab === 'withdrawals' && (
                <div className="space-y-4">
                  {withdrawals.length === 0 ? (
                    <div className="text-center py-12">
                      <Banknote className="h-12 w-12 text-gray-600 mx-auto" />
                      <h3 className="mt-2 text-sm font-medium text-gray-200">No withdrawals found</h3>
                      <p className="mt-1 text-sm text-gray-500">Withdrawal requests will appear here when users request withdrawals.</p>
                    </div>
                  ) : (
                    withdrawals.map((w) => (
                      <div
                        key={w.id}
                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                          w.status === 'pending' ? 'border-yellow-800 bg-yellow-900/10' :
                          w.status === 'approved' ? 'border-teal-800 bg-teal-900/10' : 'border-red-800 bg-red-900/10'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                          <div className="mb-3 md:mb-0">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-teal-900/30 flex items-center justify-center mr-3">
                                <span className="text-teal-300 font-medium text-sm">{w.userName.charAt(0)}</span>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-200">{w.userName}</h3>
                                <p className="text-sm text-gray-500">{w.bank} •••• {w.accountNumber.slice(-4)}</p>
                              </div>
                            </div>
                            <p className="text-sm mt-2">
                              <span className="font-medium">Amount:</span> {formatNaira(w.amount)}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Account:</span> {w.accountName}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Requested: {formatDate(w.date)}
                            </p>
                          </div>
                          <div className="flex flex-col items-end space-y-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              w.status === 'approved'
                                ? 'bg-teal-900/30 text-teal-300'
                                : w.status === 'rejected'
                                  ? 'bg-red-900/30 text-red-300'
                                  : 'bg-yellow-900/30 text-yellow-300'
                            }`}>
                              {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                            </span>
                            {w.status === 'pending' && (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleApproveWithdrawal(w.id)}
                                  className="p-1.5 text-teal-400 hover:bg-teal-800/40 rounded-full transition-colors"
                                  title="Approve withdrawal"
                                >
                                  <CheckCircle className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => {
                                    setWithdrawals(prev => prev.map(withdrawal =>
                                      withdrawal.id === w.id ? {...withdrawal, status: 'rejected'} : withdrawal
                                    ));
                                    setSuccess(`Withdrawal rejected for ${w.userName}`);
                                  }}
                                  className="p-1.5 text-red-400 hover:bg-red-800/40 rounded-full transition-colors"
                                  title="Reject withdrawal"
                                >
                                  <XCircle className="h-5 w-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              {adminTab === 'tasks' && (
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-lg font-medium text-gray-100 mb-3 flex items-center">
                      <Play className="h-5 w-5 text-blue-400 mr-2" />
                      Advertisement Management
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Manage advertisement campaigns and view performance metrics.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {mockAds.map((ad) => (
                        <div key={ad.id} className="border border-gray-700 rounded-lg p-3 hover:shadow-sm transition-shadow bg-gray-800">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-200">{ad.title}</h4>
                              <p className="text-xs text-gray-500">{ad.category} • {ad.duration}s</p>
                            </div>
                            <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                              ₦{ad.reward}
                            </span>
                          </div>
                          <div className="mt-2 flex justify-between text-xs text-gray-500">
                            <span>Views: 142</span>
                            <span>CTR: 3.2%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <AiChatButton />
      </div>
    );
  }

  if (session?.role === 'user') {
    const user = users.find(u => u.id === session.id);
    if (!user) return <div className="min-h-screen flex items-center justify-center bg-gray-900">User not found</div>;
    const transactions = user.transactions || [];
    const today = new Date().toISOString().split('T')[0];
    const todayEarnings = transactions
      .filter(t => t.date.startsWith(today) && t.type === 'task' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);
    const adsWatchedToday = user.adsHistory?.filter(a => a.date.startsWith(today)).length || 0;
    const adsLeft = 5 - adsWatchedToday;
    const canCheckInToday = canCheckIn(user);

    return (
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <Header
          session={session}
          handleLogout={handleLogout}
          joinWhatsAppGroup={joinWhatsAppGroup}
          setAuthMode={setAuthMode}
          setError={setError}
          setSuccess={setSuccess}
        />
        {error && <Notification message={error} type="error" />}
        {success && <Notification message={success} type="success" />}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <StatCard
              title="Wallet Balance"
              value={formatNaira(user.balance)}
              icon={Wallet}
              color="bg-gradient-to-br from-teal-700 to-emerald-800"
            />
            <StatCard
              title="Membership"
              value={user.premium ? 'Premium' : 'Free'}
              icon={Crown}
              color={user.premium ? 'bg-gradient-to-br from-amber-700 to-amber-800' : 'bg-gradient-to-br from-gray-700 to-gray-800'}
            />
            <StatCard
              title="Today's Earnings"
              value={formatNaira(todayEarnings)}
              icon={TrendingUp}
              color="bg-gradient-to-br from-teal-700 to-teal-800"
            />
          </div>

          <LiveFeed users={users} transactions={allTransactions} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 space-y-6">
              {user.referralBonus > 0 && (
                <div className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-800/40 rounded-xl p-4 mb-4">
                  <div className="flex items-start">
                    <div className="h-8 w-8 rounded-full bg-purple-900/30 flex items-center justify-center mr-3 mt-1">
                      <Gift className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-100">Welcome Bonus!</p>
                      <p className="text-sm text-purple-400 mt-1">
                        You received ₦{user.referralBonus} as a referral welcome bonus. Thank {users.find(u => u.id === user.referredBy)?.name} for sharing TaskPay with you!
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-100 flex items-center">
                    <Play className="h-5 w-5 text-teal-400 mr-2" />
                    Available Tasks
                  </h2>
                  {!user.premium && (
                    <span className="px-3 py-1 bg-amber-900/30 text-amber-300 text-sm font-medium rounded-full">
                      Upgrade to Premium
                    </span>
                  )}
                </div>
                {!user.premium ? (
                  <div className="text-center py-10">
                    <div className="bg-gradient-to-r from-teal-900/20 to-teal-800/20 rounded-xl p-6 border-2 border-dashed border-teal-700">
                      <Award className="h-12 w-12 text-teal-400 mx-auto mb-4" />
                      <h3 className="text-lg font-bold text-gray-100 mb-2">Unlock Premium Earning Tasks</h3>
                      <p className="text-gray-400 mb-4">
                        Pay a one-time fee of ₦18,000 to access all earning tasks and start making money today.
                      </p>
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-600 to-emerald-700 hover:opacity-90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        canCheckInToday
                          ? 'border-teal-700 hover:border-teal-500 bg-teal-900/10'
                          : 'border-gray-700 opacity-80 cursor-not-allowed'
                      }`}
                      onClick={canCheckInToday ? () => setShowTaskModal('checkin') : undefined}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-10 w-10 rounded-full bg-teal-900/30 flex items-center justify-center">
                            <Clock className="h-5 w-5 text-teal-400" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-100">Daily Check-In</h3>
                              <p className="text-gray-400 mt-1 text-sm">Confirm your daily presence to earn ₦100. Available once every 24 hours.</p>
                            </div>
                            <span className="bg-teal-900/30 text-teal-300 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                              ₦100
                            </span>
                          </div>
                          {!canCheckInToday && (
                            <p className="text-xs text-yellow-400 mt-2 flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Next check-in available tomorrow
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        adsLeft > 0
                          ? 'border-blue-700 hover:border-blue-500 bg-blue-900/10'
                          : 'border-gray-700 opacity-80 cursor-not-allowed'
                      }`}
                      onClick={adsLeft > 0 ? () => setShowTaskModal('ad') : undefined}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <div className="h-10 w-10 rounded-full bg-blue-900/30 flex items-center justify-center">
                            <Play className="h-5 w-5 text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-gray-100">Watch Advertisement</h3>
                              <p className="text-gray-400 mt-1 text-sm">Watch brand advertisements to earn ₦100 per ad. Maximum 5 ads per day.</p>
                            </div>
                            <span className="bg-blue-900/30 text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded whitespace-nowrap">
                              ₦100
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Ads watched today: {adsWatchedToday}/5</span>
                              <span>{adsLeft} left</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${(adsWatchedToday / 5) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          {adsLeft === 0 && (
                            <p className="text-xs text-yellow-400 mt-2 flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Daily limit reached. Return tomorrow to earn more.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-100 flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    Transaction History
                  </h2>
                  {transactions.length > 5 && (
                    <button className="text-sm text-teal-400 hover:text-teal-300 font-medium">
                      View all
                    </button>
                  )}
                </div>
                {transactions.length === 0 ? (
                  <div className="text-center py-10">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto" />
                    <h3 className="mt-2 text-sm font-medium text-gray-200">No transactions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Your transactions will appear here after completing tasks or making payments.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                      <thead>
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {transactions.slice(0, 5).map((txn) => (
                          <tr key={txn.id} className="hover:bg-gray-750">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-200">{txn.description}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-medium rounded-full ${
                                txn.status === 'completed' || txn.status === 'approved'
                                  ? 'bg-teal-900/30 text-teal-300'
                                  : txn.status === 'rejected'
                                    ? 'bg-red-900/30 text-red-300'
                                    : 'bg-yellow-900/30 text-yellow-300'
                              }`}>
                                {txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                              {txn.type === 'withdrawal' ? '-' : ''}{formatNaira(txn.amount)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {getElapsedTime(txn.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <ReferralCard user={user} users={users} />
              <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-5">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                  <Plus className="h-5 w-5 text-teal-400 mr-2" />
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    disabled={user.premium}
                    className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                      user.premium
                        ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-teal-900/20 text-teal-300 border-teal-700 hover:bg-teal-800/30'
                    }`}
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    Add Funds
                  </button>
                  <button
                    onClick={() => setShowWithdrawalModal(true)}
                    disabled={user.balance < 5000 || !user.premium}
                    className={`w-full flex items-center justify-center px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                      user.balance < 5000 || !user.premium
                        ? 'bg-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-red-900/20 text-red-300 border-red-700 hover:bg-red-800/30'
                    }`}
                  >
                    <Minus className="h-5 w-5 mr-2" />
                    Withdraw Earnings
                  </button>
                  <button
                    onClick={joinWhatsAppGroup}
                    className="w-full flex items-center justify-center px-4 py-3 bg-teal-900/20 text-teal-300 border border-teal-700 rounded-lg text-sm font-medium hover:bg-teal-800/30 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Join WhatsApp Group
                  </button>
                  <button
                    onClick={joinWhatsAppSupport}
                    className="w-full flex items-center justify-center px-4 py-3 bg-green-900/20 text-green-300 border border-green-700 rounded-lg text-sm font-medium hover:bg-green-800/30 transition-colors"
                  >
                    <PhoneCall className="h-5 w-5 mr-2" />
                    WhatsApp Support
                  </button>
                  <div className="border-t border-gray-700 pt-4 mt-4">
                    <p className="text-sm font-medium text-gray-100 mb-2 flex items-center">
                      <Banknote className="h-4 w-4 text-blue-400 mr-1" />
                      Payment Details
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Account Name:</span>
                        <span className="font-medium">Aignwa Eugene Ekeoha</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Account Number:</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-2">8034848106</span>
                          <button
                            onClick={copyAccountDetails}
                            className="p-1 text-gray-500 hover:text-teal-400 transition-colors"
                            title={copiedAccount ? "Copied!" : "Copy account number"}
                          >
                            {copiedAccount ? (
                              <CopyCheck className="h-4 w-4 text-teal-400" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bank:</span>
                        <span className="font-medium">Moniepoint Bank</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-5">
                <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center">
                  <BarChart2 className="h-5 w-5 text-purple-400 mr-2" />
                  Today's Progress
                </h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Daily Check-In</span>
                      <span className="text-sm text-gray-500">
                        {canCheckInToday ? 'Available now' : 'Completed today'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          canCheckInToday ? 'bg-teal-500' : 'bg-gray-500'
                        }`}
                        style={{ width: canCheckInToday ? '0%' : '100%' }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Ads Watched</span>
                      <span className="text-sm text-gray-500">{adsWatchedToday}/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-blue-500"
                        style={{ width: `${(adsWatchedToday / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-300">Earnings Progress</span>
                      <span className="text-sm text-gray-500">{formatNaira(todayEarnings)}/₦600</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-purple-500"
                        style={{ width: `${Math.min((todayEarnings / 600) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Max daily earnings: ₦600 (₦100 check-in + ₦500 from 5 ads)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Task Modals */}
        {showTaskModal === 'checkin' && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-teal-400 mr-2" />
                <h3 className="text-lg font-bold text-gray-100">Daily Check-In</h3>
              </div>
              <div className="mb-6 text-center">
                <div className="inline-block bg-teal-900/20 rounded-full p-3 mb-4">
                  <Trophy className="h-8 w-8 text-teal-400" />
                </div>
                <h4 className="text-xl font-bold text-gray-100 mb-2">Claim Your Daily Reward</h4>
                <p className="text-gray-400">
                  Confirm your presence today to earn ₦100. This can only be done once every 24 hours.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowTaskModal(null)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCompleteCheckIn}
                  className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors flex items-center"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Claim ₦100
                </button>
              </div>
            </div>
          </div>
        )}
        {showTaskModal === 'ad' && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <Play className="h-6 w-6 text-blue-400 mr-2" />
                <h3 className="text-lg font-bold text-gray-100">Watch Advertisement</h3>
              </div>
              {adsLeft > 0 ? (
                <>
                  <p className="text-gray-400 mb-4">
                    Watch a 30-second advertisement to earn ₦100. You have {adsLeft} ad{adsLeft > 1 ? 's' : ''} remaining today.
                  </p>
                  <div className="space-y-3 mb-6 max-h-80 overflow-y-auto pr-2">
                    {mockAds.map((ad) => (
                      <button
                        key={ad.id}
                        onClick={() => {
                          setSelectedAd(ad.id);
                          handleWatchAd(ad.id);
                        }}
                        className={`w-full text-left p-3 border rounded-lg transition-colors ${
                          selectedAd === ad.id
                            ? 'border-blue-500 bg-blue-900/20'
                            : 'border-gray-700 hover:border-blue-600'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-200">{ad.title}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{ad.category} • {ad.duration}s</p>
                          </div>
                          <span className="bg-blue-900/30 text-blue-300 text-xs font-medium px-2 py-0.5 rounded">
                            ₦{ad.reward}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto" />
                  <p className="mt-2 text-gray-400 font-medium">
                    Daily Limit Reached
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    You've watched the maximum of 5 ads today. Return tomorrow to earn more.
                  </p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  onClick={() => setShowTaskModal(null)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <Upload className="h-6 w-6 text-teal-400 mr-2" />
                <h3 className="text-lg font-bold text-gray-100">Add Funds</h3>
              </div>
              <div className="mb-6">
                <p className="text-gray-400 mb-4">
                  Transfer ₦18,000 to upgrade to premium access and unlock all earning tasks. After payment, submit proof for admin approval.
                </p>
                <div className="bg-gray-700 rounded-lg p-4 mb-4 border border-gray-600">
                  <p className="font-medium text-gray-100 mb-2 flex items-center">
                    <Banknote className="h-4 w-4 text-blue-400 mr-2" />
                    Payment Details
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Name:</span>
                      <span className="font-medium">Aignwa Eugene Ekeoha</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Account Number:</span>
                      <div className="flex items-center">
                        <span className="font-medium mr-2">8034848106</span>
                        <button
                          onClick={copyAccountDetails}
                          className="p-1 text-gray-500 hover:text-teal-400 transition-colors"
                          title={copiedAccount ? "Copied!" : "Copy account number"}
                        >
                          {copiedAccount ? (
                            <CopyCheck className="h-4 w-4 text-teal-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bank:</span>
                      <span className="font-medium">Moniepoint Bank</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-4">
                  ⚠️ Important: After making payment, upload a clear screenshot of the transaction confirmation. Admin will review within 24 hours.
                </p>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Payment Proof (Screenshot)
                </label>
                <div
                  className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors"
                  onClick={() => document.getElementById('payment-proof').click()}
                >
                  <input
                    id="payment-proof"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setPaymentProof(e.target.files[0]);
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                  {paymentProof ? (
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-teal-900/20 flex items-center justify-center mb-2">
                        <Image className="h-8 w-8 text-teal-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-200">{fileName}</p>
                      <p className="text-xs text-teal-400 mt-1">Click to change</p>
                    </div>
                  ) : (
                    <div className="text-gray-500">
                      <Upload className="h-8 w-8 mx-auto mb-2" />
                      <p className="mt-2 text-sm">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentProof(null);
                    setFileName('');
                  }}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPayment}
                  disabled={!paymentProof}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    paymentProof
                      ? 'bg-teal-700 text-white hover:bg-teal-800'
                      : 'bg-gray-600 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Submit Payment Proof
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Withdrawal Modal */}
        {showWithdrawalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-xl border border-gray-700">
              <div className="flex items-center mb-4">
                <Minus className="h-6 w-6 text-red-400 mr-2" />
                <h3 className="text-lg font-bold text-gray-100">Withdraw Earnings</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Request a bank transfer for your earnings. Minimum withdrawal amount is ₦5,000. Your request will be manually reviewed by admin within 24 hours.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Amount (₦)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">₦</span>
                  </div>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => {
                      const value = Math.max(5000, parseInt(e.target.value) || 5000);
                      setWithdrawalAmount(value);
                    }}
                    min="5000"
                    className="appearance-none block w-full pl-7 pr-3 py-2 bg-gray-700 border border-gray-600 rounded-lg shadow-sm placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="5000"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum withdrawal: ₦5,000 • Maximum: ₦{user.balance.toLocaleString()}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={user.name}
                    disabled
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      placeholder="0123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Bank
                    </label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                    >
                      <option>Moniepoint</option>
                      <option>Zenith Bank</option>
                      <option>First Bank</option>
                      <option>GTBank</option>
                      <option>Access Bank</option>
                      <option>UBA</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-900/20 border-l-4 border-yellow-600 p-3 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-300">
                      After approval, funds will be transferred to your account within 24-48 business hours.
                      A processing fee of ₦50 may apply.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="px-4 py-2 text-gray-300 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestWithdrawal}
                  disabled={withdrawalAmount > user.balance}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    withdrawalAmount > user.balance
                      ? 'bg-gray-600 text-gray-500 cursor-not-allowed'
                      : 'bg-red-700 text-white hover:bg-red-800'
                  }`}
                >
                  Request Withdrawal
                </button>
              </div>
            </div>
          </div>
        )}
        {showReferralSuccess && (
          <div className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-700 to-pink-800 text-white rounded-xl shadow-lg p-4 max-w-xs animate-fade-in-up">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3">
                <Gift className="h-4 w-4 text-purple-300" />
              </div>
              <div>
                <p className="font-medium">Referral Bonus!</p>
                <p className="text-sm opacity-90">₦500 has been added to your wallet</p>
              </div>
            </div>
          </div>
        )}
        <AiChatButton />
      </div>
    );
  }

  // Landing page
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header
        session={session}
        handleLogout={handleLogout}
        joinWhatsAppGroup={joinWhatsAppGroup}
        setAuthMode={setAuthMode}
        setError={setError}
        setSuccess={setSuccess}
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg p-2 mb-6">
            <Zap className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-100 sm:text-5xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-300">
            Earn Real Money with Simple Tasks
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Nigeria's premium task-based earning platform. Complete daily tasks and get paid in Naira.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={joinWhatsAppGroup}
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium shadow-lg transition-colors"
            >
              <MessageSquare className="h-5 w-5 mr-2" />
              Join WhatsApp Group
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 hover:opacity-90 text-white rounded-lg font-medium shadow-lg transition-colors"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Create Account
            </button>
          </div>
        </div>

        <LiveFeed users={users} transactions={allTransactions} className="mb-16" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Daily Check-Ins",
              description: "Earn ₦100 every day just by confirming your presence on the platform.",
              icon: Clock,
              color: "from-teal-700 to-emerald-800"
            },
            {
              title: "Watch Advertisements",
              description: "Watch short brand ads and earn ₦100 per ad. Up to 5 ads daily.",
              icon: Play,
              color: "from-blue-700 to-blue-800"
            },
            {
              title: "Instant Payments",
              description: "Withdraw your earnings to your Nigerian bank account with manual approval.",
              icon: Banknote,
              color: "from-purple-700 to-purple-800"
            },
            {
              title: "Referral Bonuses",
              description: "Earn ₦500 for every friend who upgrades to premium after signing up.",
              icon: UserPlus,
              color: "from-amber-700 to-amber-800"
            },
            {
              title: "Premium Access",
              description: "One-time ₦18,000 fee unlocks all earning tasks forever.",
              icon: Crown,
              color: "from-yellow-700 to-yellow-800"
            },
            {
              title: "24/7 Support",
              description: "Get help anytime via WhatsApp or our AI chat assistant.",
              icon: MessageCircle,
              color: "from-green-700 to-green-800"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700 hover:shadow-lg transition-shadow">
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-teal-900/20 to-emerald-900/20 rounded-2xl p-8 border border-teal-800/40 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0 md:pr-6">
              <h2 className="text-2xl font-bold text-gray-100 mb-3">Start Earning Today</h2>
              <p className="text-gray-300 mb-4">
                Join thousands of Nigerians already earning with TaskPay. No skills required — just your time and attention.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>One-time premium fee: ₦18,000</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Potential daily earnings: ₦600+</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Minimum withdrawal: ₦5,000</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-teal-700 to-emerald-800 rounded-xl p-1">
                  <div className="bg-gray-900 rounded-xl p-6 min-w-[280px]">
                    <div className="text-center">
                      <div className="h-16 w-16 rounded-full bg-teal-900/30 flex items-center justify-center mx-auto mb-4">
                        <Award className="h-8 w-8 text-teal-400" />
                      </div>
                      <p className="text-lg font-bold text-gray-100">Premium Access</p>
                      <p className="text-3xl font-bold text-teal-400 mb-4">₦18,000</p>
                      <button
                        onClick={() => setAuthMode('signup')}
                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-2.5 rounded-lg font-medium"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 bg-amber-500 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                  BEST VALUE
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} TaskPay. All rights reserved.</p>
            <p className="mt-2">
              <a href="#" className="text-teal-400 hover:text-teal-300 mx-2">Terms</a> •
              <a href="#" className="text-teal-400 hover:text-teal-300 mx-2">Privacy</a> •
              <a href="#" className="text-teal-400 hover:text-teal-300 mx-2">Contact</a>
            </p>
          </div>
        </div>
      </footer>
      <AiChatButton />
    </div>
  );
}
