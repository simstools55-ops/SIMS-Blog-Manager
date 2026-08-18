# Release Notes — SIMS Blog Manager v5.10.22

This PATCH release fixes a version-management inconsistency found during live-script audit.

The currently deployed Code.gs already reported `SBM_VERSION = 5.10.21`, but its file header
still said `SIMS-Blog-Manager Product v5.10.12`.

v5.10.22 uses the user-supplied currently deployed Code.gs as the source of truth and changes
only the formal product/header version information. All runtime Code.gs mirrors are synchronized
from that current script so no newer live changes are lost.

Functional behavior is intentionally unchanged from the currently deployed script.
