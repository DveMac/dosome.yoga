# dosome.yoga 🧘‍

A low friction, open-source yoga planner aimed at removing a barrier to practicing yoga everyday. It generates yoga "practices" based on a user selected set of tags and time span.

The production app is available at [https://www.dosome.yoga](https://www.dosome.yoga)

The application is built on [Next.js](https://nextjs.org/) and written in [Typescript](https://www.typescriptlang.org/). The production environment runs on [Vercel](https://vercel.com). The data store is [postgres](https://www.postgresql.org/docs/).

### Design

From the start the project has aimed to be ultra-low friction and privacy conscious, as such there is no login or account system and no user information is collected. Any user specific configuration is stored in the browser localStorage (when possible). Basic visitor analytic data is collected using [goatcounter](https://www.goatcounter.com/) and is publicly accessible [here](https://dosomeyoga10.goatcounter.com/).

### Local Development

This repo includes the database schema and sample seed data. To run the local environment you will need [Docker](https://www.docker.com/get-started).

1. Start the database and ensure database is seeded with test data

In a terminal tab, run:

```
npm run db-up
```

2. Start the web server.

Open a second terminal tab, and run:

```
npm run dev
```

The server should now be runnung on http://localhost:3000

### Code & Style

Code style is enforced with [prettier](https://prettier.io/) and tslint. Git pre-commit hooks exists to enforce this.

### Contributing

The project uses GitHub issues to track bugs, features and tech debut. It also uses GitHub projects to map out releases. Bug reports and pull requests are gladly received!
