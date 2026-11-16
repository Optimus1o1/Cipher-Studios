import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

// Read .env.local if present
let supabaseUrl = process.env.SUPABASE_URL || 'https://zoqxmdqcrrrnzzylesny.supabase.co';
let supabaseKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseKey && fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('SUPABASE_SECRET_KEY=')) {
      supabaseKey = trimmed.replace('SUPABASE_SECRET_KEY=', '').trim().replace(/^["']|["']$/g, '');
    }
    if (trimmed.startsWith('SUPABASE_URL=')) {
      supabaseUrl = trimmed.replace('SUPABASE_URL=', '').trim().replace(/^["']|["']$/g, '');
    }
  }
}

if (!supabaseKey) {
  console.log('NOTICE: SUPABASE_SECRET_KEY not available locally. Cannot inspect database records directly.');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectRecords() {
  console.log('=== Supabase Staging Records Audit (READ-ONLY) ===\n');

  // 1. Inspect contact_submissions
  const { data: contacts, error: contactErr } = await supabase
    .from('contact_submissions')
    .select('id, name, email, service, status, created_at')
    .order('created_at', { ascending: false });

  if (contactErr) {
    console.error('Error reading contact_submissions:', contactErr);
  } else {
    console.log(`Found ${contacts.length} record(s) in public.contact_submissions:`);
    contacts.forEach((c, idx) => {
      const isTest = c.email.includes('test') || c.name.toLowerCase().includes('test') || c.email.includes('example.com') || c.email.includes('moonsanctumlabs.design');
      console.log(`  [${idx + 1}] ID: ${c.id} | Name: ${c.name} | Email: ${c.email} | Service: ${c.service || 'N/A'} | Status: ${c.status} | Created: ${c.created_at} | [${isTest ? 'TEST RECORD' : 'GENUINE RECORD'}]`);
    });
  }

  // 2. Inspect review_submissions
  const { data: reviews, error: reviewErr } = await supabase
    .from('review_submissions')
    .select('id, name, email, website, goal, budget, status, created_at')
    .order('created_at', { ascending: false });

  if (reviewErr) {
    console.error('Error reading review_submissions:', reviewErr);
  } else {
    console.log(`\nFound ${reviews.length} record(s) in public.review_submissions:`);
    reviews.forEach((r, idx) => {
      const isTest = r.email.includes('test') || r.name.toLowerCase().includes('test') || r.email.includes('example.com') || r.email.includes('moonsanctumlabs.design');
      console.log(`  [${idx + 1}] ID: ${r.id} | Name: ${r.name} | Email: ${r.email} | Website: ${r.website || 'N/A'} | Goal: ${r.goal} | Status: ${r.status} | Created: ${r.created_at} | [${isTest ? 'TEST RECORD' : 'GENUINE RECORD'}]`);
    });
  }

  console.log('\nAudit complete. No records were modified or deleted.');
}

inspectRecords().catch(console.error);
