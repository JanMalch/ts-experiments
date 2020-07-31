import { Reducer, VIAFn } from '@ts-experiments/types/functions';

export function partition<T>(
  indexProducer: VIAFn<T, number>
): Reducer<T[][], T> {
  return (partitions: T[][], item: T, index: number, array: T[]) => {
    const partitionIndex = indexProducer(item, index, array);
    if (partitions[partitionIndex] == null) {
      partitions[partitionIndex] = [item];
    } else {
      partitions[partitionIndex].push(item);
    }
    return partitions;
  };
}

partition.evenly = function <T>(
  columnCount: number,
  fillOrder: 'intermittent' | 'continuous' = 'continuous'
) {
  if (fillOrder === 'continuous') {
    return partition<T>((_, index, array) =>
      Math.floor(index / Math.ceil(array.length / columnCount))
    );
  } else {
    return partition<T>((_, index) => index % columnCount);
  }
};
