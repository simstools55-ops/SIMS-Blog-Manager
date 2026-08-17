# Release Notes — SIMS Blog Manager v5.10.20

Live Site Diagnosis testing showed two UX problems in site-wide result import:
the progress overlay stayed at `0 / ?`, and the whole site-wide payload was processed in
one server execution.

v5.10.20 counts the payload locally before the server call and processes one expanded
site-wide unit per Apps Script execution. Progress is visible from the first click.

Writer result registration also clears the result input only after a successful save.
Failures keep the text for safe retry.
