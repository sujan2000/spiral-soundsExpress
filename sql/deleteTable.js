import fs from 'fs';
import path from 'path';

const dbPath = path.join('database.db');

if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
    console.log('Old database deleted');
}