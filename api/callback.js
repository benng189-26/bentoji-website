// GitHub OAuth - Step 2: exchange code for token, deliver to the CMS window
// using the canonical Netlify/Decap/Sveltia postMessage handshake.
module.exports = async function handler(req, res) {
  var code  = req.query.code;
  var error = req.query.error;

  if (error || !code) return sendScript(res, 'error', error || 'missing code');

  try {
    var tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        client_id:     process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code:          code,
      }),
    });
    var data = await tokenRes.json();
    if (data.error) throw new Error(data.error_description || data.error);
    sendScript(res, 'success', data.access_token);
  } catch (err) {
    sendScript(res, 'error', err.message || 'unknown error');
  }
};

function sendScript(res, status, value) {
  // The CMS opener listens for the result. The handshake is:
  //   1. popup -> opener: "authorizing:github"           (announce ready)
  //   2. opener -> popup: "authorizing:github"           (echo, fixes the origin)
  //   3. popup -> opener: "authorization:github:<status>:<payload>"
  // Step 1+2 are what the previous build skipped, so the token was sent before
  // the CMS had registered the channel and was therefore ignored.
  var payload = status === 'success'
    ? JSON.stringify({ token: value, provider: 'github' })
    : JSON.stringify(String(value));

  var message = 'authorization:github:' + status + ':' + payload;

  var script = [
    '(function () {',
    '  var message = ' + JSON.stringify(message) + ';',
    '  function receiveMessage(e) {',
    '    if (e.data !== "authorizing:github") return;',
    '    window.removeEventListener("message", receiveMessage, false);',
    '    if (window.opener) window.opener.postMessage(message, e.origin);',
    '  }',
    '  window.addEventListener("message", receiveMessage, false);',
    '  if (window.opener) window.opener.postMessage("authorizing:github", "*");',
    '})();',
  ].join('\n');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(
    '<!DOCTYPE html><html><body>' +
    '<p style="font-family:sans-serif;padding:2rem">Authorizing…</p>' +
    '<script>' + script + '<\/script></body></html>'
  );
}
