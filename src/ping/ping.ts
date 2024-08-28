import * as https from 'https';

export function startPing(): void {
  setInterval(() => {
    https.get('https://enigma-wtuc.onrender.com');
  }, 840000);
}
