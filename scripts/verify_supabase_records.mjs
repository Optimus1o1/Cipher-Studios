import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zoqxmdqcrrrnzzylesny.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_SECRET_KEY) {
  console.error('Error: SUPABASE_SECRET_KEY must be provided via environment variable.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);

async function checkSubmissions() {
  console.log('--- Verifying Supabase Database Persistence ---');

  // 1. Check contact_submissions
  const { data: contacts, error: contactErr } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (contactErr) {
    console.error('Error fetching contact_submissions:', contactErr);
  } else {
    console.log(`Found ${contacts.length} contact submission(s):`);
    for (const c of contacts) {
      console.log({
        id: c.id,
        name: c.name,
        email: c.email,
        service: c.service,
        status: c.status,
        ip_hash: c.ip_hash,
        created_at: c.created_at,
        message: c.message?.slice(0, 50) + '...'
      });
    }
  }

  // 2. Check review_submissions
  const { data: reviews, error: reviewErr } = await supabase
    .from('review_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (reviewErr) {
    console.error('Error fetching review_submissions:', reviewErr);
  } else {
    console.log(`\nFound ${reviews.length} review submission(s):`);
    for (const r of reviews) {
      console.log({
        id: r.id,
        name: r.name,
        email: r.email,
        website: r.website,
        goal: r.goal,
        budget: r.budget,
        status: r.status,
        ip_hash: r.ip_hash,
        created_at: r.created_at,
        message: r.message?.slice(0, 50) + '...'
      });
    }
  }
}

checkSubmissions().catch(console.error);
