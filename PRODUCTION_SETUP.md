# Production setup

Updated 2026-10-02. Next.js and eslint-config-next are pinned to stable `16.3.8`.

## Local and Vercel environment

`.env.local` is configured for production and ignored by Git. Fill `CLERK_SECRET_KEY` locally with the Clerk Production secret, then copy the variables into this app's Vercel project under Production. If a Vercel Preview deployment is used for the real production test, explicitly configure the same values in Preview too. Redeploy after changing Vercel variables.

```dotenv
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuc25henpsLnNob3Ak
CLERK_SECRET_KEY=
NEXT_PUBLIC_CONVEX_URL=https://enchanted-guineapig-972.convex.cloud
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

Never copy the mobile `EXPO_PUBLIC_` variable names into these Next.js apps. Use the `NEXT_PUBLIC_` names above. Never prefix the Clerk secret with `NEXT_PUBLIC_`.

The customer and driver production-preview apps, admin, and shop must use the same Clerk Production instance and Convex Production deployment. Live login, role access, and the real order flow still require verification after deployment. Verify the deployed domains are compatible with the Clerk Production instance; setting keys alone does not configure domains.

## Product media

The shop uses `media:createProductUpload` and `media:finishProductUpload` in Convex. Deploy the updated Convex backend to enable direct product uploads: the browser PUTs the image into `snazzl-products`, then Convex verifies ownership, type and size using only the first 12 bytes. New uploads do not use private staging or a second copy. Old pending staged uploads remain supported during rollout.

In `snazzl-products` → Settings → CORS Policy, allow `https://partner.snazzl.shop`, method `PUT`, and headers `Content-Type` and `Content-Length`. Keep existing rules. No new environment keys or frontend rebuild are required for the upload destination change; retry uploads after deploying Convex to get new signed URLs.

Product images are publicly readable through Bunny using `R2_PUBLIC_BASE_URL` (`https://media.snazzl.shop`). Only uploads need signatures. Files become publicly readable when uploaded, so only public product media belongs here. Try-ons remain in the private bucket. No R2 credentials belong in this website.

The unused `NEXT_PUBLIC_OPENAI_API_KEY` entry was removed from `.env.local`. AI provider credentials belong in Convex.
