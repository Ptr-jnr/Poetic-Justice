import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// specific helper to read .env file
function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
        console.error('.env file not found');
        process.exit(1);
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            env[key.trim()] = value.trim();
        }
    });
    return env;
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const users = [
    { email: 'peter@poeticjustice.com', password: 'Password123!', username: 'Peter' },
    { email: 'merciful@poeticjustice.com', password: 'Password123!', username: 'Merciful' }
];

async function seed() {
    console.log('Starting seed process...');

    for (const user of users) {
        console.log(`Creating user: ${user.username} (${user.email})`);

        // 1. Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
        });

        if (authError) {
            console.error(`Error creating auth user ${user.username}:`, authError.message);
            continue; // Skip to next user if auth fails (might already exist)
        }

        if (authData.user) {
            console.log(`Auth user created/found: ${authData.user.id}`);

            // 2. Create Profile
            // Check if profile exists first to avoid duplicate key error if re-running
            const { data: existingProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authData.user.id)
                .single();

            if (!existingProfile) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([{ id: authData.user.id, username: user.username }]);

                if (profileError) {
                    console.error(`Error creating profile for ${user.username}:`, profileError.message);
                } else {
                    console.log(`Profile created for ${user.username}`);
                }
            } else {
                console.log(`Profile already exists for ${user.username}`);
            }
        }
    }

    console.log('Seed process completed.');
}

seed();
