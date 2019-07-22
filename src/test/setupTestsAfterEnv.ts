// The following imports can only be loaded after Jest has been installed
// in the environment, otherwise you will see errors like this:
// "ReferenceError: expect is not defined". For more information see
// https://jestjs.io/docs/en/configuration#setupfilesafterenv-array

// react-testing-library renders components to the document's body.
// Importing cleanup-after-each will ensure they're removed after each test.
import '@testing-library/react/cleanup-after-each';

// Add jest-dom's custom assertions
import '@testing-library/jest-dom/extend-expect';
