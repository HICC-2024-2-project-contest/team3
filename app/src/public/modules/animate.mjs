'use strict';

/**
 * modules/animate.mjs
 *
 * CSS 대신 JS 로 만든 transform 애니메이션
 * (띠용 하기 위해 사용)
 *
 * @author Wany <sung@wany.io> (https://wany.io)
 */

const animatings = {};

class Animate {
  constructor(element) {
    this.id = Date.now();
    this.element = element;
    this.processor;
    this.linear();
    this.killed = false;
  }

  /**
   * Animate to
   *
   * @param {object} styles Target styles state
   * @param {number} duration Animating time
   * @param {number} after Animating delay
   *
   * @returns Animate
   */
  to(styles = {}, duration = 2000, after = 0) {
    const _this = this;
    const id = this.id;
    const element = this.element;
    const processor = this.processor;

    function animate() {
      if (element.hasAttribute('animate')) {
        const task = animatings[element.getAttribute('animate')];
        if (task) {
          task.kill();
        }
      }

      element.setAttribute('animate', id);
      animatings[id] = _this;

      const start = window.performance.now();

      const from = {};
      const style = window.getComputedStyle(element);
      const types = {};
      const transforms = {};
      const transformsFrom = {};
      for (const key in styles) {
        if (typeof styles[key] == 'number') {
          styles[key] = styles[key] + 'px';
        }

        if (key == 'transform') {
          types[key] = 'transform';
          for (const part of styles.transform.split(' ')) {
            const match = part.match(/(.+)\(([0-9.\-]+(?:.+)?)\)/);
            if (!match) {
              continue;
            }
            const type = match[1];
            const metric = match[2].replace(/[0-9.\-]+/, '');
            const value = parseFloat(match[2].replace(metric, ''));
            transforms[type] = {
              value: value,
              metric: metric,
            };
          }
          for (const part of element.style.transform.split(' ')) {
            const match = part.match(/(.+)\(([0-9.\-]+(?:.+)?)\)/);
            if (!match) {
              continue;
            }
            const type = match[1];
            const metric = match[2].replace(/[0-9.\-]+/, '');
            const value = parseFloat(match[2].replace(metric, ''));
            transformsFrom[type] = {
              value: value,
              metric: metric,
            };
          }
        } else if (styles[key].match(/[0-9.\-]+px/)) {
          types[key] = 'px';
          from[key] = parseFloat(style[key].replace('px', ''), 10);
        } else if (styles[key].match(/[0-9.\-]+rem/)) {
          types[key] = 'rem';
          from[key] = parseFloat(style[key].replace('px', ''), 10);
        } else if (styles[key].match(/[0-9.\-]+%/)) {
          types[key] = '%';
          from[key] = parseFloat(element.style[key].replace('%', '') || 0, 10);
        }
      }

      function update(n) {
        let p = processor(n);

        for (const key in styles) {
          if (types[key] == 'transform') {
            let value = '';
            for (const part in transforms) {
              let from = transformsFrom[part]?.value || 0.0;
              let target = transforms[part].value;
              let move = target - from;
              let step = from + move * p;
              value += `${part}(${step}${transforms[part].metric}) `;
            }
            element.style.transform = value;
          } else if (['px', 'rem'].includes(types[key])) {
            let target;
            if (types[key] == 'px') {
              target = parseFloat(styles[key].replace('px', ''), 10);
            } else if (types[key] == 'rem') {
              target = Animate.#rem(
                parseFloat(styles[key].replace('rem', ''), 10)
              );
            }
            let move = target - from[key];
            let step = from[key] + move * p;
            element.style[key] = step + 'px';
          } else if (types[key] == '%') {
            let target = parseFloat(styles[key].replace('%', ''), 10);
            let move = target - from[key];
            let step = from[key] + move * p;
            element.style[key] = step + '%';
          }
        }
      }

      function frame() {
        if (_this.killed) {
          return;
        }
        const now = window.performance.now();
        const t = (now - start) / duration;
        if (t >= 1) {
          update(1);
          element.removeAttribute('animate');
          delete animatings[id];
          return;
        }
        update(t);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }

    if (after > 0) {
      setTimeout(() => {
        animate();
      }, after);
    } else {
      animate();
    }

    return this;
  }

  kill() {
    this.killed = true;
    this.element.removeAttribute('animate');
    delete animatings[this.id];
  }

  /**
   * Use linear processor
   *
   * @returns Animate
   */
  linear() {
    this.processor = (n) => {
      return n;
    };
    return this;
  }

  /**
   * Use bezier processor
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   *
   * @returns Animate
   */
  bezier(x1 = 0.25, y1 = 0.75, x2 = 0.75, y2 = 0.25) {
    /**
     * @original https://github.com/gre/bezier-easing
     * @author Gaëtan Renaudeau
     * @license MIT https://github.com/gre/bezier-easing/blob/master/LICENSE
     *
     * @param {number} mX1
     * @param {number} mY1
     * @param {number} mX2
     * @param {number} mY2
     * @returns {Function}
     */
    function bezierFactory(mX1, mY1, mX2, mY2) {
      var NEWTON_ITERATIONS = 4;
      var NEWTON_MIN_SLOPE = 0.001;
      var SUBDIVISION_PRECISION = 0.0000001;
      var SUBDIVISION_MAX_ITERATIONS = 10;

      var kSplineTableSize = 11;
      var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

      var float32ArraySupported = typeof Float32Array === 'function';

      function A(aA1, aA2) {
        return 1.0 - 3.0 * aA2 + 3.0 * aA1;
      }
      function B(aA1, aA2) {
        return 3.0 * aA2 - 6.0 * aA1;
      }
      function C(aA1) {
        return 3.0 * aA1;
      }

      // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
      function calcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT;
      }

      // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
      function getSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
      }

      function binarySubdivide(aX, aA, aB, mX1, mX2) {
        var currentX,
          currentT,
          i = 0;
        do {
          currentT = aA + (aB - aA) / 2.0;
          currentX = calcBezier(currentT, mX1, mX2) - aX;
          if (currentX > 0.0) {
            aB = currentT;
          } else {
            aA = currentT;
          }
        } while (
          Math.abs(currentX) > SUBDIVISION_PRECISION &&
          ++i < SUBDIVISION_MAX_ITERATIONS
        );
        return currentT;
      }

      function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
        for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
          var currentSlope = getSlope(aGuessT, mX1, mX2);
          if (currentSlope === 0.0) {
            return aGuessT;
          }
          var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
          aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
      }

      function LinearEasing(x) {
        return x;
      }

      if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
        throw new Error('bezier x values must be in [0, 1] range');
      }

      if (mX1 === mY1 && mX2 === mY2) {
        return LinearEasing;
      }

      // Precompute samples table
      var sampleValues = float32ArraySupported
        ? new Float32Array(kSplineTableSize)
        : new Array(kSplineTableSize);
      for (var i = 0; i < kSplineTableSize; ++i) {
        sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
      }

      function getTForX(aX) {
        var intervalStart = 0.0;
        var currentSample = 1;
        var lastSample = kSplineTableSize - 1;

        for (
          ;
          currentSample !== lastSample && sampleValues[currentSample] <= aX;
          ++currentSample
        ) {
          intervalStart += kSampleStepSize;
        }
        --currentSample;

        // Interpolate to provide an initial guess for t
        var dist =
          (aX - sampleValues[currentSample]) /
          (sampleValues[currentSample + 1] - sampleValues[currentSample]);
        var guessForT = intervalStart + dist * kSampleStepSize;

        var initialSlope = getSlope(guessForT, mX1, mX2);
        if (initialSlope >= NEWTON_MIN_SLOPE) {
          return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
        } else if (initialSlope === 0.0) {
          return guessForT;
        } else {
          return binarySubdivide(
            aX,
            intervalStart,
            intervalStart + kSampleStepSize,
            mX1,
            mX2
          );
        }
      }

      return function BezierEasing(x) {
        // Because JavaScript number are imprecise, we should guarantee the extremes are right.
        if (x === 0 || x === 1) {
          return x;
        }
        return calcBezier(getTForX(x), mY1, mY2);
      };
    }

    this.processor = bezierFactory(x1, y1, x2, y2);

    return this;
  }

  /**
   * Use spring processor
   *
   * @param {number} elastic
   * @param {number} frequency
   *
   * @returns Animate
   */
  spring(elastic = 0.5, frequency = 15) {
    /**
     * @original https://medium.com/hackernoon/the-spring-factory-4c3d988e7129
     * @author William Silversmith
     */
    function springFactory(args) {
      args = args || {};
      let zeta = args.damping;
      let k = args.halfcycles;
      let y0 = nvl(args.initial_position, 1);
      let v0 = args.initial_velocity || 0;
      let A = y0;
      let B, omega;

      if (Math.abs(v0) < 1e-6) {
        B = (zeta * y0) / Math.sqrt(1 - zeta * zeta);
        omega = computeOmega(A, B, k, zeta);
        //console.log(A, B, Math.atan(A / B), Math.atan2(A, B));
      } else {
        let result = numericallySolveOmegaAndB({
          zeta: zeta,
          k: k,
          y0: y0,
          v0: v0,
        });

        B = result.B;
        omega = result.omega;
      }

      omega *= 2 * Math.PI;
      let omega_d = omega * Math.sqrt(1 - zeta * zeta);

      function nvl(x, ifnull) {
        return x === undefined || x === null ? ifnull : x;
      }

      function computeOmega(A, B, k, zeta) {
        A * B < 0 && k >= 1 ? k-- : null;
        return (
          (-Math.atan(A / B) + Math.PI * k) /
          (2 * Math.PI * Math.sqrt(1 - zeta * zeta))
        );
      }

      function numericallySolveOmegaAndB(args) {
        args = args || {};

        let zeta = args.zeta;
        let kk = args.k;
        let y0 = nvl(args.y0, 1);
        let v0 = args.v0 || 0;

        function errorfn(B, omega) {
          let omega_d = omega * Math.sqrt(1 - zeta * zeta);
          return B - (zeta * omega * y0 + v0) / omega_d;
        }

        let A = y0;
        let B = zeta; // initial guess that's pretty close

        let omega, error, direction;

        function step() {
          omega = computeOmega(A, B, kk, zeta);
          error = errorfn(B, omega);
          direction = -Math.sign(error);
        }

        step();

        let tolerence = 1e-6;
        let lower, upper;

        let ct = 0;
        let maxct = 1e3;

        if (direction > 0) {
          while (direction > 0) {
            ct++;
            if (ct > maxct) {
              break;
            }
            lower = B;
            B *= 2;
            step();
          }
          upper = B;
        } else {
          upper = B;
          B *= -1;
          while (direction < 0) {
            ct++;
            if (ct > maxct) {
              break;
            }
            lower = B;
            B *= 2;
            step();
          }
          lower = B;
        }

        while (Math.abs(error) > tolerence) {
          ct++;
          if (ct > maxct) {
            break;
          }
          B = (upper + lower) / 2;
          step();
          if (direction > 0) {
            lower = B;
          } else {
            upper = B;
          }
        }

        return {
          omega: omega,
          B: B,
        };
      }

      return (t) => {
        let sinusoid = A * Math.cos(omega_d * t) + B * Math.sin(omega_d * t);
        return -(Math.exp(-t * zeta * omega) * sinusoid) + 1;
      };
    }

    this.processor = springFactory({
      damping: 1 - elastic,
      halfcycles: frequency,
      initial_position: 1,
      initial_velocity: 0,
    });

    return this;
  }

  /**
   * Use bezier processor like CSS ease
   *
   * @returns Animate
   */
  ease() {
    this.bezier(0.25, 0.1, 0.25, 1);
    return this;
  }

  /**
   * Use bezier processor like CSS ease-in
   *
   * @returns Animate
   */
  easein() {
    this.bezier(0.42, 0, 1, 1);
    return this;
  }

  /**
   * Use bezier processor like CSS ease-out
   *
   * @returns Animate
   */
  easeout() {
    this.bezier(0, 0, 0.58, 1);
    return this;
  }

  /**
   * Use bezier processor like CSS ease-in-out
   *
   * @returns Animate
   */
  easeinout() {
    this.bezier(0.42, 0, 0.58, 1);
    return this;
  }

  static #rem(n = 1) {
    return n * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }
}

window.HTMLElement.prototype.Animate = function () {
  return new Animate(this);
};

export default Animate;
