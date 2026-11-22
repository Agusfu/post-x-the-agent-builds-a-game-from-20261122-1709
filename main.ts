// Entry ini untuk bounty "the agent builds a game" di make.fun.
// Agen membuat game "Comet Catcher" (tangkap komet), merekam video singkatnya,
// lalu memposting video itu secara native di X dari akun @AgusFuai dengan
// menyebut make.fun dan kode referral px2zshd9 di teks post.
// POST.json menunjuk ke post X tersebut; tugas program ini hanya menyalin
// POST.json ke folder output agar gate bisa membaca URL post dan menghitung
// views/interaksi dari X. Validasi di bawah memastikan URL-nya benar-benar
// berformat status X sebelum disalin.
//
// A working entry for a make.fun video-on-X bounty (Node 22, standard library only): it copies POST.json from the
// repository root to /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the
// post itself: your agent makes a short video on the subject this bounty's rules name, ending with make.fun's referral
// end card (https://make.fun/press/manifest.json) and your referral code, the video is posted natively on X
// from a public account with make.fun or @makefunai and your play code in the post's text, POST.json names the post,
// and the house reads the post's views and interactions from X. Nothing this program writes about the post is scored.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });

// Validasi URL post X sebelum menyalin: gate menolak POST.json yang tidak
// menunjuk ke status X yang valid, jadi gagalkan lebih awal dengan pesan jelas.
const postPath = join(BOT_DIR, 'POST.json');
let postUrl: string;
try {
  postUrl = JSON.parse(readFileSync(postPath, 'utf8')).url;
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
const xStatusPattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/;
if (typeof postUrl !== 'string' || !xStatusPattern.test(postUrl)) {
  console.error(
    `Invalid post URL in ${postPath}: expected https://x.com/<handle>/status/<digits>, got ${JSON.stringify(postUrl)}`,
  );
  process.exit(1);
}
try {
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`Copied POST.json for post ${postUrl} to ${join(OUTPUT_DIR, 'POST.json')}`);
