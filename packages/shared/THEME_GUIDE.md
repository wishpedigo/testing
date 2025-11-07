# Component Usage Guide

## Overview

## Available Components

### Basic Components

- `Button` - Custom button with variants (primary, secondary, outline)
- `Card` - Card container with dark theme styling
- `Typography` - Text component with semantic variants
- `Container` - Responsive container with max-width options
- `Box` - Simple container div
- `Grid` - Grid layout system
- `TextField` - Form input field
- `Alert` - Alert/notification component

### Navigation Components

- `AppBar` - Top navigation bar
- `Toolbar` - Navigation toolbar

## Usage Examples

### Basic Layout
```typescript
import { Container, Typography, Box, Grid, Card, Button } from '@wishlabs/shared';

function MyPage() {
  return (
    <Container maxWidth="lg" className="py-12">
      <Typography variant="h1" gutterBottom>
        Welcome
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <Typography variant="h5" gutterBottom>
              Title
            </Typography>
            <Typography color="textSecondary">
              Content here
            </Typography>
            <Button variant="primary" size="lg">
              Click Me
            </Button>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
```

### Forms
```typescript
import { TextField, Button, Alert, Card } from '@wishlabs/shared';

function LoginForm() {
  return (
    <Card>
      <TextField
        label="Email"
        type="email"
        required
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        required
        fullWidth
      />
      <Button variant="primary" fullWidth>
        Login
      </Button>
    </Card>
  );
}
```

### Navigation
```typescript
import { AppBar, Toolbar, Typography, Button } from '@wishlabs/shared';

function Navigation() {
  return (
    <AppBar position="fixed">
      <Toolbar>
        <Typography variant="h6">
          My App
        </Typography>
        <Button variant="outline">
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}
```

## Component Props

### Button
- `variant`: 'primary' | 'secondary' | 'outline' | 'contained'
- `size`: 'sm' | 'md' | 'lg' | 'large'
- `disabled`: boolean
- `fullWidth`: boolean
- `color`: 'primary' | 'secondary' | 'inherit'
- `type`: 'button' | 'submit' | 'reset'

### Typography
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption'
- `color`: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'text.primary' | 'text.secondary'
- `gutterBottom`: boolean
- `paragraph`: boolean
- `component`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'

### Container
- `maxWidth`: 'sm' | 'md' | 'lg' | 'xl' | 'false'

### Grid
- `container`: boolean
- `item`: boolean
- `xs`, `sm`, `md`, `lg`, `xl`: number (1-12)
- `spacing`: number

### TextField
- `label`: string
- `type`: 'text' | 'email' | 'password' | 'number'
- `error`: boolean
- `helperText`: string
- `fullWidth`: boolean
- `required`: boolean
- `margin`: 'normal' | 'dense' | 'none'
- `placeholder`: string
- `name`: string
- `autoComplete`: string

### Box

### AppBar
- `position`: 'fixed' | 'static' | 'sticky'

### Alert
- `severity`: 'error' | 'warning' | 'info' | 'success'
- `onClose`: function

## Custom Styling with className

Use the `className` prop to apply custom Tailwind CSS classes to components:

```typescript
// Button with custom styles
<Button 
  className="text-3xl py-8 px-16 min-h-[150px] min-w-[300px]"
>
  Custom Button
</Button>

// Typography with flexbox styles
<Typography 
  variant="h6" 
  className="flex-1"
>
  Title
</Typography>

// Box with flex layout
<Box className="flex items-center gap-2">
  Content
</Box>
```

## Dark Theme

All components are designed for dark theme by default:
- Background: `#121212` (default), `#1e1e1e` (paper)
- Text: `#ffffff` (primary), `#b3b3b3` (secondary)
- Borders: `#374151` (default), `#4b5563` (light)

## Benefits

✅ **Consistent theming** - No inheritance issues
✅ **Better performance** - Pure CSS/Tailwind
✅ **Full control** - Customizable components
✅ **Type safety** - Full TypeScript support
