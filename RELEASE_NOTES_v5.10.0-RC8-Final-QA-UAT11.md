# SIMS-Blog-Manager Product 5.10.0 RC8 Final QA-UAT11

## Scope
Progress-dialog dispatcher regression hotfix only.

## Fix
- Replaced dynamic `google.script.run` property invocation with an explicit server-side dispatcher.
- Detailed diagnosis candidates now advance STEP 1/3 -> 2/3 -> 3/3 instead of remaining at STEP 1/3.
- The same dispatcher preserves the long-running progress dialogs for article supplementation and effectiveness updates.

## Regression
- REG-LONG-RUNNING-UX-002: progress worker dispatch must use a server-side allowlisted dispatcher.
