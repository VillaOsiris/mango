# Custom Range Slider Component

A custom range slider component build.

- **React**: [React](https://reactjs.org/)
- **Typescript**: [Typescript](https://typescriptlang.org//)
- **Testing**: [Jest](https://jestjs.io/)

## Table of Contents

- [Introduction](#introduction)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

## Introduction

The Custom Range Slider Component is a React-based slider component with two fuction modes that allows users to select a value within a specified ranges. It provides a visually appealing and interactive slider interface.

## Dependencies

The project has the following core dependencies:

- `webpack` (version 5.84.0)
- `@babel/core`: (^7.21.8)
- `react`: (^18.2.0),
- `typescript`: (^5.0.4),
- `jest`: (^29.5.0)

[Note:] Complete list of dependencies is located in the project's `devDependencies` section of the `package.json` file.

## Installation

To install the Custom Range Slider Component, follow these steps:

1. Clone the repository: git clone https://github.com/VillaOsiris/mango.git

2. Navigate to the project directory: cd mango

3. Install the dependencies: npm install

## Usage

To use the Custom Range Slider Component in your project, follow these steps:

1. Import the `Range` component into your React application:

- import `Range` from `path/to/Range`;

2. Use the Range component in your JSX:

- <Range min={1} max={100} "OR" values={[100,200,300,400]}/>
  [Note:] Replace the min/max or values, with your desired values.

3. Style the slider using plain CSS. You can customize the appearance by modifying the CSS classes provided in `Range.css` inside the `/components/Range` folder.

## Development

- sripts:

1. Starts dev server on `http://localhost:8080/`

- `npm start`

2. Starts testing

- `npm test`

## Production Mode

To run the application in production mode, follow the steps below:

1. Install all dependencies

- `npm install`

2. Compile application

- `npm run build`

[Note:] This command will generate an optimized and production-ready version in the `build` folder.

3. Serve the application on a web server.

- `npm install serve`

Navigate to the build folder:

- `serve`

4. Congratulations! The application is now running in production mode.
