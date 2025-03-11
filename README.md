# Inject JS for Views

This project allows you to dynamically inject and execute JS functions in Pug views (formerly Jade, etc.) in an Express.js application, making it easier to execute functions defined in JS files directly within the views without needing to make AJAX calls or modify backend code. The system is highly configurable and dynamically looks for functions in files inside the public/js directory.

## Features

- Injects JavaScript functions defined in files within the `public/js` directory into Pug views.
- Allows execution of JS functions with or without arguments directly within views.
- Supports various return types: strings, numbers, objects, etc.
- Enables adding functions from any JS file located in the specified directory.

## Installation

### Prerequisites

This project requires Node.js and npm (or yarn) installed on your machine.

1. **Clone the repository**

Open the terminal and run:

```bash
git clone https://github.com/YOUR_USER/REPOSITORY_NAME.git
```

2. **Install dependencies**

In the project directory, run::

```
cd REPOSITORY_NAME
npm install
```

## Usage

1. **Configure Express.js with inject.js**

Add the following configuration to your Express server to use the inject.js module you've created:

```javascript
const express = require('express');
const app = express();
const inject = require('./path/to/inject');  /* Adjust the path to the inject.js file */

inject(app);
```

2. **Create JS functions for injection**

In the `public/js/` directory, create files with JavaScript functions you want to inject into Pug views. Example:

public/js/functions.js

```javascript
function test() {
  return 'Function successfully injected!';
}

module.exports.test = test;
```

3. **Using the function in the view file**

Inside your view file (e.g., views/index.pug), you can call the injected JavaScript functions as follows:

views/index.pug

```pug
doctype html
html
  head
    title Function Injection Example
  body
    h1 Injected JS Function Example:
    != inject('test')
```

4. **How to pass arguments to functions**

If the function requires arguments, simply pass them like this:

public/js/functions.js

```javascript
function greetings(name) {
  return `Hello, ${name}! Welcome to the system!`;
}

module.exports.greetings = greetings;
```

views/index.pug
```pug
h2 #{inject('greetings', 'John')}  // Passes 'John' as an argument to the function
```

5. **Additional configurations**

If you want to customize the path where inject.js looks for JavaScript files or configure additional parameters, you can modify the call to the module within your Express code.

```javascript
inject(app, 'another/directory/js');
```

## How It Works

The inject.js module works as follows:

- The code recursively searches for .js files within the public/js directory (or another directory you configure).
- When called by the Pug view, the inject(funcName) method finds and executes the corresponding function in the JavaScript file.
- If the function returns a value (such as a string, number, or object), it is rendered in the view.
- If the function or file is not found, the module logs an error message in the backend console (not visible to the user).

## Note

- Make sure the JavaScript functions are properly exported in the JS files.
- Use != in Pug to return values like strings to avoid automatic escaping.
- Use #{} for other types of values (numbers, objects, arrays, etc.).

## License

This project is licensed under the MIT License.

## Contributions

Contributions are welcome! If you have suggestions or improvements, please open an issue or submit a pull request.