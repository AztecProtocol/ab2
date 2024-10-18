export const getTransforms = (isLeftSide: boolean, index: number) => {
  if (isLeftSide) {
    if (index % 2 === 1) {
      return {
        translateZ: `${String(3 * index)}px`,
        rotateY: '-180deg',
        scaleX: 1,
        translateX: '0%',
      };
    }
    return {
      translateZ: `${String(3 * index)}px`,
      rotateY: '180deg',
      scaleX: -1,
      translateX: '-100%',
    };
  }

  if (index % 2 === 1) {
    return {
      translateZ: `${String(-3 * index)}px`,
      rotateY: '0deg',
      scaleX: 1,
      translateX: '0%',
    };
  }
  return {
    translateZ: `${String(-3 * index)}px`,
    rotateY: '0deg',
    scaleX: -1,
    translateX: '-100%',
  };
};
