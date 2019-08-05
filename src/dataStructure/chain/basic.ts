
export class Node {
    public next: Node | null = null;
    public prev: Node | null = null;
}

export class Chain {

    public head: Node | null = null;
    public tail: Node | null = null;

    public length: number = 0;

    protected remove(node: Node): Node {
        const {prev, next} = node;
        if (prev) {
            prev.next = next;
        } else if (this.head === node) {
            this.head = next;
        } else {
            throw new Error(`the node to remove is not in the list.`);
        }

        if (next) {
            next.prev = prev;
        } else if (this.tail === node) {
            this.tail = prev;
        } else {
            throw new Error(`the node to remove is not in the list.`);
        }
        node.prev = node.next = null;
        this.length -= 1;
        return node;
    }

    protected append(node: Node): Node {
        if (node.prev || node.next) {
            throw new Error(`the node is already in the list.`);
        }

        if (this.tail) {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        } else {
            this.head = this.tail = node;
        }
        this.length += 1;
        return node;
    }
}
