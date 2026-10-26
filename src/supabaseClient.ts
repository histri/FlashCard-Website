// Local stand-in for the Supabase client.
// Data is kept in memory and saved to the browser's localStorage after every write,
// so it survives page refreshes. It does NOT sync between browsers or laptops.

type Row = Record<string, any>;
type Result = { data: Row[] | null; error: null };

const STORAGE_KEY = "flashcard-app-db";

let tables: Record<string, Row[]> = {};
let nextId = 1;

// Load saved data on startup (if any)
function loadFromStorage(): void {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const saved = JSON.parse(raw);
            tables = saved.tables ?? {};
            nextId = saved.nextId ?? 1;
        }
    } catch (e) {
        console.error("Could not load saved data, starting empty:", e);
        tables = {};
        nextId = 1;
    }
}

// Save everything after each insert / update / delete
function saveToStorage(): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ tables, nextId }));
    } catch (e) {
        console.error("Could not save data:", e);
    }
}

loadFromStorage();

class FakeQuery implements PromiseLike<Result> {
    #table: string;
    #op: "select" | "insert" | "update" | "delete" = "select";
    #payload: any;
    #filters: Array<[string, unknown]> = [];

    constructor(table: string) {
        this.#table = table;
        tables[table] ??= [];
    }

    select(_columns?: string) { return this; }
    insert(rows: Row[]) { this.#op = "insert"; this.#payload = rows; return this; }
    update(values: Row) { this.#op = "update"; this.#payload = values; return this; }
    delete() { this.#op = "delete"; return this; }
    eq(column: string, value: unknown) { this.#filters.push([column, value]); return this; }

    #run(): Result {
        const rows = tables[this.#table];
        // profiles uses user_id as its key, the other tables use id
        const idCol = this.#table === "profiles" ? "user_id" : "id";
        const matches = (r: Row) => this.#filters.every(([c, v]) => r[c] === v);

        switch (this.#op) {
            case "insert": {
                const inserted = this.#payload.map((r: Row) => ({ ...r, [idCol]: nextId++ }));
                rows.push(...inserted);
                saveToStorage();
                return { data: inserted, error: null };
            }
            case "update": {
                const hit = rows.filter(matches);
                hit.forEach((r) => Object.assign(r, this.#payload));
                saveToStorage();
                return { data: hit, error: null };
            }
            case "delete": {
                tables[this.#table] = rows.filter((r) => !matches(r));
                saveToStorage();
                return { data: [], error: null };
            }
            default:
                return { data: rows.filter(matches), error: null };
        }
    }

    // makes `await query` work, like the real Supabase builder
    then<A = Result, B = never>(
        onFulfilled?: ((value: Result) => A | PromiseLike<A>) | null,
        onRejected?: ((reason: any) => B | PromiseLike<B>) | null
    ): Promise<A | B> {
        return Promise.resolve(this.#run()).then(onFulfilled, onRejected);
    }
}

export const supabase = {
    from: (table: string) => new FakeQuery(table),
};

// Handy for testing: call resetLocalDb() from the browser console or a button
// to wipe all saved data and start fresh.
export function resetLocalDb(): void {
    tables = {};
    nextId = 1;
    localStorage.removeItem(STORAGE_KEY);
}