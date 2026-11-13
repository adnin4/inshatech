import { execSync } from 'child_process';

try {
    const output = execSync('git credential fill', {
        input: 'protocol=https\nhost=github.com\n\n',
        encoding: 'utf8',
        timeout: 5000
    });
    console.log('Credential fill output:');
    const lines = output.split('\n');
    lines.forEach(l => {
        if (l.startsWith('username=')) console.log(l);
        if (l.startsWith('password=')) console.log('password length:', l.slice(9).length, 'starts with:', l.slice(9, 13));
    });
} catch (e) {
    console.error('Error running credential fill:', e.message);
}
