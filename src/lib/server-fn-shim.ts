/**
 * Client-side drop-in shim for @tanstack/react-start in pure SPA mode.
 * Executes server functions directly on the client, seamlessly forwarding
 * queries to the Laravel API backend via src/lib/api-client.ts.
 */

export function createServerFn(options?: any) {
  const chain: any = {
    options,
    middleware(_fn: any) {
      return chain;
    },
    inputValidator(_fn: any) {
      return chain;
    },
    validator(_fn: any) {
      return chain;
    },
    handler(fn: any) {
      const callable: any = async (args?: any) => {
        const data =
          args && typeof args === "object" && "data" in args ? args.data : args;
        return await fn({ data });
      };
      callable.options = options;
      return callable;
    },
  };
  return chain;
}

export function useServerFn(fn: any) {
  return fn;
}

export function createMiddleware() {
  const chain: any = {
    middleware(_fn: any) {
      return chain;
    },
    validator(_fn: any) {
      return chain;
    },
    server(_fn: any) {
      return chain;
    },
    client(_fn: any) {
      return chain;
    },
  };
  return chain;
}

export function createStart() {
  return {};
}

export function getRequest() {
  return null;
}

export default {
  createServerFn,
  useServerFn,
  createMiddleware,
  createStart,
  getRequest,
};
