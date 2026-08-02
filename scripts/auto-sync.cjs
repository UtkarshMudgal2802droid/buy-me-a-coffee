/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');

try {
  // Check if there are uncommitted changes
  const status = execSync('git status --porcelain').toString();
  
  if (status.trim() !== '') {
    console.log('🔄 Changes detected. Auto-syncing with GitHub...');
    
    // Stage all changes
    execSync('git add .');
    
    // Commit changes
    const timestamp = new Date().toLocaleTimeString();
    execSync(`git commit -m "Auto-commit: saved changes at ${timestamp}"`);
    
    // Push to GitHub
    execSync('git push');
    
    console.log('✅ Successfully pushed to GitHub!');
  }
} catch (error) {
  // We ignore errors where git commit fails because there's nothing to commit
  if (error.message.includes('nothing to commit')) return;
  console.error('❌ Error during auto-sync:', error.message);
}
