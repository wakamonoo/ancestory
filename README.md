# AnceStory

AnceStory is a web archive for preserving and exploring local folklore, memories, history, and the places connected to them. It gives community members a way to share stories with their sources and locations, and helps readers discover the people and places behind those accounts.

Visit the live site: [ancestory.site](https://ancestory.site)

## Features

- **Browse the story archive.** Explore story cards, open full story pages, and navigate between adjacent and related stories.
- **Discover featured stories and contributors.** The home page highlights a featured story and links to contributor profiles.
- **Connect stories to places.** Contributors can pin a story location on a map. The archive and contributor profiles display story locations using interactive maps.
- **Share and manage stories.** Signed-in contributors can submit stories with a title, place, text, source, categories, poster image, and map coordinates. Story authors can edit or delete their stories.
- **Maintain contributor profiles.** Profiles show a contributor's stories and story map. Contributors can update their name, bio, profile picture, and cover photo, or delete their account.
- **Upload images.** Story posters, profile pictures, and cover photos are uploaded to Cloudinary.
- **Sign in with Google.** Firebase Authentication provides Google sign-in for contributor accounts.

## Tech Stack

- **Application:** Next.js 16 App Router, React 19, and TypeScript
- **Styling:** Tailwind CSS 4 with PostCSS
- **Database:** MongoDB using the official Node.js driver; application records are stored in `users` and `stories` collections
- **Authentication:** Firebase Authentication with Google sign-in, plus Firebase Admin token verification during account setup
- **Media:** Cloudinary for story and profile images
- **Maps:** Leaflet with OpenStreetMap tiles. The repository also includes the React-Leaflet package.
- **Other libraries:** `next-sitemap` generates sitemap and robots files after a production build; `react-icons`, `sweetalert2`, and `uuid` support the interface and story IDs.

## Getting Started

### Prerequisites

- Node.js 20.9 or later and npm
- A MongoDB database
- A Firebase project with Google sign-in enabled and a service account for the Admin SDK
- A Cloudinary account for image uploads

### Installation

Before running the app, create a root `.env.local` file with the variables listed below and provide values for your local services.

From the repository root, install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

The development server is available at [http://localhost:3000](http://localhost:3000).

Available package scripts:

- `npm run dev` starts the development server.
- `npm run build` builds the production application and then runs the configured sitemap generation through the `postbuild` script.
- `npm run start` starts the production server after a build.
- `npm run lint` runs ESLint.

## Environment Variables

The application reads the following variables. Use your own service configuration; do not commit populated environment files.

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string used by the MongoDB client. |
| `MONGODB` | MongoDB database name used for the `users` and `stories` collections. |
| `FIREBASE_PROJECT_ID` | Firebase project ID for the Admin SDK. |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account client email for the Admin SDK. |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key for the Admin SDK. The code converts escaped `\n` sequences to line breaks. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase web app API key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase web app auth domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase web app project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase web app storage bucket setting. |
| `NEXT_PUBLIC_FIREBASE_SENDER_ID` | Firebase web app messaging sender ID setting. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase web app ID. |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional Firebase measurement ID passed to the web configuration; Analytics is not initialized in this repository. |
| `CLOUD_NAME` | Cloudinary cloud name. |
| `CLOUDINARY_API_KEY` | Cloudinary API key used by server-side upload routes. |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret used by server-side upload routes. |
| `NEXT_PUBLIC_BASE_URL` | Base URL used to fetch story and profile data when generating page metadata. Set this to the local or deployed site origin. |

The following placeholder format can be used as a reference when creating `.env.local`:

```dotenv
MONGODB_URI=<your-mongodb-connection-string>
MONGODB=<your-database-name>

FIREBASE_PROJECT_ID=<your-firebase-project-id>
FIREBASE_CLIENT_EMAIL=<your-service-account-client-email>
FIREBASE_PRIVATE_KEY=<your-private-key-with-escaped-\n-line-breaks>

NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-web-api-key>
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=<your-firebase-auth-domain>
NEXT_PUBLIC_FIREBASE_PROJECT_ID=<your-firebase-project-id>
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=<your-firebase-storage-bucket>
NEXT_PUBLIC_FIREBASE_SENDER_ID=<your-firebase-sender-id>
NEXT_PUBLIC_FIREBASE_APP_ID=<your-firebase-app-id>
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=<optional-measurement-id>

CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUDINARY_API_KEY=<your-cloudinary-api-key>
CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>

NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. Keep service-account and Cloudinary secret values in server-only variables.

## Project Structure

```text
app/                    App Router pages, layouts, and API route handlers
  api/                  Story, user, and image-upload endpoints
  profile/[uid]/        Contributor profile page and metadata
  stories/              Story archive and story detail pages
components/             Home, profile, story, modal, navigation, and UI components
context/                Shared user, story, navigation, and loading state
lib/                    MongoDB, Firebase, and Cloudinary service setup
  firebase/             Firebase client and Admin SDK setup
assets/                 Images used by the interface
public/                 Static assets, sitemap, and robots files
types/                  TypeScript data types for stories and users
next-sitemap.config.cjs Sitemap and robots generation settings
next.config.ts          Next.js configuration
package.json            Dependencies and project scripts
```

The story and user data shapes are defined in `types/story.ts` and `types/user.ts`; database access is performed directly through the MongoDB driver.

## Architecture Overview

The App Router serves the home page, story archive, story detail pages, and public contributor profiles. Client components use shared React contexts to load user and story data from Next.js API route handlers under `app/api`.

The API handlers read and write MongoDB's `stories` and `users` collections. Firebase Authentication manages Google sign-in in the browser. During account setup, the client sends its Firebase ID token to the signup route, where Firebase Admin verifies the token before a MongoDB user profile is created. Cloudinary upload routes receive image files and return hosted URLs that are stored with story or profile data.

Each story can store latitude and longitude coordinates. Leaflet displays those coordinates over OpenStreetMap tiles on the home page, contributor profiles, and the location picker used when submitting or editing a story.

## Deployment

The repository does not include provider-specific deployment configuration. `package.json` provides `npm run build` and `npm run start` for a Node.js deployment. The `postbuild` script runs `next-sitemap` using `next-sitemap.config.cjs`, which sets `https://ancestory.site` as the site URL and enables robots file generation. Configure the environment variables in the deployment environment, including `NEXT_PUBLIC_BASE_URL` for the deployed origin.

## License

No license has been specified in the repository.
