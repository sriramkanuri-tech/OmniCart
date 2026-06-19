import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, ShieldCheck, AlertCircle, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

const EmailDiagnostics: React.FC = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/email/status');
      const data = await response.json();
      setStatus(data);
    } catch (err) {
      console.error("Failed to fetch SMTP status", err);
      setStatus({ status: 'ERROR', error: 'Could not connect to health endpoint' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTest = async () => {
    if (!testEmail) return;
    setTestLoading(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await response.json();
      setTestResult(data);
    } catch (err) {
      setTestResult({ success: false, message: 'Request failed. See console.' });
    } finally {
      setTestLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
            <Mail className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Email System Diagnostics</h1>
            <p className="text-white/40 text-sm">Monitor and test your SMTP configuration</p>
          </div>
        </div>
        <button 
          onClick={checkStatus}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/10 text-white/70 text-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </button>
      </div>

      {/* SMTP Health Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">SMTP Server Health</h2>
        </div>

        {loading ? (
          <div className="h-24 flex items-center justify-center">
            <RefreshCw className="w-8 h-8 text-white/20 animate-spin" />
          </div>
        ) : status ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-2xl flex items-center gap-4 ${status.status === 'CONNECTED' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
              {status.status === 'CONNECTED' ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className="text-sm font-medium text-white/90">
                  Status: <span className={status.status === 'CONNECTED' ? 'text-emerald-400' : 'text-red-400'}>{status.status}</span>
                </p>
                {status.error && <p className="text-xs text-red-400/80 mt-1">{status.error}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Host</p>
                <p className="text-white/80 font-mono">smtp.gmail.com</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-white/30 text-xs uppercase tracking-wider mb-1">Port / Secure</p>
                <p className="text-white/80 font-mono">465 / SSL (True)</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-white/40 text-center py-8">Click refresh to check status</p>
        )}
      </motion.div>

      {/* Manual Test Tool */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl"
      >
        <div className="flex items-center gap-2 mb-6">
          <Send className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-semibold text-white">Trigger Manual Test</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-white/40">Enter an email address to receive a sample order confirmation.</p>
          <div className="flex gap-3">
            <input 
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="e.g. sriramkanuri4@gmail.com"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button 
              onClick={handleSendTest}
              disabled={testLoading || !testEmail}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {testLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Send Test
            </button>
          </div>

          {testResult && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-2xl flex items-center gap-3 ${testResult.success ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}
            >
              {testResult.success ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              <p className="text-sm">{testResult.message || (testResult.success ? 'Test email sent successfully!' : 'Failed to send test email.')}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Troubleshooting Guide */}
      <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl space-y-3">
        <h3 className="text-amber-400 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          Common Authentication Fixes
        </h3>
        <ul className="text-xs text-amber-200/60 list-disc list-inside space-y-1">
          <li>Ensure <strong>2-Step Verification</strong> is enabled on your Gmail account.</li>
          <li>Use a <strong>16-character App Password</strong>, not your primary password.</li>
          <li>Double-check if <strong>EMAIL_USER</strong> matches the Gmail address exactly.</li>
          <li>Verify your <strong>EMAIL_PASS</strong> in the account's "App Passwords" section.</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailDiagnostics;
