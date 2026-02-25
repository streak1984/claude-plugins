#!/usr/bin/env node
'use strict';

const https = require('https');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// API key resolution
// ---------------------------------------------------------------------------

function resolveApiKey() {
  // 1. Environment variable
  if (process.env.PEXELS_API_KEY) {
    return process.env.PEXELS_API_KEY;
  }

  // 2. .c-marketing.json in cwd
  const configPath = path.join(process.cwd(), '.c-marketing.json');
  try {
    const raw = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(raw);
    if (config.pexels_api_key) {
      return config.pexels_api_key;
    }
  } catch (_) {
    // File doesn't exist or isn't valid JSON — fall through
  }

  // 3. Not found
  process.stderr.write(
    'Error: Pexels API key not found.\n' +
    'Set $PEXELS_API_KEY or add "pexels_api_key" to .c-marketing.json\n'
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// HTTPS helpers (zero-dependency, handles redirects)
// ---------------------------------------------------------------------------

function httpsGet(url, headers, maxRedirects) {
  if (maxRedirects === undefined) maxRedirects = 5;

  return new Promise(function (resolve, reject) {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: headers || {},
    };

    const req = https.request(options, function (res) {
      // Follow redirects (301, 302, 303, 307, 308)
      if (
        [301, 302, 303, 307, 308].includes(res.statusCode) &&
        res.headers.location &&
        maxRedirects > 0
      ) {
        const redirectUrl = res.headers.location.startsWith('http')
          ? res.headers.location
          : new URL(res.headers.location, url).href;

        // Consume the response body so the socket can be freed
        res.resume();
        resolve(httpsGet(redirectUrl, headers, maxRedirects - 1));
        return;
      }

      const chunks = [];
      res.on('data', function (chunk) {
        chunks.push(chunk);
      });
      res.on('end', function () {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks),
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function httpsGetJson(url, headers) {
  return httpsGet(url, headers).then(function (res) {
    if (res.statusCode < 200 || res.statusCode >= 300) {
      const msg = res.body.toString('utf8').slice(0, 500);
      throw new Error('Pexels API returned HTTP ' + res.statusCode + ': ' + msg);
    }
    return JSON.parse(res.body.toString('utf8'));
  });
}

// ---------------------------------------------------------------------------
// Download helper — streams to file, follows redirects
// ---------------------------------------------------------------------------

function downloadToFile(url, destPath, headers) {
  return new Promise(function (resolve, reject) {
    // Ensure parent directory exists
    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });

    function follow(currentUrl, redirectsLeft) {
      if (redirectsLeft <= 0) {
        reject(new Error('Too many redirects while downloading'));
        return;
      }

      const parsed = new URL(currentUrl);
      const options = {
        hostname: parsed.hostname,
        port: parsed.port || 443,
        path: parsed.pathname + parsed.search,
        method: 'GET',
        headers: headers || {},
      };

      const req = https.request(options, function (res) {
        if (
          [301, 302, 303, 307, 308].includes(res.statusCode) &&
          res.headers.location
        ) {
          res.resume();
          const redirectUrl = res.headers.location.startsWith('http')
            ? res.headers.location
            : new URL(res.headers.location, currentUrl).href;
          follow(redirectUrl, redirectsLeft - 1);
          return;
        }

        if (res.statusCode < 200 || res.statusCode >= 300) {
          res.resume();
          reject(new Error('Download failed with HTTP ' + res.statusCode));
          return;
        }

        const ws = fs.createWriteStream(destPath);
        res.pipe(ws);
        ws.on('finish', function () {
          ws.close(function () {
            resolve();
          });
        });
        ws.on('error', reject);
      });

      req.on('error', reject);
      req.end();
    }

    follow(url, 10);
  });
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  // argv[0] = node, argv[1] = script path, rest = user args
  const args = argv.slice(2);
  const positional = [];
  const flags = {};

  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      // If next arg exists and doesn't start with --, treat as value
      if (i + 1 < args.length && !args[i + 1].startsWith('--')) {
        flags[key] = args[i + 1];
        i++;
      } else {
        flags[key] = true;
      }
    } else {
      positional.push(args[i]);
    }
  }

  return { positional: positional, flags: flags };
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

function cmdSearch(query, flags, apiKey) {
  const params = new URLSearchParams();
  params.set('query', query);
  if (flags.orientation) params.set('orientation', flags.orientation);
  params.set('per_page', flags['per-page'] || '15');
  if (flags.page) params.set('page', flags.page);

  const url = 'https://api.pexels.com/v1/search?' + params.toString();
  const headers = { Authorization: apiKey };

  return httpsGetJson(url, headers).then(function (data) {
    const output = {
      total_results: data.total_results,
      photos: (data.photos || []).map(function (p) {
        return {
          id: p.id,
          description: p.alt || p.url || '',
          photographer: p.photographer || '',
          width: p.width,
          height: p.height,
          src: {
            original: p.src && p.src.original || '',
            large2x: p.src && p.src.large2x || '',
            landscape: p.src && p.src.landscape || '',
            medium: p.src && p.src.medium || '',
          },
        };
      }),
    };
    process.stdout.write(JSON.stringify(output, null, 2) + '\n');
  });
}

function cmdDownload(photoId, flags, apiKey) {
  const url = 'https://api.pexels.com/v1/photos/' + encodeURIComponent(photoId);
  const headers = { Authorization: apiKey };

  return httpsGetJson(url, headers).then(function (photo) {
    // Determine download URL: prefer large2x, fallback to original
    const src = photo.src || {};
    const imageUrl = src.large2x || src.original;
    if (!imageUrl) {
      throw new Error('No image URL found for photo ' + photoId);
    }

    // Determine output path
    let destPath = flags.output;
    if (!destPath) {
      // Default filename from the image URL
      const urlPath = new URL(imageUrl).pathname;
      const ext = path.extname(urlPath) || '.jpg';
      destPath = 'pexels-' + photoId + ext;
    }

    // Resolve to absolute
    destPath = path.resolve(destPath);

    return downloadToFile(imageUrl, destPath, {}).then(function () {
      const output = {
        id: photo.id,
        file: destPath,
        photographer: photo.photographer || '',
        alt: photo.alt || '',
        original_url: src.original || imageUrl,
        license: 'Pexels License',
      };
      process.stdout.write(JSON.stringify(output, null, 2) + '\n');
    });
  });
}

// ---------------------------------------------------------------------------
// Usage
// ---------------------------------------------------------------------------

function printUsage() {
  process.stderr.write(
    'Usage: pexels.js <command> [options]\n' +
    '\n' +
    'Commands:\n' +
    '  search <query>           Search for photos on Pexels\n' +
    '    --orientation <val>    landscape | portrait | square\n' +
    '    --per-page <n>         Results per page (default: 15, max: 80)\n' +
    '    --page <n>             Page number (default: 1)\n' +
    '\n' +
    '  download <photo-id>      Download a photo by ID\n' +
    '    --output <path>        Output file path (default: pexels-<id>.jpg)\n' +
    '\n' +
    'API key lookup order:\n' +
    '  1. $PEXELS_API_KEY environment variable\n' +
    '  2. .c-marketing.json → pexels_api_key\n' +
    '\n' +
    'Examples:\n' +
    '  node scripts/pexels.js search "office workspace norway" --orientation landscape --per-page 10\n' +
    '  node scripts/pexels.js download 123456 --output campaign/images/hero.jpg\n'
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const parsed = parseArgs(process.argv);
  const command = parsed.positional[0];

  if (!command) {
    printUsage();
  }

  const apiKey = resolveApiKey();

  let promise;

  if (command === 'search') {
    const query = parsed.positional.slice(1).join(' ');
    if (!query) {
      process.stderr.write('Error: search requires a query string\n');
      process.exit(1);
    }
    promise = cmdSearch(query, parsed.flags, apiKey);
  } else if (command === 'download') {
    const photoId = parsed.positional[1];
    if (!photoId) {
      process.stderr.write('Error: download requires a photo ID\n');
      process.exit(1);
    }
    promise = cmdDownload(photoId, parsed.flags, apiKey);
  } else {
    process.stderr.write('Error: unknown command "' + command + '"\n\n');
    printUsage();
  }

  promise.catch(function (err) {
    process.stderr.write('Error: ' + err.message + '\n');
    process.exit(1);
  });
}

main();
