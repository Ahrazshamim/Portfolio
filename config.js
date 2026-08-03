/* ==========================================================================
   Recommendations backend config
   --------------------------------------------------------------------------
   Fill these two values in after creating your free Supabase project.
   Setup instructions (SQL + policies) are in DEPLOY.md → "Recommendations".

   Until they're filled in, the site falls back to SEED_RECOMMENDATIONS below,
   and the submission form politely tells people to email instead.

   The anon key is SAFE to commit publicly — it only grants what your Row Level
   Security policies allow, which here is: insert an unapproved row, and read
   approved rows. Nothing else.
   ========================================================================== */

window.SUPABASE_CONFIG = {
  url:     'https://YOUR_PROJECT.supabase.co',
  anonKey: 'YOUR_ANON_KEY'
};

/* --------------------------------------------------------------------------
   Fallback recommendations, shown when Supabase isn't configured or is down.
   Replace these with real ones (e.g. copied from your LinkedIn recommendations).
   Keep them honest — placeholders on a live portfolio read worse than none.
   -------------------------------------------------------------------------- */
window.SEED_RECOMMENDATIONS = [];
