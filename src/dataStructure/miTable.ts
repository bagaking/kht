export class MiTable<TScope, TKey, TValue> {

    protected maps: Map<TScope, Map<TKey, TValue>> = new Map<TScope, Map<TKey, TValue>>();

    public has(hKey: TScope): boolean {
        return this.maps.has(hKey);
    }

    public get(hKey: TScope): Map<TKey, TValue> | undefined {
        return this.maps.get(hKey);
    }

    public hHas(hKey: TScope, key: TKey): boolean {
        return this.maps.has(hKey) && this.maps.get(hKey)!.has(key);
    }

    public hGet(hKey: TScope, key: TKey): TValue | undefined {
        if (!this.maps.has(hKey)) {
            return undefined;
        }
        return this.maps.get(hKey)!.get(key);
    }

    public hGetValues(hKey: TScope): TValue[] | undefined {
        if (!this.maps.has(hKey)) {
            return undefined;
        }
        const map = this.maps.get(hKey);
        return Array.from(map!.values());
    }

    public hSet(hKey: TScope, key: TKey, value: TValue): this {
        if (this.maps.has(hKey)) {
            this.maps.get(hKey)!.set(key, value);
        } else {
            const scope = new Map<TKey, TValue>();
            scope.set(key, value);
            this.maps.set(hKey, scope);
        }
        return this;
    }

    public hDel(hKey: TScope, key: TKey): boolean {
        if (this.hHas(hKey, key)) {
            return this.maps.get(hKey)!.delete(key);
        }
        return false;
    }

}
