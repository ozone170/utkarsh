# Contributing Guide

Thank you for considering contributing to Utkarsh Fresher Manager! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/utkarsh-fresher-manager.git`
3. Follow [QUICK_START.md](QUICK_START.md) to set up your development environment
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### 1. Setup Development Environment

```bash
# Start backend + database
docker-compose up --build

# Seed admin user
docker exec -it utkarsh-backend npm run seed

# Start frontend
cd frontend
npm run dev
```

### 2. Make Your Changes

- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Test your changes thoroughly

### 3. Test Your Changes

```bash
# Test backend endpoints
# See TESTING.md for test scenarios

# Check for errors
# See getDiagnostics if using IDE
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add your feature description"
```

Use conventional commit messages:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style Guidelines

### Backend (JavaScript/Node.js)

```javascript
// Use ES6+ features
import express from 'express';

// Use async/await for async operations
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Use descriptive variable names
const eventId = crypto.randomBytes(8).toString('hex');

// Add error handling
if (!user) {
  return res.status(404).json({ message: 'User not found' });
}
```

### Frontend (React)

```javascript
// Use functional components with hooks
function RegisterPage() {
  const [formData, setFormData] = useState({});
  
  // Use descriptive function names
  const handleSubmit = async (e) => {
    e.preventDefault();
    // ...
  };
  
  return (
    <div>
      {/* JSX here */}
    </div>
  );
}

export default RegisterPage;
```

### General Guidelines

- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Handle errors gracefully
- Validate user input
- Use environment variables for configuration

## Project Structure

When adding new features, follow the existing structure:

### Backend
```
backend/src/
├── config/       # Configuration files
├── models/       # Mongoose models
├── controllers/  # Business logic
├── routes/       # API routes
└── middleware/   # Custom middleware
```

### Frontend
```
frontend/src/
├── api/          # API configuration
├── pages/        # Page components
├── components/   # Reusable components (if needed)
└── utils/        # Utility functions (if needed)
```

## Adding New Features

### Backend API Endpoint

1. Create/update model in `backend/src/models/`
2. Add controller function in `backend/src/controllers/`
3. Add route in `backend/src/routes/`
4. Update `backend/src/server.js` if needed
5. Document in `API.md`

Example:
```javascript
// 1. Model (models/Event.js)
const eventSchema = new mongoose.Schema({
  name: String,
  date: Date
});

// 2. Controller (controllers/eventController.js)
export const createEvent = async (req, res) => {
  // Implementation
};

// 3. Route (routes/eventRoutes.js)
router.post('/', createEvent);

// 4. Server (server.js)
app.use('/api/events', eventRoutes);
```

### Frontend Page

1. Create page component in `frontend/src/pages/`
2. Add route in `frontend/src/App.jsx`
3. Add navigation if needed

Example:
```javascript
// 1. Page (pages/EventsPage.jsx)
function EventsPage() {
  return <div>Events</div>;
}

// 2. Route (App.jsx)
<Route path="/events" element={<EventsPage />} />
```

## Testing

### Manual Testing

1. Test all affected endpoints
2. Test UI changes in browser
3. Test error cases
4. Test with different user roles

### API Testing

Use curl or Postman to test endpoints:

```bash
curl -X POST http://localhost:5000/api/your-endpoint \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

## Common Tasks

### Adding a New Model

1. Create model file in `backend/src/models/`
2. Define schema with Mongoose
3. Export model
4. Use in controllers

### Adding Authentication to Route

```javascript
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleMiddleware } from '../middleware/roleMiddleware.js';

router.get('/protected', 
  authMiddleware, 
  roleMiddleware('ADMIN'), 
  controller
);
```

### Adding a New Page

1. Create component in `frontend/src/pages/`
2. Add route in `App.jsx`
3. Add navigation link if needed

## Documentation

When adding features, update:

- `API.md` - For new endpoints
- `README.md` - For major features
- `TESTING.md` - For new test scenarios
- `CHECKLIST.md` - For implementation status

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style
- [ ] All tests pass
- [ ] Documentation updated
- [ ] No console.log statements (unless intentional)
- [ ] No commented-out code
- [ ] Environment variables used for secrets

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
How to test these changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Tests pass
```

## Feature Requests

Have an idea? Open an issue with:

1. Clear description of the feature
2. Use case / why it's needed
3. Proposed implementation (optional)

## Bug Reports

Found a bug? Open an issue with:

1. Description of the bug
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots (if applicable)
6. Environment (OS, browser, etc.)

## Questions?

- Check [INDEX.md](INDEX.md) for documentation
- Review [TESTING.md](TESTING.md) for examples
- Check existing issues on GitHub

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
