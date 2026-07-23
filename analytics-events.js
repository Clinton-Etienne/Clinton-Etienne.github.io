/**
 * CE Security Portfolio
 * Google Analytics 4 event tracking
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Sends an event to Google Analytics.
   */
  function trackEvent(eventName, parameters = {}) {
    if (typeof window.gtag !== "function") {
      console.warn(`GA4 event not sent: ${eventName}`);
      return;
    }

    gtag("event", eventName, {
      ...parameters,
      page_title: document.title,
      page_location: window.location.href
    });

    console.log("GA4 event sent:", eventName, parameters);
  }

  /**
   * Track elements that contain a data-ga-event attribute.
   */
  document.querySelectorAll("[data-ga-event]").forEach((element) => {
    element.addEventListener("click", () => {
      trackEvent(element.dataset.gaEvent, {
        link_text:
          element.dataset.gaLabel ||
          element.textContent.trim() ||
          "Unknown link",

        content_type:
          element.dataset.gaContentType ||
          "portfolio_navigation",

        content_name:
          element.dataset.gaContentName ||
          document.title,

        destination_url:
          element.href || ""
      });
    });
  });

  /**
   * Track when someone reads 25%, 50%, 75%, and 90% of a page.
   */
  const recordedScrollDepths = new Set();
  const scrollThresholds = [25, 50, 75, 90];

  window.addEventListener(
    "scroll",
    () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      const scrollPercentage = Math.round(
        (window.scrollY / scrollableHeight) * 100
      );

      scrollThresholds.forEach((threshold) => {
        if (
          scrollPercentage >= threshold &&
          !recordedScrollDepths.has(threshold)
        ) {
          recordedScrollDepths.add(threshold);

          trackEvent("scroll_depth", {
            percent_scrolled: threshold,
            content_name: document.title
          });
        }
      });
    },
    { passive: true }
  );

  /**
   * Track meaningful engagement after 30, 60, and 120 seconds.
   */
  [30, 60, 120].forEach((seconds) => {
    window.setTimeout(() => {
      trackEvent("engaged_time", {
        engagement_seconds: seconds,
        content_name: document.title
      });
    }, seconds * 1000);
  });
});
