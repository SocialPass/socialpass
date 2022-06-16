# SocialPass
SocialPass monorepo.

## Development
Refer to README in specific directories
- `backend/README`
- `frontend/checkoutportal/README`
- `frontend/scanner-app/README`

# Backend Style Guide
- Install pre-commit hooks for linting
- Small Views, Medium Models, Large Services
	- Views should reference services or models
	- Models should have DB schema and associated properties (@property)
	- Services should contain all other business logic
	- This as reference: https://github.com/HackSoftware/Django-Styleguide

# Frontend Style Guide
- Scaffold new projects with Vite (https://vitejs.dev)
- react-router-dom for routing
- Prefer Yarn over NPM
- Basic CSS over CSS in JS or anything of the like
