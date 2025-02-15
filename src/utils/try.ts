type TryFn<T> = () => T

export function Try<T>(fn: TryFn<T>) {
  try {
    return {
      value: fn(),
      error: undefined,
    }
  }
  catch (error) {
    return {
      value: '',
      error,
    }
  }
}
