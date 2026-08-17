# Release Notes — SIMS Blog Manager v5.10.21

The manual "reload previous treatment" control was originally added as a fallback while
the Site Diagnosis treatment dialog could be slow to initialize. With automatic resume
now established, the manual control and its related guidance are removed.

When the user moves to the previous/next referral, both the Writer result text area and
the green registration-completion message are reset so status from the prior article
cannot be mistaken for the current article.
