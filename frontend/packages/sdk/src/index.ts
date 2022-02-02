/*
Top level index.js file...

Exports are only hoisted here if they are explicitly imported from another project.
Relative imports/exports should be constrained to the respective src/{folder}/{folder}/index.ts

import { Sample } from "./components/Sample";
export { Sample };
*/
import { Buffer } from 'buffer';
window.Buffer = Buffer;

import { TokenGate } from "./components/TokenGate";
export { TokenGate };
