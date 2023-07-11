# Managing Obesity
> a live sample version of this site if viewable [here](p10.codabool.com)

US obesity prevalence was 42% in 2017 – 2018 ([source](https://www.cdc.gov/obesity/data/adult.html)).

This app seeks to provide a tool to manage obesity.

# 🖊️ Details
> I have a blog post which has more details about how and why this was made [here](https://codabool.com/blog/24)

### The Data
This app uses a dataset for its graphs involving BMI.

The dataset can be found in CDCs [National Health and Nutrition Examination Survey (NHANES) page](https://wwwn.cdc.gov/nchs/nhanes/search/datapage.aspx?Component=Examination&Cycle=2017-2020) under the "Body Measures" Data file. 

This uses an XPT file format, which may require downloading software. For this the software "Datasly" can be used. 

The column Body Mass Index (BMXBMI) was used, filtering out empty values and rows which contained any value for BMI Category - Children/Youth (BMDBMIC).

Filtering out rows which contain BMDBMIC effectively removes all data collected from youth ages 1-18. 

This leaves 8388 usable rows of adult data which was then processed to generate a BMI histogram viewable within the application.

## Running the Application Locally
### Requirements
- git
- node
- supabase account with a PostgreSQL instance
- Google reCAPTCHA account
- Google cloud account
- GitHub account

### Steps
1. The application can be cloned locally with a `git clone https://github.com/CodaBool/CS6440.git`
2. go into the new CS6440 folder `cd CS6440`
3. install the necessary dependencies `npm install`
4. create a `.env` file in the root of application
5. Follow the steps to generate values for all the necessary environment variables

> `DATABASE_URL`
1. Create a Supabase account at https://app.supabase.io
2. create a new project > wait for the database to be provisioned > select the Database tab
3. Database > Connection Pooling > Connection string
4. store the values in .env for `DATABASE_URL`

> `GOOGLE_ID` and `GOOGLE_SECRET`
1. sigin to Google and go to https://console.cloud.google.com/apis/credentials
2. create a new project
3. create credentials > OAuth client ID > Web application
4. set the URIs for origin and redirect
5. store the values in .env for `GOOGLE_ID` and `GOOGLE_SECRET`

> `GITHUB_ID` and `GITHUB_SECRET`
1. sigin to Google and go to https://github.com/settings/developers
2. create a new OAuth app, you will need to create separate apps for local and production
3. fill all required fields, use `https://YOUR_DOMAIN/api/auth/callback/github` for prod and `http://localhost:3000/api/auth/callback/github` for local in the callback URL field
5. store the values in .env for `GITHUB_ID` and `GITHUB_SECRET`

> `NEXTAUTH_URL` and `NEXTAUTH_SECRET`
1. add the line `NEXTAUTH_URL=http://localhost:3000/api/auth` to the .env. follow the [documentation](https://next-auth.js.org/getting-started/example#deploying-to-productiond) if any issues arrise
3. generate a secure (use 40 character length) value. You can use generator sites like [lastpass](https://www.lastpass.com/features/password-generator) to generator this value.
4. Store the value in .env for `NEXTAUTH_SECRET`

> `NEXT_PUBLIC_CAPTCHA_SITE_KEY` and `CAPTCHA_SECRET`
1. signin to Google and go to https://www.google.com/recaptcha/admin
2. click the plus icon, use the v2 reCAPTCHA add a localhost domain
3. store the values in .env for the `NEXT_PUBLIC_CAPTCHA_SITE_KEY` and `CAPTCHA_SECRET`

## Deploying the Application
This application is built using Next.js and the recommended deployment host is Vercel.

An account can be created easily by using the GitHub OAuth at https://vercel.com.

After creating a project and linking to your repository you will have automatic deployments on push.

Add all local environment variables to the project. Ensure to update NEXTAUTH_URL to the canatical domain vercel provides.

Also update the Google and GitHub OAuth apps to allow your new domain.


# Helpful Developer Info
- Google reCAPTCHA = https://www.google.com/recaptcha/admin
- OAuth Github = https://github.com/settings/applications/1631352
- OAuth Google = https://console.cloud.google.com/apis/credentials?authuser=1&project=market-mongo-314800
- Prisma CLI = https://www.prisma.io/docs/reference/api-reference/command-reference
  - use `npx prisma db push` to migrate
- Threejs Docs = https://docs.pmnd.rs/react-three-fiber/getting-started
  - ~~import gltf to https://gltf.pmnd.rs to generated code.~~ Not working atm, use gltfjsx cli instead
  - use `npx gltfjsx MODEL_FILE_NAME.gltf --shadows -T -a -D` to convert a gltf to a react function
