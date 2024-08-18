[![npm version](https://img.shields.io/npm/v/precise-colors?logo=npm&labelColor=black&color=07293F)](https://npmjs.com/package/precise-colors)

# precise-colors

This library converts colors between various models without performing any rounding.

The idea is that if a non-trivial conversion is needed, you would perform a sequence of conversions and apply rounding only at the very end, minimizing mathematical errors along the way.