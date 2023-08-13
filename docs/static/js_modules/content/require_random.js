class Random {
  range(min, max) {
    if (min < max) {
      let no = Math.random() * (max -  min);
      return (min + no);
    }
    return undefined;
  }
  rangeFloor(min, max=0){
    if (max === 0) {
      [min, max] = [max, min];
    }
    return Math.floor(this.range(min, max));
  }
}
export var random = new Random;

const EPSILON = Number.EPSILON;
class MathMath {
  mapRange (value, inputMin, inputMax, outputMin, outputMax, clamp) {
    // Reference:
    // https://openframeworks.cc/documentation/math/ofMath/
    if (Math.abs(inputMin - inputMax) < EPSILON) {
      return outputMin;
    } else {
      var outVal = ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin);
      if (clamp) {
        if (outputMax < outputMin) {
          if (outVal < outputMax) outVal = outputMax;
          else if (outVal > outputMin) outVal = outputMin;
        } else {
          if (outVal > outputMax) outVal = outputMax;
          else if (outVal < outputMin) outVal = outputMin;
        }
      }
      return outVal;
    }
  }  
}
export var math = new MathMath;
