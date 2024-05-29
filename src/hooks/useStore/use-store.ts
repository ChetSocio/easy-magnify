export type StoreListener<TState> = (arg: { state: TState; updatedProperties: Partial<TState> }) => void

export default function createStore<TState>(initialState: TState) {
    const listeners = new Set<StoreListener<TState>>()
    let batching = false
    let state: TState = initialState
    let updatedProperties: Partial<TState> | undefined

    const setState = (extraState: Partial<TState> = {}) => {
        updatedProperties = { ...updatedProperties, ...extraState }
        flush()
    }

    const flush = () => {
        if (batching) return

        let hasChanged = false

        if (updatedProperties) {
            for (const key in updatedProperties) {
                if (state[key] !== updatedProperties[key]) {
                    hasChanged = true
                    break
                }
            }
        }

        if (!hasChanged) {
            return
        }

        state = { ...state, ...updatedProperties }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listeners.forEach((listener) => listener({ state, updatedProperties } as any))
        updatedProperties = undefined
    }

    const batch = (cb: () => void) => {
        batching = true
        cb()
        batching = false
        flush()
    }

    const subscribe = (listener: StoreListener<TState>) => {
        listeners.add(listener)
        return () => {
            listeners.delete(listener)
        }
    }

    const cleanup = () => listeners.clear()

    const getState = () => state

    return {
        subscribe,
        cleanup,
        getState,
        setState,
        batch,
    }
}