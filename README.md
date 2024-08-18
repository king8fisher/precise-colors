[![npm version](https://img.shields.io/badge/npm-precise--colors-blue?style=flat)](https://www.npmjs.com/package/precise-colors)

# precise-colors

This library converts colors between various models without performing any rounding.

The idea is that if a non-trivial conversion is needed, you would perform a sequence of conversions and apply rounding only at the very end, minimizing mathematical errors along the way.