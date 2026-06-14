export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/auth") {
      const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
      authorizeUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
      authorizeUrl.searchParams.set("redirect_uri", `${url.origin}/callback`);
      authorizeUrl.searchParams.set("scope", "repo,user");
      return Response.redirect(authorizeUrl.toString(), 302);
    }

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");
      if (!code) {
        return new Response("Missing code", { status: 400 });
      }

      const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });

      const tokenData = await tokenRes.json();

      if (tokenData.error || !tokenData.access_token) {
        return new Response("OAuth error: " + JSON.stringify(tokenData), { status: 400 });
      }

      const token = tokenData.access_token;
      const content = JSON.stringify({ token, provider: "github" });

      const script = `
        <script>
          (function() {
            function receiveMessage(e) {
              window.opener.postMessage(
                'authorization:github:success:${content.replace(/"/g, '\\"')}',
                e.origin
              );
            }
            window.addEventListener("message", receiveMessage, false);
            window.opener.postMessage("authorizing:github", "*");
          })();
        </script>
      `;

      return new Response(script, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Wulai CMS OAuth proxy is running.");
  },
};
