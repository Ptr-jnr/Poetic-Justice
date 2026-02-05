-- Seed Data for Poetic Justice
-- Usage: Run this in the Supabase SQL Editor

-- 1. Create Users
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES
(
    '00000000-0000-0000-0000-000000000000',
    '8d0c2738-1f19-4504-8b5e-065261159931', -- UUID for Peter
    'authenticated',
    'authenticated',
    'peter@poeticjustice.com',
    '$2b$10$MKob8GUFEDVt.PqGIEZ2KuR2Aq0Ynj6jmoe7/9Wj70ZXX.9JFIbCi', -- Password123!
    NOW(), -- email_confirmed_at (auto confirm)
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
),
(
    '00000000-0000-0000-0000-000000000000',
    '23e3e449-74d1-447a-8f69-74a44f2d7870', -- UUID for Merciful
    'authenticated',
    'authenticated',
    'merciful@poeticjustice.com',
    '$2b$10$MKob8GUFEDVt.PqGIEZ2KuR2Aq0Ynj6jmoe7/9Wj70ZXX.9JFIbCi', -- Password123!
    NOW(), -- email_confirmed_at (auto confirm)
    NULL,
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Identities (Required for login to work properly in some cases, usually auto-created by triggers but good to be explicit if inserting raw)
INSERT INTO auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    last_sign_in_at,
    created_at,
    updated_at
) VALUES
(
    '8d0c2738-1f19-4504-8b5e-065261159931',
    '8d0c2738-1f19-4504-8b5e-065261159931',
    '{"sub":"8d0c2738-1f19-4504-8b5e-065261159931","email":"peter@poeticjustice.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
),
(
    '23e3e449-74d1-447a-8f69-74a44f2d7870',
    '23e3e449-74d1-447a-8f69-74a44f2d7870',
    '{"sub":"23e3e449-74d1-447a-8f69-74a44f2d7870","email":"merciful@poeticjustice.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Public Profiles
INSERT INTO public.profiles (id, username)
VALUES
    ('8d0c2738-1f19-4504-8b5e-065261159931', 'Peter'),
    ('23e3e449-74d1-447a-8f69-74a44f2d7870', 'Merciful')
ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username;
