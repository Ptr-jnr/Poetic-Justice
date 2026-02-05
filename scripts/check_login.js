import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnv() {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    content.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) env[key.trim()] = value.trim();
    });
    return env;
}

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkLogin() {
    console.log("Checking login for Peter...");
    const { data: peter, error: peterError } = await supabase.auth.signInWithPassword({
        email: 'peter@poeticjustice.com',
        password: 'Password123!'
    });

    if (peterError) {
        console.error("Peter Login Failed:", peterError.message);
    } else {
        console.log("Peter Login Success:", peter.user.email);
    }

    console.log("\nChecking login for Merciful...");
    const { data: merciful, error: mercError } = await supabase.auth.signInWithPassword({
        email: 'merciful@poeticjustice.com',
        password: 'Password123!'
    });

    if (mercError) {
        console.error("Merciful Login Failed:", mercError.message);
    } else {
        console.log("Merciful Login Success:", merciful.user.email);
    }
}

checkLogin();
