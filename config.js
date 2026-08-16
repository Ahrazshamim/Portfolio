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
window.SEED_RECOMMENDATIONS = [
  {
    name: "Maaz B. Asad",
    role: "Senior Software Engineer, Optum (UHG)",
    message: "I worked with Ahraz during the Youth Conclave event held at IIT Jodhpur. His technical and management skills helped our team secure a top five position in the event. He has also worked with me in a college robotics club, where he mentored students in robotics and automation. I am sure he would be an asset to any organization he is part of.",
    source: "LinkedIn recommendation, October 2022"
  }
];
