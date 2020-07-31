# Collection operations as reducers

<!-- SUMMARY:START -->

These files contain function that are used as the first argument for [`Array#reduce`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

<!-- SUMMARY:END -->

```typescript
const [even, odd] = [1, 2, 3, 4, 5].reduce(
  partition((x) => x % 2),
  []
);
expect(even).toEqual([2, 4]);
expect(odd).toEqual([1, 3, 5]);
```

## Contents

<!-- TOC:START -->
### [arrays](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/arrays.ts)



[![1 export](https://img.shields.io/badge/exports-1-blue)](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/arrays.ts)

### [dicts](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/dicts.ts)



[![3 exports](https://img.shields.io/badge/exports-3-blue)](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/dicts.ts)

### [other](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/other.ts)



[![3 exports](https://img.shields.io/badge/exports-3-blue)](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/other.ts)

### [util](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/util.ts)



[![1 export](https://img.shields.io/badge/exports-1-blue)](https://github.com/JanMalch/ts-experiments/blob/master/src/collections/operations/reducers/util.ts)
<!-- TOC:END -->
