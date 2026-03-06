// Dentravo Employer Portal - Shared Auth Utilities

let _sb = null;
let _session = null;
let _employer = null;

function getSb() {
    if (!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _sb;
}

async function requireAuth() {
    const sb = getSb();
    const { data: { session } } = await sb.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    _session = session;

    const { data: employer, error } = await sb.from('employer_accounts')
        .select('*')
        .eq('admin_user_id', session.user.id)
        .eq('is_active', true)
        .single();

    if (error || !employer) {
        await sb.auth.signOut();
        window.location.href = 'login.html';
        return null;
    }
    _employer = employer;
    return { session, employer };
}

async function signOut() {
    await getSb().auth.signOut();
    window.location.href = 'login.html';
}

function formatDate(dateStr) {
    if (!dateStr) return '--';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
