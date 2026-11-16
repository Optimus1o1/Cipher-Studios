import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';

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
  console.error('Error: SUPABASE_SECRET_KEY not available.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const CONTACT_TEST_IDS = [
  'eeaa2e3f-6326-4635-b075-b94f09e6c335',
  '0a9db428-a5ab-4ec0-8baa-ff3701da3b63',
  '4c68daf1-603a-4c45-a166-5153dd142345',
  'f536422b-1d5b-4e66-a0a9-5b902eafe7e8',
  '06da8de6-37d1-4578-b695-691b472d5334',
];

const REVIEW_TEST_IDS = [
  '4c1e6c2d-4004-4198-8807-93932a1cac36',
];

async function cleanupStaging() {
  console.log('=== CLEANING UP STAGING TEST RECORDS FROM SUPABASE ===\n');

  // 1. Delete contact test records
  const { data: delContacts, error: contactErr } = await supabase
    .from('contact_submissions')
    .delete()
    .in('id', CONTACT_TEST_IDS)
    .select('id, name, email');

  if (contactErr) {
    console.error('Failed to delete contact test records:', contactErr);
  } else {
    console.log(`✓ Deleted ${delContacts.length} test record(s) from public.contact_submissions:`);
    delContacts.forEach(c => console.log(`  - [${c.id}] ${c.name} (${c.email})`));
  }

  // 2. Delete review test records
  const { data: delReviews, error: reviewErr } = await supabase
    .from('review_submissions')
    .delete()
    .in('id', REVIEW_TEST_IDS)
    .select('id, name, email');

  if (reviewErr) {
    console.error('Failed to delete review test records:', reviewErr);
  } else {
    console.log(`\n✓ Deleted ${delReviews.length} test record(s) from public.review_submissions:`);
    delReviews.forEach(r => console.log(`  - [${r.id}] ${r.name} (${r.email})`));
  }

  // 3. Final verification count
  const { count: contactCount } = await supabase.from('contact_submissions').select('*', { count: 'exact', head: true });
  const { count: reviewCount } = await supabase.from('review_submissions').select('*', { count: 'exact', head: true });

  console.log(`\n=== CLEANUP COMPLETE ===`);
  console.log(`Current remaining rows in public.contact_submissions: ${contactCount}`);
  console.log(`Current remaining rows in public.review_submissions: ${reviewCount}`);
}

cleanupStaging().catch(console.error);
