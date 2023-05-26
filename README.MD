# Custom Range Slider Component

A custom range slider component built.

- **React**: [React](https://reactjs.org/)
- **TypeScript**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Jest](https://jestjs.io/)

## Table of Contents

- [Introduction](#introduction)
- [Dependencies](#dependencies)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)

## Introduction

The Custom Range Slider Component is a React-based slider component with to fuction mode that allows users to select a value within a specified ranges. It provides a visually appealing and interactive slider interface.

## Dependencies

The project has the following dependencies:

- `@babel/core` (version 7.21.8)
- `@babel/preset-env` (version 7.21.5)
- `@babel/preset-react` (version 7.18.6)
- `babel-loader` (version 9.1.2)
- `css-loader` (version 6.7.4)
- `html-webpack-plugin` (version 5.5.1)
- `react-router-dom` (version 6.11.2)
- `style-loader` (version 3.3.3)
- `webpack` (version 5.84.0)
- `webpack-cli` (version 5.1.1)
- `webpack-dev-server` (version 4.15.0)

Note: These dependencies are listed in the project's `devDependencies` section of the `package.json` file.

## Installation

To install the Custom Range Slider Component, follow these steps:

1. Clone the repository: git clone https://github.com/VillaOsiris/mango.git

2. Navigate to the project directory: cd mango

3. Install the dependencies: npm install

## Usage

To use the Custom Range Slider Component in your project, follow these steps:

1. Import the `Range` component into your React application:

- import Range from 'path/to/Range';

2. Use the Range component in your JSX:

- <Range min={0} max={100} value={50} onChange={handleChange} />
  // Replace the min, max, value, and onChange props with your desired values.

3. Style the slider using CSS. You can customize the appearance by modifying the CSS classes provided by the component.

## Development

- sripts: npm start
