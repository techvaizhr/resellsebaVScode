export function bridgeWorkerEnv(_env: unknown): void {}

export function getRuntimeEnv(name: string): string | undefined {
  return (globalThis as any).process?.env?.[name];
}

