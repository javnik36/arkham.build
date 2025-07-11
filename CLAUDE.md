# Bash commands
- `npm run build`: Build the project.
- `npm run check`: Run the typechecker.
- `npm run fmt`: Run the code formatter.

# Code style

- Use ES modules (import/export) syntax, not CommonJS (require).
- Destructure imports when possible (eg. `import { foo } from 'bar'`).
- Use `function Component(props: Props) {}` form to declare React components, not arrow functions.
- When adding CSS files, create a `<component>.module.css` file adjacent to the React component and import it (eg. `import css from "./<component>.module.css";`).

# Workflow

- Be sure to typecheck when you're done making a series of code changes.
- Be sure to run the code formatter when you're done makeing a series of code changes.
