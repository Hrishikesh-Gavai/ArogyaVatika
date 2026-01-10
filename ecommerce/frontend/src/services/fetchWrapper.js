// Global fetch wrapper to surface helpful logs for deployment / network errors
// It monkey-patches window.fetch to add logging for known Vercel error shapes like DEPLOYMENT_NOT_FOUND

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args) => {
    try {
      const res = await originalFetch(...args);

      // Try to parse common Vercel JSON error responses safely
      let bodyText = null;
      try {
        // clone so we don't consume original response body
        const clone = res.clone();
        bodyText = await clone.text();
      } catch (e) {
        // ignore
      }

      if (bodyText && bodyText.includes('DEPLOYMENT_NOT_FOUND')) {
        // eslint-disable-next-line no-console
        console.error('[API][DEPLOYMENT_NOT_FOUND] request:', args[0], '\nresponse body:', bodyText);
      }

      return res;
    } catch (err) {
      // network-level error
      // eslint-disable-next-line no-console
      console.error('[API][NETWORK_ERROR] request:', args[0], err);
      throw err;
    }
  };
}
