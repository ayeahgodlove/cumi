/**
 * Polyfills for older browser support
 * Ensures app works on browsers that don't support modern features
 */

// Object.fromEntries polyfill (for Safari < 12.1, Edge < 79)
if (!Object.fromEntries) {
  Object.fromEntries = function (entries: any) {
    if (!entries || !entries[Symbol.iterator]) {
      throw new Error('Object.fromEntries() requires an iterable argument');
    }

    const obj: any = {};
    for (const [key, value] of entries) {
      obj[key] = value;
    }
    return obj;
  };
}

// String.prototype.replaceAll polyfill (for Safari < 13.1, Edge < 85)
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (search: string | RegExp, replacement: string | ((substring: string, ...args: any[]) => string)): string {
    if (typeof search === 'string') {
      return this.split(search).join(replacement as string);
    }
    return this.replace(search, replacement as any);
  };
}

// Promise.allSettled polyfill (for Safari < 13, Edge < 85)
if (!Promise.allSettled) {
  Promise.allSettled = function (promises: Promise<any>[]): Promise<any[]> {
    return Promise.all(
      promises.map((promise) =>
        Promise.resolve(promise)
          .then((value) => ({ status: 'fulfilled', value }))
          .catch((reason) => ({ status: 'rejected', reason }))
      )
    );
  };
}

// Array.prototype.at polyfill (for Safari < 15.4, Edge < 92)
if (!Array.prototype.at) {
  Array.prototype.at = function (index: number) {
    const len = this.length;
    const relativeIndex = index >= 0 ? index : len + index;
    if (relativeIndex < 0 || relativeIndex >= len) {
      return undefined;
    }
    return this[relativeIndex];
  };
}

// IntersectionObserver polyfill check (for older browsers)
if (typeof window !== 'undefined' && !('IntersectionObserver' in window)) {
  console.warn('IntersectionObserver not supported. Some animations may not work.');
}

// ResizeObserver polyfill check (for older browsers)
if (typeof window !== 'undefined' && !('ResizeObserver' in window)) {
  console.warn('ResizeObserver not supported. Some responsive features may be limited.');
}

// Smooth scroll polyfill for older browsers
if (typeof window !== 'undefined' && !('scrollBehavior' in document.documentElement.style)) {
  // Add fallback for smooth scrolling
  const originalScrollTo = window.scrollTo;
  window.scrollTo = function (options: any) {
    if (typeof options === 'object' && options.behavior === 'smooth') {
      // Fallback to instant scroll
      originalScrollTo.call(window, options.left || 0, options.top || 0);
    } else {
      originalScrollTo.apply(window, arguments as any);
    }
  };
}

// CSS.supports polyfill (for very old browsers)
if (typeof CSS !== 'undefined' && !CSS.supports) {
  (CSS as any).supports = function () {
    return false;
  };
}

// requestIdleCallback polyfill (for Safari < 16.4)
if (typeof window !== 'undefined' && !window.requestIdleCallback) {
  (window as any).requestIdleCallback = function (callback: any) {
    const start = Date.now();
    return setTimeout(function () {
      callback({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        },
      });
    }, 1);
  };

  (window as any).cancelIdleCallback = function (id: number) {
    clearTimeout(id);
  };
}

// Export empty object to make this a module
export {};

