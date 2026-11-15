BEGIN;
SELECT plan(12);

-- 1. Schema & Table Structure Tests
SELECT has_table('public', 'contact_submissions', 'Table contact_submissions exists');
SELECT has_table('public', 'review_submissions', 'Table review_submissions exists');

-- 2. RLS Status Tests
SELECT row_eq(
    $$ SELECT relrowsecurity FROM pg_class WHERE oid = 'public.contact_submissions'::regclass $$,
    ROW(true),
    'RLS is enabled on contact_submissions'
);
SELECT row_eq(
    $$ SELECT relrowsecurity FROM pg_class WHERE oid = 'public.review_submissions'::regclass $$,
    ROW(true),
    'RLS is enabled on review_submissions'
);

-- 3. Anonymous Role Access Lockdown Tests
SET ROLE anon;

SELECT throws_ok(
    $$ SELECT * FROM public.contact_submissions $$,
    '42501',
    NULL,
    'anon is denied SELECT on contact_submissions'
);

SELECT throws_ok(
    $$ INSERT INTO public.contact_submissions (name, email, message) VALUES ('Test', 'test@test.com', 'Message body here') $$,
    '42501',
    NULL,
    'anon is denied direct INSERT on contact_submissions'
);

SELECT throws_ok(
    $$ SELECT * FROM public.review_submissions $$,
    '42501',
    NULL,
    'anon is denied SELECT on review_submissions'
);

-- 4. Authenticated Public User Lockdown Tests
SET ROLE authenticated;

SELECT throws_ok(
    $$ SELECT * FROM public.contact_submissions $$,
    '42501',
    NULL,
    'authenticated user is denied SELECT on contact_submissions'
);

SELECT throws_ok(
    $$ INSERT INTO public.review_submissions (name, email) VALUES ('Test', 'test@test.com') $$,
    '42501',
    NULL,
    'authenticated user is denied direct INSERT on review_submissions'
);

-- 5. Privileged Service Role Verification Tests
SET ROLE service_role;

SELECT lives_ok(
    $$ INSERT INTO public.contact_submissions (name, email, message) VALUES ('Verified Agency Lead', 'lead@test.com', 'Valid enquiry message from server API') $$,
    'service_role can insert valid contact submission'
);

SELECT lives_ok(
    $$ SELECT count(*) FROM public.contact_submissions $$,
    'service_role can read contact submissions'
);

-- 6. Check Constraint Verification
SELECT throws_ok(
    $$ INSERT INTO public.contact_submissions (name, email, message) VALUES ('X', 'invalid', 'short') $$,
    '23514',
    NULL,
    'Check constraints correctly reject invalid field lengths'
);

SELECT * FROM finish();
ROLLBACK;
