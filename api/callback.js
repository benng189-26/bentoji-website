// Decap CMS GitHub OAuth - Step 2: exchange code for token, deliver to CMS window
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
  var msg = status === 'success'
    ? 'authorization:github:success:' + JSON.stringify({ token: value, provider: 'github' })
    : 'authorization:github:error:'   + JSON.stringify(String(value));

  // GitHub's COOP header severs window.opener in the popup, so we use
  // BroadcastChannel (same-origin, COOP-safe) as the primary channel and
  // fall back to postMessage for browsers that don't support BroadcastChannel.
  var script = [
    '(function(){',
    '  var msg = ' + JSON.stringify(msg) + ';',

    // Primary: BroadcastChannel — works even when COOP nullifies window.opener
    '  try {',
    '    var bc = new BroadcastChannel("decap-cms-auth");',
    '    bc.postMessage(msg);',
    '    setTimeout(function(){ bc.close(); }, 4000);',
    '  } catch(e) {}',

    // Fallback: postMessage to opener (works if opener not nullified)
    '  function tryOpener(){',
    '    if(window.opener && !window.opener.closed){',
    '      try{ window.opener.postMessage(msg,"*"); }catch(e){}',
    '    }',
    '  }',
    '  tryOpener();',
    // Also reply to any CMS ping
    '  window.addEventListener("message", function(e){',
    '    if(e.data==="authorizing:github") tryOpener();',
    '  });',

    '  setTimeout(function(){ window.close(); }, 3000);',
    '})();',
  ].join('\n');

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send('<!DOCTYPE html><html><body><script>' + script + '<\/script>' +
           '<p style="font-family:sans-serif;padding:2rem">Authorizing…</p></body></html>');
}
