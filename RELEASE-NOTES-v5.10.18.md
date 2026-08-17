# Release Notes — SIMS Blog Manager v5.10.18

v5.10.17 did not show the Doctor import progress overlay because the embedded browser-side
submitDoctor() replacement was malformed. v5.10.18 fixes the replacement boundary and
uses browser-safe message strings.

Validation now checks both the outer Code.gs syntax and the extracted submitDoctor()
browser function before release.
